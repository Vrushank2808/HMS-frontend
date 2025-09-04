import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email/Role, 2: OTP/New Password
    const [formData, setFormData] = useState({
        email: '',
        role: 'student',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [userInfo, setUserInfo] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear message when user starts typing
        if (message) {
            setMessage('');
            setMessageType('');
        }
    };

    // Step 1: Request OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/password-reset/request-otp`,
                {
                    email: formData.email,
                    role: formData.role
                }
            );

            if (response.data.success) {
                setMessage(response.data.message);
                setMessageType('success');
                setUserInfo(response.data.userInfo);
                setStep(2);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
            setMessage(errorMessage);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            setMessageType('error');
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/password-reset/verify-and-reset`,
                {
                    email: formData.email,
                    role: formData.role,
                    otp: formData.otp,
                    newPassword: formData.newPassword
                }
            );

            if (response.data.success) {
                setMessage('Password reset successfully! Redirecting to login...');
                setMessageType('success');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
            setMessage(errorMessage);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setFormData({
            email: '',
            role: 'student',
            otp: '',
            newPassword: '',
            confirmPassword: ''
        });
        setMessage('');
        setMessageType('');
        setUserInfo(null);
    };

    const roleOptions = [
        { value: 'student', label: '👨‍🎓 Student', color: 'from-blue-500 to-blue-600' },
        { value: 'warden', label: '👨‍🏫 Warden', color: 'from-green-500 to-green-600' },
        { value: 'security', label: '👮‍♂️ Security', color: 'from-yellow-500 to-yellow-600' },
        { value: 'admin', label: '👨‍💼 Admin', color: 'from-purple-500 to-purple-600' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {step === 1 ? 'Reset Password' : 'Verify OTP & Set New Password'}
                        </h1>
                        <p className="text-gray-600">
                            {step === 1
                                ? 'Enter your email and we\'ll send you an OTP'
                                : 'Enter the OTP sent to your email and set a new password'
                            }
                        </p>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${messageType === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            <div className="flex items-center">
                                <span className="mr-2">
                                    {messageType === 'success' ? '✅' : '❌'}
                                </span>
                                <span className="text-sm">{message}</span>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Email and Role */}
                    {step === 1 && (
                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Your Role
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {roleOptions.map((role) => (
                                        <label
                                            key={role.value}
                                            className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all ${formData.role === role.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role.value}
                                                checked={formData.role === role.value}
                                                onChange={handleChange}
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

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Enter your email address"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Sending OTP...
                                    </div>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP and New Password */}
                    {step === 2 && (
                        <div>
                            {/* User Info Display */}
                            {userInfo && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center">
                                        <div className="text-2xl mr-3">
                                            {roleOptions.find(r => r.value === formData.role)?.label.split(' ')[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{userInfo.name}</p>
                                            <p className="text-sm text-gray-600">{userInfo.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleResetPassword} className="space-y-6">
                                {/* OTP Input */}
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                        OTP Code
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        required
                                        maxLength="6"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-2xl font-mono tracking-widest"
                                        placeholder="000000"
                                    />
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Enter new password (min 6 characters)"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Confirm your new password"
                                    />
                                </div>

                                {/* Password Match Indicator */}
                                {formData.newPassword && formData.confirmPassword && (
                                    <div className={`text-sm ${formData.newPassword === formData.confirmPassword
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                        }`}>
                                        {formData.newPassword === formData.confirmPassword
                                            ? '✅ Passwords match'
                                            : '❌ Passwords do not match'
                                        }
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || formData.newPassword !== formData.confirmPassword}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Resetting...
                                            </div>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;