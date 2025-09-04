import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    return (
        <motion.div
            className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full ${className}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
    );
};

export const LoadingPage = ({ message = "Loading..." }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.p
                    className="text-gray-600 text-lg font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {message}
                </motion.p>
            </motion.div>
        </div>
    );
};