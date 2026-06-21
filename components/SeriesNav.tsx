"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface SeriesPost {
  slug: string;
  title: string;
  order: number;
}

interface SeriesNavProps {
  /**
   * 当前文章的 slug
   */
  currentSlug: string;

  /**
   * 系列信息
   */
  series: {
    name: string;
    posts: SeriesPost[];
  };

  /**
   * 额外的 CSS 类名
   */
  className?: string;
}

export default function SeriesNav({ currentSlug, series, className = '' }: SeriesNavProps) {
  // 按 order 排序
  const sortedPosts = [...series.posts].sort((a, b) => a.order - b.order);

  // 找到当前文章的索引
  const currentIndex = sortedPosts.findIndex((post) => post.slug === currentSlug);

  // 上一篇和下一篇
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  // 计算进度
  const progress = ((currentIndex + 1) / sortedPosts.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-xl ${className}`}
    >
      {/* 系列标题 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-indigo-500/10 rounded-xl flex items-center justify-center">
          <BookOpen size={16} className="text-indigo-500" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {series.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            共 {sortedPosts.length} 篇
          </p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            进度
          </span>
          <span className="text-xs font-bold text-indigo-500">
            {currentIndex + 1} / {sortedPosts.length}
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>
      </div>

      {/* 文章列表 */}
      <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto custom-scrollbar">
        {sortedPosts.map((post, index) => {
          const isCurrent = post.slug === currentSlug;

          return (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20'
                  : 'hover:bg-slate-100/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isCurrent
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {post.order}
              </div>
              <span
                className={`text-sm line-clamp-1 ${
                  isCurrent
                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {post.title}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 导航按钮 */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
        {prevPost ? (
          <Link
            href={`/posts/${prevPost.slug}`}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <div className="text-left">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                上一篇
              </p>
              <p className="line-clamp-1 max-w-[120px]">{prevPost.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextPost ? (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group"
          >
            <div className="text-right">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                下一篇
              </p>
              <p className="line-clamp-1 max-w-[120px]">{nextPost.title}</p>
            </div>
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </motion.div>
  );
}
