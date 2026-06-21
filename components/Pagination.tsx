"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  /**
   * 当前页码
   */
  currentPage: number;

  /**
   * 总页数
   */
  totalPages: number;

  /**
   * 每页显示数量
   * @default 10
   */
  pageSize?: number;

  /**
   * 额外的查询参数
   */
  params?: Record<string, string>;

  /**
   * 额外的 CSS 类名
   */
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize = 10,
  params = {},
  className = '',
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // 最多显示的页码数

    if (totalPages <= maxVisible) {
      // 如果总页数小于等于最大显示数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 否则，显示当前页附近的页码
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      // 第一页
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      // 中间的页码
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // 最后一页
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // 生成链接
  const createPageURL = (pageNumber: number | string) => {
    if (typeof pageNumber === 'string') return '#';

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', pageNumber.toString());

    // 添加额外参数
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value);
    });

    return `${pathname}?${newParams.toString()}`;
  };

  // 如果只有一页，不显示分页
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center gap-2 ${className}`}
      aria-label="分页导航"
    >
      {/* 上一页 */}
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 hover:scale-105"
          aria-label="上一页"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">上一页</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-slate-300 dark:text-slate-600 bg-slate-100/60 dark:bg-slate-800/30 rounded-xl border border-slate-200/40 dark:border-slate-700/10 cursor-not-allowed">
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">上一页</span>
        </span>
      )}

      {/* 页码 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500"
              >
                <MoreHorizontal size={16} />
              </span>
            );
          }

          const isActive = pageNumber === currentPage;

          return isActive ? (
            <span
              key={pageNumber}
              className="w-10 h-10 flex items-center justify-center text-sm font-bold text-white bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30"
              aria-current="page"
            >
              {pageNumber}
            </span>
          ) : (
            <Link
              key={pageNumber}
              href={createPageURL(pageNumber)}
              className="w-10 h-10 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 hover:scale-105"
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      {/* 下一页 */}
      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 hover:scale-105"
          aria-label="下一页"
        >
          <span className="hidden sm:inline">下一页</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-slate-300 dark:text-slate-600 bg-slate-100/60 dark:bg-slate-800/30 rounded-xl border border-slate-200/40 dark:border-slate-700/10 cursor-not-allowed">
          <span className="hidden sm:inline">下一页</span>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
