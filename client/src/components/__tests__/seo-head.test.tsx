import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import SeoHead from '@/components/seo/SeoHead';

describe('SeoHead', () => {
  it('injects title and meta tags', () => {
    const helmetContext: any = {};
    render(
      <HelmetProvider context={helmetContext}>
        <SeoHead title="Test Page" description="Test description" />
      </HelmetProvider>
    );
    const { helmet } = helmetContext;
    expect(helmet.title.toString()).toContain('Test Page');
    expect(helmet.meta.toString()).toContain('Test description');
  });
});
