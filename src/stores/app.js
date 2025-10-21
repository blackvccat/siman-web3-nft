/**
 * 应用状态管理 Store
 * 功能: 管理应用的全局状态，包括语言、主题、钱包连接、菜单状态等
 * 技术: 使用 Pinia 进行状态管理
 * 特性: 支持本地存储持久化、响应式状态更新
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getTranslation } from '@/utils/i18n'

export const useAppStore = defineStore('app', () => {
  // 状态
  const language = ref('zh')
  const isWalletConnected = ref(false)
  const walletAddress = ref('')
  const isLoading = ref(false)
  const currentPage = ref('home')
  const menuOpen = ref(false)
  const isDarkMode = ref(false)
  const theme = ref('light')
  
  // 计算属性
  const isChinese = computed(() => language.value === 'zh')
  const isEnglish = computed(() => language.value === 'en')
  
  // 方法
  const setLanguage = (lang) => {
    language.value = lang
    localStorage.setItem('siman-language', lang)
  }
  
  const toggleLanguage = () => {
    setLanguage(language.value === 'zh' ? 'en' : 'zh')
  }
  
  const connectWallet = (address) => {
    isWalletConnected.value = true
    walletAddress.value = address
    localStorage.setItem('siman-wallet', address)
  }
  
  const disconnectWallet = () => {
    isWalletConnected.value = false
    walletAddress.value = ''
    localStorage.removeItem('siman-wallet')
  }
  
  const setLoading = (loading) => {
    isLoading.value = loading
  }
  
  const setCurrentPage = (page) => {
    currentPage.value = page
  }
  
  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
  }
  
  const closeMenu = () => {
    menuOpen.value = false
  }
  
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    theme.value = isDarkMode.value ? 'dark' : 'light'
    localStorage.setItem('siman-theme', theme.value)
    document.documentElement.setAttribute('data-theme', theme.value)
  }
  
  const setTheme = (newTheme) => {
    theme.value = newTheme
    isDarkMode.value = newTheme === 'dark'
    localStorage.setItem('siman-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }
  
  // 翻译方法
  const t = (key) => {
    return getTranslation(key, language.value)
  }
  
  const init = () => {
    // 从本地存储恢复设置
    const savedLanguage = localStorage.getItem('siman-language')
    if (savedLanguage) {
      language.value = savedLanguage
    }
    
    const savedWallet = localStorage.getItem('siman-wallet')
    if (savedWallet) {
      walletAddress.value = savedWallet
      isWalletConnected.value = true
    }
    
    // 恢复主题设置
    const savedTheme = localStorage.getItem('siman-theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }
  
  return {
    // 状态
    language,
    isWalletConnected,
    walletAddress,
    isLoading,
    currentPage,
    menuOpen,
    isDarkMode,
    theme,
    
    // 计算属性
    isChinese,
    isEnglish,
    
    // 方法
    setLanguage,
    toggleLanguage,
    connectWallet,
    disconnectWallet,
    setLoading,
    setCurrentPage,
    toggleMenu,
    closeMenu,
    toggleTheme,
    setTheme,
    init,
    t
  }
})
