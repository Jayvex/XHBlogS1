"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageLightboxProps {
  /**
   * 图片链接数组
   */
  images: string[];

  /**
   * 当前显示的图片索引
   */
  currentIndex: number;

  /**
   * 是否打开 lightbox
   */
  isOpen: boolean;

  /**
   * 关闭 lightbox 的回调
   */
  onClose: () => void;

  /**
   * 切换图片的回调
   */
  onNavigate?: (index: number) => void;

  /**
   * 是否显示计数器
   * @default true
   */
  showCounter?: boolean;

  /**
   * 是否显示关闭按钮
   * @default true
   */
  showCloseButton?: boolean;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  showCounter = true,
  showCloseButton = true,
}: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  // 同步外部 currentIndex
  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  // 键盘快捷键
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
    }
  }, [isOpen, activeIndex, images.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToNext = () => {
    if (images.length <= 1) return;
    const newIndex = (activeIndex + 1) % images.length;
    setActiveIndex(newIndex);
    onNavigate?.(newIndex);
  };

  const goToPrevious = () => {
    if (images.length <= 1) return;
    const newIndex = (activeIndex - 1 + images.length) % images.length;
    setActiveIndex(newIndex);
    onNavigate?.(newIndex);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-slate-950/98 backdrop-blur-xl flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={handleBackdropClick}
        >
          {/* 关闭按钮 */}
          {showCloseButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50 border border-white/10 backdrop-blur-md"
              aria-label="关闭"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </motion.button>
          )}

          {/* 左箭头 */}
          {images.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 md:left-12 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50 border border-white/5 backdrop-blur-md"
              aria-label="上一张"
            >
              <ChevronLeft size={24} className="md:w-9 md:h-9" />
            </motion.button>
          )}

          {/* 右箭头 */}
          {images.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 md:right-12 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50 border border-white/5 backdrop-blur-md"
              aria-label="下一张"
            >
              <ChevronRight size={24} className="md:w-9 md:h-9" />
            </motion.button>
          )}

          {/* 图片容器 */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12 pointer-events-none"
          >
            <img
              src={images[activeIndex]}
              alt={`图片 ${activeIndex + 1}`}
              className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.png';
              }}
            />

            {/* 计数器 */}
            {showCounter && images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-8 md:bottom-10 px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-[10px] md:text-xs font-black tracking-widest border border-white/10"
              >
                {activeIndex + 1} / {images.length}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 用于在文章中自动为图片添加 lightbox 的包装组件
 */
interface ImageWithLightboxProps {
  src: string;
  alt?: string;
  className?: string;
  images?: string[];
}

export function ImageWithLightbox({
  src,
  alt = '',
  className = '',
  images,
}: ImageWithLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const allImages = images || [src];
  const currentIndex = allImages.indexOf(src);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-zoom-in hover:scale-[1.02] transition-transform duration-300 ${className}`}
        onClick={() => setIsOpen(true)}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder-image.png';
        }}
      />
      <ImageLightbox
        images={allImages}
        currentIndex={currentIndex >= 0 ? currentIndex : 0}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
