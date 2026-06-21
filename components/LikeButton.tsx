"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  /**
   * 唯一标识符（如文章 ID 或说说 ID）
   */
  id: string;

  /**
   * 初始点赞数
   * @default 0
   */
  initialCount?: number;

  /**
   * 存储在 localStorage 中的键名前缀
   * @default 'liked_'
   */
  storagePrefix?: string;

  /**
   * 按钮大小
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 是否显示计数
   * @default true
   */
  showCount?: boolean;

  /**
   * 额外的 CSS 类名
   */
  className?: string;

  /**
   * 点赞状态变化的回调
   */
  onLikeChange?: (isLiked: boolean, count: number) => void;
}

export default function LikeButton({
  id,
  initialCount = 0,
  storagePrefix = 'liked_',
  size = 'md',
  showCount = true,
  className = '',
  onLikeChange,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [showAnimation, setShowAnimation] = useState(false);
  const storageKey = `${storagePrefix}${id}`;

  // 从 localStorage 读取点赞状态
  useEffect(() => {
    try {
      const likedItems = JSON.parse(localStorage.getItem(storagePrefix) || '[]');
      setIsLiked(likedItems.includes(id));
    } catch (error) {
      console.error('读取点赞状态失败:', error);
    }
  }, [id, storagePrefix]);

  // 处理点赞
  const handleLike = useCallback(() => {
    try {
      const likedItems: string[] = JSON.parse(localStorage.getItem(storagePrefix) || '[]');
      const newIsLiked = !isLiked;

      if (newIsLiked) {
        // 添加到点赞列表
        likedItems.push(id);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 1000);
      } else {
        // 从点赞列表移除
        const index = likedItems.indexOf(id);
        if (index > -1) {
          likedItems.splice(index, 1);
        }
      }

      // 保存到 localStorage
      localStorage.setItem(storagePrefix, JSON.stringify(likedItems));

      // 更新状态
      setIsLiked(newIsLiked);
      setCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

      // 回调
      onLikeChange?.(newIsLiked, newIsLiked ? count + 1 : count - 1);
    } catch (error) {
      console.error('保存点赞状态失败:', error);
    }
  }, [id, isLiked, count, storagePrefix, onLikeChange]);

  // 尺寸配置
  const sizeConfig = {
    sm: {
      icon: 14,
      button: 'w-7 h-7',
      text: 'text-xs',
      heart: 'w-3.5 h-3.5',
    },
    md: {
      icon: 18,
      button: 'w-9 h-9',
      text: 'text-sm',
      heart: 'w-4 h-4',
    },
    lg: {
      icon: 24,
      button: 'w-12 h-12',
      text: 'text-base',
      heart: 'w-5 h-5',
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={handleLike}
        className={`${config.button} flex items-center justify-center rounded-full transition-all duration-300 ${
          isLiked
            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
        }`}
        aria-label={isLiked ? '取消点赞' : '点赞'}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={config.icon}
            className={`${config.heart} transition-all duration-300 ${
              isLiked ? 'fill-red-500 text-red-500' : ''
            }`}
          />
        </motion.div>

        {/* 点赞动画 */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -20, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute"
            >
              <Heart size={config.icon} className="fill-red-500 text-red-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* 计数 */}
      {showCount && (
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${config.text} font-bold ${
            isLiked ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {count > 0 ? count : ''}
        </motion.span>
      )}

      {/* 粒子效果 */}
      <AnimatePresence>
        {showAnimation && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: (Math.random() - 0.5) * 40,
                  y: (Math.random() - 0.5) * 40,
                }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="absolute w-1 h-1 bg-red-500 rounded-full"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 简化版点赞按钮（仅图标，无计数）
 */
export function SimpleLikeButton({
  id,
  storagePrefix = 'liked_',
  size = 16,
  className = '',
}: {
  id: string;
  storagePrefix?: string;
  size?: number;
  className?: string;
}) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    try {
      const likedItems = JSON.parse(localStorage.getItem(storagePrefix) || '[]');
      setIsLiked(likedItems.includes(id));
    } catch (error) {
      console.error('读取点赞状态失败:', error);
    }
  }, [id, storagePrefix]);

  const handleLike = useCallback(() => {
    try {
      const likedItems: string[] = JSON.parse(localStorage.getItem(storagePrefix) || '[]');
      const newIsLiked = !isLiked;

      if (newIsLiked) {
        likedItems.push(id);
      } else {
        const index = likedItems.indexOf(id);
        if (index > -1) {
          likedItems.splice(index, 1);
        }
      }

      localStorage.setItem(storagePrefix, JSON.stringify(likedItems));
      setIsLiked(newIsLiked);
    } catch (error) {
      console.error('保存点赞状态失败:', error);
    }
  }, [id, isLiked, storagePrefix]);

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={handleLike}
      className={`transition-colors duration-300 ${
        isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
      } ${className}`}
      aria-label={isLiked ? '取消点赞' : '点赞'}
    >
      <Heart size={size} className={isLiked ? 'fill-current' : ''} />
    </motion.button>
  );
}
