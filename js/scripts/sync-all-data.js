const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER_URL = 'http://47.103.29.77:3001';
const DATA_DIR = path.join(__dirname, '../../data');

const ADMIN_CREDENTIALS = {
    name: '史坤锋',
    password: 'skfing11040922'
};

const DATA_TYPES = [
    { endpoint: 'users', file: 'users.json', hasBatchReplace: true },
    { endpoint: 'matches', file: 'matches.json', hasBatchReplace: false },
    { endpoint: 'teams', file: 'teams.json', hasBatchReplace: false },
    { endpoint: 'players', file: 'players.json', hasBatchReplace: false },
    { endpoint: 'referees', file: 'referees.json', hasBatchReplace: false },
    { endpoint: 'news', file: 'news.json', hasBatchReplace: false },
    { endpoint: 'announcements', file: 'announcements.json', hasBatchReplace: false },
    { endpoint: 'feedback', file: 'feedback.json', hasBatchReplace: false }
];

function httpRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: result });
                } catch {
                    resolve({ status: res.statusCode, raw: responseData });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function getAuthToken() {
    const postData = JSON.stringify(ADMIN_CREDENTIALS);
    const options = {
        method: 'POST',
        hostname: '47.103.29.77',
        port: 3001,
        path: '/api/login',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    const result = await httpRequest(options, postData);
    if (result.status !== 200 || !result.data?.token) {
        throw new Error('登录失败: ' + (result.data?.error || result.raw));
    }
    
    console.log('✓ 登录成功');
    return result.data.token;
}

async function getAllItems(token, endpoint) {
    const options = {
        method: 'GET',
        hostname: '47.103.29.77',
        port: 3001,
        path: `/api/${endpoint}`,
        headers: { 'Authorization': `Bearer ${token}` }
    };
    const result = await httpRequest(options);
    return result.data || [];
}

async function deleteItem(token, endpoint, id) {
    const options = {
        method: 'DELETE',
        hostname: '47.103.29.77',
        port: 3001,
        path: `/api/${endpoint}/${id}`,
        headers: { 'Authorization': `Bearer ${token}` }
    };
    return httpRequest(options);
}

async function createItem(token, endpoint, item) {
    const postData = JSON.stringify(item);
    const options = {
        method: 'POST',
        hostname: '47.103.29.77',
        port: 3001,
        path: `/api/${endpoint}`,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': `Bearer ${token}`
        }
    };
    return httpRequest(options, postData);
}

async function batchReplaceUsers(token, users) {
    const postData = JSON.stringify(users);
    const options = {
        method: 'PUT',
        hostname: '47.103.29.77',
        port: 3001,
        path: '/api/users/batch/replace',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': `Bearer ${token}`
        }
    };
    return httpRequest(options, postData);
}

async function syncDataType(token, dataType) {
    const { endpoint, file, hasBatchReplace } = dataType;
    const filePath = path.join(DATA_DIR, file);
    const localData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`\n=== 同步 ${endpoint} ===`);
    console.log(`本地数据: ${localData.length} 条`);
    
    const serverData = await getAllItems(token, endpoint);
    console.log(`服务器数据: ${serverData.length} 条`);
    
    if (hasBatchReplace && endpoint === 'users') {
        console.log('使用批量替换...');
        const result = await batchReplaceUsers(token, localData);
        if (result.status === 200) {
            console.log(`✓ 批量替换成功: ${result.data.users.length} 条`);
        } else {
            console.log(`✗ 批量替换失败: ${result.data?.error || result.raw}`);
        }
        return;
    }
    
    console.log('删除服务器现有数据...');
    let deleted = 0;
    for (const item of serverData) {
        await deleteItem(token, endpoint, item.id);
        deleted++;
        if (deleted % 50 === 0) console.log(`  已删除 ${deleted}/${serverData.length}...`);
    }
    console.log(`✓ 删除完成: ${deleted} 条`);
    
    console.log('创建新数据...');
    let created = 0;
    for (const item of localData) {
        const { id, createdAt, updatedAt, ...rest } = item;
        const result = await createItem(token, endpoint, rest);
        if (result.status === 200 || result.status === 201) {
            created++;
        }
        if (created % 20 === 0) console.log(`  已创建 ${created}/${localData.length}...`);
    }
    console.log(`✓ 创建完成: ${created} 条`);
}

async function main() {
    try {
        console.log('=== 开始同步数据到服务器 ===\n');
        
        const token = await getAuthToken();
        
        for (const dataType of DATA_TYPES) {
            try {
                await syncDataType(token, dataType);
            } catch (e) {
                console.log(`✗ 同步 ${dataType.endpoint} 失败: ${e.message}`);
            }
        }
        
        console.log('\n=== 同步完成 ===');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();