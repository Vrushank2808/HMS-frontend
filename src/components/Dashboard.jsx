import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Sidebar from './Sidebar';
import AdminDashboard from './dashboards/AdminDashboard';
import AdminStudents from './dashboards/admin/Students';
import AdminRooms from './dashboards/admin/Rooms';
import AdminComplaints from './dashboards/admin/Complaints';
import AdminVisitors from './dashboards/admin/Visitors';
import AdminStaff from './dashboards/admin/Staff';
import AdminManagement from './admin/AdminManagement';
import PasswordResetManager from './admin/PasswordResetManager';
import EmailConfig from './admin/EmailConfig';
import StudentDashboard from './dashboards/StudentDashboard';
import WardenDashboard from './dashboards/WardenDashboard';
import SecurityDashboard from './dashboards/SecurityDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    const renderDashboard = () => {
        switch (user?.role) {
            case 'admin':
                return <AdminDashboard />;
            case 'student':
                return <StudentDashboard />;
            case 'warden':
                return <WardenDashboard />;
            case 'security':
                return <SecurityDashboard />;
            default:
                return <div>Invalid role</div>;
        }
    };

    const renderRoutes = () => {
        switch (user?.role) {
            case 'admin':
                return (
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="students" element={<AdminStudents />} />
                        <Route path="rooms" element={<AdminRooms />} />
                        <Route path="complaints" element={<AdminComplaints />} />
                        <Route path="visitors" element={<AdminVisitors />} />
                        <Route path="staff" element={<AdminStaff />} />
                        <Route path="admin-management" element={<AdminManagement />} />
                        <Route path="password-reset" element={<PasswordResetManager />} />
                        <Route path="email-config" element={<EmailConfig />} />
                        <Route path="*" element={<AdminDashboard />} />
                    </Routes>
                );
            case 'student':
                return (
                    <Routes>
                        <Route path="/" element={<StudentDashboard />} />
                        <Route path="room" element={<StudentDashboard />} />
                        <Route path="complaints" element={<StudentDashboard />} />
                        <Route path="visitors" element={<StudentDashboard />} />
                        <Route path="fees" element={<StudentDashboard />} />
                        <Route path="profile" element={<StudentDashboard />} />
                        <Route path="*" element={<StudentDashboard />} />
                    </Routes>
                );
            case 'warden':
                return (
                    <Routes>
                        <Route path="/" element={<WardenDashboard />} />
                        <Route path="students" element={<WardenDashboard />} />
                        <Route path="rooms" element={<WardenDashboard />} />
                        <Route path="complaints" element={<WardenDashboard />} />
                        <Route path="*" element={<WardenDashboard />} />
                    </Routes>
                );
            case 'security':
                return (
                    <Routes>
                        <Route path="/" element={<SecurityDashboard />} />
                        <Route path="visitors" element={<SecurityDashboard />} />
                        <Route path="checkin" element={<SecurityDashboard />} />
                        <Route path="*" element={<SecurityDashboard />} />
                    </Routes>
                );
            default:
                return <Routes><Route path="*" element={<div>Invalid role</div>} /></Routes>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-pink-200 rounded-full opacity-20 transform -translate-x-32 translate-y-32"></div>

            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Main content area */}
            <div className="flex-1 overflow-auto relative z-10 w-full lg:w-auto">
                {renderRoutes()}
            </div>
        </div>
    );
};

export default Dashboard;