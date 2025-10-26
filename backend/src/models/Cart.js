/**
 * 购物车数据模型
 * 功能: 定义购物车数据结构，包含商品项和用户信息
 */

const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 99
  },
  price: {
    type: String,
    required: true
  },
  totalPrice: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
})

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: String,
    default: '0'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// 更新购物车统计信息
cartSchema.methods.updateTotals = function() {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0)
  this.totalPrice = this.items.reduce((total, item) => {
    return (parseFloat(total) + parseFloat(item.totalPrice)).toFixed(2)
  }, '0')
  this.updatedAt = new Date()
}

// 添加商品到购物车
cartSchema.methods.addItem = function(productId, quantity, price) {
  const existingItem = this.items.find(item => 
    item.productId.toString() === productId.toString()
  )
  
  if (existingItem) {
    existingItem.quantity += quantity
    existingItem.totalPrice = (existingItem.price * existingItem.quantity).toFixed(2)
  } else {
    this.items.push({
      productId,
      quantity,
      price,
      totalPrice: (price * quantity).toFixed(2)
    })
  }
  
  this.updateTotals()
}

// 更新商品数量
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => 
    item.productId.toString() === productId.toString()
  )
  
  if (item) {
    if (quantity <= 0) {
      this.removeItem(productId)
    } else {
      item.quantity = quantity
      item.totalPrice = (item.price * quantity).toFixed(2)
      this.updateTotals()
    }
  }
}

// 移除商品
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.productId.toString() !== productId.toString()
  )
  this.updateTotals()
}

// 清空购物车
cartSchema.methods.clearCart = function() {
  this.items = []
  this.updateTotals()
}

// 索引
cartSchema.index({ userId: 1 })
cartSchema.index({ updatedAt: -1 })

module.exports = mongoose.model('Cart', cartSchema)
