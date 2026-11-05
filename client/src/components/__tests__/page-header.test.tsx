import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageHeader from '@/components/page-header';

describe('PageHeader', () => {
  it('renders eyebrow, a single h1 title and description', () => {
    render(
      <PageHeader
        eyebrow="Recipe collection"
        title="All recipes"
        description="Browse our collection."
      />
    );

    expect(screen.getByText('Recipe collection')).toBeTruthy();
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]?.textContent).toBe('All recipes');
    expect(screen.getByText('Browse our collection.')).toBeTruthy();
  });

  it('renders breadcrumbs with Home first when provided', () => {
    render(
      <PageHeader title="Categories" breadcrumbs={[{ name: 'Categories', href: '/categories' }]} />
    );

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const items = nav.querySelectorAll('li');
    expect(items).toHaveLength(2);
    expect(items[0]?.textContent).toContain('Home');
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe('Categories');
  });

  it('omits breadcrumbs and optional blocks when not provided', () => {
    render(<PageHeader title="Blog" />);
    expect(screen.queryByRole('navigation', { name: 'Breadcrumb' })).toBeNull();
    expect(screen.getByTestId('page-header').querySelectorAll('p')).toHaveLength(0);
  });

  it('renders children and before slots', () => {
    render(
      <PageHeader title="Soups" before={<span>Back link</span>}>
        <form aria-label="search form" />
      </PageHeader>
    );
    expect(screen.getByText('Back link')).toBeTruthy();
    expect(screen.getByRole('form', { name: 'search form' })).toBeTruthy();
  });
});
