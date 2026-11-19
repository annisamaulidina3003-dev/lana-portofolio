import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

/** Elemen geometris: lingkaran bersusun + garis silang, berputar pelan. */
export default function Ornament({ className, duration = 48 }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={cn('h-24 w-24', className)}
      animate={{ rotate: 360 }}
      transition={{ duration, ease: 'linear', repeat: Infinity }}
    >
      <circle cx="48" cy="48" r="47" />
      <circle cx="48" cy="48" r="20" />
      <path d="M48 0v96M0 48h96" />
    </motion.svg>
  );
}
