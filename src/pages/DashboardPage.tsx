import { Link } from 'react-router-dom'; 
import { useAuth } from '../hooks/useAuth.ts';
import { useNavigate } from 'react-router-dom';
import SupplierDashboard from '@/components/SupplierDashboard.tsx';
import { Button } from '@/components/ui/button.tsx';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase.ts';
import VendorDashboard from '@/components/VendorDashboard.tsx'; 

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If not logged in, redirect to login page after loading is complete
  if (!user && !loading) {
    navigate('/login');
    return null; 
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">VendorSeva</h1>
         <div className="flex items-center gap-4">
    {/* ADD THIS LINK FOR VENDORS */}
    {user?.userType === 'vendor' && (
      <Link to="/my-orders">
        <Button variant="outline">My Orders</Button>
      </Link>
    )}
    {user && <Button onClick={handleLogout} variant="destructive">Logout</Button>}
  </div>
      </header>

      <main>
        {user?.userType === 'supplier' && <SupplierDashboard />}
    {user?.userType === 'vendor' && <VendorDashboard />} 
      </main>
    </div>
  );
}