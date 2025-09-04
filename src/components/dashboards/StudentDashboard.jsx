import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import { useLocation } from 'react-router-dom';

const StudentDashboard = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [profile, setProfile] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [fees, setFees] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [complaintForm, setComplaintForm] = useState({
        title: '',
        description: '',
        category: 'maintenance',
        priority: 'medium',
        roomNumber: ''
    });
    const [paymentForm, setPaymentForm] = useState({
        amount: 0,
        paymentMethod: 'online',
        transactionId: ''
    });

    const getCurrentView = () => {
        const path = location.pathname.split('/').pop();
        return path === 'dashboard' ? 'overview' : path;
    };

    useEffect(() => {
        fetchProfile();
        fetchComplaints();
        fetchVisitors();
        fetchFees();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://hms-backend-production-9545.up.railway.app/student/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data.student);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://hms-backend-production-9545.up.railway.app/student/complaints', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplaints(response.data.complaints);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const fetchVisitors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://hms-backend-production-9545.up.railway.app/student/visitors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVisitors(response.data.visitors);
        } catch (error) {
            console.error('Error fetching visitors:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://hms-backend-production-9545.up.railway.app/student/fees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFees(response.data.fees);
            setPaymentForm({ ...paymentForm, amount: response.data.fees.remainingAmount || response.data.fees.amount });
        } catch (error) {
            console.error('Error fetching fees:', error);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        // Validate payment amount
        const amount = parseFloat(paymentForm.amount);
        const remainingAmount = fees?.remainingAmount || fees?.amount || 0;

        if (!amount || amount <= 0) {
            alert('Please enter a valid payment amount');
            return;
        }

        if (amount > remainingAmount) {
            alert(`Payment amount (₹${amount}) cannot exceed remaining amount (₹${remainingAmount})`);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://hms-backend-production-9545.up.railway.app/student/fees/pay', paymentForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowPaymentForm(false);
            setPaymentForm({
                amount: 0,
                paymentMethod: 'online',
                transactionId: ''
            });
            await fetchFees();
            await fetchProfile();
            alert(`Payment successful! ₹${amount} paid. Remaining: ₹${response.data.remainingAmount || 0}`);
        } catch (error) {
            console.error('Error processing payment:', error);
            const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
            alert(errorMessage);
        }
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://hms-backend-production-9545.up.railway.app/student/complaints', complaintForm);
            setShowComplaintForm(false);
            setComplaintForm({
                title: '',
                description: '',
                category: 'maintenance',
                priority: 'medium',
                roomNumber: ''
            });
            fetchComplaints();
        } catch (error) {
            console.error('Error submitting complaint:', error);
        }
    };

    const renderOverviewContent = () => (
        <>
            {/* Profile Card */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">My Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <p><strong>Name:</strong> {profile?.fullName}</p>
                        <p><strong>Student ID:</strong> {profile?.studentId}</p>
                        <p><strong>Email:</strong> {profile?.email}</p>
                        <p><strong>Phone:</strong> {profile?.phone}</p>
                    </div>
                    <div>
                        <p><strong>Course:</strong> {profile?.course}</p>
                        <p><strong>Year:</strong> {profile?.year}</p>
                        <p><strong>Room:</strong> {profile?.roomId?.roomNumber || 'Not Assigned'}</p>
                        <p><strong>Status:</strong>
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${profile?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {profile?.status}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Complaints Section */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                        <h2 className="text-lg sm:text-xl font-semibold">My Complaints</h2>
                        <button
                            onClick={() => setShowComplaintForm(true)}
                            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
                        >
                            New Complaint
                        </button>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {complaints.length === 0 ? (
                            <p className="text-gray-500">No complaints submitted</p>
                        ) : (
                            complaints.slice(0, 3).map((complaint) => (
                                <div key={complaint._id} className="border p-3 rounded">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{complaint.title}</h4>
                                            <p className="text-sm text-gray-600">{complaint.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {complaint.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Visitors Section */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Visitors</h2>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {visitors.length === 0 ? (
                            <p className="text-gray-500">No visitors recorded</p>
                        ) : (
                            visitors.slice(0, 3).map((visitor) => (
                                <div key={visitor._id} className="border p-3 rounded">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{visitor.visitorName}</h4>
                                            <p className="text-sm text-gray-600">{visitor.purpose}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(visitor.checkInTime).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${visitor.status === 'checked-in' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                            {visitor.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    const renderProfileView = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="mt-1 text-sm text-gray-900">{profile?.fullName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student ID</label>
                        <p className="mt-1 text-sm text-gray-900">{profile?.studentId}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{profile?.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{profile?.phone}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course</label>
                        <p className="mt-1 text-sm text-gray-900">{profile?.course}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Year</label>
                        <p className="mt-1 text-sm text-gray-900">{profile?.year}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Room Number</label>
                        <p className="mt-1 text-sm text-gray-900">{profile?.roomId?.roomNumber || 'Not Assigned'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`mt-1 inline-flex px-2 py-1 rounded text-sm ${profile?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {profile?.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderComplaintsView = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">My Complaints</h2>
                <button
                    onClick={() => setShowComplaintForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    New Complaint
                </button>
            </div>
            <div className="space-y-4">
                {complaints.length === 0 ? (
                    <p className="text-gray-500">No complaints submitted</p>
                ) : (
                    complaints.map((complaint) => (
                        <div key={complaint._id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-lg">{complaint.title}</h4>
                                <span className={`px-3 py-1 rounded-full text-sm ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {complaint.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-2">{complaint.description}</p>
                            <div className="text-sm text-gray-500">
                                <p>Category: {complaint.category}</p>
                                <p>Room: {complaint.roomNumber}</p>
                                <p>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderVisitorsView = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">My Visitors</h2>
            <div className="space-y-4">
                {visitors.length === 0 ? (
                    <p className="text-gray-500">No visitors recorded</p>
                ) : (
                    visitors.map((visitor) => (
                        <div key={visitor._id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-lg">{visitor.visitorName}</h4>
                                <span className={`px-3 py-1 rounded-full text-sm ${visitor.status === 'checked-in' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                    }`}>
                                    {visitor.status}
                                </span>
                            </div>
                            <div className="text-gray-600">
                                <p>Purpose: {visitor.purpose}</p>
                                <p>Phone: {visitor.visitorPhone}</p>
                                <p>Check In: {new Date(visitor.checkInTime).toLocaleString()}</p>
                                {visitor.checkOutTime && (
                                    <p>Check Out: {new Date(visitor.checkOutTime).toLocaleString()}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderRoomView = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">My Room</h2>
            {profile?.roomId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Room Number</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{profile.roomId.roomNumber}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Floor</label>
                            <p className="mt-1 text-sm text-gray-900">{profile.roomId.floor}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Capacity</label>
                            <p className="mt-1 text-sm text-gray-900">{profile.roomId.capacity} students</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">₹{profile.roomId.rent}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Current Occupancy</label>
                            <p className="mt-1 text-sm text-gray-900">{profile.roomId.currentOccupancy}/{profile.roomId.capacity}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <span className={`mt-1 inline-flex px-2 py-1 rounded text-sm ${profile.roomId.status === 'available' ? 'bg-green-100 text-green-800' :
                                profile.roomId.status === 'occupied' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {profile.roomId.status}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No room assigned</p>
            )}
        </div>
    );

    const renderFeesView = () => (
        <div className="space-y-6">
            {/* Fee Status Card */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6">Fee Information</h2>
                {fees ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Fee Amount</label>
                                <p className="mt-1 text-2xl font-bold text-gray-900">₹{fees.amount}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                                <p className="mt-1 text-lg font-semibold text-green-600">₹{fees.totalPaid || 0}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Remaining Amount</label>
                                <p className="mt-1 text-lg font-semibold text-red-600">₹{fees.remainingAmount || fees.amount}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <span className={`mt-1 inline-flex px-3 py-1 rounded-full text-sm font-medium ${fees.status === 'paid' ? 'bg-green-100 text-green-800' :
                                    fees.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        fees.status === 'partial' ? 'bg-blue-100 text-blue-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {fees.status.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {fees.dueDate ? new Date(fees.dueDate).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Room Details</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {fees.room ? `Room ${fees.room.roomNumber}, Floor ${fees.room.floor}` : 'No room assigned'}
                                </p>
                            </div>
                            {fees.status !== 'paid' && (
                                <button
                                    onClick={() => setShowPaymentForm(true)}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    {fees.status === 'partial' ? `Pay Remaining ₹${fees.remainingAmount}` : 'Pay Now'}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Loading fee information...</p>
                )}
            </div>

            {/* Payment History */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                {fees && fees.payments && fees.payments.length > 0 ? (
                    <div className="space-y-3">
                        {fees.payments.map((payment, index) => (
                            <div key={index} className="border p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">₹{payment.amount}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(payment.paymentDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Method: {payment.paymentMethod}
                                        </p>
                                        {payment.transactionId && (
                                            <p className="text-xs text-gray-500">
                                                Transaction ID: {payment.transactionId}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {payment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No payment history available</p>
                )}
            </div>
        </div>
    );

    const renderViewContent = () => {
        const currentView = getCurrentView();

        switch (currentView) {
            case 'profile':
                return renderProfileView();
            case 'complaints':
                return renderComplaintsView();
            case 'visitors':
                return renderVisitorsView();
            case 'room':
                return renderRoomView();
            case 'fees':
                return renderFeesView();
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
                {getCurrentView() === 'overview' ? 'Student Dashboard' :
                    getCurrentView() === 'profile' ? 'My Profile' :
                        getCurrentView() === 'complaints' ? 'My Complaints' :
                            getCurrentView() === 'visitors' ? 'My Visitors' :
                                getCurrentView() === 'room' ? 'My Room' :
                                    getCurrentView() === 'fees' ? 'My Fees' : 'Student Dashboard'}
            </h1>

            {renderViewContent()}

            {/* Complaint Form Modal */}
            {showComplaintForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Submit New Complaint</h3>
                        <form onSubmit={handleComplaintSubmit}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={complaintForm.title}
                                    onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    value={complaintForm.description}
                                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                                    className="w-full p-2 border rounded h-24"
                                    required
                                />
                                <select
                                    value={complaintForm.category}
                                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="maintenance">Maintenance</option>
                                    <option value="cleanliness">Cleanliness</option>
                                    <option value="security">Security</option>
                                    <option value="food">Food</option>
                                    <option value="other">Other</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Room Number"
                                    value={complaintForm.roomNumber}
                                    onChange={(e) => setComplaintForm({ ...complaintForm, roomNumber: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowComplaintForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Form Modal */}
            {showPaymentForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Pay Fees</h3>
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">
                                <strong>Remaining Amount:</strong> ₹{fees?.remainingAmount || fees?.amount || 0}
                            </p>
                        </div>
                        <form onSubmit={handlePayment}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                                    <input
                                        type="number"
                                        value={paymentForm.amount}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                                        className="w-full p-2 border rounded"
                                        required
                                        min="1"
                                        max={fees?.remainingAmount || fees?.amount || 0}
                                        step="0.01"
                                        placeholder={`Max: ₹${fees?.remainingAmount || fees?.amount || 0}`}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Maximum amount: ₹{fees?.remainingAmount || fees?.amount || 0}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                    <select
                                        value={paymentForm.paymentMethod}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="online">Online Payment</option>
                                        <option value="card">Credit/Debit Card</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Transaction ID (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Enter transaction ID"
                                        value={paymentForm.transactionId}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Payment</label>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentForm({ ...paymentForm, amount: fees?.remainingAmount || fees?.amount || 0 })}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                                        >
                                            Pay Full Amount (₹{fees?.remainingAmount || fees?.amount || 0})
                                        </button>
                                        {(fees?.remainingAmount || fees?.amount || 0) >= 1000 && (
                                            <button
                                                type="button"
                                                onClick={() => setPaymentForm({ ...paymentForm, amount: 1000 })}
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                                            >
                                                ₹1000
                                            </button>
                                        )}
                                        {(fees?.remainingAmount || fees?.amount || 0) >= 500 && (
                                            <button
                                                type="button"
                                                onClick={() => setPaymentForm({ ...paymentForm, amount: 500 })}
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                                            >
                                                ₹500
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;