/**
 * 认证中间件
 * 功能: 验证JWT token，保护需要认证的路由
 */

const jwt = require('jsonwebtoken')
const { AppError } = require('../utils')

/**
 * 保护路由中间件 - 验证JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token
    
    // 从请求头获取token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    
    if (!token) {
      return next(new AppError('请先登录', 401))
    }
    
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret')
    
    // 模拟用户信息（实际项目中应该从数据库获取）
    const user = {
      id: decoded.id,
      walletAddress: decoded.walletAddress,
      role: decoded.role || 'user'
    }
    
    // 将用户信息添加到请求对象
    req.user = user
    next()
  } catch (error) {
    return next(new AppError('Token无效', 401))
  }
}

/**
 * 角色权限中间件
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('权限不足', 403))
    }
    next()
  }
}

/**
 * Web3钱包签名验证中间件
 */
const verifyWeb3Signature = async (req, res, next) => {
  try {
    const { walletAddress, signature, nonce } = req.body
    
    if (!walletAddress || !signature || !nonce) {
      return next(new AppError('缺少必要参数', 400))
    }
    
    // 这里应该实现Web3签名验证逻辑
    // 使用ethers.js或web3.js验证签名
    
    // 临时实现 - 实际项目中需要真正的签名验证
    const isValidSignature = true // 这里应该是真正的验证逻辑
    
    if (!isValidSignature) {
      return next(new AppError('签名验证失败', 401))
    }
    
    req.walletAddress = walletAddress
    next()
  } catch (error) {
    return next(new AppError('签名验证错误', 401))
  }
}

module.exports = {
  protect,
  restrictTo,
  verifyWeb3Signature
}
