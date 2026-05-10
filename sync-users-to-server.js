const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER_URL = 'http://47.103.29.77:3001';
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

async function deleteUser(userId) {
    const options = { method: 'DELETE', hostname: '47.103.29.77', port: 3001, path: `/api/users/${userId}` };
    return httpRequest(options);
}

async function createUser(user) {
    const postData = JSON.stringify(user);
    const options = { 
        method: 'POST', 
        hostname: '47.103.29.77', 
        port: 3001, 
        path: '/api/users',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    return httpRequest(options, postData);
}

async function main() {
    console.log('=== Syncing encrypted users to server ===');
    
    const usersPath = path.join(DATA_DIR, 'users.json');
    
    try {
        const localRawData = fs.readFileSync(usersPath, 'utf8');
        const localUsers = JSON.parse(localRawData);
        
        console.log(`\nStep 1: Fetching existing users from server...`);
        const serverUsers = await fetchUsers();
        console.log(`Found ${serverUsers.length} users on server`);
        
        console.log(`\nStep 2: Deleting existing users from server...`);
        let deleteSuccess = 0;
        for (const user of serverUsers) {
            try {
                await deleteUser(user.id);
                deleteSuccess++;
            } catch {
                console.log(`Failed to delete user: ${user.name}`);
            }
        }
        console.log(`Deleted ${deleteSuccess} users`);
        
        console.log(`\nStep 3: Creating encrypted users on server...`);
        let createSuccess = 0;
        let createFail = 0;
        
        for (let i = 0; i < localUsers.length; i++) {
            const user = localUsers[i];
            process.stdout.write(`\rCreating user ${i + 1}/${localUsers.length}: ${user.name}`);
            
            try {
                const result = await createUser(user);
                if (result.status === 201) {
                    createSuccess++;
                } else {
                    createFail++;
                }
            } catch {
                createFail++;
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        console.log(`\n\n=== Sync completed ===`);
        console.log(`Deleted: ${deleteSuccess}`);
        console.log(`Created: ${createSuccess}`);
        console.log(`Failed: ${createFail}`);
        
        console.log(`\nVerifying passwords are encrypted...`);
        const updatedUsers = await fetchUsers();
        const encryptedCount = updatedUsers.filter(u => u.password?.startsWith('$2b$')).length;
        console.log(`Encrypted passwords on server: ${encryptedCount}/${updatedUsers.length}`);
        
    } catch (error) {
        console.error('\nError:', error.message);
        process.exit(1);
    }
}

main();