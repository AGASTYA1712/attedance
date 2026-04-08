import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, Clock, XCircle, FileText, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LeaveRequestModal } from '../components/LeaveRequestModal';
import { useAppContext } from '../context/AppContext';
import type { LeaveRequest } from '../context/AppContext';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between"
  >
    <div className="text-left">
      <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
      <h3 className="text-3xl font-black text-gray-900">{value}</h3>
    </div>
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
      <Icon className="w-7 h-7" />
    </div>
  </motion.div>
);

interface RequestRowProps {
  request: LeaveRequest;
}

const RequestRow: React.FC<RequestRowProps> = ({ request }) => {
  const statusConfig = {
    Approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
    Pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
    Rejected: { bg: 'bg-rose-50', text: 'text-rose-700', icon: XCircle },
  };

  const config = statusConfig[request.status];
  const StatusIcon = config.icon;

  return (
    <div className="group flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all cursor-pointer">
      <div className="flex items-center gap-4 text-left">
        <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <StatusIcon className={`w-6 h-6 ${config.text}`} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm md:text-base">{request.type} Leave</h4>
          <p className="text-xs md:text-sm text-gray-500 line-clamp-1">{request.reason}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-900">{new Date(request.startDate).toLocaleDateString()}</p>
          <p className={`text-xs font-bold ${config.text}`}>{request.status}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
      </div>
    </div>
  );
};

export const StudentDashboard: React.FC = () => {
  const { requests } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: 'Total Requests', value: requests.length.toString(), icon: FileText, color: 'bg-blue-50 text-blue-600' },
    { label: 'Approved', value: requests.filter(r => r.status === 'Approved').length.toString(), icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending', value: requests.filter(r => r.status === 'Pending').length.toString(), icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Rejected', value: requests.filter(r => r.status === 'Rejected').length.toString(), icon: XCircle, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="text-left">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">My Overview</h1>
          <p className="text-gray-500 font-medium italic">Manage your leave applications and check your status.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-12 px-6">
          <Plus className="w-5 h-5" />
          New Leave Request
        </Button>
      </header>

      <LeaveRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
            <button className="text-sm font-bold text-[#202A36] hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {requests.length > 0 ? (
              requests.map(req => <RequestRow key={req.id} request={req} />)
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No leave requests found</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 text-left">Weekly Summary</h3>
          <div className="bg-[#202A36] rounded-3xl p-8 text-white relative overflow-hidden text-left">
            <div className="relative z-10">
              <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-2">Attendance Score</p>
              <h4 className="text-4xl font-black mb-6 tracking-tighter">94.2%</h4>
              <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '94%' }}></div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed italic opacity-80">
                "Great job! Your attendance is above the 85% requirement."
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
