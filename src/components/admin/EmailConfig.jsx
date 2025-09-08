import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    EnvelopeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    PaperAirplaneIcon,
    CogIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { LoadingSpinner } from '../ui/Loading';
import { getApiUrl } from '../../config/env';

const EmailConfig = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [testLoading, setTestLoading] = useState(false);
    const [testForm, setTestForm] = useState({
        email: '',
        name: '',
        type: 'otp',
        role: 'admin'
    });
    const { showInfo } = useNotification();

    useEffect(() => {
        checkEmailConfig();
    }, []);

    const checkEmailConfig = async () => {
        try {
            const response = await axios.get(getApiUrl('/test-email/check-config'));
            setConfig(response.data);
        } catch (error) {
            console.error('Error checking email config:', error);
            showInfo('Failed to check email configuration', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTestEmail = async (e) => {
        e.preventDefault();
        setTestLoading(true);

        try {
            const endpoint = testForm.type === 'otp' ? '/test-email/test-otp' : '/test-email/test-credentials';
            const payload = {
                email: testForm.email,
                name: testForm.name,
                ...(testForm.type === 'credentials' && { role: testForm.role })
            };

            const response = await axios.post(getApiUrl(endpoint), payload);
            showInfo(response.data.message, 'success');
        } catch (error) {
            showInfo(error.response?.data?.message || 'Failed to send test email', 'error');
        } finally {
            setTestLoading(false);
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
        <div className="p-8">
            {/* Header */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Email Configuration
                </h1>
                <p className="text-gray-600">Test and manage the email system that sends notifications, OTPs, and credentials</p>
            </motion.div>

            {/* Configuration Status */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                {/* Status Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Configuration Status</h2>
                        <CogIcon className="w-6 h-6 text-gray-400" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Email Service</span>
                            <div className="flex items-center gap-2">
                                {config?.configured ? (
                                    <>
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                        <span className="text-sm text-green-600">Configured</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircleIcon className="w-5 h-5 text-red-500" />
                                        <span className="text-sm text-red-600">Not Configured</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Email User</span>
                            <span className="text-sm text-gray-600 font-mono">{config?.emailUser}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Email Password</span>
                            <span className="text-sm text-gray-600 font-mono">{config?.emailPass}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Frontend URL</span>
                            <span className="text-sm text-gray-600 font-mono">{config?.frontendUrl}</span>
                        </div>
                    </div>

                    {!config?.configured && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-medium text-yellow-800">Configuration Required</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Email service is not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Information Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Email System Info</h2>
                        <InformationCircleIcon className="w-6 h-6 text-blue-500" />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">What emails are sent?</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• OTP codes for secure login</li>
                                <li>• Account credentials for new users</li>
                                <li>• Password reset notifications</li>
                                <li>• System notifications</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Email Service</h3>
                            <p className="text-sm text-gray-600">
                                Currently using Gmail SMTP service. Requires app-specific password for authentication.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Configuration</h3>
                            <p className="text-sm text-gray-600">
                                Set EMAIL_USER and EMAIL_PASS in your environment variables or .env file.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Test Email Section */}
            <motion.div
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Test Email Functionality</h2>
                    <EnvelopeIcon className="w-6 h-6 text-blue-500" />
                </div>

                <form onSubmit={handleTestEmail} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Test Email Address</label>
                            <input
                                type="email"
                                required
                                value={testForm.email}
                                onChange={(e) => setTestForm({ ...testForm, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter email to test"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                            <input
                                type="text"
                                required
                                value={testForm.name}
                                onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter recipient name"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Type</label>
                            <select
                                value={testForm.type}
                                onChange={(e) => setTestForm({ ...testForm, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="otp">OTP Email</option>
                                <option value="credentials">Credentials Email</option>
                            </select>
                        </div>

                        {testForm.type === 'credentials' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                                <select
                                    value={testForm.role}
                                    onChange={(e) => setTestForm({ ...testForm, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="warden">Warden</option>
                                    <option value="security">Security</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={testLoading || !config?.configured}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {testLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <PaperAirplaneIcon className="w-4 h-4" />
                            )}
                            {testLoading ? 'Sending...' : 'Send Test Email'}
                        </button>
                    </div>
                </form>

                {!config?.configured && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <XCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-red-800">Cannot Send Test Email</h3>
                                <p className="text-sm text-red-700 mt-1">
                                    Email service is not configured. Please configure the email settings first.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Usage Statistics */}
            <motion.div
                className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Usage</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">📧</div>
                        <div className="text-sm text-gray-600 mt-2">OTP Emails</div>
                        <div className="text-lg font-semibold text-gray-900">Sent on login</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">🔑</div>
                        <div className="text-sm text-gray-600 mt-2">Credential Emails</div>
                        <div className="text-lg font-semibold text-gray-900">Sent on account creation</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">🔔</div>
                        <div className="text-sm text-gray-600 mt-2">Notifications</div>
                        <div className="text-lg font-semibold text-gray-900">System alerts</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EmailConfig;