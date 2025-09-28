# Accessibility Checklist (Mechanics of Motherhood)

This curated checklist helps ensure new or modified UI meets baseline accessibility (a11y) expectations for a static React + Tailwind application deployed to GitHub Pages.

## 1. Color & Contrast

- Text contrast: Body & small text >= 4.5:1; large text (>= 24px or 18.66px bold) >= 3:1
- Interactive elements (buttons, links, badges) visible in default, hover, focus, active, and disabled states
- Don’t rely on color alone to convey meaning (e.g., add icons/labels to status badges)
- Gradient overlays must not reduce legibility of foreground text; add an additional solid/blur layer if needed

## 2. Focus & Keyboard Navigation

- Every interactive element reachable via Tab in a logical order
- Visible focus indicator (outline, ring, or shadow) with at least 3:1 contrast against adjacent colors
- No focus trapping unless intentionally managed (e.g., inside modals/sheets)
- Skip Links considered (optional enhancement for long pages)

## 3. Semantics & Landmarks

- Use semantic elements: `header`, `nav`, `main`, `footer`, `section`, heading levels `h1`–`h6`
- Only one `h1` per page; headings form a logical outline (no skipping levels for styling)
- Lists (`ul`/`ol`) used for grouped items; avoid manual line breaks
- Landmarks: At least `nav`, `main`, and `footer`; consider `aria-label` for multiple nav regions

## 4. Links & Buttons

- Links navigate; buttons perform in‑page actions (don’t mix semantics)
- Link text is descriptive out of context (avoid: "click here", "read more")
- External links optionally include `rel="noopener noreferrer"` when `target="_blank"`
- Icon-only buttons require `aria-label`

## 5. Forms & Inputs

- Every input has an associated `label` (can be visually hidden) or accessible name via `aria-label` / `aria-labelledby`
- Error states: Provide text feedback + programmatic indication (`aria-invalid="true"`)
- Placeholder text is not the only label
- Group related inputs with `fieldset` and `legend`

## 6. Media & Images

- Informative images: alt describes purpose
- Decorative images: `alt=""` or `role="presentation"`
- Background images should not contain essential information unless duplicated textually
- (Future) Video: Provide captions or transcript; avoid autoplay with sound

## 7. Dynamic Content & Announcements

- Toasts / notifications: Use polite/assertive `aria-live` regions
- Loading states: Provide visible + accessible text (e.g., `aria-busy` on containers)
- Route changes (SPA): Ensure focus is moved to a heading or main landmark

## 8. Keyboard Interaction Patterns

- Custom components (menus, dialogs, tabs) follow WAI-ARIA Authoring Practices
- Escape closes modals/sheets; focus returns to invoking trigger
- Arrow keys for menu / tablist navigation if applicable

## 9. Performance & A11y Synergy

- Avoid layout shift that disorients keyboard users
- Defer non-essential script execution so initial focusable elements are ready quickly

## 10. Testing Flow

1. Keyboard only pass (Tab, Shift+Tab, Enter, Space, Esc)
2. Screen reader spot check (NVDA, VoiceOver, or Narrator)
3. Automated scan (axe, Lighthouse) – treat as baseline, not exhaustive
4. Contrast audit (Chrome DevTools > Accessibility or use tooling like Stark)
5. High zoom (200–400%): Layout still works; no clipped content
6. Prefers-reduced-motion respected for large animations (ideal future enhancement)

## 11. Tailwind Implementation Tips

- Focus ring utility pattern: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500/60`
- Reduce motion example: `@media (prefers-reduced-motion: reduce) { .spin-slow { animation: none; } }`
- Use `sr-only` for hidden labels when necessary

## 12. Common Pitfalls to Avoid

- Low-contrast translucent buttons over image/video banners
- Icon-only links in footers without accessible names
- Using heading tags only for sizing (use utilities instead)
- Missing alt text on decorative logomarks

## 13. Acceptance Criteria For New UI

A change is considered accessible (baseline) when:

- All interactive elements operable via keyboard
- Visible focus present and consistent
- No obvious WCAG 2.1 A/AA color contrast failures
- Structural headings logical & unique page `h1`
- Images have appropriate alt attributes
- Dynamic feedback (loading/errors) surfaced accessibly

---
Maintained by: Copilot automation. Update this file as design system evolves.
