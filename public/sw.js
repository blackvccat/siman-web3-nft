const CACHE_NAME = 'siman-liquor-v1'
const urlsToCache = [
  '/',
  '/about',
  '/our-story',
  '/shop',
  '/learn-more',
  '/contact',
  '/images/logo.png',
  '/images/hero-wine.jpg',
  '/images/about-hero.jpg',
  '/images/story-background.jpg',
  '/images/shop-hero.jpg',
  '/images/learn-more-hero.jpg',
  '/images/contact-hero.jpg'
]

// 安装Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// 激活Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// 拦截网络请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，返回缓存版本
        if (response) {
          return response
        }
        
        // 否则从网络获取
        return fetch(event.request).then(response => {
          // 检查是否是有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          
          // 克隆响应
          const responseToCache = response.clone()
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache)
            })
          
          return response
        })
      })
  )
})

// 推送通知
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '希漫酒业有新消息！',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/images/logo.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/images/logo.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('希漫酒业', options)
  )
})

// 通知点击事件
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
