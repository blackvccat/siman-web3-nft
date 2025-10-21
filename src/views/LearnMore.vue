<template>
  <div class="learn-more-page">
    <!-- 导航栏 -->
    <AppHeader />
    
    <!-- 页面内容 -->
    <main class="page-content">
      <!-- Hero区域 -->
      <section class="hero-section page-background">
        <!-- 简化的中国红背景效果 -->
        <div class="hero-bg-effects">
          <div class="wisdom-pattern"></div>
          <div class="knowledge-effects">
            <div class="knowledge knowledge-1"></div>
            <div class="knowledge knowledge-2"></div>
          </div>
        </div>
        
        <div class="hero-content">
          <h1 class="page-title glow">{{ appStore.t('learnMore.title') }}</h1>
          <div class="learn-banner">
            <div class="banner-content">📖 了解更多 📖</div>
          </div>
        </div>
      </section>
      
      <!-- 主要内容 -->
      <section class="main-content page-background">
        <div class="container page-content">
          <!-- 产品介绍 -->
          <div class="product-intro">
            <div class="intro-header">
              <h2 class="intro-title">{{ appStore.t('learnMore.ourLiquor') }}</h2>
            </div>
            
            <!-- 产品展示 -->
            <div class="product-showcase">
              <div class="product-images">
                <div class="image-item">
                  <img src="/images/wine-1.jpg" alt="Wine 1" class="product-img" />
                </div>
                <div class="image-item">
                  <img src="/images/wine-2.jpg" alt="Wine 2" class="product-img" />
                </div>
                <div class="image-item">
                  <img src="/images/wine-3.jpg" alt="Wine 3" class="product-img" />
                </div>
              </div>
            </div>
            
            <!-- 产品描述 -->
            <div class="product-descriptions">
              <div class="description-card">
                <h3 class="card-title">{{ appStore.t('learnMore.feilongTitle') }}</h3>
                <p class="card-text">
                  {{ appStore.t('learnMore.feilongDesc1') }}
                </p>
                <p class="card-text">
                  {{ appStore.t('learnMore.feilongDesc2') }}
                </p>
              </div>
              
              <div class="description-card">
                <h3 class="card-title">{{ appStore.t('learnMore.qualityPromise') }}</h3>
                <p class="card-text">
                  {{ appStore.t('learnMore.qualityDesc') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onMounted(() => {
  console.log('Learn More page mounted')
})
</script>

<style scoped lang="scss">
.learn-more-page {
  min-height: 100vh;
  background-color: var(--primary-color);
}

.page-content {
  min-height: 100vh;
  padding-top: 80px;
}

.hero-section {
  position: relative;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
          background-image: url('/images/learn-more-hero.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(253, 67, 62, 0.8) 0%, rgba(191, 71, 65, 0.8) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--text-white);
}

.page-title {
  font-size: var(--font-6xl);
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.main-content {
  padding: var(--spacing-4xl) 0;
}

.product-intro {
  max-width: 1200px;
  margin: 0 auto;
}

.intro-header {
  text-align: center;
  margin-bottom: var(--spacing-4xl);
}

.intro-title {
  font-size: var(--font-7xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  
  @media (max-width: 1024px) {
    font-size: var(--font-5xl);
  }
  
  @media (max-width: 768px) {
    font-size: var(--font-4xl);
  }
}

.product-showcase {
  margin-bottom: var(--spacing-4xl);
}

.product-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}

.image-item {
  position: relative;
  
  .product-img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    transition: transform var(--transition-normal);
    
    &:hover {
      transform: scale(1.05);
    }
    
    @media (max-width: 768px) {
      height: 250px;
    }
  }
}

.product-descriptions {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-2xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
}

.description-card {
  background-color: var(--bg-primary);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-custom);
}

.card-title {
  font-size: var(--font-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.card-text {
  font-size: var(--font-lg);
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  
  &:last-child {
    margin-bottom: 0;
  }
}

// 中国红主题和中国元素样式
.hero-bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.wisdom-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 0, 0, 0.1) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255, 0, 0, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 0, 0, 0.1) 0%, transparent 50%);
  background-size: 65px 65px, 65px 65px, 220px 220px, 220px 220px;
  animation: wisdomPatternMove 40s linear infinite;
}

.knowledge-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.knowledge {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: knowledgeFloat 12s ease-in-out infinite;
  
  &.knowledge-1 {
    top: 20%;
    left: 15%;
    animation-delay: 0s;
  }
  
  &.knowledge-2 {
    top: 50%;
    right: 20%;
    animation-delay: 4s;
  }
  
  &.knowledge-3 {
    bottom: 20%;
    left: 60%;
    animation-delay: 8s;
  }
}

.wisdom-symbols {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.wisdom-symbol {
  position: absolute;
  font-size: 80px;
  opacity: 0.2;
  animation: wisdomFloat 20s ease-in-out infinite;
  
  &.symbol-1 {
    top: 10%;
    right: 10%;
    animation-delay: 0s;
  }
  
  &.symbol-2 {
    bottom: 10%;
    left: 10%;
    animation-delay: 10s;
  }
}

@keyframes wisdomPatternMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(65px, 65px); }
}

@keyframes knowledgeFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.3); }
}

@keyframes wisdomFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.wisdom-banner {
  margin-top: var(--spacing-xl);
  display: flex;
  justify-content: center;
  
  .banner-content {
    background: linear-gradient(135deg, var(--neon-gold) 0%, var(--neon-orange) 100%);
    color: var(--bg-primary);
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-lg);
    font-size: var(--font-lg);
    font-weight: 800;
    box-shadow: var(--shadow-neon-gold);
    border: 3px solid var(--neon-gold);
    position: relative;
    animation: wisdomGlow 3s ease-in-out infinite;
    
    &::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      background: linear-gradient(45deg, var(--neon-red), var(--neon-gold), var(--neon-red));
      border-radius: var(--radius-lg);
      z-index: -1;
      animation: wisdomBorderGlow 5s ease-in-out infinite;
    }
  }
}

@keyframes wisdomGlow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes wisdomBorderGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.intro-title {
  background: linear-gradient(135deg, var(--text-primary) 0%, rgba(220, 38, 38, 0.8) 50%, rgba(255, 215, 0, 0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.2);
}

// 响应式设计
@media (max-width: 1024px) {
  .page-title {
    font-size: var(--font-5xl);
  }
  
  .card-title {
    font-size: var(--font-2xl);
  }
  
  .card-text {
    font-size: var(--font-base);
  }
}

@media (max-width: 768px) {
  .page-content {
    padding-top: 70px;
  }
  
  .hero-section {
    height: 50vh;
  }
  
  .page-title {
    font-size: var(--font-4xl);
  }
  
  .description-card {
    padding: var(--spacing-xl);
  }
  
  .card-title {
    font-size: var(--font-xl);
  }
  
  .card-text {
    font-size: var(--font-sm);
  }
}
</style>
