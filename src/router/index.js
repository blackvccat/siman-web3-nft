/**
 * 应用路由配置
 * 功能: 定义所有页面路由，包括页面组件、元信息、路由守卫
 * 技术: 使用 Vue Router 4
 * 特性: 支持页面切换动画、SEO优化、错误处理
 */

import { createRouter, createWebHistory } from 'vue-router'

// 页面组件导入
import Home from '@/views/Home.vue'           // 首页
import About from '@/views/About.vue'         // 关于我们
import OurStory from '@/views/OurStory.vue'   // 我们的故事
import Shop from '@/views/Shop.vue'           // 商店
import LearnMore from '@/views/LearnMore.vue' // 了解更多
import Contact from '@/views/Contact.vue'      // 联系我们
import Error404 from '@/views/Error404.vue'   // 404错误页面

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      description: 'Siman Liquor - 传承千年酒文化，创新现代酿造技术'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于我们',
      description: '了解希漫酒业的历史、文化和理念'
    }
  },
  {
    path: '/our-story',
    name: 'OurStory',
    component: OurStory,
    meta: {
      title: '我们的故事',
      description: '探索希漫酒业的品牌故事和传承'
    }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop,
    meta: {
      title: '商店',
      description: '购买希漫酒业的NFT产品和酒类'
    }
  },
  {
    path: '/learn-more',
    name: 'LearnMore',
    component: LearnMore,
    meta: {
      title: '了解更多',
      description: '深入了解希漫酒业的产品和工艺'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: '联系我们',
      description: '联系希漫酒业，获取更多信息'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: Error404,
    meta: {
      title: '页面未找到',
      description: '抱歉，您访问的页面不存在'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),  // 使用HTML5 History模式
  routes,
  // 滚动行为配置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition  // 返回保存的位置
    } else {
      return { top: 0, behavior: 'smooth' }  // 平滑滚动到顶部
    }
  }
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Siman Liquor`
  }
  
  // 设置页面描述（SEO优化）
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }
  
  next()
})

export default router
