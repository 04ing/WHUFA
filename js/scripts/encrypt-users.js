const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const DATA_DIR = path.join(__dirname, 'data');
const SALT_ROUNDS = 10;

async function encryptPasswords() {
    console.log('=== Encrypting user passwords ===');
    
    const usersPath = path.join(DATA_DIR, 'users.json');
    
    try {
        const rawData = fs.readFileSync(usersPath, 'utf8');
        const users = JSON.parse(rawData);
        
        console.log(`Total users: ${users.length}`);
        
        let encryptedCount = 0;
        let alreadyEncrypted = 0;
        
        const encryptedUsers = users.map(user => {
            if (user.password && !user.password.startsWith('$2b$')) {
                const hashedPassword = bcrypt.hashSync(user.password, SALT_ROUNDS);
                encryptedCount++;
                return { ...user, password: hashedPassword };
            } else {
                alreadyEncrypted++;
                return user;
            }
        });
        
        fs.writeFileSync(usersPath, JSON.stringify(encryptedUsers, null, 2), 'utf8');
        
        console.log(`\nEncryption completed:`);
        console.log(`- Newly encrypted: ${encryptedCount}`);
        console.log(`- Already encrypted: ${alreadyEncrypted}`);
        console.log(`\nSaved encrypted users to ${usersPath}`);
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

encryptPasswords();