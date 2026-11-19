import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export default function Loading({ label = 'Memuat', fullscreen = false, compact = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-6',
        fullscreen ? 'fixed inset-0 z-[100] bg-paper' : compact ? 'min-h-[30vh]' : 'min-h-[60vh]',
      )}
    >
      <div className="h-px w-40 overflow-hidden bg-line">
        <motion.div
          className="h-full w-full bg-ink"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>
      <span className="label">{label}…</span>
    </div>
  );
}
