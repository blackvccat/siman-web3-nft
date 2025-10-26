// 使用Node.js内置的fetch

async function testUserAuth() {
  console.log('=== 用户认证功能测试 ===')
  
  try {
    // 1. 测试用户注册（邮箱验证码）
    console.log('\n1. 测试发送邮箱验证码...')
    const sendCodeResponse = await fetch('http://localhost:3004/api/v1/auth/send-verification-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    })
    
    const codeData = await sendCodeResponse.json()
    console.log('发送验证码结果:', codeData.success ? '成功' : '失败')
    if (!codeData.success) {
      console.log('发送失败:', codeData.error.message)
    }
    
    // 2. 测试用户注册
    console.log('\n2. 测试用户注册...')
    const registerResponse = await fetch('http://localhost:3004/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123456',
        name: '测试用户',
        verificationCode: '123456', // 模拟验证码
        walletAddress: '0x1234567890123456789012345678901234567890'
      })
    })
    
    const registerData = await registerResponse.json()
    console.log('用户注册结果:', registerData.success ? '成功' : '失败')
    if (!registerData.success) {
      console.log('注册失败:', registerData.error.message)
    }
    
    // 3. 测试用户登录
    console.log('\n3. 测试用户登录...')
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
    console.log('用户登录结果:', loginData.success ? '成功' : '失败')
    
    if (loginData.success) {
      const token = loginData.data.token
      console.log('获取到Token:', token.substring(0, 20) + '...')
      
      // 4. 测试Token验证
      console.log('\n4. 测试Token验证...')
      const protectedResponse = await fetch('http://localhost:3004/api/v1/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const profileData = await protectedResponse.json()
      console.log('获取用户信息结果:', profileData.success ? '成功' : '失败')
      
      if (profileData.success) {
        console.log('用户信息:', {
          walletAddress: profileData.data.walletAddress,
          role: profileData.data.role,
          createdAt: profileData.data.createdAt
        })
      }
      
      // 5. 测试无效Token
      console.log('\n5. 测试无效Token...')
      const invalidTokenResponse = await fetch('http://localhost:3004/api/v1/user/profile', {
        headers: {
          'Authorization': 'Bearer invalid_token'
        }
      })
      
      const invalidTokenData = await invalidTokenResponse.json()
      console.log('无效Token测试结果:', invalidTokenData.success ? '成功' : '失败（预期失败）')
      if (!invalidTokenData.success) {
        console.log('正确返回错误:', invalidTokenData.error.message)
      }
    }
    
    console.log('\n✅ 用户认证功能测试完成！')
    
  } catch (error) {
    console.error('测试过程中出现错误:', error.message)
  }
}

testUserAuth()
