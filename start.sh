#!/bin/bash
# Siman Liquor - 希漫酒业项目启动脚本 (macOS版本)
# 作者: AI Assistant
# 版本: 1.0.0
# 描述: 一键启动希漫酒业Vue.js项目

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🍷 欢迎使用希漫酒业项目启动脚本${NC}"
echo -e "${CYAN}==================================${NC}"
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未检测到Node.js，请先安装Node.js${NC}"
    echo -e "${YELLOW}   下载地址: https://nodejs.org/${NC}"
    echo -e "${YELLOW}   或使用Homebrew: brew install node${NC}"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 错误: 未检测到npm，请先安装npm${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js版本: $(node --version)${NC}"
echo -e "${GREEN}✅ npm版本: $(npm --version)${NC}"
echo ""

# 检查项目依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 正在安装项目依赖...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 依赖安装失败，请检查网络连接或npm配置${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
else
    echo -e "${GREEN}✅ 项目依赖已存在${NC}"
fi

echo ""

# 检查端口是否被占用
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  端口3000已被占用，尝试访问现有服务...${NC}"
    
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