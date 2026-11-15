import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DarkModeToggle from '@/components/dark-mode-toggle';

describe('DarkModeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders light mode by default when no stored preference exists', () => {
    render(<DarkModeToggle />);
    const button = screen.getByRole('button', { name: /activate dark mode/i });
    expect(button).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles dark mode on click and stores preference', () => {
    render(<DarkModeToggle />);
    const button = screen.getByRole('button', { name: /activate dark mode/i });

    // Toggle to dark
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('mom-theme')).toBe('dark');
    expect(screen.getByRole('button', { name: /activate light mode/i })).toBeInTheDocument();

    // Toggle back to light
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('mom-theme')).toBe('light');
  });

  it('respects stored dark theme from localStorage on initial render', () => {
    localStorage.setItem('mom-theme', 'dark');
    render(<DarkModeToggle />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button', { name: /activate light mode/i })).toBeInTheDocument();
  });
});
