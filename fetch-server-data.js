const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SERVER_URL = 'http://47.103.29.77:3001';
const DATA_DIR = path.join(__dirname, 'data');

// 数据类型列表
const dataTypes = [
    'matches',
    'teams',
    'players',
    'referees',
    'users',
    'news',
    'announcements',
    'gallery',
    'rules',
    'comments',
    'discussions',
    'polls',
    'feedback'
];

// 函数：获取数据
function fetchData(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `${SERVER_URL}/api/${endpoint}`;
        const protocol = url.startsWith('https') ? https : http;
        
        console.log(`Fetching ${endpoint} data...`);
        
        protocol.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error(`Error parsing ${endpoint} data: ${error.message}`));
                }
            });
        }).on('error', (error) => {
            reject(new Error(`Error fetching ${endpoint} data: ${error.message}`));
        });
    });
}

// 函数：保存数据到文件
function saveData(dataType, data) {
    // 检查是否是错误响应
    if (data && typeof data === 'object' && data.status === 'error') {
        console.error(`Error response for ${dataType}: ${data.message}`);
        return;
    }
    
    // 检查数据是否有效
    if (!Array.isArray(data)) {
        console.error(`Invalid data format for ${dataType}: expected array`);
        return;
    }
    
    const filePath = path.join(DATA_DIR, `${dataType}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved ${dataType}.json with ${data.length} items`);
}

// 主函数
async function main() {
    console.log('Starting to fetch server data...');
    
    for (const dataType of dataTypes) {
        try {
            const data = await fetchData(dataType);
            saveData(dataType, data);
        } catch (error) {
            console.error(`Failed to fetch ${dataType}: ${error.message}`);
        }
    }
    
    console.log('\nData fetching completed!');
    console.log('All server data has been saved to local files.');
}

// 运行主函数
main();