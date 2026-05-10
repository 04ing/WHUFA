// User模型 - 处理用户相关数据
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const SALT_ROUNDS = 10;

class User {
    constructor() {
        this.users = [];
        this.loadUsers();
    }

    // 加载用户数据
    loadUsers() {
        try {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            this.users = JSON.parse(data);
        } catch (error) {
            console.error('Error loading users:', error);
            this.users = [];
        }
    }

    // 保存用户数据
    saveUsers() {
        try {
            fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    // 获取所有用户
    getAllUsers() {
        return this.users;
    }

    // 根据ID获取用户
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    // 根据姓名获取用户
    getUserByName(name) {
        return this.users.find(user => user.name === name);
    }

    // 创建新用户
    createUser(userData) {
        // 使用bcrypt加密密码
        const hashedPassword = bcrypt.hashSync(userData.password, SALT_ROUNDS);
        
        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            password: hashedPassword, // 加密后的密码
            college: userData.college,
            grade: userData.grade,
            role: userData.role || 'user', // 默认角色为普通用户
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    // 更新用户信息
    updateUser(id, userData) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...userData };
            this.saveUsers();
            return this.users[index];
        }
        return null;
    }

    // 删除用户
    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            const deletedUser = this.users.splice(index, 1);
            this.saveUsers();
            return deletedUser[0];
        }
        return null;
    }

    // 验证用户登录
    validateLogin(name, password) {
        const user = this.users.find(user => user.name === name);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }

    // 获取用户角色
    getUserRole(id) {
        const user = this.getUserById(id);
        return user ? user.role : null;
    }

    // 检查用户权限
    checkPermission(id, requiredRole) {
        const user = this.getUserById(id);
        if (!user) return false;
        
        // 角色权限层级：admin > coach > player > referee > user
        const roleLevels = {
            admin: 5,
            coach: 4,
            player: 3,
            referee: 3,
            user: 2
        };
        
        const userLevel = roleLevels[user.role] || 1;
        const requiredLevel = roleLevels[requiredRole] || 1;
        
        return userLevel >= requiredLevel;
    }

    // 批量替换所有用户（用于数据迁移，需要管理员权限）
    replaceAllUsers(users) {
        if (!Array.isArray(users)) {
            throw new Error('Invalid data format');
        }
        
        this.users = users.map(user => {
            if (user.password && !user.password.startsWith('$2b$')) {
                return {
                    ...user,
                    password: bcrypt.hashSync(user.password, SALT_ROUNDS)
                };
            }
            return user;
        });
        
        this.saveUsers();
        return this.users;
    }
}

module.exports = User;