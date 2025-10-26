#!/bin/bash

# Siman Web3 NFT 项目启动脚本
# 功能: 同时启动前端和后端服务

echo "🚀 启动 Siman Web3 NFT 项目..."

# 检查Node.js版本
node_version=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ 错误: 未安装Node.js，请先安装Node.js 18+"
    exit 1
fi

echo "📦 Node.js版本: $node_version"

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📥 安装前端依赖..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📥 安装后端依赖..."
    cd backend
    npm install
    cd ..
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚠️  警告: 未找到.env文件，请复制env.example并配置"
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ 已创建.env文件，请根据需要修改配置"
    fi
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  警告: 未找到backend/.env文件，请复制env.example并配置"
    if [ -f "backend/env.example" ]; then
        cp backend/env.example backend/.env
        echo "✅ 已创建backend/.env文件，请根据需要修改配置"
    fi
fi

# 启动后端服务
echo "🔧 启动后端服务..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端服务
echo "🎨 启动前端服务..."
npm run dev &
FRONTEND_PID=$!

echo "✅ 服务启动完成!"
echo "🌐 前端地址: http://localhost:5173"
echo "🔧 后端地址: http://localhost:3000"
echo "📊 健康检查: http://localhost:3000/health"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

echo "按 Ctrl+C 停止服务"
wait
