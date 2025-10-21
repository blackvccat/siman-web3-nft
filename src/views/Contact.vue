<template>
  <div class="contact-page">
    <!-- 导航栏 -->
    <AppHeader />
    
    <!-- 页面内容 -->
    <main class="page-content">
      <!-- Hero区域 -->
      <section class="hero-section">
        <!-- 中国红背景效果 -->
        <div class="hero-bg-effects">
          <div class="contact-pattern"></div>
          <div class="message-effects">
            <div class="message message-1"></div>
            <div class="message message-2"></div>
            <div class="message message-3"></div>
          </div>
          <div class="harmony-symbols">
            <div class="symbol symbol-1">☯</div>
            <div class="symbol symbol-2">☯</div>
          </div>
        </div>
        
        <div class="hero-content">
          <h1 class="page-title glow">{{ appStore.t('contact.title') }}</h1>
          <div class="harmony-banner">
            <div class="banner-content">🤝 和谐共进 🤝</div>
          </div>
        </div>
      </section>
      
      <!-- 主要内容 -->
      <section class="main-content">
        <div class="container">
          <!-- 联系信息 -->
          <div class="contact-info">
            <h2 class="contact-title">{{ appStore.t('contact.title') }}</h2>
            <p class="contact-subtitle">
              {{ appStore.t('contact.subtitle') }}
            </p>
          </div>
          
          <!-- 联系方式和表单 -->
          <div class="contact-content">
            <!-- 左侧联系信息 -->
            <div class="contact-details">
              <div class="contact-card">
                <h3 class="detail-title">{{ appStore.t('contact.address') }}</h3>
                <p class="detail-text" v-html="appStore.t('contact.addressText').replace('\n', '<br>')">
                </p>
              </div>
              
              <div class="contact-card">
                <h3 class="detail-title">{{ appStore.t('contact.contact') }}</h3>
                <p class="detail-text" v-html="appStore.t('contact.contactText').replace('\n', '<br>')">
                </p>
              </div>
              
              <div class="contact-card">
                <h3 class="detail-title">{{ appStore.t('contact.email') }}</h3>
                <p class="detail-text" v-html="appStore.t('contact.emailText').replace('\n', '<br>')">
                </p>
              </div>
            </div>
            
            <!-- 右侧联系表单 -->
            <div class="contact-form">
              <form @submit.prevent="submitForm" class="form">
                <div class="form-group">
                  <label for="name" class="form-label">{{ appStore.t('contact.form.name') }}</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name"
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="email" class="form-label">{{ appStore.t('contact.form.email') }}</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="form.email"
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="phone" class="form-label">{{ appStore.t('contact.form.phone') }}</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="form.phone"
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="message" class="form-label">{{ appStore.t('contact.form.message') }}</label>
                  <textarea 
                    id="message" 
                    v-model="form.message"
                    class="form-textarea"
                    rows="5"
                    :placeholder="appStore.t('contact.form.messagePlaceholder')"
                    required
                  ></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary submit-btn" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="loading"></span>
                  {{ isSubmitting ? appStore.t('common.sending') : appStore.t('contact.form.send') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 表单数据
const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const isSubmitting = ref(false)

// 提交表单
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 重置表单
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
    
    alert('Message sent successfully! We will contact you soon.')
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.contact-page {
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
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
          background-image: url('/images/contact-hero.jpg');
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

.contact-info {
  text-align: center;
  margin-bottom: var(--spacing-4xl);
}

.contact-title {
  font-size: var(--font-6xl);
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.contact-subtitle {
  font-size: var(--font-xl);
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4xl);
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.contact-card {
  background-color: var(--bg-primary);
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-custom);
  border: 2px solid var(--border-color);
}

.detail-title {
  font-size: var(--font-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.detail-text {
  font-size: var(--font-lg);
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

.contact-form {
  background-color: var(--bg-primary);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-custom);
  border: 2px solid var(--border-color);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: var(--font-lg);
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.form-input,
.form-textarea {
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: var(--font-base);
  font-family: var(--font-primary);
  background-color: var(--bg-primary);
  transition: all var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(253, 67, 62, 0.1);
  }
  
  &::placeholder {
    color: var(--text-light);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: var(--font-lg);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.loading {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

.contact-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 0, 0, 0.1) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255, 0, 0, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(255, 0, 0, 0.1) 0%, transparent 50%);
  background-size: 70px 70px, 70px 70px, 250px 250px, 250px 250px;
  animation: contactPatternMove 35s linear infinite;
}

.message-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.message {
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(255, 107, 157, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: messageFloat 10s ease-in-out infinite;
  
  &.message-1 {
    top: 25%;
    left: 20%;
    animation-delay: 0s;
  }
  
  &.message-2 {
    top: 60%;
    right: 25%;
    animation-delay: 3s;
  }
  
  &.message-3 {
    bottom: 25%;
    left: 50%;
    animation-delay: 6s;
  }
}

.harmony-symbols {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.symbol {
  position: absolute;
  font-size: 60px;
  color: var(--neon-gold);
  opacity: 0.3;
  animation: symbolRotate 15s linear infinite;
  
  &.symbol-1 {
    top: 15%;
    right: 15%;
    animation-delay: 0s;
  }
  
  &.symbol-2 {
    bottom: 15%;
    left: 15%;
    animation-delay: 7s;
  }
}

@keyframes contactPatternMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(70px, 70px); }
}

@keyframes messageFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-25px) scale(1.2); }
}

@keyframes symbolRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.harmony-banner {
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
    animation: harmonyGlow 2.5s ease-in-out infinite;
    
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
      animation: harmonyBorderGlow 4s ease-in-out infinite;
    }
  }
}

@keyframes harmonyGlow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes harmonyBorderGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.contact-title {
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--neon-red) 50%, var(--neon-gold) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
}

// 响应式设计
@media (max-width: 1024px) {
  .page-title {
    font-size: var(--font-5xl);
  }
  
  .contact-title {
    font-size: var(--font-5xl);
  }
  
  .contact-subtitle {
    font-size: var(--font-lg);
  }
  
  .detail-title {
    font-size: var(--font-xl);
  }
  
  .detail-text {
    font-size: var(--font-base);
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
  
  .contact-title {
    font-size: var(--font-4xl);
  }
  
  .contact-subtitle {
    font-size: var(--font-base);
  }
  
  .contact-card,
  .contact-form {
    padding: var(--spacing-lg);
  }
  
  .detail-title {
    font-size: var(--font-lg);
  }
  
  .detail-text {
    font-size: var(--font-sm);
  }
  
  .form-label {
    font-size: var(--font-base);
  }
  
  .form-input,
  .form-textarea {
    padding: var(--spacing-sm);
    font-size: var(--font-sm);
  }
  
  .submit-btn {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-base);
  }
}
</style>
