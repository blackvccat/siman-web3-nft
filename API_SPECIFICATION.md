# Siman Web3 NFT 后端API接口规范

## 项目概述
- **项目名称**: Siman Web3 NFT 酒类电商平台
- **技术栈**: Node.js + Express + MongoDB/PostgreSQL
- **认证方式**: JWT Token + Web3钱包签名验证
- **API版本**: v1
- **基础URL**: `https://api.simanliquor.com/v1`

## 认证机制

### Web3钱包认证
```javascript
// 钱包签名验证流程
1. 前端生成随机nonce
2. 用户使用钱包签名nonce
3. 后端验证签名和地址
4. 返回JWT token
```

### JWT Token结构
```javascript
{
  "sub": "wallet_address",     // 用户钱包地址
  "iat": 1640995200,          // 签发时间
  "exp": 1641081600,          // 过期时间
  "role": "user",             // 用户角色
  "nonce": "random_string"     // 随机字符串
}
```

## API接口规范

### 1. 用户认证相关

#### 1.1 获取认证nonce
```http
GET /auth/nonce/:walletAddress
```

**响应:**
```json
{
  "success": true,
  "data": {
    "nonce": "random_string_12345",
    "expiresIn": 300
  }
}
```

#### 1.2 钱包登录
```http
POST /auth/login
Content-Type: application/json

{
  "walletAddress": "0x1234...",
  "signature": "0xabcd...",
  "nonce": "random_string_12345"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "walletAddress": "0x1234...",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### 1.3 刷新Token
```http
POST /auth/refresh
Authorization: Bearer <token>
```

### 2. 商品管理相关

#### 2.1 获取商品列表
```http
GET /products?page=1&limit=10&category=wine&rarity=rare
```

**响应:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_001",
        "name": "希漫红酒",
        "description": "采用传统工艺与现代技术相结合的中国红酒",
        "image": "https://cdn.simanliquor.com/images/nftred-wine-nft.jpg",
        "price": "0.8",
        "rarity": "rare",
        "category": "wine",
        "stock": 100,
        "metadata": {
          "tokenId": "12345",
          "contractAddress": "0xabcd...",
          "attributes": [
            {"trait_type": "Color", "value": "Red"},
            {"trait_type": "Age", "value": "5 years"}
          ]
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### 2.2 获取商品详情
```http
GET /products/:productId
```

#### 2.3 创建商品（管理员）
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "希漫红酒",
  "description": "采用传统工艺与现代技术相结合的中国红酒",
  "image": "https://cdn.simanliquor.com/images/nftred-wine-nft.jpg",
  "price": "0.8",
  "rarity": "rare",
  "category": "wine",
  "stock": 100,
  "metadata": {
    "tokenId": "12345",
    "contractAddress": "0xabcd...",
    "attributes": [
      {"trait_type": "Color", "value": "Red"},
      {"trait_type": "Age", "value": "5 years"}
    ]
  }
}
```

### 3. 购物车相关

#### 3.1 获取购物车
```http
GET /cart
Authorization: Bearer <token>
```

**响应:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart_item_001",
        "productId": "prod_001",
        "quantity": 2,
        "price": "0.8",
        "totalPrice": "1.6",
        "addedAt": "2024-01-01T00:00:00Z",
        "product": {
          "id": "prod_001",
          "name": "希漫红酒",
          "image": "https://cdn.simanliquor.com/images/nftred-wine-nft.jpg",
          "rarity": "rare"
        }
      }
    ],
    "totalItems": 2,
    "totalPrice": "1.6"
  }
}
```

#### 3.2 添加商品到购物车
```http
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "prod_001",
  "quantity": 1
}
```

#### 3.3 更新购物车商品数量
```http
PUT /cart/items/:cartItemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### 3.4 删除购物车商品
```http
DELETE /cart/items/:cartItemId
Authorization: Bearer <token>
```

#### 3.5 清空购物车
```http
DELETE /cart
Authorization: Bearer <token>
```

### 4. 订单管理相关

#### 4.1 创建订单
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "prod_001",
      "quantity": 2,
      "price": "0.8"
    }
  ],
  "shippingAddress": {
    "name": "张三",
    "phone": "13800138000",
    "address": "北京市朝阳区xxx街道xxx号",
    "postalCode": "100000"
  },
  "paymentMethod": "crypto",
  "totalAmount": "1.6"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_001",
    "status": "pending",
    "totalAmount": "1.6",
    "paymentAddress": "0xpayment...",
    "expiresAt": "2024-01-01T01:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 4.2 获取订单列表
```http
GET /orders?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

#### 4.3 获取订单详情
```http
GET /orders/:orderId
Authorization: Bearer <token>
```

#### 4.4 更新订单状态
```http
PUT /orders/:orderId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "paid",
  "transactionHash": "0xtx_hash..."
}
```

### 5. 支付相关

#### 5.1 创建支付订单
```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_001",
  "amount": "1.6",
  "currency": "ETH"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "paymentId": "payment_001",
    "paymentAddress": "0xpayment_address...",
    "amount": "1.6",
    "currency": "ETH",
    "expiresAt": "2024-01-01T01:00:00Z",
    "qrCode": "data:image/png;base64,..."
  }
}
```

#### 5.2 验证支付
```http
POST /payments/:paymentId/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "transactionHash": "0xtx_hash..."
}
```

### 6. 用户管理相关

#### 6.1 获取用户信息
```http
GET /user/profile
Authorization: Bearer <token>
```

#### 6.2 更新用户信息
```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000"
}
```

#### 6.3 获取用户订单历史
```http
GET /user/orders?page=1&limit=10
Authorization: Bearer <token>
```

### 7. 系统管理相关

#### 7.1 获取系统统计
```http
GET /admin/stats
Authorization: Bearer <admin_token>
```

#### 7.2 获取用户列表（管理员）
```http
GET /admin/users?page=1&limit=10
Authorization: Bearer <admin_token>
```

## 错误处理规范

### 标准错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ]
  }
}
```

### 常见错误代码
- `VALIDATION_ERROR`: 参数验证失败
- `AUTHENTICATION_ERROR`: 认证失败
- `AUTHORIZATION_ERROR`: 权限不足
- `NOT_FOUND`: 资源不存在
- `DUPLICATE_ERROR`: 重复资源
- `INSUFFICIENT_STOCK`: 库存不足
- `PAYMENT_ERROR`: 支付失败
- `INTERNAL_ERROR`: 服务器内部错误

## 数据模型设计

### 用户模型 (User)
```javascript
{
  _id: ObjectId,
  walletAddress: String,    // 钱包地址
  role: String,            // 用户角色: user, admin
  profile: {
    name: String,
    email: String,
    phone: String,
    avatar: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 商品模型 (Product)
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  image: String,
  price: String,           // ETH价格
  rarity: String,         // rare, epic, legendary
  category: String,       // wine, whisky, etc.
  stock: Number,
  metadata: {
    tokenId: String,
    contractAddress: String,
    attributes: Array
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 购物车模型 (Cart)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number,
    price: String,
    totalPrice: String,
    addedAt: Date
  }],
  totalItems: Number,
  totalPrice: String,
  updatedAt: Date
}
```

### 订单模型 (Order)
```javascript
{
  _id: ObjectId,
  orderId: String,        // 订单号
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number,
    price: String,
    totalPrice: String
  }],
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    postalCode: String
  },
  status: String,         // pending, paid, shipped, delivered, cancelled
  paymentMethod: String,  // crypto, fiat
  totalAmount: String,
  transactionHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 安全考虑

### 1. 输入验证
- 所有输入参数必须进行严格验证
- 使用Joi或类似库进行schema验证
- 防止SQL注入和XSS攻击

### 2. 认证授权
- JWT token过期时间设置为24小时
- 实现token刷新机制
- 敏感操作需要重新签名验证

### 3. 限流控制
- API调用频率限制
- IP白名单机制
- 防止DDoS攻击

### 4. 数据加密
- 敏感数据加密存储
- HTTPS强制使用
- 数据库连接加密

## 部署和监控

### 1. 环境配置
- 开发环境 (Development)
- 测试环境 (Staging)
- 生产环境 (Production)

### 2. 监控指标
- API响应时间
- 错误率统计
- 用户活跃度
- 系统资源使用率

### 3. 日志管理
- 结构化日志记录
- 错误日志告警
- 审计日志追踪
