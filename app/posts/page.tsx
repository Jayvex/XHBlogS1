import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Suspense } from 'react';
import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import { siteConfig } from '../../siteConfig';
import PostListClient from './PostListClient';

export const metadata = {
  title: "文章列表 | " + siteConfig.title,
  description: "所有文章的列表，支持分页和标签筛选",
};

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  cover: string;
  description: string;
}

function PostListWrapper() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  let allPosts: Post[] = [];
  let allTags: string[] = [];

  try {
    if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));

      allPosts = fileNames.map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));

        const tags = data.tags && Array.isArray(data.tags) ? data.tags : ['未分类'];

        return {
          slug,
          title: data.title || '无标题',
          date: data.date || '1970-01-01',
          tags,
          cover: data.cover || siteConfig.defaultPostCover,
          description: data.description || content.substring(0, 100) + '...',
        };
      });

      // 按日期倒序排序
      allPosts.sort((a, b) => {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return dateDiff !== 0 ? dateDiff : b.slug.localeCompare(a.slug);
      });

      // 提取所有标签
      const tagSet = new Set<string>();
      allPosts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
      allTags = Array.from(tagSet).sort();
    }
  } catch (e) {
    console.error("读取文章列表失败:", e);
  }

  return (
    <PostListClient
      posts={allPosts}
      allTags={allTags}
      initialPageSize={10}
    />
  );
}

export default function PostsPage() {
  return (
    <div className="min-h-screen relative pb-10">
      <Navbar />
      <PageTransition>
        <Suspense fallback={
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10 pt-24 md:pt-28 relative z-10">
            <div className="text-center mb-10">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-48 mx-auto mb-4 animate-pulse" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-32 mx-auto animate-pulse" />
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/60 dark:bg-slate-800/50 rounded-3xl p-6 animate-pulse">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-3" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2" />
                </div>
              ))}
            </div>
          </div>
        }>
          <PostListWrapper />
        </Suspense>
      </PageTransition>
    </div>
  );
}
