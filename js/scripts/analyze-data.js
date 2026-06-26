const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

const dataFiles = [
    'users.json',
    'teams.json',
    'players.json',
    'referees.json',
    'matches.json',
    'news.json',
    'announcements.json',
    'feedback.json',
    'gallery.json',
    'comments.json',
    'discussions.json',
    'polls.json',
    'rules.json'
];

function analyzeData(fileName) {
    const filePath = path.join(DATA_DIR, fileName);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`\n=== ${fileName} ===`);
    console.log(`总数: ${data.length}`);
    
    if (data.length === 0) {
        console.log('空数组，无数据');
        return { fileName, count: 0, duplicates: 0 };
    }
    
    const firstItem = data[0];
    console.log('字段:', Object.keys(firstItem));
    
    const idCount = new Map();
    const nameCount = new Map();
    
    data.forEach(item => {
        const id = item.id || item._id;
        if (id) {
            idCount.set(id, (idCount.get(id) || 0) + 1);
        }
        const name = item.name || item.title || item.userName;
        if (name) {
            nameCount.set(name, (nameCount.get(name) || 0) + 1);
        }
    });
    
    const duplicateIds = [...idCount.entries()].filter(([_, count]) => count > 1);
    const duplicateNames = [...nameCount.entries()].filter(([_, count]) => count > 1);
    
    console.log(`重复ID数量: ${duplicateIds.length}`);
    console.log(`重复名称数量: ${duplicateNames.length}`);
    
    if (duplicateIds.length > 0) {
        console.log('前10个重复ID:');
        duplicateIds.slice(0, 10).forEach(([id, count]) => {
            console.log(`  ${id}: ${count}次`);
        });
    }
    
    if (duplicateNames.length > 0) {
        console.log('前10个重复名称:');
        duplicateNames.slice(0, 10).forEach(([name, count]) => {
            console.log(`  ${name}: ${count}次`);
        });
    }
    
    return {
        fileName,
        count: data.length,
        duplicateIds: duplicateIds.length,
        duplicateNames: duplicateNames.length
    };
}

console.log('=== 数据分析报告 ===\n');

const results = [];
for (const file of dataFiles) {
    try {
        results.push(analyzeData(file));
    } catch (e) {
        console.log(`\n=== ${file} ===`);
        console.log('解析失败:', e.message);
    }
}

console.log('\n=== 汇总 ===');
results.forEach(r => {
    console.log(`${r.fileName}: ${r.count}条`);
    if (r.duplicateIds) console.log(`  重复ID: ${r.duplicateIds}个`);
});