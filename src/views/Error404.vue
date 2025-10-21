<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">{{ appStore.t('error.notFound') }}</h2>
      <p class="error-description">{{ appStore.t('error.notFoundDesc') }}</p>
      <router-link to="/" class="btn btn-primary">
        {{ appStore.t('error.goHome') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;
}

.error-content {
  max-width: 600px;
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  margin: 0;
  opacity: 0.8;
}

.error-title {
  font-size: 2.5rem;
  margin: 1rem 0;
  font-weight: 700;
}

.error-description {
  font-size: 1.2rem;
  margin: 1rem 0 2rem;
  opacity: 0.9;
}

.btn {
  padding: 12px 24px;
  background-color: white;
  color: var(--primary-color);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
}
</style>
