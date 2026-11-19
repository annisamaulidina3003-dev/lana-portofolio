import { motion } from 'framer-motion';
import { fade, fadeUp, viewport, withDelay } from '@/lib/motion';

const variantMap = { fade, fadeUp };

/** Munculkan elemen saat masuk viewport. */
export default function Reveal({ as = 'div', variant = 'fadeUp', delay = 0, className, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={withDelay(variantMap[variant], delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Tag>
  );
}
