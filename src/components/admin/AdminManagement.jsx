import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    EyeIcon,
    EyeSlashIcon,
    XMarkIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../ui/Loading';

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        department: '',
        joinDate: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { showInfo } = useNotification();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://hms-backend-production-9545.up.railway.app/admin/admins', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAdmins(response.data.admins || response.data || []);
        } catch (error) {
            console.error('Error fetching admins:', error);
            showInfo('Failed to fetch admins', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://hms-backend-production-9545.up.railway.app/admin/admins', {
                ...formData,
                joinDate: formData.joinDate || new Date().toISOString().split('T')[0]
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setAdmins([response.data.admin, ...admins]);
            setShowAddModal(false);
            resetForm();
            showInfo('Admin created successfully! Credentials sent via email.', 'success');
        } catch (error) {
            showInfo(error.response?.data?.message || 'Failed to create admin', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditAdmin = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password; // Don't update password if empty
            }

            const response = await axios.put(`https://hms-backend-production-9545.up.railway.app/admin/admins/${selectedAdmin._id}`, updateData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setAdmins(admins.map(admin =>
                admin._id === selectedAdmin._id ? response.data.admin : admin
            ));
            setShowEditModal(false);
            resetForm();
            showInfo('Admin updated successfully!', 'success');
        } catch (error) {
            showInfo(error.response?.data?.message || 'Failed to update admin', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAdmin = async (adminId, adminName) => {
        if (!window.confirm(`Are you sure you want to delete admin "${adminName}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://hms-backend-production-9545.up.railway.app/admin/admins/${adminId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setAdmins(admins.filter(admin => admin._id !== adminId));
            showInfo('Admin deleted successfully!', 'success');
        } catch (error) {
            showInfo(error.response?.data?.message || 'Failed to delete admin', 'error');
        }
    };

    const handleToggleAdminStatus = async (adminId, currentStatus, adminName) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'active' ? 'activate' : 'deactivate';

        if (!window.confirm(`Are you sure you want to ${action} admin "${adminName}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');


            setAdmins(admins.map(admin =>
                admin._id === adminId ? { ...admin, status: newStatus } : admin
            ));
            showInfo(`Admin ${action}d successfully!`, 'success');
        } catch (error) {
            showInfo(error.response?.data?.message || `Failed to ${action} admin`, 'error');
        }
    };

    const openEditModal = (admin) => {
        setSelectedAdmin(admin);
        setFormData({
            fullName: admin.fullName,
            email: admin.email,
            phone: admin.phone,
            password: '',
            department: admin.department || '',
            joinDate: admin.joinDate ? new Date(admin.joinDate).toISOString().split('T')[0] : '',
            status: admin.status || 'active'
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            password: '',
            department: '',
            joinDate: '',
            status: 'active'
        });
        setSelectedAdmin(null);
        setShowPassword(false);
    };

    const filteredAdmins = admins.filter(admin =>
        admin.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[200px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
            {/* Header */}
            <motion.div
                className="mb-8 flex justify-between items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Admin Management
                    </h1>
                    <p className="text-gray-600">Manage system administrators and their permissions</p>
                </div>
                <motion.button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Admin
                </motion.button>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <input
                    type="text"
                    placeholder="Search admins by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Admins</p>
                            <p className="text-3xl font-bold text-gray-900">{admins.length}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <UserIcon className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Active Admins</p>
                            <p className="text-3xl font-bold text-green-600">{admins.filter(admin => admin.status !== 'inactive').length}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <UserIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Departments</p>
                            <p className="text-3xl font-bold text-blue-600">{new Set(admins.map(admin => admin.department).filter(Boolean)).size}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Admins Table */}
            <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAdmins.map((admin, index) => (
                                <motion.tr
                                    key={admin._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-400 to-pink-400 flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {admin.fullName?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{admin.fullName}</div>
                                                <div className="text-sm text-gray-500">ID: {admin._id?.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center gap-1">
                                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                            {admin.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                                            {admin.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {admin.department || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {admin.joinDate ? new Date(admin.joinDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.status === 'inactive'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {admin.status === 'inactive' ? 'Inactive' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditModal(admin)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors"
                                                title="Edit Admin"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleAdminStatus(admin._id, admin.status || 'active', admin.fullName)}
                                                className={`p-1 rounded-full transition-all duration-200 ${admin.status === 'inactive'
                                                    ? 'text-green-600 hover:text-green-900 hover:bg-green-100 hover:scale-110'
                                                    : 'text-orange-600 hover:text-orange-900 hover:bg-orange-100 hover:scale-110'
                                                    }`}
                                                title={admin.status === 'inactive' ? 'Activate Admin' : 'Deactivate Admin'}
                                            >
                                                {admin.status === 'inactive' ? (
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                ) : (
                                                    <XCircleIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAdmin(admin._id, admin.fullName)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                                                title="Delete Admin"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredAdmins.length === 0 && (
                        <div className="text-center py-12">
                            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No admins found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new admin.'}
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Add New Admin</h2>
                            <button
                                onClick={() => { setShowAddModal(false); resetForm(); }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">Select Department</option>
                                    <option value="Administration">Administration</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Operations">Operations</option>
                                    <option value="IT">IT</option>
                                    <option value="HR">HR</option>
                                    <option value="Academic">Academic</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                                <input
                                    type="date"
                                    value={formData.joinDate}
                                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); resetForm(); }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Creating...' : 'Create Admin'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Edit Admin Modal */}
            {showEditModal && selectedAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Admin</h2>
                            <button
                                onClick={() => { setShowEditModal(false); resetForm(); }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEditAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">Select Department</option>
                                    <option value="Administration">Administration</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Operations">Operations</option>
                                    <option value="IT">IT</option>
                                    <option value="HR">HR</option>
                                    <option value="Academic">Academic</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave empty to keep current)</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                                <input
                                    type="date"
                                    value={formData.joinDate}
                                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); resetForm(); }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Updating...' : 'Update Admin'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;