# MongoDB Atlas 配置指南

## 1. 创建MongoDB Atlas账户

1. 访问 https://www.mongodb.com/atlas
2. 点击 "Try Free" 创建免费账户
3. 选择 "Build a Database"
4. 选择 "FREE" 套餐（M0 Sandbox）
5. 选择云提供商和地区（建议选择离您最近的地区）
6. 创建集群

## 2. 配置数据库访问

1. 在 "Database Access" 中添加用户：
   - Username: siman_user
   - Password: 生成强密码
   - Database User Privileges: Read and write to any database

2. 在 "Network Access" 中添加IP地址：
   - 点击 "Add IP Address"
   - 选择 "Allow access from anywhere" (0.0.0.0/0) 用于开发
   - 或者添加您的具体IP地址

## 3. 获取连接字符串

1. 点击 "Connect" 按钮
2. 选择 "Connect your application"
3. 选择 "Node.js" 驱动
4. 复制连接字符串，类似：
   ```
   mongodb+srv://siman_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 4. 更新环境变量

将连接字符串添加到 backend/.env 文件中：
```
MONGODB_URI=mongodb+srv://siman_user:<your_password>@cluster0.xxxxx.mongodb.net/siman_nft?retryWrites=true&w=majority
```

## 5. 测试连接

运行项目后，后端服务会自动连接到MongoDB Atlas。
