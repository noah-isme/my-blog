"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  UserPlus,
  Search,
  Edit3,
  Trash2,
  Shield,
  Mail,
  Calendar,
  Crown,
  Settings
} from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'viewer';
  status: 'active' | 'inactive' | 'banned';
  avatar?: string;
  joinedAt: string;
  lastLogin?: string;
  postsCount: number;
  permissions: string[];
}

const mockUsers: UserProfile[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@blog.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:00:00Z",
    postsCount: 25,
    permissions: ["all"]
  },
  {
    id: 2,
    name: "John Editor",
    email: "john@blog.com",
    role: "editor",
    status: "active",
    joinedAt: "2024-01-05T00:00:00Z",
    lastLogin: "2024-01-14T14:30:00Z",
    postsCount: 12,
    permissions: ["create", "edit", "publish", "delete"]
  },
  {
    id: 3,
    name: "Sarah Author",
    email: "sarah@blog.com",
    role: "author",
    status: "active",
    joinedAt: "2024-01-10T00:00:00Z",
    lastLogin: "2024-01-13T09:15:00Z",
    postsCount: 8,
    permissions: ["create", "edit"]
  },
  {
    id: 4,
    name: "Mike Viewer",
    email: "mike@blog.com",
    role: "viewer",
    status: "inactive",
    joinedAt: "2024-01-12T00:00:00Z",
    postsCount: 0,
    permissions: ["read"]
  }
];

export default function UsersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'editor' | 'author' | 'viewer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'banned'>('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserSelect = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    }
  };

  const handleStatusChange = (userId: number, newStatus: UserProfile['status']) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleRoleChange = (userId: number, newRole: UserProfile['role']) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'editor':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'author':
        return <Edit3 className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-playfair font-bold text-textPrimary">
            User Management
          </h1>
          <p className="mt-1 text-textSecondary">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingUser(null);
              setShowUserModal(true);
            }}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-textSecondary" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="author">Author</option>
              <option value="viewer">Viewer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-accent/10 border border-accent/20 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-textPrimary">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedUsers([])}
                  className="px-4 py-2 text-sm text-textSecondary hover:text-textPrimary rounded-lg hover:bg-white/50"
                >
                  Clear
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                >
                  Delete Selected
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={filteredUsers.length > 0 && filteredUsers.every(user => selectedUsers.includes(user.id))}
                    onChange={() => {
                      const allSelected = filteredUsers.every(user => selectedUsers.includes(user.id));
                      if (allSelected) {
                        setSelectedUsers([]);
                      } else {
                        setSelectedUsers(filteredUsers.map(user => user.id));
                      }
                    }}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">Posts</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      className="rounded border-gray-300 text-accent focus:ring-accent"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-textPrimary">{user.name}</div>
                        <div className="text-sm text-textSecondary flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserProfile['role'])}
                        className="text-sm border-0 bg-transparent focus:ring-0 p-0 capitalize"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="author">Author</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value as UserProfile['status'])}
                      className={`text-xs px-2 py-1 rounded-full border-0 capitalize ${getStatusColor(user.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">
                    {user.postsCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditingUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-2 text-textSecondary hover:text-accent rounded-lg hover:bg-gray-100"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-textSecondary hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-textPrimary mb-2">No users found</h3>
            <p className="text-textSecondary">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first user to get started'}
            </p>
          </div>
        )}
      </motion.div>

      {/* User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-textPrimary">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Name</label>
                  <input
                    type="text"
                    defaultValue={editingUser?.name || ''}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Enter user name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={editingUser?.email || ''}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Role</label>
                  <select
                    defaultValue={editingUser?.role || 'viewer'}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-textPrimary py-3 rounded-xl font-semibold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-semibold"
                  >
                    {editingUser ? 'Update User' : 'Create User'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
