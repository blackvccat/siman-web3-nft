/**
 * API服务层
 * 功能: 封装所有后端API调用，提供统一的数据访问接口
 */

import { useAppStore } from '@/stores/app'

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api/v1'
const API_TIMEOUT = 10000 // 10秒超时

/**
 * HTTP请求类
 */
class HttpClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.timeout = API_TIMEOUT
  }

  /**
   * 获取请求头
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    }

    // 添加认证token
    const token = localStorage.getItem('siman-token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  /**
   * 处理响应
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  /**
   * 发送请求
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: this.getHeaders(),
      timeout: this.timeout,
      ...options,
    }

    try {
      const response = await fetch(url, config)
      return await this.handleResponse(response)
    } catch (error) {
      console.error('API请求失败:', error)
      throw error
    }
  }

  /**
   * GET请求
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url, { method: 'GET' })
  }

  /**
   * POST请求
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT请求
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE请求
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

// 创建HTTP客户端实例
const httpClient = new HttpClient()

/**
 * 认证相关API
 */
export const authAPI = {
  /**
   * 获取认证nonce
   */
  async getNonce(walletAddress) {
    return httpClient.get(`/auth/nonce/${walletAddress}`)
  },

  /**
   * 邮箱密码登录
   */
  async login(email, password) {
    const response = await httpClient.post('/auth/login', {
      email,
      password,
    })

    // 保存token
    if (response.data?.token) {
      localStorage.setItem('siman-token', response.data.token)
    }

    return response
  },

  /**
   * 钱包登录
   */
  async walletLogin(walletAddress, signature, nonce) {
    const response = await httpClient.post('/auth/login', {
      walletAddress,
      signature,
      nonce,
    })

    // 保存token
    if (response.data?.token) {
      localStorage.setItem('siman-token', response.data.token)
    }

    return response
  },

  /**
   * 刷新token
   */
  async refreshToken() {
    return httpClient.post('/auth/refresh')
  },

  /**
   * 登出
   */
  logout() {
    localStorage.removeItem('siman-token')
  },
}

/**
 * 商品相关API
 */
export const productAPI = {
  /**
   * 获取商品列表
   */
  async getProducts(params = {}) {
    return httpClient.get('/products', params)
  },

  /**
   * 获取商品详情
   */
  async getProduct(productId) {
    return httpClient.get(`/products/${productId}`)
  },

  /**
   * 创建商品（管理员）
   */
  async createProduct(productData) {
    return httpClient.post('/products', productData)
  },

  /**
   * 更新商品（管理员）
   */
  async updateProduct(productId, productData) {
    return httpClient.put(`/products/${productId}`, productData)
  },

  /**
   * 删除商品（管理员）
   */
  async deleteProduct(productId) {
    return httpClient.delete(`/products/${productId}`)
  },
}

/**
 * 购物车相关API
 */
export const cartAPI = {
  /**
   * 获取购物车
   */
  async getCart() {
    return httpClient.get('/cart')
  },

  /**
   * 添加商品到购物车
   */
  async addToCart(productId, quantity = 1) {
    return httpClient.post('/cart', {
      productId,
      quantity,
    })
  },

  /**
   * 更新购物车商品数量
   */
  async updateCartItem(cartItemId, quantity) {
    return httpClient.put(`/cart/${cartItemId}`, {
      quantity,
    })
  },

  /**
   * 删除购物车商品
   */
  async removeFromCart(cartItemId) {
    return httpClient.delete(`/cart/${cartItemId}`)
  },

  /**
   * 清空购物车
   */
  async clearCart() {
    return httpClient.delete('/cart')
  },
}

/**
 * 订单相关API
 */
export const orderAPI = {
  /**
   * 创建订单
   */
  async createOrder(orderData) {
    return httpClient.post('/orders', orderData)
  },

  /**
   * 获取订单列表
   */
  async getOrders(params = {}) {
    return httpClient.get('/orders', params)
  },

  /**
   * 获取订单详情
   */
  async getOrder(orderId) {
    return httpClient.get(`/orders/${orderId}`)
  },

  /**
   * 更新订单状态
   */
  async updateOrderStatus(orderId, status, transactionHash) {
    return httpClient.put(`/orders/${orderId}/status`, {
      status,
      transactionHash,
    })
  },
}

/**
 * 支付相关API
 */
export const paymentAPI = {
  /**
   * 创建支付订单
   */
  async createPayment(orderId, amount, currency = 'ETH') {
    return httpClient.post('/payments', {
      orderId,
      amount,
      currency,
    })
  },

  /**
   * 验证支付
   */
  async verifyPayment(paymentId, transactionHash) {
    return httpClient.post(`/payments/${paymentId}/verify`, {
      transactionHash,
    })
  },
}

/**
 * 用户相关API
 */
export const userAPI = {
  /**
   * 获取用户信息
   */
  async getUserProfile() {
    return httpClient.get('/user/profile')
  },

  /**
   * 更新用户信息
   */
  async updateUserProfile(profileData) {
    return httpClient.put('/user/profile', profileData)
  },

  /**
   * 获取用户订单历史
   */
  async getUserOrders(params = {}) {
    return httpClient.get('/user/orders', params)
  },
}

/**
 * 管理员相关API
 */
export const adminAPI = {
  /**
   * 获取系统统计
   */
  async getStats() {
    return httpClient.get('/admin/stats')
  },

  /**
   * 获取用户列表
   */
  async getUsers(params = {}) {
    return httpClient.get('/admin/users', params)
  },

  /**
   * 获取订单列表（管理员）
   */
  async getAllOrders(params = {}) {
    return httpClient.get('/admin/orders', params)
  },
}

/**
 * 错误处理工具
 */
export const handleAPIError = (error) => {
  console.error('API错误:', error)
  
  // 根据错误类型显示不同的提示
  if (error.message.includes('401')) {
    // 认证失败，清除token并跳转到登录
    authAPI.logout()
    const appStore = useAppStore()
    appStore.disconnectWallet()
    return '登录已过期，请重新连接钱包'
  } else if (error.message.includes('403')) {
    return '权限不足'
  } else if (error.message.includes('404')) {
    return '请求的资源不存在'
  } else if (error.message.includes('429')) {
    return '请求过于频繁，请稍后再试'
  } else if (error.message.includes('500')) {
    return '服务器内部错误，请稍后再试'
  } else {
    return error.message || '请求失败，请稍后再试'
  }
}

/**
 * 检查网络连接
 */
export const checkNetworkConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      timeout: 5000,
    })
    return response.ok
  } catch (error) {
    return false
  }
}

// 导出所有API
export default {
  auth: authAPI,
  product: productAPI,
  cart: cartAPI,
  order: orderAPI,
  payment: paymentAPI,
  user: userAPI,
  admin: adminAPI,
  handleAPIError,
  checkNetworkConnection,
}
