@echo off
chcp 65001 >nul
echo 🍷 欢迎使用希漫酒业项目启动脚本
echo ==================================

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到Node.js，请先安装Node.js
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到npm，请先安装npm
    pause
    exit /b 1
)

echo ✅ Node.js版本: 
node --version
echo ✅ npm版本: 
npm --version
echo.

REM 检查项目依赖
if not exist "node_modules" (
    echo 📦 正在安装项目依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败，请检查网络连接或npm配置
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 项目依赖已存在
)

echo.
echo 🚀 正在启动开发服务器...
echo    访问地址: http://localhost:3000
echo    按 Ctrl+C 停止服务器
echo.

REM 启动开发服务器并自动打开浏览器
start http://localhost:3000
npm run dev