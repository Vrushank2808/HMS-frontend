import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/useAuth';
import { cn } from '../utils/cn';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password, formData.role);

        if (!result.success) {
            setError(result.message);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"
                animate={{
                    background: [
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-white rounded-full opacity-20"
                    animate={{
                        y: [-20, -100, -20],
                        x: [-20, 20, -20],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                    }}
                    style={{
                        left: `${10 + i * 15}%`,
                        top: `${20 + i * 10}%`,
                    }}
                />
            ))}

            <motion.div
                className="max-w-md w-full space-y-8 relative z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Header */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <motion.div
                        className="mx-auto w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white border-opacity-30"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <span className="text-3xl">🏠</span>
                    </motion.div>
                    <h2 className="text-4xl font-bold text-white mb-2 bg-clip-text">
                        Hostel Management
                    </h2>
                    <p className="text-blue-100 text-lg">
                        Welcome back! Please sign in to continue
                    </p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white border-opacity-20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Role Selection */}
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                        >
                            <label className="block text-sm font-semibold text-gray-700">Select Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={cn(
                                    "w-full px-4 py-3 border border-gray-300 rounded-xl",
                                    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    "transition-all duration-200 bg-white shadow-sm",
                                    "appearance-none bg-no-repeat bg-right",
                                    "hover:border-gray-400"
                                )}
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                <option value="student">👨‍🎓 Student</option>
                                <option value="admin">👨‍💼 Admin</option>
                                <option value="warden">🏠 Warden</option>
                                <option value="security">🛡️ Security</option>
                            </select>
                        </motion.div>

                        {/* Email Field */}
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                        >
                            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={cn(
                                    "w-full px-4 py-3 border border-gray-300 rounded-xl",
                                    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    "transition-all duration-200 bg-white shadow-sm",
                                    "hover:border-gray-400 placeholder-gray-400"
                                )}
                                placeholder="Enter your email"
                            />
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.4 }}
                        >
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={cn(
                                        "w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl",
                                        "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                        "transition-all duration-200 bg-white shadow-sm",
                                        "hover:border-gray-400 placeholder-gray-400"
                                    )}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="flex items-center">
                                    <span className="mr-2">⚠️</span>
                                    {error}
                                </div>
                            </motion.div>
                        )}

                        {/* Forgot Password Link */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.85, duration: 0.4 }}
                        >
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                Forgot your password?
                            </Link>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full py-3 px-6 text-lg font-semibold text-white rounded-xl",
                                "bg-gradient-to-r from-blue-600 to-purple-600",
                                "hover:from-blue-700 hover:to-purple-700",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                "transform transition-all duration-200",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "shadow-lg hover:shadow-xl"
                            )}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.4 }}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Signing in...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <span className="mr-2">🚀</span>
                                    Sign In
                                </div>
                            )}
                        </motion.button>
                    </form>

                    {/* Demo Credentials */}
                    <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.4 }}
                    >
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                            <span className="font-semibold">Demo:</span> admin@hostel.com / admin123
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;