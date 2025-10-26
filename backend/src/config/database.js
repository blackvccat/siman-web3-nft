/**
 * 数据库连接配置
 * 功能: 连接MongoDB数据库或使用内存数据库
 */

const mongoose = require('mongoose')
const { initializeSampleData } = require('../database/memoryDB')

const connectDB = async () => {
  try {
    // 检查是否设置了MongoDB URI
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'mongodb://localhost:27017/siman_nft') {
      console.log('⚠️  MongoDB URI not configured, using memory database')
      
      // 初始化示例数据
      initializeSampleData()
      
      return
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`)
    
    // 初始化示例数据
    initializeSampleData()
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, using memory database:', error.message)
    
    // 初始化示例数据
    initializeSampleData()
  }
}

module.exports = connectDB
