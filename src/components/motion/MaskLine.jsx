import { motion } from 'framer-motion';
import { maskUp } from '@/lib/motion';
import { cn } from '@/lib/cn';

/**
 * Satu baris teks yang naik dari balik topeng.
 * Letakkan di dalam elemen motion yang punya variants "hidden/visible".
 */
export default function MaskLine({ className, children }) {
  return (
    <span className={cn('block overflow-hidden pb-[0.06em] pt-[0.04em]', className)}>
      <motion.span variants={maskUp} className="block">
        {children}
      </motion.span>
    </span>
  );
}
