const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER_URL = 'http://47.103.29.77:3001';
const DATA_DIR = path.join(__dirname, 'data');
const FILE_TO_UPLOAD = 'matches.json';

// 函数：读取本地文件
function readLocalFile() {
    const filePath = path.join(DATA_DIR, FILE_TO_UPLOAD);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// 函数：上传数据到服务器
function uploadData(data) {
    return new Promise((resolve, reject) => {
        const url = `${SERVER_URL}/api/matches`;
        const postData = JSON.stringify(data);
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        console.log(`Uploading ${FILE_TO_UPLOAD} to server...`);
        
        const req = http.request(url, options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve(result);
                } catch (error) {
                    reject(new Error(`Error parsing response: ${error.message}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(new Error(`Error uploading data: ${error.message}`));
        });
        
        req.write(postData);
        req.end();
    });
}

// 主函数
async function main() {
    try {
        // 读取本地文件
        const data = readLocalFile();
        console.log(`Read ${data.length} items from ${FILE_TO_UPLOAD}`);
        
        // 上传数据到服务器
        const result = await uploadData(data);
        console.log('Upload successful!');
        console.log('Server response:', result);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// 运行主函数
main();