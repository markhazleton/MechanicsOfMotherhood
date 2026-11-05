import React from 'react';
import ReactMarkdown from 'react-markdown';
import { getDescriptionSummary } from '@/utils/markdown-helpers';

interface MarkdownContentProps {
  content: string;
  className?: string;
  summary?: boolean; // If true, show only first paragraph
}

/**
 * Component for safely rendering markdown or HTML content
 * Handles both markdown parsing and HTML sanitization
 */
export function MarkdownContent({ 
  content, 
  className = '', 
  summary = false
}: MarkdownContentProps) {
  if (!content) return null;

  // For summary view, extract first paragraph
  const displayContent = summary ? getDescriptionSummary(content) : content;

  // Render as markdown using ReactMarkdown
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          // Custom components for better styling
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          a: ({ children, href }) => <a href={href} className="font-medium text-link underline underline-offset-2 hover:text-link-hover">{children}</a>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
          h1: ({ children }) => <h2 className="font-display text-2xl font-bold text-foreground mb-4">{children}</h2>,
          h2: ({ children }) => <h3 className="font-display text-xl font-bold text-foreground mb-3">{children}</h3>,
          h3: ({ children }) => <h4 className="font-display text-lg font-semibold text-foreground mb-2">{children}</h4>,
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownContent;
