/**
 * 交互功能测试脚本
 * 用于验证所有交互功能是否正常工作
 */

// 测试音乐播放器交互
export const testMusicPlayerInteractions = () => {
  console.log('🎵 测试音乐播放器交互功能...')
  
  const tests = [
    {
      name: '音乐开关按钮',
      test: () => {
        const musicBtn = document.querySelector('.music-toggle-btn')
        return musicBtn && musicBtn.onclick !== null
      }
    },
    {
      name: '播放/暂停按钮',
      test: () => {
        const playBtn = document.querySelector('.play-pause-btn')
        return playBtn && playBtn.onclick !== null
      }
    },
    {
      name: '音量滑块',
      test: () => {
        const volumeSlider = document.querySelector('.volume-slider')
        return volumeSlider && volumeSlider.oninput !== null
      }
    },
    {
      name: '静音按钮',
      test: () => {
        const muteBtn = document.querySelector('.volume-btn')
        return muteBtn && muteBtn.onclick !== null
      }
    },
    {
      name: '缓存清理按钮',
      test: () => {
        const cacheBtn = document.querySelector('.cache-clear-btn')
        return cacheBtn && cacheBtn.onclick !== null
      }
    },
    {
      name: '鼠标悬停事件',
      test: () => {
        const musicPlayer = document.querySelector('.music-player')
        return musicPlayer && musicPlayer.onmouseenter !== null
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
  
  console.log(`\n🎵 音乐播放器测试结果: ${passed}/${total} 通过`)
  return passed === total
}

// 测试主题切换交互
export const testThemeToggleInteractions = () => {
  console.log('🌙 测试主题切换交互功能...')
  
  const tests = [
    {
      name: '主题切换按钮',
      test: () => {
        const themeBtn = document.querySelector('.theme-btn')
        return themeBtn && themeBtn.onclick !== null
      }
    },
    {
      name: '主题图标切换',
      test: () => {
        const themeIcon = document.querySelector('.theme-icon svg')
        return themeIcon !== null
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
  
  console.log(`\n🌙 主题切换测试结果: ${passed}/${total} 通过`)
  return passed === total
}

// 测试版本管理功能
export const testVersionManagement = () => {
  console.log('📦 测试版本管理功能...')
  
  const tests = [
    {
      name: '版本信息显示',
      test: () => {
        const versionInfo = document.querySelector('#version-info')
        return versionInfo !== null
      }
    },
    {
      name: '本地存储版本检查',
      test: () => {
        const version = localStorage.getItem('siman-app-version')
        return version !== null
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
  
  console.log(`\n📦 版本管理测试结果: ${passed}/${total} 通过`)
  return passed === total
}

// 运行所有测试
export const runAllTests = () => {
  console.log('🚀 开始运行所有交互功能测试...\n')
  
  const musicPlayerTest = testMusicPlayerInteractions()
  const themeToggleTest = testThemeToggleInteractions()
  const versionManagementTest = testVersionManagement()
  
  const allPassed = musicPlayerTest && themeToggleTest && versionManagementTest
  
  console.log('\n🎯 总体测试结果:')
  if (allPassed) {
    console.log('✅ 所有交互功能测试通过！')
  } else {
    console.log('❌ 部分测试失败，请检查相关功能')
  }
  
  return allPassed
}

// 在控制台中暴露测试函数
if (typeof window !== 'undefined') {
  window.testInteractions = {
    musicPlayer: testMusicPlayerInteractions,
    themeToggle: testThemeToggleInteractions,
    versionManagement: testVersionManagement,
    all: runAllTests
  }
  
  console.log('🧪 交互测试工具已加载！')
  console.log('使用方法:')
  console.log('- testInteractions.all() - 运行所有测试')
  console.log('- testInteractions.musicPlayer() - 测试音乐播放器')
  console.log('- testInteractions.themeToggle() - 测试主题切换')
  console.log('- testInteractions.versionManagement() - 测试版本管理')
}

export default {
  testMusicPlayerInteractions,
  testThemeToggleInteractions,
  testVersionManagement,
  runAllTests
}

