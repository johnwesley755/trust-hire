import { useEffect, useRef, useCallback } from 'react';
import { useTranslation, type SupportedLanguage } from '../providers/TranslationContext';

// HTML elements whose children should never be translated
const IGNORED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'CODE',
  'PRE',
  'SVG',
  'PATH',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'CANVAS',
  'AUDIO',
  'VIDEO'
]);

// Tokens to ignore (language codes, initials, pure units)
const IGNORED_WORDS = new Set(['en', 'hi', 'ta', 'te', 'eng', 'hin', 'tam', 'tel', 'id', 'pwa']);

/**
 * Enterprise Full-Page Safe DOM Translation Hook.
 * Scans all visible text nodes in the DOM, preserves React 19 Virtual DOM stability
 * by updating textNode.nodeValue in place without injecting tags, stores original
 * text in a WeakMap for 0ms reversible switching, and observes dynamic mutations.
 */
export const useFullPageTranslator = () => {
  const { language, batchTranslateTexts, getCachedTranslation, getStaticTranslation } = useTranslation();

  // Stores original English text for each DOM text node: WeakMap<Node, originalEnglishText>
  const originalTextMapRef = useRef<WeakMap<Node, string>>(new WeakMap());

  // Tracked active text nodes for rapid reversal to English
  const activeNodesRef = useRef<Set<Node>>(new Set());

  // Stores original English placeholder for inputs/textareas
  const originalPlaceholderMapRef = useRef<WeakMap<Element, string>>(new WeakMap());
  const activePlaceholdersRef = useRef<Set<HTMLInputElement | HTMLTextAreaElement>>(new Set());

  // In-flight text set to prevent duplicate concurrent network queries
  const inFlightTextsRef = useRef<Set<string>>(new Set());

  // Mutating flag to prevent MutationObserver infinite self-trigger loops
  const isUpdatingRef = useRef<boolean>(false);

  // Debounce timer for dynamic DOM updates
  const debounceTimerRef = useRef<any>(null);

  /**
   * Check if a text node is valid for translation
   */
  const isValidTextNode = useCallback((node: Node): boolean => {
    const parent = node.parentElement;
    if (!parent) return false;

    // Skip ignored element tags
    if (IGNORED_TAGS.has(parent.tagName.toUpperCase())) return false;

    // Skip elements with translation disabled
    if (parent.closest('[translate="no"], [data-no-translate="true"], .user-avatar, .avatar-initials')) return false;

    const val = node.nodeValue;
    if (!val) return false;
    const trimmed = val.trim();

    // Skip empty, single letters, pure numbers, or symbols
    if (!trimmed || trimmed.length < 2) return false;
    if (IGNORED_WORDS.has(trimmed.toLowerCase())) return false;
    if (/^[\d\s\p{P}\p{S}]+$/u.test(trimmed)) return false;

    // Skip email addresses or URLs
    if (trimmed.includes('@') && trimmed.includes('.')) return false;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return false;

    return true;
  }, []);

  /**
   * Restore all translated text nodes and placeholders to original English
   */
  const restoreOriginalEnglish = useCallback(() => {
    isUpdatingRef.current = true;
    try {
      // 1. Restore text nodes
      activeNodesRef.current.forEach((node) => {
        if (node.isConnected) {
          const original = originalTextMapRef.current.get(node);
          if (original !== undefined && node.nodeValue !== original) {
            node.nodeValue = original;
          }
        }
      });
      activeNodesRef.current.clear();

      // 2. Restore placeholders
      activePlaceholdersRef.current.forEach((el) => {
        if (el.isConnected) {
          const original = originalPlaceholderMapRef.current.get(el);
          if (original !== undefined && el.placeholder !== original) {
            el.placeholder = original;
          }
        }
      });
      activePlaceholdersRef.current.clear();
      inFlightTextsRef.current.clear();
    } finally {
      isUpdatingRef.current = false;
    }
  }, []);

  /**
   * Scan and translate all text nodes and placeholders under root
   */
  const translateDom = useCallback(
    async (targetLang: SupportedLanguage) => {
      if (targetLang === 'en') {
        restoreOriginalEnglish();
        return;
      }

      const root = document.getElementById('root') || document.body;
      if (!root) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node: Node) => {
          return isValidTextNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });

      const nodesToTranslate: { node: Node; originalText: string; leading: string; trailing: string }[] = [];
      const placeholdersToTranslate: { el: HTMLInputElement | HTMLTextAreaElement; original: string }[] = [];
      const textsToFetchSet = new Set<string>();

      // 1. Scan text nodes
      let currentNode = walker.nextNode();
      while (currentNode) {
        const fullVal = currentNode.nodeValue || '';
        // Check if we already stored original English text for this node
        let originalText = originalTextMapRef.current.get(currentNode);
        if (!originalText) {
          originalText = fullVal;
          originalTextMapRef.current.set(currentNode, originalText);
        }

        const trimmed = originalText.trim();
        // Only translate if it contains alphabetic characters (Latin source)
        if (trimmed && /[a-zA-Z]/.test(trimmed) && !/^[\d\s\p{P}\p{S}]+$/u.test(trimmed) && !IGNORED_WORDS.has(trimmed.toLowerCase())) {
          const leading = originalText.match(/^\s*/)?.[0] || '';
          const trailing = originalText.match(/\s*$/)?.[0] || '';

          nodesToTranslate.push({
            node: currentNode,
            originalText: trimmed,
            leading,
            trailing
          });
          activeNodesRef.current.add(currentNode);

          // Check static dictionary or dynamic cache (0ms instant resolution)
          const fastTranslation = getStaticTranslation?.(trimmed) || getCachedTranslation(trimmed);
          if (fastTranslation) {
            if (currentNode.nodeValue !== `${leading}${fastTranslation}${trailing}`) {
              isUpdatingRef.current = true;
              currentNode.nodeValue = `${leading}${fastTranslation}${trailing}`;
              isUpdatingRef.current = false;
            }
          } else if (!inFlightTextsRef.current.has(trimmed)) {
            textsToFetchSet.add(trimmed);
          }
        }

        currentNode = walker.nextNode();
      }

      // 2. Scan input & textarea placeholders
      const placeholderElements = root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[placeholder], textarea[placeholder]');
      placeholderElements.forEach((el) => {
        if (el.closest('[translate="no"], [data-no-translate="true"]')) return;
        const currentPlaceholder = el.placeholder;
        if (!currentPlaceholder) return;

        let original = originalPlaceholderMapRef.current.get(el);
        if (!original) {
          original = currentPlaceholder;
          originalPlaceholderMapRef.current.set(el, original);
        }

        const trimmed = original.trim();
        if (trimmed && /[a-zA-Z]/.test(trimmed) && !IGNORED_WORDS.has(trimmed.toLowerCase())) {
          placeholdersToTranslate.push({ el, original: trimmed });
          activePlaceholdersRef.current.add(el);

          // Check static dictionary or dynamic cache (0ms instant resolution)
          const fastTranslation = getStaticTranslation?.(trimmed) || getCachedTranslation(trimmed);
          if (fastTranslation) {
            if (el.placeholder !== fastTranslation) {
              el.placeholder = fastTranslation;
            }
          } else if (!inFlightTextsRef.current.has(trimmed)) {
            textsToFetchSet.add(trimmed);
          }
        }
      });

      // 3. Batch fetch missing translations
      const textsToFetch = Array.from(textsToFetchSet);
      if (textsToFetch.length > 0) {
        // Mark all as in-flight
        textsToFetch.forEach(t => inFlightTextsRef.current.add(t));

        try {
          const translations = await batchTranslateTexts(textsToFetch);
          isUpdatingRef.current = true;

          // Apply to text nodes
          nodesToTranslate.forEach(({ node, originalText, leading, trailing }) => {
            if (node.isConnected && translations[originalText]) {
              node.nodeValue = `${leading}${translations[originalText]}${trailing}`;
            }
          });

          // Apply to placeholders
          placeholdersToTranslate.forEach(({ el, original }) => {
            if (el.isConnected && translations[original]) {
              el.placeholder = translations[original];
            }
          });
        } catch (err) {
          console.warn('[useFullPageTranslator] Failed to apply translations:', err);
        } finally {
          // Clear in-flight flags
          textsToFetch.forEach(t => inFlightTextsRef.current.delete(t));
          isUpdatingRef.current = false;
        }
      }
    },
    [batchTranslateTexts, getCachedTranslation, isValidTextNode, restoreOriginalEnglish]
  );

  // Trigger translation when language changes
  useEffect(() => {
    translateDom(language);
  }, [language, translateDom]);

  // Set up MutationObserver to translate new content (e.g. route changes, dialogs, newly rendered cards)
  useEffect(() => {
    if (language === 'en') {
      return;
    }

    const targetNode = document.getElementById('root') || document.body;
    if (!targetNode) return;

    const observer = new MutationObserver((mutations) => {
      if (isUpdatingRef.current) return;

      let hasRelevantMutations = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
          hasRelevantMutations = true;
          break;
        }
        if (mutation.type === 'characterData') {
          // If a text node changed and wasn't our own update
          const target = mutation.target;
          const orig = originalTextMapRef.current.get(target);
          if (!orig || target.nodeValue === orig) {
            hasRelevantMutations = true;
            break;
          }
        }
      }

      if (hasRelevantMutations) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        // 200ms debounce ensures all child components finish mounting before TreeWalker runs
        debounceTimerRef.current = setTimeout(() => {
          translateDom(language);
        }, 200);
      }
    });

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      observer.disconnect();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [language, translateDom]);

  return { translateDom };
};

export default useFullPageTranslator;
