const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER_URL = 'http://47.103.29.77:3001';
const DATA_DIR = path.join(__dirname, 'data');

const dataFiles = [
    { file: 'users.json', endpoint: '/api/users', method: 'POST' },
    { file: 'matches.json', endpoint: '/api/matches', method: 'POST' },
    { file: 'teams.json', endpoint: '/api/teams', method: 'POST' },
    { file: 'referees.json', endpoint: '/api/referees', method: 'POST' },
    { file: 'news.json', endpoint: '/api/news', method: 'POST' },
    { file: 'announcements.json', endpoint: '/api/announcements', method: 'POST' },
    { file: 'gallery.json', endpoint: '/api/gallery', method: 'POST' },
    { file: 'rules.json', endpoint: '/api/rules', method: 'POST' }
];

function uploadData(endpoint, method, data) {
    return new Promise((resolve, reject) => {
        const url = `${SERVER_URL}${endpoint}`;
        const postData = JSON.stringify(data);
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(url, options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: result });
                } catch (error) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(new Error(`Error uploading to ${endpoint}: ${error.message}`));
        });
        
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('Starting data upload to server...\n');
    
    for (const { file, endpoint } of dataFiles) {
        const filePath = path.join(DATA_DIR, file);
        
        if (!fs.existsSync(filePath)) {
            console.log(`[SKIP] ${file} - 文件不存在`);
            continue;
        }
        
        try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawData);
            
            if (!Array.isArray(data) || data.length === 0) {
                console.log(`[SKIP] ${file} - 数据为空`);
                continue;
            }
            
            console.log(`[UPLOAD] ${file} (${data.length} items)...`);
            
            for (let i = 0; i < data.length; i++) {
                try {
                    const result = await uploadData(endpoint, 'POST', data[i]);
                    if (result.status === 200 || result.status === 201) {
                        process.stdout.write('.');
                    } else {
                        process.stdout.write('x');
                    }
                } catch (error) {
                    process.stdout.write('x');
                }
            }
            
            console.log('\n[DONE]');
        } catch (error) {
            console.log(`[ERROR] ${file} - ${error.message}`);
        }
        
        console.log('');
    }
    
    console.log('\nData upload completed!');
}

main();