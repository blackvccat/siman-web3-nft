/**
 * 音乐播放测试工具
 * 用于诊断音乐播放问题
 */

// 测试音乐播放功能
export const testMusicPlayback = () => {
  console.log('🎵 开始音乐播放测试...')
  
  // 检查音频元素
  const audioElement = document.querySelector('audio')
  if (!audioElement) {
    console.error('❌ 未找到音频元素')
    return false
  }
  
  console.log('✅ 找到音频元素:', {
    src: audioElement.src,
    readyState: audioElement.readyState,
    volume: audioElement.volume,
    muted: audioElement.muted
  })
  
  // 检查音乐文件
  const musicFiles = ['/music/day-theme.mp3', '/music/night-theme.mp3']
  musicFiles.forEach(file => {
    fetch(file)
      .then(response => {
        if (response.ok) {
          console.log(`✅ 音乐文件存在: ${file}`)
        } else {
          console.error(`❌ 音乐文件不存在: ${file}`)
        }
      })
      .catch(error => {
        console.error(`❌ 音乐文件检查失败: ${file}`, error)
      })
  })
  
  // 检查store状态
  const appStore = window.__VUE_DEVTOOLS_GLOBAL_HOOK__?.apps?.[0]?.config?.globalProperties?.$pinia?.state?.value?.app
  if (appStore) {
    console.log('✅ Store状态:', {
      isMusicEnabled: appStore.isMusicEnabled,
      isMusicPlaying: appStore.isMusicPlaying,
      currentMusicTrack: appStore.currentMusicTrack,
      musicVolume: appStore.musicVolume
    })
  }
  
  return true
}

// 手动测试音乐播放
export const manualTestPlay = () => {
  console.log('🎵 手动测试音乐播放...')
  
  const audioElement = document.querySelector('audio')
  if (!audioElement) {
    console.error('❌ 未找到音频元素')
    return
  }
  
  // 设置音频源
  audioElement.src = '/music/day-theme.mp3'
  audioElement.volume = 0.5
  
  // 尝试播放
  audioElement.play()
    .then(() => {
      console.log('✅ 手动播放成功')
    })
    .catch(error => {
      console.error('❌ 手动播放失败:', error)
    })
}

// 在控制台中暴露测试函数
if (typeof window !== 'undefined') {
  window.musicTest = {
    test: testMusicPlayback,
    play: manualTestPlay
  }
  
  console.log('🧪 音乐播放测试工具已加载！')
  console.log('使用方法:')
  console.log('- musicTest.test() - 运行完整测试')
  console.log('- musicTest.play() - 手动测试播放')
}

export default {
  testMusicPlayback,
  manualTestPlay
}
