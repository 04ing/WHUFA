const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'whufa_jwt_secret_key_2024';
const JWT_EXPIRES_IN = '1h';

const generateToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        role: user.role
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: '未授权访问，请先登录' });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: '无效的token，请重新登录' });
    }
    
    req.user = decoded;
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: '权限不足，需要管理员权限' });
    }
    next();
};

module.exports = {
    generateToken,
    verifyToken,
    authenticate,
    requireAdmin
};