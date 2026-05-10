const fs = require('fs');
const path = require('path');
const http = require('http');

const DATA_DIR = path.join(__dirname, 'data');

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

async function fetchUsers() {
    const options = { method: 'GET', hostname: '47.103.29.77', port: 3001, path: '/api/users' };
    const result = await httpRequest(options);
    return result.data || [];
}

async function updateUser(userId, userData) {
    const postData = JSON.stringify(userData);
    const options = {
        method: 'PUT',
        hostname: '47.103.29.77',
        port: 3001,
        path: `/api/users/${userId}`,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    return httpRequest(options, postData);
}

async function main() {
    console.log('=== Setting admin role for 史坤锋 ===\n');
    
    try {
        const users = await fetchUsers();
        const adminUser = users.find(u => u.name === '史坤锋');
        
        if (!adminUser) {
            console.error('User 史坤锋 not found');
            process.exit(1);
        }
        
        console.log(`Found user: ${adminUser.name} (current role: ${adminUser.role})`);
        
        const result = await updateUser(adminUser.id, { ...adminUser, role: 'admin' });
        
        if (result.status === 200) {
            console.log('\n✓ Success! User role updated to admin');
        } else {
            console.error('\n✗ Failed:', result.data?.error || result.raw);
            process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();