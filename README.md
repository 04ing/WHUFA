# WHUFA - 武汉大学足球协会（学生）网站

## 项目简介

WHUFA是武汉大学足球协会（学生）的官方网站，提供协会相关信息、比赛结果管理、赛事信息查询等功能。

## 功能特性

- **导航栏标准化**：统一的导航栏设计，提供便捷的页面访问
- **比赛结果管理**：支持添加、修改、删除比赛数据，包括比分、事件、裁判员信息等
- **裁判员管理**：支持裁判员、第一助理裁判员、第二助理裁判员和第四官员信息的录入和展示
- **用户认证**：完整的登录/注册功能，使用姓名、学院、年级和密码进行认证
- **联系表单**：支持用户提交留言和联系方式，数据自动保存到JSON文件
- **数据存储**：使用JSON文件存储比赛数据、用户信息和联系表单数据
- **Node.js服务器**：使用Express框架提供API接口，实现数据的实时更新和管理
- **下拉菜单功能**：自定义的下拉菜单实现，提供良好的用户体验

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **后端**：Node.js, Express
- **数据存储**：JSON文件
- **部署**：Vercel（支持Node.js服务器）

## 项目结构

```
WHUFA/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions部署配置
├── pages/
│   ├── index.html          # 首页
│   ├── match-results.html  # 比赛结果管理页面
│   ├── futsal.html         # 五人制足球页面
│   ├── fa-cup.html         # 足协杯页面
│   ├── freshmen-cup.html   # 新生杯页面
│   ├── organization.html   # 组织架构页面
│   ├── referee.html        # 裁判员页面
│   ├── revival-cup.html    # 振兴杯页面
│   ├── Super2024.html      # 超级杯2024页面
│   ├── Women2024.html      # 女足2024页面
│   ├── login.html          # 登录页面
│   ├── register.html       # 注册页面
│   └── contact.html        # 联系我们页面
├── css/
│   ├── base.css            # 基础样式
│   ├── components.css      # 组件样式
│   ├── layout.css          # 布局样式
│   ├── pages.css           # 页面样式
│   └── responsive.css      # 响应式样式
├── data/
│   ├── matches.json        # 比赛数据
│   ├── users.json          # 用户数据
│   └── contacts.json       # 联系表单数据
├── server.js               # Node.js服务器
├── package.json            # 项目配置和依赖
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明
```

## 安装与运行

### 前置条件

- Node.js 18.0或更高版本
- npm 6.0或更高版本

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
   打开浏览器，访问 http://localhost:3000

## 部署到Vercel

### 步骤

1. **注册Vercel账号**
   - 访问 https://vercel.com/ 并使用GitHub账号注册

2. **创建Vercel项目**
   - 登录Vercel后，点击"New Project"
   - 选择从GitHub导入
   - 找到并选择 `04ing/WHUFA` 仓库
   - 点击"Import"

3. **配置项目**
   - 框架预设：选择 "Other"
   - 根目录：保持默认
   - 构建命令：保持默认（或设置为 `npm run build`）
   - 输出目录：保持默认
   - 点击"Deploy"

4. **获取部署URL**
   - 部署完成后，Vercel会提供一个URL，例如 `whufa.vercel.app`
   - 您可以通过这个URL访问您的应用

## 使用说明

### 比赛结果管理
1. 在首页点击"比赛结果"进入管理页面
2. 点击"添加比赛"按钮创建新比赛
3. 填写比赛信息，包括主队、客队、比分等
4. 点击"添加事件"按钮添加比赛事件（进球、黄牌、红牌等）
5. 点击"保存比赛"按钮保存比赛数据
6. 已保存的比赛会显示在页面下方，可点击"修改"或"删除"进行操作

### 登录与注册
1. 点击导航栏右上角的"登录"或"注册"按钮
2. 注册时填写姓名、学院、年级和密码
3. 登录后右上角会显示用户姓名，并提供"登出"选项

### 裁判员信息管理
1. 在添加或修改比赛时，可填写裁判员、第一助理裁判员、第二助理裁判员和第四官员信息
2. 这些信息会保存在JSON文件中，并在比赛卡片中显示

### 联系表单
1. 在"联系我们"页面填写联系表单
2. 点击"提交"按钮后，数据会自动保存到 `data/contacts.json` 文件中
3. 提交成功后会显示提示信息

## 数据结构

### 比赛数据 (matches.json)

```json
[
  {
    "id": "唯一标识符",
    "homeTeam": "主队名称",
    "awayTeam": "客队名称",
    "homeScore": 0,
    "awayScore": 0,
    "date": "比赛日期",
    "time": "比赛时间",
    "venue": "比赛场地",
    "referee": "主裁判员",
    "assistantReferee1": "第一助理裁判员",
    "assistantReferee2": "第二助理裁判员",
    "fourthOfficial": "第四官员",
    "events": [
      {
        "id": "事件ID",
        "team": "球队（home/away）",
        "player": "球员姓名",
        "eventType": "事件类型（goal/yellow/red）",
        "minute": "事件发生分钟",
        "isOwnGoal": false
      }
    ]
  }
]
```

### 用户数据 (users.json)

```json
[
  {
    "id": "唯一标识符",
    "name": "用户姓名",
    "college": "学院",
    "grade": "年级",
    "password": "密码（明文）"
  }
]
```

### 联系表单数据 (contacts.json)

```json
[
  {
    "id": "唯一标识符",
    "name": "用户姓名",
    "email": "用户邮箱",
    "phone": "用户电话",
    "message": "留言内容",
    "createdAt": "提交时间"
  }
]
```

## 注意事项

- 本项目为学生协会网站，仅供内部使用
- 密码以明文形式存储在users.json文件中，生产环境中应使用加密存储
- 服务器默认运行在3000端口，Vercel部署时会自动分配端口
- 数据存储在JSON文件中，建议定期备份
- Vercel的文件系统是临时的，对于生产环境，建议使用外部数据库服务

## 常见问题

### Q: 为什么点击“批量修改事件”按钮时，客队数据的“球队”一栏会自动跳回主队？
A: 这个问题已经修复，现在系统会正确读取JSON文件中的数据来显示“球队”一栏的默认值。

### Q: 为什么下拉菜单点击无反应？
A: 已将Bootstrap的下拉菜单替换为自定义实现，现在应该可以正常工作。

### Q: 为什么联系表单提交后没有反应？
A: 请确保服务器正在运行，表单数据会保存到 `data/contacts.json` 文件中。

### Q: 为什么登录/注册时出现404错误？
A: 请确保服务器正在运行，并且路由配置正确。

## 贡献

欢迎对项目提出改进建议或提交代码。如有问题，请联系项目维护者。

## 许可证

本项目仅供武汉大学足球协会内部使用，未经许可不得用于其他用途。

## 更新记录

- 2026-03-01: 部署到Vercel
