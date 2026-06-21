/**
 * rehype-image-lightbox 插件
 * 为图片添加 lightbox 功能
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

interface RehypeImageLightboxOptions {
  /**
   * 是否启用 lightbox
   * @default true
   */
  enabled?: boolean;
}

export default function rehypeImageLightbox(options: RehypeImageLightboxOptions = {}) {
  const { enabled = true } = options;

  if (!enabled) return (tree: Root) => tree;

  return (tree: Root) => {
    // 收集所有图片链接
    const imageUrls: string[] = [];

    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img' && node.properties?.src) {
        imageUrls.push(node.properties.src as string);
      }
    });

    // 为每个图片添加 lightbox 属性
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img') return;

      const src = node.properties?.src as string;
      if (!src) return;

      // 添加自定义属性，用于客户端 JavaScript 处理
      node.properties = {
        ...node.properties,
        'data-lightbox': 'true',
        'data-images': JSON.stringify(imageUrls),
        'data-current-index': imageUrls.indexOf(src).toString(),
        class: `${node.properties?.class || ''} cursor-zoom-in`.trim(),
        style: `${node.properties?.style || ''} transition: transform 0.3s ease;`.trim(),
      };
    });
  };
}
