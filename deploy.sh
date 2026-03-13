#!/bin/bash

# 停止之前的进程
pkill -f "node server.js" || true

# 解压文件
unzip -o WHUFA.zip -d /root/WHUFA

# 进入目录
cd /root/WHUFA

# 安装依赖
npm install

# 启动服务器
npm start