# WHUFA - 武汉大学足球协会（学生）网站

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-blue)](https://04ing.github.io/WHUFA/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-orange)](https://expressjs.com/)

## 项目简介

WHUFA 是武汉大学足球协会（学生）的官方网站，提供协会信息展示、赛事管理、赛果查询、用户认证等功能。

## 功能特性

### 核心功能
- **赛事管理系统**：支持比赛的增删改查，包含比分、事件（进球/点球/红牌等）、裁判员信息
- **用户认证系统**：完整的登录/注册功能，基于 JWT 的身份认证
- **权限管理**：管理员权限控制，保护敏感操作接口
- **数据存储**：使用 JSON 文件存储所有数据，便于部署和备份
- **统计分析**：射手榜、裁判参与场次统计等数据可视化

### 安全特性
- **身份认证**：所有写操作接口需要 JWT token
- **管理员授权**：敏感接口需要管理员权限
- **输入验证**：使用 express-validator 进行数据验证
- **注入检测**：自动检测并阻止 XSS、SQL 注入、命令注入攻击
- **速率限制**：防止暴力破解和批量注入攻击

### 用户体验
- **响应式设计**：支持桌面端和移动端访问
- **导航栏组件**：统一的导航栏，支持二级下拉菜单
- **数据同步**：提供脚本支持本地与服务器数据同步

## 技术栈

| 分类 | 技术 |
|------|------|
| 前端 | HTML5, CSS3, JavaScript |
| 后端 | Node.js, Express 4.x |
| 认证 | JWT (jsonwebtoken) |
| 密码加密 | bcrypt |
| 数据验证 | express-validator |
| 安全防护 | express-rate-limit, 自定义注入检测 |
| 数据存储 | JSON 文件 |

## 项目结构

```
WHUFA/
├── .github/                          # GitHub 配置
│   └── workflows/                    # GitHub Actions 工作流
│       ├── gh-pages.yml              # GitHub Pages 部署
│       └── sync-railway-data.yml     # 数据同步
├── components/                       # 前端组件
│   └── navbar.html                   # 导航栏组件
├── css/                              # 样式文件
│   ├── base.css                      # 基础样式
│   ├── components.css                # 组件样式
│   ├── layout.css                    # 布局样式
│   ├── pages.css                     # 页面样式
│   └── responsive.css                # 响应式样式
├── data/                             # 数据文件（JSON）
│   ├── matches.json                  # 比赛数据
│   ├── teams.json                    # 球队数据
│   ├── players.json                  # 球员数据
│   ├── referees.json                 # 裁判数据
│   ├── users.json                    # 用户数据
│   ├── news.json                     # 新闻数据
│   ├── announcements.json            # 公告数据
│   ├── gallery.json                  # 图库数据
│   ├── rules.json                    # 规则数据
│   ├── comments.json                 # 评论数据
│   ├── discussions.json              # 讨论数据
│   ├── polls.json                    # 投票数据
│   └── feedback.json                 # 反馈数据
├── img/                              # 图片资源
├── js/                               # JavaScript 文件
│   ├── load-navbar.js                # 导航栏加载脚本
│   └── scripts/                      # 数据同步脚本
│       ├── fetch-server-data.js      # 从服务器拉取数据
│       ├── sync-all-data.js          # 同步数据到服务器
│       ├── upload-all-data.js        # 上传所有数据
│       └── ...                       # 其他脚本
├── json/                             # 赛事数据（静态）
├── middleware/                       # 中间件
│   ├── auth.js                       # 身份认证中间件
│   ├── security.js                   # 安全中间件（速率限制等）
│   └── validation.js                 # 输入验证中间件
├── models/                           # 数据模型
│   ├── User.js                       # 用户模型
│   ├── Event.js                      # 赛事模型
│   ├── Content.js                    # 内容模型
│   └── Interaction.js                # 交互模型
├── pages/                            # 页面文件
│   ├── index.html                    # 首页
│   ├── match-results.html            # 赛果更新
│   ├── match-management.html         # 赛事管理
│   ├── register.html                 # 登录/注册
│   ├── profile.html                  # 个人中心
│   ├── about.html                    # 社团介绍
│   ├── events.html                   # 赛事开展
│   ├── departments.html              # 部门介绍
│   ├── news.html                     # 新闻公告
│   ├── contact.html                  # 联系我们
│   ├── referee.html                  # 裁判员页面
│   ├── competition.html              # 竞赛规则
│   ├── organization.html             # 组织架构
│   ├── revival-cup.html              # 振兴杯
│   ├── Super2024.html                # 2024超级组
│   ├── League2024.html               # 2024甲级组
│   ├── Women2024.html                # 2024女子组
│   ├── freshmen-cup.html             # 新生杯
│   ├── freshmen2024search.html       # 新生杯查询
│   ├── fa-cup.html                   # 足协杯
│   └── futsal.html                   # 五人制
├── routes/                           # 路由
│   └── api.js                        # API 路由
├── utils/                            # 工具函数
│   └── sanitize.js                   # 输入清理工具
├── server.js                         # 服务器入口
├── package.json                      # 项目配置
├── deploy.sh                         # 部署脚本
├── server-fix.sh                     # 服务器修复脚本
└── README.md                         # 项目文档
```

## API 接口

### 用户相关
| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/users | 获取所有用户 | 否 |
| POST | /api/users | 创建用户 | 否 |
| PUT | /api/users/:id | 更新用户 | 是 |
| DELETE | /api/users/:id | 删除用户 | 管理员 |
| PUT | /api/users/batch/replace | 批量替换用户 | 管理员 |
| POST | /api/login | 用户登录 | 否 |

### 赛事相关
| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/matches | 获取所有比赛 | 否 |
| GET | /api/matches/:id | 获取单场比赛 | 否 |
| POST | /api/matches | 创建比赛 | 管理员 |
| PUT | /api/matches/:id | 更新比赛 | 管理员 |
| DELETE | /api/matches/:id | 删除比赛 | 管理员 |

### 其他接口
- `/api/teams` - 球队管理
- `/api/players` - 球员管理
- `/api/referees` - 裁判管理
- `/api/news` - 新闻管理
- `/api/announcements` - 公告管理
- `/api/gallery` - 图库管理
- `/api/rules` - 规则管理
- `/api/comments` - 评论管理
- `/api/discussions` - 讨论管理
- `/api/polls` - 投票管理
- `/api/feedback` - 反馈管理

## 安装与运行

### 前置条件
- Node.js 18.0 或更高版本
- npm 6.0 或更高版本

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/04ing/WHUFA.git
   cd WHUFA
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动服务器**
   ```bash
   npm start
   ```

4. **访问网站**
   - 打开浏览器，访问 http://localhost:3001

### 开发模式
```bash
npm run dev
```

## 部署说明

### 阿里云服务器部署

服务器地址：http://47.103.29.77:3001

**部署步骤：**
```bash
# 登录服务器
ssh root@47.103.29.77

# 进入项目目录
cd /root/WHUFA

# 停止旧进程
pkill -f "node server.js"

# 拉取最新代码（如果服务器可以访问GitHub）
git pull origin main

# 或使用SCP上传文件
# scp local_file root@47.103.29.77:/root/WHUFA/

# 安装依赖
npm install

# 启动服务器（后台运行）
nohup npm start > /root/whufa-server.log 2>&1 &
```

### GitHub Pages 部署

本项目使用 GitHub Pages 进行静态前端部署。配置文件位于 `.github/workflows/gh-pages.yml`。

**注意**：GitHub Pages 仅支持静态文件，API 功能需要后端服务器支持。

## 数据同步

### 从服务器拉取数据到本地
```bash
node js/scripts/fetch-server-data.js
```

### 同步本地数据到服务器
```bash
node js/scripts/sync-all-data.js
```

### 上传所有数据到服务器
```bash
node js/scripts/upload-all-data.js
```

## 安全说明

### 身份认证
- 所有写操作接口（POST/PUT/DELETE）需要 `Authorization: Bearer <token>` 头
- 用户登录后获取 token，token 有效期为 1 小时
- 管理员权限通过 `requireAdmin` 中间件验证

### 安全措施
1. **速率限制**：登录接口每 15 分钟最多尝试 5 次，API 接口每分钟最多 100 次请求
2. **输入验证**：所有输入通过 express-validator 验证
3. **注入检测**：自动检测 XSS、SQL 注入、命令注入等攻击模式
4. **密码加密**：用户密码使用 bcrypt 加密存储
5. **安全响应头**：启用 XSS 防护、CSP、HSTS 等安全头

## 使用说明

### 赛事管理
1. 登录后点击导航栏的"赛事管理"进入管理页面
2. 使用表单添加新比赛或修改现有比赛
3. 通过"批量修改事件"按钮管理比赛事件（进球、点球、红牌等）
4. 支持删除比赛

### 登录与注册
1. 点击导航栏的"登录/注册"按钮
2. 注册时填写姓名、学院、年级和密码
3. 登录后显示用户信息和"赛事管理"按钮

### 数据备份
建议定期备份 `data/` 目录下的所有 JSON 文件。

## 数据结构

### 比赛数据 (matches.json)
```json
{
  "id": "match_1234567890",
  "homeTeam": "主队名称",
  "awayTeam": "客队名称",
  "homeScore": 2,
  "awayScore": 1,
  "date": "2026年2月18日",
  "time": "14:30",
  "type": "振兴杯",
  "referee": "主裁判姓名",
  "assistantReferee1": "第一助理",
  "assistantReferee2": "第二助理",
  "fourthOfficial": "第四官员",
  "status": "completed",
  "homeEvents": [
    { "type": "goal", "player": "球员姓名", "number": "10", "minute": "30" }
  ],
  "awayEvents": [],
  "createdAt": "2026-02-18T06:30:00.000Z"
}
```

### 用户数据 (users.json)
```json
{
  "id": "user_1234567890",
  "name": "用户名",
  "college": "学院",
  "grade": "年级",
  "password": "$2b$10$...",
  "role": "admin",
  "createdAt": "2026-02-18T06:30:00.000Z"
}
```

## 管理员账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| 史坤锋 | skfing11040922 | 管理员 |

## 常见问题

### Q: 登录后无法访问赛事管理页面？
A: 请确保登录用户具有管理员权限（role: "admin"）。

### Q: GitHub Pages 上无法使用 API 功能？
A: GitHub Pages 仅支持静态文件。如需使用完整功能，请部署到支持 Node.js 的平台（如阿里云、Railway、Render 等）。

### Q: 如何同步服务器数据到本地？
A: 运行 `node js/scripts/fetch-server-data.js`。

### Q: 如何清理被注入攻击污染的数据？
A: 运行 `node js/scripts/clean-all-data.js`。

## 更新记录

- 2026-07-19: 重写 README，完善项目文档，同步服务器数据
- 2026-06-26: 修复赛果更新页面增删改操作无法保存的问题
- 2026-06-26: 优化导航栏，重构赛事查询下拉菜单
- 2026-06-26: 取消公共页面强制登录验证
- 2026-06-25: 安全加固，添加身份认证、输入验证、注入检测和速率限制
- 2026-03-15: 初始版本发布

## 许可证

本项目仅供武汉大学足球协会内部使用，未经许可不得用于其他用途。
