const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

const INJECTION_PATTERNS = [
    /<script/i,
    /<\?php/i,
    /javascript:/i,
    /onload\s*=/i,
    /onerror\s*=/i,
    /onclick\s*=/i,
    /eval\s*\(/i,
    /document\.cookie/i,
    /window\.location/i,
    /\$\{.*\}/,
    /{{.*}}/,
    /<%.*%>/,
    /\[\[.*\]\]/,
    /#foreach/i,
    /\.replace\s*\(/i,
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /--\s*$/,
    /'.*OR.*1=1/i
];

const TEST_NAMES = [
    'admin',
    'test',
    'test1',
    'test2',
    'test123',
    'user',
    'user1',
    'user2',
    'e',
    'dfb',
    '123',
    '1',
    'a'
];

function isInjection(value) {
    if (typeof value !== 'string') return false;
    const lower = value.toLowerCase();
    return INJECTION_PATTERNS.some(pattern => pattern.test(value));
}

function isTestData(item, nameField = 'name') {
    const name = item[nameField] || item.userName || item.title;
    if (!name || typeof name !== 'string') return false;
    const lower = name.toLowerCase().trim();
    
    if (TEST_NAMES.includes(lower)) return true;
    if (lower.length <= 2) return true;
    
    return false;
}

function deduplicate(arr, key = 'id') {
    const seen = new Set();
    return arr.filter(item => {
        const id = item[key];
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    });
}

function cleanFile(fileName, nameField = 'name') {
    const filePath = path.join(DATA_DIR, fileName);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const originalCount = data.length;
    
    let cleaned = data.filter(item => {
        for (const key of Object.keys(item)) {
            if (isInjection(item[key])) return false;
        }
        return true;
    });
    
    const afterInjection = cleaned.length;
    
    cleaned = cleaned.filter(item => !isTestData(item, nameField));
    
    const afterTest = cleaned.length;
    
    cleaned = deduplicate(cleaned, 'id');
    
    const finalCount = cleaned.length;
    
    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2));
    
    console.log(`\n${fileName}:`);
    console.log(`  原始: ${originalCount}`);
    console.log(`  移除注入攻击: ${originalCount - afterInjection}`);
    console.log(`  移除测试数据: ${afterInjection - afterTest}`);
    console.log(`  移除重复ID: ${afterTest - finalCount}`);
    console.log(`  最终: ${finalCount}`);
    
    return { originalCount, finalCount, removed: originalCount - finalCount };
}

console.log('=== 开始清理数据 ===\n');

const files = [
    { file: 'users.json', nameField: 'name' },
    { file: 'teams.json', nameField: 'name' },
    { file: 'players.json', nameField: 'name' },
    { file: 'referees.json', nameField: 'name' },
    { file: 'matches.json', nameField: 'homeTeam' },
    { file: 'news.json', nameField: 'title' },
    { file: 'announcements.json', nameField: 'title' },
    { file: 'feedback.json', nameField: 'userName' }
];

let totalOriginal = 0;
let totalRemoved = 0;

for (const { file, nameField } of files) {
    try {
        const result = cleanFile(file, nameField);
        totalOriginal += result.originalCount;
        totalRemoved += result.removed;
    } catch (e) {
        console.log(`\n${file}: 处理失败 - ${e.message}`);
    }
}

console.log('\n=== 清理完成 ===');
console.log(`总原始数据: ${totalOriginal}`);
console.log(`总移除数据: ${totalRemoved}`);
console.log(`剩余数据: ${totalOriginal - totalRemoved}`);