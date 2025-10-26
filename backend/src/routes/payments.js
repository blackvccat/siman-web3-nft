/**
 * 支付路由
 * 功能: 处理支付相关的API请求
 */

const express = require('express')
const { protect } = require('../middleware/auth')

const router = express.Router()

/**
 * 创建支付订单
 */
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, amount, currency = 'ETH' } = req.body
    
    const payment = {
      paymentId: 'PAYMENT_' + Date.now(),
      orderId,
      paymentAddress: '0x' + Math.random().toString(16).substr(2, 40),
      amount,
      currency,
      status: 'pending',
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1小时后过期
      createdAt: new Date().toISOString()
    }
    
    res.status(201).json({
      success: true,
      data: payment,
      message: '支付订单创建成功'
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
 * 验证支付
 */
router.post('/:paymentId/verify', protect, async (req, res) => {
  try {
    const { paymentId } = req.params
    const { transactionHash } = req.body
    
    res.status(200).json({
      success: true,
      data: {
        paymentId,
        transactionHash,
        status: 'verified',
        verifiedAt: new Date().toISOString()
      },
      message: '支付验证成功'
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
