# XHBlogs - 纯前端个人博客

一个基于 Next.js 16 的纯前端个人博客系统，无需后端服务，支持 Vercel 一键部署。

## ✨ 特性

- 🎨 **现代化设计** - 毛玻璃特效、动态背景、流畅动画
- 📝 **多内容类型** - 文章、杂谈、说说、项目展示
- 🎵 **本地音乐播放** - 支持 LRC 歌词同步显示
- 🖼️ **照片墙** - 瀑布流图片展示
- 💬 **Giscus 评论** - 基于 GitHub Discussions 的评论系统
- 🌙 **暗黑模式** - 自动/手动切换主题
- 📱 **响应式设计** - 完美适配移动端和桌面端
- ⚡ **纯前端架构** - 无后端依赖，部署简单

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建部署

```bash
npm run build
```

## 📁 项目结构

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

## ⚙️ 配置说明

### 站点配置

编辑 `siteConfig.ts` 文件：

```typescript
export const siteConfig = {
  title: "你的博客标题",
  authorName: "作者名称",
  bio: "个人简介",
  avatarUrl: "头像链接",
  
  // 背景设置
  useGradient: false,
  bgImages: ["背景图片1.jpg", "背景图片2.jpg"],
  
  // 社交链接
  social: {
    github: "https://github.com/your-username",
    email: "your-email@example.com",
  },
  
  // 本地音乐列表
  localMusicList: [
    {
      title: "歌曲名",
      artist: "歌手",
      src: "/music/song.mp3",
      cover: "/music/cover.jpg",
      lrcFile: "/music/song.lrc",
    }
  ],
  
  // Giscus 评论配置
  giscusConfig: {
    repo: "username/repo",
    repoId: "R_xxxxx",
    category: "Announcements",
    categoryId: "DIC_xxxxx",
  },
};
```

### Giscus 评论配置

1. 访问 [https://giscus.app/zh-CN](https://giscus.app/zh-CN)
2. 填写你的 GitHub 仓库信息
3. 获取 `repoId` 和 `categoryId`
4. 填入 `siteConfig.ts` 中

### 本地音乐配置

1. 将音乐文件放到 `public/music/` 目录
2. 在 `siteConfig.ts` 的 `localMusicList` 中配置歌曲信息
3. 支持 LRC 歌词文件同步显示

**LRC 歌词格式：**
```lrc
[ti:歌曲名]
[ar:歌手]
[al:专辑]
[00:00.00]第一行歌词
[00:05.00]第二行歌词
[00:10.00]第三行歌词
```

## 📝 内容管理

### 添加文章

在 `posts/` 目录创建 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2026-06-16"
cover: "封面图链接"
tags: ["标签1", "标签2"]
---

文章内容...
```

### 添加杂谈

在 `chatters/` 目录创建 `.md` 文件：

```markdown
---
title: "杂谈标题"
date: "2026-06-16"
mood: "心情"
tags: ["标签"]
---

杂谈内容...
```

### 添加说说

在 `moments/` 目录创建 `.md` 文件：

```markdown
---
date: "2026-06-16"
---

说说内容...
```

### 添加项目

编辑 `data/projects.ts` 文件：

```typescript
export const projects = [
  {
    title: "项目名称",
    description: "项目描述",
    image: "项目图片",
    link: "项目链接",
    tags: ["技术栈"],
  }
];
```

## 🎨 自定义样式

### 主题颜色

在 `siteConfig.ts` 中修改 `themeColors`：

```typescript
themeColors: ["#a18cd1", "#fbc2eb", "#a1c4fd", "#c2e9fb"],
```

### 背景设置

支持纯色渐变和图片背景：

```typescript
// 纯色渐变
useGradient: true,
themeColors: ["#颜色1", "#颜色2", "#颜色3", "#颜色4"],

// 图片背景
useGradient: false,
bgImages: ["图片1.jpg", "图片2.jpg", "图片3.jpg"],
```

## 🚀 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入仓库
3. 自动部署完成

```bash
# 推送到 GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

## 🛠️ 技术栈

- **框架**: Next.js 16.2.1
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **评论**: Giscus
- **部署**: Vercel

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Giscus](https://giscus.app/)
- [Lucide Icons](https://lucide.dev/)

---

**享受你的博客之旅！** 🎉
