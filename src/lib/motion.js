/**
 * Sistem animasi dasar (Framer Motion).
 * Satu bahasa gerak: easing editorial yang tegas, durasi konsisten.
 */
export const ease = [0.22, 1, 0.36, 1];

export const duration = { fast: 0.3, base: 0.6, slow: 0.9 };

export const viewport = { once: true, margin: '0px 0px -10% 0px' };

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base + 0.1, ease } },
};

/** Teks naik dari balik "topeng" (dipasangkan dengan <MaskLine />). */
export const maskUp = {
  hidden: { y: '105%' },
  visible: { y: '0%', transition: { duration: duration.slow, ease } },
};

/** Garis tipis yang tumbuh dari kiri. */
export const lineGrow = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: duration.slow, ease } },
};

/** Container yang menjalankan animasi anak secara berurutan. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Transisi antarhalaman. */
export const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.base, ease } },
};

/** Salin variant dengan delay tertentu (delay di dalam variant menimpa prop transition). */
export const withDelay = (variant, delay = 0) => ({
  hidden: variant.hidden,
  visible: { ...variant.visible, transition: { ...variant.visible.transition, delay } },
});
