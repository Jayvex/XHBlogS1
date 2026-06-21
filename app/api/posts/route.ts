import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'posts');

// 获取所有文章
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json({ posts: [], total: 0 });
    }

    const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));

    const posts = fileNames.map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const content = fs.readFileSync(fullPath, 'utf8');

      // 解析 frontmatter
      const matterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!matterMatch) {
        return { slug, title: slug, date: '1970-01-01', tags: [], content: content };
      }

      const frontmatter = matterMatch[1];
      const body = matterMatch[2];

      // 简单解析 frontmatter
      const data: any = {};
      frontmatter.split('\n').forEach(line => {
        const match = line.match(/^(\w+):\s*"?(.+?)"?\s*$/);
        if (match) {
          const [, key, value] = match;
          if (key === 'tags') {
            try {
              data[key] = JSON.parse(value);
            } catch {
              data[key] = [];
            }
          } else {
            data[key] = value;
          }
        }
      });

      return {
        slug,
        title: data.title || slug,
        date: data.date || '1970-01-01',
        tags: data.tags || [],
        cover: data.cover || '',
        description: data.description || body.substring(0, 100) + '...',
        series: data.series || null,
      };
    });

    // 按日期倒序排序
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 按标签筛选
    let filteredPosts = posts;
    if (tag) {
      filteredPosts = posts.filter(post => post.tags.includes(tag));
    }

    // 分页
    const total = filteredPosts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json({ error: '获取文章列表失败' }, { status: 500 });
  }
}

// 创建新文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tags, series, cover, description, status } = body;

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    // 生成 slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w一-龥]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 检查是否已存在
    const filePath = path.join(postsDirectory, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: '该文章已存在' }, { status: 409 });
    }

    // 确保目录存在
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    // 生成 frontmatter
    const frontmatter = `---
title: "${title}"
date: "${new Date().toISOString()}"
tags: ${JSON.stringify(tags || [])}
${series ? `series:\n  name: "${series.name}"\n  order: ${series.order}\n  total: ${series.total}` : ''}
cover: "${cover || ''}"
description: "${description || content.substring(0, 100)}"}
status: "${status || 'published'}"
---

${content}`;

    // 写入文件
    fs.writeFileSync(filePath, frontmatter, 'utf8');

    return NextResponse.json({
      success: true,
      slug,
      message: '文章创建成功',
    });
  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json({ error: '创建文章失败' }, { status: 500 });
  }
}

// 更新文章
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, content, tags, series, cover, description, status } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'slug、标题和内容不能为空' }, { status: 400 });
    }

    const filePath = path.join(postsDirectory, `${slug}.md`);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    // 生成 frontmatter
    const frontmatter = `---
title: "${title}"
date: "${new Date().toISOString()}"
tags: ${JSON.stringify(tags || [])}
${series ? `series:\n  name: "${series.name}"\n  order: ${series.order}\n  total: ${series.total}` : ''}
cover: "${cover || ''}"
description: "${description || content.substring(0, 100)}"}
status: "${status || 'published'}"
---

${content}`;

    // 写入文件
    fs.writeFileSync(filePath, frontmatter, 'utf8');

    return NextResponse.json({
      success: true,
      slug,
      message: '文章更新成功',
    });
  } catch (error) {
    console.error('更新文章失败:', error);
    return NextResponse.json({ error: '更新文章失败' }, { status: 500 });
  }
}

// 删除文章
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'slug 不能为空' }, { status: 400 });
    }

    const filePath = path.join(postsDirectory, `${slug}.md`);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    // 删除文件
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: '文章删除成功',
    });
  } catch (error) {
    console.error('删除文章失败:', error);
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 });
  }
}
