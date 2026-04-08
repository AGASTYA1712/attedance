import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Send, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAppContext } from '../context/AppContext';
import type { LeaveType } from '../context/AppContext';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ isOpen, onClose }) => {
  const { addRequest } = useAppContext();
  const [formData, setFormData] = useState({
    type: 'Medical' as LeaveType,
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    try {
      await addRequest(formData);
      onClose();
      setFormData({ type: 'Medical', startDate: '', endDate: '', reason: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-xl h-fit bg-white rounded-3xl shadow-2xl z-[110] overflow-hidden border border-white/20"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#202A36] rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Request Leave</h2>
                    <p className="text-gray-500 text-sm font-medium italic">Please provide accurate details</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 italic">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Leave Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as LeaveType})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-[#202A36] focus:ring-4 focus:ring-[#202A36]/5 bg-white text-gray-900"
                    >
                      <option value="Medical">Medical Leave</option>
                      <option value="Personal">Personal Leave</option>
                      <option value="Special">Special Leave</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Notice Period</label>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg text-xs font-bold text-amber-600 border border-amber-100 italic">
                      <AlertCircle className="w-4 h-4" />
                      Minimum 24h notice required
                    </div>
                  </div>

                  <Input 
                    label="Start Date" 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                  <Input 
                    label="End Date" 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Reason for Leave</label>
                  <textarea 
                    rows={4}
                    placeholder="Briefly explain your reason for request..."
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#202A36] focus:ring-4 focus:ring-[#202A36]/5 placeholder:text-gray-400 text-sm leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Button type="button" variant="secondary" fullWidth onClick={onClose} className="h-12" disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" fullWidth className="h-12" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Submit Request
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
