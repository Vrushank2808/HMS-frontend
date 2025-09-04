import React from 'react';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

export const Card = ({ children, className, ...props }) => (
    <motion.div
        className={cn(
            "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden",
            className
        )}
        whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
        {...props}
    >
        {children}
    </motion.div>
);

export const CardHeader = ({ children, className, ...props }) => (
    <div className={cn("px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100", className)} {...props}>
        {children}
    </div>
);

export const CardContent = ({ children, className, ...props }) => (
    <div className={cn("p-6", className)} {...props}>
        {children}
    </div>
);

export const StatCard = ({ title, value, icon: Icon, trend, color = "blue", delay = 0 }) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        yellow: "from-yellow-500 to-yellow-600",
        purple: "from-purple-500 to-purple-600",
        red: "from-red-500 to-red-600",
    };

    return (
        <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full transform translate-x-8 -translate-y-8" />
            </div>

            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                        <motion.p
                            className="text-3xl font-bold text-gray-900"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
                        >
                            {value}
                        </motion.p>
                        {trend && (
                            <div className="flex items-center mt-2">
                                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600 font-medium">{trend}</span>
                            </div>
                        )}
                    </div>
                    <motion.div
                        className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center",
                            "bg-gradient-to-br shadow-lg",
                            colorClasses[color]
                        )}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};