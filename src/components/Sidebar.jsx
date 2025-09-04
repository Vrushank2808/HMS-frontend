import React from 'react';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    DocumentTextIcon,
    UserIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon,
    EnvelopeIcon,
    UsersIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const getMenuItems = () => {
        switch (user?.role) {
            case 'admin':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, color: 'text-blue-400' },
                    { name: 'Students', path: '/dashboard/students', icon: UserGroupIcon, color: 'text-green-400' },
                    { name: 'Rooms', path: '/dashboard/rooms', icon: BuildingOfficeIcon, color: 'text-purple-400' },
                    { name: 'Complaints', path: '/dashboard/complaints', icon: DocumentTextIcon, color: 'text-yellow-400' },
                    { name: 'Visitors', path: '/dashboard/visitors', icon: UserIcon, color: 'text-indigo-400' },
                    { name: 'Staff', path: '/dashboard/staff', icon: ShieldCheckIcon, color: 'text-pink-400' },
                    { name: 'Manage Admins', path: '/dashboard/admin-management', icon: UsersIcon, color: 'text-red-400' },
                    { name: 'Password Reset', path: '/dashboard/password-reset', icon: LockClosedIcon, color: 'text-pink-400' },
                    { name: 'Email Config', path: '/dashboard/email-config', icon: EnvelopeIcon, color: 'text-orange-400' }
                ];
            case 'student':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, color: 'text-blue-400' },
                    { name: 'My Room', path: '/dashboard/room', icon: BuildingOfficeIcon, color: 'text-purple-400' },
                    { name: 'Complaints', path: '/dashboard/complaints', icon: DocumentTextIcon, color: 'text-yellow-400' },
                    { name: 'Visitors', path: '/dashboard/visitors', icon: UserGroupIcon, color: 'text-green-400' },
                    { name: 'Fees', path: '/dashboard/fees', icon: ShieldCheckIcon, color: 'text-orange-400' },
                    { name: 'Profile', path: '/dashboard/profile', icon: UserIcon, color: 'text-pink-400' }
                ];
            case 'warden':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, color: 'text-blue-400' },
                    { name: 'Students', path: '/dashboard/students', icon: UserGroupIcon, color: 'text-green-400' },
                    { name: 'Rooms', path: '/dashboard/rooms', icon: BuildingOfficeIcon, color: 'text-purple-400' },
                    { name: 'Complaints', path: '/dashboard/complaints', icon: DocumentTextIcon, color: 'text-yellow-400' }
                ];
            case 'security':
                return [
                    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, color: 'text-blue-400' },
                    { name: 'Visitors', path: '/dashboard/visitors', icon: UserGroupIcon, color: 'text-green-400' },
                    { name: 'Check In/Out', path: '/dashboard/checkin', icon: ShieldCheckIcon, color: 'text-purple-400' }
                ];
            default:
                return [];
        }
    };

    return (
        <motion.div
            className="w-64 h-screen flex flex-col relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl overflow-hidden"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Header */}
            <motion.div
                className="p-6 border-b border-slate-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <div className="flex items-center space-x-3">
                    <motion.div
                        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <BuildingOfficeIcon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold text-white">HMS</h2>
                        <p className="text-sm text-slate-300 capitalize">{user?.role} Panel</p>
                    </div>
                </div>
            </motion.div>

            {/* User Profile */}
            <motion.div
                className="p-6 border-b border-slate-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
            >
                <div className="flex items-center space-x-3">
                    <motion.div
                        className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {user?.fullName?.charAt(0)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{user?.fullName}</p>
                        <p className="text-sm text-slate-300 truncate">{user?.email}</p>
                    </div>
                    <motion.div
                        className="w-3 h-3 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                {getMenuItems().map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <motion.div
                            key={index}
                            className={cn(
                                "flex items-center px-4 py-3 text-slate-300 hover:text-white",
                                "hover:bg-slate-700 hover:bg-opacity-50 rounded-xl cursor-pointer",
                                "transition-all duration-200 group relative overflow-hidden"
                            )}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                            whileHover={{ x: 4 }}
                            onClick={() => item.path && navigate(item.path)}
                        >
                            <motion.div
                                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                            <IconComponent className={cn("w-5 h-5 mr-3", item.color, "group-hover:scale-110 transition-transform duration-200")} />
                            <span className="font-medium">{item.name}</span>
                            <motion.div
                                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                whileHover={{ x: 2 }}
                            >
                                <ArrowRightOnRectangleIcon className="w-4 h-4 rotate-180" />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Footer */}
            <motion.div
                className="p-4 border-t border-slate-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
            >
                <motion.button
                    onClick={logout}
                    className={cn(
                        "w-full flex items-center justify-center px-4 py-3",
                        "text-red-300 hover:text-red-200 hover:bg-red-500 hover:bg-opacity-20",
                        "rounded-xl transition-all duration-200 group font-medium"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span>Logout</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default Sidebar;