<template>
  <div class="our-story-page">
    <!-- 导航栏 -->
    <AppHeader />
    
    <!-- 页面内容 -->
    <main class="page-content">
      <!-- Hero区域 -->
      <section class="hero-section">
        <!-- 中国红背景效果 -->
        <div class="hero-bg-effects">
          <div class="story-pattern"></div>
          <div class="heritage-effects">
            <div class="heritage heritage-1"></div>
            <div class="heritage heritage-2"></div>
            <div class="heritage heritage-3"></div>
          </div>
          <div class="tradition-symbols">
            <div class="tradition-symbol symbol-1">🏮</div>
            <div class="tradition-symbol symbol-2">🏮</div>
          </div>
        </div>
        
        <div class="hero-content">
          <h1 class="page-title glow">{{ appStore.t('ourStory.title') }}</h1>
          <div class="heritage-banner">
            <div class="banner-content">🏮 传承经典 🏮</div>
          </div>
        </div>
      </section>
      
      <!-- 主要内容 -->
      <section class="main-content">
        <div class="container">
          <!-- 故事内容 -->
          <div class="story-content">
            <div class="story-image">
              <img src="/images/story-hero.jpg" alt="Our Story" class="story-img" />
            </div>
            <div class="story-text">
              <div class="story-description">
                <p>
                  {{ appStore.t('ourStory.story1') }}
                </p>
                <p>
                  {{ appStore.t('ourStory.story2') }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- 产品展示 -->
          <div class="product-showcase">
            <div class="showcase-images">
              <div class="image-item">
                <img src="/images/wine-1.jpg" alt="Wine 1" class="showcase-img" />
              </div>
              <div class="image-item">
                <img src="/images/wine-2.jpg" alt="Wine 2" class="showcase-img" />
              </div>
            </div>
            <div class="showcase-action">
              <router-link to="/shop" class="btn btn-primary showcase-btn">
                {{ appStore.t('ourStory.clickGoToShop') }}
              </router-link>
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
  console.log('Our Story page mounted')
})
</script>

<style scoped lang="scss">
.our-story-page {
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
          background-image: url('/images/story-background.jpg');
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
  padding: var(--spacing-5xl) 0;
  background-color: var(--bg-primary);
}

.story-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4xl);
  margin-bottom: var(--spacing-4xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

.story-image {
  position: relative;
  
  .story-img {
    width: 100%;
    height: auto;
    border-radius: var(--radius-3xl);
    box-shadow: var(--shadow-lg);
  }
}

.story-text {
  padding: var(--spacing-xl);
}

.story-description {
  p {
    font-size: var(--font-xl);
    line-height: 1.6;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.product-showcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xl);
}

.showcase-images {
  display: flex;
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
}

.image-item {
  position: relative;
  
  .showcase-img {
    width: 300px;
    height: 300px;
    object-fit: cover;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    transition: transform var(--transition-normal);
    
    &:hover {
      transform: scale(1.05);
    }
    
    @media (max-width: 768px) {
      width: 250px;
      height: 250px;
    }
  }
}

.showcase-action {
  margin-top: var(--spacing-xl);
}

.showcase-btn {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-xl);
  border-radius: var(--radius-xl);
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

.story-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 0, 0, 0.1) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255, 0, 0, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 0, 0, 0.1) 0%, transparent 50%);
  background-size: 75px 75px, 75px 75px, 280px 280px, 280px 280px;
  animation: storyPatternMove 30s linear infinite;
}

.heritage-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.heritage {
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255, 0, 0, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: heritageFloat 15s ease-in-out infinite;
  
  &.heritage-1 {
    top: 15%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &.heritage-2 {
    top: 70%;
    right: 15%;
    animation-delay: 5s;
  }
  
  &.heritage-3 {
    bottom: 15%;
    left: 70%;
    animation-delay: 10s;
  }
}

.tradition-symbols {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.tradition-symbol {
  position: absolute;
  font-size: 100px;
  opacity: 0.2;
  animation: traditionFloat 25s ease-in-out infinite;
  
  &.symbol-1 {
    top: 5%;
    right: 5%;
    animation-delay: 0s;
  }
  
  &.symbol-2 {
    bottom: 5%;
    left: 5%;
    animation-delay: 12s;
  }
}

@keyframes storyPatternMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(75px, 75px); }
}

@keyframes heritageFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-35px) scale(1.4); }
}

@keyframes traditionFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(180deg); }
}

.heritage-banner {
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
    animation: heritageGlow 2.8s ease-in-out infinite;
    
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
      animation: heritageBorderGlow 4.5s ease-in-out infinite;
    }
  }
}

@keyframes heritageGlow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes heritageBorderGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

// 响应式设计
@media (max-width: 1024px) {
  .page-title {
    font-size: var(--font-5xl);
  }
  
  .story-description p {
    font-size: var(--font-lg);
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
  
  .story-text {
    padding: var(--spacing-lg);
  }
  
  .story-description p {
    font-size: var(--font-base);
  }
  
  .showcase-btn {
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-lg);
  }
}
</style>
