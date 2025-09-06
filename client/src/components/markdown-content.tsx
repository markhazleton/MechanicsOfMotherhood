import React from 'react';
import ReactMarkdown from 'react-markdown';
import { getDescriptionSummary } from '@/utils/markdown-helpers';

interface MarkdownContentProps {
  content: string;
  className?: string;
  summary?: boolean; // If true, show only first paragraph
  allowHtml?: boolean; // If true, render as HTML instead of markdown
}

/**
 * Component for safely rendering markdown or HTML content
 * Handles both markdown parsing and HTML sanitization
 */
export function MarkdownContent({ 
  content, 
  className = '', 
  summary = false,
  allowHtml = false 
}: MarkdownContentProps) {
  if (!content) return null;

  // For summary view, extract first paragraph
  const displayContent = summary ? getDescriptionSummary(content) : content;

  if (allowHtml) {
    // Render as HTML with basic sanitization
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ 
          __html: displayContent 
        }}
      />
    );
  }

  // Render as markdown using ReactMarkdown
  return (
    <div className={`prose prose-brand ${className}`}>
      <ReactMarkdown
        components={{
          // Custom components for better styling
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-medium mb-2">{children}</h3>,
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownContent;
