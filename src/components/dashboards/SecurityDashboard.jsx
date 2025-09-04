import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SecurityDashboard = () => {
    const location = useLocation();
    const [visitors, setVisitors] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCheckInForm, setShowCheckInForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [checkInForm, setCheckInForm] = useState({
        visitorName: '',
        visitorPhone: '',
        studentId: '',
        purpose: ''
    });

    const getCurrentView = () => {
        const path = location.pathname.split('/').pop();
        return path === 'dashboard' ? 'overview' : path;
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const response = await axios.get('https://hms-backend-production-9545.up.railway.app/security/visitors');
            setVisitors(response.data.visitors);
        } catch (error) {
            console.error('Error fetching visitors:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchStudents = async (query) => {
        if (query.length < 2) {
            setStudents([]);
            return;
        }

        try {
            const response = await axios.get(`https://hms-backend-production-9545.up.railway.app/security/students/search?query=${query}`);
            setStudents(response.data.students);
        } catch (error) {
            console.error('Error searching students:', error);
        }
    };

    const handleCheckIn = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://hms-backend-production-9545.up.railway.app/security/visitors/checkin', checkInForm);
            setShowCheckInForm(false);
            setCheckInForm({
                visitorName: '',
                visitorPhone: '',
                studentId: '',
                purpose: ''
            });
            fetchVisitors();
        } catch (error) {
            console.error('Error checking in visitor:', error);
        }
    };

    const handleCheckOut = async (visitorId) => {
        try {
            await axios.put(`https://hms-backend-production-9545.up.railway.app/security/visitors/${visitorId}/checkout`);
            fetchVisitors();
        } catch (error) {
            console.error('Error checking out visitor:', error);
        }
    };

    const activeVisitors = visitors.filter(v => v.status === 'checked-in');
    const todayVisitors = visitors.filter(v =>
        new Date(v.checkInTime).toDateString() === new Date().toDateString()
    );

    const renderOverviewContent = () => (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <span className="text-2xl">🚪</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Visitors</p>
                            <p className="text-2xl font-bold text-gray-900">{activeVisitors.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <span className="text-2xl">📅</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Today's Visitors</p>
                            <p className="text-2xl font-bold text-gray-900">{todayVisitors.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <span className="text-2xl">📊</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                            <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <h2 className="text-lg sm:text-xl font-semibold">Quick Actions</h2>
                    <button
                        onClick={() => setShowCheckInForm(true)}
                        className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
                    >
                        Check In Visitor
                    </button>
                </div>

                {/* Active Visitors Preview */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Currently Checked In ({activeVisitors.length})</h3>
                    {activeVisitors.length === 0 ? (
                        <p className="text-gray-500">No active visitors</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {activeVisitors.slice(0, 4).map((visitor) => (
                                <div key={visitor._id} className="border rounded-lg p-3 sm:p-4 bg-green-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold">{visitor.visitorName}</h4>
                                            <p className="text-sm text-gray-600">
                                                Visiting: {visitor.studentId?.fullName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(visitor.checkInTime).toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleCheckOut(visitor._id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                        >
                                            Check Out
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    const renderVisitorsView = () => (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">All Visitors</h2>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitor</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Student</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Purpose</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Check In</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Check Out</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {visitors.map((visitor) => (
                            <tr key={visitor._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{visitor.visitorName}</div>
                                        <div className="text-sm text-gray-500">{visitor.visitorPhone}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{visitor.studentId?.fullName}</div>
                                    <div className="text-sm text-gray-500">{visitor.studentId?.studentId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {visitor.purpose}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(visitor.checkInTime).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleString() : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${visitor.status === 'checked-in' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {visitor.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {visitor.status === 'checked-in' && (
                                        <button
                                            onClick={() => handleCheckOut(visitor._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Check Out
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCheckInView = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Visitor Check In/Out</h2>
                <button
                    onClick={() => setShowCheckInForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    New Check In
                </button>
            </div>

            {/* Active Visitors */}
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Currently Checked In</h3>
                {activeVisitors.length === 0 ? (
                    <p className="text-gray-500">No active visitors</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeVisitors.map((visitor) => (
                            <div key={visitor._id} className="border rounded-lg p-4 bg-green-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold">{visitor.visitorName}</h4>
                                        <p className="text-sm text-gray-600">Phone: {visitor.visitorPhone}</p>
                                        <p className="text-sm text-gray-600">
                                            Visiting: {visitor.studentId?.fullName} ({visitor.studentId?.studentId})
                                        </p>
                                        <p className="text-sm text-gray-600">Purpose: {visitor.purpose}</p>
                                        <p className="text-xs text-gray-500">
                                            Checked in: {new Date(visitor.checkInTime).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleCheckOut(visitor._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                    >
                                        Check Out
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderViewContent = () => {
        const currentView = getCurrentView();

        switch (currentView) {
            case 'visitors':
                return renderVisitorsView();
            case 'checkin':
                return renderCheckInView();
            default:
                return renderOverviewContent();
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                {getCurrentView() === 'overview' ? 'Security Dashboard' :
                    getCurrentView() === 'visitors' ? 'All Visitors' :
                        getCurrentView() === 'checkin' ? 'Check In/Out' : 'Security Dashboard'}
            </h1>

            {renderViewContent()}

            {/* Check In Form Modal */}
            {showCheckInForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Check In Visitor</h3>
                        <form onSubmit={handleCheckIn}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Visitor Name"
                                    value={checkInForm.visitorName}
                                    onChange={(e) => setCheckInForm({ ...checkInForm, visitorName: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Visitor Phone"
                                    value={checkInForm.visitorPhone}
                                    onChange={(e) => setCheckInForm({ ...checkInForm, visitorPhone: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search Student (Name or ID)"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            searchStudents(e.target.value);
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                    {students.length > 0 && (
                                        <div className="mt-2 max-h-32 overflow-y-auto border rounded">
                                            {students.map((student) => (
                                                <div
                                                    key={student._id}
                                                    onClick={() => {
                                                        setCheckInForm({ ...checkInForm, studentId: student._id });
                                                        setSearchQuery(`${student.fullName} (${student.studentId})`);
                                                        setStudents([]);
                                                    }}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <div className="text-sm font-medium">{student.fullName}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {student.studentId} | Room: {student.roomId?.roomNumber || 'N/A'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Purpose of Visit"
                                    value={checkInForm.purpose}
                                    onChange={(e) => setCheckInForm({ ...checkInForm, purpose: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCheckInForm(false);
                                        setSearchQuery('');
                                        setStudents([]);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    disabled={!checkInForm.studentId}
                                >
                                    Check In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecurityDashboard;