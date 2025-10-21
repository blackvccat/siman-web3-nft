<template>
  <footer class="app-footer">
    <div class="footer-container">
      <!-- 主要内容区域 -->
      <div class="footer-content">
        <!-- 左侧信息 -->
        <div class="footer-info">
          <div class="contact-info">
            <p class="contact-text" v-html="appStore.t('footer.contact').replace('\n', '<br>')">
            </p>
          </div>
        </div>
        
        <!-- 中间导航 -->
        <div class="footer-nav">
          <div class="nav-section">
            <h4 class="nav-title">{{ appStore.t('footer.aboutWeb3') }}</h4>
          </div>
          <div class="nav-section">
            <h4 class="nav-title">{{ appStore.t('footer.contactUs') }}</h4>
          </div>
          <div class="nav-section">
            <h4 class="nav-title">{{ appStore.t('footer.qa') }}</h4>
          </div>
          <div class="nav-section">
            <h4 class="nav-title">{{ appStore.t('footer.announcement') }}</h4>
          </div>
        </div>
        
        <!-- 右侧社交媒体 -->
        <div class="footer-social">
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Twitter">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="TikTok">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>{{ appStore.t('footer.copyright') }}</p>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">{{ appStore.t('footer.privacy') }}</a>
          <a href="#" class="footer-link">{{ appStore.t('footer.terms') }}</a>
          <a href="#" class="footer-link">{{ appStore.t('footer.cookies') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.app-footer {
  background-color: var(--bg-dark);
  color: var(--text-white);
  padding: var(--spacing-4xl) 0 var(--spacing-lg);
  margin-top: auto;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--spacing-4xl);
  margin-bottom: var(--spacing-2xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
    text-align: center;
  }
}

.footer-info {
  .contact-text {
    font-size: var(--font-base);
    line-height: 1.6;
    opacity: 0.9;
  }
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }
}

.nav-section {
  .nav-title {
    font-size: var(--font-lg);
    font-weight: 700;
    margin-bottom: var(--spacing-md);
    color: var(--text-white);
  }
}

.footer-social {
  display: flex;
  justify-content: flex-end;
  
  @media (max-width: 1024px) {
    justify-content: center;
  }
}

.social-links {
  display: flex;
  gap: var(--spacing-lg);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: var(--text-white);
  transition: all var(--transition-normal);
  
  &:hover {
    background-color: var(--primary-color);
    transform: translateY(-2px);
  }
}

.social-icon {
  width: 20px;
  height: 20px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
}

.copyright {
  p {
    font-size: var(--font-sm);
    opacity: 0.8;
    margin: 0;
  }
}

.footer-links {
  display: flex;
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
}

.footer-link {
  font-size: var(--font-sm);
  color: var(--text-white);
  opacity: 0.8;
  transition: opacity var(--transition-fast);
  
  &:hover {
    opacity: 1;
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .footer-container {
    padding: 0 var(--spacing-md);
  }
  
  .footer-content {
    gap: var(--spacing-xl);
  }
}

@media (max-width: 768px) {
  .app-footer {
    padding: var(--spacing-2xl) 0 var(--spacing-lg);
  }
  
  .footer-content {
    gap: var(--spacing-lg);
  }
  
  .social-links {
    gap: var(--spacing-md);
  }
  
  .social-link {
    width: 36px;
    height: 36px;
  }
  
  .social-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
