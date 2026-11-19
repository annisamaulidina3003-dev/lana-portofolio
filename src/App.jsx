import { MotionConfig } from 'framer-motion';
import AppRoutes from '@/routes';
import ScrollToTop from '@/components/layout/ScrollToTop';

export default function App() {
  return (
    // reducedMotion="user" → hormati preferensi "kurangi gerakan" di perangkat
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <AppRoutes />
    </MotionConfig>
  );
}
