import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import SeoHead from '@/components/seo/SeoHead';

describe('SeoHead', () => {
  it('injects title and meta tags', async () => {
    render(
      <HelmetProvider>
        <SeoHead title="Test Page" description="Test description" />
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toContain('Test Page');
      const metaDesc = document.head.querySelector('meta[name="description"]');
      expect(metaDesc?.getAttribute('content')).toBe('Test description');
    });
  });
});
