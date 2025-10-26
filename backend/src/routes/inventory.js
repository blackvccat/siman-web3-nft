/**
 * 仓库管理路由
 * 功能: 处理库存管理、入库、出库、盘点等操作
 */

const express = require('express')
const { protect, restrictTo } = require('../middleware/auth')
const { productDB, inventoryDB } = require('../database/memoryDB')
const { asyncHandler, AppError } = require('../utils')
const { body, validationResult } = require('express-validator')

const router = express.Router()

// 初始化库存数据库
if (!inventoryDB) {
  const { memoryDB } = require('../database/memoryDB')
  memoryDB.inventory = new Map()
}

// 库存相关操作
const inventoryOperations = {
  // 获取库存记录
  getInventoryRecord: (productId) => {
    return memoryDB.inventory.get(productId)
  },
  
  // 创建库存记录
  createInventoryRecord: (productId, initialStock = 0) => {
    const record = {
      productId,
      currentStock: initialStock,
      reservedStock: 0,
      availableStock: initialStock,
      lowStockThreshold: 10,
      lastUpdated: new Date().toISOString(),
      history: []
    }
    memoryDB.inventory.set(productId, record)
    return record
  },
  
  // 更新库存
  updateStock: (productId, quantity, type, reason, operator) => {
    let record = memoryDB.inventory.get(productId)
    
    if (!record) {
      record = inventoryOperations.createInventoryRecord(productId, 0)
    }
    
    const oldStock = record.currentStock
    let newStock = oldStock
    
    switch (type) {
      case 'inbound':
        newStock = oldStock + quantity
        break
      case 'outbound':
        newStock = oldStock - quantity
        if (newStock < 0) {
          throw new AppError('库存不足', 400)
        }
        break
      case 'adjustment':
        newStock = quantity
        break
      case 'reserve':
        if (record.reservedStock + quantity > record.currentStock) {
          throw new AppError('可预留库存不足', 400)
        }
        record.reservedStock += quantity
        record.availableStock = record.currentStock - record.reservedStock
        break
      case 'unreserve':
        if (record.reservedStock < quantity) {
          throw new AppError('预留库存不足', 400)
        }
        record.reservedStock -= quantity
        record.availableStock = record.currentStock - record.reservedStock
        break
    }
    
    if (type !== 'reserve' && type !== 'unreserve') {
      record.currentStock = newStock
      record.availableStock = newStock - record.reservedStock
    }
    
    // 记录历史
    record.history.push({
      type,
      quantity,
      oldStock,
      newStock: record.currentStock,
      reason,
      operator,
      timestamp: new Date().toISOString()
    })
    
    record.lastUpdated = new Date().toISOString()
    
    // 更新商品库存
    const product = productDB.findById(productId)
    if (product) {
      productDB.update(productId, { stock: record.currentStock })
    }
    
    return record
  },
  
  // 获取所有库存记录
  getAllInventoryRecords: () => {
    return Array.from(memoryDB.inventory.values())
  }
}

/**
 * 获取库存概览
 */
router.get('/overview', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
  const records = inventoryOperations.getAllInventoryRecords()
  const products = productDB.findAll()
  
  const overview = {
    totalProducts: products.length,
    totalStock: records.reduce((sum, record) => sum + record.currentStock, 0),
    totalReserved: records.reduce((sum, record) => sum + record.reservedStock, 0),
    totalAvailable: records.reduce((sum, record) => sum + record.availableStock, 0),
    lowStockItems: records.filter(record => record.currentStock <= record.lowStockThreshold).length,
    outOfStockItems: records.filter(record => record.currentStock === 0).length,
    categories: {},
    alerts: []
  }
  
  // 按分类统计
  records.forEach(record => {
    const product = productDB.findById(record.productId)
    if (product) {
      const category = product.category
      if (!overview.categories[category]) {
        overview.categories[category] = {
          total: 0,
          available: 0,
          reserved: 0,
          lowStock: 0
        }
      }
      overview.categories[category].total += record.currentStock
      overview.categories[category].available += record.availableStock
      overview.categories[category].reserved += record.reservedStock
      if (record.currentStock <= record.lowStockThreshold) {
        overview.categories[category].lowStock++
      }
    }
  })
  
  // 生成警告
  records.forEach(record => {
    const product = productDB.findById(record.productId)
    if (product) {
      if (record.currentStock === 0) {
        overview.alerts.push({
          type: 'out_of_stock',
          productId: record.productId,
          productName: product.name,
          message: `${product.name} 已缺货`
        })
      } else if (record.currentStock <= record.lowStockThreshold) {
        overview.alerts.push({
          type: 'low_stock',
          productId: record.productId,
          productName: product.name,
          currentStock: record.currentStock,
          threshold: record.lowStockThreshold,
          message: `${product.name} 库存不足 (${record.currentStock}/${record.lowStockThreshold})`
        })
      }
    }
  })
  
  res.status(200).json({
    success: true,
    data: overview
  })
}))

/**
 * 获取库存列表
 */
router.get('/', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, status, search } = req.query
  
  let records = inventoryOperations.getAllInventoryRecords()
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
  
  // 状态过滤
  if (status) {
    if (status === 'low_stock') {
      products = products.filter(p => {
        const record = inventoryOperations.getInventoryRecord(p.id)
        return record && record.currentStock <= record.lowStockThreshold
      })
    } else if (status === 'out_of_stock') {
      products = products.filter(p => {
        const record = inventoryOperations.getInventoryRecord(p.id)
        return record && record.currentStock === 0
      })
    } else if (status === 'in_stock') {
      products = products.filter(p => {
        const record = inventoryOperations.getInventoryRecord(p.id)
        return record && record.currentStock > record.lowStockThreshold
      })
    }
  }
  
  // 合并库存信息
  const inventoryList = products.map(product => {
    const record = inventoryOperations.getInventoryRecord(product.id)
    return {
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      category: product.category,
      currentStock: record ? record.currentStock : 0,
      reservedStock: record ? record.reservedStock : 0,
      availableStock: record ? record.availableStock : 0,
      lowStockThreshold: record ? record.lowStockThreshold : 10,
      lastUpdated: record ? record.lastUpdated : null,
      status: record ? 
        (record.currentStock === 0 ? 'out_of_stock' : 
         record.currentStock <= record.lowStockThreshold ? 'low_stock' : 'in_stock') : 
        'no_record'
    }
  })
  
  // 分页
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + parseInt(limit)
  const paginatedList = inventoryList.slice(startIndex, endIndex)
  
  res.status(200).json({
    success: true,
    data: {
      inventory: paginatedList,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: inventoryList.length,
        pages: Math.ceil(inventoryList.length / limit)
      }
    }
  })
}))

/**
 * 获取商品库存详情
 */
router.get('/:productId', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
  const { productId } = req.params
  
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  const record = inventoryOperations.getInventoryRecord(productId)
  if (!record) {
    throw new AppError('库存记录不存在', 404)
  }
  
  res.status(200).json({
    success: true,
    data: {
      product: {
        id: product.id,
        name: product.name,
        image: product.image,
        category: product.category
      },
      inventory: record
    }
  })
}))

/**
 * 入库操作
 */
router.post('/:productId/inbound', protect, restrictTo('admin'), [
  body('quantity').isInt({ min: 1 }).withMessage('入库数量必须大于0'),
  body('reason').optional().isString().withMessage('入库原因格式不正确')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { productId } = req.params
  const { quantity, reason = '入库' } = req.body
  
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  const record = inventoryOperations.updateStock(
    productId, 
    quantity, 
    'inbound', 
    reason, 
    req.user.email
  )
  
  res.status(200).json({
    success: true,
    data: record,
    message: '入库成功'
  })
}))

/**
 * 出库操作
 */
router.post('/:productId/outbound', protect, restrictTo('admin'), [
  body('quantity').isInt({ min: 1 }).withMessage('出库数量必须大于0'),
  body('reason').optional().isString().withMessage('出库原因格式不正确')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { productId } = req.params
  const { quantity, reason = '出库' } = req.body
  
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  const record = inventoryOperations.updateStock(
    productId, 
    quantity, 
    'outbound', 
    reason, 
    req.user.email
  )
  
  res.status(200).json({
    success: true,
    data: record,
    message: '出库成功'
  })
}))

/**
 * 库存调整
 */
router.post('/:productId/adjustment', protect, restrictTo('admin'), [
  body('quantity').isInt({ min: 0 }).withMessage('调整数量必须大于等于0'),
  body('reason').notEmpty().withMessage('调整原因不能为空')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { productId } = req.params
  const { quantity, reason } = req.body
  
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  const record = inventoryOperations.updateStock(
    productId, 
    quantity, 
    'adjustment', 
    reason, 
    req.user.email
  )
  
  res.status(200).json({
    success: true,
    data: record,
    message: '库存调整成功'
  })
}))

/**
 * 预留库存
 */
router.post('/:productId/reserve', protect, restrictTo('admin'), [
  body('quantity').isInt({ min: 1 }).withMessage('预留数量必须大于0'),
  body('reason').optional().isString().withMessage('预留原因格式不正确')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { productId } = req.params
  const { quantity, reason = '预留' } = req.body
  
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  const record = inventoryOperations.updateStock(
    productId, 
    quantity, 
    'reserve', 
    reason, 
    req.user.email
  )
  
  res.status(200).json({
    success: true,
    data: record,
    message: '库存预留成功'
  })
}))

/**
 * 取消预留
 */
router.post('/:productId/unreserve', protect, restrictTo('admin'), [
  body('quantity').isInt({ min: 1 }).withMessage('取消预留数量必须大于0'),
  body('reason').optional().isString().withMessage('取消预留原因格式不正确')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { productId } = req.params
  const { quantity, reason = '取消预留' } = req.body
  
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  const record = inventoryOperations.updateStock(
    productId, 
    quantity, 
    'unreserve', 
    reason, 
    req.user.email
  )
  
  res.status(200).json({
    success: true,
    data: record,
    message: '取消预留成功'
  })
}))

/**
 * 设置低库存阈值
 */
router.put('/:productId/threshold', protect, restrictTo('admin'), [
  body('threshold').isInt({ min: 0 }).withMessage('阈值必须大于等于0')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { productId } = req.params
  const { threshold } = req.body
  
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  let record = inventoryOperations.getInventoryRecord(productId)
  if (!record) {
    record = inventoryOperations.createInventoryRecord(productId, 0)
  }
  
  record.lowStockThreshold = threshold
  record.lastUpdated = new Date().toISOString()
  
  res.status(200).json({
    success: true,
    data: record,
    message: '阈值设置成功'
  })
}))

/**
 * 获取库存历史记录
 */
router.get('/:productId/history', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
  const { productId } = req.params
  const { page = 1, limit = 20 } = req.query
  
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  const record = inventoryOperations.getInventoryRecord(productId)
  if (!record) {
    throw new AppError('库存记录不存在', 404)
  }
  
  // 分页历史记录
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + parseInt(limit)
  const paginatedHistory = record.history.slice(startIndex, endIndex)
  
  res.status(200).json({
    success: true,
    data: {
      product: {
        id: product.id,
        name: product.name
      },
      history: paginatedHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: record.history.length,
        pages: Math.ceil(record.history.length / limit)
      }
    }
  })
}))

/**
 * 批量入库
 */
router.post('/batch-inbound', protect, restrictTo('admin'), [
  body('items').isArray({ min: 1 }).withMessage('请选择要入库的商品'),
  body('reason').optional().isString().withMessage('入库原因格式不正确')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { items, reason = '批量入库' } = req.body
  const results = []
  
  for (const item of items) {
    const { productId, quantity } = item
    
    if (!productId || !quantity || quantity <= 0) {
      results.push({
        productId,
        success: false,
        error: '商品ID或数量无效'
      })
      continue
    }
    
    try {
      const product = productDB.findById(productId)
      if (!product) {
        results.push({
          productId,
          success: false,
          error: '商品不存在'
        })
        continue
      }
      
      const record = inventoryOperations.updateStock(
        productId, 
        quantity, 
        'inbound', 
        reason, 
        req.user.email
      )
      
      results.push({
        productId,
        productName: product.name,
        quantity,
        success: true,
        newStock: record.currentStock
      })
    } catch (error) {
      results.push({
        productId,
        success: false,
        error: error.message
      })
    }
  }
  
  const successCount = results.filter(r => r.success).length
  
  res.status(200).json({
    success: true,
    data: {
      results,
      summary: {
        total: items.length,
        success: successCount,
        failed: items.length - successCount
      }
    },
    message: `批量入库完成，成功 ${successCount} 个，失败 ${items.length - successCount} 个`
  })
}))

module.exports = router
