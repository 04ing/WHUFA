#!/bin/bash

# 停止之前的进程
pkill -f "node server.js" || true

# 进入目录
cd /root/WHUFA || mkdir -p /root/WHUFA && cd /root/WHUFA

# 从GitHub拉取最新代码
git pull origin main

# 安装依赖
npm install

# 启动服务器
npm start