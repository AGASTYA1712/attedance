import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAppContext } from '../context/AppContext';

export const Register: React.FC = () => {
  const { register } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="p-8 md:p-12 text-left">
          <a href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#202A36] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </a>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#202A36] rounded-2xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
              <p className="text-gray-500 text-sm font-medium">Join the student management portal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 italic">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-11"
                  required
                />
                <UserIcon className="absolute left-4 bottom-3 w-5 h-5 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-11"
                  required
                />
                <Mail className="absolute left-4 bottom-3 w-5 h-5 text-gray-400" />
              </div>

              <div className="relative md:col-span-2">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-11"
                  required
                />
                <Lock className="absolute left-4 bottom-3 w-5 h-5 text-gray-400" />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as 'student' | 'admin'})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-[#202A36] focus:ring-4 focus:ring-[#202A36]/5 bg-white text-gray-900"
                >
                  <option value="student">Student Account</option>
                  <option value="admin">Admin Account</option>
                </select>
              </div>
            </div>

            <Button fullWidth className="h-12 text-lg mt-4" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
