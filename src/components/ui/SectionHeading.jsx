import { motion } from 'framer-motion';
import { fade, fadeUp, lineGrow, stagger, viewport } from '@/lib/motion';
import { cn } from '@/lib/cn';
import MaskLine from '@/components/motion/MaskLine';

const sizes = {
  lg: 'text-display-lg',
  md: 'text-display-md',
  sm: 'text-display-sm',
};

/**
 * Judul bagian bergaya editorial:
 * garis tipis di atas → indeks/eyebrow di kiri → judul oversized di kanan.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  as: Tag = 'h2',
  size = 'md',
  className,
}) {
  return (
    <motion.header
      className={cn('relative', className)}
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <motion.div variants={lineGrow} className="h-px origin-left bg-ink" />
      <div className="grid grid-cols-12 gap-x-4 pt-5">
        <motion.div variants={fade} className="col-span-12 flex items-center gap-3 md:col-span-3">
          {index && <span className="label text-ink">{index}</span>}
          {eyebrow && <span className="label">{eyebrow}</span>}
        </motion.div>
        <div className="col-span-12 mt-8 md:col-span-9 md:mt-0">
          <Tag className={cn('uppercase', sizes[size])}>
            <MaskLine>{title}</MaskLine>
          </Tag>
          {description && (
            <motion.p variants={fadeUp} className="mt-8 max-w-xl text-lead text-ink-soft">
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </motion.header>
  );
}
