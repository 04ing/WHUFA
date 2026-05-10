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

const sanitizeInput = (req, res, next) => {
    const sanitizeField = (value) => {
        if (typeof value === 'string') {
            return value
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .trim();
        }
        return value;
    };

    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeField(req.body[key]);
            } else if (typeof req.body[key] === 'object') {
                req.body[key] = JSON.parse(JSON.stringify(req.body[key], (k, v) => 
                    typeof v === 'string' ? sanitizeField(v) : v
                ));
            }
        }
    }

    if (req.query) {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeField(req.query[key]);
            }
        }
    }

    next();
};

module.exports = {
    validateUser,
    validateLogin,
    validateMatch,
    validateComment,
    sanitizeInput
};