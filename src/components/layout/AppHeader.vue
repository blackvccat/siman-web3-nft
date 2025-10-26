<template>
  <!-- 
    应用头部组件
    功能: 网站顶部导航栏，包含Logo、折叠式导航、主题切换、语言切换、钱包连接
    设计: 响应式设计，支持桌面端和移动端
    特色: 折叠式导航设计，点击"导航"按钮展开下拉菜单
  -->
  <header class="app-header">
    <div class="header-container">
      <!-- 
        Logo区域
        功能: 显示希漫酒业Logo
        位置: 左上角
        响应式: 不同屏幕尺寸下自动调整大小
      -->
      <div class="logo">
        <img src="/images/logo.png" alt="Siman Liquor" class="logo-img" />
      </div>
      
      <!-- 
        导航菜单 - 汉堡式设计
        功能: 点击汉堡菜单按钮展开全屏菜单
        位置: 页面中央
        样式: 现代化按钮设计，带图标和悬停效果
        响应式: 桌面端和移动端都使用汉堡菜单
      -->
      <nav class="main-nav">
        <!-- 汉堡菜单按钮 -->
        <button 
          class="hamburger-menu-toggle" 
          @click="toggleMenu"
          :class="{ 'active': menuOpen }"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </nav>
      
      <!-- 
        右侧操作区
        功能: 包含主题切换、语言切换、钱包连接
        布局: 水平排列，响应式设计
        桌面端: 显示所有功能
        移动端: 部分功能移至下拉菜单
      -->
      <div class="header-actions">
        <!-- 购物车图标 -->
        <CartIcon />
        
        <!-- 
          主题切换组件
          功能: 在明暗主题之间切换
          组件: ThemeToggle.vue
        -->
        <ThemeToggle />
        
        <!-- 
          语言切换
          功能: 在中英文之间切换
          状态: 根据当前语言显示激活状态
          桌面端: 显示完整按钮
          移动端: 隐藏，移至下拉菜单
        -->
        <div class="language-switcher">
          <button 
            class="lang-btn"
            :class="{ 'active': isChinese }"
            @click="setLanguage('zh')"
          >
            中文
          </button>
          <button 
            class="lang-btn"
            :class="{ 'active': isEnglish }"
            @click="setLanguage('en')"
          >
            EN
          </button>
        </div>
        
        <!-- 
          钱包连接区域
          功能: 显示钱包连接状态或连接按钮
          状态: 根据isWalletConnected显示不同内容
          桌面端: 显示完整信息
          移动端: 隐藏，移至下拉菜单
        -->
        <div class="wallet-section">
          <div v-if="isWalletConnected" class="wallet-connected">
            <div class="wallet-status">
              <span class="status-dot"></span>
              <span class="status-text">{{ appStore.t('common.walletConnected') }}</span>
            </div>
            <div class="wallet-address">
              {{ formatAddress(walletAddress) }}
            </div>
          </div>
          <button v-else class="btn btn-primary connect-btn" @click="connectWallet">
            {{ appStore.t('common.connectWallet') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 
      下拉式导航菜单
      功能: 折叠式导航菜单，点击导航按钮后展开
      位置: 固定在页面顶部，覆盖内容区域
      动画: 从顶部滑入滑出效果
      内容: 包含所有导航链接、钱包功能、主题切换
    -->
    <div class="mobile-nav" :class="{ 'mobile-nav-open': menuOpen }">
      <div class="mobile-nav-content">
        <!-- 
          导航菜单
          功能: 显示所有页面导航链接
          样式: 垂直列表，带图标和激活状态
        -->
        <nav class="mobile-nav-menu">
          <ul class="mobile-nav-list">
            <li class="mobile-nav-item" v-for="item in navItems" :key="item.name">
              <router-link 
                :to="item.path" 
                class="mobile-nav-link"
                :class="{ 'active': $route.name === item.name }"
                @click="closeMenu"
              >
                <span class="nav-icon" v-html="getNavIcon(item.name)"></span>
                <span class="nav-text">{{ item.label }}</span>
                <span v-if="$route.name === item.name" class="nav-indicator">●</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- 
          菜单底部功能区
          功能: 包含钱包连接和主题切换
          布局: 垂直排列，适合移动端操作
        -->
        <div class="mobile-nav-footer">
          <!-- 
            移动端钱包区域
            功能: 在移动端显示钱包连接状态
            内容: 连接状态、地址显示、断开连接按钮
          -->
          <div class="mobile-wallet-section">
            <div v-if="isWalletConnected" class="mobile-wallet-connected">
              <div class="wallet-info">
                <div class="wallet-status">
                  <span class="status-dot"></span>
                  <span>{{ appStore.t('common.walletConnected') }}</span>
                </div>
                <div class="wallet-address">{{ formatAddress(walletAddress) }}</div>
              </div>
              <button class="disconnect-btn" @click="disconnectWallet">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" stroke="currentColor" stroke-width="2"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            <button v-else class="mobile-connect-btn" @click="connectWallet">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M6 10H18" stroke="currentColor" stroke-width="2"/>
              </svg>
              {{ appStore.t('common.connectWallet') }}
            </button>
          </div>

          <!-- 
            移动端主题切换区域
            功能: 在移动端显示主题切换功能
            布局: 水平排列，标签+切换按钮
          -->
          <div class="mobile-theme-section">
            <span class="section-label">{{ appStore.t('common.toggleTheme') }}</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
/**
 * 应用头部组件
 * 功能: 网站顶部导航栏，包含Logo、折叠式导航、主题切换、语言切换、钱包连接
 * 特色: 折叠式导航设计，点击"导航"按钮展开下拉菜单
 * 响应式: 支持桌面端和移动端，自适应布局
 */

// Vue 3 Composition API
import { computed } from 'vue'

// 状态管理
import { useAppStore } from '@/stores/app'

// 组件导入
import ThemeToggle from '@/components/common/ThemeToggle.vue'  // 主题切换组件
import CartIcon from '@/components/common/CartIcon.vue'  // 购物车图标组件

// 获取应用状态管理实例
const appStore = useAppStore()

// 导航菜单项配置
// 功能: 定义所有页面导航链接
// 结构: 包含名称、路径、标签（支持国际化）
const navItems = computed(() => [
  { name: 'Home', path: '/', label: appStore.t('nav.home') },
  { name: 'About', path: '/about', label: appStore.t('nav.about') },
  { name: 'OurStory', path: '/our-story', label: appStore.t('nav.ourStory') },
  { name: 'Shop', path: '/shop', label: appStore.t('nav.shop') },
  { name: 'LearnMore', path: '/learn-more', label: appStore.t('nav.learnMore') },
  { name: 'Contact', path: '/contact', label: appStore.t('nav.contact') }
])

// 计算属性 - 语言状态
const isChinese = computed(() => appStore.isChinese)  // 是否为中文
const isEnglish = computed(() => appStore.isEnglish)  // 是否为英文

// 计算属性 - 钱包状态
const isWalletConnected = computed(() => appStore.isWalletConnected)  // 钱包是否已连接
const walletAddress = computed(() => appStore.walletAddress)          // 钱包地址

// 计算属性 - 菜单状态
const menuOpen = computed(() => appStore.menuOpen)  // 导航菜单是否打开

// 方法 - 语言切换
const setLanguage = (lang) => {
  appStore.setLanguage(lang)
}

// 方法 - 菜单控制
const toggleMenu = () => {
  appStore.toggleMenu()  // 切换菜单开关状态
}

const closeMenu = () => {
  appStore.closeMenu()   // 关闭菜单
}

// 方法 - 钱包连接
const connectWallet = () => {
  // 模拟钱包连接
  // 实际项目中应该调用真实的钱包连接API
  const mockAddress = '0x6xcb2das' + Math.random().toString(36).substr(2, 9)
  appStore.connectWallet(mockAddress)
}

const disconnectWallet = () => {
  appStore.disconnectWallet()
}

// 方法 - 地址格式化
const formatAddress = (address) => {
  if (!address) return ''
  // 将长地址格式化为短地址显示
  return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address
}

// 方法 - 获取导航图标
const getNavIcon = (name) => {
  // 为每个导航项分配对应的SVG图标
  const icons = {
    'Home': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>`,
    'About': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>`,
    'OurStory': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>`,
    'Shop': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>`,
    'LearnMore': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>`,
    'Contact': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>`
  }
  return icons[name] || `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
  </svg>`  // 默认图标
}
</script>

<style scoped lang="scss">
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--bg-primary);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
  z-index: 1000;
  padding: 15px 0;
  transition: all 0.3s ease;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  min-height: 60px;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 15px;
    min-height: 55px;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
    min-height: 50px;
  }
}

.logo {
  display: flex;
  align-items: center;
  z-index: 1002;
  flex-shrink: 0;
  
  .logo-img {
    height: 40px;
    width: auto;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      height: 35px;
    }

    @media (max-width: 480px) {
      height: 30px;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 8px;
    flex-wrap: nowrap;
  }

  @media (max-width: 480px) {
    gap: 5px;
  }
}

.main-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1004;
}

.hamburger-menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border: 1px solid var(--border-neon);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-custom), var(--shadow-neon-blue);
  backdrop-filter: blur(20px);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    background: linear-gradient(135deg, var(--neon-red) 0%, var(--neon-crimson) 100%);
    border-color: var(--neon-red);
    transform: translateX(-50%) translateY(-3px) scale(1.05);
    box-shadow: var(--shadow-neon-red), var(--shadow-lg);

    &::before {
      left: 100%;
    }

    .hamburger-line {
      background-color: var(--text-white);
    }
  }

  &.active {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    border-color: var(--primary-color);
    box-shadow: var(--shadow-neon-primary), var(--shadow-lg);
    transform: translateX(-50%) scale(1.02);

    .hamburger-line {
      background-color: var(--text-white);
    }
  }
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background-color: var(--text-primary);
  border-radius: 2px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 2px 0;
  transform-origin: center;

  &:nth-child(1) {
    .hamburger-menu-toggle.active & {
      transform: translateY(6px) rotate(45deg);
    }
  }

  &:nth-child(2) {
    .hamburger-menu-toggle.active & {
      opacity: 0;
      transform: scale(0);
    }
  }

  &:nth-child(3) {
    .hamburger-menu-toggle.active & {
      transform: translateY(-6px) rotate(-45deg);
    }
  }
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(20px);
  gap: 4px;

  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(253, 67, 62, 0.3);

    .hamburger-line {
      background-color: var(--text-white);
    }
  }

  &.active {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    transform: scale(1.05);

    .hamburger-line {
      background-color: var(--text-white);

      &:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
  }
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background-color: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.language-switcher {
  display: flex;
  gap: 5px;
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: var(--radius-md);

  @media (max-width: 768px) {
    display: none;
  }
}

.lang-btn {
  background-color: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;

  &:hover, &.active {
    background-color: var(--primary-color);
    color: var(--text-white);
    transform: scale(1.05);
  }
}

.wallet-section {
  @media (max-width: 768px) {
    display: none;
  }
}

.wallet-connected {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-secondary);
  padding: 8px 15px;
  border-radius: 20px;
  color: var(--text-primary);
  font-size: 0.9rem;
  box-shadow: var(--shadow-sm);
}

.wallet-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #28a745;
  border-radius: 50%;
}

.wallet-address {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.connect-btn {
  padding: 8px 16px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(253, 67, 62, 0.3);
  }
}

.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
  visibility: hidden;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;

  &.mobile-nav-open {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
  }
}

.mobile-nav-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  backdrop-filter: blur(30px);
  box-shadow: var(--shadow-xl), var(--shadow-neon-red);
  border-radius: 0 0 32px 32px;
  border: 1px solid var(--border-neon);
  transform: translateY(-100%);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 32px;
  margin-top: 90px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--neon-red), var(--neon-pink), transparent);
    animation: neonPulse 3s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .mobile-nav-open & {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 24px;
    margin-top: 80px;
    border-radius: 0 0 24px 24px;
  }

  @media (min-width: 1200px) {
    padding: 40px;
    margin-top: 100px;
    border-radius: 0 0 40px 40px;
  }
}

// 明亮主题下的下拉可读性
[data-theme="light"] .mobile-nav-content {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  color: var(--text-primary);
}

.mobile-nav-menu {
  padding: 0;
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-nav-item {
  margin: 0;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-radius: 16px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(253, 67, 62, 0.1), transparent);
    transition: left 0.6s ease;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 0;
    background: linear-gradient(180deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    border-radius: 0 2px 2px 0;
    transition: height 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(253, 67, 62, 0.08) 0%, rgba(253, 67, 62, 0.03) 100%);
    color: var(--primary-color);
    transform: translateX(12px) translateY(-3px);
    border-color: rgba(253, 67, 62, 0.2);
    box-shadow: 0 8px 25px rgba(253, 67, 62, 0.15), 0 4px 12px rgba(253, 67, 62, 0.1);

    &::before {
      left: 100%;
    }

    &::after {
      height: 60%;
    }
  }

  &.active {
    background: linear-gradient(135deg, rgba(253, 67, 62, 0.12) 0%, rgba(253, 67, 62, 0.06) 100%);
    color: var(--primary-color);
    border-left: 4px solid var(--primary-color);
    border-color: rgba(253, 67, 62, 0.3);
    box-shadow: 0 8px 25px rgba(253, 67, 62, 0.15), 0 4px 12px rgba(253, 67, 62, 0.1);
    transform: translateX(8px);

    &::after {
      height: 80%;
    }
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 1rem;
    gap: 16px;
    margin-bottom: 10px;
  }

  @media (min-width: 1200px) {
    padding: 24px 28px;
    font-size: 1.2rem;
    gap: 24px;
    margin-bottom: 16px;
  }
}

.nav-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);

  svg {
    width: 20px;
    height: 20px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  .mobile-nav-link:hover & {
    transform: scale(1.1) rotate(5deg);
    background: rgba(253, 67, 62, 0.1);
    border-color: rgba(253, 67, 62, 0.3);
    box-shadow: 0 4px 12px rgba(253, 67, 62, 0.2);
    color: var(--primary-color);

    svg {
      transform: scale(1.1);
      filter: drop-shadow(0 2px 4px rgba(253, 67, 62, 0.3));
    }
  }

  .mobile-nav-link.active & {
    transform: scale(1.05);
    background: rgba(253, 67, 62, 0.15);
    border-color: rgba(253, 67, 62, 0.4);
    box-shadow: 0 4px 12px rgba(253, 67, 62, 0.25);
    color: var(--primary-color);

    svg {
      filter: drop-shadow(0 2px 4px rgba(253, 67, 62, 0.4));
    }
  }
}

.nav-text {
  flex: 1;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.nav-indicator {
  color: var(--primary-color);
  font-size: 1.2rem;
  font-weight: bold;
  animation: pulse 2s infinite;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(253, 67, 62, 0.3));
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.mobile-nav-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(253, 67, 62, 0.5), transparent);
  }
}

.mobile-wallet-section {
  .mobile-wallet-connected {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    padding: 16px 20px;
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
  }

  .wallet-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.9rem;
    color: var(--text-primary);
  }

  .wallet-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .status-dot {
    width: 10px;
    height: 10px;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(40, 167, 69, 0.4);
    animation: pulse 2s infinite;
  }

  .wallet-address {
    font-family: var(--font-mono);
    opacity: 0.8;
    font-size: 0.8rem;
    background: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .disconnect-btn {
    background: rgba(253, 67, 62, 0.1);
    border: 1px solid rgba(253, 67, 62, 0.2);
    color: var(--primary-color);
    cursor: pointer;
    padding: 10px;
    border-radius: 12px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(253, 67, 62, 0.2);
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(253, 67, 62, 0.2);
    }
  }

  .mobile-connect-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px 20px;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: var(--text-white);
    border: none;
    border-radius: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(253, 67, 62, 0.3), 0 4px 12px rgba(253, 67, 62, 0.2);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(253, 67, 62, 0.4), 0 6px 16px rgba(253, 67, 62, 0.3);

      &::before {
        left: 100%;
      }
    }
  }
}

.mobile-theme-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);

  .section-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 0.3px;
  }
}
</style>
