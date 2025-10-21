# 希漫酒业项目启动脚本 (PowerShell版本)
# 功能: 自动检查环境、安装依赖、启动服务器、打开浏览器

param(
    [switch]$SkipBrowser,  # 跳过自动打开浏览器
    [switch]$Force        # 强制重新安装依赖
)

# 设置控制台编码为UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🍷 希漫酒业项目启动脚本" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js not found"
    }
    Write-Host "✅ Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 错误: 未检测到Node.js" -ForegroundColor Red
    Write-Host "   请先安装Node.js: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

# 检查npm
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "npm not found"
    }
    Write-Host "✅ npm版本: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 错误: 未检测到npm" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""

# 检查项目依赖
if ($Force -or -not (Test-Path "node_modules")) {
    Write-Host "📦 正在安装项目依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host "✅ 依赖安装完成" -ForegroundColor Green
} else {
    Write-Host "✅ 项目依赖已存在" -ForegroundColor Green
}

Write-Host ""

# 检查端口是否被占用
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  端口3000已被占用，尝试访问现有服务..." -ForegroundColor Yellow
    
    # 尝试访问现有服务
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ 发现现有服务正在运行" -ForegroundColor Green
            if (-not $SkipBrowser) {
                Write-Host "🌐 正在打开浏览器..." -ForegroundColor Cyan
                Start-Process "http://localhost:3000"
            }
            Write-Host ""
            Write-Host "如果浏览器没有自动打开，请手动访问: http://localhost:3000" -ForegroundColor Yellow
            Read-Host "按回车键退出"
            exit 0
        }
    } catch {
        Write-Host "❌ 现有服务无响应，将启动新服务" -ForegroundColor Red
    }
}

Write-Host "🚀 正在启动开发服务器..." -ForegroundColor Cyan
Write-Host "🌐 访问地址: http://localhost:3000" -ForegroundColor Green
Write-Host ""

# 延迟打开浏览器
if (-not $SkipBrowser) {
    Start-Job -ScriptBlock {
        Start-Sleep -Seconds 3
        Start-Process "http://localhost:3000"
    } | Out-Null
    Write-Host "⏳ 3秒后自动打开浏览器..." -ForegroundColor Yellow
}

Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Gray
Write-Host ""

# 启动开发服务器
npm run dev


