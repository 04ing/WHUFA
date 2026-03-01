const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// 允许跨域请求
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 导入API路由
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// 处理根路径
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 处理其他路径，尝试返回对应的HTML文件
app.get('*', (req, res) => {
    // 尝试构建文件路径
    let filePath = path.join(__dirname, req.path);
    
    // 如果路径以/结尾，尝试添加index.html
    if (filePath.endsWith('/')) {
        filePath += 'index.html';
    }
    
    // 检查文件是否存在
    fs.exists(filePath, (exists) => {
        if (exists) {
            // 如果文件存在，直接返回
            res.sendFile(filePath);
        } else {
            // 如果文件不存在，检查是否是HTML文件请求
            if (!filePath.endsWith('.html')) {
                const htmlFilePath = filePath + '.html';
                fs.exists(htmlFilePath, (htmlExists) => {
                    if (htmlExists) {
                        res.sendFile(htmlFilePath);
                    } else {
                        // 如果还是不存在，返回404
                        res.status(404).send('File not found');
                    }
                });
            } else {
                // 如果是HTML文件但不存在，返回404
                res.status(404).send('File not found');
            }
        }
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT + '/');
    console.log('API endpoints:');
    console.log('  Users: GET/POST/PUT/DELETE /api/users');
    console.log('  Login: POST /api/login');
    console.log('  Matches: GET/POST/PUT/DELETE /api/matches');
    console.log('  Teams: GET/POST/PUT/DELETE /api/teams');
    console.log('  Players: GET/POST/PUT/DELETE /api/players');
    console.log('  Referees: GET/POST/PUT/DELETE /api/referees');
    console.log('  News: GET/POST/PUT/DELETE /api/news');
    console.log('  Announcements: GET/POST/PUT/DELETE /api/announcements');
    console.log('  Gallery: GET/POST/PUT/DELETE /api/gallery');
    console.log('  Rules: GET/POST/PUT/DELETE /api/rules');
    console.log('  Comments: GET/POST/PUT/DELETE /api/comments');
    console.log('  Discussions: GET/POST/PUT/DELETE /api/discussions');
    console.log('  Polls: GET/POST/PUT/DELETE /api/polls');
    console.log('  Feedback: GET/POST/PUT/DELETE /api/feedback');
    console.log('  Statistics: GET /api/statistics/*');
    console.log('  Search: GET /api/search?keyword=...');
});
