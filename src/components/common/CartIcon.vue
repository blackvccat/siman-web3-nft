<template>
  <div class="cart-icon" @click="cartStore.openDrawer">
    <div class="cart-icon-wrapper">
      <svg class="cart-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"/>
      </svg>
      
      <!-- 商品数量徽章 -->
      <div v-if="cartStore.itemCount > 0" class="cart-badge">
        {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
      </div>
      
      <!-- 加载指示器 -->
      <div v-if="cartStore.isLoading" class="cart-loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
    
    <!-- 工具提示 -->
    <div class="cart-tooltip">
      {{ appStore.t('cart.viewCart') }}
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useAppStore } from '@/stores/app'

const cartStore = useCartStore()
const appStore = useAppStore()
</script>

<style scoped lang="scss">
.cart-icon {
  position: relative;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--bg-hover);
    transform: scale(1.05);
    
    .cart-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(-5px);
    }
  }
}

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-svg {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
  transition: color var(--transition-normal);
}

.cart-icon:hover .cart-svg {
  color: var(--accent-color);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, var(--neon-red) 0%, var(--neon-crimson) 100%);
  color: var(--text-white);
  font-size: var(--font-xs);
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: var(--shadow-neon-red);
  border: 2px solid var(--bg-primary);
  animation: badgePulse 2s ease-in-out infinite;
}

.cart-loading {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
}

.loading-spinner {
  width: 100%;
  height: 100%;
  border: 2px solid var(--bg-tertiary);
  border-top: 2px solid var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.cart-tooltip {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%) translateY(0);
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-xs);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  z-index: 1000;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid var(--bg-primary);
  }
}

@keyframes badgePulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: var(--shadow-neon-red);
  }
  50% { 
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(220, 38, 38, 0.6);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 响应式设计
@media (max-width: 768px) {
  .cart-icon {
    padding: var(--spacing-xs);
  }
  
  .cart-svg {
    width: 20px;
    height: 20px;
  }
  
  .cart-badge {
    font-size: 10px;
    min-width: 16px;
    height: 16px;
    top: -6px;
    right: -6px;
  }
  
  .cart-tooltip {
    display: none; // 移动端隐藏工具提示
  }
}
</style>
