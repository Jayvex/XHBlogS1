/**
 * rehype-code-buttons 插件
 * 为代码块添加复制按钮和语言标识
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

interface RehypeCodeButtonsOptions {
  /**
   * 复制成功后的提示文案
   * @default '已复制'
   */
  copiedText?: string;

  /**
   * 复制按钮的默认文案
   * @default '复制'
   */
  copyText?: string;

  /**
   * 是否显示语言标签
   * @default true
   */
  showLanguage?: boolean;
}

export default function rehypeCodeButtons(options: RehypeCodeButtonsOptions = {}) {
  const {
    copiedText = '已复制',
    copyText = '复制',
    showLanguage = true,
  } = options;

  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      // 只处理 <pre> 标签
      if (node.tagName !== 'pre') return;

      // 检查是否有 <code> 子元素
      const codeElement = node.children?.find(
        (child): child is Element =>
          child.type === 'element' && child.tagName === 'code'
      );

      if (!codeElement) return;

      // 获取语言类型
      const className = codeElement.properties?.className;
      let language = '';

      if (Array.isArray(className)) {
        const langClass = className.find((cls: string) =>
          typeof cls === 'string' && cls.startsWith('language-')
        );
        if (langClass) {
          language = (langClass as string).replace('language-', '');
        }
      }

      // 获取代码内容
      const getCodeText = (node: Element): string => {
        let text = '';
        const walk = (n: any) => {
          if (n.type === 'text') {
            text += n.value;
          }
          if (n.children) {
            n.children.forEach(walk);
          }
        };
        walk(node);
        return text;
      };

      const codeText = getCodeText(codeElement);

      // 创建包装容器
      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['code-block-wrapper'],
          style: 'position: relative;',
        },
        children: [],
      };

      // 创建语言标签
      if (showLanguage && language) {
        const languageLabel: Element = {
          type: 'element',
          tagName: 'span',
          properties: {
            className: ['code-language-label'],
            style: 'position: absolute; top: 0.5rem; left: 0.75rem; font-size: 0.75rem; color: #94a3b8; background: rgba(30, 41, 59, 0.8); padding: 0.125rem 0.5rem; border-radius: 0.375rem; pointer-events: none; z-index: 1;',
          },
          children: [{ type: 'text', value: language }],
        };
        wrapper.children.push(languageLabel);
      }

      // 创建复制按钮
      const copyButton: Element = {
        type: 'element',
        tagName: 'button',
        properties: {
          className: ['code-copy-button'],
          'data-code': codeText,
          'data-copied-text': copiedText,
          'data-copy-text': copyText,
          style: 'position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; color: #94a3b8; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 0.375rem; cursor: pointer; opacity: 0; transition: all 0.2s ease; z-index: 10; backdrop-filter: blur(4px);',
          onclick: `
            (function() {
              var btn = this;
              var code = btn.getAttribute('data-code');
              var copiedText = btn.getAttribute('data-copied-text');
              var copyText = btn.getAttribute('data-copy-text');

              navigator.clipboard.writeText(code).then(function() {
                btn.textContent = copiedText;
                btn.style.color = '#4ade80';
                btn.style.borderColor = 'rgba(74, 222, 128, 0.3)';

                setTimeout(function() {
                  btn.textContent = copyText;
                  btn.style.color = '#94a3b8';
                  btn.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                }, 2000);
              }).catch(function(err) {
                console.error('复制失败:', err);
              });
            }).call(this)
          `,
        },
        children: [{ type: 'text', value: copyText }],
      };
      wrapper.children.push(copyButton);

      // 将原始 pre 标签添加到包装器
      wrapper.children.push(node);

      // 替换原始节点
      if (parent && typeof index === 'number') {
        parent.children[index] = wrapper;
      }
    });
  };
}
