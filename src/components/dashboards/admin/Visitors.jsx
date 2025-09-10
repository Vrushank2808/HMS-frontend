import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../../config/env';

const AdminVisitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [filteredVisitors, setFilteredVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [visitorsPerPage] = useState(15);

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(getApiUrl('/security/visitors'), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const visitorData = res.data.visitors || [];
                setVisitors(visitorData);
                setFilteredVisitors(visitorData);
            } catch (e) {
                console.error('Error fetching visitors:', e);
                setVisitors([]);
                setFilteredVisitors([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVisitors();
    }, []);

    // Filter and search functionality
    useEffect(() => {
        let filtered = visitors;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(visitor =>
                visitor.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visitor.visitorPhone.includes(searchTerm) ||
                visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visitor.studentId?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(visitor => visitor.status === statusFilter);
        }

        setFilteredVisitors(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [visitors, searchTerm, statusFilter]);

    // Pagination
    const indexOfLastVisitor = currentPage * visitorsPerPage;
    const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
    const currentVisitors = filteredVisitors.slice(indexOfFirstVisitor, indexOfLastVisitor);
    const totalPages = Math.ceil(filteredVisitors.length / visitorsPerPage);

    // Statistics
    const stats = {
        total: visitors.length,
        checkedIn: visitors.filter(v => v.status === 'checked-in').length,
        checkedOut: visitors.filter(v => v.status === 'checked-out').length,
        today: visitors.filter(v => {
            const today = new Date();
            const visitorDate = new Date(v.checkInTime);
            return visitorDate.toDateString() === today.toDateString();
        }).length
    };

    const checkOutVisitor = async (visitorId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(getApiUrl(`/security/visitors/${visitorId}/checkout`),
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh visitors
            const res = await axios.get(getApiUrl('/security/visitors'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            const visitorData = res.data.visitors || [];
            setVisitors(visitorData);
            setFilteredVisitors(visitorData);
        } catch (error) {
            console.error('Error checking out visitor:', error);
        }
    };

    if (loading) {
        return <div className="p-6">Loading visitors…</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Visitors Management</h2>
                    <p className="text-sm text-gray-600 mt-1">Monitor and manage all hostel visitors</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 text-sm font-medium">👥</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Visitors</dt>
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
                                    <span className="text-green-600 text-sm font-medium">🚪</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Currently In</dt>
                                    <dd className="text-lg font-medium text-green-600">{stats.checkedIn}</dd>
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
                                    <span className="text-blue-600 text-sm font-medium">📅</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Today's Visits</dt>
                                    <dd className="text-lg font-medium text-blue-600">{stats.today}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 text-sm font-medium">🚶</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Checked Out</dt>
                                    <dd className="text-lg font-medium text-gray-600">{stats.checkedOut}</dd>
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
                                    placeholder="Search by visitor name, phone, purpose, or student name..."
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <select
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="checked-in">Checked In</option>
                                <option value="checked-out">Checked Out</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 text-sm text-gray-700">
                    Showing {indexOfFirstVisitor + 1}-{Math.min(indexOfLastVisitor, filteredVisitors.length)} of {filteredVisitors.length} visitors
                    {searchTerm && ` (filtered from ${visitors.length} total)`}
                </div>
            </div>

            {/* Visitors Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Visitor Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Phone</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Student</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Purpose</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Check In</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Check Out</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentVisitors.map((visitor) => (
                            <tr key={visitor._id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                    <div className="max-w-[150px] truncate" title={visitor.visitorName}>
                                        {visitor.visitorName}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 font-mono">
                                    {visitor.visitorPhone}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    <div className="max-w-[150px] truncate" title={visitor.studentId?.fullName}>
                                        {visitor.studentId?.fullName || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    <div className="max-w-[120px] truncate" title={visitor.purpose}>
                                        {visitor.purpose}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {new Date(visitor.checkInTime).toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleString() : '-'}
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${visitor.status === 'checked-in' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {visitor.status === 'checked-in' ? 'In Hostel' : 'Checked Out'}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-sm font-medium">
                                    {visitor.status === 'checked-in' && (
                                        <button
                                            onClick={() => checkOutVisitor(visitor._id)}
                                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Check Out
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {currentVisitors.length === 0 && (
                            <tr>
                                <td className="px-4 py-8 text-sm text-gray-500 text-center" colSpan={8}>
                                    <div className="flex flex-col items-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 24c4.004 0 7.625 2.371 9.287 6m-9.287-6H4a6 6 0 016-6h8a6 6 0 016 6z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No visitors found</h3>
                                        <p className="mt-1 text-sm text-gray-500">No visitors match your current filters.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
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
        </div>
    );
};

export default AdminVisitors;