import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const momentsDirectory = path.join(process.cwd(), 'moments');

// 获取所有说说
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    if (!fs.existsSync(momentsDirectory)) {
      return NextResponse.json({ moments: [], total: 0 });
    }

    const fileNames = fs.readdirSync(momentsDirectory).filter(f => f.endsWith('.md'));

    const moments = fileNames.map(fileName => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(momentsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id,
        date: data.date || '1970-01-01',
        location: data.location || '',
        images: data.images || [],
        content: content.trim(),
        status: data.status || 'published',
      };
    });

    // 按日期倒序排序
    moments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 分页
    const total = moments.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMoments = moments.slice(startIndex, endIndex);

    return NextResponse.json({
      moments: paginatedMoments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('获取说说列表失败:', error);
    return NextResponse.json({ error: '获取说说列表失败' }, { status: 500 });
  }
}
