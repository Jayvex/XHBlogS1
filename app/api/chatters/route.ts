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
