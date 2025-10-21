<template>
  <div class="shop-page">
    <!-- 导航栏 -->
    <AppHeader />
    
    <!-- 页面内容 -->
    <main class="page-content">
      <!-- Hero区域 -->
      <section class="hero-section">
        <!-- 中国红背景效果 -->
        <div class="hero-bg-effects">
          <div class="shop-pattern"></div>
          <div class="coin-effects">
            <div class="coin coin-1"></div>
            <div class="coin coin-2"></div>
            <div class="coin coin-3"></div>
          </div>
          <div class="fortune-clouds">
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
          </div>
        </div>
        
        <div class="hero-content">
          <h1 class="page-title glow">{{ appStore.t('shop.title') }}</h1>
          <div class="fortune-banner">
            <div class="banner-content">💰 富贵满堂 💰</div>
          </div>
        </div>
      </section>
      
      <!-- 主要内容 -->
      <section class="main-content">
        <div class="container">
          <!-- 商店标题 -->
          <div class="shop-header">
            <h2 class="shop-title">{{ appStore.t('shop.subtitle') }}</h2>
          </div>
          
          <!-- NFT产品网格 -->
          <div class="nft-grid">
            <div class="nft-card card" :class="`card-${nft.rarity}`" v-for="nft in nftProducts" :key="nft.id">
              <div class="nft-image">
                <img :src="nft.image" :alt="nft.name" />
                <div class="rarity-badge" :class="`rarity-${nft.rarity}`">
                  {{ getRarityText(nft.rarity) }}
                </div>
              </div>
              <div class="nft-info">
                <h3 class="nft-name">{{ nft.name }}</h3>
                <p class="nft-description">{{ nft.description }}</p>
                <div class="nft-price">
                  <span class="price-label">{{ appStore.t('shop.priceLabel') }}:</span>
                  <span class="price-value">{{ nft.price }} ETH</span>
                </div>
                <div class="nft-actions">
                  <router-link to="/learn-more" class="btn btn-outline">{{ appStore.t('shop.learnMore') }}</router-link>
                  <button class="btn btn-gold buy-btn" @click="handleBuyNFT(nft)">{{ appStore.t('shop.buyNow') }}</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 购买规则 -->
          <div class="purchase-rules">
            <h3 class="rules-title">{{ appStore.t('shop.purchaseRules') }}</h3>
            <p class="rules-text">
              {{ appStore.t('shop.purchaseRulesText') }}
            </p>
          </div>
        </div>
      </section>
    </main>
    
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

// NFT产品数据（根据语言动态描述）
const nftProducts = computed(() => [
  {
    id: 1,
    name: appStore.t('shop.products.redWine'),
    description: appStore.t('shop.products.redWineDesc'),
    image: '/images/nftred-wine-nft.jpg',
    rarity: 'rare',
    price: '0.8'
  },
  {
    id: 2,
    name: appStore.t('shop.products.whisky'),
    description: appStore.t('shop.products.whiskyDesc'),
    image: '/images/nftblue-nft.jpg',
    rarity: 'epic',
    price: '1.5'
  },
  {
    id: 3,
    name: appStore.t('shop.products.whiteWine'),
    description: appStore.t('shop.products.whiteWineDesc'),
    image: '/images/nftflying-dragon-nft.jpg',
    rarity: 'rare',
    price: '0.9'
  },
  {
    id: 4,
    name: appStore.t('shop.products.flyingDragon'),
    description: appStore.t('shop.products.flyingDragonDesc'),
    image: '/images/nftlong-teng-nft.jpg',
    rarity: 'legendary',
    price: '3.0'
  },
  {
    id: 5,
    name: appStore.t('shop.products.blue'),
    description: appStore.t('shop.products.blueDesc'),
    image: '/images/nftwhite-wine-nft.jpg',
    rarity: 'epic',
    price: '1.2'
  },
  {
    id: 6,
    name: appStore.t('shop.products.longTeng'),
    description: appStore.t('shop.products.flyingDragonDesc'),
    image: '/images/nftwhisky-nft.jpg'
  }
])

// 获取稀有度文本（多语言）
const getRarityText = (rarity) => appStore.t(`shop.rarity.${rarity}`) || appStore.t('shop.rarity.common')

// 购买NFT处理函数
const handleBuyNFT = (nft) => {
  if (!appStore.isWalletConnected) {
    alert(appStore.t('common.connectWallet'))
    return
  }
  
  // 这里可以添加购买逻辑
  console.log('购买NFT:', nft.name)
  alert(`${appStore.t('shop.buyNow')}: ${nft.name}`)
}

onMounted(() => {
  console.log('Shop page mounted')
})
</script>

<style scoped lang="scss">
.shop-page {
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
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
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

.shop-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 0, 0, 0.1) 3px, transparent 3px),
    linear-gradient(90deg, rgba(255, 0, 0, 0.1) 3px, transparent 3px),
    radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 0, 0, 0.1) 0%, transparent 50%);
  background-size: 80px 80px, 80px 80px, 300px 300px, 300px 300px;
  animation: shopPatternMove 25s linear infinite;
}

.coin-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.coin {
  position: absolute;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, var(--neon-gold) 0%, transparent 70%);
  border-radius: 50%;
  animation: coinFloat 8s ease-in-out infinite;
  
  &.coin-1 {
    top: 20%;
    left: 15%;
    animation-delay: 0s;
  }
  
  &.coin-2 {
    top: 60%;
    right: 20%;
    animation-delay: 2s;
  }
  
  &.coin-3 {
    bottom: 30%;
    left: 60%;
    animation-delay: 4s;
  }
}

.fortune-clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.cloud {
  position: absolute;
  width: 150px;
  height: 80px;
  background: radial-gradient(ellipse, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(20px);
  animation: cloudFloat 12s ease-in-out infinite;
  
  &.cloud-1 {
    top: 10%;
    right: 10%;
    animation-delay: 0s;
  }
  
  &.cloud-2 {
    bottom: 20%;
    left: 10%;
    animation-delay: 6s;
  }
}

@keyframes shopPatternMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(80px, 80px); }
}

@keyframes coinFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes cloudFloat {
  0%, 100% { transform: translateX(0px) scale(1); }
  50% { transform: translateX(30px) scale(1.1); }
}

.fortune-banner {
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
    animation: bannerGlow 2s ease-in-out infinite;
    
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
      animation: bannerBorderGlow 3s ease-in-out infinite;
    }
  }
}

@keyframes bannerGlow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes bannerBorderGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
          background-image: url('/images/shop-hero.jpg');
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

.shop-header {
  text-align: center;
  margin-bottom: var(--spacing-4xl);
}

.shop-title {
  font-size: var(--font-8xl);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  
  @media (max-width: 1024px) {
    font-size: var(--font-6xl);
  }
  
  @media (max-width: 768px) {
    font-size: var(--font-4xl);
  }
}

.nft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-4xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
}

.nft-card {
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-8px) rotateX(5deg);
  }
  
  .nft-image {
    position: relative;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    
    &:hover img {
      transform: scale(1.1);
    }
  }
  
  .rarity-badge {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-md);
    font-size: var(--font-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: var(--shadow-md);
    
    &.rarity-rare {
      background: linear-gradient(135deg, var(--neon-gold) 0%, var(--neon-orange) 100%);
      color: var(--bg-primary);
      box-shadow: var(--shadow-neon-gold);
    }
    
    &.rarity-epic {
      background: linear-gradient(135deg, var(--neon-orange) 0%, var(--neon-crimson) 100%);
      color: var(--text-white);
      box-shadow: var(--shadow-neon-orange);
    }
    
    &.rarity-legendary {
      background: linear-gradient(135deg, var(--neon-crimson) 0%, var(--neon-pink) 100%);
      color: var(--text-white);
      box-shadow: var(--shadow-neon-crimson);
    }
  }
  
  .nft-info {
    padding: var(--spacing-lg);
    
    .nft-name {
      font-size: var(--font-lg);
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--neon-red) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .nft-description {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-md);
      line-height: 1.6;
    }
    
    .nft-price {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      
      .price-label {
        color: var(--text-light);
        font-weight: 600;
      }
      
      .price-value {
        color: var(--neon-gold);
        font-weight: 800;
        font-size: var(--font-lg);
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
      }
    }
    
    .nft-actions {
      display: flex;
      gap: var(--spacing-sm);
      
      .btn {
        flex: 1;
        text-align: center;
      }
    }
  }
}

.nft-image {
  height: 300px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }
}

.nft-card:hover .nft-image img {
  transform: scale(1.05);
}

.nft-info {
  padding: var(--spacing-xl);
}

.nft-name {
  font-size: var(--font-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.nft-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.nft-actions {
  display: flex;
  gap: var(--spacing-md);
}

.buy-btn {
  flex: 1;
  background-color: var(--accent-color);
  color: var(--text-primary);
  
  &:hover {
    background-color: var(--accent-light);
  }
}

.purchase-rules {
  text-align: center;
  background-color: var(--primary-color);
  color: var(--text-white);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

// 明亮主题提升可读性
[data-theme="light"] .purchase-rules {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  color: var(--text-primary);
}

.rules-title {
  font-size: var(--font-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

.rules-text {
  font-size: var(--font-xl);
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
}

// 响应式设计
@media (max-width: 1024px) {
  .page-title {
    font-size: var(--font-5xl);
  }
  
  .rules-title {
    font-size: var(--font-3xl);
  }
  
  .rules-text {
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
  
  .nft-info {
    padding: var(--spacing-lg);
  }
  
  .nft-name {
    font-size: var(--font-xl);
  }
  
  .nft-actions {
    flex-direction: column;
  }
  
  .purchase-rules {
    padding: var(--spacing-xl);
  }
  
  .rules-title {
    font-size: var(--font-2xl);
  }
  
  .rules-text {
    font-size: var(--font-base);
  }
}
</style>
