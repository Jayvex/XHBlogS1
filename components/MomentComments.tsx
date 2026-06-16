"use client";

import Giscus from '@giscus/react';
import { siteConfig } from '../siteConfig';

interface MomentCommentsProps {
  id: string; // 必须传入说说的专属 ID
}

export default function MomentComments({ id }: MomentCommentsProps) {
  return (
    <div className="w-full relative">
      <Giscus
        id="comments"
        repo={siteConfig.giscusConfig.repo as `${string}/${string}`}
        repoId={siteConfig.giscusConfig.repoId}
        category={siteConfig.giscusConfig.category}
        categoryId={siteConfig.giscusConfig.categoryId}
        mapping="specific"
        term={id}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
