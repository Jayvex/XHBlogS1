"use client";

import Giscus from '@giscus/react';
import { siteConfig } from '../siteConfig';

// 🌟 专门为炼金实验室定制的 Giscus 组件
export default function LabComments({ pageId }: { pageId?: string }) {
  return (
    <div className="w-full mt-16 relative">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none z-0"></div>

      {/* 🌟 Giscus 评论容器 */}
      <div className="relative z-10 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
        <Giscus
          id="comments"
          repo={siteConfig.giscusConfig.repo as `${string}/${string}`}
          repoId={siteConfig.giscusConfig.repoId}
          category={siteConfig.giscusConfig.category}
          categoryId={siteConfig.giscusConfig.categoryId}
          mapping="specific"
          term={pageId}
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="zh-CN"
          loading="lazy"
        />
      </div>
    </div>
  );
}
