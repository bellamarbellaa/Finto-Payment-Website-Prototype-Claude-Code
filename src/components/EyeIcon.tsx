/** Traced from the real app's icon set (finto-web/src/components/Icons.tsx) so the password toggle matches exactly. */
export function EyeIcon({ size = 19, color = 'currentColor', off = false }: { size?: number; color?: string; off?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
      {off && <path d="M4 20L20 4" />}
    </svg>
  );
}
