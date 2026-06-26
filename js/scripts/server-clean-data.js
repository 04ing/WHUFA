const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

const SUSPICIOUS_PATTERNS = [
    /<script/i,
    /javascript:/i,
    /eval\s*\(/i,
    /\$\{.*\}/,
    /{{.*}}/,
    /<%.*%>/,
    /\[\[.*\]\]/,
    /union\s+select/i,
    /drop\s+table/i,
    /extractvalue/i,
    /sleep\s*\(/i,
    /waitfor\s+delay/i,
    /DBMS_PIPE/i,
    /pg_sleep/i,
    /@type/i,
    /jdbc:mysql/i,
    /JdbcRowSet/i,
    /BasicDataSource/i,
    /LoadBalancedMySQL/i,
    /autoDeserialize/i,
    /statementInterceptors/i,
    /CommonsCollections/i,
    /__proto__/i,
    /prototype/i,
    /layout.*etc/i,
    /\.\.\/\.\./
];

const TEST_NAMES = ['admin', 'test', 'test1', 'test2', 'test22', 'user', 'e', 'a', 'dfb', '123', '1', 'undefined', 'null'];

function isSuspicious(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
            if (SUSPICIOUS_PATTERNS.some(p => p.test(key))) return true;
            if (isSuspicious(value[key])) return true;
        }
        return false;
    }
    if (typeof value !== 'string') return false;
    return SUSPICIOUS_PATTERNS.some(p => p.test(value));
}

function isTestValue(value) {
    if (!value || typeof value !== 'string') return false;
    const lower = value.trim().toLowerCase();
    if (TEST_NAMES.includes(lower)) return true;
    if (lower.length <= 2) return true;
    return false;
}

function isValidChinese(text, minLen = 2, maxLen = 15) {
    if (!text || typeof text !== 'string') return false;
    const trimmed = text.trim();
    if (trimmed.length < minLen || trimmed.length > maxLen) return false;
    return /^[\u4e00-\u9fa5·]+$/.test(trimmed);
}

function hasAnySuspiciousField(obj) {
    for (const key of Object.keys(obj)) {
        if (isSuspicious(obj[key])) return true;
    }
    return false;
}

function cleanData(fileName, nameField, validator) {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
        console.log(`${fileName}: 文件不存在，跳过`);
        return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const originalCount = data.length;
    
    const cleaned = data.filter(item => {
        if (hasAnySuspiciousField(item)) return false;
        if (validator) return validator(item);
        return true;
    });
    
    const seen = new Set();
    const deduped = cleaned.filter(item => {
        const name = item[nameField] || item.id || '';
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
    });
    
    fs.writeFileSync(filePath, JSON.stringify(deduped, null, 2));
    console.log(`${fileName}: ${originalCount} -> ${deduped.length} (移除 ${originalCount - deduped.length})`);
    return deduped.length;
}

console.log('=== 服务器数据清理 ===\n');
console.log(`数据目录: ${DATA_DIR}\n`);

const users = cleanData('users.json', 'name', (u) => {
    if (!u.name || !u.password) return false;
    if (isTestValue(u.name)) return false;
    if (!isValidChinese(u.name)) return false;
    return true;
});

const teams = cleanData('teams.json', 'name', (t) => {
    if (!t.name || typeof t.name !== 'string') return false;
    if (isTestValue(t.name)) return false;
    if (t.name === 'undefined' || t.name === 'null') return false;
    return true;
});

const players = cleanData('players.json', 'name', (p) => {
    if (!p.name || typeof p.name !== 'string') return false;
    if (isTestValue(p.name)) return false;
    if (!isValidChinese(p.name)) return false;
    return true;
});

const referees = cleanData('referees.json', 'name', (r) => {
    if (!r.name || typeof r.name !== 'string') return false;
    if (isTestValue(r.name)) return false;
    if (!isValidChinese(r.name)) return false;
    return true;
});

const matches = cleanData('matches.json', 'id', (m) => {
    if (!m.homeTeam || !m.awayTeam) return false;
    if (typeof m.homeTeam !== 'string' || typeof m.awayTeam !== 'string') return false;
    if (isTestValue(m.homeTeam) || isTestValue(m.awayTeam)) return false;
    if (m.homeTeam === 'undefined' || m.awayTeam === 'undefined') return false;
    return true;
});

const news = cleanData('news.json', 'id', (n) => {
    if (!n.title || typeof n.title !== 'string') return false;
    if (n.title.length < 5) return false;
    if (isTestValue(n.title)) return false;
    return true;
});

const announcements = cleanData('announcements.json', 'id', (a) => {
    if (!a.title || typeof a.title !== 'string') return false;
    if (a.title.length < 5) return false;
    if (isTestValue(a.title)) return false;
    return true;
});

const feedback = cleanData('feedback.json', 'id', (f) => {
    if (!f.content || typeof f.content !== 'string') return false;
    if (f.content.length < 10) return false;
    if (isTestValue(f.userName)) return false;
    return true;
});

console.log('\n=== 清理完成 ===');
console.log('\n清理后数据统计:');
console.log(`  用户: ${users}`);
console.log(`  球队: ${teams}`);
console.log(`  球员: ${players}`);
console.log(`  裁判: ${referees}`);
console.log(`  比赛: ${matches}`);
console.log(`  新闻: ${news}`);
console.log(`  公告: ${announcements}`);
console.log(`  反馈: ${feedback}`);