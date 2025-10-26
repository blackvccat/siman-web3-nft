/**
 * 内存数据库配置
 * 功能: 使用内存存储模拟数据库，用于开发和测试
 */

// 内存数据库
const memoryDB = {
  users: new Map(),
  products: new Map(),
  carts: new Map(),
  orders: new Map(),
  payments: new Map()
}

// 生成ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// 用户相关操作
const userDB = {
  create: (userData) => {
    const id = generateId()
    const user = {
      id,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    memoryDB.users.set(id, user)
    return user
  },
  
  findById: (id) => {
    return memoryDB.users.get(id)
  },
  
  findByEmail: (email) => {
    for (const user of memoryDB.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  },
  
  findByWalletAddress: (walletAddress) => {
    for (const user of memoryDB.users.values()) {
      if (user.walletAddress === walletAddress) {
        return user
      }
    }
    return null
  },
  
  update: (id, updateData) => {
    const user = memoryDB.users.get(id)
    if (user) {
      const updatedUser = {
        ...user,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      memoryDB.users.set(id, updatedUser)
      return updatedUser
    }
    return null
  },
  
  delete: (id) => {
    return memoryDB.users.delete(id)
  },
  
  findAll: () => {
    return Array.from(memoryDB.users.values())
  }
}

// 商品相关操作
const productDB = {
  create: (productData) => {
    const id = generateId()
    const product = {
      id,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    memoryDB.products.set(id, product)
    return product
  },
  
  findById: (id) => {
    return memoryDB.products.get(id)
  },
  
  findAll: (filters = {}) => {
    let products = Array.from(memoryDB.products.values())
    
    if (filters.category) {
      products = products.filter(p => p.category === filters.category)
    }
    if (filters.rarity) {
      products = products.filter(p => p.rarity === filters.rarity)
    }
    
    return products
  },
  
  update: (id, updateData) => {
    const product = memoryDB.products.get(id)
    if (product) {
      const updatedProduct = {
        ...product,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      memoryDB.products.set(id, updatedProduct)
      return updatedProduct
    }
    return null
  },
  
  delete: (id) => {
    return memoryDB.products.delete(id)
  }
}

// 购物车相关操作
const cartDB = {
  findByUserId: (userId) => {
    for (const cart of memoryDB.carts.values()) {
      if (cart.userId === userId) {
        return cart
      }
    }
    return null
  },
  
  create: (cartData) => {
    const id = generateId()
    const cart = {
      id,
      ...cartData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    memoryDB.carts.set(id, cart)
    return cart
  },
  
  update: (id, updateData) => {
    const cart = memoryDB.carts.get(id)
    if (cart) {
      const updatedCart = {
        ...cart,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      memoryDB.carts.set(id, updatedCart)
      return updatedCart
    }
    return null
  },
  
  delete: (id) => {
    return memoryDB.carts.delete(id)
  }
}

// 订单相关操作
const orderDB = {
  create: (orderData) => {
    const id = generateId()
    const order = {
      id,
      orderId: 'ORDER_' + Date.now(),
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    memoryDB.orders.set(id, order)
    return order
  },
  
  findById: (id) => {
    return memoryDB.orders.get(id)
  },
  
  findByOrderId: (orderId) => {
    for (const order of memoryDB.orders.values()) {
      if (order.orderId === orderId) {
        return order
      }
    }
    return null
  },
  
  findByUserId: (userId) => {
    return Array.from(memoryDB.orders.values()).filter(order => order.userId === userId)
  },
  
  update: (id, updateData) => {
    const order = memoryDB.orders.get(id)
    if (order) {
      const updatedOrder = {
        ...order,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      memoryDB.orders.set(id, updatedOrder)
      return updatedOrder
    }
    return null
  },
  
  findAll: () => {
    return Array.from(memoryDB.orders.values())
  }
}

// 支付相关操作
const paymentDB = {
  create: (paymentData) => {
    const id = generateId()
    const payment = {
      id,
      paymentId: 'PAYMENT_' + Date.now(),
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    memoryDB.payments.set(id, payment)
    return payment
  },
  
  findById: (id) => {
    return memoryDB.payments.get(id)
  },
  
  findByPaymentId: (paymentId) => {
    for (const payment of memoryDB.payments.values()) {
      if (payment.paymentId === paymentId) {
        return payment
      }
    }
    return null
  },
  
  update: (id, updateData) => {
    const payment = memoryDB.payments.get(id)
    if (payment) {
      const updatedPayment = {
        ...payment,
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      memoryDB.payments.set(id, updatedPayment)
      return updatedPayment
    }
    return null
  }
}

// 初始化示例数据
const initializeSampleData = () => {
  // 创建示例商品
  const products = [
    {
      name: '希漫红酒',
      description: '采用传统工艺与现代技术相结合的中国红酒',
      image: '/images/nftred-wine-nft.jpg',
      price: '0.8',
      rarity: 'rare',
      category: 'wine',
      stock: 100,
      metadata: {
        tokenId: '12345',
        contractAddress: '0xabcd...',
        attributes: [
          { trait_type: 'Color', value: 'Red' },
          { trait_type: 'Age', value: '5 years' }
        ]
      }
    },
    {
      name: '希漫威士忌',
      description: '精选优质原料，传统方法酿造的威士忌',
      image: '/images/nftblue-nft.jpg',
      price: '1.5',
      rarity: 'epic',
      category: 'whisky',
      stock: 50,
      metadata: {
        tokenId: '12346',
        contractAddress: '0xabcd...',
        attributes: [
          { trait_type: 'Color', value: 'Gold' },
          { trait_type: 'Age', value: '12 years' }
        ]
      }
    },
    {
      name: '希漫白酒',
      description: '口感优雅，香气细腻的白酒',
      image: '/images/nftflying-dragon-nft.jpg',
      price: '0.9',
      rarity: 'rare',
      category: 'wine',
      stock: 80,
      metadata: {
        tokenId: '12347',
        contractAddress: '0xabcd...',
        attributes: [
          { trait_type: 'Color', value: 'White' },
          { trait_type: 'Age', value: '3 years' }
        ]
      }
    }
  ]
  
  products.forEach(product => {
    productDB.create(product)
  })
  
  // 创建测试管理员账户
  const bcrypt = require('bcryptjs')
  const adminPassword = bcrypt.hashSync('admin123', 12)
  
  const adminUser = userDB.create({
    email: 'admin@siman.com',
    password: adminPassword,
    name: '管理员',
    role: 'admin',
    isEmailVerified: true,
    loginMethod: 'email',
    createdAt: new Date().toISOString()
  })
  
  console.log('📦 示例数据已初始化')
  console.log('👤 管理员账户已创建: admin@siman.com / admin123')
}

module.exports = {
  userDB,
  productDB,
  cartDB,
  orderDB,
  paymentDB,
  initializeSampleData,
  memoryDB
}
