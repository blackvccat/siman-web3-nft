/**
 * 全局错误处理中间件
 * 功能: 统一处理应用中的错误
 */

const { AppError } = require('../utils')

/**
 * 开发环境错误处理
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message,
      stack: err.stack,
      details: err.details
    }
  })
}

/**
 * 生产环境错误处理
 */
const sendErrorProd = (err, res) => {
  // 操作错误：发送消息给客户端
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'OPERATIONAL_ERROR',
        message: err.message
      }
    })
  } else {
    // 编程错误：不泄露错误详情
    console.error('ERROR 💥', err)
    
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误'
      }
    })
  }
}

/**
 * 处理JWT错误
 */
const handleJWTError = () => new AppError('Token无效，请重新登录', 401)

/**
 * 处理JWT过期错误
 */
const handleJWTExpiredError = () => new AppError('Token已过期，请重新登录', 401)

/**
 * 处理MongoDB重复键错误
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const message = `重复字段值: ${value}. 请使用其他值`
  return new AppError(message, 400)
}

/**
 * 处理MongoDB验证错误
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `输入数据无效: ${errors.join('. ')}`
  return new AppError(message, 400)
}

/**
 * 处理MongoDB Cast错误
 */
const handleCastErrorDB = (err) => {
  const message = `无效的 ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else {
    let error = { ...err }
    error.message = err.message

    // MongoDB错误处理
    if (err.name === 'CastError') error = handleCastErrorDB(error)
    if (err.code === 11000) error = handleDuplicateFieldsDB(error)
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (err.name === 'JsonWebTokenError') error = handleJWTError()
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, res)
  }
}

module.exports = errorHandler
