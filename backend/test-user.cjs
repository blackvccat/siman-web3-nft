const { userDB } = require('./src/database/memoryDB')
const bcrypt = require('bcryptjs')

console.log('=== 用户数据库测试 ===')

// 查找管理员用户
const adminUser = userDB.findByEmail('admin@siman.com')
console.log('管理员用户:', adminUser)

if (adminUser) {
  // 测试密码
  const isPasswordValid = bcrypt.compareSync('admin123', adminUser.password)
  console.log('密码验证结果:', isPasswordValid)
  
  // 显示密码哈希
  console.log('密码哈希:', adminUser.password)
} else {
  console.log('未找到管理员用户')
}

// 显示所有用户
console.log('\n=== 所有用户 ===')
for (const user of userDB.findAll()) {
  console.log(`用户: ${user.email}, 角色: ${user.role}`)
}
