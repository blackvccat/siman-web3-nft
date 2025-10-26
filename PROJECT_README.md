# Siman Web3 NFT 酒类电商平台

## 项目概述

Siman Web3 NFT 是一个基于区块链技术的酒类电商平台，融合了中国传统文化与现代Web3技术。项目采用Vue 3 + Node.js技术栈，提供完整的购物车、订单管理和支付功能。

## 技术栈

### 前端
- **框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: SCSS
- **国际化**: 自定义i18n系统

### 后端
- **运行时**: Node.js
- **框架**: Express.js
- **数据库**: MongoDB
- **认证**: JWT + Web3钱包签名
- **缓存**: Redis
- **文件上传**: Multer + Sharp

## 功能特性

### 🛒 购物车系统
- 商品添加/删除
- 数量调整
- 实时价格计算
- 本地存储 + 后端同步
- 响应式设计

### 🎨 用户界面
- 现代化UI设计
- 明亮/暗黑主题切换
- 多语言支持（中文/英文）
- 东方Project风格特效
- 响应式布局

### 🔐 认证系统
- Web3钱包连接
- JWT Token认证
- 签名验证
- 权限管理

### 🎵 多媒体功能
- 背景音乐播放
- 主题音乐切换
- 音量控制
- 自动播放

## 项目结构

```
siman-web3-nft-main/
├── src/                          # 前端源码
│   ├── components/              # 组件
│   │   ├── common/             # 通用组件
│   │   │   ├── CartIcon.vue    # 购物车图标
│   │   │   ├── CartDrawer.vue  # 购物车抽屉
│   │   │   ├── CartItem.vue    # 购物车商品项
│   │   │   └── ...
│   │   └── layout/             # 布局组件
│   ├── stores/                 # 状态管理
│   │   ├── app.js             # 应用状态
│   │   └── cart.js            # 购物车状态
│   ├── services/              # API服务
│   │   └── api.js             # API封装
│   ├── views/                 # 页面组件
│   └── utils/                 # 工具函数
├── backend/                    # 后端源码
│   ├── src/
│   │   ├── controllers/       # 控制器
│   │   ├── models/           # 数据模型
│   │   ├── routes/           # 路由
│   │   ├── middleware/       # 中间件
│   │   └── utils/            # 工具函数
│   └── package.json
├── public/                    # 静态资源
├── API_SPECIFICATION.md       # API接口规范
└── README.md                  # 项目文档
```

## 快速开始

### 环境要求
- Node.js 18+
- MongoDB
- Redis (可选)

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
cd ..
```

### 环境配置

1. 复制环境变量文件：
```bash
# 前端
cp env.example .env

# 后端
cp backend/env.example backend/.env
```

2. 修改配置文件中的数据库连接、JWT密钥等信息

### 启动项目

#### 方式一：使用启动脚本（推荐）

**Windows:**
```bash
start-dev.bat
```

**Linux/Mac:**
```bash
./start-dev.sh
```

#### 方式二：手动启动

**启动后端:**
```bash
cd backend
npm run dev
```

**启动前端:**
```bash
npm run dev
```

### 访问地址
- 前端: http://localhost:5173
- 后端: http://localhost:3000
- API文档: http://localhost:3000/api/v1
- 健康检查: http://localhost:3000/health

## API接口

### 认证相关
- `GET /auth/nonce/:walletAddress` - 获取认证nonce
- `POST /auth/login` - 钱包登录
- `POST /auth/refresh` - 刷新token

### 购物车相关
- `GET /cart` - 获取购物车
- `POST /cart/items` - 添加商品到购物车
- `PUT /cart/items/:cartItemId` - 更新商品数量
- `DELETE /cart/items/:cartItemId` - 删除商品
- `DELETE /cart` - 清空购物车

### 订单相关
- `POST /orders` - 创建订单
- `GET /orders` - 获取订单列表
- `GET /orders/:orderId` - 获取订单详情

详细API文档请参考 [API_SPECIFICATION.md](./API_SPECIFICATION.md)

## 开发指南

### 添加新功能

1. **前端组件开发**
   - 在 `src/components/` 下创建组件
   - 使用 Composition API 和 TypeScript
   - 遵循现有的代码风格

2. **状态管理**
   - 在 `src/stores/` 下创建store
   - 使用 Pinia 进行状态管理
   - 支持本地存储持久化

3. **API集成**
   - 在 `src/services/api.js` 中添加API方法
   - 使用统一的错误处理
   - 支持请求拦截和响应处理

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Vue 3 最佳实践
- 编写清晰的注释和文档

### 测试

```bash
# 运行前端测试
npm run test

# 运行后端测试
cd backend
npm run test
```

## 部署

### 前端部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 后端部署

```bash
# 构建生产版本
cd backend
npm run build

# 启动生产服务
npm start
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者: Siman Liquor Team
- 邮箱: contact@simanliquor.com
- 官网: https://simanliquor.com

## 更新日志

### v1.0.0 (2024-01-01)
- ✨ 初始版本发布
- 🛒 完整的购物车系统
- 🎨 现代化UI设计
- 🔐 Web3钱包认证
- 🌐 多语言支持
- 🎵 背景音乐功能
