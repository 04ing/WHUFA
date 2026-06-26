const { body, validationResult } = require('express-validator');

const validateUser = [
    body('name').notEmpty().withMessage('用户名不能为空')
        .isLength({ min: 2, max: 50 }).withMessage('用户名长度必须在2-50字符之间')
        .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/).withMessage('用户名只能包含中文、英文、数字和下划线'),
    
    body('password').notEmpty().withMessage('密码不能为空')
        .isLength({ min: 6, max: 100 }).withMessage('密码长度必须在6-100字符之间'),
    
    body('college').optional().isLength({ max: 100 }).withMessage('学院名称过长'),
    
    body('grade').optional().isLength({ max: 20 }).withMessage('年级信息过长'),
    
    body('role').optional().isIn(['user', 'admin']).withMessage('角色只能是user或admin'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateLogin = [
    body('name').notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateMatch = [
    body('homeTeam').notEmpty().withMessage('主队名称不能为空'),
    body('awayTeam').notEmpty().withMessage('客队名称不能为空'),
    body('date').notEmpty().withMessage('比赛日期不能为空')
        .isISO8601().withMessage('日期格式必须是ISO 8601格式'),
    body('time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('时间格式必须是HH:MM'),
    body('venue').optional().isLength({ max: 100 }).withMessage('场地名称过长'),
    body('status').optional().isIn(['scheduled', 'in-progress', 'completed']).withMessage('状态只能是scheduled、in-progress或completed'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateComment = [
    body('content').notEmpty().withMessage('评论内容不能为空')
        .isLength({ max: 1000 }).withMessage('评论内容不能超过1000字符'),
    body('targetType').notEmpty().withMessage('目标类型不能为空')
        .isIn(['news', 'discussion']).withMessage('目标类型只能是news或discussion'),
    body('targetId').notEmpty().withMessage('目标ID不能为空'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const INJECTION_PATTERNS = [
    { pattern: /<script[^>]*>[\s\S]*?<\/script>/gi, type: 'xss', desc: 'script标签' },
    { pattern: /javascript:/gi, type: 'xss', desc: 'javascript伪协议' },
    { pattern: /on\w+\s*=/gi, type: 'xss', desc: '事件处理器' },
    { pattern: /eval\s*\(/gi, type: 'code', desc: 'eval函数' },
    { pattern: /union\s+select/gi, type: 'sql', desc: 'SQL联合查询' },
    { pattern: /drop\s+table/gi, type: 'sql', desc: 'SQL删除表' },
    { pattern: /insert\s+into/gi, type: 'sql', desc: 'SQL插入' },
    { pattern: /delete\s+from/gi, type: 'sql', desc: 'SQL删除' },
    { pattern: /extractvalue/gi, type: 'sql', desc: 'SQL报错注入' },
    { pattern: /sleep\s*\(/gi, type: 'sql', desc: 'SQL时间盲注' },
    { pattern: /waitfor\s+delay/gi, type: 'sql', desc: 'SQL延时注入' },
    { pattern: /DBMS_PIPE/gi, type: 'sql', desc: 'Oracle注入' },
    { pattern: /pg_sleep/gi, type: 'sql', desc: 'PostgreSQL注入' },
    { pattern: /and\s+1\s*=\s*1/gi, type: 'sql', desc: 'SQL永真条件' },
    { pattern: /or\s+1\s*=\s*1/gi, type: 'sql', desc: 'SQL永真条件' },
    { pattern: /--\s*$/, type: 'sql', desc: 'SQL注释' },
    { pattern: /@type/i, type: 'deserialization', desc: '反序列化攻击' },
    { pattern: /jdbc:mysql/i, type: 'deserialization', desc: 'JDBC反序列化' },
    { pattern: /JdbcRowSet/i, type: 'deserialization', desc: 'JdbcRowSet攻击' },
    { pattern: /BasicDataSource/i, type: 'deserialization', desc: '数据源攻击' },
    { pattern: /autoDeserialize/i, type: 'deserialization', desc: '自动反序列化' },
    { pattern: /CommonsCollections/i, type: 'deserialization', desc: 'CommonsCollections攻击' },
    { pattern: /__proto__/i, type: 'prototype', desc: '原型污染' },
    { pattern: /prototype/i, type: 'prototype', desc: '原型污染' },
    { pattern: /\.\.\/\.\./, type: 'path', desc: '路径遍历' },
    { pattern: /layout.*etc/i, type: 'path', desc: '模板路径遍历' },
    { pattern: /\$\{.*\}/, type: 'template', desc: '模板注入' },
    { pattern: /{{.*}}/, type: 'template', desc: 'SSTI模板注入' },
    { pattern: /<%.*%>/, type: 'template', desc: 'JSP注入' },
    { pattern: /\[\[.*\]\]/, type: 'template', desc: '模板注入' },
    { pattern: /#foreach/i, type: 'template', desc: 'Velocity模板注入' }
];

const detectInjection = (value) => {
    if (typeof value !== 'string') return null;
    for (const { pattern, type, desc } of INJECTION_PATTERNS) {
        if (pattern.test(value)) {
            return { type, desc, pattern: pattern.source };
        }
    }
    return null;
};

const sanitizeInput = (req, res, next) => {
    const sanitizeField = (value) => {
        if (typeof value === 'string') {
            return value
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .trim();
        }
        return value;
    };

    const deepSanitize = (obj) => {
        if (obj === null || obj === undefined) return obj;
        if (typeof obj === 'string') return sanitizeField(obj);
        if (typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(deepSanitize);
        const result = {};
        for (const key of Object.keys(obj)) {
            if (key === '__proto__' || key === 'prototype') continue;
            result[key] = deepSanitize(obj[key]);
        }
        return result;
    };

    const checkForInjection = (obj, path = '') => {
        if (obj === null || obj === undefined) return null;
        if (typeof obj === 'string') {
            const injection = detectInjection(obj);
            if (injection) return { path, ...injection };
            return null;
        }
        if (typeof obj !== 'object') return null;
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                const result = checkForInjection(obj[i], `${path}[${i}]`);
                if (result) return result;
            }
            return null;
        }
        for (const key of Object.keys(obj)) {
            if (key === '__proto__' || key === 'prototype') {
                return { path: `${path}.${key}`, type: 'prototype', desc: '原型污染属性' };
            }
            const result = checkForInjection(obj[key], `${path}.${key}`);
            if (result) return result;
        }
        return null;
    };

    if (req.body) {
        const injection = checkForInjection(req.body, 'body');
        if (injection) {
            console.warn(`[安全拦截] 检测到注入攻击: ${injection.type} - ${injection.desc} at ${injection.path}`);
            return res.status(400).json({ error: '请求包含非法内容，已被拒绝' });
        }
        req.body = deepSanitize(req.body);
    }

    if (req.query) {
        const injection = checkForInjection(req.query, 'query');
        if (injection) {
            console.warn(`[安全拦截] 检测到注入攻击: ${injection.type} - ${injection.desc} at ${injection.path}`);
            return res.status(400).json({ error: '请求包含非法内容，已被拒绝' });
        }
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeField(req.query[key]);
            }
        }
    }

    next();
};

const validateTeam = [
    body('name').notEmpty().withMessage('球队名称不能为空')
        .isLength({ min: 2, max: 50 }).withMessage('球队名称长度必须在2-50字符之间')
        .matches(/^[\u4e00-\u9fa5a-zA-Z0-9\s\-·]+$/).withMessage('球队名称只能包含中文、英文、数字、空格和连字符'),
    
    body('coach').optional().isLength({ max: 50 }).withMessage('教练名称过长'),
    body('college').optional().isLength({ max: 100 }).withMessage('学院名称过长'),
    body('logo').optional().isURL().withMessage('Logo必须是有效的URL'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validatePlayer = [
    body('name').notEmpty().withMessage('球员姓名不能为空')
        .isLength({ min: 2, max: 20 }).withMessage('球员姓名长度必须在2-20字符之间')
        .matches(/^[\u4e00-\u9fa5·]+$/).withMessage('球员姓名只能是中文'),
    
    body('studentId').optional().isLength({ max: 20 }).withMessage('学号过长'),
    body('teamId').optional().isLength({ max: 50 }).withMessage('球队ID过长'),
    body('position').optional().isLength({ max: 20 }).withMessage('位置过长'),
    body('number').optional().isInt({ min: 0, max: 99 }).withMessage('号码必须是0-99之间的整数'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateReferee = [
    body('name').notEmpty().withMessage('裁判姓名不能为空')
        .isLength({ min: 2, max: 20 }).withMessage('裁判姓名长度必须在2-20字符之间')
        .matches(/^[\u4e00-\u9fa5·]+$/).withMessage('裁判姓名只能是中文'),
    
    body('level').optional().isIn(['国家一级', '国家二级', '国家三级', '预备']).withMessage('裁判等级不正确'),
    body('college').optional().isLength({ max: 100 }).withMessage('学院名称过长'),
    body('grade').optional().isLength({ max: 20 }).withMessage('年级信息过长'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateNews = [
    body('title').notEmpty().withMessage('新闻标题不能为空')
        .isLength({ min: 5, max: 200 }).withMessage('新闻标题长度必须在5-200字符之间'),
    
    body('content').notEmpty().withMessage('新闻内容不能为空')
        .isLength({ min: 10, max: 10000 }).withMessage('新闻内容长度必须在10-10000字符之间'),
    
    body('category').optional().isLength({ max: 50 }).withMessage('分类名称过长'),
    body('author').optional().isLength({ max: 50 }).withMessage('作者名称过长'),
    body('imageUrl').optional().isURL().withMessage('图片URL格式不正确'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateAnnouncement = [
    body('title').notEmpty().withMessage('公告标题不能为空')
        .isLength({ min: 5, max: 200 }).withMessage('公告标题长度必须在5-200字符之间'),
    
    body('content').notEmpty().withMessage('公告内容不能为空')
        .isLength({ min: 10, max: 5000 }).withMessage('公告内容长度必须在10-5000字符之间'),
    
    body('priority').optional().isIn(['normal', 'important', 'urgent']).withMessage('优先级只能是normal、important或urgent'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateFeedback = [
    body('content').notEmpty().withMessage('反馈内容不能为空')
        .isLength({ min: 5, max: 1000 }).withMessage('反馈内容长度必须在5-1000字符之间'),
    
    body('userName').optional().isLength({ max: 50 }).withMessage('用户名过长'),
    body('email').optional().isEmail().withMessage('邮箱格式不正确'),
    body('phone').optional().matches(/^1[3-9]\d{9}$/).withMessage('手机号格式不正确'),
    body('type').optional().isLength({ max: 20 }).withMessage('类型过长'),
    body('subject').optional().isLength({ max: 100 }).withMessage('主题过长'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateDiscussion = [
    body('title').notEmpty().withMessage('讨论标题不能为空')
        .isLength({ min: 5, max: 200 }).withMessage('讨论标题长度必须在5-200字符之间'),
    
    body('content').notEmpty().withMessage('讨论内容不能为空')
        .isLength({ min: 5, max: 5000 }).withMessage('讨论内容长度必须在5-5000字符之间'),
    
    body('author').optional().isLength({ max: 50 }).withMessage('作者名称过长'),
    body('category').optional().isLength({ max: 50 }).withMessage('分类过长'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validatePoll = [
    body('question').notEmpty().withMessage('投票问题不能为空')
        .isLength({ min: 5, max: 200 }).withMessage('投票问题长度必须在5-200字符之间'),
    
    body('options').isArray({ min: 2 }).withMessage('投票选项至少需要2个'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateUser,
    validateLogin,
    validateMatch,
    validateTeam,
    validatePlayer,
    validateReferee,
    validateNews,
    validateAnnouncement,
    validateComment,
    validateFeedback,
    validateDiscussion,
    validatePoll,
    sanitizeInput
};