// 使用Node.js内置的fetch

async function testPaymentIntegration() {
  console.log('=== 支付集成测试 ===')
  
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
    console.log('登录成功')
    
    // 2. 创建订单
    console.log('\n2. 创建测试订单...')
    const orderData = {
      items: [{
        productId: 'test-product',
        quantity: 1,
        price: '1.0'
      }],
      totalAmount: '1.0',
      shippingAddress: {
        name: '测试用户',
        address: '测试地址',
        city: '测试城市',
        postalCode: '123456',
        phone: '13800138000'
      },
      paymentMethod: 'crypto',
      notes: '测试支付订单'
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
    if (!orderResult.success) {
      console.log('创建订单失败:', orderResult.error.message)
      return
    }
    
    const orderId = orderResult.data.orderId
    console.log('订单创建成功，订单ID:', orderId)
    
    // 3. 创建支付订单
    console.log('\n3. 创建支付订单...')
    const paymentData = {
      orderId: orderId,
      amount: '1.0',
      currency: 'ETH',
      paymentMethod: 'crypto'
    }
    
    const createPaymentResponse = await fetch('http://localhost:3004/api/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    })
    
    const paymentResult = await createPaymentResponse.json()
    console.log('创建支付订单结果:', paymentResult.success ? '成功' : '失败')
    
    if (paymentResult.success) {
      console.log('支付订单ID:', paymentResult.data.paymentId)
      console.log('支付金额:', paymentResult.data.amount, paymentResult.data.currency)
      console.log('支付状态:', paymentResult.data.status)
      
      // 4. 模拟支付验证
      console.log('\n4. 模拟支付验证...')
      const verifyPaymentData = {
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678'
      }
      
      const verifyPaymentResponse = await fetch(`http://localhost:3004/api/v1/payments/${paymentResult.data.paymentId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(verifyPaymentData)
      })
      
      const verifyResult = await verifyPaymentResponse.json()
      console.log('支付验证结果:', verifyResult.success ? '成功' : '失败')
      
      if (verifyResult.success) {
        console.log('支付状态更新为:', verifyResult.data.status)
      } else {
        console.log('支付验证失败:', verifyResult.error.message)
      }
    } else {
      console.log('创建支付订单失败:', paymentResult.error.message)
    }
    
    // 5. 测试Web3钱包连接（模拟）
    console.log('\n5. 测试Web3钱包连接...')
    console.log('Web3钱包连接功能需要前端实现')
    console.log('支持的钱包类型: MetaMask, WalletConnect, Coinbase Wallet')
    console.log('支持的区块链: Ethereum, Polygon, BSC')
    
    console.log('\n✅ 支付集成测试完成！')
    
  } catch (error) {
    console.error('测试过程中出现错误:', error.message)
  }
}

testPaymentIntegration()
