/**
 * 用户路由
 * 功能: 处理用户相关的API请求
 */

const express = require('express')
const { protect } = require('../middleware/auth')

const router = express.Router()

/**
 * 获取用户信息
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = {
      walletAddress: req.user.walletAddress,
      role: req.user.role,
      createdAt: new Date().toISOString()
    }
    
    res.status(200).json({
      success: true,
      data: user
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
 * 更新用户信息
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const profileData = req.body
    
    res.status(200).json({
      success: true,
      data: {
        ...profileData,
        updatedAt: new Date().toISOString()
      },
      message: '用户信息更新成功'
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
 * 获取用户订单历史
 */
router.get('/orders', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    
    // 模拟用户订单数据
    const orders = [
      {
        orderId: 'ORDER_001',
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
