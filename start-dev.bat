@echo off
REM Siman Web3 NFT 项目启动脚本 (Windows版本)
REM 功能: 同时启动前端和后端服务

echo 🚀 启动 Siman Web3 NFT 项目...

REM 检查Node.js版本
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未安装Node.js，请先安装Node.js 18+
    pause
    exit /b 1
)

echo 📦 Node.js已安装

REM 检查是否安装了依赖
if not exist "node_modules" (
    echo 📥 安装前端依赖...
    npm install
)

if not exist "backend\node_modules" (
    echo 📥 安装后端依赖...
    cd backend
    npm install
    cd ..
)

REM 检查环境变量文件
if not exist ".env" (
    echo ⚠️  警告: 未找到.env文件，请复制env.example并配置
    if exist "env.example" (
        copy env.example .env
        echo ✅ 已创建.env文件，请根据需要修改配置
    )
)

if not exist "backend\.env" (
    echo ⚠️  警告: 未找到backend\.env文件，请复制env.example并配置
    if exist "backend\env.example" (
        copy backend\env.example backend\.env
        echo ✅ 已创建backend\.env文件，请根据需要修改配置
    )
)

REM 启动后端服务
echo 🔧 启动后端服务...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM 等待后端启动
timeout /t 3 /nobreak >nul

REM 启动前端服务
echo 🎨 启动前端服务...
start "Frontend Server" cmd /k "npm run dev"

echo ✅ 服务启动完成!
echo 🌐 前端地址: http://localhost:5173
echo 🔧 后端地址: http://localhost:3000
echo 📊 健康检查: http://localhost:3000/health
echo.
echo 按任意键关闭此窗口...
pause >nul
