import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/useAuth';

const PasswordResetManager = () => {
    const [activeTab, setActiveTab] = useState('self'); // 'self', 'others', 'history'
    const [loading, setLoading] = useState(false);
    const [resetHistory, setResetHistory] = useState([]);
    const { showSuccess, showError } = useNotification();
    const { user } = useAuth();

    // Self password reset state
    const [selfReset, setSelfReset] = useState({
        step: 1, // 1: Request OTP, 2: Verify & Reset
        email: user?.email || '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Others password reset state
    const [othersReset, setOthersReset] = useState({
        step: 1,
        email: '',
        role: 'student',
        otp: '',
        newPassword: '',
        confirmPassword: '',
        userInfo: null
    });

    const roles = [
        { value: 'student', label: '👨‍🎓 Student', color: 'bg-blue-100 text-blue-800' },
        { value: 'warden', label: '👨‍🏫 Warden', color: 'bg-green-100 text-green-800' },
        { value: 'security', label: '👮‍♂️ Security', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'admin', label: '👨‍💼 Admin', color: 'bg-purple-100 text-purple-800' }
    ];

    // Load reset history on component mount
    useEffect(() => {
        if (activeTab === 'history') {
            loadResetHistory();
        }
    }, [activeTab]);

    const loadResetHistory = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/password-reset/history`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setResetHistory(response.data.history || []);
        } catch (error) {
            console.error('Failed to load reset history:', error);
        }
    };

    // Self password reset functions
    const handleSelfOTPRequest = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/password-reset/request-otp`,
                {
                    email: selfReset.email,
                    role: 'admin'
                }
            );

            if (response.data.success) {
                showSuccess('OTP sent to your email!');
                setSelfReset(prev => ({ ...prev, step: 2 }));
            }
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleSelfPasswordReset = async (e) => {
        e.preventDefault();

        if (selfReset.newPassword !== selfReset.confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (selfReset.newPassword.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/password-reset/verify-and-reset`,
                {
                    email: selfReset.email,
                    role: 'admin',
                    otp: selfReset.otp,
                    newPassword: selfReset.newPassword
                }
            );

            if (response.data.success) {
                showSuccess('Password reset successfully!');
                setSelfReset({
                    step: 1,
                    email: user?.email || '',
                    otp: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    // Others password reset functions
    const handleOthersOTPRequest = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/password-reset/request-otp`,
                {
                    email: othersReset.email,
                    role: othersReset.role
                }
            );

            if (response.data.success) {
                showSuccess('OTP sent to user\'s email!');
                setOthersReset(prev => ({
                    ...prev,
                    step: 2,
                    userInfo: response.data.userInfo
                }));
            }
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOthersPasswordReset = async (e) => {
        e.preventDefault();

        if (othersReset.newPassword !== othersReset.confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (othersReset.newPassword.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/password-reset/verify-and-reset`,
                {
                    email: othersReset.email,
                    role: othersReset.role,
                    otp: othersReset.otp,
                    newPassword: othersReset.newPassword
                }
            );

            if (response.data.success) {
                showSuccess('User password reset successfully!');
                setOthersReset({
                    step: 1,
                    email: '',
                    role: 'student',
                    otp: '',
                    newPassword: '',
                    confirmPassword: '',
                    userInfo: null
                });
            }
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const resetSelfForm = () => {
        setSelfReset({
            step: 1,
            email: user?.email || '',
            otp: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const resetOthersForm = () => {
        setOthersReset({
            step: 1,
            email: '',
            role: 'student',
            otp: '',
            newPassword: '',
            confirmPassword: '',
            userInfo: null
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🔐</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Manager</h1>
                    <p className="text-gray-600">Reset your own password or help users reset theirs</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('self')}
                        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${activeTab === 'self'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        🔑 Reset My Password
                    </button>
                    <button
                        onClick={() => setActiveTab('others')}
                        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${activeTab === 'others'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        👥 Help Others Reset
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${activeTab === 'history'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        📋 Reset History
                    </button>
                </div>

                {/* Self Password Reset Tab */}
                {activeTab === 'self' && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-blue-900 mb-2">Reset Your Admin Password</h3>
                            <p className="text-blue-700 text-sm">
                                You can reset your own admin password using OTP verification sent to your email.
                            </p>
                        </div>

                        {selfReset.step === 1 ? (
                            <form onSubmit={handleSelfOTPRequest} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={selfReset.email}
                                        onChange={(e) => setSelfReset(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your admin email"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending OTP...
                                        </div>
                                    ) : (
                                        'Send OTP to My Email'
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSelfPasswordReset} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        OTP Code
                                    </label>
                                    <input
                                        type="text"
                                        value={selfReset.otp}
                                        onChange={(e) => setSelfReset(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '') }))}
                                        required
                                        maxLength="6"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                                        placeholder="000000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={selfReset.newPassword}
                                        onChange={(e) => setSelfReset(prev => ({ ...prev, newPassword: e.target.value }))}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter new password (min 6 characters)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={selfReset.confirmPassword}
                                        onChange={(e) => setSelfReset(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Confirm your new password"
                                    />
                                </div>

                                {selfReset.newPassword && selfReset.confirmPassword && (
                                    <div className={`text-sm ${selfReset.newPassword === selfReset.confirmPassword
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                        }`}>
                                        {selfReset.newPassword === selfReset.confirmPassword
                                            ? '✅ Passwords match'
                                            : '❌ Passwords do not match'
                                        }
                                    </div>
                                )}

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={resetSelfForm}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || selfReset.newPassword !== selfReset.confirmPassword}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Resetting...
                                            </div>
                                        ) : (
                                            'Reset My Password'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )}

                {/* Others Password Reset Tab */}
                {activeTab === 'others' && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-amber-900 mb-2">Help Users Reset Their Password</h3>
                            <p className="text-amber-700 text-sm">
                                As an admin, you can help users reset their passwords. The OTP will be sent to their email address.
                            </p>
                        </div>

                        {othersReset.step === 1 ? (
                            <form onSubmit={handleOthersOTPRequest} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Select User Role
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {roles.map((role) => (
                                            <label
                                                key={role.value}
                                                className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all ${othersReset.role === role.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role.value}
                                                    checked={othersReset.role === role.value}
                                                    onChange={(e) => setOthersReset(prev => ({ ...prev, role: e.target.value }))}
                                                    className="sr-only"
                                                />
                                                <div className="text-center">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {role.label}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        User Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={othersReset.email}
                                        onChange={(e) => setOthersReset(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter user's email address"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending OTP...
                                        </div>
                                    ) : (
                                        'Send OTP to User'
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div>
                                {othersReset.userInfo && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-center">
                                            <div className="text-2xl mr-3">
                                                {roles.find(r => r.value === othersReset.role)?.label.split(' ')[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{othersReset.userInfo.name}</p>
                                                <p className="text-sm text-gray-600">{othersReset.userInfo.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleOthersPasswordReset} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            OTP Code (from user's email)
                                        </label>
                                        <input
                                            type="text"
                                            value={othersReset.otp}
                                            onChange={(e) => setOthersReset(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '') }))}
                                            required
                                            maxLength="6"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                                            placeholder="000000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password for User
                                        </label>
                                        <input
                                            type="password"
                                            value={othersReset.newPassword}
                                            onChange={(e) => setOthersReset(prev => ({ ...prev, newPassword: e.target.value }))}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter new password for user (min 6 characters)"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={othersReset.confirmPassword}
                                            onChange={(e) => setOthersReset(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Confirm the new password"
                                        />
                                    </div>

                                    {othersReset.newPassword && othersReset.confirmPassword && (
                                        <div className={`text-sm ${othersReset.newPassword === othersReset.confirmPassword
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}>
                                            {othersReset.newPassword === othersReset.confirmPassword
                                                ? '✅ Passwords match'
                                                : '❌ Passwords do not match'
                                            }
                                        </div>
                                    )}

                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={resetOthersForm}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || othersReset.newPassword !== othersReset.confirmPassword}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Resetting...
                                                </div>
                                            ) : (
                                                'Reset User Password'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Reset History Tab */}
                {activeTab === 'history' && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Password Reset History</h3>
                            <p className="text-gray-700 text-sm">
                                View recent password reset activities in the system.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {resetHistory.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-4">📋</div>
                                    <p>No password reset history available</p>
                                </div>
                            ) : (
                                resetHistory.map((reset, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${roles.find(r => r.value === reset.role)?.color || 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {roles.find(r => r.value === reset.role)?.label || reset.role}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{reset.email}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Reset by: {reset.resetBy || 'Self'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">
                                                    {new Date(reset.timestamp).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(reset.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            onClick={loadResetHistory}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all"
                        >
                            🔄 Refresh History
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default PasswordResetManager;