const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER_URL = 'http://47.103.29.77:3001';
const DATA_DIR = path.join(__dirname, 'data');
const FILE_TO_UPLOAD = 'users.json';

// 默认管理员账号（需要确保服务器上有这个用户）
const ADMIN_CREDENTIALS = {
    name: '史坤锋',
    password: 'skfing11040922'
};

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
        throw new Error('Failed to get authentication token. Please check admin credentials.');
    }
    
    console.log('✓ Authentication successful');
    return result.data.token;
}

async function uploadData(token, users) {
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
    
    console.log('Uploading user data...');
    const result = await httpRequest(options, postData);
    return result;
}

async function main() {
    try {
        console.log('=== Uploading users to server ===\n');
        
        const usersPath = path.join(DATA_DIR, FILE_TO_UPLOAD);
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        
        console.log(`Read ${users.length} users from local file`);
        
        const token = await getAuthToken();
        const result = await uploadData(token, users);
        
        if (result.status === 200) {
            console.log('\n✓ Upload successful!');
            console.log(`  - ${result.data.users.length} users processed`);
        } else {
            console.error('\n✗ Upload failed:', result.data?.error || result.raw);
            process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();