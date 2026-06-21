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

// 创建新说说
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, location, images, status } = body;

    if (!content) {
      return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
    }

    // 生成 ID
    const id = `moment-${Date.now()}`;

    // 确保目录存在
    if (!fs.existsSync(momentsDirectory)) {
      fs.mkdirSync(momentsDirectory, { recursive: true });
    }

    // 生成 frontmatter
    const frontmatter = `---
date: "${new Date().toISOString()}"
location: "${location || ''}"
images: ${JSON.stringify(images || [])}
status: "${status || 'published'}"
---

${content}`;

    // 写入文件
    const filePath = path.join(momentsDirectory, `${id}.md`);
    fs.writeFileSync(filePath, frontmatter, 'utf8');

    return NextResponse.json({
      success: true,
      id,
      message: '说说创建成功',
    });
  } catch (error) {
    console.error('创建说说失败:', error);
    return NextResponse.json({ error: '创建说说失败' }, { status: 500 });
  }
}

// 删除说说
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id 不能为空' }, { status: 400 });
    }

    const filePath = path.join(momentsDirectory, `${id}.md`);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '说说不存在' }, { status: 404 });
    }

    // 删除文件
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: '说说删除成功',
    });
  } catch (error) {
    console.error('删除说说失败:', error);
    return NextResponse.json({ error: '删除说说失败' }, { status: 500 });
  }
}
