const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MATCHES_FILE = path.join(__dirname, 'data', 'matches.json');

// 确保 data 目录存在
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// 确保 matches.json 文件存在
if (!fs.existsSync(MATCHES_FILE)) {
    fs.writeFileSync(MATCHES_FILE, JSON.stringify([]), 'utf8');
}

// 处理静态文件请求
function serveStaticFile(req, res, filePath) {
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
}

// 定义用户文件路径
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// 确保 users.json 文件存在
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf8');
}

// 处理 API 请求
function handleApiRequest(req, res) {
    if (req.url === '/api/matches' && req.method === 'GET') {
        // 读取比赛数据
        fs.readFile(MATCHES_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Failed to read matches data' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    } else if (req.url === '/api/matches' && req.method === 'POST') {
        // 保存比赛数据
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const matches = JSON.parse(body);
                fs.writeFile(MATCHES_FILE, JSON.stringify(matches, null, 2), 'utf8', (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: 'Failed to save matches data' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Matches data saved successfully' }));
                    }
                });
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON data' }));
            }
        });
    } else if (req.url === '/register' && req.method === 'POST') {
        // 注册处理
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                
                // 验证必填字段
                if (!userData.name || !userData.password || !userData.college || !userData.grade) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }
                
                // 读取现有用户
                const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
                
                // 检查姓名是否已存在
                if (users.some(user => user.name === userData.name)) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Name already exists' }));
                    return;
                }
                
                // 创建新用户
                const newUser = {
                    id: Date.now().toString(),
                    name: userData.name,
                    password: userData.password, // 实际开发中应该加密密码
                    college: userData.college,
                    grade: userData.grade
                };
                
                // 保存新用户
                users.push(newUser);
                fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Registration successful', id: newUser.id }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON data' }));
            }
        });
    } else if (req.url === '/login' && req.method === 'POST') {
        // 登录处理
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const loginData = JSON.parse(body);
                
                // 验证必填字段
                if (!loginData.name || !loginData.password) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Missing name or password' }));
                    return;
                }
                
                // 读取现有用户
                const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
                
                // 查找用户
                const user = users.find(user => user.name === loginData.name && user.password === loginData.password);
                
                if (user) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Login successful', userId: user.id, name: user.name }));
                } else {
                    res.writeHead(401);
                    res.end(JSON.stringify({ error: 'Invalid name or password' }));
                }
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON data' }));
            }
        });
    } else {
        res.writeHead(404);
        res.end('API endpoint not found');
    }
}

// 创建服务器
const server = http.createServer((req, res) => {
    // 允许跨域请求
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // 处理 API 请求
    if (req.url.startsWith('/api/') || req.url === '/register' || req.url === '/login') {
        handleApiRequest(req, res);
        return;
    }
    
    // 处理静态文件请求
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // 如果是目录，尝试加载 index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }
    
    serveStaticFile(req, res, filePath);
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`API endpoints:`);
    console.log(`  GET  http://localhost:${PORT}/api/matches`);
    console.log(`  POST http://localhost:${PORT}/api/matches`);
});
