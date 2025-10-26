// 测试用户认证API
const API_BASE_URL = 'http://localhost:3004/api/v1';

async function testUserAuth() {
    console.log('=== 测试用户认证API ===');
    
    try {
        // 1. 登录获取token
        console.log('1. 测试登录...');
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@siman.com',
                password: 'admin123'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('登录响应状态:', loginResponse.status);
        console.log('登录响应数据:', JSON.stringify(loginData, null, 2));
        
        if (!loginResponse.ok || !loginData.success) {
            console.log('❌ 登录失败');
            return;
        }
        
        const token = loginData.data.token;
        console.log('✅ 登录成功，Token:', token.substring(0, 20) + '...');
        
        // 2. 测试获取用户信息
        console.log('\n2. 测试获取用户信息...');
        const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('用户信息响应状态:', profileResponse.status);
        const profileData = await profileResponse.json();
        console.log('用户信息响应数据:', JSON.stringify(profileData, null, 2));
        
        if (profileResponse.ok && profileData.success) {
            console.log('✅ 获取用户信息成功');
            console.log('用户邮箱:', profileData.data.email);
            console.log('用户角色:', profileData.data.role);
        } else {
            console.log('❌ 获取用户信息失败');
        }
        
    } catch (error) {
        console.log('❌ 测试异常:', error.message);
    }
}

testUserAuth();
