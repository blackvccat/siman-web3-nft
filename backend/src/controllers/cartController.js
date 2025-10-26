/**
 * 购物车路由控制器
 * 功能: 处理购物车相关的HTTP请求
 */

const { asyncHandler, AppError } = require('../utils')
const { cartDB, productDB } = require('../database/memoryDB')

/**
 * 获取用户购物车
 */
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id
  
  let cart = cartDB.findByUserId(userId)
  
  if (!cart) {
    cart = cartDB.create({ 
      userId, 
      items: [],
      totalItems: 0,
      totalPrice: '0'
    })
  }
  
  res.status(200).json({
    success: true,
    data: {
      items: cart.items || [],
      totalItems: cart.totalItems || 0,
      totalPrice: cart.totalPrice || '0'
    }
  })
})

/**
 * 添加商品到购物车
 */
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { productId, quantity = 1 } = req.body
  
  // 验证商品是否存在
  const product = productDB.findById(productId)
  if (!product) {
    throw new AppError('商品不存在', 404)
  }
  
  // 检查库存
  if (product.stock < quantity) {
    throw new AppError('库存不足', 400)
  }
  
  // 查找或创建购物车
  let cart = cartDB.findByUserId(userId)
  if (!cart) {
    cart = cartDB.create({ 
      userId, 
      items: [],
      totalItems: 0,
      totalPrice: '0'
    })
  }
  
  // 检查商品是否已在购物车中
  const existingItemIndex = cart.items.findIndex(item => item.productId === productId)
  
  if (existingItemIndex > -1) {
    // 更新现有商品数量
    cart.items[existingItemIndex].quantity += quantity
    cart.items[existingItemIndex].totalPrice = (cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity).toFixed(2)
  } else {
    // 添加新商品
    cart.items.push({
      id: 'cart_item_' + Date.now(),
      productId,
      quantity,
      price: product.price,
      totalPrice: (product.price * quantity).toFixed(2),
      addedAt: new Date().toISOString(),
      product: {
        id: product.id,
        name: product.name,
        image: product.image,
        rarity: product.rarity
      }
    })
  }
  
  // 更新购物车统计
  cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0)
  cart.totalPrice = cart.items.reduce((total, item) => {
    return (parseFloat(total) + parseFloat(item.totalPrice)).toFixed(2)
  }, '0')
  
  // 保存购物车
  cartDB.update(cart.id, cart)
  
  res.status(200).json({
    success: true,
    data: {
      items: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice
    },
    message: '商品已添加到购物车'
  })
})

/**
 * 更新购物车商品数量
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { cartItemId } = req.params
  const { quantity } = req.body
  
  // 模拟更新购物车商品
  const cartItem = {
    id: cartItemId,
    productId: 'prod_001',
    quantity,
    price: '0.8',
    totalPrice: (0.8 * quantity).toFixed(2),
    addedAt: new Date().toISOString(),
    product: {
      id: 'prod_001',
      name: '希漫红酒',
      image: '/images/nftred-wine-nft.jpg',
      rarity: 'rare'
    }
  }
  
  res.status(200).json({
    success: true,
    data: {
      items: [cartItem],
      totalItems: quantity,
      totalPrice: cartItem.totalPrice
    },
    message: '购物车已更新'
  })
})

/**
 * 删除购物车商品
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const { cartItemId } = req.params
  
  res.status(200).json({
    success: true,
    data: {
      items: [],
      totalItems: 0,
      totalPrice: '0'
    },
    message: '商品已从购物车移除'
  })
})

/**
 * 清空购物车
 */
const clearCart = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      items: [],
      totalItems: 0,
      totalPrice: '0'
    },
    message: '购物车已清空'
  })
})

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
}
