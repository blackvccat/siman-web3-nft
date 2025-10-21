#!/bin/bash
# Siman Liquor - 希漫酒业项目启动脚本 (macOS App版本)
# 功能: 创建macOS应用程序包，双击即可启动

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${CYAN}🍷 希漫酒业项目启动器${NC}"
echo -e "${CYAN}========================${NC}"
echo ""

# 检查是否在macOS上运行
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ 此脚本仅适用于macOS系统${NC}"
    exit 1
fi

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未检测到Node.js${NC}"
    echo -e "${YELLOW}正在尝试使用Homebrew安装...${NC}"
    
    if command -v brew &> /dev/null; then
        brew install node
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Node.js安装失败${NC}"
            echo -e "${YELLOW}请手动安装Node.js: https://nodejs.org/${NC}"
            read -p "按回车键退出..."
            exit 1
        fi
    else
        echo -e "${YELLOW}未检测到Homebrew，请手动安装Node.js${NC}"
        echo -e "${YELLOW}下载地址: https://nodejs.org/${NC}"
        read -p "按回车键退出..."
        exit 1
    fi
fi

echo -e "${GREEN}✅ Node.js版本: $(node --version)${NC}"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 未检测到npm${NC}"
    read -p "按回车键退出..."
    exit 1
fi

echo -e "${GREEN}✅ npm版本: $(npm --version)${NC}"
echo ""

# 检查项目依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 正在安装项目依赖...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 依赖安装失败${NC}"
        read -p "按回车键退出..."
        exit 1
    fi
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
else
    echo -e "${GREEN}✅ 项目依赖已存在${NC}"
fi

echo ""

# 检查端口
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  端口3000已被占用${NC}"
    
    # 尝试访问现有服务
    if curl -s http://localhost:3000 > /dev/null; then
        echo -e "${GREEN}✅ 发现现有服务正在运行${NC}"
        echo -e "${BLUE}🌐 正在打开浏览器...${NC}"
        open http://localhost:3000
        echo ""
        echo -e "${YELLOW}如果浏览器没有自动打开，请手动访问: http://localhost:3000${NC}"
        read -p "按回车键退出..."
        exit 0
    else
        echo -e "${RED}❌ 现有服务无响应，将启动新服务${NC}"
    fi
fi

echo -e "${CYAN}🚀 正在启动开发服务器...${NC}"
echo -e "${GREEN}🌐 访问地址: http://localhost:3000${NC}"
echo ""

# 延迟打开浏览器
(sleep 3 && open http://localhost:3000) &
echo -e "${YELLOW}⏳ 3秒后自动打开浏览器...${NC}"

echo -e "${BLUE}按 Ctrl+C 停止服务器${NC}"
echo ""

# 启动开发服务器
npm run dev
