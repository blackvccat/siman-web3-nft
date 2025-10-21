/**
 * 版本管理和缓存清理工具
 * 功能: 管理应用版本，自动清理缓存，确保用户看到最新版本
 */

// 当前应用版本
const APP_VERSION = '1.0.1'

// 版本检查键
const VERSION_KEY = 'siman-app-version'

// 清理缓存的函数
export const clearCache = () => {
  try {
    // 清理localStorage中的旧数据
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('siman-') && key !== VERSION_KEY) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
    
    console.log('缓存清理完成，清理了', keysToRemove.length, '个旧数据项')
    return true
  } catch (error) {
    console.error('缓存清理失败:', error)
    return false
  }
}

// 检查版本并清理缓存
export const checkVersionAndClearCache = () => {
  try {
    const savedVersion = localStorage.getItem(VERSION_KEY)
    
    if (!savedVersion || savedVersion !== APP_VERSION) {
      console.log('检测到版本更新:', savedVersion, '->', APP_VERSION)
      
      // 清理旧缓存
      clearCache()
      
      // 保存新版本
      localStorage.setItem(VERSION_KEY, APP_VERSION)
      
      // 强制刷新页面缓存
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name)
          })
        })
      }
      
      console.log('版本更新完成，缓存已清理')
      return true
    }
    
    return false
  } catch (error) {
    console.error('版本检查失败:', error)
    return false
  }
}

// 强制刷新页面（用于开发环境）
export const forceRefresh = () => {
  if (window.location.search.includes('dev=true')) {
    // 开发环境：清理缓存并刷新
    clearCache()
    window.location.reload(true)
  } else {
    // 生产环境：正常刷新
    window.location.reload()
  }
}

// 添加版本信息到页面
export const addVersionInfo = () => {
  const versionInfo = document.createElement('div')
  versionInfo.id = 'version-info'
  versionInfo.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
    font-family: monospace;
  `
  versionInfo.textContent = `v${APP_VERSION}`
  document.body.appendChild(versionInfo)
}

export default {
  APP_VERSION,
  clearCache,
  checkVersionAndClearCache,
  forceRefresh,
  addVersionInfo
}

