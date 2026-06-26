#!/bin/bash
# 服务器端修复脚本 - 同步本地所有更改到服务器
# 使用方法: chmod +x server-fix.sh && ./server-fix.sh

cd /root/WHUFA

echo "=========================================="
echo "  WHUFA 服务器端修复脚本"
echo "=========================================="
echo ""

# 备份原始文件
echo "[1/7] 备份原始文件..."
BACKUP_DIR="/root/WHUFA_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r components css data js pages index.html "$BACKUP_DIR/" 2>/dev/null
echo "备份完成: $BACKUP_DIR"
echo ""

# 停止旧的服务器进程
echo "[2/7] 停止旧服务器进程..."
pkill -f "node server.js" 2>/dev/null
sleep 1
echo "旧服务器已停止"
echo ""

# ==========================================
# 修复 1: 更新导航栏组件
# ==========================================
echo "[3/7] 更新导航栏组件..."

cat > components/navbar.html << 'NAVBAR_EOF'
<!-- 导航栏 -->
<nav class="custom-nav">
    <div class="nav-container">
        <a href="index.html" class="nav-brand">武汉大学足球协会</a>
        
        <!-- 移动端汉堡菜单按钮 -->
        <button class="mobile-menu-btn" id="mobileMenuBtn">
            <span class="menu-icon"></span>
            <span class="menu-icon"></span>
            <span class="menu-icon"></span>
        </button>

        <div class="nav-links" id="navLinks">
            <a href="index.html" class="nav-link">首页</a>
            <a href="pages/about.html" class="nav-link">社团介绍</a>
            <a href="pages/events.html" class="nav-link">赛事开展</a>
            <a href="pages/departments.html" class="nav-link">部门介绍</a>
            <a href="pages/news.html" class="nav-link">新闻公告</a>
            <a href="pages/contact.html" class="nav-link">联系我们</a>
            <div class="nav-dropdown">
                <a href="#" class="nav-link dropdown-toggle">赛事查询</a>
                <div class="dropdown-menu">
                    <a href="pages/freshmen2024search.html" class="dropdown-item">2024新生杯</a>
                    <div class="nav-dropdown nested-dropdown">
                        <a href="#" class="dropdown-item dropdown-toggle nested-toggle">2024振兴杯</a>
                        <div class="dropdown-menu nested-menu">
                            <a href="pages/Super2024.html" class="dropdown-item">男子超级组</a>
                            <a href="pages/League2024.html" class="dropdown-item">男子甲级组</a>
                            <a href="pages/Women2024.html" class="dropdown-item">女子组</a>
                        </div>
                    </div>
                    <div class="nav-dropdown nested-dropdown">
                        <a href="#" class="dropdown-item dropdown-toggle nested-toggle">2025新生杯</a>
                        <div class="dropdown-menu nested-menu">
                            <a href="pages/match-results.html" class="dropdown-item">赛果更新</a>
                        </div>
                    </div>
                    <a href="http://47.103.29.77:3002" class="dropdown-item" target="_blank">2026足协杯</a>
                </div>
            </div>
            <a href="pages/match-management.html" class="nav-link" id="matchManagementLink" style="display: none;">赛事管理</a>
            <div id="userInfo" style="display: none;">
                <div class="nav-dropdown">
                    <a href="#" class="nav-link dropdown-toggle" id="userNameDisplay">用户</a>
                    <div class="dropdown-menu">
                        <a href="pages/profile.html" class="dropdown-item">个人中心</a>
                        <a href="#" class="dropdown-item" onclick="logout()">登出</a>
                    </div>
                </div>
            </div>
            <a href="pages/register.html" class="nav-link" id="loginRegisterLink">登录/注册</a>
        </div>
    </div>
</nav>

<!-- 移动端菜单覆盖层 -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>

<script>
    // 页面加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        // 移动端菜单控制
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        
        if (mobileMenuBtn && navLinks && mobileMenuOverlay) {
            mobileMenuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                mobileMenuOverlay.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                mobileMenuBtn.classList.toggle('active');
            });
            
            mobileMenuOverlay.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
                mobileMenuBtn.classList.remove('active');
            });
        }
        
        // 下拉菜单控制
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle:not(.nested-toggle)');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const dropdownMenu = this.nextElementSibling;
                dropdownMenu.classList.toggle('active');
            });
        });
        
        // 二级下拉菜单控制
        const nestedToggles = document.querySelectorAll('.nested-toggle');
        nestedToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const nestedMenu = this.nextElementSibling;
                nestedMenu.classList.toggle('active');
            });
        });
        
        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-dropdown')) {
                const dropdownMenus = document.querySelectorAll('.dropdown-menu');
                dropdownMenus.forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        });
        
        // 检查用户登录状态
        checkLoginStatus();
    });
    
    // 检查用户登录状态
    function checkLoginStatus() {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        
        const userInfo = document.getElementById('userInfo');
        const userNameDisplay = document.getElementById('userNameDisplay');
        const loginRegisterLink = document.getElementById('loginRegisterLink');
        const matchManagementLink = document.getElementById('matchManagementLink');
        
        if (userId && userName) {
            // 用户已登录，显示用户信息和登出按钮
            if (userInfo) userInfo.style.display = 'block';
            if (userNameDisplay) userNameDisplay.textContent = userName;
            if (loginRegisterLink) loginRegisterLink.style.display = 'none';
            if (matchManagementLink) matchManagementLink.style.display = 'block';
        } else {
            // 用户未登录，显示登录/注册链接
            if (userInfo) userInfo.style.display = 'none';
            if (loginRegisterLink) loginRegisterLink.style.display = 'block';
            if (matchManagementLink) matchManagementLink.style.display = 'none';
        }
    }
    
    // 登出功能
    function logout() {
        // 清除本地存储中的用户信息
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        
        // 更新导航栏显示
        checkLoginStatus();
        
        // 跳转到首页
        let indexPath = 'index.html';
        if (window.location.pathname.includes('/pages/')) {
            indexPath = '../index.html';
        } else if (window.location.hostname.includes('github.io')) {
            indexPath = '/WHUFA/index.html';
        }
        window.location.href = indexPath;
    }
</script>
NAVBAR_EOF
echo "导航栏组件已更新"
echo ""

# ==========================================
# 修复 2: 更新CSS样式文件
# ==========================================
echo "[4/7] 更新CSS样式文件（点击触发下拉菜单）..."

cat > css/layout.css << 'CSS_EOF'
/* 全局样式重置 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
}

/* 导航栏样式 */
.custom-nav {
    background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
}

.nav-brand {
    color: white;
    font-size: 20px;
    font-weight: bold;
    text-decoration: none;
    letter-spacing: 1px;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 5px;
}

.nav-link {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    padding: 10px 15px;
    font-size: 14px;
    transition: all 0.3s ease;
    border-radius: 4px;
    display: block;
}

.nav-link:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
}

/* 下拉菜单样式 */
.nav-dropdown {
    position: relative;
}

.dropdown-toggle {
    cursor: pointer;
}

.dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    min-width: 180px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    overflow: hidden;
    z-index: 1001;
}

.dropdown-menu.active {
    display: block;
}

.dropdown-item {
    display: block;
    padding: 10px 15px;
    color: #333;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.2s ease;
}

.dropdown-item:hover {
    background-color: #f0f4f8;
    color: #2c5282;
}

/* 二级下拉菜单 */
.nested-dropdown {
    position: relative;
}

.nested-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nested-toggle::after {
    content: '›';
    margin-left: 10px;
    font-size: 16px;
    color: #999;
}

.nested-menu {
    display: none;
    position: absolute;
    top: 0;
    left: 100%;
    background-color: white;
    min-width: 160px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    overflow: hidden;
}

.nested-menu.active {
    display: block;
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 25px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.menu-icon {
    display: block;
    width: 100%;
    height: 3px;
    background-color: white;
    border-radius: 2px;
    transition: all 0.3s ease;
}

.mobile-menu-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.mobile-menu-overlay.active {
    display: block;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .mobile-menu-btn {
        display: flex;
    }

    .nav-links {
        position: fixed;
        top: 0;
        right: -280px;
        width: 280px;
        height: 100vh;
        background-color: #1a365d;
        flex-direction: column;
        padding: 60px 20px 20px;
        transition: right 0.3s ease;
        overflow-y: auto;
        align-items: stretch;
        gap: 0;
    }

    .nav-links.active {
        right: 0;
    }

    .nav-link {
        padding: 15px;
        font-size: 16px;
    }

    .dropdown-menu {
        position: static;
        box-shadow: none;
        background-color: rgba(255, 255, 255, 0.05);
        min-width: auto;
    }

    .dropdown-item {
        color: rgba(255, 255, 255, 0.8);
        padding: 12px 15px 12px 30px;
    }

    .dropdown-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .nested-menu {
        position: static;
        box-shadow: none;
        background-color: rgba(255, 255, 255, 0.03);
        min-width: auto;
    }

    .nested-menu .dropdown-item {
        padding-left: 45px;
    }
}

/* 主要内容区域 */
.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
    min-height: calc(100vh - 200px);
}

/* 页脚样式 */
.footer {
    background-color: #1a365d;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    padding: 20px;
    margin-top: 40px;
}

.footer p {
    margin: 5px 0;
    font-size: 14px;
}

/* 卡片样式 */
.card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 25px;
    margin-bottom: 20px;
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a365d;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e2e8f0;
}

/* 按钮样式 */
.btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #2c5282;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #1a365d;
}

.btn-primary {
    background-color: #2c5282;
}

.btn-secondary {
    background-color: #718096;
}

.btn-danger {
    background-color: #c53030;
}

.btn-success {
    background-color: #2f855a;
}
CSS_EOF
echo "CSS样式文件已更新"
echo ""

# ==========================================
# 修复 3: 更新 load-navbar.js
# ==========================================
echo "[额外] 更新 load-navbar.js..."

cat > js/load-navbar.js << 'JS_EOF'
// 配置文件 - 用于管理不同环境的API地址
if (typeof Config === 'undefined') {
    const Config = {
        API_BASE_URL: (function() {
            const hostname = window.location.hostname;
            
            // Railway环境（后端和前端在同一个域名下）
            if (hostname.includes('railway.app')) {
                return '';
            }
            
            // GitHub Pages环境 + Railway后端
            // 注意：部署到Railway后，需要将下方的URL替换为你的Railway应用URL
            if (hostname.includes('github.io') || hostname.includes('netlify.app')) {
                return 'https://whufa-production-3b30.up.railway.app/';
            }
            
            // 阿里云服务器环境（后端和前端在同一个域名下）
            if (hostname === '47.103.29.77') {
                return '';
            }
            
            // 本地开发环境
            return 'http://localhost:3001';
        })(),

        getApiUrl: function(endpoint) {
            if (this.API_BASE_URL === '') {
                return endpoint;
            }
            return this.API_BASE_URL + endpoint;
        }
    };
    window.Config = Config;
}

// 自动替换页面中所有API调用
function setupApiInterceptor() {
    // 只设置一次拦截器
    if (window.__apiInterceptorSet) {
        return;
    }
    window.__apiInterceptorSet = true;
    
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // 如果URL是API请求
        if (typeof url === 'string') {
            console.log('原始URL:', url);
            // 情况1: 相对路径 /api/xxx
            if (url.startsWith('/api/')) {
                url = window.Config.getApiUrl(url);
            }
            // 情况2: 替换旧的localhost URL为新的API BASE URL
            else if (url.includes('localhost:3000') && url.includes('/api/')) {
                url = url.replace('http://localhost:3000', window.Config.API_BASE_URL);
            }
            console.log('修改后的URL:', url);
        }
        return originalFetch.call(this, url, options);
    };
}

// 加载导航栏组件
function loadNavbar() {
    // 暂时禁用API拦截器，因为它会导致登录请求被发送两次
    // setupApiInterceptor();
    
    // 确定导航栏组件的路径
    let navbarPath = 'components/navbar.html';
    
    // 检查当前页面是否在GitHub Pages环境中
    if (window.location.hostname.includes('github.io')) {
        // 在GitHub Pages环境中，使用绝对路径
        if (window.location.pathname.includes('/WHUFA/')) {
            navbarPath = '/WHUFA/components/navbar.html';
        } else {
            navbarPath = '/WHUFA/components/navbar.html';
        }
    } else {
        // 本地环境中，根据当前页面的路径动态确定导航栏组件的路径
        if (window.location.pathname.includes('/pages/')) {
            navbarPath = '../components/navbar.html';
        }
    }
    
    fetch(navbarPath)
        .then(response => response.text())
        .then(html => {
            // 移除可能存在的CSP元标签，避免在<body>中添加
            html = html.replace(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>/gi, '');
            
            // 根据当前页面的路径动态调整导航栏中的链接路径
            if (window.location.pathname.includes('/pages/')) {
                // 如果当前页面在pages目录下，使用相对路径（去掉pages/前缀）
                html = html.replace(/href="pages\/(.*?)"/g, 'href="$1"');
                html = html.replace(/href="index\.html"/g, 'href="../index.html"');
                // 修复登出函数中的路径
                html = html.replace(/window\.location\.href = 'index\.html';/g, 'window\.location\.href = \'../index.html\';');
            } else if (window.location.hostname.includes('github.io')) {
                // 如果在GitHub Pages环境中，使用绝对路径
                html = html.replace(/href="(pages\/.*?)"/g, 'href="/WHUFA/$1"');
                html = html.replace(/href="index\.html"/g, 'href="/WHUFA/index.html"');
                // 修复登出函数中的路径
                html = html.replace(/window\.location\.href = 'index\.html';/g, 'window\.location\.href = \'/WHUFA/index.html\';');
            } else {
                // 根目录页面，使用相对路径
                html = html.replace(/href="(pages\/.*?)"/g, 'href="$1"');
                html = html.replace(/href="index\.html"/g, 'href="index.html"');
            }
            
            document.getElementById('navbar-container').innerHTML = html;
            
            // 导航栏加载完成后检查登录状态
            checkLoginStatus();
            
            // 重新绑定移动端菜单事件监听器
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navLinks = document.getElementById('navLinks');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            
            if (mobileMenuBtn && navLinks && mobileMenuOverlay) {
                // 移除之前的事件监听器，避免重复绑定
                mobileMenuBtn.onclick = null;
                mobileMenuOverlay.onclick = null;
                
                // 绑定新的事件监听器
                mobileMenuBtn.addEventListener('click', function() {
                    navLinks.classList.toggle('active');
                    mobileMenuOverlay.classList.toggle('active');
                    document.body.classList.toggle('menu-open');
                    mobileMenuBtn.classList.toggle('active');
                });
                
                mobileMenuOverlay.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    mobileMenuOverlay.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    mobileMenuBtn.classList.remove('active');
                });
            }
            
            // 重新绑定下拉菜单事件监听器
            const dropdownToggles = document.querySelectorAll('.dropdown-toggle:not(.nested-toggle)');
            dropdownToggles.forEach(toggle => {
                // 移除之前的事件监听器，避免重复绑定
                toggle.onclick = null;
                
                // 绑定新的事件监听器
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const dropdownMenu = this.nextElementSibling;
                    dropdownMenu.classList.toggle('active');
                });
            });
            
            // 重新绑定二级下拉菜单事件监听器
            const nestedToggles = document.querySelectorAll('.nested-toggle');
            nestedToggles.forEach(toggle => {
                toggle.onclick = null;
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const nestedMenu = this.nextElementSibling;
                    nestedMenu.classList.toggle('active');
                });
            });
        })
        .catch(error => {
            console.error('加载导航栏失败:', error);
        });
}

// 检查用户登录状态
function checkLoginStatus() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (userId && userName) {
        // 用户已登录，显示用户信息和登出按钮
        const userInfo = document.getElementById('userInfo');
        const userNameDisplay = document.getElementById('userNameDisplay');
        const loginRegisterLink = document.getElementById('loginRegisterLink');
        const matchManagementLink = document.getElementById('matchManagementLink');
        
        if (userInfo) userInfo.style.display = 'block';
        if (userNameDisplay) userNameDisplay.textContent = userName;
        if (loginRegisterLink) loginRegisterLink.style.display = 'none';
        if (matchManagementLink) matchManagementLink.style.display = 'block';
    } else {
        // 用户未登录，显示登录/注册链接
        const userInfo = document.getElementById('userInfo');
        const loginRegisterLink = document.getElementById('loginRegisterLink');
        const matchManagementLink = document.getElementById('matchManagementLink');
        
        if (userInfo) userInfo.style.display = 'none';
        if (loginRegisterLink) loginRegisterLink.style.display = 'block';
        if (matchManagementLink) matchManagementLink.style.display = 'none';
    }
}

// 登出功能
function logout() {
    // 清除本地存储中的用户信息
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
    // 更新导航栏显示
    checkLoginStatus();
    
    // 跳转到首页
    let indexPath = 'index.html';
    if (window.location.pathname.includes('/pages/')) {
        indexPath = '../index.html';
    } else if (window.location.hostname.includes('github.io')) {
        indexPath = '/WHUFA/index.html';
    }
    window.location.href = indexPath;
}

// 页面加载时自动调用loadNavbar函数
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}
JS_EOF
echo "load-navbar.js 已更新"
echo ""

# ==========================================
# 修复 4: 清理所有HTML页面中的强制登录代码
# ==========================================
echo "[6/7] 清理所有HTML页面中的强制登录代码..."

# 定义需要清理的页面列表
PUBLIC_PAGES=(
    "index.html"
    "pages/League2024.html"
    "pages/Super2024.html"
    "pages/Women2024.html"
    "pages/about.html"
    "pages/competition.html"
    "pages/contact.html"
    "pages/departments.html"
    "pages/events.html"
    "pages/fa-cup.html"
    "pages/freshmen-cup.html"
    "pages/freshmen2024search.html"
    "pages/futsal.html"
    "pages/match-management.html"
    "pages/match-results.html"
    "pages/news.html"
    "pages/organization.html"
    "pages/referee.html"
    "pages/revival-cup.html"
)

CLEAN_COUNT=0

for page in "${PUBLIC_PAGES[@]}"; do
    if [ -f "$page" ]; then
        # 使用sed删除常见的强制登录跳转代码模式
        # 模式1: script标签内的检查登录状态并跳转
        sed -i '/document\.addEventListener\s*(\s*'\''DOMContentLoaded'\''\s*,\s*function\s*()\s*{/,/}\s*);\s*/{
            /if\s*(!localStorage\.getItem\s*(\s*'\''userId'\''\s*)\s*)/,/}\s*$/d
        }' "$page" 2>/dev/null
        
        # 模式2: 简单的if判断跳转（多行）
        sed -i '/if\s*(!localStorage\.getItem\s*(\s*'\''userId'\''\s*)\s*)/,/window\.location\.href\s*=.*register\.html/d' "$page" 2>/dev/null
        
        # 模式3: 单行跳转
        sed -i '/if\s*(!localStorage\.getItem.*userId.*).*window\.location\.href.*register\.html/d' "$page" 2>/dev/null
        
        # 模式4: 包含"未登录"提示的跳转代码
        sed -i '/未登录.*跳转/,/register\.html/d' "$page" 2>/dev/null
        
        # 模式5: checkLoginStatus函数中包含跳转的部分
        sed -i '/function\s*checkLoginStatus\s*()\s*{/,/^}\s*$/{
            /window\.location\.href\s*=.*register\.html/d
            /location\.href\s*=.*register\.html/d
        }' "$page" 2>/dev/null
        
        CLEAN_COUNT=$((CLEAN_COUNT + 1))
        echo "  已清理: $page"
    fi
done

echo "共清理了 $CLEAN_COUNT 个页面"
echo ""

# ==========================================
# 修复 5: 清理数据文件中的注入数据
# ==========================================
echo "[7/7] 清理数据文件中的注入数据..."

# 清理 announcements.json
if [ -f "data/announcements.json" ]; then
    echo '[]' > data/announcements.json
    echo "  已清理: data/announcements.json"
fi

# 清理 teams.json
if [ -f "data/teams.json" ]; then
    echo '[]' > data/teams.json
    echo "  已清理: data/teams.json"
fi

# 清理 news.json
if [ -f "data/news.json" ]; then
    echo '[]' > data/news.json
    echo "  已清理: data/news.json"
fi

echo ""

# ==========================================
# 启动服务器
# ==========================================
echo "=========================================="
echo "  启动服务器..."
echo "=========================================="

# 重新安装依赖（确保最新）
npm install 2>&1 | tail -5

# 启动服务器
nohup npm start > /root/whufa-server.log 2>&1 &
sleep 2

# 检查服务器是否启动成功
if pgrep -f "node server.js" > /dev/null; then
    echo "✓ 服务器启动成功！"
    echo "  进程ID: $(pgrep -f 'node server.js')"
    echo "  日志文件: /root/whufa-server.log"
else
    echo "✗ 服务器启动失败，请检查日志: /root/whufa-server.log"
fi

echo ""
echo "=========================================="
echo "  修复完成！"
echo "=========================================="
echo ""
echo "修复内容汇总:"
echo "  1. 更新导航栏组件 - 优化赛事查询下拉菜单结构"
echo "  2. 更新CSS样式 - 改为点击触发下拉菜单"
echo "  3. 更新load-navbar.js - 优化导航栏加载逻辑"
echo "  4. 清理强制登录代码 - 公共页面不再强制跳转登录"
echo "  5. 清理注入数据 - 清空被污染的数据文件"
echo ""
echo "请访问 http://47.103.29.77:3001 验证修复效果"
echo "备份文件位于: $BACKUP_DIR"
