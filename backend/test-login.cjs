const { initializeSampleData, userDB } = require('./src/database/memoryDB')
const bcrypt = require('bcryptjs')

// 初始化数据
initializeSampleData()

// 测试登录逻辑
const email = 'admin@siman.com'
const password = 'admin123'

console.log('=== 登录测试 ===')
console.log('邮箱:', email)
console.log('密码:', password)

// 查找用户
const user = userDB.findByEmail(email)
console.log('找到用户:', user ? '是' : '否')

if (user) {
  console.log('用户信息:', {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  })
  
  // 验证密码
  const isPasswordValid = bcrypt.compareSync(password, user.password)
  console.log('密码验证结果:', isPasswordValid)
  
  if (isPasswordValid) {
    console.log('✅ 登录成功！')
  } else {
    console.log('❌ 密码不正确')
    console.log('存储的密码哈希:', user.password)
    
    // 重新生成密码哈希进行对比
    const newHash = bcrypt.hashSync(password, 12)
    console.log('新生成的密码哈希:', newHash)
  }
} else {
  console.log('❌ 用户不存在')
}
