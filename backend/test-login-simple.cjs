// 使用Node.js内置的fetch

async function testLogin() {
  console.log('=== 测试登录API ===')
  
  try {
    const response = await fetch('http://localhost:3004/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@siman.com',
        password: 'admin123'
      })
    })
    
    const data = await response.json()
    console.log('登录结果:', data.success ? '成功' : '失败')
    
    if (data.success) {
      console.log('Token:', data.data.token.substring(0, 20) + '...')
      console.log('用户信息:', data.data.user)
    } else {
      console.log('错误:', data.error.message)
    }
    
  } catch (error) {
    console.error('请求错误:', error.message)
  }
}

testLogin()
