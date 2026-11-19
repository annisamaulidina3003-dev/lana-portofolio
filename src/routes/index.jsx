import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Loading from '@/components/ui/Loading';

// Setiap halaman di-lazy-load agar bundle awal tetap ringan.
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Skills = lazy(() => import('@/pages/Skills'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Experience = lazy(() => import('@/pages/Experience'));
const Certificates = lazy(() => import('@/pages/Certificates'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const Contact = lazy(() => import('@/pages/Contact'));
const CV = lazy(() => import('@/pages/CV'));
const NotFound = lazy(() => import('@/pages/NotFound'));
// Area admin: bundle terpisah (berisi supabase-js + dashboard), tidak ikut dimuat pengunjung.
const AdminApp = lazy(() => import('@/admin/AdminApp'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="admin/*"
        element={
          <Suspense fallback={<Loading fullscreen label="Memuat admin" />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tentang" element={<About />} />
        <Route path="keahlian" element={<Skills />} />
        <Route path="proyek" element={<Projects />} />
        <Route path="proyek/:slug" element={<ProjectDetail />} />
        <Route path="pengalaman" element={<Experience />} />
        <Route path="sertifikat" element={<Certificates />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="kontak" element={<Contact />} />
        <Route path="cv" element={<CV />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
