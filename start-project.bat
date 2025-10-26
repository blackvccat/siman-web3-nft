@echo off
echo ========================================
echo    Siman NFT 管理平台启动脚本
echo ========================================
echo.

echo [1/4] 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    pause
    exit /b 1
)
echo ✅ Node.js 环境正常

echo.
echo [2/4] 检查项目依赖...
if not exist "node_modules" (
    echo 📦 安装前端依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 前端依赖安装失败
        pause
        exit /b 1
    )
)

if not exist "backend\node_modules" (
    echo 📦 安装后端依赖...
    cd backend
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 后端依赖安装失败
        pause
        exit /b 1
    )
    cd ..
)

echo ✅ 项目依赖检查完成

echo.
echo [3/4] 启动后端服务...
cd backend
start "Siman NFT Backend" cmd /k "node src/app.js"
cd ..

echo ✅ 后端服务启动中...

echo.
echo [4/4] 启动前端服务...
start "Siman NFT Frontend" cmd /k "npm run dev"

echo ✅ 前端服务启动中...

echo.
echo ========================================
echo 🎉 服务启动完成！
echo.
echo 📱 前端地址: http://localhost:5173
echo 🔧 后端API: http://localhost:3004
echo 🛠️  管理平台: http://localhost:5173/admin-panel.html
echo.
echo 按任意键退出...
echo ========================================
pause >nul
