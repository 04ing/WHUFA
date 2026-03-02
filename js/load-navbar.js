// 加载导航栏组件
function loadNavbar() {
    // 确定导航栏组件的路径
    let navbarPath = 'components/navbar.html';
    
    // 检查当前页面是否在GitHub Pages环境中
    if (window.location.hostname.includes('github.io')) {
        // 在GitHub Pages环境中，使用绝对路径
        if (window.location.pathname.includes('/WHUFA/')) {
            // 已经在WHUFA路径下
            navbarPath = '/WHUFA/components/navbar.html';
        } else {
            // 不在WHUFA路径下，添加路径前缀
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
            document.getElementById('navbar-container').innerHTML = html;
        })
        .catch(error => {
            console.error('加载导航栏失败:', error);
        });
}