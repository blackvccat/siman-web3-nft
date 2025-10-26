// 全面功能测试脚本
const API_BASE_URL = 'http://localhost:3004/api/v1';
const FRONTEND_URL = 'http://localhost:3000';

class ComprehensiveTester {
    constructor() {
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    async runTest(testName, testFunction) {
        this.totalTests++;
        console.log(`\n🧪 测试: ${testName}`);
        console.log('='.repeat(50));
        
        try {
            const result = await testFunction();
            if (result.success) {
                this.passedTests++;
                console.log(`✅ ${testName} - 通过`);
                this.testResults.push({
                    name: testName,
                    status: 'PASS',
                    details: result.details || '测试通过'
                });
            } else {
                this.failedTests++;
                console.log(`❌ ${testName} - 失败`);
                console.log(`   错误: ${result.error}`);
                this.testResults.push({
                    name: testName,
                    status: 'FAIL',
                    details: result.error
                });
            }
        } catch (error) {
            this.failedTests++;
            console.log(`❌ ${testName} - 异常`);
            console.log(`   异常: ${error.message}`);
            this.testResults.push({
                name: testName,
                status: 'ERROR',
                details: error.message
            });
        }
    }

    // 1. 前端页面访问测试
    async testFrontendAccess() {
        try {
            const response = await fetch(FRONTEND_URL);
            
            if (response.ok) {
                const html = await response.text();
                const hasTitle = html.includes('<title>');
                const hasVueApp = html.includes('vite') || html.includes('vue');
                
                if (hasTitle && hasVueApp) {
                    return { success: true, details: '前端页面可正常访问，Vue应用加载正常' };
                } else {
                    return { success: false, error: '前端页面结构异常' };
                }
            } else {
                return { success: false, error: `前端页面访问失败，状态码: ${response.status}` };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 2. 后端健康检查
    async testBackendHealth() {
        try {
            const response = await fetch('http://localhost:3004/health');
            const data = await response.json();
            
            if (response.ok && data.success && data.data && data.data.status === 'healthy') {
                return { success: true, details: `后端服务健康，状态: ${data.data.status}` };
            } else {
                return { success: false, error: '后端健康检查失败' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 3. 商品API测试
    async testProductsAPI() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const data = await response.json();
            
            if (response.ok && data.success && data.data && data.data.items) {
                const productCount = data.data.items.length;
                return { success: true, details: `商品API正常，获取到${productCount}个商品` };
            } else {
                return { success: false, error: '商品API测试失败' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 4. 用户认证测试
    async testUserAuthentication() {
        try {
            // 测试登录
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@siman.com',
                    password: 'admin123'
                })
            });
            
            const loginData = await loginResponse.json();
            
            if (!loginResponse.ok || !loginData.success) {
                return { success: false, error: '登录失败' };
            }
            
            const token = loginData.data.token;
            console.log(`   登录成功，Token: ${token.substring(0, 20)}...`);
            
            // 测试获取用户信息
            const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const profileData = await profileResponse.json();
            
            if (profileResponse.ok && profileData.success) {
                return { success: true, details: `用户认证正常，用户: ${profileData.data.email || 'admin@siman.com'}` };
            } else {
                return { success: false, error: '获取用户信息失败' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 5. 购物车功能测试
    async testCartFunctionality() {
        try {
            // 先登录获取token
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@siman.com',
                    password: 'admin123'
                })
            });
            
            const loginData = await loginResponse.json();
            if (!loginResponse.ok || !loginData.success) {
                return { success: false, error: '登录失败，无法测试购物车' };
            }
            
            const token = loginData.data.token;
            
            // 获取商品列表
            const productsResponse = await fetch(`${API_BASE_URL}/products`);
            const productsData = await productsResponse.json();
            
            if (!productsResponse.ok || !productsData.success) {
                return { success: false, error: '获取商品失败' };
            }
            
            const firstProduct = productsData.data.items[0];
            console.log(`   测试商品: ${firstProduct.name}`);
            
            // 添加到购物车
            const addToCartResponse = await fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: firstProduct.id,
                    quantity: 1
                })
            });
            
            const addToCartData = await addToCartResponse.json();
            
            if (!addToCartResponse.ok || !addToCartData.success) {
                return { success: false, error: '添加到购物车失败' };
            }
            
            console.log(`   添加到购物车成功`);
            
            // 获取购物车
            const getCartResponse = await fetch(`${API_BASE_URL}/cart`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const getCartData = await getCartResponse.json();
            
            if (!getCartResponse.ok || !getCartData.success) {
                return { success: false, error: '获取购物车失败' };
            }
            
            const cartItems = getCartData.data.items;
            
            return { success: true, details: `购物车功能正常，商品数量: ${cartItems.length}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 6. 订单流程测试
    async testOrderFlow() {
        try {
            // 先登录获取token
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@siman.com',
                    password: 'admin123'
                })
            });
            
            const loginData = await loginResponse.json();
            if (!loginResponse.ok || !loginData.success) {
                return { success: false, error: '登录失败，无法测试订单' };
            }
            
            const token = loginData.data.token;
            
            // 创建订单
            const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: [{
                        productId: 'product-1',
                        quantity: 1,
                        price: 0.1
                    }],
                    shippingAddress: {
                        name: '测试用户',
                        address: '测试地址',
                        city: '测试城市',
                        postalCode: '123456'
                    },
                    paymentMethod: 'ETH',
                    totalAmount: 0.1
                })
            });
            
            const orderData = await orderResponse.json();
            
            if (!orderResponse.ok || !orderData.success) {
                return { success: false, error: '创建订单失败' };
            }
            
            const orderId = orderData.data.orderId;
            console.log(`   订单创建成功，ID: ${orderId}`);
            
            // 获取订单列表
            const ordersResponse = await fetch(`${API_BASE_URL}/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const ordersData = await ordersResponse.json();
            
            if (!ordersResponse.ok || !ordersData.success) {
                return { success: false, error: '获取订单列表失败' };
            }
            
            const orders = ordersData.data.orders;
            
            return { success: true, details: `订单流程正常，订单数量: ${orders.length}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 7. 支付功能测试
    async testPaymentFunctionality() {
        try {
            // 先登录获取token
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@siman.com',
                    password: 'admin123'
                })
            });
            
            const loginData = await loginResponse.json();
            if (!loginResponse.ok || !loginData.success) {
                return { success: false, error: '登录失败，无法测试支付' };
            }
            
            const token = loginData.data.token;
            
            // 创建支付订单
            const paymentResponse = await fetch(`${API_BASE_URL}/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: 'order-123',
                    amount: 0.1,
                    currency: 'ETH'
                })
            });
            
            const paymentData = await paymentResponse.json();
            
            if (!paymentResponse.ok || !paymentData.success) {
                return { success: false, error: '创建支付订单失败' };
            }
            
            const paymentId = paymentData.data.paymentId;
            console.log(`   支付订单创建成功，ID: ${paymentId}`);
            
            return { success: true, details: `支付功能正常，支付ID: ${paymentId}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 8. 管理后台测试
    async testAdminPanel() {
        try {
            // 先登录获取token
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@siman.com',
                    password: 'admin123'
                })
            });
            
            const loginData = await loginResponse.json();
            if (!loginResponse.ok || !loginData.success) {
                return { success: false, error: '管理员登录失败' };
            }
            
            const token = loginData.data.token;
            
            // 测试管理员权限
            const adminResponse = await fetch(`${API_BASE_URL}/admin/products`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (adminResponse.ok) {
                return { success: true, details: '管理后台访问正常，管理员权限验证通过' };
            } else {
                return { success: false, error: '管理后台访问失败' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 9. API响应格式测试
    async testAPIResponseFormat() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const data = await response.json();
            
            // 检查标准响应格式
            const hasRequiredFields = data.success !== undefined && 
                                    data.data !== undefined && 
                                    data.timestamp !== undefined && 
                                    data.version !== undefined;
            
            if (hasRequiredFields) {
                return { success: true, details: 'API响应格式标准化，包含所有必需字段' };
            } else {
                return { success: false, error: 'API响应格式缺少必需字段' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 10. 错误处理测试
    async testErrorHandling() {
        try {
            // 测试404错误
            const notFoundResponse = await fetch(`${API_BASE_URL}/nonexistent`);
            const notFoundData = await notFoundResponse.json();
            
            if (notFoundResponse.status === 404 && notFoundData.success === false) {
                console.log(`   404错误处理正常`);
            } else {
                return { success: false, error: '404错误处理异常' };
            }
            
            // 测试未授权访问
            const unauthorizedResponse = await fetch(`${API_BASE_URL}/cart`);
            const unauthorizedData = await unauthorizedResponse.json();
            
            if (unauthorizedResponse.status === 401 && unauthorizedData.success === false) {
                console.log(`   401错误处理正常`);
            } else {
                return { success: false, error: '401错误处理异常' };
            }
            
            return { success: true, details: '错误处理机制正常' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 运行所有测试
    async runAllTests() {
        console.log('🔬 全面功能测试 - Siman Web3 NFT酒类电商平台');
        console.log('='.repeat(80));
        
        await this.runTest('前端页面访问', () => this.testFrontendAccess());
        await this.runTest('后端健康检查', () => this.testBackendHealth());
        await this.runTest('商品API功能', () => this.testProductsAPI());
        await this.runTest('用户认证功能', () => this.testUserAuthentication());
        await this.runTest('购物车功能', () => this.testCartFunctionality());
        await this.runTest('订单流程', () => this.testOrderFlow());
        await this.runTest('支付功能', () => this.testPaymentFunctionality());
        await this.runTest('管理后台', () => this.testAdminPanel());
        await this.runTest('API响应格式', () => this.testAPIResponseFormat());
        await this.runTest('错误处理机制', () => this.testErrorHandling());
        
        return this.generateReport();
    }

    // 生成测试报告
    generateReport() {
        console.log('\n' + '='.repeat(80));
        console.log('📊 全面功能测试报告');
        console.log('='.repeat(80));
        console.log(`总测试数: ${this.totalTests}`);
        console.log(`通过: ${this.passedTests} ✅`);
        console.log(`失败: ${this.failedTests} ❌`);
        console.log(`成功率: ${((this.passedTests / this.totalTests) * 100).toFixed(2)}%`);
        
        console.log('\n📋 详细结果:');
        this.testResults.forEach(result => {
            const status = result.status === 'PASS' ? '✅' : '❌';
            console.log(`${status} ${result.name}: ${result.details}`);
        });
        
        if (this.failedTests === 0) {
            console.log('\n🎉 所有功能测试通过！系统完全正常！');
        } else {
            console.log('\n⚠️ 发现需要修复的问题:');
            this.testResults
                .filter(result => result.status !== 'PASS')
                .forEach(result => {
                    console.log(`- ${result.name}: ${result.details}`);
                });
        }
        
        return {
            total: this.totalTests,
            passed: this.passedTests,
            failed: this.failedTests,
            successRate: (this.passedTests / this.totalTests) * 100,
            results: this.testResults
        };
    }
}

// 运行测试
async function main() {
    const tester = new ComprehensiveTester();
    const report = await tester.runAllTests();
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 测试总结');
    console.log('='.repeat(80));
    
    if (report.failed === 0) {
        console.log('🏆 系统质量评估: 优秀');
        console.log('🚀 所有功能正常运行，可以投入生产使用！');
        console.log('\n📱 访问地址:');
        console.log(`前端: http://localhost:3000`);
        console.log(`后端API: http://localhost:3004/api/v1`);
        console.log(`管理后台: http://localhost:3000/admin-panel.html`);
    } else {
        console.log('⚠️ 系统需要进一步优化');
        console.log(`成功率: ${report.successRate.toFixed(2)}%`);
    }
}

main().catch(console.error);
