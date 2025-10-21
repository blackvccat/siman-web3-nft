<template>
  <div class="touhou-carousel">
    <!-- 轮播图容器 -->
    <div class="carousel-container" ref="carouselContainer">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div 
          class="carousel-slide" 
          v-for="(item, index) in items" 
          :key="index"
          :class="{ active: index === currentIndex }"
        >
          <div class="slide-content">
            <div class="slide-image">
              <img :src="item.image" :alt="item.title" @error="handleImageError" />
              <div class="image-overlay">
                <div class="nft-badge">
                  <span class="badge-text">{{ item.badge }}</span>
                  <span class="badge-rarity">{{ item.rarity }}</span>
                </div>
              </div>
            </div>
            <div class="slide-info">
              <h3 class="slide-title">{{ item.title }}</h3>
              <p class="slide-description">{{ item.description }}</p>
              <div class="slide-tags">
                <span class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 导航按钮 -->
      <button class="carousel-btn prev-btn" @click="prevSlide" :disabled="isTransitioning">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="carousel-btn next-btn" @click="nextSlide" :disabled="isTransitioning">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <!-- 指示器 -->
    <div class="carousel-indicators">
      <button 
        class="indicator" 
        v-for="(item, index) in items" 
        :key="index"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      ></button>
    </div>
    
    <!-- 自动播放控制 -->
    <div class="carousel-controls">
      <button class="control-btn" @click="toggleAutoplay">
        <svg v-if="!isAutoplay" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M8 5V19L19 12L8 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="6" y="4" width="4" height="16" stroke="currentColor" stroke-width="2"/>
          <rect x="14" y="4" width="4" height="16" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  }
})

// 响应式数据
const currentIndex = ref(0)
const isAutoplay = ref(props.autoplay)
const isTransitioning = ref(false)
const carouselContainer = ref(null)
let autoplayTimer = null

// 计算属性
const totalSlides = computed(() => props.items.length)

// 方法
const nextSlide = () => {
  if (isTransitioning.value) return
  
  isTransitioning.value = true
  currentIndex.value = (currentIndex.value + 1) % totalSlides.value
  
  setTimeout(() => {
    isTransitioning.value = false
  }, 300)
}

const prevSlide = () => {
  if (isTransitioning.value) return
  
  isTransitioning.value = true
  currentIndex.value = currentIndex.value === 0 ? totalSlides.value - 1 : currentIndex.value - 1
  
  setTimeout(() => {
    isTransitioning.value = false
  }, 300)
}

const goToSlide = (index) => {
  if (isTransitioning.value || index === currentIndex.value) return
  
  isTransitioning.value = true
  currentIndex.value = index
  
  setTimeout(() => {
    isTransitioning.value = false
  }, 300)
}

const toggleAutoplay = () => {
  isAutoplay.value = !isAutoplay.value
  if (isAutoplay.value) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
}

const startAutoplay = () => {
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    nextSlide()
  }, props.interval)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const handleImageError = (event) => {
  event.target.src = '/images/placeholder.jpg'
}

// 生命周期
onMounted(() => {
  if (isAutoplay.value) {
    startAutoplay()
  }
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped lang="scss">
.touhou-carousel {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) 0;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl), var(--shadow-neon-primary);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  
  // 神兽主题背景效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(220, 38, 38, 0.08) 0%, transparent 60%),
      radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, rgba(0, 123, 255, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: divineGlow 6s ease-in-out infinite alternate;
  }
  
  // 神兽纹理
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(220, 38, 38, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(220, 38, 38, 0.03) 1px, transparent 1px),
      linear-gradient(45deg, rgba(255, 215, 0, 0.02) 1px, transparent 1px);
    background-size: 50px 50px, 50px 50px, 25px 25px;
    pointer-events: none;
    z-index: 0;
    animation: divinePattern 20s linear infinite;
  }
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
}

.carousel-slide {
  flex: 0 0 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
}

.slide-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
  width: 100%;
  height: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    text-align: center;
  }
}

.slide-image {
  position: relative;
  height: 100%;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.slide-image:hover img {
  transform: scale(1.05);
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
  border: 2px solid rgba(255, 215, 0, 0.3);
  
  .badge-text {
    display: block;
    font-size: var(--font-sm);
    font-weight: 700;
    color: var(--bg-primary);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  .badge-rarity {
    display: block;
    font-size: var(--font-xs);
    font-weight: 800;
    color: var(--bg-primary);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }
}

.slide-info {
  padding: var(--spacing-xl);
}

.slide-title {
  font-size: var(--font-4xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, var(--text-primary) 0%, rgba(220, 38, 38, 0.8) 50%, rgba(255, 215, 0, 0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slide-description {
  font-size: var(--font-lg);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
}

.slide-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(255, 215, 0, 0.15) 100%);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  font-weight: 600;
  border: 1px solid rgba(220, 38, 38, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(255, 215, 0, 0.25) 100%);
    border-color: rgba(220, 38, 38, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
    
    &::before {
      left: 100%;
    }
  }
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border: 2px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--neon-gold) 100%);
    border-color: var(--neon-gold);
    color: var(--text-white);
    transform: translateY(-50%) scale(1.1);
    box-shadow: var(--shadow-lg), var(--shadow-neon-gold);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.prev-btn {
    left: var(--spacing-lg);
  }
  
  &.next-btn {
    right: var(--spacing-lg);
  }
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.3);
  border: none;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: rgba(220, 38, 38, 0.6);
    transform: scale(1.2);
  }
  
  &.active {
    background: var(--primary-color);
    box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
  }
}

.carousel-controls {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 10;
}

.control-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--neon-gold) 100%);
    border-color: var(--neon-gold);
    color: var(--text-white);
    transform: scale(1.1);
  }
}

// 神兽主题动画效果
@keyframes divineGlow {
  0% { 
    opacity: 0.6;
    transform: scale(1) rotate(0deg);
  }
  50% { 
    opacity: 1;
    transform: scale(1.05) rotate(180deg);
  }
  100% { 
    opacity: 0.6;
    transform: scale(1) rotate(360deg);
  }
}

@keyframes divinePattern {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes slideInScale {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideInFade {
  0% {
    transform: translateX(30px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .carousel-container {
    height: 400px;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    
    &.prev-btn {
      left: var(--spacing-sm);
    }
    
    &.next-btn {
      right: var(--spacing-sm);
    }
  }
  
  .slide-title {
    font-size: var(--font-3xl);
  }
  
  .slide-description {
    font-size: var(--font-base);
  }
}
</style>
