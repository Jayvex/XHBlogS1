"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Link, X, Eye, EyeOff, GripVertical, Check, AlertCircle, Upload, Clipboard } from 'lucide-react';

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

// PicX 图床链接格式
const PICX_PATTERNS = [
  /^https?:\/\/cdn\.jsdelivr\.net\/gh\/.+\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i,
  /^https?:\/\/raw\.githubusercontent\.com\/.+\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i,
  /^https?:\/\/picx\.xzlbz\.com\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i,
  /^https?:\/\/s2\.loli\.net\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i,
  /^https?:\/\/i\.imgur\.com\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i,
];

// 常见图床链接格式
const IMAGE_URL_PATTERNS = [
  ...PICX_PATTERNS,
  /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i,
  /^https?:\/\/images\.unsplash\.com\/.*/i,
  /^https?:\/\/.+\/photo-.*/i,
];

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
  const [showPicXTips, setShowPicXTips] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 检测是否为 PicX 图床链接
  const isPicXUrl = useCallback((url: string): boolean => {
    return PICX_PATTERNS.some(pattern => pattern.test(url));
  }, []);

  // 验证图片链接是否有效
  const validateImageUrl = useCallback(async (url: string): Promise<boolean> => {
    try {
      setIsValidating(true);

      // 如果是 PicX 图床链接，直接通过格式验证
      if (isPicXUrl(url)) {
        return true;
      }

      // 其他链接尝试 HEAD 请求验证
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      // no-cors 模式下无法读取 contentType，所以只要请求成功就认为有效
      return true;
    } catch {
      // 如果 HEAD 请求失败，尝试通过创建 Image 对象验证
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        // 5秒超时
        setTimeout(() => resolve(false), 5000);
      });
    } finally {
      setIsValidating(false);
    }
  }, [isPicXUrl]);

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

  // 从剪贴板粘贴
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        setInputUrl(text);
        setError('');
      } else {
        setError('剪贴板中没有有效的图片链接');
      }
    } catch {
      setError('无法读取剪贴板');
    }
  }, []);

  // 监听粘贴事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && document.activeElement === inputRef.current) {
        // 让浏览器默认处理粘贴
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      {/* PicX 图床提示 */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Upload size={16} className="text-blue-500" />
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">PicX 图床支持</span>
          </div>
          <button
            onClick={() => setShowPicXTips(!showPicXTips)}
            className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
          >
            {showPicXTips ? '收起' : '查看说明'}
          </button>
        </div>

        <AnimatePresence>
          {showPicXTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 mt-2">
                <p>支持 PicX 图床的所有链接格式：</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>jsdelivr CDN: <code className="bg-slate-200/50 dark:bg-slate-700/50 px-1 rounded">cdn.jsdelivr.net/gh/...</code></li>
                  <li>GitHub 原始: <code className="bg-slate-200/50 dark:bg-slate-700/50 px-1 rounded">raw.githubusercontent.com/...</code></li>
                  <li>PicX 官方: <code className="bg-slate-200/50 dark:bg-slate-700/50 px-1 rounded">picx.xzlbz.com/...</code></li>
                </ul>
                <p className="text-blue-500">
                  💡 提示：在 PicX 中复制图片链接后，直接粘贴到输入框即可
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 输入区域 */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="url"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              setError('');
            }}
            placeholder="粘贴图片链接 (支持 PicX、GitHub、SM.MS 等图床)"
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            onPaste={(e) => {
              // 自动检测粘贴的 PicX 链接
              const text = e.clipboardData.getData('text');
              if (isPicXUrl(text)) {
                e.preventDefault();
                setInputUrl(text);
                setError('');
              }
            }}
            disabled={isValidating}
          />
        </div>
        <button
          onClick={handlePaste}
          className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          title="从剪贴板粘贴"
        >
          <Clipboard size={16} />
        </button>
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

              {/* PicX 图床标识 */}
              {isPicXUrl(url) && (
                <div className="absolute top-2 left-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2 py-0.5 bg-blue-500/80 text-white text-[10px] rounded-full backdrop-blur-sm">
                    PicX
                  </span>
                </div>
              )}

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
              <div className="flex items-center justify-center gap-4 mt-2">
                <p className="text-sm text-slate-500">
                  图片 {previewIndex + 1} / {value.length}
                </p>
                {isPicXUrl(value[previewIndex]) && (
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-xs rounded-full">
                    PicX 图床
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示信息 */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          支持 PicX、GitHub、SM.MS、Imgur 等图床，最多 {maxImages} 张图片
        </span>
        <span>可拖拽排序</span>
      </div>
    </div>
  );
}
