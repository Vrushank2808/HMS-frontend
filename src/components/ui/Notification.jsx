import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

const iconMap = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
};

const colorMap = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColorMap = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
};

export const Notification = ({
    type = 'info',
    title,
    message,
    onClose,
    autoClose = true,
    duration = 5000
}) => {
    const Icon = iconMap[type];

    React.useEffect(() => {
        if (autoClose && onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    return (
        <motion.div
            className={cn(
                "w-[380px] md:w-[420px] shadow-lg rounded-lg pointer-events-auto border",
                colorMap[type]
            )}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <Icon className={cn("h-6 w-6", iconColorMap[type])} />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        {title && (
                            <p className="text-sm font-medium">{title}</p>
                        )}
                        <p className={cn("text-sm", title ? "mt-1" : "")}>{message}</p>
                    </div>
                    {onClose && (
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className={cn(
                                    "rounded-md inline-flex hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    iconColorMap[type]
                                )}
                                onClick={onClose}
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const NotificationContainer = ({ notifications = [], removeNotification }) => {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-start justify-end p-4 md:p-6">
            <div className="space-y-4">
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <Notification
                            key={notification.id}
                            {...notification}
                            onClose={() => removeNotification(notification.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};