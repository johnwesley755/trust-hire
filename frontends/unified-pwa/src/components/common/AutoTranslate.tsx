import React, { useMemo } from 'react';
import { useTranslation } from '../../providers/TranslationContext';

interface AutoTranslateProps {
  children: React.ReactNode;
}

// Elements that should never have their contents translated
const IGNORED_TAGS = new Set(['script', 'style', 'code', 'pre', 'svg', 'path', 'noscript', 'canvas']);

/**
 * React 19 Virtual DOM-safe automatic string translator.
 * Recursively scans JSX children before DOM commit and dynamically translates
 * all user-visible text strings without modifying the physical DOM.
 */
export const AutoTranslate: React.FC<AutoTranslateProps> = ({ children }) => {
  const { language, translate } = useTranslation();

  const translatedContent = useMemo(() => {
    // If language is English, return children as-is with zero overhead
    if (language === 'en') {
      return children;
    }

    const transformNode = (node: React.ReactNode): React.ReactNode => {
      // 1. If it's a plain string, translate it dynamically
      if (typeof node === 'string') {
        const trimmed = node.trim();
        // Skip pure numbers, punctuation, whitespace, single characters or symbols
        if (!trimmed || /^[\d\s\p{P}\p{S}]+$/u.test(trimmed)) {
          return node;
        }
        const translated = translate(trimmed);
        // Preserve surrounding whitespace
        const leadingSpace = node.match(/^\s*/)?.[0] || '';
        const trailingSpace = node.match(/\s*$/)?.[0] || '';
        return `${leadingSpace}${translated}${trailingSpace}`;
      }

      // 2. Numbers, booleans, null, undefined pass through unchanged
      if (typeof node !== 'object' || node === null) {
        return node;
      }

      // 3. Arrays (e.g. multiple sibling children)
      if (Array.isArray(node)) {
        return node.map((child, index) => {
          const key = (React.isValidElement(child) && child.key != null) ? child.key : index;
          return <React.Fragment key={key}>{transformNode(child)}</React.Fragment>;
        });
      }

      // 4. React Elements
      if (React.isValidElement(node)) {
        // Skip ignored tags (code, svg, script, etc.) or nodes marked with translate="no"
        const elementProps = node.props as any;
        const tagName = typeof node.type === 'string' ? node.type.toLowerCase() : '';
        if (IGNORED_TAGS.has(tagName) || elementProps?.['translate'] === 'no' || elementProps?.['data-no-translate']) {
          return node;
        }

        // Recursively translate children if present
        if (elementProps && 'children' in elementProps && elementProps.children !== undefined) {
          const newChildren = transformNode(elementProps.children);
          return React.cloneElement(node, {
            ...elementProps,
            children: newChildren
          });
        }

        return node;
      }

      return node;
    };

    return transformNode(children);
  }, [children, language, translate]);

  return <>{translatedContent}</>;
};

export default AutoTranslate;
