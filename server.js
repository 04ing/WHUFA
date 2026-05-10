const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 导入安全中间件
const { corsOptions, loginLimiter, apiLimiter, helmetHeaders } = require('./middleware/security');

// 安全响应头
app.use(helmetHeaders);

// CORS配置
app.use(cors(corsOptions));

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 全局日志中间件（不记录敏感信息）
app.use((req, res, next) => {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '******';
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request body:', logBody);
    next();
});

// 导入API路由
const apiRoutes = require('./routes/api');

// API路由使用速率限制
app.use('/api', apiLimiter);

// 登录路由使用严格的速率限制
app.use('/api/login', loginLimiter);

// 确保API路由在静态文件服务之前处理
app.use('/api', apiRoutes);

// 静态文件服务
app.use(express.static(__dirname));

// 处理根路径
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 处理其他路径，尝试返回对应的HTML文件
app.get('*', (req, res) => {
    let filePath = path.join(__dirname, req.path);
    
    if (filePath.endsWith('/')) {
        filePath += 'index.html';
    }
    
    fs.exists(filePath, (exists) => {
        if (exists) {
            res.sendFile(filePath);
        } else {
            if (!filePath.endsWith('.html')) {
                const htmlFilePath = filePath + '.html';
                fs.exists(htmlFilePath, (htmlExists) => {
                    if (htmlExists) {
                        res.sendFile(htmlFilePath);
                    } else {
                        res.status(404).send('File not found');
                    }
                });
            } else {
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