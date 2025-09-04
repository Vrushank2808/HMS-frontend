// Environment configuration
export const config = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8008',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'Hostel Management System',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // API endpoints
    endpoints: {
        auth: {
            requestOTP: '/auth/request-otp',
            verifyOTP: '/auth/verify-otp',
            checkUser: '/auth/check-user'
        },
        admin: {
            dashboard: '/admin/dashboard',
            students: '/admin/students',
            rooms: '/admin/rooms',
            complaints: '/admin/complaints',
            visitors: '/admin/visitors',
            staff: '/admin/staff',
            admins: '/admin/admins'
        },
        student: {
            profile: '/student/profile',
            complaints: '/student/complaints',
            visitors: '/student/visitors',
            fees: '/student/fees'
        },
        warden: {
            students: '/warden/students',
            rooms: '/warden/rooms',
            complaints: '/warden/complaints'
        },
        security: {
            visitors: '/security/visitors',
            students: '/security/students'
        },
        testEmail: {
            checkConfig: '/test-email/check-config',
            testOTP: '/test-email/test-otp',
            testCredentials: '/test-email/test-credentials'
        }
    }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
    return `${config.API_URL}${endpoint}`;
};

// Helper function to check if we're in development
export const isDevelopment = () => {
    return import.meta.env.DEV;
};

// Helper function to check if we're in production
export const isProduction = () => {
    return import.meta.env.PROD;
};

export default config;