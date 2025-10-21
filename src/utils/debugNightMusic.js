/**
 * 夜晚模式音乐调试工具
 * 用于诊断夜晚模式音乐播放问题
 */

export const debugNightModeMusic = () => {
  console.log('🌙 调试夜晚模式音乐播放问题...')
  
  // 检查音乐文件路径
  const nightTrackName = '上海アリス幻樂団,黄昏フロンティア - 旧地獄街道を行く.mp3'
  const encodedPath = `/music/${encodeURIComponent(nightTrackName)}`
  
  console.log('夜晚模式音乐信息:')
  console.log('- 文件名:', nightTrackName)
  console.log('- 编码后路径:', encodedPath)
  console.log('- 完整URL:', `${window.location.origin}${encodedPath}`)
  
  // 检查音频元素
  const audioElement = document.querySelector('audio')
  if (audioElement) {
    console.log('音频元素状态:')
    console.log('- src:', audioElement.src)
    console.log('- readyState:', audioElement.readyState)
    console.log('- paused:', audioElement.paused)
    console.log('- volume:', audioElement.volume)
    console.log('- muted:', audioElement.muted)
    console.log('- error:', audioElement.error)
  } else {
    console.log('❌ 未找到音频元素')
  }
  
  // 检查应用状态
  const appStore = window.__VUE_DEVTOOLS_GLOBAL_HOOK__?.apps?.[0]?.$store || 
                   document.querySelector('[data-vue-app]')?.__vue_app__?.config?.globalProperties?.$store
  
  if (appStore) {
    console.log('应用状态:')
    console.log('- isMusicEnabled:', appStore.isMusicEnabled)
    console.log('- isMusicPlaying:', appStore.isMusicPlaying)
    console.log('- currentMusicTrack:', appStore.currentMusicTrack)
    console.log('- isDarkMode:', appStore.isDarkMode)
    console.log('- musicVolume:', appStore.musicVolume)
  }
  
  // 测试音乐文件访问
  fetch(encodedPath, { method: 'HEAD' })
    .then(response => {
      console.log('音乐文件访问测试:')
      console.log('- 状态码:', response.status)
      console.log('- 状态文本:', response.statusText)
      console.log('- 内容类型:', response.headers.get('content-type'))
      console.log('- 文件大小:', response.headers.get('content-length'))
      
      if (response.ok) {
        console.log('✅ 音乐文件可以访问')
      } else {
        console.log('❌ 音乐文件无法访问')
      }
    })
    .catch(error => {
      console.log('❌ 音乐文件访问失败:', error)
    })
}

// 测试夜晚模式音乐播放
export const testNightModePlayback = () => {
  console.log('🎵 测试夜晚模式音乐播放...')
  
  const audioElement = document.querySelector('audio')
  if (!audioElement) {
    console.log('❌ 未找到音频元素')
    return false
  }
  
  // 设置夜晚模式音乐
  const nightTrackName = '上海アリス幻樂団,黄昏フロンティア - 旧地獄街道を行く.mp3'
  const encodedPath = `/music/${encodeURIComponent(nightTrackName)}`
  
  console.log('设置夜晚模式音乐:', encodedPath)
  
  // 设置音频源
  audioElement.src = encodedPath
  audioElement.load()
  
  // 等待加载完成
  return new Promise((resolve) => {
    audioElement.addEventListener('canplaythrough', () => {
      console.log('✅ 夜晚模式音乐加载完成')
      
      // 尝试播放
      audioElement.volume = 0.5
      audioElement.play()
        .then(() => {
          console.log('✅ 夜晚模式音乐播放成功')
          resolve(true)
        })
        .catch(error => {
          console.log('❌ 夜晚模式音乐播放失败:', error)
          resolve(false)
        })
    }, { once: true })
    
    audioElement.addEventListener('error', (error) => {
      console.log('❌ 夜晚模式音乐加载失败:', error)
      resolve(false)
    }, { once: true })
    
    // 超时处理
    setTimeout(() => {
      console.log('❌ 夜晚模式音乐加载超时')
      resolve(false)
    }, 5000)
  })
}

// 修复夜晚模式音乐播放
export const fixNightModeMusic = () => {
  console.log('🔧 尝试修复夜晚模式音乐播放...')
  
  const audioElement = document.querySelector('audio')
  if (!audioElement) {
    console.log('❌ 未找到音频元素')
    return false
  }
  
  // 清除可能的缓存问题
  audioElement.src = ''
  audioElement.load()
  
  // 重新设置夜晚模式音乐
  setTimeout(() => {
    const nightTrackName = '上海アリス幻樂団,黄昏フロンティア - 旧地獄街道を行く.mp3'
    const encodedPath = `/music/${encodeURIComponent(nightTrackName)}`
    
    console.log('重新设置夜晚模式音乐:', encodedPath)
    audioElement.src = encodedPath
    audioElement.load()
    
    // 尝试播放
    setTimeout(() => {
      audioElement.volume = 0.5
      audioElement.play()
        .then(() => {
          console.log('✅ 夜晚模式音乐修复成功')
        })
        .catch(error => {
          console.log('❌ 夜晚模式音乐修复失败:', error)
        })
    }, 500)
  }, 100)
  
  return true
}

// 在控制台中暴露调试函数
if (typeof window !== 'undefined') {
  window.debugNightMusic = {
    debug: debugNightModeMusic,
    test: testNightModePlayback,
    fix: fixNightModeMusic
  }
  
  console.log('🌙 夜晚模式音乐调试工具已加载！')
  console.log('使用方法:')
  console.log('- debugNightMusic.debug() - 调试夜晚模式音乐问题')
  console.log('- debugNightMusic.test() - 测试夜晚模式音乐播放')
  console.log('- debugNightMusic.fix() - 修复夜晚模式音乐播放')
}

export default {
  debugNightModeMusic,
  testNightModePlayback,
  fixNightModeMusic
}

