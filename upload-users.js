const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER_URL = 'http://47.103.29.77:3001';
const DATA_DIR = path.join(__dirname, 'data');

function uploadFile(filePath, endpoint) {
    return new Promise((resolve, reject) => {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const postData = rawData;
        
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const url = `${SERVER_URL}${endpoint}`;
        console.log(`Uploading to ${url}...`);
        
        const req = http.request(url, options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                console.log(`Status code: ${res.statusCode}`);
                try {
                    const result = JSON.parse(responseData);
                    resolve(result);
                } catch {
                    resolve({ status: res.statusCode, raw: responseData });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('=== Uploading encrypted users to server ===');
    
    const usersPath = path.join(DATA_DIR, 'users.json');
    
    try {
        const rawData = fs.readFileSync(usersPath, 'utf8');
        const users = JSON.parse(rawData);
        
        console.log(`Local users found: ${users.length}`);
        console.log('Checking password encryption status...');
        
        let encryptedCount = 0;
        users.forEach(user => {
            if (user.password && user.password.startsWith('$2b$')) {
                encryptedCount++;
            }
        });
        
        console.log(`Encrypted passwords: ${encryptedCount}/${users.length}`);
        
        if (encryptedCount === users.length) {
            console.log('\nAll passwords are encrypted, proceeding with upload...');
            
            const result = await uploadFile(usersPath, '/api/users/batch/replace');
            console.log('\nUpload result:', result);
            
        } else {
            console.error('Error: Not all passwords are encrypted!');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();