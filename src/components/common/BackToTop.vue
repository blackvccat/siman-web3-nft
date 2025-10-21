<template>
  <transition name="fade">
    <button 
      v-show="showButton" 
      @click="scrollToTop"
      class="back-to-top"
      :title="appStore.t('common.backToTop')"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const showButton = ref(false)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  showButton.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(253, 67, 62, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(253, 67, 62, 0.4);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
}
</style>
