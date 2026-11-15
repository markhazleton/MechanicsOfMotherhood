import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import LoadingSpinner from '@/components/loading-spinner';

describe('LoadingSpinner', () => {
  it('renders a status container with accessible loading text', () => {
    render(<LoadingSpinner />);
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });
});
