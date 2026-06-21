"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

interface ReadingProgressProps {
  /**
   * 目标容器的选择器
   * @default '#article-content'
   */
  target?: string;

  /**
   * 进度条颜色
   * @default 'from-indigo-500 to-purple-500'
   */
  color?: string;

  /**
   * 进度条高度（像素）
   * @default 3
   */
  height?: number;

  /**
   * 是否显示百分比
   * @default false
   */
  showPercentage?: boolean;

  /**
   * 位置
   * @default 'top'
   */
  position?: 'top' | 'bottom';
}

export default function ReadingProgress({
  target = '#article-content',
  color = 'from-indigo-500 to-purple-500',
  height = 3,
  showPercentage = false,
  position = 'top',
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // 使用弹簧动画使进度条更平滑
  const springProgress = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 计算阅读进度
  const calculateProgress = useCallback(() => {
    const targetElement = document.querySelector(target);
    if (!targetElement) return 0;

    const rect = targetElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 计算目标元素的位置
    const elementTop = rect.top + window.scrollY;
    const elementBottom = elementTop + rect.height;
    const currentScroll = window.scrollY + windowHeight;

    // 如果还没滚动到目标元素，进度为 0
    if (currentScroll < elementTop) return 0;

    // 如果已经滚过目标元素，进度为 100
    if (window.scrollY > elementBottom) return 100;

    // 计算在目标元素内的进度
    const progressInElement = (currentScroll - elementTop) / rect.height;
    return Math.min(Math.max(progressInElement * 100, 0), 100);
  }, [target]);

  // 监听滚动事件
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const newProgress = calculateProgress();
          setProgress(newProgress);
          springProgress.set(newProgress);

          // 当进度大于 0 时显示进度条
          setIsVisible(newProgress > 0);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始化

    return () => window.removeEventListener('scroll', handleScroll);
  }, [calculateProgress, springProgress]);

  // 如果进度为 0，不显示
  if (!isVisible) return null;

  return (
    <div
      className={`fixed left-0 right-0 z-50 ${
        position === 'top' ? 'top-0' : 'bottom-0'
      }`}
      style={{ height: `${height}px` }}
    >
      {/* 背景 */}
      <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm" />

      {/* 进度条 */}
      <motion.div
        className={`absolute left-0 ${position === 'top' ? 'top-0' : 'bottom-0'} h-full bg-gradient-to-r ${color}`}
        style={{ width: `${progress}%` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* 百分比显示 */}
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute right-4 ${
            position === 'top' ? 'top-4' : 'bottom-4'
          } bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl px-3 py-1.5 rounded-full shadow-lg border border-white/50 dark:border-white/10`}
        >
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {Math.round(progress)}%
          </span>
        </motion.div>
      )}

      {/* 发光效果 */}
      <div
        className={`absolute left-0 ${position === 'top' ? 'top-0' : 'bottom-0'} h-full w-20 bg-gradient-to-r from-transparent to-white/20 blur-sm`}
        style={{ left: `${Math.max(progress - 5, 0)}%` }}
      />
    </div>
  );
}

/**
 * 简化版进度条（仅显示进度，无百分比）
 */
export function SimpleReadingProgress({
  target = '#article-content',
  color = 'bg-indigo-500',
  height = 2,
}: {
  target?: string;
  color?: string;
  height?: number;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const targetElement = document.querySelector(target);
          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementTop = rect.top + window.scrollY;
            const elementBottom = elementTop + rect.height;
            const currentScroll = window.scrollY + windowHeight;

            if (currentScroll < elementTop) {
              setProgress(0);
            } else if (window.scrollY > elementBottom) {
              setProgress(100);
            } else {
              const progressInElement = (currentScroll - elementTop) / rect.height;
              setProgress(Math.min(Math.max(progressInElement * 100, 0), 100));
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [target]);

  if (progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{ height: `${height}px` }}
    >
      <div className="absolute inset-0 bg-slate-200/30 dark:bg-slate-800/30" />
      <div
        className={`absolute left-0 top-0 h-full ${color} transition-all duration-150 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
