// 使用Node.js内置的fetch

async function testCartSystem() {
  console.log('=== 购物车系统测试 ===')
  
  try {
    // 1. 测试登录
    console.log('\n1. 测试用户登录...')
    const loginResponse = await fetch('http://localhost:3004/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@siman.com',
        password: 'admin123'
      })
    })
    
    const loginData = await loginResponse.json()
    console.log('登录结果:', loginData.success ? '成功' : '失败')
    
    if (!loginData.success) {
      console.log('登录失败:', loginData.error.message)
      return
    }
    
    const token = loginData.data.token
    console.log('获取到Token:', token.substring(0, 20) + '...')
    
    // 2. 测试获取商品列表
    console.log('\n2. 测试获取商品列表...')
    const productsResponse = await fetch('http://localhost:3004/api/v1/products')
    const productsData = await productsResponse.json()
    console.log('商品数量:', productsData.data.products.length)
    
    if (productsData.data.products.length === 0) {
      console.log('没有商品数据')
      return
    }
    
    const firstProduct = productsData.data.products[0]
    console.log('第一个商品:', firstProduct.name, '- 价格:', firstProduct.price, 'ETH')
    
    // 3. 测试添加到购物车
    console.log('\n3. 测试添加到购物车...')
    const addToCartResponse = await fetch('http://localhost:3004/api/v1/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: firstProduct.id,
        quantity: 2
      })
    })
    
    const cartData = await addToCartResponse.json()
    console.log('添加到购物车结果:', cartData.success ? '成功' : '失败')
    
    if (cartData.success) {
      console.log('购物车商品数量:', cartData.data.totalItems)
      console.log('购物车总价:', cartData.data.totalPrice, 'ETH')
    } else {
      console.log('添加失败:', cartData.error.message)
    }
    
    // 4. 测试获取购物车
    console.log('\n4. 测试获取购物车...')
    const getCartResponse = await fetch('http://localhost:3004/api/v1/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const getCartData = await getCartResponse.json()
    console.log('获取购物车结果:', getCartData.success ? '成功' : '失败')
    
    if (getCartData.success) {
      console.log('购物车商品数量:', getCartData.data.totalItems)
      console.log('购物车总价:', getCartData.data.totalPrice, 'ETH')
      console.log('商品列表:', getCartData.data.items.map(item => `${item.product.name} x${item.quantity}`))
    }
    
    console.log('\n✅ 购物车系统测试完成！')
    
  } catch (error) {
    console.error('测试过程中出现错误:', error.message)
  }
}

testCartSystem()
