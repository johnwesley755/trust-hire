import React from 'react';
import { useTranslate } from '../../hooks/useTranslate';

interface TranslateTextProps {
  text: string | null | undefined;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
}

/**
 * React 19 Virtual DOM-safe text translation component.
 * Renders translated string inside standard React elements without direct DOM manipulation.
 */
export const TranslateText: React.FC<TranslateTextProps> = ({
  text,
  className = '',
  as = 'span'
}) => {
  const translated = useTranslate(text);
  const Component = as;

  return <Component className={className}>{translated}</Component>;
};

export default TranslateText;
