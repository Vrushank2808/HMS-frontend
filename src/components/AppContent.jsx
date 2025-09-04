import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import OTPLogin from './auth/OTPLogin';
import ForgotPassword from './auth/ForgotPassword';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { LoadingPage } from './ui/Loading';

const AppContent = () => {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingPage message="Initializing application..." />;
    }

    return (
        <Routes>
            <Route path="/login" element={<OTPLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard/*" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppContent;