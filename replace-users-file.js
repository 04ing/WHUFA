const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER_URL = 'http://47.103.29.77:3001';
const DATA_DIR = path.join(__dirname, 'data');

function uploadFileDirectly(endpoint, fileContent) {
    return new Promise((resolve, reject) => {
        const url = `${SERVER_URL}${endpoint}`;
        const postData = JSON.stringify(fileContent);
        
        const options = {
            method: 'PUT',
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
            reject(new Error(`Error: ${error.message}`));
        });
        
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('Directly uploading users.json file...');
    
    const usersPath = path.join(DATA_DIR, 'users.json');
    
    try {
        const rawData = fs.readFileSync(usersPath, 'utf8');
        const users = JSON.parse(rawData);
        
        console.log(`Read ${users.length} users (passwords encrypted)`);
        
        console.log('Uploading entire file...');
        
        // 由于没有专门的PUT所有用户的接口，我们需要先删除再创建
        // 但先让我们测试一下当前的接口
        
        console.log('First, check if there is a bulk update endpoint...');
        
        // 作为替代方案，我们直接用我们加密后的数据来覆盖
        console.log('Note: Server needs to have updated code with password encryption first!');
        console.log('Please deploy the new code to server and restart it first.');
        console.log('Then we can sync the users properly.');
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();