/**
 * 工具函数集合
 * 功能: 提供常用的工具函数
 */

const jwt = require('jsonwebtoken')

/**
 * 异步处理包装器
 * 功能: 自动捕获异步函数中的错误
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

/**
 * 自定义错误类
 * 功能: 创建自定义错误对象
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 生成JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  })
}

/**
 * 验证Web3签名
 */
const verifyWeb3Signature = (message, signature, address) => {
  // 这里应该实现真正的Web3签名验证
  // 使用ethers.js或web3.js
  return true // 临时返回true
}

/**
 * 格式化响应数据
 */
const formatResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  }
}

/**
 * 分页处理
 */
const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  return { skip, limit: parseInt(limit) }
}

/**
 * 生成订单号
 */
const generateOrderId = () => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substr(2, 5)
  return `ORDER_${timestamp}_${random}`.toUpperCase()
}

/**
 * 生成支付地址
 */
const generatePaymentAddress = () => {
  // 这里应该生成真实的以太坊地址
  return '0x' + Math.random().toString(16).substr(2, 40)
}

/**
 * 验证以太坊地址
 */
const isValidEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * 计算ETH价格
 */
const calculateETHPrice = (usdPrice, ethRate) => {
  return (usdPrice / ethRate).toFixed(6)
}

/**
 * 生成随机nonce
 */
const generateNonce = () => {
  return Math.random().toString(36).substr(2, 15)
}

/**
 * 验证邮箱格式
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 生成文件上传路径
 */
const generateUploadPath = (originalName) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 5)
  const extension = originalName.split('.').pop()
  return `${timestamp}_${random}.${extension}`
}

/**
 * 清理HTML标签
 */
const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * 截断字符串
 */
const truncateString = (str, length = 100) => {
  if (str.length <= length) return str
  return str.substr(0, length) + '...'
}

/**
 * 深度克隆对象
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 防抖函数
 */
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 */
const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

module.exports = {
  asyncHandler,
  AppError,
  generateToken,
  verifyWeb3Signature,
  formatResponse,
  paginate,
  generateOrderId,
  generatePaymentAddress,
  isValidEthereumAddress,
  calculateETHPrice,
  generateNonce,
  isValidEmail,
  isValidPhone,
  generateUploadPath,
  stripHtmlTags,
  truncateString,
  deepClone,
  debounce,
  throttle
}
