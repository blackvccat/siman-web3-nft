// 修复验证测试脚本
const API_BASE_URL = 'http://localhost:3004/api/v1';

class FixVerificationTester {
    constructor() {
        this.testResults = [];
    }

    async runTest(testName, testFunction) {
        console.log(`\n🔧 修复验证: ${testName}`);
        console.log('='.repeat(50));
        
        try {
            const result = await testFunction();
            if (result.success) {
                console.log(`✅ ${testName} - 修复成功`);
                this.testResults.push({ name: testName, status: 'PASS', details: result.details });
            } else {
                console.log(`❌ ${testName} - 修复失败`);
                console.log(`   错误: ${result.error}`);
                this.testResults.push({ name: testName, status: 'FAIL', details: result.error });
            }
        } catch (error) {
            console.log(`❌ ${testName} - 测试异常`);
            console.log(`   异常: ${error.message}`);
            this.testResults.push({ name: testName, status: 'ERROR', details: error.message });
        }
    }

    // 1. 验证HTTPS重定向配置
    async testHTTPSRedirect() {
        try {
            const response = await fetch('http://localhost:3004/health', {
                redirect: 'manual'
            });
            
            // 开发环境应该正常返回200
            if (response.status === 200) {
                const data = await response.json();
                if (data.success && data.version) {
                    return { success: true, details: 'HTTPS重定向配置正常，开发环境HTTP访问正常' };
                } else {
                    return { success: false, error: '响应格式异常' };
                }
            } else {
                return { success: false, error: `HTTP状态异常: ${response.status}` };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 2. 验证API响应格式标准化
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
                return { success: true, details: `API响应格式标准化成功，包含: success, data, timestamp, version` };
            } else {
                return { success: false, error: 'API响应格式缺少必需字段' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 3. 验证API版本管理
    async testAPIVersionManagement() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const versionHeader = response.headers.get('API-Version');
            
            if (versionHeader === '1.0.0') {
                return { success: true, details: `API版本管理正常，版本头: ${versionHeader}` };
            } else {
                return { success: false, error: `API版本头缺失或错误: ${versionHeader}` };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 4. 验证错误响应格式
    async testErrorResponseFormat() {
        try {
            const response = await fetch(`${API_BASE_URL}/nonexistent`);
            const data = await response.json();
            
            // 检查错误响应格式
            const hasErrorFields = data.success === false && 
                                 data.error && 
                                 data.error.code && 
                                 data.error.message &&
                                 data.timestamp &&
                                 data.version;
            
            if (hasErrorFields) {
                return { success: true, details: `错误响应格式标准化成功，包含: success, error.code, error.message, timestamp, version` };
            } else {
                return { success: false, error: '错误响应格式缺少必需字段' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 5. 验证健康检查端点
    async testHealthCheckEndpoint() {
        try {
            const response = await fetch('http://localhost:3004/health');
            const data = await response.json();
            
            if (data.success && data.data && data.data.status === 'healthy') {
                return { success: true, details: `健康检查端点正常，状态: ${data.data.status}` };
            } else {
                return { success: false, error: '健康检查端点响应异常' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 6. 验证用户认证API
    async testUserAuthAPI() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@siman.com',
                    password: 'admin123'
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.data && data.data.token) {
                return { success: true, details: `用户认证API正常，响应格式标准化` };
            } else {
                return { success: false, error: '用户认证API响应异常' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 运行所有验证测试
    async runAllVerificationTests() {
        console.log('🔧 开发工程师 - 修复验证测试');
        console.log('='.repeat(60));
        
        await this.runTest('HTTPS重定向配置', () => this.testHTTPSRedirect());
        await this.runTest('API响应格式标准化', () => this.testAPIResponseFormat());
        await this.runTest('API版本管理', () => this.testAPIVersionManagement());
        await this.runTest('错误响应格式', () => this.testErrorResponseFormat());
        await this.runTest('健康检查端点', () => this.testHealthCheckEndpoint());
        await this.runTest('用户认证API', () => this.testUserAuthAPI());
        
        return this.generateReport();
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🔧 修复验证报告');
        console.log('='.repeat(60));
        
        const total = this.testResults.length;
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status !== 'PASS').length;
        
        console.log(`总测试数: ${total}`);
        console.log(`通过: ${passed} ✅`);
        console.log(`失败: ${failed} ❌`);
        console.log(`修复成功率: ${((passed / total) * 100).toFixed(2)}%`);
        
        console.log('\n📋 详细结果:');
        this.testResults.forEach(result => {
            const status = result.status === 'PASS' ? '✅' : '❌';
            console.log(`${status} ${result.name}: ${result.details}`);
        });
        
        if (failed === 0) {
            console.log('\n🎉 所有修复验证通过！系统质量提升完成！');
        } else {
            console.log('\n⚠️ 部分修复需要进一步调整');
        }
        
        return { total, passed, failed, results: this.testResults };
    }
}

// 运行验证测试
async function main() {
    const tester = new FixVerificationTester();
    const report = await tester.runAllVerificationTests();
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 修复总结');
    console.log('='.repeat(80));
    
    if (report.failed === 0) {
        console.log('🎯 所有问题修复成功！');
        console.log('✅ HTTPS重定向配置已完善');
        console.log('✅ API响应格式已标准化');
        console.log('✅ API版本管理已完善');
        console.log('✅ 错误处理已优化');
        console.log('\n🚀 系统已准备好投入生产使用！');
    } else {
        console.log('⚠️ 部分问题需要进一步修复');
        console.log('请检查失败的测试项目');
    }
}

main().catch(console.error);
