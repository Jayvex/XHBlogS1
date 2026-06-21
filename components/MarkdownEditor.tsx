"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link, Image, Minus, CheckSquare,
  Eye, EyeOff, Maximize2, Minimize2
} from 'lucide-react';

interface MarkdownEditorProps {
  /**
   * 编辑器内容
   */
  value: string;

  /**
   * 内容变化回调
   */
  onChange: (value: string) => void;

  /**
   * 占位符
   * @default '开始写作...'
   */
  placeholder?: string;

  /**
   * 最小高度
   * @default 300
   */
  minHeight?: number;

  /**
   * 最大高度
   * @default 600
   */
  maxHeight?: number;

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

interface ToolbarButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  isActive?: boolean;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = '开始写作...',
  minHeight = 300,
  maxHeight = 600,
  showPreview = true,
  className = '',
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 插入文本
  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // 恢复光标位置
    setTimeout(() => {
      textarea.focus();
      const newStart = start + before.length;
      const newEnd = newStart + selectedText.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  }, [value, onChange]);

  // 插入行首文本
  const insertLinePrefix = useCallback((prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  }, [value, onChange]);

  // 工具栏按钮
  const toolbarButtons: ToolbarButton[] = [
    {
      icon: <Bold size={16} />,
      label: '加粗',
      action: () => insertText('**', '**'),
    },
    {
      icon: <Italic size={16} />,
      label: '斜体',
      action: () => insertText('*', '*'),
    },
    {
      icon: <Strikethrough size={16} />,
      label: '删除线',
      action: () => insertText('~~', '~~'),
    },
    {
      icon: <Code size={16} />,
      label: '行内代码',
      action: () => insertText('`', '`'),
    },
    {
      icon: <Heading1 size={16} />,
      label: '一级标题',
      action: () => insertLinePrefix('# '),
    },
    {
      icon: <Heading2 size={16} />,
      label: '二级标题',
      action: () => insertLinePrefix('## '),
    },
    {
      icon: <Heading3 size={16} />,
      label: '三级标题',
      action: () => insertLinePrefix('### '),
    },
    {
      icon: <List size={16} />,
      label: '无序列表',
      action: () => insertLinePrefix('- '),
    },
    {
      icon: <ListOrdered size={16} />,
      label: '有序列表',
      action: () => insertLinePrefix('1. '),
    },
    {
      icon: <Quote size={16} />,
      label: '引用',
      action: () => insertLinePrefix('> '),
    },
    {
      icon: <CheckSquare size={16} />,
      label: '任务列表',
      action: () => insertLinePrefix('- [ ] '),
    },
    {
      icon: <Link size={16} />,
      label: '链接',
      action: () => insertText('[', '](url)'),
    },
    {
      icon: <Image size={16} />,
      label: '图片',
      action: () => insertText('![alt](', ')'),
    },
    {
      icon: <Minus size={16} />,
      label: '分割线',
      action: () => insertText('\n---\n'),
    },
    {
      icon: <Code size={16} />,
      label: '代码块',
      action: () => insertText('\n```\n', '\n```\n'),
    },
  ];

  // 键盘快捷键
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertText('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertText('*', '*');
          break;
        case 'k':
          e.preventDefault();
          insertText('[', '](url)');
          break;
        case '`':
          e.preventDefault();
          insertText('`', '`');
          break;
      }
    }
  }, [insertText]);

  // 全屏切换
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  return (
    <div
      className={`bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/10 shadow-xl overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      } ${className}`}
    >
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              title={button.label}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              {button.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {showPreview && (
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded-lg transition-colors ${
                isPreview
                  ? 'text-indigo-500 bg-indigo-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-indigo-500 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
              title={isPreview ? '编辑模式' : '预览模式'}
            >
              {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
            title={isFullscreen ? '退出全屏' : '全屏'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* 编辑器内容 */}
      <div className="flex">
        {/* 编辑区域 */}
        {!isPreview && (
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full p-4 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none resize-none font-mono text-sm leading-relaxed"
              style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
            />
          </div>
        )}

        {/* 预览区域 */}
        {isPreview && (
          <div className="flex-1 p-4 overflow-auto" style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {value ? (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {value}
                </pre>
              ) : (
                <p className="text-slate-400 italic">暂无内容</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>字数: {value.length}</span>
          <span>行数: {value.split('\n').length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-slate-200/50 dark:bg-slate-700/50 rounded">
            Markdown
          </span>
        </div>
      </div>
    </div>
  );
}
