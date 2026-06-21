"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, Search, BookOpen, ArrowRight } from 'lucide-react';
import Pagination from '../../components/Pagination';
import { siteConfig } from '../../siteConfig';

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  cover: string;
  description: string;
}

interface PostListClientProps {
  posts: Post[];
  allTags: string[];
  initialPageSize?: number;
}

export default function PostListClient({
  posts,
  allTags,
  initialPageSize = 10,
}: PostListClientProps) {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentTag = searchParams.get('tag') || '';
  const pageSize = initialPageSize;

  // 按标签筛选
  const filteredPosts = useMemo(() => {
    if (!currentTag) return posts;
    return posts.filter(post => post.tags.includes(currentTag));
  }, [posts, currentTag]);

  // 计算分页
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);
  const totalPosts = filteredPosts.length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10 pt-24 md:pt-28 relative z-10">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
          文章列表
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic opacity-80">
          共 {totalPosts} 篇文章
          {currentTag && (
            <span className="text-indigo-500"> · 筛选: #{currentTag}</span>
          )}
        </p>
      </motion.div>

      {/* 标签筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/posts"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
              !currentTag
                ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/30 scale-105'
                : 'bg-white/30 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            全部
          </Link>
          {allTags.map(tag => (
            <Link
              key={tag}
              href={`/posts?tag=${encodeURIComponent(tag)}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                currentTag === tag
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/30 scale-105'
                  : 'bg-white/30 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              # {tag}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 文章列表 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentTag}-${currentPage}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {currentPosts.length > 0 ? (
            currentPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/posts/${post.slug}`}
                  className="group block bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* 封面图 */}
                    <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = siteConfig.defaultPostCover;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        {/* 标签 */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/10"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-[10px] font-bold text-slate-400">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>

                        {/* 标题 */}
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        {/* 描述 */}
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          {post.description}
                        </p>
                      </div>

                      {/* 底部信息 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar size={14} />
                          <span>{post.date.split(' ')[0]}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-bold text-indigo-500 group-hover:text-indigo-600 transition-colors">
                          <span>阅读全文</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                暂无文章
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {currentTag
                  ? `没有找到标签为 "#${currentTag}" 的文章`
                  : '还没有发布任何文章'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 分页 */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            params={currentTag ? { tag: currentTag } : {}}
          />
        </motion.div>
      )}
    </div>
  );
}
