# Siman NFT 管理平台

## 项目概述

Siman NFT 是一个基于Web3技术的酒类NFT电商平台，集成了完整的前端商城、后端API和管理平台。项目采用现代化的技术栈，提供用户认证、商品管理、库存管理、订单处理等完整功能。

## 技术栈

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **Pinia** - 状态管理
- **Vue Router** - 路由管理
- **SCSS** - CSS预处理器
- **Vite** - 构建工具
- **Tailwind CSS** - 管理平台UI框架

### 后端
- **Node.js** - JavaScript运行时
- **Express.js** - Web框架
- **JWT** - 身份认证
- **Multer** - 文件上传
- **Nodemailer** - 邮件发送
- **Bcryptjs** - 密码加密

### 数据库
- **内存数据库** - 开发环境（可切换MongoDB）
- **MongoDB** - 生产环境（可选）

## 项目结构

```
siman-web3-nft-main/
├── src/                          # 前端源码
│   ├── components/               # Vue组件
│   ├── views/                   # 页面组件
│   ├── stores/                  # Pinia状态管理
│   ├── services/                # API服务
│   └── utils/                   # 工具函数
├── backend/                     # 后端源码
│   ├── src/
│   │   ├── routes/              # API路由
│   │   ├── controllers/         # 控制器
│   │   ├── middleware/          # 中间件
│   │   ├── database/            # 数据库
│   │   └── utils/               # 工具函数
│   └── uploads/                 # 文件上传目录
├── admin-panel.html             # 管理平台界面
├── start-project.bat            # 启动脚本
└── README.md                    # 项目文档
```

## 功能特性

### 用户功能
- ✅ 邮箱注册/登录
- ✅ Google OAuth登录
- ✅ 钱包连接
- ✅ 商品浏览
- ✅ 购物车管理
- ✅ 订单管理
- ✅ 用户资料管理

### 管理功能
- ✅ 商品管理（CRUD）
- ✅ 图片上传
- ✅ 库存管理
- ✅ 入库/出库操作
- ✅ 订单管理
- ✅ 用户管理
- ✅ 数据分析
- ✅ 系统设置

### 技术特性
- ✅ 响应式设计
- ✅ 国际化支持
- ✅ 错误处理
- ✅ API限流
- ✅ 安全中间件
- ✅ 文件上传
- ✅ 邮件发送

## 快速开始

### 1. 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 2. 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
cd ..
```

### 3. 启动项目
```bash
# Windows用户
start-project.bat

# 或手动启动
# 启动后端
cd backend
node src/app.js

# 启动前端（新终端）
npm run dev
```

### 4. 访问地址
- **前端商城**: http://localhost:5173
- **后端API**: http://localhost:3004
- **管理平台**: http://localhost:5173/admin-panel.html

## API文档

### 认证接口
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/google-login` - Google登录
- `POST /api/v1/auth/forgot-password` - 忘记密码
- `POST /api/v1/auth/reset-password` - 重置密码

### 商品接口
- `GET /api/v1/products` - 获取商品列表
- `GET /api/v1/products/:id` - 获取商品详情
- `POST /api/v1/admin/products` - 创建商品（管理员）
- `PUT /api/v1/admin/products/:id` - 更新商品（管理员）
- `DELETE /api/v1/admin/products/:id` - 删除商品（管理员）

### 库存接口
- `GET /api/v1/admin/inventory` - 获取库存列表
- `POST /api/v1/admin/inventory/:id/inbound` - 入库
- `POST /api/v1/admin/inventory/:id/outbound` - 出库
- `POST /api/v1/admin/inventory/:id/adjustment` - 库存调整

### 购物车接口
- `GET /api/v1/cart` - 获取购物车
- `POST /api/v1/cart` - 添加商品到购物车
- `PUT /api/v1/cart/:id` - 更新购物车商品
- `DELETE /api/v1/cart/:id` - 删除购物车商品

## 环境配置

### 后端环境变量
创建 `backend/.env` 文件：
```env
NODE_ENV=development
PORT=3004
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 前端环境变量
创建 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:3004/api/v1
```

## 部署指南

### 1. 生产环境配置
```bash
# 构建前端
npm run build

# 启动后端（生产模式）
cd backend
NODE_ENV=production node src/app.js
```

### 2. 数据库配置
- 开发环境：使用内存数据库
- 生产环境：配置MongoDB连接

### 3. 文件上传配置
- 开发环境：本地文件系统
- 生产环境：建议使用云存储（AWS S3、阿里云OSS等）

## 开发指南

### 1. 代码规范
- 使用ESLint进行代码检查
- 遵循Vue 3 Composition API规范
- 使用TypeScript（可选）

### 2. 提交规范
```bash
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复bug"
git commit -m "docs: 更新文档"
```

### 3. 测试
```bash
# 运行测试
npm test

# 运行后端测试
cd backend
npm test
```

## 常见问题

### Q: 后端服务启动失败？
A: 检查端口是否被占用，确保Node.js版本 >= 18.0.0

### Q: 邮件发送失败？
A: 检查SMTP配置，确保邮箱密码是应用专用密码

### Q: 文件上传失败？
A: 检查uploads目录权限，确保有写入权限

### Q: 前端无法连接后端？
A: 检查API_BASE_URL配置，确保后端服务正常运行

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License

## 联系方式

- 项目地址: https://github.com/your-username/siman-web3-nft
- 问题反馈: https://github.com/your-username/siman-web3-nft/issues
- 邮箱: contact@siman.com

---

**Siman NFT Team** - 让传统文化与现代Web3技术完美融合
