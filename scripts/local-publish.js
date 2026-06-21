#!/usr/bin/env node

/**
 * 本地发布工具
 * 用于在本地创建文章、说说、杂谈内容
 * 使用方法：node scripts/local-publish.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// 生成 slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w一-龥]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 生成时间戳 ID
function generateId() {
  return `moment-${Date.now()}`;
}

// 发布文章
async function publishPost() {
  console.log(colorize('cyan', '\n📝 发布文章\n'));

  const title = await ask('标题: ');
  if (!title) {
    console.log(colorize('red', '❌ 标题不能为空'));
    return;
  }

  const description = await ask('描述 (可选): ');
  const cover = await ask('封面图链接 (可选): ');
  const tagsInput = await ask('标签 (用逗号分隔，可选): ');
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];

  console.log(colorize('yellow', '\n请输入内容 (输入 END 结束):'));
  let content = '';
  let line;
  while ((line = await ask('')) !== 'END') {
    content += line + '\n';
  }

  if (!content.trim()) {
    console.log(colorize('red', '❌ 内容不能为空'));
    return;
  }

  const slug = generateSlug(title);
  const now = new Date().toISOString();

  const frontmatter = `---
title: "${title}"
date: "${now}"
tags: ${JSON.stringify(tags)}
cover: "${cover || ''}"
description: "${description || content.substring(0, 100)}"
status: "published"
---

${content}`;

  const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);

  // 检查是否已存在
  if (fs.existsSync(filePath)) {
    const overwrite = await ask(colorize('yellow', '⚠️ 文件已存在，是否覆盖？(y/N): '));
    if (overwrite.toLowerCase() !== 'y') {
      console.log(colorize('dim', '已取消'));
      return;
    }
  }

  // 确保目录存在
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, frontmatter, 'utf8');
  console.log(colorize('green', `\n✅ 文章发布成功！`));
  console.log(colorize('dim', `   文件: ${filePath}`));
}

// 发布说说
async function publishMoment() {
  console.log(colorize('cyan', '\n💬 发布说说\n'));

  const content = await ask('内容: ');
  if (!content) {
    console.log(colorize('red', '❌ 内容不能为空'));
    return;
  }

  const location = await ask('位置 (可选): ');
  const imagesInput = await ask('图片链接 (用逗号分隔，可选): ');
  const images = imagesInput ? imagesInput.split(',').map(u => u.trim()).filter(Boolean) : [];

  const id = generateId();
  const now = new Date().toISOString();

  const frontmatter = `---
date: "${now}"
location: "${location || ''}"
images: ${JSON.stringify(images)}
status: "published"
---

${content}`;

  const filePath = path.join(process.cwd(), 'moments', `${id}.md`);

  // 确保目录存在
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, frontmatter, 'utf8');
  console.log(colorize('green', `\n✅ 说说发布成功！`));
  console.log(colorize('dim', `   文件: ${filePath}`));
}

// 发布杂谈
async function publishChatter() {
  console.log(colorize('cyan', '\n📖 发布杂谈\n'));

  const title = await ask('标题: ');
  if (!title) {
    console.log(colorize('red', '❌ 标题不能为空'));
    return;
  }

  const mood = await ask('心情 (可选，如 😊 开心): ');
  const cover = await ask('封面图链接 (可选): ');
  const tagsInput = await ask('标签 (用逗号分隔，可选): ');
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];

  console.log(colorize('yellow', '\n请输入内容 (输入 END 结束):'));
  let content = '';
  let line;
  while ((line = await ask('')) !== 'END') {
    content += line + '\n';
  }

  if (!content.trim()) {
    console.log(colorize('red', '❌ 内容不能为空'));
    return;
  }

  const slug = generateSlug(title);
  const now = new Date().toISOString();

  const frontmatter = `---
title: "${title}"
date: "${now}"
tags: ${JSON.stringify(tags)}
mood: "${mood || ''}"
cover: "${cover || ''}"
status: "published"
---

${content}`;

  const filePath = path.join(process.cwd(), 'chatters', `${slug}.md`);

  // 检查是否已存在
  if (fs.existsSync(filePath)) {
    const overwrite = await ask(colorize('yellow', '⚠️ 文件已存在，是否覆盖？(y/N): '));
    if (overwrite.toLowerCase() !== 'y') {
      console.log(colorize('dim', '已取消'));
      return;
    }
  }

  // 确保目录存在
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, frontmatter, 'utf8');
  console.log(colorize('green', `\n✅ 杂谈发布成功！`));
  console.log(colorize('dim', `   文件: ${filePath}`));
}

// 主菜单
async function main() {
  console.log(colorize('bright', '\n🚀 XHBlogs 本地发布工具\n'));
  console.log('请选择内容类型:');
  console.log(colorize('cyan', '  1. 📝 文章 (posts)'));
  console.log(colorize('cyan', '  2. 💬 说说 (moments)'));
  console.log(colorize('cyan', '  3. 📖 杂谈 (chatters)'));
  console.log(colorize('dim', '  0. 退出\n'));

  const choice = await ask('请输入选项 (0-3): ');

  switch (choice) {
    case '1':
      await publishPost();
      break;
    case '2':
      await publishMoment();
      break;
    case '3':
      await publishChatter();
      break;
    case '0':
      console.log(colorize('dim', '\n再见！👋\n'));
      rl.close();
      return;
    default:
      console.log(colorize('red', '\n❌ 无效选项'));
  }

  // 询问是否继续
  const continueChoice = await ask(colorize('dim', '\n继续发布？(Y/n): '));
  if (continueChoice.toLowerCase() !== 'n') {
    await main();
  } else {
    console.log(colorize('dim', '\n再见！👋\n'));
    rl.close();
  }
}

// 启动
main().catch(console.error);
