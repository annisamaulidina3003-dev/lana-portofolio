import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { ease } from '@/lib/motion';
import { hasNumber } from '@/lib/format';

/** Angka yang menghitung naik saat masuk viewport. Nilai kosong → tanda "—". */
export default function CountUp({ value, suffix = '%', delay = 0, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView || !hasNumber(value)) return undefined;
    if (reduce) {
      setShown(value);
      return undefined;
    }
    const controls = animate(0, value, {
      duration: 1,
      ease,
      delay,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, delay, reduce]);

  return (
    <span ref={ref} className={className}>
      {hasNumber(value) ? `${shown}${suffix}` : '—'}
    </span>
  );
}
