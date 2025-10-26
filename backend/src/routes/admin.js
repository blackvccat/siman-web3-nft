/**
 * 管理员路由
 * 功能: 处理管理员相关的API请求
 */

const express = require('express')
const { protect, restrictTo } = require('../middleware/auth')

const router = express.Router()

// 所有管理员路由都需要管理员权限
router.use(protect)
router.use(restrictTo('admin'))

/**
 * 获取系统统计
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalUsers: 100,
      totalOrders: 50,
      totalProducts: 6,
      totalRevenue: '150.5',
      createdAt: new Date().toISOString()
    }
    
    res.status(200).json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误'
      }
    })
  }
})

/**
 * 获取用户列表
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    
    // 模拟用户数据
    const users = [
      {
        walletAddress: '0x1234...',
        role: 'user',
        createdAt: new Date().toISOString()
      }
    ]
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: users.length,
          pages: 1
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误'
      }
    })
  }
})

/**
 * 获取所有订单（管理员）
 */
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    
    // 模拟订单数据
    const orders = [
      {
        orderId: 'ORDER_001',
        userId: '0x1234...',
        status: 'pending',
        totalAmount: '1.6',
        createdAt: new Date().toISOString()
      }
    ]
    
    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: orders.length,
          pages: 1
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误'
      }
    })
  }
})

module.exports = router
