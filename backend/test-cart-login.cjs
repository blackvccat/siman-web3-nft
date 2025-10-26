// 使用Node.js内置的fetch

async function testCartWithLogin() {
  console.log('=== 测试购物车功能（需要登录）===')
  
  try {
    // 1. 登录获取token
    console.log('\n1. 用户登录...')
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
    if (!loginData.success) {
      console.log('登录失败:', loginData.error.message)
      return
    }
    
    const token = loginData.data.token
    console.log('登录成功，获取到Token')
    
    // 2. 获取商品列表
    console.log('\n2. 获取商品列表...')
    const productsResponse = await fetch('http://localhost:3004/api/v1/products')
    const productsData = await productsResponse.json()
    
    if (!productsData.success || productsData.data.products.length === 0) {
      console.log('没有商品数据')
      return
    }
    
    const firstProduct = productsData.data.products[0]
    console.log('第一个商品:', firstProduct.name, '- 价格:', firstProduct.price, 'ETH')
    
    // 3. 添加到购物车
    console.log('\n3. 添加到购物车...')
    const addToCartResponse = await fetch('http://localhost:3004/api/v1/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: firstProduct.id,
        quantity: 1
      })
    })
    
    const cartData = await addToCartResponse.json()
    console.log('添加到购物车结果:', cartData.success ? '成功' : '失败')
    
    if (cartData.success) {
      console.log('购物车商品数量:', cartData.data.totalItems)
      console.log('购物车总价:', cartData.data.totalPrice, 'ETH')
      console.log('商品列表:', cartData.data.items.map(item => `${item.product.name} x${item.quantity}`))
    } else {
      console.log('添加失败:', cartData.error.message)
    }
    
    // 4. 测试无Token访问购物车
    console.log('\n4. 测试无Token访问购物车...')
    const noTokenResponse = await fetch('http://localhost:3004/api/v1/cart')
    const noTokenData = await noTokenResponse.json()
    console.log('无Token访问结果:', noTokenData.success ? '成功' : '失败（预期失败）')
    if (!noTokenData.success) {
      console.log('正确返回错误:', noTokenData.error.message)
    }
    
    console.log('\n✅ 购物车功能测试完成！')
    console.log('\n📝 前端使用说明:')
    console.log('1. 访问 http://localhost:3002')
    console.log('2. 点击"加入购物车"按钮')
    console.log('3. 系统会弹出登录框')
    console.log('4. 使用测试账户登录: admin@siman.com / admin123')
    console.log('5. 登录后即可正常添加商品到购物车')
    
  } catch (error) {
    console.error('测试过程中出现错误:', error.message)
  }
}

testCartWithLogin()
