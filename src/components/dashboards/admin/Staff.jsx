import React from 'react';
import axios from 'axios';

const AdminStaff = () => {
    const [wardens, setWardens] = React.useState([]);
    const [securities, setSecurities] = React.useState([]);
    const [filteredWardens, setFilteredWardens] = React.useState([]);
    const [filteredSecurities, setFilteredSecurities] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showWardenForm, setShowWardenForm] = React.useState(false);
    const [showSecurityForm, setShowSecurityForm] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentWardenPage, setCurrentWardenPage] = React.useState(1);
    const [currentSecurityPage, setCurrentSecurityPage] = React.useState(1);
    const [staffPerPage] = React.useState(6);
    const [form, setForm] = React.useState({ fullName: '', email: '', phone: '', password: '' });

    React.useEffect(() => {
        const fetchStaff = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://hms-backend-production-9545.up.railway.app/admin/staff', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const wardenData = res.data.wardens || [];
                const securityData = res.data.securities || [];
                setWardens(wardenData);
                setSecurities(securityData);
                setFilteredWardens(wardenData);
                setFilteredSecurities(securityData);
            } catch (e) {
                setWardens([]);
                setSecurities([]);
                setFilteredWardens([]);
                setFilteredSecurities([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    // Filter and search functionality
    React.useEffect(() => {
        if (searchTerm) {
            const filteredW = wardens.filter(warden =>
                warden.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                warden.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                warden.phone.includes(searchTerm)
            );
            const filteredS = securities.filter(security =>
                security.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                security.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                security.phone.includes(searchTerm)
            );
            setFilteredWardens(filteredW);
            setFilteredSecurities(filteredS);
        } else {
            setFilteredWardens(wardens);
            setFilteredSecurities(securities);
        }
        setCurrentWardenPage(1);
        setCurrentSecurityPage(1);
    }, [wardens, securities, searchTerm]);

    // Pagination for wardens
    const indexOfLastWarden = currentWardenPage * staffPerPage;
    const indexOfFirstWarden = indexOfLastWarden - staffPerPage;
    const currentWardens = filteredWardens.slice(indexOfFirstWarden, indexOfLastWarden);
    const totalWardenPages = Math.ceil(filteredWardens.length / staffPerPage);

    // Pagination for securities
    const indexOfLastSecurity = currentSecurityPage * staffPerPage;
    const indexOfFirstSecurity = indexOfLastSecurity - staffPerPage;
    const currentSecurities = filteredSecurities.slice(indexOfFirstSecurity, indexOfLastSecurity);
    const totalSecurityPages = Math.ceil(filteredSecurities.length / staffPerPage);

    // Statistics
    const stats = {
        totalWardens: wardens.length,
        totalSecurities: securities.length,
        totalStaff: wardens.length + securities.length
    };

    if (loading) {
        return <div className="p-6">Loading staff…</div>;
    }

    const submit = async (type) => {
        try {
            const endpoint = type === 'warden' ? 'https://hms-backend-production-9545.up.railway.app/warden/register' : 'https://hms-backend-production-9545.up.railway.app/security/register';
            await axios.post(endpoint, form);
            setForm({ fullName: '', email: '', phone: '', password: '' });
            setShowWardenForm(false);
            setShowSecurityForm(false);
            // refresh
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('https://hms-backend-production-9545.up.railway.app/admin/staff', { headers: { Authorization: `Bearer ${token}` } });
            const wardenData = res.data.wardens || [];
            const securityData = res.data.securities || [];
            setWardens(wardenData);
            setSecurities(securityData);
            setFilteredWardens(wardenData);
            setFilteredSecurities(securityData);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to add staff:', e?.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Staff Management</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage wardens and security personnel</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Staff</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalStaff}</dd>
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
                                    <span className="text-blue-600 text-sm font-medium">👨‍💼</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Wardens</dt>
                                    <dd className="text-lg font-medium text-blue-600">{stats.totalWardens}</dd>
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
                                    <span className="text-green-600 text-sm font-medium">🛡️</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Security</dt>
                                    <dd className="text-lg font-medium text-green-600">{stats.totalSecurities}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Control */}
            <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-6 py-4">
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search staff by name, email, or phone..."
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Wardens</h3>
                    <button onClick={() => setShowWardenForm(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Warden
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {currentWardens.map((w) => (
                        <div key={w._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 text-lg font-medium">👨‍💼</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{w.fullName}</h3>
                                    <p className="text-sm text-gray-500">Warden</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    {w.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    {w.phone}
                                </div>
                            </div>
                        </div>
                    ))}
                    {currentWardens.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 24c4.004 0 7.625 2.371 9.287 6m-9.287-6H4a6 6 0 016-6h8a6 6 0 016 6z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No wardens found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding a new warden.</p>
                        </div>
                    )}
                </div>

                {/* Warden Pagination */}
                {totalWardenPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => setCurrentWardenPage(Math.max(1, currentWardenPage - 1))}
                                disabled={currentWardenPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalWardenPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentWardenPage(i + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentWardenPage === i + 1
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentWardenPage(Math.min(totalWardenPages, currentWardenPage + 1))}
                                disabled={currentWardenPage === totalWardenPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Security Personnel</h3>
                    <button onClick={() => setShowSecurityForm(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Security
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {currentSecurities.map((s) => (
                        <div key={s._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-lg font-medium">🛡️</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{s.fullName}</h3>
                                    <p className="text-sm text-gray-500">Security</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    {s.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    {s.phone}
                                </div>
                            </div>
                        </div>
                    ))}
                    {currentSecurities.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 24c4.004 0 7.625 2.371 9.287 6m-9.287-6H4a6 6 0 016-6h8a6 6 0 016 6z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No security personnel found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding security staff.</p>
                        </div>
                    )}
                </div>

                {/* Security Pagination */}
                {totalSecurityPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => setCurrentSecurityPage(Math.max(1, currentSecurityPage - 1))}
                                disabled={currentSecurityPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalSecurityPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentSecurityPage(i + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentSecurityPage === i + 1
                                        ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentSecurityPage(Math.min(totalSecurityPages, currentSecurityPage + 1))}
                                disabled={currentSecurityPage === totalSecurityPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {(showWardenForm || showSecurityForm) && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Add {showWardenForm ? 'Warden' : 'Security'}</h3>
                        <div className="space-y-3">
                            <input className="w-full border rounded px-3 py-2" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                            <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => { setShowWardenForm(false); setShowSecurityForm(false); }} className="px-3 py-2 rounded border">Cancel</button>
                            <button onClick={() => submit(showWardenForm ? 'warden' : 'security')} className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStaff;
