import { cn } from '@/lib/cn';

/** Garis kolom tipis di latar — penegas grid editorial. Dekoratif saja. */
export default function GridGuides() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="mx-auto grid h-full w-full max-w-page grid-cols-2 px-gutter md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-full border-l border-line/70',
              i >= 2 && 'hidden md:block',
              i === 3 && 'border-r',
            )}
          />
        ))}
      </div>
    </div>
  );
}
