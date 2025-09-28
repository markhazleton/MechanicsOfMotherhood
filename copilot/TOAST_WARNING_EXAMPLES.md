# Toast Warning Examples

Examples showing how to use the new `warning` toast variant and semantic warning palette utilities.

## Basic Warning Toast

```tsx
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription } from '@/components/ui/toast';

export function BasicWarningToastExample() {
  return (
    <ToastProvider>
      <Toast variant="warning">
        <div className="grid gap-1">
          <ToastTitle className="font-semibold">Unsaved Changes</ToastTitle>
          <ToastDescription className="text-sm">You have settings that are not saved yet.</ToastDescription>
        </div>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}
```

## Warning with Action

```tsx
import { Toast, ToastAction, ToastProvider, ToastViewport, ToastTitle, ToastDescription } from '@/components/ui/toast';

export function WarningWithActionToastExample() {
  return (
    <ToastProvider>
      <Toast variant="warning">
        <div className="grid gap-1 pr-6">
          <ToastTitle>Password Expiring</ToastTitle>
          <ToastDescription>Your password will expire in 3 days.</ToastDescription>
        </div>
        <ToastAction altText="Renew now" className="border-warning-300 text-warning-700 hover:bg-warning-100">Renew</ToastAction>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}
```

## Inline Palette Reference

Utility classes exposed (light + dark aware):

```text
bg-warning-soft
text-warning-700
border-warning-300
hover:bg-warning-100
```

Use them to construct custom banners or inline alerts:

```tsx
export function InlineWarningBanner() {
  return (
    <div className="bg-warning-soft border border-warning-300 text-warning-700 px-4 py-3 rounded-md flex items-start gap-3">
      <span className="mt-0.5 text-lg">⚠️</span>
      <div className="text-sm leading-snug">
        <strong className="font-semibold">Staging mode:</strong> Data is sample only.
      </div>
    </div>
  );
}
```

## Notes

- `variant="warning"` automatically applies group class so nested selectors like `group-[.warning]` work.
- Dark mode hues lighten progressively for readability on dark backgrounds.
- Keep text/icon contrast ≥ 4.5:1; current scale passes WCAG AA for normal text (spot‑checked warning-700 on warning-50 and on dark backgrounds).

## Future Enhancements

- Add success/info toast variants using success palette + potential info (blue-subset) for consistency.
- Introduce automated accessibility snapshot (see contrast test harness proposal in `VISUAL_CONTRAST_TESTS.md`).
