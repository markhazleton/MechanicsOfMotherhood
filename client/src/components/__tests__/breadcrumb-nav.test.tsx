import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BreadcrumbNav from '@/components/seo/breadcrumb-nav';

describe('BreadcrumbNav', () => {
  it('always includes Home as the first item', () => {
    render(<BreadcrumbNav items={[{ name: 'Recipes', href: '/recipes/' }]} />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders intermediate items as links and current page as aria-current', () => {
    const items = [
      { name: 'Categories', href: '/categories/' },
      { name: 'Dinner', href: '/categories/dinner/' },
    ];
    render(<BreadcrumbNav items={items} />);

    // Intermediate link
    const categoriesLink = screen.getByRole('link', { name: 'Categories' });
    expect(categoriesLink).toHaveAttribute('href', '/categories/');

    // Current page is not a link, but has aria-current="page"
    const currentPage = screen.getByText('Dinner');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
    expect(currentPage.tagName.toLowerCase()).toBe('span');
  });
});
