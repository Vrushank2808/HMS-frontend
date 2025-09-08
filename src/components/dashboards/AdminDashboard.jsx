import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import {
    UserGroupIcon,
    BuildingOfficeIcon,
    DocumentTextIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { StatCard } from '../ui/Card';
import { LoadingSpinner } from '../ui/Loading';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../config/env';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const { showInfo } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            const response = await axios.get(getApiUrl('/admin/dashboard'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            if (error?.response?.status === 401) {
                setStats({ unauthorized: true });
                return;
            }

            setStats({
                totalStudents: 0,
                totalRooms: 0,
                occupiedRooms: 0,
                availableRooms: 0,
                pendingComplaints: 0,
                activeVisitors: 0
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[200px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
            {stats.unauthorized && (
                <div className="fixed right-4 top-4 z-50 max-w-sm">
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg shadow-md">
                        <p className="font-semibold mb-1">Unauthorized</p>
                        <p className="text-sm">Your admin session is invalid. You can still use Quick Actions, but API data is unavailable. Please log out and sign in again.</p>
                    </div>
                </div>
            )}
            {/* Header */}
            <Motion.div
                className="mb-6 sm:mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Welcome back! Here's what's happening in your hostel today.</p>
            </Motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents || 0}
                    icon={UserGroupIcon}
                    trend="+12% from last month"
                    color="blue"
                    delay={0}
                />
                <StatCard
                    title="Total Rooms"
                    value={stats.totalRooms || 0}
                    icon={BuildingOfficeIcon}
                    trend={`${stats.occupiedRooms || 0} occupied`}
                    color="green"
                    delay={0.1}
                />
                <StatCard
                    title="Pending Complaints"
                    value={stats.pendingComplaints || 0}
                    icon={DocumentTextIcon}
                    trend="Needs attention"
                    color="yellow"
                    delay={0.2}
                />
                <StatCard
                    title="Active Visitors"
                    value={stats.activeVisitors || 0}
                    icon={UserIcon}
                    trend="Currently in hostel"
                    color="purple"
                    delay={0.3}
                />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Room Occupancy</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Occupied Rooms</span>
                            <span className="font-semibold">{stats.occupiedRooms || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Available Rooms</span>
                            <span className="font-semibold">{stats.availableRooms || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                    width: `${stats.totalRooms ? (stats.occupiedRooms / stats.totalRooms) * 100 : 0}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Quick Actions</h3>
                    <div className="space-y-2 sm:space-y-3">
                        <button
                            onClick={() => { showInfo('Opening students list...', 'Quick Action'); navigate('/dashboard/students'); }}
                            className="w-full text-left p-2 sm:p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            📊 View All Students
                        </button>
                        <button
                            onClick={() => { showInfo('Navigating to room management...', 'Quick Action'); navigate('/dashboard/rooms'); }}
                            className="w-full text-left p-2 sm:p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            🏠 Manage Rooms
                        </button>
                        <button
                            onClick={() => { showInfo('Reviewing complaints...', 'Quick Action'); navigate('/dashboard/complaints'); }}
                            className="w-full text-left p-2 sm:p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            📝 Review Complaints
                        </button>
                        <button
                            onClick={() => { showInfo('Managing visitors...', 'Quick Action'); navigate('/dashboard/visitors'); }}
                            className="w-full text-left p-2 sm:p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            👥 Manage Visitors
                        </button>
                        <button
                            onClick={() => { showInfo('Opening staff management...', 'Quick Action'); navigate('/dashboard/staff'); }}
                            className="w-full text-left p-2 sm:p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            👨‍💼 Manage Staff
                        </button>
                        <button
                            onClick={() => { showInfo('Opening email configuration...', 'Quick Action'); navigate('/dashboard/email-config'); }}
                            className="w-full text-left p-2 sm:p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            📧 Email Configuration
                        </button>
                        <button
                            onClick={() => { showInfo('Opening admin management...', 'Quick Action'); navigate('/dashboard/admin-management'); }}
                            className="w-full text-left p-2 sm:p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            👨‍💼 Manage Admins
                        </button>
                        <button
                            onClick={() => { showInfo('Opening password reset manager...', 'Quick Action'); navigate('/dashboard/password-reset'); }}
                            className="w-full text-left p-2 sm:p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            🔐 Password Reset Manager
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;