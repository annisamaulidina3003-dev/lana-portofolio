import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

const classes =
  'group/link relative inline-block pb-0.5 text-ink after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 after:ease-editorial hover:after:origin-left hover:after:scale-x-100';

/**
 * Tautan teks dengan garis bawah yang menyapu saat hover.
 * to="/halaman" → router · href="#id" → anchor halaman · href="https://…" → eksternal
 */
export default function TextLink({ to, href, className, children, ...rest }) {
  const cls = cn(classes, className);
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href?.startsWith('#')) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <a href={href} target="_blank" rel="noreferrer noopener" className={cls} {...rest}>{children}</a>;
}
