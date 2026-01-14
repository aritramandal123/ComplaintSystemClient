'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    ShieldCheck, Inbox, Activity, LogOut, Search, RefreshCw
} from 'lucide-react';
import LoadingScreen from '../../../components/loadingScreen';

// --- SUB-COMPONENTS ---
import QueueBoard from '../../../components/admin/queueBoard';
import AnalyticsDashboard from '../../../components/admin/analyticsDashboard';

/**
 * AdminHome Component
 * Main dashboard for administrators to manage complaint queues and view analytics.
 */
const AdminHome = () => {
    // --- 1. STATE MANAGEMENT ---
    const [adminData, setAdminData] = React.useState(null);      // Logged-in admin profile
    const [loading, setLoading] = React.useState(true);          // Global loading state
    const [complaints, setComplaints] = React.useState([]);      // List of all system complaints
    const [employees, setEmployees] = React.useState([]);        // List of all employees for assignment
    const [update, setUpdate] = React.useState(0);               // Toggle to trigger data re-fetch
    const [isCheckingAuth, setIsCheckingAuth] = React.useState(true); // Auth guard state
    const [activeTab, setActiveTab] = React.useState('queue');   // Navigation: 'queue' | 'analytics'

    const URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // --- 2. DATA FETCHING LOGIC ---

    /** Fetches admin profile details */
    const fetchAdminInfo = async () => {
        const userId = Cookies.get('userId');
        if (!userId) { setLoading(false); return; }
        try {
            const response = await fetch(`${URL}/getInfo/adminInfo/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}` },
                body: JSON.stringify({ id: userId, userType: 'admin' }),
            });
            const result = await response.json();
            if (response.ok) setAdminData(result.profile);
        } catch (error) {
            console.error('Error fetching admin profile:', error);
        } finally {
            setLoading(false);
        }
    };

    /** Fetches all complaints for the dashboard */
    const getAllComplaints = async () => {
        const userId = Cookies.get('userId');
        try {
            const response = await fetch(`${URL}/getInfo/admin/complaints/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}` },
                body: JSON.stringify({ id: userId }),
            });
            const result = await response.json();
            if (response.ok) setComplaints(result.complaints);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    /** Fetches all employees for assignment dropdowns */
    const getAllEmployees = async () => {
        const userId = Cookies.get('userId');
        try {
            const response = await fetch(`${URL}/getInfo/admin/employees/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}` },
                body: JSON.stringify({ id: userId }),
            });
            const result = await response.json();
            if (response.ok) setEmployees(result.employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    // --- 3. ACTION HANDLERS ---

    /** Persists complaint changes (status/assignment) to the database */
    const handleSaveChanges = async (updatedComplaint) => {
        const userId = Cookies.get('userId');
        try {
            const response = await fetch(`${URL}/complaints/admin/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}` },
                body: JSON.stringify({ id: userId, complaint: updatedComplaint }),
            });

            if (response.ok) {
                // Trigger re-fetch of all data
                setUpdate((prev) => (prev === 0 ? 1 : 0));
            }
        } catch (error) {
            console.error('Error updating complaint:', error);
        }
    };

    /** Clears session and redirects to login */
    const handleLogOut = () => {
        Cookies.remove('token', { path: '/' });
        Cookies.remove('isLoggedIn', { path: '/' });
        Cookies.remove('userType', { path: '/' });
        Cookies.remove('userId', { path: '/' });
        router.push('/');
    };

    // --- 4. SIDE EFFECTS ---

    /** Sync data whenever 'update' is toggled */
    React.useEffect(() => {
        fetchAdminInfo();
        getAllComplaints();
        getAllEmployees();
    }, [update]);

    /** Route Protection: Ensure user is an admin */
    React.useEffect(() => {
        const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
        const userType = Cookies.get('userType');
        if (!isLoggedIn || userType === 'user') {
            router.push('/');
        } else {
            setIsCheckingAuth(false);
        }
    }, [router]);

    if (isCheckingAuth) {
        return <div className="flex min-h-screen items-center justify-center bg-slate-50"><LoadingScreen /></div>;
    }

    // --- 5. RENDER ---
    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-slate-200 bg-white hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                    <div className="bg-indigo-600 text-white p-1 rounded-sm">
                        <ShieldCheck size={18} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-black tracking-tighter text-slate-900 uppercase italic">Nexus_Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Control Panel</div>
                    <button
                        onClick={() => setActiveTab('queue')}
                        className={`w-full flex items-center gap-3 p-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${activeTab === 'queue' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
                    >
                        <Inbox size={16} /> Queue
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`w-full flex items-center gap-3 p-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
                    >
                        <Activity size={16} /> Analytics
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={handleLogOut} className="w-full flex items-center justify-center gap-2 p-2 text-[10px] font-bold uppercase tracking-[0.2em] border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all">
                        <LogOut size={14} /> Terminate_Session
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 h-screen flex flex-col overflow-hidden">
                <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest">{adminData?.fullName || 'Admin'}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Live_Metrics</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <Search size={16} className="cursor-pointer hover:text-indigo-600" />
                        <div className="w-px h-4 bg-slate-200"></div>
                        <RefreshCw size={16} onClick={() => setUpdate((prev) => (prev === 0 ? 1 : 0))} className="cursor-pointer hover:text-indigo-600" />
                    </div>
                </header>

                {/* DYNAMIC CONTENT AREA */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === 'queue' ? (
                        <QueueBoard
                            complaints={complaints}
                            employees={employees}
                            onSaveChanges={handleSaveChanges}
                        />
                    ) : (
                        <AnalyticsDashboard
                            complaints={complaints}
                            employees={employees}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminHome;