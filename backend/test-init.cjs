const { initializeSampleData, userDB } = require('./src/database/memoryDB')

console.log('初始化前用户数量:', userDB.findAll().length)
initializeSampleData()
console.log('初始化后用户数量:', userDB.findAll().length)

const admin = userDB.findByEmail('admin@siman.com')
console.log('管理员用户:', admin ? admin.email : '未找到')

if (admin) {
  console.log('用户详情:', {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role
  })
}
