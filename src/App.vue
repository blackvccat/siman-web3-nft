<template>
  <div id="app">
    <!-- 
      应用头部组件
      功能: 包含Logo、折叠式导航菜单、主题切换、语言切换、钱包连接
      位置: 固定在页面顶部
    -->
    <AppHeader />
    
    <!-- 
      全局加载指示器
      功能: 在页面加载时显示加载动画
      触发: 当appStore.isLoading为true时显示
    -->
    <div v-if="appStore.isLoading" class="global-loader">
      <div class="loader-spinner"></div>
      <p>{{ appStore.t('common.loading') }}</p>
    </div>
    
    <!-- 
      主要内容区域
      功能: 根据路由显示不同的页面组件
      动画: 页面切换时有淡入淡出效果
    -->
    <router-view v-slot="{ Component, route }">
      <transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
    
    <!-- 
      返回顶部按钮
      功能: 点击后平滑滚动到页面顶部
      显示: 当页面滚动超过一定距离时显示
    -->
    <BackToTop />
  </div>
</template>

<script setup>
/**
 * 应用主组件
 * 功能: 应用的根组件，负责整体布局和状态管理
 * 包含: 头部导航、页面路由、加载状态、返回顶部按钮
 */

// Vue 3 Composition API 导入
import { onMounted } from 'vue'

// 状态管理
import { useAppStore } from '@/stores/app'

// 组件导入
import AppHeader from '@/components/layout/AppHeader.vue'  // 应用头部组件
import BackToTop from '@/components/common/BackToTop.vue'  // 返回顶部按钮

// 获取应用状态管理实例
const appStore = useAppStore()

// 组件挂载后初始化应用
onMounted(() => {
  // 初始化应用状态
  // 包括: 语言设置、主题设置、钱包连接状态等
  appStore.init()
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FD433E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
