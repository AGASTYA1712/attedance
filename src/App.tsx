import { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { DashboardLayout } from './layouts/DashboardLayout';
import { useAppContext } from './context/AppContext';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, isLoading } = useAppContext();
  const [currentPage, setCurrentPage] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Basic route handling
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/register') setCurrentPage('register');
      else setCurrentPage('login');
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-[#202A36] animate-spin" />
      </div>
    );
  }

  // If user is not logged in, show Auth pages
  if (!user) {
    if (currentPage === 'register') return <Register />;
    return <Login />;
  }
  
  // If logged in, show Dashboards based on user role
  return (
    <DashboardLayout>
      {user.role === 'ADMIN' ? <AdminDashboard /> : <StudentDashboard />}
    </DashboardLayout>
  );
}

export default App;
