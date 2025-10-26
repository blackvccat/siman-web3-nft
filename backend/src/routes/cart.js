/**
 * 购物车路由
 * 功能: 定义购物车相关的API路由
 */

const express = require('express')
const { protect } = require('../middleware/auth')
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController')

const router = express.Router()

// 所有路由都需要认证
router.use(protect)

// 获取购物车
router.get('/', getCart)

// 添加商品到购物车
router.post('/', addToCart)

// 更新购物车商品数量
router.put('/:cartItemId', updateCartItem)

// 删除购物车商品
router.delete('/:cartItemId', removeFromCart)

// 清空购物车
router.delete('/', clearCart)

module.exports = router
