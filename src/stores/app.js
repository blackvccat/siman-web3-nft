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
  
  // 音乐控制状态
  const isMusicEnabled = ref(false)
  const isMusicPlaying = ref(false)
  const musicVolume = ref(0.5)
  const currentMusicTrack = ref('day') // 默认设置为白天主题
  const autoPlayMusic = ref(true) // 自动播放音乐
  
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
    
    // 根据主题切换音乐
    if (isMusicEnabled.value && isMusicPlaying.value) {
      switchMusicTrack(newTheme)
    }
  }
  
  // 音乐控制方法
  const toggleMusic = () => {
    isMusicEnabled.value = !isMusicEnabled.value
    localStorage.setItem('siman-music-enabled', isMusicEnabled.value.toString())
    
    if (isMusicEnabled.value) {
      // 启用音乐时，根据当前主题选择音乐
      const track = isDarkMode.value ? 'night' : 'day'
      currentMusicTrack.value = track
    } else {
      // 禁用音乐时停止播放
      isMusicPlaying.value = false
      currentMusicTrack.value = ''
    }
  }
  
  const toggleMusicPlayback = () => {
    if (!isMusicEnabled.value) return
    
    isMusicPlaying.value = !isMusicPlaying.value
    localStorage.setItem('siman-music-playing', isMusicPlaying.value.toString())
  }
  
  const setMusicVolume = (volume) => {
    musicVolume.value = Math.max(0, Math.min(1, volume))
    localStorage.setItem('siman-music-volume', musicVolume.value.toString())
  }
  
  const switchMusicTrack = (theme) => {
    if (!isMusicEnabled.value) return
    
    const track = theme === 'dark' ? 'night' : 'day'
    currentMusicTrack.value = track
    localStorage.setItem('siman-current-track', track)
  }
  
  const enableAutoPlay = () => {
    if (autoPlayMusic.value && !isMusicEnabled.value) {
      isMusicEnabled.value = true
      const track = isDarkMode.value ? 'night' : 'day'
      currentMusicTrack.value = track
      localStorage.setItem('siman-music-enabled', 'true')
      localStorage.setItem('siman-current-track', track)
      
      // 标记需要自动播放
      localStorage.setItem('siman-need-autoplay', 'true')
    }
  }
  
  const disableAutoPlay = () => {
    autoPlayMusic.value = false
    localStorage.setItem('siman-auto-play', 'false')
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
    
    // 恢复音乐设置
    const savedMusicEnabled = localStorage.getItem('siman-music-enabled')
    if (savedMusicEnabled) {
      isMusicEnabled.value = savedMusicEnabled === 'true'
    }
    
    const savedMusicPlaying = localStorage.getItem('siman-music-playing')
    if (savedMusicPlaying) {
      isMusicPlaying.value = savedMusicPlaying === 'true'
    }
    
    const savedMusicVolume = localStorage.getItem('siman-music-volume')
    if (savedMusicVolume) {
      musicVolume.value = parseFloat(savedMusicVolume)
    }
    
    const savedCurrentTrack = localStorage.getItem('siman-current-track')
    if (savedCurrentTrack) {
      currentMusicTrack.value = savedCurrentTrack
    } else if (isMusicEnabled.value) {
      // 如果没有保存的曲目但音乐已启用，根据当前主题设置
      currentMusicTrack.value = isDarkMode.value ? 'night' : 'day'
    }
    
    // 恢复自动播放设置
    const savedAutoPlay = localStorage.getItem('siman-auto-play')
    if (savedAutoPlay) {
      autoPlayMusic.value = savedAutoPlay === 'true'
    }
    
    // 如果是首次访问且自动播放启用，则启用音乐
    if (autoPlayMusic.value && !savedMusicEnabled) {
      enableAutoPlay()
      // 首次访问时自动开始播放
      setTimeout(() => {
        isMusicPlaying.value = true
        localStorage.setItem('siman-music-playing', 'true')
      }, 1000)
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
    
    // 音乐状态
    isMusicEnabled,
    isMusicPlaying,
    musicVolume,
    currentMusicTrack,
    autoPlayMusic,
    
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
    
    // 音乐方法
    toggleMusic,
    toggleMusicPlayback,
    setMusicVolume,
    switchMusicTrack,
    enableAutoPlay,
    disableAutoPlay,
    
    init,
    t
  }
})
