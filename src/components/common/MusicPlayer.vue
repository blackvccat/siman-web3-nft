<template>
  <div class="music-player" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <!-- 音乐开关按钮 -->
    <button 
      @click="toggleMusic" 
      class="music-toggle-btn"
      :class="{ 'enabled': appStore.isMusicEnabled, 'playing': appStore.isMusicPlaying }"
      :title="appStore.isMusicEnabled ? '关闭音乐' : '开启音乐'"
    >
      <div class="music-icon">
        <svg v-if="!appStore.isMusicEnabled" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="2"/>
          <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
          <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
        <svg v-else-if="!appStore.isMusicPlaying" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="2"/>
          <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
          <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
          <line x1="9" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="2"/>
          <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
          <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
          <polygon points="9,9 9,15 13,12" fill="currentColor"/>
        </svg>
      </div>
      
      <!-- 播放状态指示器 -->
      <div v-if="appStore.isMusicEnabled && appStore.isMusicPlaying" class="playing-indicator">
        <div class="wave-bars">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </button>

    <!-- 音乐控制面板（悬停时显示） -->
    <div v-if="appStore.isMusicEnabled" class="music-controls" :class="{ 'visible': showControls }">
      <!-- 播放/暂停按钮 -->
      <button 
        @click="togglePlayback" 
        class="play-pause-btn"
        :title="appStore.isMusicPlaying ? '暂停' : '播放'"
      >
        <svg v-if="!appStore.isMusicPlaying" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <polygon points="5,3 19,12 5,21" fill="currentColor"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
          <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
        </svg>
      </button>

      <!-- 音量控制 -->
      <div class="volume-control">
        <button 
          @click="toggleMute" 
          class="volume-btn"
          :title="isMuted ? '取消静音' : '静音'"
        >
          <svg v-if="isMuted" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke="currentColor" stroke-width="2"/>
            <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2"/>
            <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke="currentColor" stroke-width="2"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          :value="appStore.musicVolume"
          @input="updateVolume"
          class="volume-slider"
        />
      </div>

      <!-- 当前曲目指示器 -->
      <div class="track-indicator">
        <span class="track-name">{{ getCurrentTrackName() }}</span>
        <button 
          @click="clearCache" 
          class="cache-clear-btn"
          title="清理缓存"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- 隐藏的音频元素 -->
    <audio 
      ref="audioElement"
      :src="getCurrentTrackSrc()"
      loop
      preload="auto"
      @loadeddata="onAudioLoaded"
      @play="onAudioPlay"
      @pause="onAudioPause"
      @ended="onAudioEnded"
      @canplaythrough="onAudioCanPlay"
      @error="onAudioError"
      @loadstart="onAudioLoadStart"
    />
  </div>
</template>

<script setup>
/**
 * 音乐播放器组件
 * 功能: 提供音乐播放控制，包括开关、播放/暂停、音量调节
 * 特色: 根据主题自动切换音乐，支持本地存储设置
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { clearCache as clearAppCache, forceRefresh } from '@/utils/version'
import { getSafeMusicPath } from '@/utils/musicPathFix'

const appStore = useAppStore()
const audioElement = ref(null)
const isMuted = ref(false)
const hasAutoPlayed = ref(false)
const showControls = ref(false)
const controlsTimeout = ref(null)
const isAutoPlaying = ref(false)

// 计算属性 - 当前曲目名称
const getCurrentTrackName = () => {
  if (!appStore.isMusicEnabled) return ''
  return appStore.currentMusicTrack === 'day' ? '白天主题音乐' : '夜晚主题音乐'
}

// 计算属性 - 当前曲目源
const getCurrentTrackSrc = () => {
  // 始终返回当前应该播放的曲目源，不管音乐是否启用
  const trackName = appStore.currentMusicTrack === 'day' 
    ? 'day-theme.mp3'
    : 'night-theme.mp3'
  
  const path = `/music/${trackName}`
  
  console.log('获取曲目源:', {
    track: appStore.currentMusicTrack,
    trackName,
    path,
    isDarkMode: appStore.isDarkMode,
    isMusicEnabled: appStore.isMusicEnabled
  })
  
  return path
}

// 方法 - 切换音乐开关
const toggleMusic = () => {
  console.log('切换音乐开关:', {
    wasEnabled: appStore.isMusicEnabled,
    currentTrack: appStore.currentMusicTrack
  })
  
  appStore.toggleMusic()
  
  // 如果启用音乐，开始直接播放
  if (appStore.isMusicEnabled && audioElement.value) {
    console.log('音乐已启用，开始播放')
    
    // 确保音频元素有正确的源
    const trackName = appStore.currentMusicTrack === 'day' 
      ? 'day-theme.mp3'
      : 'night-theme.mp3'
    audioElement.value.src = `/music/${trackName}`
    
    // 重新加载音频
    audioElement.value.load()
    
    // 延迟播放，确保音频加载完成
    setTimeout(() => {
      startDirectPlay()
    }, 200)
  } else if (!appStore.isMusicEnabled && audioElement.value) {
    console.log('音乐已禁用，停止播放')
    audioElement.value.pause()
    appStore.isMusicPlaying = false
  }
}

// 方法 - 切换播放/暂停
const togglePlayback = () => {
  if (!appStore.isMusicEnabled) return
  
  appStore.toggleMusicPlayback()
  
  // 手动操作时，直接设置音量，不使用淡入效果
  if (audioElement.value && appStore.isMusicPlaying) {
    audioElement.value.volume = appStore.musicVolume
  }
}

// 方法 - 更新音量
const updateVolume = (event) => {
  const volume = parseFloat(event.target.value)
  appStore.setMusicVolume(volume)
  if (audioElement.value) {
    audioElement.value.volume = volume
  }
}

// 方法 - 切换静音
const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (audioElement.value) {
    audioElement.value.muted = isMuted.value
  }
}

// 方法 - 鼠标悬停时展开控制面板
const onMouseEnter = () => {
  if (appStore.isMusicEnabled) {
    showControls.value = true
    clearTimeout(controlsTimeout.value)
  }
}

// 方法 - 处理主题切换时的曲目变化
const handleTrackChange = (event) => {
  const { newTrack, wasPlaying, preservePlayState } = event.detail
  
  console.log('处理曲目切换:', { newTrack, wasPlaying, preservePlayState })
  
  if (!audioElement.value) return
  
  // 重新加载音频
  audioElement.value.load()
  
  if (wasPlaying && appStore.isMusicEnabled) {
    // 重置自动播放状态
    hasAutoPlayed.value = false
    
    // 延迟播放，确保音频加载完成
    setTimeout(() => {
      audioElement.value.volume = appStore.musicVolume
      audioElement.value.play().then(() => {
        console.log('主题切换后音乐播放成功')
        appStore.isMusicPlaying = true
        
        // 如果设置了保持播放状态，确保状态同步
        if (preservePlayState) {
          console.log('保持播放状态同步')
        }
      }).catch(error => {
        console.warn('主题切换后音乐播放失败:', error)
        // 播放失败时重置状态
        appStore.isMusicPlaying = false
      })
    }, 200)
  }
}

// 方法 - 显示用户友好的错误提示
const showUserFriendlyError = (message) => {
  // 移除现有的错误提示
  hideUserFriendlyError()
  
  // 创建错误提示元素
  const errorDiv = document.createElement('div')
  errorDiv.id = 'music-error-toast'
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    max-width: 300px;
    animation: slideInRight 0.3s ease;
  `
  
  errorDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>🎵</span>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        margin-left: auto;
      ">×</button>
    </div>
  `
  
  // 添加动画样式
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `
  document.head.appendChild(style)
  
  document.body.appendChild(errorDiv)
  
  // 3秒后自动隐藏
  setTimeout(() => {
    hideUserFriendlyError()
  }, 3000)
}

// 方法 - 显示成功提示
const showSuccessToast = (message) => {
  // 移除现有的成功提示
  hideSuccessToast()
  
  // 创建成功提示元素
  const successDiv = document.createElement('div')
  successDiv.id = 'music-success-toast'
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4ecdc4, #44a08d);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    max-width: 300px;
    animation: slideInRight 0.3s ease;
  `
  
  successDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>🎵</span>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        margin-left: auto;
      ">×</button>
    </div>
  `
  
  document.body.appendChild(successDiv)
  
  // 2秒后自动隐藏
  setTimeout(() => {
    hideSuccessToast()
  }, 2000)
}

// 方法 - 隐藏成功提示
const hideSuccessToast = () => {
  const existingSuccess = document.getElementById('music-success-toast')
  if (existingSuccess) {
    existingSuccess.remove()
  }
}

// 方法 - 隐藏用户友好的错误提示
const hideUserFriendlyError = () => {
  const existingError = document.getElementById('music-error-toast')
  if (existingError) {
    existingError.remove()
  }
}

// 方法 - 清理缓存
const clearCache = () => {
  if (confirm('确定要清理缓存并刷新页面吗？这将重置所有设置。')) {
    clearAppCache()
    forceRefresh()
  }
}

// 方法 - 鼠标离开时延迟收起控制面板
const onMouseLeave = () => {
  if (appStore.isMusicEnabled) {
    clearTimeout(controlsTimeout.value)
    controlsTimeout.value = setTimeout(() => {
      showControls.value = false
    }, 1000) // 1秒后收起
  }
}

// 音频事件处理
const onAudioLoaded = () => {
  if (audioElement.value) {
    audioElement.value.volume = appStore.musicVolume // 直接设置目标音量
  }
}

const onAudioCanPlay = () => {
  console.log('音频可以播放')
}

const onAudioPlay = () => {
  console.log('音频开始播放')
  appStore.isMusicPlaying = true
  
  // 显示成功提示
  showSuccessToast('音乐播放成功')
}

const onAudioPause = () => {
  console.log('音频暂停')
  appStore.isMusicPlaying = false
}

const onAudioEnded = () => {
  console.log('音频播放结束')
  // 循环播放，不需要特殊处理
}

const onAudioError = (event) => {
  console.error('音频加载/播放错误:', event)
  console.error('错误详情:', {
    error: audioElement.value?.error,
    src: audioElement.value?.src,
    readyState: audioElement.value?.readyState
  })
  
  // 显示用户友好的错误提示
  showUserFriendlyError('音乐加载失败，正在尝试修复...')
  
  // 如果是夜晚模式音乐出错，尝试使用备用路径
  if (appStore.currentMusicTrack === 'night') {
    console.log('夜晚模式音乐出错，尝试备用路径...')
    
    // 尝试使用不同的路径
    const backupPaths = [
      '/music/night-theme.mp3',
      '/music/day-theme.mp3' // 最后的备用方案
    ]
    
    let currentIndex = 0
    const tryNextPath = () => {
      if (currentIndex < backupPaths.length) {
        const backupPath = backupPaths[currentIndex]
        console.log(`尝试备用路径 ${currentIndex + 1}:`, backupPath)
        
        audioElement.value.src = backupPath
        audioElement.value.load()
        
        currentIndex++
        
        // 监听加载结果
        audioElement.value.addEventListener('canplaythrough', () => {
          console.log('✅ 备用路径加载成功')
          hideUserFriendlyError()
          if (appStore.isMusicPlaying) {
            audioElement.value.play()
          }
        }, { once: true })
        
        audioElement.value.addEventListener('error', () => {
          console.log('❌ 备用路径加载失败，尝试下一个')
          setTimeout(tryNextPath, 500)
        }, { once: true })
      } else {
        console.log('❌ 所有备用路径都失败')
        showUserFriendlyError('音乐播放遇到问题，请刷新页面重试')
      }
    }
    
    setTimeout(tryNextPath, 1000)
  }
}

const onAudioLoadStart = () => {
  console.log('开始加载音频:', audioElement.value?.src)
}

// 直接播放效果
const startDirectPlay = () => {
  if (!audioElement.value) {
    console.error('音频元素不存在')
    return
  }
  
  console.log('开始直接播放:', {
    src: audioElement.value.src,
    readyState: audioElement.value.readyState,
    volume: appStore.musicVolume
  })
  
  // 直接设置目标音量
  audioElement.value.volume = appStore.musicVolume
  
  // 开始播放
  audioElement.value.play().then(() => {
    console.log('✅ 音频播放成功')
    appStore.isMusicPlaying = true
  }).catch(error => {
    console.error('❌ 音频播放失败:', error)
    console.error('错误详情:', {
      name: error.name,
      message: error.message,
      src: audioElement.value.src,
      readyState: audioElement.value.readyState
    })
    
    // 显示用户友好的错误提示
    showUserFriendlyError('音乐播放失败，请检查浏览器设置')
  })
}


// 监听音乐状态变化
watch(() => appStore.isMusicEnabled, (enabled) => {
  if (!audioElement.value) return
  
  if (enabled) {
    // 启用音乐时，根据当前主题选择音乐
    const track = appStore.isDarkMode ? 'night' : 'day'
    appStore.currentMusicTrack = track
  } else {
    // 禁用音乐时停止播放
    audioElement.value.pause()
    appStore.isMusicPlaying = false
  }
})

watch(() => appStore.isMusicPlaying, (playing) => {
  if (!audioElement.value) return
  
  if (playing && appStore.isMusicEnabled) {
    // 手动播放，直接设置音量
    audioElement.value.volume = appStore.musicVolume
    audioElement.value.play().catch(error => {
      console.warn('音频播放失败:', error)
      appStore.isMusicPlaying = false
    })
  } else {
    audioElement.value.pause()
  }
})

watch(() => appStore.currentMusicTrack, (newTrack, oldTrack) => {
  if (!audioElement.value || newTrack === oldTrack) return
  
  console.log('曲目切换:', { oldTrack, newTrack })
  
  // 切换曲目时重新加载音频
  audioElement.value.load()
  if (appStore.isMusicPlaying && appStore.isMusicEnabled) {
    // 延迟播放，确保音频加载完成
    setTimeout(() => {
      startDirectPlay()
    }, 100)
  }
})

watch(() => appStore.musicVolume, (volume) => {
  if (audioElement.value) {
    audioElement.value.volume = volume
  }
})

// 组件挂载时初始化
onMounted(() => {
  if (audioElement.value) {
    // 设置初始音量
    audioElement.value.volume = appStore.musicVolume
    
    // 确保音频元素有正确的源
    const trackName = appStore.currentMusicTrack === 'day' 
      ? 'day-theme.mp3'
      : 'night-theme.mp3'
    audioElement.value.src = `/music/${trackName}`
    
    console.log('全局音乐播放器初始化:', {
      isMusicEnabled: appStore.isMusicEnabled,
      isMusicPlaying: appStore.isMusicPlaying,
      autoPlayMusic: appStore.autoPlayMusic,
      audioSrc: audioElement.value.src,
      readyState: audioElement.value.readyState
    })
    
    // 监听主题切换事件
    window.addEventListener('musicTrackChanged', handleTrackChange)
    
    // 如果音乐已启用且应该播放，直接开始播放
    if (appStore.isMusicEnabled && appStore.isMusicPlaying) {
      console.log('恢复音乐播放状态')
      setTimeout(() => {
        startDirectPlay()
      }, 500)
    } else if (appStore.isMusicEnabled && !appStore.isMusicPlaying) {
      console.log('音乐已启用但未播放，准备就绪')
      // 确保音频元素准备就绪
      audioElement.value.load()
    }
  }
})

// 组件卸载时清理
onUnmounted(() => {
  // 注意：不要在这里暂停音乐，因为这是全局音乐播放器
  // 音乐应该在页面切换时继续播放
  console.log('全局音乐播放器卸载，但音乐继续播放')
  
  clearTimeout(controlsTimeout.value)
  
  // 移除事件监听器
  window.removeEventListener('musicTrackChanged', handleTrackChange)
})
</script>

<style scoped lang="scss">
.music-player {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-neon);
  border-radius: 25px;
  padding: 8px 12px;
  box-shadow: var(--shadow-custom), var(--shadow-neon-blue);
  transition: all 0.3s ease;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 123, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: var(--shadow-neon-blue), var(--shadow-lg);

    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    padding: 6px 10px;
    border-radius: 20px;
  }
}

.music-toggle-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }

  &.enabled {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  &.playing {
    animation: pulse 2s infinite;
  }

  .music-icon {
    transition: transform 0.3s ease;
  }

  &:hover .music-icon {
    transform: rotate(180deg);
  }
}

.playing-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
}

.wave-bars {
  display: flex;
  align-items: center;
  gap: 1px;
  
  span {
    width: 2px;
    height: 8px;
    background: white;
    border-radius: 1px;
    animation: wave 1.5s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

.music-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-primary);
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(20px);
  position: absolute;
  right: 0;
  top: 50px;
  z-index: 1005;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  
  &.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.play-pause-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(253, 67, 62, 0.3);
  }
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-tertiary);
    transform: scale(1.1);
  }
}

.volume-slider {
  width: 60px;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  appearance: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: var(--primary-color);
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  &:hover::-webkit-slider-thumb {
    transform: scale(1.2);
    box-shadow: 0 2px 8px rgba(253, 67, 62, 0.3);
  }

  &:hover::-moz-range-thumb {
    transform: scale(1.2);
    box-shadow: 0 2px 8px rgba(253, 67, 62, 0.3);
  }
}

.track-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.cache-clear-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #ff4757;
    color: white;
    transform: scale(1.1);
  }
}

.track-name {
  white-space: nowrap;
  font-weight: 500;
}


@keyframes wave {
  0%, 100% { height: 8px; }
  50% { height: 16px; }
}

@keyframes pulse {
  0%, 100% { 
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  50% { 
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
  }
}


/* 暗黑模式样式 */
[data-theme="dark"] {
  .music-toggle-btn {
    background: var(--bg-secondary);
    color: var(--text-primary);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
    }
  }

  .music-controls {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-controls {
    padding: 6px 12px;
    gap: 6px;
  }

  .volume-slider {
    width: 50px;
  }

  .track-name {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .music-player {
    gap: 6px;
  }

  .music-controls {
    padding: 4px 8px;
    gap: 4px;
  }

  .track-indicator {
    display: none;
  }
}
</style>