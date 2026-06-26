const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

function isSuspicious(value) {
    if (typeof value !== 'string') return true;
    if (!value || value.trim().length === 0) return true;
    
    const patterns = [
        /<script/i,
        /<\?php/i,
        /javascript:/i,
        /onload\s*=/i,
        /onerror\s*=/i,
        /eval\s*\(/i,
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
        /extractvalue/i,
        /sleep\s*\(/i,
        /waitfor\s+delay/i,
        /DBMS_PIPE/i,
        /pg_sleep/i,
        /and\s+1=1/i,
        /or\s+1=1/i,
        /--\s*$/,
        /@type/,
        /jdbc:mysql/i,
        /JdbcRowSet/i,
        /BasicDataSource/i,
        /LoadBalancedMySQL/i,
        /UnpooledDataSource/i,
        /autoDeserialize/i,
        /statementInterceptors/i,
        /CommonsCollections/i,
        /yso_/i,
        /calc/i
    ];
    
    const lower = value.toLowerCase();
    return patterns.some(p => p.test(value));
}

function isTestName(name) {
    if (!name || typeof name !== 'string') return true;
    const lower = name.trim().toLowerCase();
    
    const testPatterns = [
        /^test\d*$/i,
        /^admin\d*$/i,
        /^user\d*$/i,
        /^demo\d*$/i,
        /^e$/i,
        /^a$/i,
        /^123\d*$/,
        /^1$/,
        /^dfb/i,
        /^xxx$/i,
        /^abc$/i,
        /test22/
    ];
    
    return testPatterns.some(p => p.test(lower));
}

function isValidChineseName(name) {
    if (!name || typeof name !== 'string') return false;
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 10) return false;
    return /^[\u4e00-\u9fa5·]+$/.test(trimmed);
}

function cleanUsers() {
    const filePath = path.join(DATA_DIR, 'users.json');
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const validUsers = users.filter(user => {
        if (!user.name || !user.password) return false;
        if (typeof user.name !== 'string') return false;
        if (isSuspicious(user.name)) return false;
        if (isSuspicious(user.college)) return false;
        if (isSuspicious(user.grade)) return false;
        if (isTestName(user.name)) return false;
        
        if (!isValidChineseName(user.name)) return false;
        
        return true;
    });
    
    console.log(`用户: ${users.length} -> ${validUsers.length} (移除 ${users.length - validUsers.length})`);
    fs.writeFileSync(filePath, JSON.stringify(validUsers, null, 2));
    return validUsers;
}

function cleanTeams() {
    const filePath = path.join(DATA_DIR, 'teams.json');
    const teams = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const validTeams = teams.filter(team => {
        if (!team.name || typeof team.name !== 'string') return false;
        if (isSuspicious(team.name)) return false;
        if (isSuspicious(team.coach)) return false;
        if (isSuspicious(team.college)) return false;
        if (isTestName(team.name)) return false;
        return true;
    });
    
    console.log(`球队: ${teams.length} -> ${validTeams.length} (移除 ${teams.length - validTeams.length})`);
    fs.writeFileSync(filePath, JSON.stringify(validTeams, null, 2));
    return validTeams;
}

function cleanPlayers() {
    const filePath = path.join(DATA_DIR, 'players.json');
    const players = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const validPlayers = players.filter(player => {
        if (!player.name || typeof player.name !== 'string') return false;
        if (isSuspicious(player.name)) return false;
        if (isSuspicious(player.studentId)) return false;
        if (isTestName(player.name)) return false;
        if (!isValidChineseName(player.name)) return false;
        return true;
    });
    
    console.log(`球员: ${players.length} -> ${validPlayers.length} (移除 ${players.length - validPlayers.length})`);
    fs.writeFileSync(filePath, JSON.stringify(validPlayers, null, 2));
    return validPlayers;
}

function cleanReferees() {
    const filePath = path.join(DATA_DIR, 'referees.json');
    const referees = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const validReferees = referees.filter(ref => {
        if (!ref.name || typeof ref.name !== 'string') return false;
        if (isSuspicious(ref.name)) return false;
        if (isSuspicious(ref.college)) return false;
        if (isTestName(ref.name)) return false;
        if (!isValidChineseName(ref.name)) return false;
        return true;
    });
    
    const seen = new Set();
    const deduped = validReferees.filter(ref => {
        const key = ref.name + (ref.college || '');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    
    console.log(`裁判: ${referees.length} -> ${deduped.length} (移除 ${referees.length - deduped.length})`);
    fs.writeFileSync(filePath, JSON.stringify(deduped, null, 2));
    return deduped;
}

function cleanMatches() {
    const filePath = path.join(DATA_DIR, 'matches.json');
    const matches = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const validMatches = matches.filter(match => {
        if (!match.homeTeam || !match.awayTeam) return false;
        if (typeof match.homeTeam !== 'string' || typeof match.awayTeam !== 'string') return false;
        if (isSuspicious(match.homeTeam)) return false;
        if (isSuspicious(match.awayTeam)) return false;
        if (isSuspicious(match.referee)) return false;
        if (isTestName(match.homeTeam) || isTestName(match.awayTeam)) return false;
        return true;
    });
    
    console.log(`比赛: ${matches.length} -> ${validMatches.length} (移除 ${matches.length - validMatches.length})`);
    fs.writeFileSync(filePath, JSON.stringify(validMatches, null, 2));
    return validMatches;
}

function cleanNews() {
    const filePath = path.join(DATA_DIR, 'news.json');
    const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const valid = items.filter(item => {
        if (!item.title || typeof item.title !== 'string') return false;
        if (isSuspicious(item.title)) return false;
        if (isSuspicious(item.content)) return false;
        if (isTestName(item.title)) return false;
        if (item.title.length < 5) return false;
        return true;
    });
    
    console.log(`新闻: ${items.length} -> ${valid.length} (移除 ${items.length - valid.length})`);
    fs.writeFileSync(filePath, JSON.stringify(valid, null, 2));
    return valid;
}

function cleanAnnouncements() {
    const filePath = path.join(DATA_DIR, 'announcements.json');
    const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const valid = items.filter(item => {
        if (!item.title || typeof item.title !== 'string') return false;
        if (isSuspicious(item.title)) return false;
        if (isSuspicious(item.content)) return false;
        if (isTestName(item.title)) return false;
        if (item.title.length < 5) return false;
        return true;
    });
    
    console.log(`公告: ${items.length} -> ${valid.length} (移除 ${items.length - valid.length})`);
    fs.writeFileSync(filePath, JSON.stringify(valid, null, 2));
    return valid;
}

function cleanFeedback() {
    const filePath = path.join(DATA_DIR, 'feedback.json');
    const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const valid = items.filter(item => {
        if (!item.content || typeof item.content !== 'string') return false;
        if (isSuspicious(item.content)) return false;
        if (isSuspicious(item.userName)) return false;
        if (isTestName(item.userName)) return false;
        if (item.content.length < 5) return false;
        return true;
    });
    
    console.log(`反馈: ${items.length} -> ${valid.length} (移除 ${items.length - valid.length})`);
    fs.writeFileSync(filePath, JSON.stringify(valid, null, 2));
    return valid;
}

console.log('=== 深度数据清理 ===\n');

const users = cleanUsers();
const teams = cleanTeams();
const players = cleanPlayers();
const referees = cleanReferees();
const matches = cleanMatches();
const news = cleanNews();
const announcements = cleanAnnouncements();
const feedback = cleanFeedback();

console.log('\n=== 清理完成 ===');
console.log(`\n有效数据统计:`);
console.log(`  用户: ${users.length}`);
console.log(`  球队: ${teams.length}`);
console.log(`  球员: ${players.length}`);
console.log(`  裁判: ${referees.length}`);
console.log(`  比赛: ${matches.length}`);
console.log(`  新闻: ${news.length}`);
console.log(`  公告: ${announcements.length}`);
console.log(`  反馈: ${feedback.length}`);

console.log('\n有效用户列表:');
users.forEach(u => console.log(`  - ${u.name} (${u.college})`));