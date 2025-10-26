<template>
  <!-- 购物车抽屉遮罩 -->
  <div 
    v-if="cartStore.isDrawerOpen" 
    class="cart-drawer-overlay"
    @click="cartStore.closeDrawer"
  ></div>
  
  <!-- 购物车抽屉 -->
  <div 
    class="cart-drawer"
    :class="{ 'cart-drawer-open': cartStore.isDrawerOpen }"
  >
    <!-- 抽屉头部 -->
    <div class="cart-drawer-header">
      <h3 class="cart-drawer-title">
        {{ appStore.t('cart.title') }}
        <span v-if="cartStore.itemCount > 0" class="cart-count">
          ({{ cartStore.itemCount }})
        </span>
      </h3>
      <button class="cart-close-btn" @click="cartStore.closeDrawer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <!-- 抽屉内容 -->
    <div class="cart-drawer-content">
      <!-- 空购物车状态 -->
      <div v-if="cartStore.isEmpty" class="cart-empty">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"/>
          </svg>
        </div>
        <h4 class="empty-title">{{ appStore.t('cart.empty') }}</h4>
        <p class="empty-description">{{ appStore.t('cart.emptyDescription') }}</p>
        <router-link to="/shop" class="btn btn-primary" @click="cartStore.closeDrawer">
          {{ appStore.t('cart.startShopping') }}
        </router-link>
      </div>
      
      <!-- 购物车商品列表 -->
      <div v-else class="cart-items">
        <CartItem 
          v-for="item in cartStore.items" 
          :key="item.id"
          :item="item"
          @update-quantity="handleUpdateQuantity"
          @remove-item="handleRemoveItem"
        />
      </div>
    </div>
    
    <!-- 抽屉底部 -->
    <div v-if="!cartStore.isEmpty" class="cart-drawer-footer">
      <!-- 订单摘要 -->
      <div class="cart-summary">
        <div class="summary-row">
          <span class="summary-label">{{ appStore.t('cart.subtotal') }}:</span>
          <span class="summary-value">{{ cartStore.totalPrice.toFixed(2) }} ETH</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">{{ appStore.t('cart.total') }}:</span>
          <span class="summary-total">{{ cartStore.totalPrice.toFixed(2) }} ETH</span>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="cart-actions">
        <button class="btn btn-outline" @click="cartStore.clearCart">
          {{ appStore.t('cart.clearCart') }}
        </button>
        <button class="btn btn-primary btn-checkout" @click="handleCheckout">
          {{ appStore.t('cart.checkout') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useAppStore } from '@/stores/app'
import CartItem from './CartItem.vue'

const cartStore = useCartStore()
const appStore = useAppStore()

// 处理数量更新
const handleUpdateQuantity = async (cartItemId, quantity) => {
  try {
    await cartStore.updateQuantity(cartItemId, quantity)
  } catch (error) {
    console.error('更新数量失败:', error)
    alert(`更新失败: ${error.message}`)
  }
}

// 处理商品移除
const handleRemoveItem = async (cartItemId) => {
  if (confirm(appStore.t('cart.confirmRemove'))) {
    try {
      await cartStore.removeItem(cartItemId)
    } catch (error) {
      console.error('移除商品失败:', error)
      alert(`移除失败: ${error.message}`)
    }
  }
}

// 处理结算
const handleCheckout = async () => {
  // 关闭抽屉
  cartStore.closeDrawer()
  
  // 这里应该跳转到结算页面或打开结算弹窗
  console.log('开始结算流程')
  
  // 模拟结算流程
  if (confirm(appStore.t('cart.confirmCheckout'))) {
    try {
      // 实际项目中这里应该调用结算API
      alert(appStore.t('cart.checkoutSuccess'))
      await cartStore.clearCart()
    } catch (error) {
      console.error('结算失败:', error)
      alert(`结算失败: ${error.message}`)
    }
  }
}
</script>

<style scoped lang="scss">
.cart-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s ease;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  max-width: 450px;
  height: 100vh;
  background: var(--bg-primary);
  box-shadow: var(--shadow-xl);
  z-index: 999;
  transition: right var(--transition-normal);
  display: flex;
  flex-direction: column;
  
  &.cart-drawer-open {
    right: 0;
  }
}

.cart-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.cart-drawer-title {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  
  .cart-count {
    color: var(--accent-color);
    font-weight: 600;
  }
}

.cart-close-btn {
  background: none;
  border: none;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
}

.cart-drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: var(--spacing-2xl);
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: var(--spacing-lg);
  color: var(--text-light);
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.empty-title {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.cart-drawer-footer {
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
}

.cart-summary {
  margin-bottom: var(--spacing-lg);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.summary-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-value {
  color: var(--text-primary);
  font-weight: 600;
}

.summary-total {
  color: var(--accent-color);
  font-weight: 700;
  font-size: var(--font-lg);
}

.cart-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-checkout {
  flex: 1;
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
  color: var(--text-white);
  font-weight: 600;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// 响应式设计
@media (max-width: 768px) {
  .cart-drawer {
    width: 100%;
    max-width: 100%;
  }
  
  .cart-drawer-header {
    padding: var(--spacing-md);
  }
  
  .cart-drawer-content {
    padding: var(--spacing-md);
  }
  
  .cart-drawer-footer {
    padding: var(--spacing-md);
  }
  
  .cart-actions {
    flex-direction: column;
  }
  
  .btn-checkout {
    order: -1; // 结算按钮在上方
  }
}
</style>
