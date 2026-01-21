import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simple dark mode toggle using class strategy (tailwind.config.ts darkMode: 'class')
// Persists preference in localStorage under key 'mom-theme'
export function DarkModeToggle({ className = '' }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('mom-theme') : null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const enabled = stored ? stored === 'dark' : prefersDark;
    setIsDark(enabled);
    document.documentElement.classList.toggle('dark', enabled);
  }, []);

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      try {
        localStorage.setItem('mom-theme', next ? 'dark' : 'light');
      } catch {
        // Ignore localStorage errors in private browsing
      }
      return next;
    });
  };

  return (
    <Button
      type="button"
      variant="outlineBrand"
      size="sm"
      aria-label={isDark ? 'Activate light mode' : 'Activate dark mode'}
      onClick={toggle}
      className={className}
    >
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
      <span className="sr-only">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </Button>
  );
}

export default DarkModeToggle;
