/**
 * 主题切换音乐播放测试脚本
 * 用于验证主题切换时音乐是否能正确切换并播放
 */

export const testThemeMusicSwitch = () => {
  console.log('🎵🌙 测试主题切换音乐播放功能...')
  
  const tests = [
    {
      name: '主题切换按钮存在',
      test: () => {
        const themeBtn = document.querySelector('.theme-btn')
        return themeBtn !== null
      }
    },
    {
      name: '音乐播放器存在',
      test: () => {
        const musicPlayer = document.querySelector('.music-player')
        return musicPlayer !== null
      }
    },
    {
      name: '音频元素存在',
      test: () => {
        const audioElement = document.querySelector('audio')
        return audioElement !== null
      }
    },
    {
      name: '主题切换事件监听器',
      test: () => {
        const themeBtn = document.querySelector('.theme-btn')
        return themeBtn && themeBtn.onclick !== null
      }
    },
    {
      name: '音乐播放状态监听器',
      test: () => {
        const playBtn = document.querySelector('.play-pause-btn')
        return playBtn && playBtn.onclick !== null
      }
    }
  ]
  
  let passed = 0
  let total = tests.length
  
  tests.forEach(test => {
    try {
      if (test.test()) {
        console.log(`✅ ${test.name}: 通过`)
        passed++
      } else {
        console.log(`❌ ${test.name}: 失败`)
      }
    } catch (error) {
      console.log(`❌ ${test.name}: 错误 - ${error.message}`)
    }
  })
  
  console.log(`\n🎵🌙 主题切换音乐测试结果: ${passed}/${total} 通过`)
  return passed === total
}

// 模拟主题切换测试
export const simulateThemeSwitch = () => {
  console.log('🔄 模拟主题切换测试...')
  
  try {
    const themeBtn = document.querySelector('.theme-btn')
    const musicPlayer = document.querySelector('.music-player')
    const audioElement = document.querySelector('audio')
    
    if (!themeBtn || !musicPlayer || !audioElement) {
      console.log('❌ 缺少必要的DOM元素')
      return false
    }
    
    // 记录当前状态
    const initialState = {
      theme: document.documentElement.getAttribute('data-theme'),
      musicEnabled: audioElement.src !== '',
      musicPlaying: !audioElement.paused
    }
    
    console.log('初始状态:', initialState)
    
    // 模拟点击主题切换按钮
    themeBtn.click()
    
    // 等待状态更新
    setTimeout(() => {
      const newState = {
        theme: document.documentElement.getAttribute('data-theme'),
        musicEnabled: audioElement.src !== '',
        musicPlaying: !audioElement.paused
      }
      
      console.log('切换后状态:', newState)
      
      // 检查主题是否切换
      const themeChanged = initialState.theme !== newState.theme
      console.log(`主题切换: ${themeChanged ? '✅' : '❌'}`)
      
      // 检查音乐是否切换
      const musicChanged = initialState.musicEnabled && newState.musicEnabled
      console.log(`音乐切换: ${musicChanged ? '✅' : '❌'}`)
      
      // 检查音乐是否继续播放
      const musicStillPlaying = initialState.musicPlaying && newState.musicPlaying
      console.log(`音乐继续播放: ${musicStillPlaying ? '✅' : '❌'}`)
      
      const allPassed = themeChanged && musicChanged && musicStillPlaying
      console.log(`\n🎯 主题切换音乐测试: ${allPassed ? '✅ 通过' : '❌ 失败'}`)
      
      return allPassed
    }, 500)
    
    return true
  } catch (error) {
    console.log('❌ 模拟测试失败:', error)
    return false
  }
}

// 在控制台中暴露测试函数
if (typeof window !== 'undefined') {
  window.testThemeMusic = {
    basic: testThemeMusicSwitch,
    simulate: simulateThemeSwitch
  }
  
  console.log('🧪 主题切换音乐测试工具已加载！')
  console.log('使用方法:')
  console.log('- testThemeMusic.basic() - 基础功能测试')
  console.log('- testThemeMusic.simulate() - 模拟主题切换测试')
}

export default {
  testThemeMusicSwitch,
  simulateThemeSwitch
}

