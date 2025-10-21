<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <AppHeader />
    
    <!-- Hero区域 -->
    <section class="hero-section page-background">
      <!-- Web3 背景效果 -->
      <div class="hero-bg-effects">
        <div class="grid-overlay"></div>
        <div class="particles">
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
        </div>
        <div class="gradient-orbs">
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <div class="orb orb-3"></div>
        </div>
        <!-- 东方Project主题粒子 -->
        <div class="hell-particles" v-if="appStore.isDarkMode">
          <div class="hell-particle fire-particle"></div>
          <div class="hell-particle soul-particle"></div>
          <div class="hell-particle spirit-particle"></div>
          <div class="hell-particle fire-particle"></div>
          <div class="hell-particle soul-particle"></div>
        </div>
        <div class="village-particles" v-else>
          <div class="village-particle sunlight-particle"></div>
          <div class="village-particle bamboo-particle"></div>
          <div class="village-particle sakura-particle"></div>
          <div class="village-particle sunlight-particle"></div>
          <div class="village-particle bamboo-particle"></div>
        </div>
      </div>
      
      <div class="hero-content page-content">
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
    <section class="products-section page-background">
      <div class="container page-content">
        <h2 class="section-title">{{ appStore.t('home.ourWineCulture') }}</h2>
        
        <!-- 希漫神兽系列轮播图 -->
        <div class="carousel-section">
          <TouhouCarousel :items="touhouNFTs" :autoplay="true" :interval="4000" />
        </div>
        
        <!-- 传统产品网格 -->
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
import TouhouCarousel from '@/components/common/TouhouCarousel.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 计算属性
const heroTitleLines = computed(() => {
  return appStore.t('home.heroTitle').split('\n')
})

// 希漫神兽系列NFT数据
const touhouNFTs = computed(() => {
  const isChinese = appStore.isChinese
  
  return [
    {
      id: 1,
      title: isChinese ? '青龙希漫 - 东方神兽' : 'Qinglong Siman - Eastern Divine Beast',
      description: isChinese 
        ? '青龙为东方神兽，代表木元素与春天，象征生机与成长。酒款采用清香型白酒，加入竹叶青、薄荷等草本植物，口感清冽如春风。'
        : 'Qinglong is the Eastern Divine Beast, representing wood element and spring, symbolizing vitality and growth. The wine uses light aroma baijiu with bamboo leaves, mint and other herbs, tasting fresh like spring breeze.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      badge: isChinese ? '青龙希漫' : 'Qinglong Siman',
      rarity: 'LEGENDARY',
      tags: isChinese 
        ? ['东方神兽', '木元素', '春天', '生机', '清香型']
        : ['Eastern Beast', 'Wood Element', 'Spring', 'Vitality', 'Light Aroma']
    },
    {
      id: 2,
      title: isChinese ? '白虎希漫 - 西方神兽' : 'Baihu Siman - Western Divine Beast',
      description: isChinese 
        ? '白虎为西方神兽，代表金元素与秋天，象征力量与威严。酒款采用浓香型白酒，加入桂花、陈皮等香料，口感醇厚如秋实。'
        : 'Baihu is the Western Divine Beast, representing metal element and autumn, symbolizing power and majesty. The wine uses strong aroma baijiu with osmanthus, tangerine peel and other spices, tasting mellow like autumn harvest.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      badge: isChinese ? '白虎希漫' : 'Baihu Siman',
      rarity: 'LEGENDARY',
      tags: isChinese 
        ? ['西方神兽', '金元素', '秋天', '力量', '浓香型']
        : ['Western Beast', 'Metal Element', 'Autumn', 'Power', 'Strong Aroma']
    },
    {
      id: 3,
      title: isChinese ? '朱雀希漫 - 南方神兽' : 'Zhuque Siman - Southern Divine Beast',
      description: isChinese 
        ? '朱雀为南方神兽，代表火元素与夏天，象征热情与活力。酒款采用玫瑰果酒，清甜果香，微气泡如飞天舞动，口感热烈如夏日。'
        : 'Zhuque is the Southern Divine Beast, representing fire element and summer, symbolizing passion and vitality. The wine uses rose fruit wine with sweet fruit aroma and micro-bubbles like flying dance, tasting passionate like summer.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      badge: isChinese ? '朱雀希漫' : 'Zhuque Siman',
      rarity: 'LEGENDARY',
      tags: isChinese 
        ? ['南方神兽', '火元素', '夏天', '热情', '果酒']
        : ['Southern Beast', 'Fire Element', 'Summer', 'Passion', 'Fruit Wine']
    },
    {
      id: 4,
      title: isChinese ? '玄武希漫 - 北方神兽' : 'Xuanwu Siman - Northern Divine Beast',
      description: isChinese 
        ? '玄武为北方神兽，代表水元素与冬天，象征智慧与深邃。酒款采用酱香型白酒，加入枸杞、雪梨等滋补食材，口感醇厚如冬雪。'
        : 'Xuanwu is the Northern Divine Beast, representing water element and winter, symbolizing wisdom and depth. The wine uses sauce aroma baijiu with wolfberry, snow pear and other nourishing ingredients, tasting mellow like winter snow.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      badge: isChinese ? '玄武希漫' : 'Xuanwu Siman',
      rarity: 'LEGENDARY',
      tags: isChinese 
        ? ['北方神兽', '水元素', '冬天', '智慧', '酱香型']
        : ['Northern Beast', 'Water Element', 'Winter', 'Wisdom', 'Sauce Aroma']
    },
    {
      id: 5,
      title: isChinese ? '黄龙希漫 - 中央神兽' : 'Huanglong Siman - Central Divine Beast',
      description: isChinese 
        ? '黄龙为中央神兽，代表土元素与皇权，象征丰收与安定。酒款采用浓香型白酒，醇厚如黄土，加入红枣、黄芪，余味温暖如大地。'
        : 'Huanglong is the Central Divine Beast, representing earth element and imperial power, symbolizing harvest and stability. The wine uses strong aroma baijiu, mellow like yellow earth, with red dates and astragalus, warm aftertaste like the earth.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      badge: isChinese ? '黄龙希漫' : 'Huanglong Siman',
      rarity: 'MYTHIC',
      tags: isChinese 
        ? ['中央神兽', '土元素', '皇权', '丰收', '浓香型']
        : ['Central Beast', 'Earth Element', 'Imperial Power', 'Harvest', 'Strong Aroma']
    }
  ]
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
  padding: var(--spacing-4xl) 0;
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
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.5), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(220, 38, 38, 0.3);
    box-shadow: var(--shadow-lg), var(--shadow-neon-primary);
    
    &::before {
      opacity: 1;
    }
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
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: particleFloat 8s ease-in-out infinite;
  
  &.particle-1 {
    background: var(--neon-gold);
    top: 20%;
    left: 20%;
    animation-delay: 0s;
  }
  
  &.particle-2 {
    background: var(--neon-red);
    top: 60%;
    left: 80%;
    animation-delay: 2s;
  }
  
  &.particle-3 {
    background: var(--neon-blue);
    top: 80%;
    left: 30%;
    animation-delay: 4s;
  }
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
  0%, 100% { 
    transform: translateY(0) translateX(0) scale(1); 
    opacity: 0.3; 
  }
  50% { 
    transform: translateY(-20px) translateX(20px) scale(1.2); 
    opacity: 1; 
  }
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

// Web3 Hero 内容样式更新 - 恢复原始丰富设计
.hero-section {
  position: relative;
  padding: var(--spacing-4xl) 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4xl);
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
    text-align: center;
  }
}

.hero-text {
  position: relative;
  z-index: 2;
}

.hero-title {
  margin-bottom: var(--spacing-xl);
  
  .title-line {
    display: block;
    background: linear-gradient(135deg, var(--text-primary) 0%, rgba(220, 38, 38, 0.8) 50%, rgba(255, 215, 0, 0.6) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
    font-size: var(--font-6xl);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: var(--spacing-sm);
    
    @media (max-width: 768px) {
      font-size: var(--font-4xl);
    }
  }
}

.hero-description {
  font-size: var(--font-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.hero-btn {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-lg);
  font-weight: 600;
  border-radius: var(--radius-xl);
  transition: all var(--transition-normal);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  &.hero-btn-secondary {
    background: transparent;
    border: 2px solid var(--neon-gold);
    color: var(--neon-gold);
    
    &:hover {
      background: var(--neon-gold);
      color: var(--bg-primary);
      transform: translateY(-2px);
    }
  }
}

.hero-image {
  position: relative;
  z-index: 2;
}

.image-container {
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl), var(--shadow-neon-primary);
}

.hero-img {
  width: 100%;
  height: auto;
  display: block;
}

.image-overlay {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
}

.nft-badge {
  background: linear-gradient(135deg, var(--neon-gold) 0%, var(--neon-orange) 100%);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg), var(--shadow-neon-gold);
  text-align: center;
  
  .badge-text {
    display: block;
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--bg-primary);
  }
  
  .badge-rarity {
    display: block;
    font-size: var(--font-xs);
    font-weight: 800;
    color: var(--bg-primary);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.hero-title {
  .title-line {
    background: linear-gradient(135deg, var(--text-primary) 0%, rgba(220, 38, 38, 0.8) 50%, rgba(255, 215, 0, 0.6) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
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
