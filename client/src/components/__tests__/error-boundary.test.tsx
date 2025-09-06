import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from '@/components/error-boundary';

function ProblemChild() {
  throw new Error('Boom');
  return null;
}

describe('ErrorBoundary', () => {
  let originalError: typeof console.error;
  beforeAll(() => {
    // Silence expected React error logging for the intentional test crash
    originalError = console.error;
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders fallback UI when child throws', () => {
    const { getByText, container } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(getByText(/Something went wrong/i)).toBeInTheDocument();
    // Snapshot (strip dynamic pieces like stack traces / error codes)
    const html = container.innerHTML
      .replace(/code>.*?<\/code>/g, 'code>ErrorName</code>')
      .replace(/Error Details \(Development\)[\s\S]*/g, '');
    expect(html).toMatchSnapshot();
  });

  it('renders children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Safe Child</div>
      </ErrorBoundary>
    );
    expect(getByText('Safe Child')).toBeInTheDocument();
  });
});
