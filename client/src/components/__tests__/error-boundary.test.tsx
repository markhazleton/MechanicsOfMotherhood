import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from '@/components/error-boundary';

function ProblemChild() {
  throw new Error('Boom');
  return null;
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when child throws', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(getByText(/Something went wrong/i)).toBeInTheDocument();
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
