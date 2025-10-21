<template>
  <div class="about-page">
    <!-- 导航栏 -->
    <AppHeader />
    
    <!-- 页面内容 -->
    <main class="page-content">
      <!-- Hero区域 -->
      <section class="hero-section">
        <!-- 简化的中国红背景效果 -->
        <div class="hero-bg-effects">
          <div class="about-pattern"></div>
          <div class="red-particles">
            <div class="particle particle-1"></div>
          </div>
        </div>
        
        <div class="hero-content">
          <h1 class="page-title glow">{{ appStore.t('about.title') }}</h1>
          <div class="about-banner">
            <div class="banner-content">🏮 关于我们 🏮</div>
          </div>
        </div>
      </section>
      
      <!-- 主要内容 -->
      <section class="main-content page-background">
        <div class="container page-content">
          <!-- 关于我们介绍 -->
          <div class="about-intro">
            <div class="intro-card card card-nft">
              <div class="card-header">
                <div class="chinese-border"></div>
                <h2 class="intro-title">{{ appStore.t('about.title') }}</h2>
              </div>
              <p class="intro-subtitle">
                {{ appStore.t('about.subtitle') }}
              </p>
            </div>
          </div>
          
          <!-- 详细内容 -->
          <div class="about-details">
            <div class="content-image">
              <img src="/images/about-wine.jpg" alt="About Siman Liquor" class="about-img" />
            </div>
            <div class="content-text">
              <h3 class="content-title">{{ appStore.t('about.contentTitle') }}</h3>
              <div class="content-description">
                <p>{{ appStore.t('about.content1') }}</p>
                <p>{{ appStore.t('about.content2') }}</p>
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
  console.log('About page mounted')
})
</script>

<style scoped lang="scss">
.about-page {
  min-height: 100vh;
  background-color: var(--primary-color);
}

.page-content {
  min-height: 100vh;
  padding-top: 80px; // 为固定导航栏留出空间
}

.hero-section {
  position: relative;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

// 简化的中国红背景效果
.hero-bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

// 简化的关于页面图案
.about-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 30% 30%, rgba(220, 38, 38, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(255, 215, 0, 0.08) 0%, transparent 50%);
  background-size: 400px 400px, 300px 300px;
  animation: aboutPatternMove 60s linear infinite;
}

// 简化的红色粒子效果
.red-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat 12s ease-in-out infinite;
  
  &.particle-1 {
    top: 20%;
    left: 15%;
    animation-delay: 0s;
  }
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

.about-banner {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg) var(--spacing-2xl);
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(255, 215, 0, 0.9) 100%);
  border-radius: var(--radius-xl);
  border: 2px solid rgba(220, 38, 38, 0.5);
  box-shadow: var(--shadow-lg), var(--shadow-neon-red);
  animation: bannerGlow 3s ease-in-out infinite alternate;
}

.banner-content {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--text-white);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/about-hero.jpg');
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

.about-intro {
  margin-bottom: var(--spacing-4xl);
}

.intro-card {
  background-color: var(--primary-color);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-4xl);
  text-align: center;
  color: var(--text-white);
  box-shadow: var(--shadow-xl);
}

.intro-title {
  font-size: var(--font-5xl);
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
}

.intro-subtitle {
  font-size: var(--font-xl);
  line-height: 1.6;
  opacity: 0.9;
}

.about-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4xl);
  align-items: center;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

.content-image {
  position: relative;
  
  .about-img {
    width: 100%;
    height: auto;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
  }
}

.content-text {
  padding: var(--spacing-xl);
}

.content-title {
  font-size: var(--font-5xl);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xl);
}

.content-description {
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

.chinese-pattern {
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
  background-size: 60px 60px, 60px 60px, 200px 200px, 200px 200px;
  animation: chinesePatternMove 30s linear infinite;
}

.red-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255, 0, 0, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255, 140, 0, 0.15) 0%, transparent 50%);
  animation: redParticleFloat 20s ease-in-out infinite;
}

.golden-dragons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.dragon {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(ellipse, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(30px);
  animation: dragonFloat 25s ease-in-out infinite;
  
  &.dragon-1 {
    top: 15%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &.dragon-2 {
    bottom: 15%;
    right: 10%;
    animation-delay: 12s;
  }
}

@keyframes chinesePatternMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(60px, 60px); }
}

@keyframes redParticleFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

@keyframes dragonFloat {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(20px, -20px) scale(1.1) rotate(90deg); }
  50% { transform: translate(-10px, 10px) scale(0.9) rotate(180deg); }
  75% { transform: translate(15px, -15px) scale(1.05) rotate(270deg); }
}

.chinese-seal {
  margin-top: var(--spacing-xl);
  display: flex;
  justify-content: center;
  
  .seal-content {
    background: linear-gradient(135deg, var(--neon-gold) 0%, var(--neon-orange) 100%);
    color: var(--bg-primary);
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-lg);
    font-size: var(--font-lg);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    box-shadow: var(--shadow-neon-gold);
    border: 3px solid var(--neon-gold);
    position: relative;
    
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
      animation: sealGlow 3s ease-in-out infinite;
    }
  }
}

@keyframes sealGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.card-header {
  position: relative;
  margin-bottom: var(--spacing-lg);
  
  .chinese-border {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(45deg, var(--neon-red), var(--neon-gold), var(--neon-red));
    border-radius: var(--radius-xl);
    z-index: -1;
    opacity: 0.3;
    animation: borderPulse 4s ease-in-out infinite;
  }
}

@keyframes borderPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.02); }
}

.intro-title {
  background: linear-gradient(135deg, var(--text-primary) 0%, rgba(220, 38, 38, 0.8) 50%, rgba(255, 215, 0, 0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.2);
}

.content-image {
  position: relative;
  
  .about-img {
    border: 3px solid var(--border-neon);
    box-shadow: var(--shadow-xl), var(--shadow-neon-red);
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(255, 0, 0, 0.1), transparent);
      pointer-events: none;
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .page-title {
    font-size: var(--font-5xl);
  }
  
  .intro-title {
    font-size: var(--font-4xl);
  }
  
  .intro-subtitle {
    font-size: var(--font-lg);
  }
  
  .content-title {
    font-size: var(--font-4xl);
  }
  
  .content-description p {
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
  
  .intro-card {
    padding: var(--spacing-2xl);
  }
  
  .intro-title {
    font-size: var(--font-3xl);
  }
  
  .intro-subtitle {
    font-size: var(--font-base);
  }
  
  .content-text {
    padding: var(--spacing-lg);
  }
  
  .content-title {
    font-size: var(--font-3xl);
  }
  
  .content-description p {
    font-size: var(--font-base);
  }
}
</style>
