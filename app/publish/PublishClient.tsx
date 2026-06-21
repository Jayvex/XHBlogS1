"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MessageSquare, BookOpen, Send, Save, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MarkdownEditor from '../../components/MarkdownEditor';
import ImageLinkInput from '../../components/ImageLinkInput';

type ContentType = 'post' | 'moment' | 'chatter';

interface PostFormData {
  title: string;
  content: string;
  tags: string[];
  series: {
    name: string;
    order: number;
    total: number;
  } | null;
  cover: string;
  description: string;
  status: 'draft' | 'published';
}

interface MomentFormData {
  content: string;
  location: string;
  images: string[];
  status: 'draft' | 'published';
}

interface ChatterFormData {
  title: string;
  content: string;
  tags: string[];
  mood: string;
  cover: string;
  status: 'draft' | 'published';
}

export default function PublishClient() {
  const [contentType, setContentType] = useState<ContentType>('post');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 文章表单
  const [postForm, setPostForm] = useState<PostFormData>({
    title: '',
    content: '',
    tags: [],
    series: null,
    cover: '',
    description: '',
    status: 'published',
  });

  // 说说表单
  const [momentForm, setMomentForm] = useState<MomentFormData>({
    content: '',
    location: '',
    images: [],
    status: 'published',
  });

  // 杂谈表单
  const [chatterForm, setChatterForm] = useState<ChatterFormData>({
    title: '',
    content: '',
    tags: [],
    mood: '',
    cover: '',
    status: 'published',
  });

  // 标签输入
  const [tagInput, setTagInput] = useState('');

  // 添加标签
  const handleAddTag = useCallback((formType: 'post' | 'chatter') => {
    if (!tagInput.trim()) return;

    const tag = tagInput.trim();
    if (formType === 'post') {
      if (!postForm.tags.includes(tag)) {
        setPostForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      }
    } else {
      if (!chatterForm.tags.includes(tag)) {
        setChatterForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      }
    }
    setTagInput('');
  }, [tagInput, postForm.tags, chatterForm.tags]);

  // 删除标签
  const handleRemoveTag = useCallback((formType: 'post' | 'chatter', tagToRemove: string) => {
    if (formType === 'post') {
      setPostForm(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove),
      }));
    } else {
      setChatterForm(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove),
      }));
    }
  }, []);

  // 提交表单
  const handleSubmit = useCallback(async (status: 'draft' | 'published') => {
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      let response;

      if (contentType === 'post') {
        response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...postForm, status }),
        });
      } else if (contentType === 'moment') {
        response = await fetch('/api/moments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...momentForm, status }),
        });
      } else {
        response = await fetch('/api/chatters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...chatterForm, status }),
        });
      }

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });

        // 重置表单
        if (contentType === 'post') {
          setPostForm({
            title: '',
            content: '',
            tags: [],
            series: null,
            cover: '',
            description: '',
            status: 'published',
          });
        } else if (contentType === 'moment') {
          setMomentForm({
            content: '',
            location: '',
            images: [],
            status: 'published',
          });
        } else {
          setChatterForm({
            title: '',
            content: '',
            tags: [],
            mood: '',
            cover: '',
            status: 'published',
          });
        }
      } else {
        setMessage({ type: 'error', text: data.error || '发布失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  }, [contentType, postForm, momentForm, chatterForm]);

  // 内容类型选项
  const contentTypes = [
    { key: 'post', label: '文章', icon: <FileText size={20} />, description: '长文内容，支持系列' },
    { key: 'moment', label: '说说', icon: <MessageSquare size={20} />, description: '短文动态，支持图片' },
    { key: 'chatter', label: '杂谈', icon: <BookOpen size={20} />, description: '随笔记录，支持标签' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10 pt-24 md:pt-28 relative z-10">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-500 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          返回首页
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          发布内容
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          选择内容类型，开始创作
        </p>
      </motion.div>

      {/* 内容类型选择 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {contentTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setContentType(type.key as ContentType)}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
              contentType === type.key
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className={`mb-2 ${contentType === type.key ? 'text-indigo-500' : 'text-slate-400'}`}>
              {type.icon}
            </div>
            <h3 className={`font-bold text-sm ${contentType === type.key ? 'text-indigo-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {type.label}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{type.description}</p>
          </button>
        ))}
      </motion.div>

      {/* 消息提示 */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl mb-6 ${
              message.type === 'success'
                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 表单内容 */}
      <motion.div
        key={contentType}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* 文章表单 */}
        {contentType === 'post' && (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                标题 *
              </label>
              <input
                type="text"
                value={postForm.title}
                onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="输入文章标题"
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                描述
              </label>
              <input
                type="text"
                value={postForm.description}
                onChange={(e) => setPostForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="文章简介（可选）"
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                封面图链接
              </label>
              <input
                type="url"
                value={postForm.cover}
                onChange={(e) => setPostForm(prev => ({ ...prev, cover: e.target.value }))}
                placeholder="https://example.com/cover.jpg"
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                标签
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="输入标签"
                  className="flex-1 px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag('post')}
                />
                <button
                  onClick={() => handleAddTag('post')}
                  className="px-4 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors"
                >
                  添加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {postForm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag('post', tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                内容 *
              </label>
              <MarkdownEditor
                value={postForm.content}
                onChange={(content) => setPostForm(prev => ({ ...prev, content }))}
                placeholder="开始写作..."
                minHeight={400}
              />
            </div>
          </>
        )}

        {/* 说说表单 */}
        {contentType === 'moment' && (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                内容 *
              </label>
              <textarea
                value={momentForm.content}
                onChange={(e) => setMomentForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="分享此刻的想法..."
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-h-[150px] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                位置
              </label>
              <input
                type="text"
                value={momentForm.location}
                onChange={(e) => setMomentForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="📍 你现在在哪里？"
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                图片
              </label>
              <ImageLinkInput
                value={momentForm.images}
                onChange={(images) => setMomentForm(prev => ({ ...prev, images }))}
                maxImages={9}
              />
            </div>
          </>
        )}

        {/* 杂谈表单 */}
        {contentType === 'chatter' && (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                标题 *
              </label>
              <input
                type="text"
                value={chatterForm.title}
                onChange={(e) => setChatterForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="输入杂谈标题"
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                心情
              </label>
              <input
                type="text"
                value={chatterForm.mood}
                onChange={(e) => setChatterForm(prev => ({ ...prev, mood: e.target.value }))}
                placeholder="😊 开心、😢 难过、🤔 思考..."
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                封面图链接
              </label>
              <input
                type="url"
                value={chatterForm.cover}
                onChange={(e) => setChatterForm(prev => ({ ...prev, cover: e.target.value }))}
                placeholder="https://example.com/cover.jpg"
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                标签
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="输入标签"
                  className="flex-1 px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag('chatter')}
                />
                <button
                  onClick={() => handleAddTag('chatter')}
                  className="px-4 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors"
                >
                  添加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {chatterForm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag('chatter', tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                内容 *
              </label>
              <MarkdownEditor
                value={chatterForm.content}
                onChange={(content) => setChatterForm(prev => ({ ...prev, content }))}
                placeholder="写下你的想法..."
                minHeight={300}
              />
            </div>
          </>
        )}

        {/* 提交按钮 */}
        <div className="flex items-center gap-4 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            保存草稿
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                发布中...
              </>
            ) : (
              <>
                <Send size={16} />
                发布
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
