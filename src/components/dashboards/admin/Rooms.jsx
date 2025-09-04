import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(12);
    const [form, setForm] = useState({
        roomNumber: '',
        floor: '',
        capacity: 2,
        rent: 0,
        status: 'available'
    });

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://hms-backend-production-9545.up.railway.app/warden/rooms', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const roomData = res.data.rooms || [];
                setRooms(roomData);
                setFilteredRooms(roomData);
            } catch (e) {
                setRooms([]);
                setFilteredRooms([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    // Filter and search functionality
    useEffect(() => {
        let filtered = rooms;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(room =>
                room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (room.students && room.students.some(student =>
                    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
                ))
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(room => room.status === statusFilter);
        }

        setFilteredRooms(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [rooms, searchTerm, statusFilter]);

    // Pagination
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

    // Statistics
    const stats = {
        total: rooms.length,
        available: rooms.filter(r => r.status === 'available').length,
        occupied: rooms.filter(r => r.status === 'occupied').length,
        maintenance: rooms.filter(r => r.status === 'maintenance').length,
        totalCapacity: rooms.reduce((sum, r) => sum + r.capacity, 0),
        currentOccupancy: rooms.reduce((sum, r) => sum + (r.currentOccupancy || 0), 0)
    };

    if (loading) {
        return <div className="p-6">Loading rooms…</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Rooms</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage room allocation and availability</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Room
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 text-sm font-medium">🏠</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Rooms</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-sm font-medium">✓</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Available</dt>
                                    <dd className="text-lg font-medium text-green-600">{stats.available}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 text-sm font-medium">👥</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Occupied</dt>
                                    <dd className="text-lg font-medium text-blue-600">{stats.occupied}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <span className="text-yellow-600 text-sm font-medium">🔧</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Maintenance</dt>
                                    <dd className="text-lg font-medium text-yellow-600">{stats.maintenance}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-600 text-sm font-medium">%</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Occupancy</dt>
                                    <dd className="text-lg font-medium text-purple-600">
                                        {stats.totalCapacity > 0 ? Math.round((stats.currentOccupancy / stats.totalCapacity) * 100) : 0}%
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex-1 min-w-0">
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by room number, floor, or student name..."
                                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <select
                                className="focus:ring-green-500 focus:border-green-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 text-sm text-gray-700">
                    Showing {indexOfFirstRoom + 1}-{Math.min(indexOfLastRoom, filteredRooms.length)} of {filteredRooms.length} rooms
                    {searchTerm && ` (filtered from ${rooms.length} total)`}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentRooms.map((r) => (
                    <div key={r._id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">Room {r.roomNumber}</h3>
                            <span className={`px-2 py-1 text-xs rounded ${r.status === 'available' ? 'bg-green-100 text-green-800' :
                                r.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {r.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">Floor: {r.floor}</p>
                        <p className="text-sm text-gray-600">Occupancy: {r.currentOccupancy || 0}/{r.capacity}</p>
                        <p className="text-sm text-gray-600">Rent: ₹{r.rent}</p>
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${((r.currentOccupancy || 0) / r.capacity) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        {r.students && r.students.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs font-medium text-gray-700">Students:</p>
                                {r.students.map((student) => (
                                    <p key={student._id} className="text-xs text-gray-600">
                                        {student.fullName} ({student.studentId})
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {currentRooms.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-16-5c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by adding a new room.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* Page numbers */}
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {showAdd && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Add New Room</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const token = localStorage.getItem('token');
                                await axios.post('https://hms-backend-production-9545.up.railway.app/warden/rooms', form, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                setShowAdd(false);
                                setForm({
                                    roomNumber: '',
                                    floor: '',
                                    capacity: 2,
                                    rent: 0,
                                    status: 'available'
                                });
                                // Refresh rooms
                                const res = await axios.get('https://hms-backend-production-9545.up.railway.app/warden/rooms', {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                const roomData = res.data.rooms || [];
                                setRooms(roomData);
                                setFilteredRooms(roomData);
                            } catch (error) {
                                console.error('Error adding room:', error);
                                alert('Error adding room. Please try again.');
                            }
                        }}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Room Number"
                                    value={form.roomNumber}
                                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Floor"
                                    value={form.floor}
                                    onChange={(e) => setForm({ ...form, floor: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Capacity"
                                    value={form.capacity}
                                    onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                    min="1"
                                    max="4"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Monthly Rent (₹)"
                                    value={form.rent}
                                    onChange={(e) => setForm({ ...form, rent: parseInt(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="available">Available</option>
                                    <option value="maintenance">Under Maintenance</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAdd(false)}
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

export default AdminRooms;
