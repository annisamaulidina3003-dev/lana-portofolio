import { cn } from '@/lib/cn';

const sizes = {
  default: 'max-w-page',
  narrow: 'max-w-narrow',
  full: 'max-w-none',
};

export default function Container({ as: Tag = 'div', size = 'default', className, children, ...rest }) {
  return (
    <Tag className={cn('mx-auto w-full px-gutter', sizes[size], className)} {...rest}>
      {children}
    </Tag>
  );
}
