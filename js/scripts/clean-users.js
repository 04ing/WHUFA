const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const DATA_DIR = path.join(__dirname, 'data');
const SALT_ROUNDS = 10;

const VALID_USERS = [
    {
        name: '史坤锋',
        college: '遥感信息工程学院',
        grade: '22',
        originalPassword: 'skfing11040922'
    },
    {
        name: '杨艾睿',
        college: '经济与管理学院',
        grade: '2024',
        originalPassword: 'yang810810'
    },
    {
        name: '张栩岩',
        college: '物理科学与技术学院',
        grade: '2022级',
        originalPassword: 'zxy2003'
    },
    {
        name: '布鲁诺·费尔南德斯',
        college: '遥感信息工程学院',
        grade: '2025',
        originalPassword: 'bruno123'
    },
    {
        name: '荆常升',
        college: '文学院',
        grade: '2025',
        originalPassword: 'jcs123456'
    },
    {
        name: '邱弋添',
        college: '数学与统计学院',
        grade: '2023',
        originalPassword: 'qyt123456'
    }
];

function cleanUsers() {
    console.log('=== Cleaning user data ===\n');

    const usersPath = path.join(DATA_DIR, 'users.json');
    const rawData = fs.readFileSync(usersPath, 'utf8');
    const users = JSON.parse(rawData);

    console.log(`Total users before cleaning: ${users.length}`);

    const cleanedUsers = VALID_USERS.map((user, index) => {
        const hashedPassword = bcrypt.hashSync(user.originalPassword, SALT_ROUNDS);
        return {
            id: Date.now().toString() + index,
            name: user.name,
            password: hashedPassword,
            college: user.college,
            grade: user.grade,
            role: 'user',
            createdAt: new Date().toISOString()
        };
    });

    fs.writeFileSync(usersPath, JSON.stringify(cleanedUsers, null, 2), 'utf8');

    console.log(`\nCleaned users: ${cleanedUsers.length}`);
    cleanedUsers.forEach(user => {
        console.log(`- ${user.name} (${user.college}, ${user.grade})`);
    });

    console.log(`\nSaved cleaned users to ${usersPath}`);
    console.log('\nNote: All passwords have been encrypted with bcrypt.');
}

cleanUsers();