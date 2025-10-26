/**
 * 商品管理路由
 * 功能: 处理商品CRUD操作，包括图片上传、分类管理等
 */

const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { protect, restrictTo } = require('../middleware/auth')
const { productDB } = require('../database/memoryDB')
const { asyncHandler, AppError } = require('../utils')
const { body, validationResult } = require('express-validator')

const router = express.Router()

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './uploads/products'
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new AppError('只允许上传图片文件', 400))
    }
  }
})

/**
 * 获取商品列表（管理员）
 */
router.get('/', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, rarity, status, search } = req.query
  
  let products = productDB.findAll()
  
  // 搜索过滤
  if (search) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  // 分类过滤
  if (category) {
    products = products.filter(p => p.category === category)
  }
  
  // 稀有度过滤
  if (rarity) {
    products = products.filter(p => p.rarity === rarity)
  }
  
  // 状态过滤
  if (status) {
    products = products.filter(p => p.status === status)
  }
  
  // 分页
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + parseInt(limit)
  const paginatedProducts = products.slice(startIndex, endIndex)
  
  res.status(200).json({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: products.length,
        pages: Math.ceil(products.length / limit)
      }
    }
  })
}))

/**
 * 获取商品详情
 */
router.get('/:productId', asyncHandler(async (req, res) => {
  const { productId } = req.params
  
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  res.status(200).json({
    success: true,
    data: product
  })
}))

/**
 * 创建商品（管理员）
 */
router.post('/', protect, restrictTo('admin'), upload.single('image'), [
  body('name').notEmpty().withMessage('商品名称不能为空'),
  body('description').notEmpty().withMessage('商品描述不能为空'),
  body('price').isNumeric().withMessage('价格必须是数字'),
  body('category').notEmpty().withMessage('商品分类不能为空'),
  body('rarity').notEmpty().withMessage('稀有度不能为空'),
  body('stock').isInt({ min: 0 }).withMessage('库存必须是非负整数')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const {
    name,
    description,
    price,
    category,
    rarity,
    stock,
    metadata
  } = req.body
  
  // 处理图片路径
  let imagePath = '/images/default-product.jpg'
  if (req.file) {
    imagePath = `/uploads/products/${req.file.filename}`
  }
  
  // 解析metadata
  let parsedMetadata = {}
  if (metadata) {
    try {
      parsedMetadata = JSON.parse(metadata)
    } catch (error) {
      throw new AppError('商品元数据格式不正确', 400)
    }
  }
  
  const productData = {
    name,
    description,
    price: parseFloat(price),
    category,
    rarity,
    stock: parseInt(stock),
    image: imagePath,
    metadata: parsedMetadata,
    status: 'active',
    views: 0,
    sales: 0
  }
  
  const product = productDB.create(productData)
  
  res.status(201).json({
    success: true,
    data: product,
    message: '商品创建成功'
  })
}))

/**
 * 更新商品（管理员）
 */
router.put('/:productId', protect, restrictTo('admin'), upload.single('image'), [
  body('name').optional().notEmpty().withMessage('商品名称不能为空'),
  body('description').optional().notEmpty().withMessage('商品描述不能为空'),
  body('price').optional().isNumeric().withMessage('价格必须是数字'),
  body('category').optional().notEmpty().withMessage('商品分类不能为空'),
  body('rarity').optional().notEmpty().withMessage('稀有度不能为空'),
  body('stock').optional().isInt({ min: 0 }).withMessage('库存必须是非负整数')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { productId } = req.params
  const product = productDB.findById(productId)
  
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  const updateData = { ...req.body }
  
  // 处理图片更新
  if (req.file) {
    updateData.image = `/uploads/products/${req.file.filename}`
    
    // 删除旧图片
    if (product.image && product.image.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, '../../', product.image)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
      }
    }
  }
  
  // 处理数值类型
  if (updateData.price) {
    updateData.price = parseFloat(updateData.price)
  }
  if (updateData.stock) {
    updateData.stock = parseInt(updateData.stock)
  }
  
  // 处理metadata
  if (updateData.metadata) {
    try {
      updateData.metadata = JSON.parse(updateData.metadata)
    } catch (error) {
      throw new AppError('商品元数据格式不正确', 400)
    }
  }
  
  const updatedProduct = productDB.update(productId, updateData)
  
  res.status(200).json({
    success: true,
    data: updatedProduct,
    message: '商品更新成功'
  })
}))

/**
 * 删除商品（管理员）
 */
router.delete('/:productId', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
  const { productId } = req.params
  const product = productDB.findById(productId)
  
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  // 删除商品图片
  if (product.image && product.image.startsWith('/uploads/')) {
    const imagePath = path.join(__dirname, '../../', product.image)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }
  }
  
  productDB.delete(productId)
  
  res.status(200).json({
    success: true,
    message: '商品删除成功'
  })
}))

/**
 * 更新商品状态（管理员）
 */
router.patch('/:productId/status', protect, restrictTo('admin'), [
  body('status').isIn(['active', 'inactive', 'sold_out']).withMessage('状态值不正确')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('状态值不正确', 400)
  }
  
  const { productId } = req.params
  const { status } = req.body
  
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  const updatedProduct = productDB.update(productId, { status })
  
  res.status(200).json({
    success: true,
    data: updatedProduct,
    message: '商品状态更新成功'
  })
}))

/**
 * 批量更新商品（管理员）
 */
router.patch('/batch-update', protect, restrictTo('admin'), [
  body('productIds').isArray({ min: 1 }).withMessage('请选择要更新的商品'),
  body('updateData').isObject().withMessage('更新数据格式不正确')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { productIds, updateData } = req.body
  const updatedProducts = []
  
  for (const productId of productIds) {
    const product = productDB.findById(productId)
    if (product) {
      const updatedProduct = productDB.update(productId, updateData)
      updatedProducts.push(updatedProduct)
    }
  }
  
  res.status(200).json({
    success: true,
    data: {
      updatedCount: updatedProducts.length,
      products: updatedProducts
    },
    message: `成功更新 ${updatedProducts.length} 个商品`
  })
}))

/**
 * 获取商品分类列表
 */
router.get('/categories/list', asyncHandler(async (req, res) => {
  const categories = [
    { id: 'wine', name: '红酒', description: '传统红酒系列' },
    { id: 'whisky', name: '威士忌', description: '精选威士忌系列' },
    { id: 'baijiu', name: '白酒', description: '中国白酒系列' },
    { id: 'beer', name: '啤酒', description: '精酿啤酒系列' },
    { id: 'spirits', name: '烈酒', description: '其他烈酒系列' }
  ]
  
  res.status(200).json({
    success: true,
    data: categories
  })
}))

/**
 * 获取稀有度列表
 */
router.get('/rarities/list', asyncHandler(async (req, res) => {
  const rarities = [
    { id: 'common', name: '普通', color: '#6B7280', probability: 60 },
    { id: 'rare', name: '稀有', color: '#3B82F6', probability: 25 },
    { id: 'epic', name: '史诗', color: '#8B5CF6', probability: 12 },
    { id: 'legendary', name: '传说', color: '#F59E0B', probability: 3 }
  ]
  
  res.status(200).json({
    success: true,
    data: rarities
  })
}))

/**
 * 获取商品统计信息（管理员）
 */
router.get('/stats/overview', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
  const products = productDB.findAll()
  
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    soldOut: products.filter(p => p.status === 'sold_out').length,
    lowStock: products.filter(p => p.stock < 10).length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
    totalSales: products.reduce((sum, p) => sum + (p.sales || 0), 0),
    categories: {},
    rarities: {}
  }
  
  // 按分类统计
  products.forEach(product => {
    stats.categories[product.category] = (stats.categories[product.category] || 0) + 1
    stats.rarities[product.rarity] = (stats.rarities[product.rarity] || 0) + 1
  })
  
  res.status(200).json({
    success: true,
    data: stats
  })
}))

module.exports = router
