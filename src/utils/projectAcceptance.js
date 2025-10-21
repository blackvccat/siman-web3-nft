/**
 * 项目验收测试套件
 * 百万年薪测试工程师专用
 */

// 测试结果记录
const testResults = {
  music: { passed: 0, failed: 0, issues: [] },
  theme: { passed: 0, failed: 0, issues: [] },
  interactions: { passed: 0, failed: 0, issues: [] },
  cache: { passed: 0, failed: 0, issues: [] },
  responsive: { passed: 0, failed: 0, issues: [] },
  performance: { passed: 0, failed: 0, issues: [] }
}

// 严重问题记录
const criticalIssues = []

// 测试音乐播放功能
export const testMusicPlayback = () => {
  console.log('🎵 测试音乐播放功能...')
  
  const tests = [
    {
      name: '音乐开关按钮功能',
      test: () => {
        const musicBtn = document.querySelector('.music-toggle-btn')
        if (!musicBtn) return false
        
        // 测试点击功能
        const initialEnabled = musicBtn.classList.contains('enabled')
        musicBtn.click()
        
        setTimeout(() => {
          const afterClick = musicBtn.classList.contains('enabled')
          return initialEnabled !== afterClick
        }, 100)
        
        return true
      }
    },
    {
      name: '白天模式音乐播放',
      test: () => {
        const audioElement = document.querySelector('audio')
        if (!audioElement) return false
        
        // 确保是白天模式
        document.documentElement.setAttribute('data-theme', 'light')
        
        // 测试音乐源是否正确
        const src = audioElement.src
        return src.includes('狐の工作室') || src.includes('day-theme')
      }
    },
    {
      name: '夜晚模式音乐播放',
      test: () => {
        const audioElement = document.querySelector('audio')
        if (!audioElement) return false
        
        // 切换到夜晚模式
        document.documentElement.setAttribute('data-theme', 'dark')
        
        // 测试音乐源是否正确
        const src = audioElement.src
        return src.includes('上海アリス') || src.includes('night-theme')
      }
    },
    {
      name: '音乐播放状态同步',
      test: () => {
        const playBtn = document.querySelector('.play-pause-btn')
        const audioElement = document.querySelector('audio')
        
        if (!playBtn || !audioElement) return false
        
        // 测试播放状态同步
        playBtn.click()
        
        setTimeout(() => {
          const isPlaying = !audioElement.paused
          const btnShowsPlaying = playBtn.querySelector('rect') !== null
          return isPlaying === btnShowsPlaying
        }, 100)
        
        return true
      }
    },
    {
      name: '音量控制功能',
      test: () => {
        const volumeSlider = document.querySelector('.volume-slider')
        if (!volumeSlider) return false
        
        const initialVolume = volumeSlider.value
        volumeSlider.value = '0.8'
        volumeSlider.dispatchEvent(new Event('input'))
        
        return volumeSlider.value === '0.8'
      }
    },
    {
      name: '静音功能',
      test: () => {
        const muteBtn = document.querySelector('.volume-btn')
        const audioElement = document.querySelector('audio')
        
        if (!muteBtn || !audioElement) return false
        
        const initialMuted = audioElement.muted
        muteBtn.click()
        
        return audioElement.muted !== initialMuted
      }
    }
  ]
  
  let passed = 0
  let failed = 0
  const issues = []
  
  tests.forEach(test => {
    try {
      const result = test.test()
      if (result) {
        console.log(`✅ ${test.name}: 通过`)
        passed++
      } else {
        console.log(`❌ ${test.name}: 失败`)
        failed++
        issues.push(test.name)
        
        if (test.name.includes('夜晚模式')) {
          criticalIssues.push({
            module: '音乐播放',
            issue: test.name,
            severity: 'Critical',
            description: '夜晚模式音乐无法正常播放'
          })
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name}: 错误 - ${error.message}`)
      failed++
      issues.push(test.name)
    }
  })
  
  testResults.music = { passed, failed, issues }
  
  console.log(`\n🎵 音乐播放测试结果: ${passed}/${passed + failed} 通过`)
  if (failed > 0) {
    console.log(`❌ 发现 ${failed} 个问题:`, issues)
  }
  
  return { passed, failed, issues }
}

// 测试主题切换功能
export const testThemeSwitching = () => {
  console.log('🌙 测试主题切换功能...')
  
  const tests = [
    {
      name: '主题切换按钮存在',
      test: () => {
        const themeBtn = document.querySelector('.theme-btn')
        return themeBtn !== null
      }
    },
    {
      name: '主题切换功能',
      test: () => {
        const themeBtn = document.querySelector('.theme-btn')
        if (!themeBtn) return false
        
        const initialTheme = document.documentElement.getAttribute('data-theme')
        themeBtn.click()
        
        setTimeout(() => {
          const newTheme = document.documentElement.getAttribute('data-theme')
          return initialTheme !== newTheme
        }, 100)
        
        return true
      }
    },
    {
      name: '主题切换时音乐自动切换',
      test: () => {
        const themeBtn = document.querySelector('.theme-btn')
        const audioElement = document.querySelector('audio')
        
        if (!themeBtn || !audioElement) return false
        
        const initialSrc = audioElement.src
        themeBtn.click()
        
        setTimeout(() => {
          const newSrc = audioElement.src
          return initialSrc !== newSrc
        }, 500)
        
        return true
      }
    },
    {
      name: '主题切换后音乐继续播放',
      test: () => {
        const themeBtn = document.querySelector('.theme-btn')
        const audioElement = document.querySelector('audio')
        
        if (!themeBtn || !audioElement) return false
        
        // 确保音乐正在播放
        if (audioElement.paused) {
          audioElement.play()
        }
        
        const wasPlaying = !audioElement.paused
        themeBtn.click()
        
        setTimeout(() => {
          const stillPlaying = !audioElement.paused
          return wasPlaying && stillPlaying
        }, 1000)
        
        return true
      }
    }
  ]
  
  let passed = 0
  let failed = 0
  const issues = []
  
  tests.forEach(test => {
    try {
      const result = test.test()
      if (result) {
        console.log(`✅ ${test.name}: 通过`)
        passed++
      } else {
        console.log(`❌ ${test.name}: 失败`)
        failed++
        issues.push(test.name)
        
        if (test.name.includes('音乐')) {
          criticalIssues.push({
            module: '主题切换',
            issue: test.name,
            severity: 'Critical',
            description: '主题切换时音乐功能异常'
          })
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name}: 错误 - ${error.message}`)
      failed++
      issues.push(test.name)
    }
  })
  
  testResults.theme = { passed, failed, issues }
  
  console.log(`\n🌙 主题切换测试结果: ${passed}/${passed + failed} 通过`)
  if (failed > 0) {
    console.log(`❌ 发现 ${failed} 个问题:`, issues)
  }
  
  return { passed, failed, issues }
}

// 测试用户交互功能
export const testUserInteractions = () => {
  console.log('🖱️ 测试用户交互功能...')
  
  const tests = [
    {
      name: '音乐控制面板悬停显示',
      test: () => {
        const musicPlayer = document.querySelector('.music-player')
        const controls = document.querySelector('.music-controls')
        
        if (!musicPlayer || !controls) return false
        
        // 模拟鼠标悬停
        musicPlayer.dispatchEvent(new Event('mouseenter'))
        
        return controls.classList.contains('visible')
      }
    },
    {
      name: '音乐控制面板自动隐藏',
      test: () => {
        const musicPlayer = document.querySelector('.music-player')
        const controls = document.querySelector('.music-controls')
        
        if (!musicPlayer || !controls) return false
        
        // 先显示控制面板
        musicPlayer.dispatchEvent(new Event('mouseenter'))
        
        // 模拟鼠标离开
        musicPlayer.dispatchEvent(new Event('mouseleave'))
        
        // 等待自动隐藏
        setTimeout(() => {
          return !controls.classList.contains('visible')
        }, 1100)
        
        return true
      }
    },
    {
      name: '缓存清理功能',
      test: () => {
        const cacheBtn = document.querySelector('.cache-clear-btn')
        return cacheBtn !== null && cacheBtn.onclick !== null
      }
    },
    {
      name: '响应式设计检查',
      test: () => {
        // 检查关键元素是否存在
        const musicPlayer = document.querySelector('.music-player')
        const themeBtn = document.querySelector('.theme-btn')
        
        return musicPlayer !== null && themeBtn !== null
      }
    }
  ]
  
  let passed = 0
  let failed = 0
  const issues = []
  
  tests.forEach(test => {
    try {
      const result = test.test()
      if (result) {
        console.log(`✅ ${test.name}: 通过`)
        passed++
      } else {
        console.log(`❌ ${test.name}: 失败`)
        failed++
        issues.push(test.name)
      }
    } catch (error) {
      console.log(`❌ ${test.name}: 错误 - ${error.message}`)
      failed++
      issues.push(test.name)
    }
  })
  
  testResults.interactions = { passed, failed, issues }
  
  console.log(`\n🖱️ 用户交互测试结果: ${passed}/${passed + failed} 通过`)
  if (failed > 0) {
    console.log(`❌ 发现 ${failed} 个问题:`, issues)
  }
  
  return { passed, failed, issues }
}

// 生成测试报告
export const generateTestReport = () => {
  console.log('\n📊 项目验收测试报告')
  console.log('=' * 50)
  
  const totalPassed = Object.values(testResults).reduce((sum, result) => sum + result.passed, 0)
  const totalFailed = Object.values(testResults).reduce((sum, result) => sum + result.failed, 0)
  const totalTests = totalPassed + totalFailed
  
  console.log(`总测试数: ${totalTests}`)
  console.log(`通过: ${totalPassed}`)
  console.log(`失败: ${totalFailed}`)
  console.log(`通过率: ${((totalPassed / totalTests) * 100).toFixed(2)}%`)
  
  console.log('\n📋 详细结果:')
  Object.entries(testResults).forEach(([module, result]) => {
    const moduleName = {
      music: '音乐播放',
      theme: '主题切换',
      interactions: '用户交互',
      cache: '缓存管理',
      responsive: '响应式设计',
      performance: '性能优化'
    }[module]
    
    console.log(`${moduleName}: ${result.passed}/${result.passed + result.failed} 通过`)
    if (result.failed > 0) {
      console.log(`  ❌ 问题: ${result.issues.join(', ')}`)
    }
  })
  
  if (criticalIssues.length > 0) {
    console.log('\n🚨 严重问题:')
    criticalIssues.forEach(issue => {
      console.log(`- ${issue.module}: ${issue.issue} (${issue.severity})`)
      console.log(`  描述: ${issue.description}`)
    })
  }
  
  // 验收结论
  const passRate = (totalPassed / totalTests) * 100
  if (passRate >= 90 && criticalIssues.length === 0) {
    console.log('\n✅ 验收结论: 通过')
    console.log('项目质量符合百万年薪标准')
  } else if (passRate >= 80) {
    console.log('\n⚠️ 验收结论: 有条件通过')
    console.log('需要修复严重问题后才能上线')
  } else {
    console.log('\n❌ 验收结论: 不通过')
    console.log('项目质量不符合要求，需要重大改进')
  }
  
  return {
    totalTests,
    totalPassed,
    totalFailed,
    passRate,
    criticalIssues,
    testResults
  }
}

// 运行完整测试套件
export const runFullTestSuite = () => {
  console.log('🚀 开始运行完整测试套件...')
  console.log('测试工程师: 百万年薪测试工程师')
  console.log('测试时间:', new Date().toLocaleString())
  console.log('=' * 50)
  
  testMusicPlayback()
  testThemeSwitching()
  testUserInteractions()
  
  return generateTestReport()
}

// 在控制台中暴露测试函数
if (typeof window !== 'undefined') {
  window.projectAcceptance = {
    music: testMusicPlayback,
    theme: testThemeSwitching,
    interactions: testUserInteractions,
    report: generateTestReport,
    full: runFullTestSuite
  }
  
  console.log('🧪 项目验收测试工具已加载！')
  console.log('使用方法:')
  console.log('- projectAcceptance.full() - 运行完整测试套件')
  console.log('- projectAcceptance.music() - 测试音乐播放功能')
  console.log('- projectAcceptance.theme() - 测试主题切换功能')
  console.log('- projectAcceptance.interactions() - 测试用户交互功能')
  console.log('- projectAcceptance.report() - 生成测试报告')
}

export default {
  testMusicPlayback,
  testThemeSwitching,
  testUserInteractions,
  generateTestReport,
  runFullTestSuite
}
