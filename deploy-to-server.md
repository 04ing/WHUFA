# 阿里云服务器部署指南

## 前置条件
- 你需要有阿里云服务器 47.103.29.77 的 SSH 访问权限

## 部署步骤

### 方法一：手动部署（推荐）

在你的本地电脑终端执行以下命令：

```bash
# 1. SSH 连接到服务器
ssh root@47.103.29.77

# 2. 进入项目目录
cd /root/WHUFA

# 3. 停止旧服务器进程
pkill -f "node server.js" || true

# 4. 拉取最新代码
git pull origin main

# 5. 安装依赖（如果有新增）
npm install

# 6. 启动服务器
npm start
```

### 方法二：一键部署脚本

在服务器上创建并运行以下脚本：

```bash
#!/bin/bash
set -e

echo "=== 开始部署 ==="

# 进入项目目录
cd /root/WHUFA || { echo "项目目录不存在"; exit 1; }

# 停止旧进程
echo "正在停止旧进程..."
pkill -f "node server.js" || echo "没有运行的进程"

# 拉取最新代码
echo "正在拉取代码..."
git pull origin main

# 安装依赖
echo "正在安装依赖..."
npm install

# 启动服务器
echo "正在启动服务器..."
npm start

echo "=== 部署完成 ==="
```

## 部署后验证

部署完成后，访问以下地址验证：

1. **用户列表 API（无密码）**
   ```
   http://47.103.29.77:3001/api/users
   ```
   - 应该看到 6 个用户
   - 不应该有 `password` 字段

2. **管理员登录**
   - 用户：史坤锋
   - 密码：skfing11040922

3. **批量接口安全**
   - 直接访问 PUT /api/users/batch/replace 应该返回 401 未授权

## 项目文件说明

### 安全改进已完成：

1. ✅ `/api/users/batch/replace` - 添加了 `authenticate` 和 `requireAdmin` 中间件
2. ✅ `upload-to-server.js` - 移除硬编码token，使用动态认证
3. ✅ 用户密码全部使用 bcrypt 加密
4. ✅ API 返回时隐藏密码字段
5. ✅ 史坤锋已设置为 admin 角色

### 有效用户列表：

1. 史坤锋 - admin - 遥感信息工程学院
2. 杨艾睿 - user - 经济与管理学院
3. 张栩岩 - user - 物理科学与技术学院
4. 布鲁诺·费尔南德斯 - user - 遥感信息工程学院
5. 荆常升 - user - 文学院
6. 邱弋添 - user - 数学与统计学院

## 常见问题

### Q: npm start 失败怎么办？
A: 检查端口 3001 是否被占用：
```bash
lsof -i :3001
# 或者
netstat -tlnp | grep 3001
```

### Q: 如何查看服务器日志？
A: 使用 pm2 管理进程并查看日志：
```bash
# 安装 pm2（如果没有）
npm install -g pm2

# 使用 pm2 启动
pm2 start server.js --name whufa

# 查看日志
pm2 logs whufa

# 查看状态
pm2 status
```

### Q: 如何上传用户数据？
A: 在本地运行：
```bash
node js/scripts/upload-to-server.js
```

## 紧急回滚

如果部署出现问题，可以回滚到上一个版本：

```bash
cd /root/WHUFA
git log --oneline -5  # 查看最近版本
git reset --hard <commit-id>  # 回滚到指定版本
npm start
```
