"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import ImageLightbox from './ImageLightbox';

interface ArticleContentProps {
  /**
   * HTML 内容
   */
  contentHtml: string;

  /**
   * 额外的 CSS 类名
   */
  className?: string;
}

export default function ArticleContent({ contentHtml, className = '' }: ArticleContentProps) {
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  const contentRef = useRef<HTMLDivElement>(null);

  // 收集所有图片链接
  const collectImages = useCallback((): string[] => {
    if (!contentRef.current) return [];
    const imgElements = contentRef.current.querySelectorAll('img');
    return Array.from(imgElements).map((img) => img.src);
  }, []);

  // 处理图片点击
  const handleImageClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLImageElement;
    if (target.tagName !== 'IMG') return;

    // 检查是否在代码块内
    const parentPre = target.closest('pre');
    if (parentPre) return;

    e.preventDefault();
    e.stopPropagation();

    const images = collectImages();
    const currentIndex = images.indexOf(target.src);

    setLightboxState({
      isOpen: true,
      images,
      currentIndex: currentIndex >= 0 ? currentIndex : 0,
    });
  }, [collectImages]);

  // 关闭 lightbox
  const handleClose = useCallback(() => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // 导航到指定图片
  const handleNavigate = useCallback((index: number) => {
    setLightboxState((prev) => ({ ...prev, currentIndex: index }));
  }, []);

  // 添加事件监听
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    contentElement.addEventListener('click', handleImageClick as EventListener);

    // 为所有图片添加样式
    const images = contentElement.querySelectorAll('img');
    images.forEach((img) => {
      // 跳过代码块内的图片
      if (img.closest('pre')) return;

      img.style.cursor = 'zoom-in';
      img.style.transition = 'transform 0.3s ease';

      // 添加悬停效果
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.02)';
      });
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    });

    return () => {
      contentElement.removeEventListener('click', handleImageClick as EventListener);
    };
  }, [contentHtml, handleImageClick]);

  return (
    <>
      <div
        ref={contentRef}
        id="article-content"
        className={className}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <ImageLightbox
        images={lightboxState.images}
        currentIndex={lightboxState.currentIndex}
        isOpen={lightboxState.isOpen}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    </>
  );
}
