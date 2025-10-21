<template>
  <div class="theme-toggle">
    <button 
      @click="toggleTheme" 
      class="theme-btn"
      :class="{ 'dark': appStore.isDarkMode }"
      :title="appStore.t('common.toggleTheme')"
    >
      <div class="theme-icon">
        <svg v-if="!appStore.isDarkMode" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
    </button>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const toggleTheme = () => {
  appStore.toggleTheme()
}
</script>

<style scoped lang="scss">
.theme-toggle {
  display: flex;
  align-items: center;
}

.theme-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }

  &.dark {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .theme-icon {
    transition: transform 0.3s ease;
  }

  &:hover .theme-icon {
    transform: rotate(180deg);
  }
}

/* 暗黑模式样式 */
[data-theme="dark"] {
  .theme-btn {
    background: var(--bg-secondary);
    color: var(--text-primary);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
