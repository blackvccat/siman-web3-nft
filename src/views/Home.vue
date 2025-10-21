<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <AppHeader />
    
    <!-- Hero区域 -->
    <section class="hero-section">
      <!-- Web3 背景效果 -->
      <div class="hero-bg-effects">
        <div class="grid-overlay"></div>
        <div class="particles"></div>
        <div class="gradient-orbs">
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <div class="orb orb-3"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-line glow" v-for="(line, index) in heroTitleLines" :key="index">{{ line }}</span>
          </h1>
          <p class="hero-description">
            {{ appStore.t('home.heroDescription') }}
          </p>
          <div class="hero-actions">
            <router-link to="/our-story" class="btn btn-primary hero-btn neon-pulse">
              {{ appStore.t('home.startJourney') }}
            </router-link>
            <router-link to="/shop" class="btn btn-neon hero-btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
              </svg>
              View NFTs
            </router-link>
          </div>
        </div>
        <div class="hero-image">
          <div class="image-container">
            <img src="/images/hero-wine.jpg" alt="Siman Liquor" class="hero-img float" />
            <div class="image-overlay">
              <div class="nft-badge">
                <span class="badge-text">NFT #001</span>
                <span class="badge-rarity">LEGENDARY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 产品展示区域 -->
    <section class="products-section">
      <div class="container">
        <h2 class="section-title">{{ appStore.t('home.ourWineCulture') }}</h2>
        <div class="products-grid">
          <div class="product-card" v-for="product in products" :key="product.id">
            <div class="product-image">
              <img :src="product.image" :alt="product.name" @error="handleImageError" @load="handleImageLoad" />
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <router-link to="/learn-more" class="btn btn-outline product-btn">{{ appStore.t('home.learnMore') }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 计算属性
const heroTitleLines = computed(() => {
  return appStore.t('home.heroTitle').split('\n')
})

// 产品数据
const products = computed(() => [
  {
    id: 1,
    name: appStore.t('home.products.redWine'),
    description: appStore.t('home.products.redWineDesc'),
    image: '/images/red-wine.jpg'
  },
  {
    id: 2,
    name: appStore.t('home.products.whisky'),
    description: appStore.t('home.products.whiskyDesc'),
    image: '/images/whisky.jpg'
  },
  {
    id: 3,
    name: appStore.t('home.products.whiteWine'),
    description: appStore.t('home.products.whiteWineDesc'),
    image: '/images/white-wine.jpg'
  }
])

// 图片加载处理
const handleImageError = (event) => {
  console.error('图片加载失败:', event.target.src)
  // 设置默认图片或显示错误状态
  event.target.style.display = 'none'
}

const handleImageLoad = (event) => {
  console.log('图片加载成功:', event.target.src)
}

onMounted(() => {
  // 页面加载完成后的初始化
  console.log('Home page mounted')
  console.log('产品数据:', products.value)
})
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background-color: var(--primary-color);
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
}

.hero-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4xl);
  align-items: center;
}

.hero-text {
  color: var(--text-white);
}

.hero-title {
  font-size: var(--font-5xl);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: var(--spacing-xl);
  
  .title-line {
    display: block;
  }
}

.hero-description {
  font-size: var(--font-xl);
  line-height: 1.6;
  margin-bottom: var(--spacing-2xl);
  opacity: 0.9;
}

.hero-actions {
  margin-top: var(--spacing-2xl);
}

.hero-btn {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-lg);
  border-radius: var(--radius-xl);
}

.hero-image {
  position: relative;
}

.image-container {
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.hero-img {
  width: 100%;
  height: auto;
  display: block;
}

.products-section {
  padding: var(--spacing-5xl) 0;
  background-color: var(--bg-primary);
}

.section-title {
  text-align: center;
  font-size: var(--font-5xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4xl);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-2xl);
  margin-top: var(--spacing-3xl);
}

.product-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-custom);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }
}

.product-image {
  height: 300px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: var(--spacing-xl);
}

.product-name {
  font-size: var(--font-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.product-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.product-btn {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
}

// 响应式设计
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
    text-align: center;
  }
  
  .hero-title {
    font-size: var(--font-4xl);
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: var(--spacing-2xl) 0;
  }
  
  .hero-content {
    padding: 0 var(--spacing-md);
  }
  
  .hero-title {
    font-size: var(--font-3xl);
  }
  
  .hero-description {
    font-size: var(--font-lg);
  }
  
  .section-title {
    font-size: var(--font-4xl);
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}

// Web3 背景效果样式
.hero-bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255, 140, 0, 0.1) 0%, transparent 50%);
  animation: particleFloat 15s ease-in-out infinite;
}

.gradient-orbs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: orbFloat 20s ease-in-out infinite;
  
  &.orb-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 0, 0, 0.3) 0%, transparent 70%);
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &.orb-2 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 107, 157, 0.3) 0%, transparent 70%);
    top: 60%;
    right: 20%;
    animation-delay: 7s;
  }
  
  &.orb-3 {
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%);
    bottom: 20%;
    left: 60%;
    animation-delay: 14s;
  }
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

// Web3 Hero 内容样式更新
.hero-section {
  position: relative;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.hero-title {
  .title-line {
    background: linear-gradient(135deg, var(--text-primary) 0%, var(--neon-red) 50%, var(--neon-gold) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
  }
}

.hero-description {
  color: var(--text-secondary);
}

.image-container {
  border: 2px solid var(--border-neon);
  box-shadow: var(--shadow-xl), var(--shadow-neon-red);
}

.image-overlay {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
}

.nft-badge {
  background: linear-gradient(135deg, var(--neon-crimson) 0%, var(--neon-pink) 100%);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-neon-crimson);
  text-align: center;
  
  .badge-text {
    display: block;
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--text-white);
  }
  
  .badge-rarity {
    display: block;
    font-size: var(--font-xs);
    font-weight: 800;
    color: var(--text-white);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.hero-actions {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.hero-btn-secondary {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
