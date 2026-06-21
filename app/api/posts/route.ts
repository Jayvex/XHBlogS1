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
