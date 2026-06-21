"use client";

import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Tag, Calendar } from 'lucide-react';

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  cover?: string;
  description?: string;
}

interface RelatedPostsProps {
  /**
   * 当前文章的 slug
   */
  currentSlug: string;

  /**
   * 当前文章的标签
   */
  currentTags: string[];

  /**
   * 所有文章列表
   */
  posts: Post[];

  /**
   * 显示数量
   * @default 3
   */
  limit?: number;

  /**
   * 标题
   * @default '相关推荐'
   */
  title?: string;

  /**
   * 额外的 CSS 类名
   */
  className?: string;
}

/**
 * 计算两个标签数组的 Jaccard 相似度
 */
function calculateSimilarity(tags1: string[], tags2: string[]): number {
  if (tags1.length === 0 && tags2.length === 0) return 0;

  const set1 = new Set(tags1.map((t) => t.toLowerCase()));
  const set2 = new Set(tags2.map((t) => t.toLowerCase()));

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

export default function RelatedPosts({
  currentSlug,
  currentTags,
  posts,
  limit = 3,
  title = '相关推荐',
  className = '',
}: RelatedPostsProps) {
  // 计算相似度并排序
  const relatedPosts = useMemo(() => {
    return posts
      .filter((post) => post.slug !== currentSlug)
      .map((post) => ({
        ...post,
        similarity: calculateSimilarity(currentTags, post.tags),
      }))
      .sort((a, b) => {
        // 优先按相似度排序，相似度相同时按日期排序
        if (b.similarity !== a.similarity) {
          return b.similarity - a.similarity;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, limit);
  }, [currentSlug, currentTags, posts, limit]);

  // 如果没有相关文章，不显示
  if (relatedPosts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-xl ${className}`}
    >
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-pink-500/10 rounded-xl flex items-center justify-center">
          <Sparkles size={16} className="text-pink-500" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          {title}
        </h3>
      </div>

      {/* 文章列表 */}
      <div className="space-y-4">
        {relatedPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={`/posts/${post.slug}`}
              className="group block p-3 rounded-2xl transition-all duration-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
            >
              {/* 封面图 */}
              {post.cover && (
                <div className="w-full h-32 mb-3 rounded-xl overflow-hidden">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* 标题 */}
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
                {post.title}
              </h4>

              {/* 描述 */}
              {post.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {post.description}
                </p>
              )}

              {/* 标签和日期 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Tag size={10} className="text-slate-400" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-[10px] text-slate-400">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar size={10} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400">
                    {post.date.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* 相似度指示器 */}
              {post.similarity > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                      style={{ width: `${post.similarity * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {Math.round(post.similarity * 100)}% 匹配
                  </span>
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
