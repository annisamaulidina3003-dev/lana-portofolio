import { useAdminTitle } from '../hooks/useAdminTitle';
import { adminNav } from '../config/nav';
import ResourceManager from '../components/ResourceManager';

/** Halaman CRUD untuk satu resource dari config/resources.js. */
export default function ResourcePage({ resource }) {
  useAdminTitle(resource.label);
  const index = adminNav.find((n) => n.key === resource.key)?.index;
  return <ResourceManager resource={resource} index={index} />;
}
