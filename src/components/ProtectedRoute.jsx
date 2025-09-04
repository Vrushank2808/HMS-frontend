import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LoadingPage } from './ui/Loading';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingPage message="Authenticating..." />;
    }

    return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;