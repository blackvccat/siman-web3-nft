/**
 * 主应用入口文件
 * 功能: 初始化Express应用，配置中间件，启动服务器
 */

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
require('dotenv').config()

// 导入路由
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/orders')
const paymentRoutes = require('./routes/payments')
const userRoutes = require('./routes/users')
const adminRoutes = require('./routes/admin')
const adminProductRoutes = require('./routes/admin-products')
const inventoryRoutes = require('./routes/inventory')

// 导入中间件
const errorHandler = require('./middleware/errorHandler')
const { rateLimiter } = require('./middleware/rateLimiter')
const { responseMiddleware } = require('./middleware/responseFormatter')

// 导入数据库连接
const connectDB = require('./config/database')

const app = express()

// 连接数据库
connectDB()

// 安全中间件
app.use(helmet())
app.use(mongoSanitize())
app.use(hpp())

// CORS配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
  credentials: true
}))

// 压缩响应
app.use(compression())

// 请求日志
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// HTTPS重定向中间件 (生产环境)
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`)
  } else {
    next()
  }
})

// 限流中间件
app.use(rateLimiter)

// 响应格式中间件
app.use(responseMiddleware)

// 健康检查端点
app.get('/health', (req, res) => {
  res.success({
    status: 'healthy',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  }, 'Server is running')
})

// API版本管理中间件
app.use('/api/v1', (req, res, next) => {
  req.apiVersion = 'v1'
  res.set('API-Version', '1.0.0')
  next()
})

// API路由
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/admin/products', adminProductRoutes)
app.use('/api/v1/admin/inventory', inventoryRoutes)

// 404处理
app.use('*', (req, res) => {
  res.error({
    code: 'NOT_FOUND',
    message: 'API endpoint not found',
    details: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`
  }, 404)
})

// 全局错误处理
app.use(errorHandler)

const PORT = process.env.PORT || 3004

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
})

module.exports = app
