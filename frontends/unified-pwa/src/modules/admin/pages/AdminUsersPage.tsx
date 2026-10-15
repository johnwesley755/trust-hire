import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type AdminUserItem } from '../../../services/admin.service';
import { Users, Search, ShieldCheck, Mail, Phone, Calendar, Loader2, UserPlus, X, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { AppLoader } from '../../../components/common/AppLoader';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers', selectedRole, searchQuery],
    queryFn: () => adminService.getUsers({ role: selectedRole, q: searchQuery }),
  });

  const createAdminMutation = useMutation({
    mutationFn: (data: typeof formData) => adminService.createAdmin(data),
    onSuccess: () => {
      toast.success('Administrator account created successfully');
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', password: '' });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || err?.message || 'Failed to create administrator account';
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    createAdminMutation.mutate(formData);
  };

  const roleTabs = [
    { label: 'All Users', value: 'ALL' },
    { label: 'Trade Candidates', value: 'WORKER' },
    { label: 'Hiring Employers', value: 'EMPLOYER' },
    { label: 'Administrators', value: 'ADMIN' },
  ];

  return (
    <div className="space-y-6 font-['Onest',system-ui,sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase text-[#717784] mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563c9]" />
            <span>Identity Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-[#0a0a0a] tracking-tight">
            User Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#717784] mt-1 leading-relaxed">
            Manage all verified candidates, registered employers, and administrator accounts across the ecosystem.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider bg-[#0f2f63] hover:bg-[#2563c9] text-white shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Provision Administrator</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="inline-flex p-1 rounded-full bg-[#f4f4f4] border border-[#e6e8ec] overflow-x-auto max-w-full">
          {roleTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedRole(tab.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedRole === tab.value
                  ? 'bg-[#0f2f63] text-white shadow-xs'
                  : 'text-[#717784] hover:text-[#0a0a0a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] focus:bg-white border border-[#e6e8ec] focus:border-[#0f2f63] rounded-xl px-3.5 py-2 pl-9 text-xs text-[#0a0a0a] placeholder:text-[#9ea3ae] outline-hidden shadow-2xs transition-all"
          />
          <Search className="w-4 h-4 text-[#9ea3ae] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <AppLoader variant="page" message="Loading user directory..." />
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#e6e8ec] shadow-xs">
          <Users className="w-10 h-10 text-[#9ea3ae] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#0a0a0a]">No users found</h3>
          <p className="text-xs text-[#717784] mt-1">No user records matched your criteria.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e6e8ec] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#717784]">
              <thead className="bg-[#f8fafc] text-[#717784] uppercase text-[10px] font-semibold border-b border-[#e6e8ec] tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e8ec]">
                {users.map((u) => {
                  const fullName = [u.first_name, u.last_name].filter(Boolean).join(' ') || 'User';
                  return (
                    <tr key={u.id} className="hover:bg-[#f8fafc]/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#0f2f63] font-bold flex items-center justify-center text-xs shrink-0">
                            {fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-[#0a0a0a] block">{fullName}</span>
                            <span className="text-[11px] text-[#9ea3ae] font-mono">{u.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : u.role === 'EMPLOYER'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-[#0f2f63] border border-blue-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5 text-[#0a0a0a]">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-[#9ea3ae]" />
                            <span>{u.email}</span>
                          </div>
                          {u.phone_number && (
                            <div className="flex items-center gap-1.5 text-[#717784]">
                              <Phone className="w-3 h-3 text-[#9ea3ae]" />
                              <span>{u.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          u.email_verified 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-[#f4f4f4] text-[#717784] border border-[#e6e8ec]'
                        }`}>
                          <ShieldCheck className="w-3 h-3" />
                          <span>{u.email_verified ? 'Verified' : 'Unverified'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#717784]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Administrator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#e6e8ec] w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e8ec]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0a0a0a]">Provision Administrator</h3>
                  <p className="text-[11px] text-[#717784]">Grant superuser privileges to a new team member.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#717784] hover:text-[#0a0a0a] p-1 rounded-lg hover:bg-[#f4f4f4] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium uppercase text-[#0a0a0a]">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Jane"
                    className="w-full bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] focus:bg-white border border-[#e6e8ec] focus:border-[#0f2f63] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0a0a] placeholder:text-[#9ea3ae] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium uppercase text-[#0a0a0a]">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    className="w-full bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] focus:bg-white border border-[#e6e8ec] focus:border-[#0f2f63] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0a0a] placeholder:text-[#9ea3ae] outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium uppercase text-[#0a0a0a]">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@trusthyre.com"
                    className="w-full bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] focus:bg-white border border-[#e6e8ec] focus:border-[#0f2f63] rounded-xl px-3.5 py-2.5 pl-9 text-xs text-[#0a0a0a] placeholder:text-[#9ea3ae] outline-hidden"
                  />
                  <Mail className="w-4 h-4 text-[#9ea3ae] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium uppercase text-[#0a0a0a]">Initial Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] focus:bg-white border border-[#e6e8ec] focus:border-[#0f2f63] rounded-xl px-3.5 py-2.5 pl-9 text-xs text-[#0a0a0a] placeholder:text-[#9ea3ae] outline-hidden"
                  />
                  <Lock className="w-4 h-4 text-[#9ea3ae] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-[#717784] mt-1">Minimum 8 characters. Must be shared securely with the new administrator.</p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#e6e8ec]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider text-[#717784] hover:text-[#0a0a0a] hover:bg-[#f4f4f4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAdminMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider bg-[#0f2f63] hover:bg-[#2563c9] text-white shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                >
                  {createAdminMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Create Admin User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
