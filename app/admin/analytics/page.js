'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    ShieldCheck, Inbox, Activity, LogOut,
    PieChart, BarChart as BarIcon, TrendingUp, Users, Calendar
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart as RePieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import LoadingScreen from '../../../components/loadingScreen'; // Adjust path as needed

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [complaints, setComplaints] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    // --- Authentication & Data Fetching ---

    useEffect(() => {
        const checkAuth = () => {
            const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
            const userType = Cookies.get('userType');

            if (!isLoggedIn || userType !== 'admin') {
                router.push('/');
            } else {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, [router]);

    const fetchData = async () => {
        const userId = Cookies.get('userId');
        const token = Cookies.get('token');

        if (!userId) return;

        try {
            // Fetch Complaints
            const complaintsRes = await fetch('http://localhost:8800/getInfo/admin/complaints/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id: userId }),
            });
            const complaintsResult = await complaintsRes.json();
            if (complaintsRes.ok) setComplaints(complaintsResult.complaints);

            // Fetch Employees (for Technician stats)
            const employeesRes = await fetch('http://localhost:8800/getInfo/admin/employees/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id: userId }),
            });
            const employeesResult = await employeesRes.json();
            if (employeesRes.ok) setEmployees(employeesResult.employees);

        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isCheckingAuth) {
            fetchData();
        }
    }, [isCheckingAuth]);

    const handleLogOut = () => {
        Cookies.remove('token', { path: '/' });
        Cookies.remove('isLoggedIn', { path: '/' });
        Cookies.remove('userType', { path: '/' });
        Cookies.remove('userId', { path: '/' });
        router.push('/');
    };

    // --- Data Processing for Recharts ---

    const stats = useMemo(() => {
        return {
            total: complaints.length,
            pending: complaints.filter(c => c.status === 'pending').length,
            inProgress: complaints.filter(c => c.status === 'in-progress').length,
            resolved: complaints.filter(c => c.status === 'resolved').length,
            highPriority: complaints.filter(c => c.priority === 'high').length,
        };
    }, [complaints]);

    // 1. Status Distribution Data
    const statusData = [
        { name: 'Pending', value: stats.pending, color: '#ef4444' }, // Red-500
        { name: 'In Progress', value: stats.inProgress, color: '#eab308' }, // Yellow-500
        { name: 'Resolved', value: stats.resolved, color: '#10b981' }, // Emerald-500
    ].filter(item => item.value > 0);

    // 2. Category Distribution Data
    const categoryData = useMemo(() => {
        const counts = {};
        complaints.forEach(c => {
            const cat = c.category || 'Uncategorized';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({
            name: key,
            count: counts[key]
        })).sort((a, b) => b.count - a.count);
    }, [complaints]);

    // 3. Technician Workload Data
    const technicianData = useMemo(() => {
        const counts = {};
        complaints.forEach(c => {
            if (c.technician && c.status !== 'resolved') {
                // Find employee name
                const emp = employees.find(e => e.employeeId === c.technician);
                const name = emp ? emp.fullName.split(' ')[0] : c.technician; // First name or ID
                counts[name] = (counts[name] || 0) + 1;
            }
        });
        return Object.keys(counts).map(key => ({
            name: key,
            activeTickets: counts[key]
        })).slice(0, 10); // Top 10
    }, [complaints, employees]);

    // 4. Priority Breakdown
    const priorityData = useMemo(() => {
        const counts = { high: 0, medium: 0, low: 0 };
        complaints.forEach(c => {
            const p = c.priority ? c.priority.toLowerCase() : 'low';
            if (counts[p] !== undefined) counts[p]++;
        });
        return [
            { name: 'High', value: counts.high, fill: '#ef4444' },
            { name: 'Medium', value: counts.medium, fill: '#6366f1' },
            { name: 'Low', value: counts.low, fill: '#10b981' },
        ];
    }, [complaints]);


    if (isCheckingAuth || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <LoadingScreen />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
            {/* SIDEBAR (Reused for consistency) */}
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
                        onClick={() => router.push('/admin/home')}
                        className="w-full flex items-center gap-3 p-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-all rounded-sm"
                    >
                        <Inbox size={16} /> Queue
                    </button>
                    <button className="w-full flex items-center gap-3 p-2.5 text-xs font-bold uppercase tracking-wider bg-slate-900 text-white shadow-lg shadow-slate-200 rounded-sm">
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
            <main className="flex-1 h-screen flex flex-col overflow-y-auto custom-scrollbar">
                <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Analytics_Dashboard</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Real_Time_Data</span>
                    </div>
                </header>

                <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">

                    {/* TOP STATS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                                    <Inbox size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase text-slate-400">Total_Logs</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">{stats.total}</h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">All recorded complaints</p>
                        </div>

                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase text-slate-400">Resolution_Rate</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">
                                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Efficiency metric</p>
                        </div>

                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-red-50 text-red-600 rounded">
                                    <Activity size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase text-slate-400">Critical_Issues</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">{stats.highPriority}</h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">High priority pending</p>
                        </div>

                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded">
                                    <Users size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase text-slate-400">Active_Staff</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">{technicianData.length}</h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Technicians with tickets</p>
                        </div>
                    </div>

                    {/* MAIN CHARTS ROW */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* CHART 1: Category Distribution */}
                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex flex-col">
                            <div className="mb-6">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Issue_Categories</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Volume by department</p>
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                            width={100}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff' }}
                                            cursor={{ fill: '#f1f5f9' }}
                                        />
                                        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* CHART 2: Status Breakdown (Donut) */}
                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex flex-col">
                            <div className="mb-6">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Current_Status</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Global ticket distribution</p>
                            </div>
                            <div className="h-64 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={statusData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff' }} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                                    </RePieChart>
                                </ResponsiveContainer>
                                {/* Center Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                    <span className="text-2xl font-black text-slate-800">{stats.total}</span>
                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Total</span>
                                </div>
                            </div>
                        </div>

                        {/* CHART 3: Technician Workload */}
                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex flex-col">
                            <div className="mb-6">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Technician_Load</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Active tickets per staff</p>
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={technicianData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis hide />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff' }}
                                            cursor={{ fill: '#f1f5f9' }}
                                        />
                                        <Bar dataKey="activeTickets" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* CHART 4: Priority Distribution */}
                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex flex-col">
                            <div className="mb-6">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Severity_Index</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Complaints by priority level</p>
                            </div>
                            <div className="h-64 w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={priorityData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                            width={60}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff' }}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={25}>
                                            {priorityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminAnalytics;