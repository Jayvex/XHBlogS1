"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Link, X, Eye, EyeOff, GripVertical, Check, AlertCircle } from 'lucide-react';

interface ImageLinkInputProps {
  /**
   * 图片链接数组
   */
  value: string[];

  /**
   * 更新图片链接数组的回调
   */
  onChange: (urls: string[]) => void;

  /**
   * 最大图片数量
   * @default 9
   */
  maxImages?: number;

  /**
   * 是否显示预览
   * @default true
   */
  showPreview?: boolean;

  /**
   * 额外的 CSS 类名
   */
  className?: string;
}

export default function ImageLinkInput({
  value = [],
  onChange,
  maxImages = 9,
  showPreview = true,
  className = '',
}: ImageLinkInputProps) {
  const [inputUrl, setInputUrl] = useState('');
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // 验证图片链接是否有效
  const validateImageUrl = useCallback(async (url: string): Promise<boolean> => {
    try {
      setIsValidating(true);
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return contentType?.startsWith('image/') || false;
    } catch {
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  // 添加图片链接
  const handleAdd = useCallback(async () => {
    if (!inputUrl.trim()) return;

    if (value.length >= maxImages) {
      setError(`最多只能添加 ${maxImages} 张图片`);
      return;
    }

    // 检查是否已存在
    if (value.includes(inputUrl.trim())) {
      setError('该链接已存在');
      return;
    }

    // 验证链接
    const isValid = await validateImageUrl(inputUrl.trim());
    if (!isValid) {
      setError('无效的图片链接，请检查 URL 是否正确');
      return;
    }

    onChange([...value, inputUrl.trim()]);
    setInputUrl('');
    setError('');
    setSuccess('图片添加成功');
    setTimeout(() => setSuccess(''), 2000);
  }, [inputUrl, value, maxImages, validateImageUrl, onChange]);

  // 删除图片
  const handleRemove = useCallback((index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
    if (previewIndex === index) {
      setPreviewIndex(null);
    } else if (previewIndex !== null && previewIndex > index) {
      setPreviewIndex(previewIndex - 1);
    }
  }, [value, previewIndex, onChange]);

  // 拖拽排序
  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newValue = [...value];
    const draggedItem = newValue[dragIndex];
    newValue.splice(dragIndex, 1);
    newValue.splice(index, 0, draggedItem);
    onChange(newValue);
    setDragIndex(index);
  }, [dragIndex, value, onChange]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 输入区域 */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              setError('');
            }}
            placeholder="粘贴图片链接 (https://...)"
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            disabled={isValidating}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={isValidating || !inputUrl.trim()}
          className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isValidating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              验证中
            </>
          ) : (
            <>
              <Image size={16} />
              添加
            </>
          )}
        </button>
      </div>

      {/* 错误/成功提示 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-500 text-sm"
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-green-500 text-sm"
          >
            <Check size={14} />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 图片列表 */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url, index) => (
            <motion.div
              key={url}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                dragIndex === index
                  ? 'border-indigo-500 shadow-lg scale-105'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* 拖拽手柄 */}
              <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                <GripVertical size={16} className="text-white drop-shadow-md" />
              </div>

              {/* 图片 */}
              <img
                src={url}
                alt={`图片 ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                }}
              />

              {/* 操作按钮 */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setPreviewIndex(previewIndex === index ? null : index)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  title="预览"
                >
                  <Eye size={16} className="text-white" />
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors"
                  title="删除"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              {/* 序号 */}
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 预览区域 */}
      <AnimatePresence>
        {showPreview && previewIndex !== null && value[previewIndex] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
              <button
                onClick={() => setPreviewIndex(null)}
                className="absolute top-2 right-2 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <EyeOff size={16} />
              </button>
              <img
                src={value[previewIndex]}
                alt="预览"
                className="max-w-full max-h-96 mx-auto rounded-lg"
              />
              <p className="text-center text-sm text-slate-500 mt-2">
                图片 {previewIndex + 1} / {value.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示信息 */}
      <p className="text-xs text-slate-400">
        支持常见图床链接（GitHub、SM.MS、Imgur、七牛云等），最多 {maxImages} 张图片，可拖拽排序
      </p>
    </div>
  );
}
