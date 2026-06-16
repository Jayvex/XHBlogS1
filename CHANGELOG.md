# XHBlogs 改动日志

## 📅 2026-06-16 - 纯前端改造

本次改造将 XHBlogs 从依赖后端的架构改造为纯前端实现，移除了所有后端依赖。

---

## 🗑️ 删除的功能

### 1. AI 猫猫助理
- 删除 `app/api/chat/route.ts` - Gemini API 代理
- 删除 `components/CyberCat.tsx` - AI 猫咪组件
- 从 `app/layout.tsx` 移除 CyberCat 组件引用
- 从 `siteConfig.ts` 移除 `geminiConfig` 配置

### 2. 天气功能
- 删除 `app/api/weather/route.ts` - 天气 API 代理
- 删除 `components/WeatherWidget.tsx` - 天气组件
- 删除 `components/WeatherEffect.tsx` - 天气特效组件

### 3. 灵境页面
- 删除 `app/tree/` - 整个灵境目录
  - `AlchemyLab.tsx` - 炼金实验室
  - `DijiangModel.tsx` - 帝江模型
  - `CreativeWorkshopClient.tsx` - 创意工坊
- 从 `components/Navbar.tsx` 移除灵境导航链接

### 4. 友链页面
- 删除 `app/friends/` - 整个友链目录
  - `FriendsBoard.tsx` - 友链展示
  - `page.tsx` - 页面入口
- 删除 `data/friends.ts` - 友链数据文件
- 从 `components/Navbar.tsx` 移除友链导航链接

### 5. GitHub OAuth 代理
- 删除 `app/api/github/route.ts` - Gitalk OAuth 代理

---

## 🔄 改造的功能

### 1. 音乐播放（网易云 → 本地文件）

**改造前**：通过 `/api/music` 代理调用网易云音乐 API

**改造后**：使用本地音乐文件

**修改文件**：
- `components/MusicProvider.tsx` - 重写为本地音乐播放器
- `siteConfig.ts` - 将 `cloudMusicIds` 改为 `localMusicList`

**删除文件**：
- `app/api/music/route.ts` - 网易云音乐 API

**使用方法**：
```typescript
// siteConfig.ts
localMusicList: [
  {
    title: "歌曲名",
    artist: "歌手",
    src: "/music/song.mp3",
    cover: "/music/cover.jpg",
    lrcFile: "/music/song.lrc",  // 歌词文件路径
  }
],
```

### 2. 评论系统（Gitalk → Giscus）

**改造前**：使用 Gitalk（基于 GitHub Issues）+ OAuth 代理

**改造后**：使用 Giscus（基于 GitHub Discussions）

**修改文件**：
- `components/Comments.tsx` - 重写为 Giscus 组件
- `components/LabComments.tsx` - 重写为 Giscus 组件
- `components/MomentComments.tsx` - 重写为 Giscus 组件
- `siteConfig.ts` - 将 `gitalkConfig` 改为 `giscusConfig`

**新增依赖**：
- `@giscus/react` - Giscus React 组件

**卸载依赖**：
- `gitalk` - Gitalk 评论系统

**使用方法**：
1. 访问 https://giscus.app/zh-CN 获取配置
2. 修改 `siteConfig.ts`：
```typescript
giscusConfig: {
  repo: "username/repo",
  repoId: "R_xxxxx",
  category: "Announcements",
  categoryId: "DIC_xxxxx",
},
```

### 3. 图床上传（后端 API → 本地 Base64）

**改造前**：通过后端 API 上传到图床服务

**改造后**：使用 FileReader 将图片转为 Base64

**修改文件**：
- `my-blog-manager/components/editor/FloatingImageTool.tsx` - 改为本地上传（已随 my-blog-manager 删除）

---

## ✨ 新增功能

### 1. LRC 歌词文件支持

**功能说明**：支持从本地 `.rc` 文件加载歌词

**修改文件**：
- `components/MusicProvider.tsx` - 添加 lrcFile 加载逻辑
- `siteConfig.ts` - 添加 lrcFile 配置说明

**歌词加载优先级**：
1. 内嵌歌词 (`lrc` 字段) - 最高优先级
2. 本地歌词文件 (`lrcFile` 字段) - 从 public 目录加载
3. 远程歌词 (`lrcUrl` 字段) - 从网络加载

**使用方法**：
```bash
# 将歌词文件放到 public/music/ 目录
XHBlogs/public/music/
├── song.mp3
└── song.lrc
```

```typescript
// siteConfig.ts
localMusicList: [
  {
    title: "歌曲名",
    artist: "歌手",
    src: "/music/song.mp3",
    lrcFile: "/music/song.lrc",
  }
],
```

**LRC 歌词文件格式**：
```lrc
[ti:歌曲名]
[ar:歌手]
[al:专辑]
[00:00.00]第一行歌词
[00:05.00]第二行歌词
[00:10.00]第三行歌词
```

---

## 🐛 修复的问题

### 1. TypeScript 类型错误
- 修复 `app/music/MusicClient.tsx` 中的 `selectSong` 类型错误
- 修复 `app/chatter/page.tsx` 中的 `chatters` 类型错误
- 修复 `components/PageTransition.tsx` 添加 `className` 属性支持

### 2. 评论系统引用更新
- 更新 `app/tree/DijiangModel.tsx` 使用 giscusConfig
- 更新 `app/tree/AlchemyLab.tsx` 使用 giscusConfig

---

## 📁 最终项目结构

```
XHBlogs/
├── app/
│   ├── about/           # 关于页面
│   ├── chatter/         # 杂谈页面
│   ├── moments/         # 说说页面
│   ├── music/           # 音乐页面
│   ├── photowall/       # 照片墙
│   ├── posts/           # 文章页面
│   ├── projects/        # 项目页面
│   └── timeline/        # 时间线
├── components/          # React 组件
├── data/                # 数据文件
│   ├── albums.ts        # 相册数据
│   └── projects.ts      # 项目数据
├── posts/               # Markdown 文章
├── chatters/            # Markdown 杂谈
├── moments/             # Markdown 说说
├── public/
│   └── music/           # 本地音乐目录
│       ├── song.mp3     # 音频文件
│       └── song.lrc     # 歌词文件
├── siteConfig.ts        # 站点配置
└── package.json
```

---

## 🚀 部署说明

### 本地开发
```bash
cd XHBlogs
npm install
npm run dev
```

### 部署到 Vercel
```bash
cd XHBlogs
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```
然后在 Vercel 导入仓库即可自动部署。

---

## ⚠️ 注意事项

1. **字体警告**：构建时的 Google Fonts 警告是由于网络问题，部署到 Vercel 后会自动解决

2. **本地音乐文件**：需要自行准备 MP3 文件放到 `public/music/` 目录

3. **Giscus 配置**：需要在 GitHub 创建 Discussions 并获取配置参数

4. **纯前端限制**：所有数据都是静态的，修改内容需要编辑文件并重新部署
