/**
 * API响应格式标准化中间件
 * 功能: 统一所有API的响应格式
 */

// 成功响应格式
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }
  
  res.status(statusCode).json(response)
}

// 错误响应格式
const errorResponse = (res, error, statusCode = 400) => {
  const response = {
    success: false,
    data: null,
    error: {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: error.details || null
    },
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }
  
  res.status(statusCode).json(response)
}

// 分页响应格式
const paginatedResponse = (res, data, pagination, message = 'Success') => {
  const response = {
    success: true,
    data: {
      items: data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || 0,
        pages: pagination.pages || 0,
        hasNext: pagination.hasNext || false,
        hasPrev: pagination.hasPrev || false
      }
    },
    message,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }
  
  res.status(200).json(response)
}

// 响应中间件
const responseMiddleware = (req, res, next) => {
  // 添加标准响应方法到res对象
  res.success = (data, message, statusCode) => successResponse(res, data, message, statusCode)
  res.error = (error, statusCode) => errorResponse(res, error, statusCode)
  res.paginated = (data, pagination, message) => paginatedResponse(res, data, pagination, message)
  
  next()
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  responseMiddleware
}
