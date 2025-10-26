/**
 * 限流中间件
 * 功能: 限制API请求频率，防止滥用
 */

const rateLimit = require('express-rate-limit')

/**
 * 通用限流配置
 */
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: message || '请求过于频繁，请稍后再试'
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: '请求过于频繁，请稍后再试'
        }
      })
    }
  })
}

/**
 * 严格限流 - 用于敏感操作
 */
const strictLimiter = createRateLimit(
  15 * 60 * 1000, // 15分钟
  5, // 最多5次请求
  '操作过于频繁，请15分钟后再试'
)

/**
 * 中等限流 - 用于一般API
 */
const mediumLimiter = createRateLimit(
  15 * 60 * 1000, // 15分钟
  100, // 最多100次请求
  '请求过于频繁，请稍后再试'
)

/**
 * 宽松限流 - 用于公开API
 */
const lenientLimiter = createRateLimit(
  15 * 60 * 1000, // 15分钟
  1000, // 最多1000次请求
  '请求过于频繁，请稍后再试'
)

/**
 * 认证相关限流
 */
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15分钟
  10, // 最多10次登录尝试
  '登录尝试过于频繁，请15分钟后再试'
)

/**
 * 密码重置限流
 */
const passwordResetLimiter = createRateLimit(
  60 * 60 * 1000, // 1小时
  3, // 最多3次密码重置请求
  '密码重置请求过于频繁，请1小时后再试'
)

/**
 * 文件上传限流
 */
const uploadLimiter = createRateLimit(
  60 * 60 * 1000, // 1小时
  20, // 最多20次文件上传
  '文件上传过于频繁，请1小时后再试'
)

/**
 * 默认限流中间件
 */
const rateLimiter = mediumLimiter

module.exports = {
  strictLimiter,
  mediumLimiter,
  lenientLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  rateLimiter
}
