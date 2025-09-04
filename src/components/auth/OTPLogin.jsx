import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { getApiUrl } from '../../config/env';

const OTPLogin = () => {
    const [step, setStep] = useState(1); // 1: Email/Role, 2: OTP/Password
    const [formData, setFormData] = useState({
        email: '',
        role: '',
        otp: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const { loginWithToken } = useAuth();
    const navigate = useNavigate();



    const roles = [
        { value: 'admin', label: 'Admin', icon: '👨‍💼', color: 'bg-blue-500' },
        { value: 'warden', label: 'Warden', icon: '👨‍🏫', color: 'bg-green-500' },
        { value: 'security', label: 'Security', icon: '👮‍♂️', color: 'bg-yellow-500' },
        { value: 'student', label: 'Student', icon: '👨‍🎓', color: 'bg-purple-500' }
    ];

    // Step 1: Request OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // First check if user exists
            console.log("🔍 Checking user:", formData.email, formData.role);
            const checkResponse = await axios.post(
                getApiUrl('/auth/check-user'),
                {
                    email: formData.email,
                    role: formData.role
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log("✅ User check response:", checkResponse.data);
            setUserInfo(checkResponse.data);

            // Request OTP
            const otpResponse = await axios.post(
                getApiUrl('/auth/request-otp'),
                {
                    email: formData.email,
                    role: formData.role
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log("📩 OTP request response:", otpResponse.data);
            setSuccess(otpResponse.data.message || "OTP sent to your email");
            setStep(2);

        } catch (err) {
            console.error("❌ OTP request error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log("🚀 Verifying OTP...");
            const response = await axios.post(
                getApiUrl('/auth/verify-otp'),
                {
                    email: formData.email,
                    role: formData.role,
                    otp: formData.otp,
                    password: formData.password
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log("✅ Verify OTP response:", response.data);

            // Login successful
            loginWithToken(response.data.token, response.data.user);
            navigate('/dashboard');

        } catch (err) {
            console.error("❌ Login error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setFormData({ email: '', role: '', otp: '', password: '' });
        setError('');
        setSuccess('');
        setUserInfo(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    >
                        <span className="text-2xl text-white">🏠</span>
                    </motion.div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">HMS Login</h1>
                    <p className="text-gray-600">
                        {step === 1 ? 'Enter your details to receive OTP' : 'Enter OTP and password to login'}
                    </p>
                </div>

                {/* Step 1: Email and Role */}
                {step === 1 && (
                    <motion.form
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleRequestOTP}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Your Role
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {roles.map((role) => (
                                    <motion.button
                                        key={role.value}
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData({ ...formData, role: role.value })}
                                        className={`p-4 rounded-lg border-2 transition-all ${formData.role === role.value
                                            ? `${role.color} text-white border-transparent`
                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{role.icon}</div>
                                        <div className="text-sm font-medium">{role.label}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={loading || !formData.email || !formData.role}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Sending OTP...
                                </div>
                            ) : (
                                'Send OTP'
                            )}
                        </motion.button>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </motion.form>
                )}

                {/* Step 2: OTP and Password */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
                            >
                                {success}
                            </motion.div>
                        )}

                        {userInfo && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">
                                        {roles.find(r => r.value === formData.role)?.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{userInfo.fullName}</p>
                                        <p className="text-sm text-gray-600">{userInfo.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    OTP Code
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl font-mono tracking-widest"
                                    placeholder="000000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all"
                                >
                                    Back
                                </button>
                                <motion.button
                                    type="submit"
                                    disabled={loading || !formData.otp || !formData.password}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Verifying...
                                        </div>
                                    ) : (
                                        'Login'
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default OTPLogin;
