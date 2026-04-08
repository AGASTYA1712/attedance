import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { 
  Menu, X, Home, Calendar, Clock, Settings, LogOut, 
  Bell, Search, User, ChevronRight, PieChart
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all h-12
    ${active 
      ? 'bg-[#202A36] text-white shadow-lg shadow-[#202A36]/20' 
      : 'text-gray-500 hover:bg-gray-100'}`}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="font-semibold text-sm whitespace-nowrap">{label}</span>
  </button>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} p-4`}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-[#202A36] rounded-xl flex items-center justify-center flex-shrink-0">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-[#202A36] tracking-tight whitespace-nowrap">LeaveSync</span>
            )}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hidden lg:block"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={Home} label="Dashboard" active />
          {user?.role === 'STUDENT' && <SidebarItem icon={Calendar} label="New Request" />}
          <SidebarItem icon={Clock} label="History" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="pt-4 border-t border-gray-100">
          <div onClick={logout} className="cursor-pointer">
            <SidebarItem icon={LogOut} label="Log Out" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-800 lg:block hidden">
              {user?.role === 'ADMIN' ? 'Admin Portal' : 'Student Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex relative items-center text-left">
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-[#202A36]/10 w-64 outline-none"
              />
            </div>
            
            <button className="p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 relative transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-10 w-[1px] bg-gray-100 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-3 cursor-pointer group text-left">
              <div className="w-10 h-10 bg-gradient-to-tr from-[#202A36] to-[#3a4d61] rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name}</p>
                <p className="text-xs text-gray-500 font-medium">#{user?.id}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[60] lg:hidden p-6 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <PieChart className="w-8 h-8 text-[#202A36]" />
                  <span className="text-2xl font-black text-[#202A36]">LeaveSync</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <nav className="space-y-3">
                <SidebarItem icon={Home} label="Dashboard" active />
                {user?.role === 'STUDENT' && <SidebarItem icon={Calendar} label="Apply for Leave" />}
                <SidebarItem icon={Clock} label="My History" />
                <SidebarItem icon={Settings} label="Account Settings" />
                <div onClick={logout}>
                  <SidebarItem icon={LogOut} label="Log Out" />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
