import React, { useEffect } from 'react';

export interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

const DEFAULT_TITLE = 'TrustHyre | Trusted talent. Better hiring.';
const DEFAULT_DESCRIPTION = "India's premier verified skilled workforce and talent hiring network with skill verification and direct employer matching.";
const BASE_DOMAIN = 'https://trusthyre.com';

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '',
  ogType = 'website',
  ogImage = `${BASE_DOMAIN}/logo.png`,
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title ? `${title} | TrustHyre` : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', contentVal);
    };

    // 3. Helper to set or create canonical link
    const setCanonicalLink = (url: string) => {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    };

    const fullUrl = `${BASE_DOMAIN}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

    // Update standard meta
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setCanonicalLink(fullUrl);

    // Update Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', fullUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);

    // Update Twitter
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', fullUrl);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 4. Inject Dynamic Schema.org JSON-LD if provided
    let scriptTag: HTMLScriptElement | null = null;
    if (jsonLd) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'dynamic-seo-jsonld';
      scriptTag.text = JSON.stringify(jsonLd);
      document.head.appendChild(scriptTag);
    }

    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [title, description, canonicalPath, ogType, ogImage, jsonLd]);

  return null;
};
