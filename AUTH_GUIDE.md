# 登录认证系统使用指南

## 📋 概述

本系统使用 NextAuth.js 实现登录认证，保护发布功能仅限管理员访问。

---

## 🔐 管理员配置

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 管理员账号配置
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
ADMIN_NAME=Your Name
ADMIN_EMAIL=your_email@example.com

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key_here
```

### 2. 生成 NEXTAUTH_SECRET

使用以下命令生成安全的 secret：

```bash
openssl rand -base64 32
```

或者访问：https://generate-secret.vercel.app/32

### 3. 示例配置

```bash
# 管理员账号配置
ADMIN_USERNAME=admin
ADMIN_PASSWORD=xhblogs2026
ADMIN_NAME=XiaoQuanJie
ADMIN_EMAIL=2023683967@qq.com

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=K2j8mN4pQ7rT1vW3yZ5aC8eF2hJ4kL6n
```

---

## 🚀 使用方法

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问登录页面

打开浏览器访问：http://localhost:3000/login

### 3. 输入管理员账号

- **用户名**：你在 `.env.local` 中设置的 `ADMIN_USERNAME`
- **密码**：你在 `.env.local` 中设置的 `ADMIN_PASSWORD`

### 4. 登录成功

登录成功后会自动跳转到发布页面：http://localhost:3000/publish

---

## 🛡️ 权限说明

### 受保护的路由

以下路由需要管理员权限才能访问：

#### 页面路由
- `/publish` - 发布页面

#### API 路由
- `POST /api/posts` - 创建文章
- `PUT /api/posts/[slug]` - 更新文章
- `DELETE /api/posts/[slug]` - 删除文章
- `POST /api/moments` - 创建说说
- `DELETE /api/moments` - 删除说说
- `POST /api/chatters` - 创建杂谈
- `DELETE /api/chatters` - 删除杂谈

### 公开路由

以下路由无需登录即可访问：

- `/` - 首页
- `/posts` - 文章列表
- `/posts/[slug]` - 文章详情
- `/moments` - 说说列表
- `/chatter` - 杂谈列表
- `/chatter/[slug]` - 杂谈详情
- `/about` - 关于页面
- `/projects` - 项目页面
- `/timeline` - 时间线页面
- `/photowall` - 照片墙页面
- `/music` - 音乐页面

---

## 🔧 功能特性

### 1. 登录认证

- ✅ 用户名/密码认证
- ✅ JWT Token 会话管理
- ✅ 登录状态保持 30 天
- ✅ 自动重定向到登录页面

### 2. 权限控制

- ✅ 管理员角色验证
- ✅ API 路由保护
- ✅ 页面路由保护
- ✅ 未授权访问重定向

### 3. 用户界面

- ✅ 登录页面（美观的 UI）
- ✅ 导航栏显示用户信息
- ✅ 登出功能
- ✅ 发布页面显示当前用户

### 4. 安全特性

- ✅ 密码不明文存储
- ✅ JWT Token 加密
- ✅ CSRF 保护
- ✅ 环境变量配置

---

## 📝 使用示例

### 示例 1：登录

1. 访问 http://localhost:3000/login
2. 输入用户名：`admin`
3. 输入密码：`xhblogs2026`
4. 点击"登录"按钮
5. 登录成功后自动跳转到发布页面

### 示例 2：发布文章

1. 登录后访问 http://localhost:3000/publish
2. 选择"文章"类型
3. 填写标题、内容、标签等
4. 点击"发布"按钮
5. 文章发布成功

### 示例 3：登出

1. 点击导航栏右侧的用户头像
2. 点击"登出"按钮
3. 登出成功，跳转到首页

---

## 🐛 常见问题

### 1. 登录失败

**问题**：输入正确的用户名和密码后仍然登录失败

**解决方案**：
1. 检查 `.env.local` 文件是否存在
2. 检查环境变量是否正确配置
3. 重启开发服务器

### 2. 环境变量不生效

**问题**：修改了 `.env.local` 但没有生效

**解决方案**：
1. 重启开发服务器
2. 清除浏览器缓存
3. 检查环境变量格式是否正确

### 3. 无法访问发布页面

**问题**：访问 `/publish` 时被重定向到登录页面

**解决方案**：
1. 确保已登录
2. 检查用户角色是否为管理员
3. 清除浏览器 Cookie

### 4. API 返回 401 错误

**问题**：调用 API 时返回 401 未授权错误

**解决方案**：
1. 确保已登录
2. 检查请求是否包含有效的 Session
3. 使用浏览器开发者工具检查网络请求

---

## 🔒 安全建议

### 1. 生产环境配置

```bash
# 使用强密码
ADMIN_PASSWORD=YourStr0ngP@ssw0rd!

# 使用随机生成的 NEXTAUTH_SECRET
NEXTAUTH_SECRET=K2j8mN4pQ7rT1vW3yZ5aC8eF2hJ4kL6n

# 设置正确的 NEXTAUTH_URL
NEXTAUTH_URL=https://your-domain.com
```

### 2. 定期更换密码

建议每 3 个月更换一次管理员密码。

### 3. 限制登录尝试

可以添加登录失败次数限制，防止暴力破解。

### 4. 使用 HTTPS

在生产环境使用 HTTPS，保护登录信息安全。

---

## 📚 技术栈

- **NextAuth.js** - 认证框架
- **JWT** - Token 管理
- **bcrypt** - 密码加密（可选）
- **Middleware** - 路由保护

---

## 🎯 总结

登录认证系统已完成！你现在可以：

1. ✅ 使用管理员账号登录
2. ✅ 访问发布页面发布内容
3. ✅ 保护 API 路由不被未授权访问
4. ✅ 在导航栏看到登录状态

**默认管理员账号**：
- 用户名：`admin`
- 密码：`xhblogs2026`

**登录地址**：http://localhost:3000/login

---

**祝你使用愉快！** 🎉
