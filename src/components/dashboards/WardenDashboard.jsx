import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const WardenDashboard = () => {
    const location = useLocation();
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('students');
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [showAddRoomForm, setShowAddRoomForm] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);

    const [studentForm, setStudentForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        studentId: '',
        course: '',
        year: '',
        roomId: '',
        feeStatus: 'pending',
        feeAmount: 0
    });

    const [roomForm, setRoomForm] = useState({
        roomNumber: '',
        floor: '',
        capacity: 2,
        rent: 0,
        status: 'available'
    });

    const getCurrentView = () => {
        const path = location.pathname.split('/').pop();
        return path === 'dashboard' ? 'overview' : path;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const [studentsRes, roomsRes, complaintsRes] = await Promise.all([
                axios.get('https://hms-backend-production-9545.up.railway.app/warden/students', { headers }),
                axios.get('https://hms-backend-production-9545.up.railway.app/warden/rooms', { headers }),
                axios.get('https://hms-backend-production-9545.up.railway.app/warden/complaints', { headers })
            ]);

            setStudents(studentsRes.data.students);
            setRooms(roomsRes.data.rooms);
            setComplaints(complaintsRes.data.complaints);

            // Filter available rooms for student assignment
            setAvailableRooms(roomsRes.data.rooms.filter(room =>
                room.status === 'available' || room.currentOccupancy < room.capacity
            ));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://hms-backend-production-9545.up.railway.app/warden/students', studentForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddStudentForm(false);
            setStudentForm({
                fullName: '',
                email: '',
                phone: '',
                studentId: '',
                course: '',
                year: '',
                roomId: '',
                feeStatus: 'pending',
                feeAmount: 0
            });
            fetchData();
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Error adding student. Please try again.');
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://hms-backend-production-9545.up.railway.app/warden/rooms', roomForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddRoomForm(false);
            setRoomForm({
                roomNumber: '',
                floor: '',
                capacity: 2,
                rent: 0,
                status: 'available'
            });
            fetchData();
        } catch (error) {
            console.error('Error adding room:', error);
            alert('Error adding room. Please try again.');
        }
    };

    const updateFeeStatus = async (studentId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://hms-backend-production-9545.up.railway.app/warden/students/${studentId}/fees`,
                { feeStatus: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (error) {
            console.error('Error updating fee status:', error);
            alert('Error updating fee status. Please try again.');
        }
    };

    const updateComplaintStatus = async (complaintId, status, response = '') => {
        try {
            await axios.put(`https://hms-backend-production-9545.up.railway.app/warden/complaints/${complaintId}`, {
                status,
                adminResponse: response
            });
            fetchData();
        } catch (error) {
            console.error('Error updating complaint:', error);
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    const renderViewContent = () => {
        const currentView = getCurrentView();

        switch (currentView) {
            case 'students':
                return renderStudentsView();
            case 'rooms':
                return renderRoomsView();
            case 'complaints':
                return renderComplaintsView();
            default:
                return renderOverviewContent();
        }
    };

    const renderOverviewContent = () => (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <span className="text-2xl">🏠</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                            <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <span className="text-2xl">📝</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending Complaints</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {complaints.filter(c => c.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Recent Students</h3>
                    <div className="space-y-3">
                        {students.slice(0, 5).map((student) => (
                            <div key={student._id} className="flex justify-between items-center p-2 border rounded">
                                <div>
                                    <p className="font-medium">{student.fullName}</p>
                                    <p className="text-sm text-gray-600">{student.studentId}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {student.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Complaints</h3>
                    <div className="space-y-3">
                        {complaints.slice(0, 5).map((complaint) => (
                            <div key={complaint._id} className="p-2 border rounded">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{complaint.title}</p>
                                        <p className="text-sm text-gray-600">{complaint.studentId?.fullName}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {complaint.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    const renderStudentsView = () => (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h3 className="text-xl sm:text-2xl font-semibold">Students Management</h3>
                <button
                    onClick={() => setShowAddStudentForm(true)}
                    className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
                >
                    Add New Student
                </button>
            </div>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Student ID</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Course</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Status</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Fee Amount</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Status</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {student.fullName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.studentId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.roomId?.roomNumber || 'Not Assigned'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.course}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${student.feeStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                        student.feeStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            student.feeStatus === 'partial' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {student.feeStatus || 'pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₹{student.feeAmount || student.roomId?.rent || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {student.feeStatus !== 'paid' && (
                                        <button
                                            onClick={() => updateFeeStatus(student._id, 'paid')}
                                            className="text-green-600 hover:text-green-900 mr-2"
                                        >
                                            Mark Paid
                                        </button>
                                    )}
                                    {student.feeStatus === 'paid' && (
                                        <button
                                            onClick={() => updateFeeStatus(student._id, 'pending')}
                                            className="text-yellow-600 hover:text-yellow-900"
                                        >
                                            Mark Pending
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

    const renderRoomsView = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Room Management</h3>
                <button
                    onClick={() => setShowAddRoomForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Add New Room
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                    <div key={room._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">Room {room.roomNumber}</h4>
                            <span className={`px-2 py-1 text-xs rounded ${room.status === 'available' ? 'bg-green-100 text-green-800' :
                                room.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {room.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">Floor: {room.floor}</p>
                        <p className="text-sm text-gray-600">
                            Occupancy: {room.currentOccupancy || 0}/{room.capacity}
                        </p>
                        <p className="text-sm text-gray-600">Rent: ₹{room.rent}</p>
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${((room.currentOccupancy || 0) / room.capacity) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        {room.students && room.students.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs font-medium text-gray-700">Students:</p>
                                {room.students.map((student) => (
                                    <p key={student._id} className="text-xs text-gray-600">
                                        {student.fullName} ({student.studentId})
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderComplaintsView = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-semibold mb-6">Complaints Management</h3>
            <div className="space-y-4">
                {complaints.map((complaint) => (
                    <div key={complaint._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-semibold">{complaint.title}</h4>
                                <p className="text-sm text-gray-600">{complaint.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    By: {complaint.studentId?.fullName} | Room: {complaint.roomNumber}
                                </p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <span className={`px-2 py-1 text-xs rounded ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {complaint.status}
                                </span>
                                {complaint.status === 'pending' && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => updateComplaintStatus(complaint._id, 'in-progress')}
                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                        >
                                            Start Work
                                        </button>
                                        <button
                                            onClick={() => updateComplaintStatus(complaint._id, 'resolved', 'Issue resolved')}
                                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                        >
                                            Resolve
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {complaint.adminResponse && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                                <p className="text-sm"><strong>Response:</strong> {complaint.adminResponse}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                {getCurrentView() === 'overview' ? 'Warden Dashboard' :
                    getCurrentView() === 'students' ? 'Students Management' :
                        getCurrentView() === 'rooms' ? 'Room Management' :
                            getCurrentView() === 'complaints' ? 'Complaints Management' : 'Warden Dashboard'}
            </h1>

            {renderViewContent()}

            {/* Add Student Modal */}
            {showAddStudentForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
                        <form onSubmit={handleAddStudent}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={studentForm.fullName}
                                    onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={studentForm.email}
                                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={studentForm.phone}
                                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Student ID"
                                    value={studentForm.studentId}
                                    onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Course"
                                    value={studentForm.course}
                                    onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <select
                                    value={studentForm.year}
                                    onChange={(e) => setStudentForm({ ...studentForm, year: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                                <select
                                    value={studentForm.roomId}
                                    onChange={(e) => {
                                        const selectedRoom = availableRooms.find(room => room._id === e.target.value);
                                        setStudentForm({
                                            ...studentForm,
                                            roomId: e.target.value,
                                            feeAmount: selectedRoom ? selectedRoom.rent : 0
                                        });
                                    }}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Room (Optional)</option>
                                    {availableRooms.map((room) => (
                                        <option key={room._id} value={room._id}>
                                            Room {room.roomNumber} - Floor {room.floor} (₹{room.rent}/month)
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Fee Amount"
                                    value={studentForm.feeAmount}
                                    onChange={(e) => setStudentForm({ ...studentForm, feeAmount: parseInt(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <select
                                    value={studentForm.feeStatus}
                                    onChange={(e) => setStudentForm({ ...studentForm, feeStatus: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="pending">Fee Pending</option>
                                    <option value="paid">Fee Paid</option>
                                    <option value="overdue">Fee Overdue</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddStudentForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {showAddRoomForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Add New Room</h3>
                        <form onSubmit={handleAddRoom}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Room Number"
                                    value={roomForm.roomNumber}
                                    onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Floor"
                                    value={roomForm.floor}
                                    onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Capacity"
                                    value={roomForm.capacity}
                                    onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                    min="1"
                                    max="4"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Monthly Rent (₹)"
                                    value={roomForm.rent}
                                    onChange={(e) => setRoomForm({ ...roomForm, rent: parseInt(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <select
                                    value={roomForm.status}
                                    onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="available">Available</option>
                                    <option value="maintenance">Under Maintenance</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddRoomForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Add Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WardenDashboard;