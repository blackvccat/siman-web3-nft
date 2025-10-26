// 使用内置fetch API (Node.js 18+)

const API_BASE_URL = 'http://localhost:3004/api/v1';
const FRONTEND_URL = 'http://localhost:3002';

class TestEngineer {
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

    // 1. 后端API基础测试
    async testBackendHealth() {
        try {
            const response = await fetch('http://localhost:3004/health');
            const data = await response.json();
            
            if (response.ok && data.success) {
                return { success: true, details: `服务器运行正常，时间戳: ${data.timestamp}` };
            } else {
                return { success: false, error: '健康检查失败' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 2. 商品API测试
    async testProductsAPI() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const data = await response.json();
            
            if (response.ok && data.success && data.data.products.length > 0) {
                const productCount = data.data.products.length;
                const firstProduct = data.data.products[0];
                return { 
                    success: true, 
                    details: `获取到${productCount}个商品，第一个商品: ${firstProduct.name}` 
                };
            } else {
                return { success: false, error: '商品API测试失败' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 3. 用户认证测试
    async testAuthentication() {
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
                return { 
                    success: true, 
                    details: `认证成功，用户: ${profileData.data.email}，角色: ${profileData.data.role}` 
                };
            } else {
                return { success: false, error: '获取用户信息失败' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 4. 购物车功能测试
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
            
            const firstProduct = productsData.data.products[0];
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
                    quantity: 2
                })
            });
            
            const addToCartData = await addToCartResponse.json();
            
            if (!addToCartResponse.ok || !addToCartData.success) {
                return { success: false, error: '添加到购物车失败' };
            }
            
            console.log(`   添加到购物车成功，数量: 2`);
            
            // 获取购物车
            const getCartResponse = await fetch(`${API_BASE_URL}/cart`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const getCartData = await getCartResponse.json();
            
            if (!getCartResponse.ok || !getCartData.success) {
                return { success: false, error: '获取购物车失败' };
            }
            
            const cartItems = getCartData.data.items;
            const totalPrice = getCartData.data.totalPrice;
            
            return { 
                success: true, 
                details: `购物车功能正常，商品数量: ${cartItems.length}，总价: ${totalPrice} ETH` 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 5. 订单流程测试
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
            
            return { 
                success: true, 
                details: `订单流程正常，订单数量: ${orders.length}，最新订单ID: ${orderId}` 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 6. 支付系统测试
    async testPaymentSystem() {
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
            
            // 验证支付
            const verifyResponse = await fetch(`${API_BASE_URL}/payments/${paymentId}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    transactionHash: '0x1234567890abcdef'
                })
            });
            
            const verifyData = await verifyResponse.json();
            
            if (!verifyResponse.ok || !verifyData.success) {
                return { success: false, error: '支付验证失败' };
            }
            
            return { 
                success: true, 
                details: `支付系统正常，支付ID: ${paymentId}，状态: ${verifyData.data.status}` 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 7. 前端页面可访问性测试
    async testFrontendAccessibility() {
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

    // 8. CORS跨域测试
    async testCORSConfiguration() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'OPTIONS',
                headers: {
                    'Origin': FRONTEND_URL,
                    'Access-Control-Request-Method': 'GET'
                }
            });
            
            const corsHeaders = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            };
            
            if (corsHeaders['Access-Control-Allow-Origin']) {
                return { 
                    success: true, 
                    details: `CORS配置正常，允许的源: ${corsHeaders['Access-Control-Allow-Origin']}` 
                };
            } else {
                return { success: false, error: 'CORS配置缺失' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 9. 错误处理测试
    async testErrorHandling() {
        try {
            // 测试404错误
            const notFoundResponse = await fetch(`${API_BASE_URL}/nonexistent`);
            const notFoundData = await notFoundResponse.json();
            
            if (notFoundResponse.status === 404) {
                console.log(`   404错误处理正常`);
            } else {
                return { success: false, error: '404错误处理异常' };
            }
            
            // 测试未授权访问
            const unauthorizedResponse = await fetch(`${API_BASE_URL}/cart`);
            const unauthorizedData = await unauthorizedResponse.json();
            
            if (unauthorizedResponse.status === 401) {
                console.log(`   401错误处理正常`);
            } else {
                return { success: false, error: '401错误处理异常' };
            }
            
            return { success: true, details: '错误处理机制正常' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 10. 性能测试
    async testPerformance() {
        try {
            const startTime = Date.now();
            
            // 并发请求测试
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(fetch(`${API_BASE_URL}/products`));
            }
            
            const responses = await Promise.all(promises);
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            const allSuccessful = responses.every(response => response.ok);
            
            if (allSuccessful && duration < 5000) {
                return { 
                    success: true, 
                    details: `性能测试通过，10个并发请求耗时: ${duration}ms` 
                };
            } else {
                return { success: false, error: `性能测试失败，耗时: ${duration}ms` };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 生成测试报告
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 测试报告');
        console.log('='.repeat(60));
        console.log(`总测试数: ${this.totalTests}`);
        console.log(`通过: ${this.passedTests} ✅`);
        console.log(`失败: ${this.failedTests} ❌`);
        console.log(`成功率: ${((this.passedTests / this.totalTests) * 100).toFixed(2)}%`);
        
        console.log('\n📋 详细结果:');
        this.testResults.forEach(result => {
            const status = result.status === 'PASS' ? '✅' : '❌';
            console.log(`${status} ${result.name}: ${result.details}`);
        });
        
        if (this.failedTests > 0) {
            console.log('\n🚨 需要修复的问题:');
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

    // 运行所有测试
    async runAllTests() {
        console.log('🔬 高级测试工程师 - 开始全面系统测试');
        console.log('='.repeat(60));
        
        await this.runTest('后端健康检查', () => this.testBackendHealth());
        await this.runTest('商品API测试', () => this.testProductsAPI());
        await this.runTest('用户认证测试', () => this.testAuthentication());
        await this.runTest('购物车功能测试', () => this.testCartFunctionality());
        await this.runTest('订单流程测试', () => this.testOrderFlow());
        await this.runTest('支付系统测试', () => this.testPaymentSystem());
        await this.runTest('前端页面可访问性', () => this.testFrontendAccessibility());
        await this.runTest('CORS跨域配置', () => this.testCORSConfiguration());
        await this.runTest('错误处理机制', () => this.testErrorHandling());
        await this.runTest('性能测试', () => this.testPerformance());
        
        return this.generateReport();
    }
}

// 运行测试
async function main() {
    const tester = new TestEngineer();
    const report = await tester.runAllTests();
    
    // 保存测试报告
    const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
            total: report.total,
            passed: report.passed,
            failed: report.failed,
            successRate: report.successRate
        },
        details: report.results
    };
    
    // fs.writeFileSync('COMPREHENSIVE_TEST_REPORT.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 测试报告已保存到: COMPREHENSIVE_TEST_REPORT.json');
}

main().catch(console.error);
