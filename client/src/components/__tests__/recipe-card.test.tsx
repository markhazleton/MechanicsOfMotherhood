import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecipeCard from '@/components/recipe-card';
import type { Recipe } from '@/data/api-types';

const recipe: Recipe = {
  id: 42,
  name: 'Weeknight Chicken Tacos',
  description: 'Fast, flavorful tacos the whole family loves.',
  servings: 6,
  averageRating: 4.5,
  recipeCategory: { id: 3, name: 'Quick Meals' },
};

describe('RecipeCard', () => {
  it('renders the recipe as a single link with title, rating and servings', () => {
    render(<RecipeCard recipe={recipe} />);

    const card = screen.getByTestId('recipe-card-42');
    expect(card.tagName).toBe('A');
    expect(card.getAttribute('href')).toContain('weeknight-chicken-tacos');

    expect(screen.getByTestId('recipe-title-42').textContent).toBe('Weeknight Chicken Tacos');
    expect(screen.getByLabelText('Rated 4.5 out of 5')).toBeTruthy();
    expect(screen.getByText('Serves 6')).toBeTruthy();
    expect(screen.getByText('Fast, flavorful tacos the whole family loves.')).toBeTruthy();
  });

  it('shows the category badge by default and hides it when asked', () => {
    const { rerender } = render(<RecipeCard recipe={recipe} />);
    expect(screen.queryByText('Quick Meals')).toBeTruthy();

    rerender(<RecipeCard recipe={recipe} showCategory={false} />);
    expect(screen.queryByText('Quick Meals')).toBeNull();
  });

  it('falls back to defaults when rating and servings are missing', () => {
    render(<RecipeCard recipe={{ id: 7, name: 'Plain Rice' }} />);
    expect(screen.getByLabelText('Rated 5 out of 5')).toBeTruthy();
    expect(screen.getByText('Serves 4')).toBeTruthy();
  });

  it('lazy-loads images unless marked as priority', () => {
    const { rerender, container } = render(<RecipeCard recipe={recipe} />);
    expect(container.querySelector('img')?.getAttribute('loading')).toBe('lazy');

    rerender(<RecipeCard recipe={recipe} priority />);
    expect(container.querySelector('img')?.getAttribute('loading')).toBe('eager');
  });
});
