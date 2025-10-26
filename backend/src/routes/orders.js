/**
 * 订单路由
 * 功能: 处理订单相关的API请求
 */

const express = require('express')
const { protect, restrictTo } = require('../middleware/auth')

const router = express.Router()

/**
 * 创建订单
 */
router.post('/', protect, async (req, res) => {
  try {
    const orderData = req.body
    
    const order = {
      orderId: 'ORDER_' + Date.now(),
      userId: req.user.id,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      status: 'pending',
      paymentMethod: orderData.paymentMethod,
      totalAmount: orderData.totalAmount,
      createdAt: new Date().toISOString()
    }
    
    res.status(201).json({
      success: true,
      data: order,
      message: '订单创建成功'
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
 * 获取订单列表
 */
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    
    // 模拟订单数据
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

/**
 * 获取订单详情
 */
router.get('/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params
    
    // 模拟订单详情
    const order = {
      orderId,
      status: 'pending',
      totalAmount: '1.6',
      items: [
        {
          productId: 'prod_001',
          quantity: 2,
          price: '0.8'
        }
      ],
      createdAt: new Date().toISOString()
    }
    
    res.status(200).json({
      success: true,
      data: order
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
 * 更新订单状态（管理员）
 */
router.put('/:orderId/status', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { orderId } = req.params
    const { status, transactionHash } = req.body
    
    res.status(200).json({
      success: true,
      data: {
        orderId,
        status,
        transactionHash,
        updatedAt: new Date().toISOString()
      },
      message: '订单状态更新成功'
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
