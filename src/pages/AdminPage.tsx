import { AdminDashboard } from '@/components/AdminDashboard';
import { Navigation } from '@/components/Navigation';
import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute';

const AdminPage = () => {
  return (
    <ProtectedAdminRoute>
      <div className="pt-0 lg:pt-16 pb-16 lg:pb-0">
        <Navigation />
        <AdminDashboard />
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminPage;
