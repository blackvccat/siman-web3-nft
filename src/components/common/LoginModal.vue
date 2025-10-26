<template>
  <div class="login-modal" v-if="showLogin" @click.self="closeLogin">
    <div class="login-content">
      <h3>用户登录</h3>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>邮箱:</label>
          <input v-model="loginForm.email" type="email" required placeholder="请输入邮箱">
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input v-model="loginForm.password" type="password" required placeholder="请输入密码">
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">登录</button>
          <button type="button" class="btn btn-secondary" @click="closeLogin">取消</button>
        </div>
      </form>
      <div class="test-account">
        <p><strong>测试账户:</strong></p>
        <p>邮箱: admin@siman.com</p>
        <p>密码: admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { authAPI } from '@/services/api'

const emit = defineEmits(['close', 'login-success'])

const showLogin = ref(true)
const loginForm = reactive({
  email: 'admin@siman.com',
  password: 'admin123'
})

const handleLogin = async () => {
  try {
    const response = await authAPI.login(loginForm.email, loginForm.password)
    
    if (response.success) {
      localStorage.setItem('siman-token', response.data.token)
      emit('login-success', response.data.user)
      closeLogin()
      alert('登录成功！')
    } else {
      alert('登录失败: ' + response.error.message)
    }
  } catch (error) {
    console.error('登录错误:', error)
    alert('登录失败: ' + error.message)
  }
}

const closeLogin = () => {
  showLogin.value = false
  emit('close')
}
</script>

<style scoped>
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.login-content h3 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.test-account {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
}

.test-account p {
  margin: 0.25rem 0;
}
</style>
