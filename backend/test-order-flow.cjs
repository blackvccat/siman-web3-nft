// 使用Node.js内置的fetch

async function testOrderFlow() {
  console.log('=== 订单流程测试 ===')
  
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
    
    // 2. 添加商品到购物车
    console.log('\n2. 添加商品到购物车...')
    const productsResponse = await fetch('http://localhost:3004/api/v1/products')
    const productsData = await productsResponse.json()
    const firstProduct = productsData.data.products[0]
    
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
    if (!cartData.success) {
      console.log('添加到购物车失败:', cartData.error.message)
      return
    }
    
    console.log('商品已添加到购物车')
    
    // 3. 创建订单
    console.log('\n3. 创建订单...')
    const orderData = {
      items: cartData.data.items,
      totalAmount: cartData.data.totalPrice,
      shippingAddress: {
        name: '测试用户',
        address: '测试地址123号',
        city: '测试城市',
        postalCode: '123456',
        phone: '13800138000'
      },
      paymentMethod: 'crypto',
      notes: '测试订单'
    }
    
    const createOrderResponse = await fetch('http://localhost:3004/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    })
    
    const orderResult = await createOrderResponse.json()
    console.log('创建订单结果:', orderResult.success ? '成功' : '失败')
    
    if (orderResult.success) {
      console.log('订单ID:', orderResult.data.orderId)
      console.log('订单状态:', orderResult.data.status)
      console.log('订单总金额:', orderResult.data.totalAmount, 'ETH')
    } else {
      console.log('创建订单失败:', orderResult.error.message)
    }
    
    // 4. 获取订单列表
    console.log('\n4. 获取订单列表...')
    const ordersResponse = await fetch('http://localhost:3004/api/v1/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const ordersData = await ordersResponse.json()
    console.log('获取订单列表结果:', ordersData.success ? '成功' : '失败')
    
    if (ordersData.success) {
      console.log('订单数量:', ordersData.data.orders.length)
      if (ordersData.data.orders.length > 0) {
        console.log('最新订单:', {
          id: ordersData.data.orders[0].id,
          status: ordersData.data.orders[0].status,
          totalAmount: ordersData.data.orders[0].totalAmount
        })
      }
    }
    
    console.log('\n✅ 订单流程测试完成！')
    
  } catch (error) {
    console.error('测试过程中出现错误:', error.message)
  }
}

testOrderFlow()
