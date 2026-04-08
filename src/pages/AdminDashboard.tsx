import React from 'react';
import { 
  Users, CheckCircle2, AlertCircle, FileText, 
  Search, Shield, MoreHorizontal, Calendar, XCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAppContext } from '../context/AppContext';

interface AdminStatProps {
  label: string;
  value: string;
  color: string;
  icon: React.ElementType;
}

const AdminStat: React.FC<AdminStatProps> = ({ label, value, color, icon: Icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-gray-500 text-sm font-semibold mb-1">{label}</p>
    <h3 className="text-2xl font-black text-gray-900">{value}</h3>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { requests, updateRequestStatus } = useAppContext();

  const stats = [
    { label: 'Total Students', value: '1,240', color: 'bg-indigo-50 text-indigo-600', icon: Users },
    { label: 'Pending Leaves', value: requests.filter(r => r.status === 'Pending').length.toString(), color: 'bg-amber-50 text-amber-600', icon: AlertCircle },
    { label: 'Approved Today', value: requests.filter(r => r.status === 'Approved').length.toString(), color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
    { label: 'Total Reports', value: '156', color: 'bg-blue-50 text-blue-600', icon: FileText },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="text-left">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Management Portal</h1>
          <p className="text-gray-500 font-medium italic">Review and manage student leave applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Shield className="w-5 h-5" />
            Admin Settings
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <AdminStat key={i} {...stat} />)}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Incoming Requests</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter by student..."
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-[#202A36]/5 w-64 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type & Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-xs shadow-inner">
                        {req.user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{req.user?.name}</p>
                        <p className="text-xs text-gray-500 font-medium whitespace-nowrap">{req.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{req.type} Leave</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(req.startDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                        'bg-rose-100 text-rose-700'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {req.status === 'Pending' ? (
                        <>
                          <button 
                            onClick={() => updateRequestStatus(req.id, 'Approved')}
                            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" 
                            title="Approve"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => updateRequestStatus(req.id, 'Rejected')}
                            className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors" 
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium italic">No requests to process</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
