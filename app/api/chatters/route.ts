import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const chattersDirectory = path.join(process.cwd(), 'chatters');

// 获取所有杂谈
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!fs.existsSync(chattersDirectory)) {
      return NextResponse.json({ chatters: [], total: 0 });
    }

    const fileNames = fs.readdirSync(chattersDirectory).filter(f => f.endsWith('.md'));

    const chatters = fileNames.map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(chattersDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || '1970-01-01',
        tags: data.tags || [],
        mood: data.mood || '',
        cover: data.cover || '',
        content: content.replace(/^#+ .*\n/m, ''),
        status: data.status || 'published',
      };
    });

    // 按日期倒序排序
    chatters.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 按标签筛选
    let filteredChatters = chatters;
    if (tag) {
      filteredChatters = chatters.filter(chatter => chatter.tags.includes(tag));
    }

    // 分页
    const total = filteredChatters.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedChatters = filteredChatters.slice(startIndex, endIndex);

    return NextResponse.json({
      chatters: paginatedChatters,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('获取杂谈列表失败:', error);
    return NextResponse.json({ error: '获取杂谈列表失败' }, { status: 500 });
  }
}

// 创建新杂谈
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tags, mood, cover, status } = body;

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    // 生成 slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w一-龥]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 检查是否已存在
    const filePath = path.join(chattersDirectory, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: '该杂谈已存在' }, { status: 409 });
    }

    // 确保目录存在
    if (!fs.existsSync(chattersDirectory)) {
      fs.mkdirSync(chattersDirectory, { recursive: true });
    }

    // 生成 frontmatter
    const frontmatter = `---
title: "${title}"
date: "${new Date().toISOString()}"
tags: ${JSON.stringify(tags || [])}
mood: "${mood || ''}"
cover: "${cover || ''}"
status: "${status || 'published'}"
---

${content}`;

    // 写入文件
    fs.writeFileSync(filePath, frontmatter, 'utf8');

    return NextResponse.json({
      success: true,
      slug,
      message: '杂谈创建成功',
    });
  } catch (error) {
    console.error('创建杂谈失败:', error);
    return NextResponse.json({ error: '创建杂谈失败' }, { status: 500 });
  }
}

// 删除杂谈
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'slug 不能为空' }, { status: 400 });
    }

    const filePath = path.join(chattersDirectory, `${slug}.md`);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '杂谈不存在' }, { status: 404 });
    }

    // 删除文件
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: '杂谈删除成功',
    });
  } catch (error) {
    console.error('删除杂谈失败:', error);
    return NextResponse.json({ error: '删除杂谈失败' }, { status: 500 });
  }
}
