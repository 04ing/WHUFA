const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MATCHES_FILE = path.join(__dirname, 'data', 'matches.json');
const CONTACTS_FILE = path.join(__dirname, 'data', 'contacts.json');

// 模拟数据
const MATCHES_DATA = [];
const CONTACTS_DATA = [];

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// 模拟用户数据
const USERS_DATA = [];

// 允许跨域请求
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// API 路由
app.get('/api/matches', (req, res) => {
    // 返回模拟比赛数据
    res.status(200).json(MATCHES_DATA);
});

app.post('/api/matches', (req, res) => {
    // 更新模拟比赛数据
    try {
        const matches = req.body;
        // 清空并更新模拟数据
        MATCHES_DATA.length = 0;
        MATCHES_DATA.push(...matches);
        res.status(200).json({ message: 'Matches data saved successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Invalid JSON data' });
    }
});

app.post('/register', (req, res) => {
    // 注册处理
    try {
        const userData = req.body;
        
        // 验证必填字段
        if (!userData.name || !userData.password || !userData.college || !userData.grade) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        
        // 检查姓名是否已存在
        if (USERS_DATA.some(user => user.name === userData.name)) {
            res.status(400).json({ error: 'Name already exists' });
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
        
        // 保存新用户到模拟数据
        USERS_DATA.push(newUser);
        
        res.status(200).json({ message: 'Registration successful', id: newUser.id });
    } catch (error) {
        res.status(400).json({ error: 'Invalid JSON data' });
    }
});

app.post('/login', (req, res) => {
    // 登录处理
    try {
        const loginData = req.body;
        
        // 验证必填字段
        if (!loginData.name || !loginData.password) {
            res.status(400).json({ error: 'Missing name or password' });
            return;
        }
        
        // 查找用户
        const user = USERS_DATA.find(user => user.name === loginData.name && user.password === loginData.password);
        
        if (user) {
            res.status(200).json({ message: 'Login successful', userId: user.id, name: user.name });
        } else {
            res.status(401).json({ error: 'Invalid name or password' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Invalid JSON data' });
    }
});

app.post('/api/contacts', (req, res) => {
    // 处理联系表单数据
    console.log('Received contact form submission');
    try {
        const contactData = req.body;
        console.log('Parsed contact data:', contactData);
        
        // 创建新联系记录
        const newContact = {
            id: Date.now().toString(),
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            message: contactData.message,
            createdAt: new Date().toISOString()
        };
        console.log('New contact:', newContact);
        
        // 保存新联系记录到模拟数据
        CONTACTS_DATA.push(newContact);
        
        console.log('Contact saved successfully');
        res.status(200).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(400).json({ error: 'Invalid JSON data', details: error.message });
    }
});

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
    console.log('  GET  http://localhost:' + PORT + '/api/matches');
    console.log('  POST http://localhost:' + PORT + '/api/matches');
    console.log('  POST http://localhost:' + PORT + '/api/contacts');
    console.log('  POST http://localhost:' + PORT + '/register');
    console.log('  POST http://localhost:' + PORT + '/login');
});
