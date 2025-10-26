<template>
  <div class="cart-item">
    <!-- 商品图片 -->
    <div class="item-image">
      <img :src="item.product.image" :alt="item.product.name" />
      <div class="rarity-badge" :class="`rarity-${item.product.rarity}`">
        {{ getRarityText(item.product.rarity) }}
      </div>
    </div>
    
    <!-- 商品信息 -->
    <div class="item-info">
      <h4 class="item-name">{{ item.product.name }}</h4>
      <p class="item-description">{{ item.product.description }}</p>
      
      <!-- 价格信息 -->
      <div class="item-price">
        <span class="price-label">{{ appStore.t('cart.price') }}:</span>
        <span class="price-value">{{ item.price.toFixed(2) }} ETH</span>
      </div>
      
      <!-- 数量控制 -->
      <div class="quantity-controls">
        <button 
          class="quantity-btn quantity-decrease"
          @click="decreaseQuantity"
          :disabled="item.quantity <= 1"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 12H4"/>
          </svg>
        </button>
        
        <input 
          type="number" 
          :value="item.quantity"
          @change="handleQuantityChange"
          @blur="validateQuantity"
          class="quantity-input"
          min="1"
          max="99"
        />
        
        <button 
          class="quantity-btn quantity-increase"
          @click="increaseQuantity"
          :disabled="item.quantity >= 99"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14m7-7H5"/>
          </svg>
        </button>
      </div>
      
      <!-- 小计 -->
      <div class="item-subtotal">
        <span class="subtotal-label">{{ appStore.t('cart.subtotal') }}:</span>
        <span class="subtotal-value">{{ item.totalPrice.toFixed(2) }} ETH</span>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="item-actions">
      <button 
        class="remove-btn"
        @click="handleRemove"
        :title="appStore.t('cart.removeItem')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-quantity', 'remove-item'])

const appStore = useAppStore()

// 获取稀有度文本
const getRarityText = (rarity) => {
  return appStore.t(`shop.rarity.${rarity}`) || appStore.t('shop.rarity.common')
}

// 增加数量
const increaseQuantity = () => {
  if (props.item.quantity < 99) {
    emit('update-quantity', props.item.id, props.item.quantity + 1)
  }
}

// 减少数量
const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.id, props.item.quantity - 1)
  }
}

// 处理数量输入变化
const handleQuantityChange = (event) => {
  const newQuantity = parseInt(event.target.value)
  if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= 99) {
    emit('update-quantity', props.item.id, newQuantity)
  }
}

// 验证数量输入
const validateQuantity = (event) => {
  const value = parseInt(event.target.value)
  if (isNaN(value) || value < 1) {
    event.target.value = props.item.quantity
  } else if (value > 99) {
    event.target.value = 99
    emit('update-quantity', props.item.id, 99)
  }
}

// 处理移除商品
const handleRemove = () => {
  if (confirm(appStore.t('cart.confirmRemove'))) {
    emit('remove-item', props.item.id)
  }
}
</script>

<style scoped lang="scss">
.cart-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  transition: all var(--transition-normal);
  
  &:hover {
    border-color: var(--accent-color);
    box-shadow: var(--shadow-md);
  }
}

.item-image {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.rarity-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-sm);
  
  &.rarity-rare {
    background: linear-gradient(135deg, var(--neon-gold) 0%, var(--neon-orange) 100%);
    color: var(--bg-primary);
  }
  
  &.rarity-epic {
    background: linear-gradient(135deg, var(--neon-orange) 0%, var(--neon-crimson) 100%);
    color: var(--text-white);
  }
  
  &.rarity-legendary {
    background: linear-gradient(135deg, var(--neon-crimson) 0%, var(--neon-pink) 100%);
    color: var(--text-white);
  }
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.item-name {
  font-size: var(--font-base);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.item-description {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  
  .price-label {
    font-size: var(--font-sm);
    color: var(--text-light);
  }
  
  .price-value {
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--neon-gold);
  }
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

.quantity-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  
  &:hover:not(:disabled) {
    background: var(--bg-hover);
    border-color: var(--accent-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    width: 14px;
    height: 14px;
    color: var(--text-primary);
  }
}

.quantity-input {
  width: 50px;
  height: 28px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  text-align: center;
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(253, 67, 62, 0.2);
  }
}

.item-subtotal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-xs);
  padding-top: var(--spacing-xs);
  border-top: 1px solid var(--border-light);
  
  .subtotal-label {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .subtotal-value {
    font-size: var(--font-sm);
    font-weight: 700;
    color: var(--accent-color);
  }
}

.item-actions {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: var(--spacing-xs);
}

.remove-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  color: var(--text-secondary);
  
  &:hover {
    background: var(--neon-red);
    border-color: var(--neon-red);
    color: var(--text-white);
    transform: scale(1.05);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .item-image {
    width: 100%;
    height: 120px;
    align-self: center;
  }
  
  .item-info {
    text-align: center;
  }
  
  .quantity-controls {
    justify-content: center;
  }
  
  .item-subtotal {
    justify-content: center;
    gap: var(--spacing-sm);
  }
  
  .item-actions {
    flex-direction: row;
    justify-content: center;
    padding-top: var(--spacing-sm);
  }
}
</style>
