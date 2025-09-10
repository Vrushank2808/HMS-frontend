import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../../config/env';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(20);
    const [form, setForm] = useState({
        fullName: '', email: '', phone: '', password: '', studentId: '', course: '', year: 1,
        guardianName: '', guardianPhone: '', address: '', dateOfBirth: '', roomId: '',
        feeAmount: 0, feeStatus: 'pending'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [studentsRes, roomsRes] = await Promise.all([
                    axios.get(getApiUrl('/warden/students'), {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(getApiUrl('/warden/rooms'), {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                const studentData = studentsRes.data.students || [];
                setStudents(studentData);
                setFilteredStudents(studentData);
                setRooms(roomsRes.data.rooms || []);
            } catch (e) {
                setStudents([]);
                setFilteredStudents([]);
                setRooms([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter and search functionality
    useEffect(() => {
        let filtered = students;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(student =>
                student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.course.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(student => student.feeStatus === statusFilter);
        }

        setFilteredStudents(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [students, searchTerm, statusFilter]);

    // Pagination
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    // Statistics
    const stats = {
        total: students.length,
        paid: students.filter(s => s.feeStatus === 'paid').length,
        partial: students.filter(s => s.feeStatus === 'partial').length,
        pending: students.filter(s => s.feeStatus === 'pending').length,
        overdue: students.filter(s => s.feeStatus === 'overdue').length
    };

    const updateFeeStatus = async (studentId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://hms-backend-production-9545.up.railway.app/warden/students/${studentId}/fees`,
                { feeStatus: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh students
            const res = await axios.get('https://hms-backend-production-9545.up.railway.app/warden/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const studentData = res.data.students || [];
            setStudents(studentData);
            setFilteredStudents(studentData);
        } catch (error) {
            console.error('Error updating fee status:', error);
        }
    };

    if (loading) {
        return <div className="p-6">Loading students…</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Students</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage student records and fee statuses</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Student
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">Paid</dt>
                                    <dd className="text-lg font-medium text-green-600">{stats.paid}</dd>
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
                                    <span className="text-blue-600 text-sm font-medium">◐</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Partial</dt>
                                    <dd className="text-lg font-medium text-blue-600">{stats.partial}</dd>
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
                                    <span className="text-yellow-600 text-sm font-medium">⏳</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                    <dd className="text-lg font-medium text-yellow-600">{stats.pending}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 text-sm font-medium">!</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                                    <dd className="text-lg font-medium text-red-600">{stats.overdue}</dd>
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
                                    placeholder="Search by name, email, student ID, or course..."
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
                                <option value="paid">Paid</option>
                                <option value="partial">Partial</option>
                                <option value="pending">Pending</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 text-sm text-gray-700">
                    Showing {indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
                    {searchTerm && ` (filtered from ${students.length} total)`}
                </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Student ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Room</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">Course</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Fee Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Fee Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentStudents.map((s) => (
                            <tr key={s._id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                    <div className="max-w-[150px] truncate" title={s.fullName}>
                                        {s.fullName}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    <div className="max-w-[200px] truncate" title={s.email}>
                                        {s.email}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 font-mono">
                                    {s.studentId}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 text-center">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {s.roomId?.roomNumber || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    <div className="max-w-[180px] truncate" title={s.course}>
                                        {s.course}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.feeStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                        s.feeStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            s.feeStatus === 'partial' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {s.feeStatus || 'pending'}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900 font-semibold">
                                    ₹{(s.feeAmount || s.roomId?.rent || 0).toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-sm font-medium">
                                    <div className="flex space-x-2">
                                        {s.feeStatus !== 'paid' && (
                                            <button
                                                onClick={() => updateFeeStatus(s._id, 'paid')}
                                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                        {s.feeStatus === 'paid' && (
                                            <button
                                                onClick={() => updateFeeStatus(s._id, 'pending')}
                                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                            >
                                                Mark Pending
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {currentStudents.length === 0 && (
                            <tr>
                                <td className="px-4 py-8 text-sm text-gray-500 text-center" colSpan={8}>
                                    <div className="flex flex-col items-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 24c4.004 0 7.625 2.371 9.287 6m-9.287-6H4a6 6 0 016-6h8a6 6 0 016 6z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                                        <p className="mt-1 text-sm text-gray-500">Get started by adding a new student.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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

            {showAdd && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Add Student</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input className="border rounded px-3 py-2" placeholder="Full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                            <input type="email" className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            <input className="border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            <input className="border rounded px-3 py-2" placeholder="Student ID" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} />
                            <input className="border rounded px-3 py-2" placeholder="Course" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} />
                            <input type="number" className="border rounded px-3 py-2" placeholder="Year" value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })} />
                            <input className="border rounded px-3 py-2" placeholder="Guardian Name" value={form.guardianName} onChange={e => setForm({ ...form, guardianName: e.target.value })} />
                            <input className="border rounded px-3 py-2" placeholder="Guardian Phone" value={form.guardianPhone} onChange={e => setForm({ ...form, guardianPhone: e.target.value })} />
                            <input className="md:col-span-2 border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                            <input type="date" className="border rounded px-3 py-2" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
                            <input type="password" className="border rounded px-3 py-2" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowAdd(false)} className="px-3 py-2 rounded border">Cancel</button>
                            <button onClick={async () => {
                                try {
                                    await axios.post('https://hms-backend-production-9545.up.railway.app/student/register', form);
                                    setShowAdd(false);
                                    setForm({ fullName: '', email: '', phone: '', password: '', studentId: '', course: '', year: 1, guardianName: '', guardianPhone: '', address: '', dateOfBirth: '', roomId: '', feeAmount: 0, feeStatus: 'pending' });
                                    // refresh
                                    const token = localStorage.getItem('token');
                                    const res = await axios.get('https://hms-backend-production-9545.up.railway.app/warden/students', { headers: { Authorization: `Bearer ${token}` } });
                                    setStudents(res.data.students || []);
                                } catch (e) { console.error('Add student failed', e?.response?.data || e.message) }
                            }} className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;
