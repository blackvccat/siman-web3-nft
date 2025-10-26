/**
 * 商品路由
 * 功能: 处理商品相关的API请求
 */

const express = require('express')
const { protect, restrictTo } = require('../middleware/auth')
const { productDB } = require('../database/memoryDB')

const router = express.Router()

/**
 * 获取商品列表
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, rarity } = req.query
    
    // 获取商品数据
    const products = productDB.findAll({ category, rarity })
    
    // 分页
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const paginatedProducts = products.slice(startIndex, endIndex)
    
    res.paginated(paginatedProducts, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: products.length,
      pages: Math.ceil(products.length / limit),
      hasNext: endIndex < products.length,
      hasPrev: startIndex > 0
    }, '商品列表获取成功')
  } catch (error) {
    res.error({
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误',
      details: error.message
    }, 500)
  }
})

/**
 * 获取商品详情
 */
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params
    
    const product = productDB.findById(productId)
    if (!product) {
      return res.error({
        code: 'NOT_FOUND',
        message: '商品不存在'
      }, 404)
    }
    
    res.success(product, '商品详情获取成功')
  } catch (error) {
    res.error({
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误',
      details: error.message
    }, 500)
  }
})

/**
 * 创建商品（管理员）
 */
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const productData = req.body
    
    const newProduct = {
      ...productData,
      id: 'prod_' + Date.now(),
      createdAt: new Date().toISOString()
    }
    
    res.success(newProduct, '商品创建成功', 201)
  } catch (error) {
    res.error({
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误',
      details: error.message
    }, 500)
  }
})

module.exports = router
