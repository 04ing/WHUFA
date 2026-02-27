const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MATCHES_FILE = path.join(__dirname, 'data', 'matches.json');
const CONTACTS_FILE = path.join(__dirname, 'data', 'contacts.json');

// 确保 data 目录存在
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// 确保 matches.json 文件存在
if (!fs.existsSync(MATCHES_FILE)) {
    fs.writeFileSync(MATCHES_FILE, JSON.stringify([]), 'utf8');
}

// 确保 contacts.json 文件存在
if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify([]), 'utf8');
}

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// 定义用户文件路径
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// 确保 users.json 文件存在
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf8');
}

// 允许跨域请求
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// API 路由
app.get('/api/matches', (req, res) => {
    // 读取比赛数据
    fs.readFile(MATCHES_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read matches data' });
        } else {
            res.status(200).json(JSON.parse(data));
        }
    });
});

app.post('/api/matches', (req, res) => {
    // 保存比赛数据
    try {
        const matches = req.body;
        fs.writeFile(MATCHES_FILE, JSON.stringify(matches, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(500).json({ error: 'Failed to save matches data' });
            } else {
                res.status(200).json({ message: 'Matches data saved successfully' });
            }
        });
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
        
        // 读取现有用户
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        
        // 检查姓名是否已存在
        if (users.some(user => user.name === userData.name)) {
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
        
        // 保存新用户
        users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
        
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
        
        // 读取现有用户
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        
        // 查找用户
        const user = users.find(user => user.name === loginData.name && user.password === loginData.password);
        
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
        
        // 读取现有联系数据
        fs.readFile(CONTACTS_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading contacts file:', err);
                res.status(500).json({ error: 'Failed to read contacts data' });
                return;
            }
            
            try {
                const contacts = JSON.parse(data);
                console.log('Existing contacts:', contacts);
                
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
                
                // 保存新联系记录
                contacts.push(newContact);
                fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing contacts file:', err);
                        res.status(500).json({ error: 'Failed to save contacts data' });
                        return;
                    }
                    
                    console.log('Contact saved successfully');
                    res.status(200).json({ message: 'Contact form submitted successfully' });
                });
            } catch (parseError) {
                console.error('Error parsing contacts data:', parseError);
                res.status(500).json({ error: 'Failed to parse contacts data' });
            }
        });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(400).json({ error: 'Invalid JSON data', details: error.message });
    }
});

// 处理根路径
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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
