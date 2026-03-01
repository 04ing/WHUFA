// 加载导航栏组件
function loadNavbar() {
    fetch('../components/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
        })
        .catch(error => {
            console.error('加载导航栏失败:', error);
        });
}