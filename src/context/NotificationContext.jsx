import React, { createContext, useContext, useState } from 'react';
import { NotificationContainer } from '../components/ui/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (notification) => {
        const id = Date.now() + Math.random();
        setNotifications(prev => [...prev, { ...notification, id }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const showSuccess = (message, title) => {
        addNotification({ type: 'success', message, title });
    };

    const showError = (message, title) => {
        addNotification({ type: 'error', message, title });
    };

    const showWarning = (message, title) => {
        addNotification({ type: 'warning', message, title });
    };

    const showInfo = (message, title) => {
        addNotification({ type: 'info', message, title });
    };

    const value = {
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer
                notifications={notifications}
                removeNotification={removeNotification}
            />
        </NotificationContext.Provider>
    );
};