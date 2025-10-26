/**
 * 购物车状态管理 Store
 * 功能: 管理购物车状态，包括商品添加、删除、数量更新、价格计算等
 * 技术: 使用 Pinia 进行状态管理
 * 特性: 支持本地存储持久化、与后端API同步
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartAPI, handleAPIError } from '@/services/api'

export const useCartStore = defineStore('cart', () => {
  // 状态
  const items = ref([])
  const isLoading = ref(false)
  const lastSyncTime = ref(null)
  const isDrawerOpen = ref(false)
  
  // 计算属性
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })
  
  const isEmpty = computed(() => items.value.length === 0)
  
  const hasItem = computed(() => (productId) => {
    return items.value.some(item => item.productId === productId)
  })
  
  // 方法
  const addItem = async (product, quantity = 1) => {
    try {
      // 调用后端API添加商品
      const response = await cartAPI.addToCart(product.id, quantity)
      
      if (response.success) {
        // 更新本地状态
        items.value = response.data.items || []
        
        // 保存到本地存储
        saveToLocalStorage()
        
        console.log('商品已添加到购物车:', product.name)
      }
    } catch (error) {
      console.error('添加商品到购物车失败:', error)
      const errorMessage = handleAPIError(error)
      throw new Error(errorMessage)
    }
  }
  
  const removeItem = async (cartItemId) => {
    try {
      // 调用后端API删除商品
      const response = await cartAPI.removeFromCart(cartItemId)
      
      if (response.success) {
        // 更新本地状态
        items.value = response.data.items || []
        
        // 保存到本地存储
        saveToLocalStorage()
        
        console.log('商品已从购物车移除')
      }
    } catch (error) {
      console.error('从购物车移除商品失败:', error)
      const errorMessage = handleAPIError(error)
      throw new Error(errorMessage)
    }
  }
  
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      // 调用后端API更新数量
      const response = await cartAPI.updateCartItem(cartItemId, quantity)
      
      if (response.success) {
        // 更新本地状态
        items.value = response.data.items || []
        
        // 保存到本地存储
        saveToLocalStorage()
        
        console.log('购物车商品数量已更新')
      }
    } catch (error) {
      console.error('更新购物车商品数量失败:', error)
      const errorMessage = handleAPIError(error)
      throw new Error(errorMessage)
    }
  }
  
  const clearCart = async () => {
    try {
      // 调用后端API清空购物车
      const response = await cartAPI.clearCart()
      
      if (response.success) {
        // 更新本地状态
        items.value = []
        
        // 保存到本地存储
        saveToLocalStorage()
        
        console.log('购物车已清空')
      }
    } catch (error) {
      console.error('清空购物车失败:', error)
      const errorMessage = handleAPIError(error)
      throw new Error(errorMessage)
    }
  }
  
  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }
  
  const openDrawer = () => {
    isDrawerOpen.value = true
  }
  
  const closeDrawer = () => {
    isDrawerOpen.value = false
  }
  
  // 本地存储相关
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('siman-cart', JSON.stringify(items.value))
      localStorage.setItem('siman-cart-sync-time', new Date().toISOString())
    } catch (error) {
      console.error('保存购物车到本地存储失败:', error)
    }
  }
  
  const loadFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('siman-cart')
      const savedSyncTime = localStorage.getItem('siman-cart-sync-time')
      
      if (savedCart) {
        items.value = JSON.parse(savedCart)
        lastSyncTime.value = savedSyncTime
      }
    } catch (error) {
      console.error('从本地存储加载购物车失败:', error)
      items.value = []
    }
  }
  
  // 后端同步相关
  const syncWithBackend = async () => {
    if (isLoading.value) return
    
    try {
      isLoading.value = true
      
      // 调用后端API同步购物车
      const response = await cartAPI.getCart()
      
      if (response.success) {
        items.value = response.data.items || []
        lastSyncTime.value = new Date().toISOString()
        console.log('购物车已同步到后端')
      }
      
    } catch (error) {
      console.error('同步购物车到后端失败:', error)
      const errorMessage = handleAPIError(error)
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchCartFromBackend = async () => {
    if (isLoading.value) return
    
    try {
      isLoading.value = true
      
      // 从后端获取购物车数据
      const response = await cartAPI.getCart()
      
      if (response.success) {
        items.value = response.data.items || []
        lastSyncTime.value = new Date().toISOString()
        console.log('从后端获取购物车数据成功')
      }
      
    } catch (error) {
      console.error('从后端获取购物车失败:', error)
      const errorMessage = handleAPIError(error)
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }
  
  // 工具函数
  const generateCartItemId = () => {
    return 'cart-item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
  }
  
  const getItemById = (cartItemId) => {
    return items.value.find(item => item.id === cartItemId)
  }
  
  const getItemByProductId = (productId) => {
    return items.value.find(item => item.productId === productId)
  }
  
  // 初始化
  const init = async () => {
    loadFromLocalStorage()
    
    // 如果有用户登录，从后端获取最新数据
    const token = localStorage.getItem('siman-token')
    if (token) {
      try {
        await fetchCartFromBackend()
      } catch (error) {
        console.warn('从后端获取购物车失败，使用本地数据:', error.message)
      }
    }
  }
  
  return {
    // 状态
    items,
    isLoading,
    lastSyncTime,
    isDrawerOpen,
    
    // 计算属性
    itemCount,
    totalPrice,
    isEmpty,
    hasItem,
    
    // 方法
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    syncWithBackend,
    fetchCartFromBackend,
    getItemById,
    getItemByProductId,
    init
  }
})
