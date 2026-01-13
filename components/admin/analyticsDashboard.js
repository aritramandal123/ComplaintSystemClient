'use client';
import React, { useMemo } from 'react';
import { Activity, Inbox, TrendingUp, Users } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const AnalyticsDashboard = ({ complaints = [], employees = [] }) => {

    // Memoize stats so we don't recalculate on every render unless data changes
    const stats = useMemo(() => ({
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
        highPriority: complaints.filter(c => c.priority === 'high').length,
    }), [complaints]);

    const statusData = [
        { name: 'Pending', value: stats.pending, color: '#ef4444' },
        { name: 'Active', value: complaints.filter(c => c.status === 'in-progress').length, color: '#eab308' },
        { name: 'Resolved', value: stats.resolved, color: '#10b981' },
    ].filter(i => i.value > 0);

    const categoryData = useMemo(() => {
        const counts = {};
        complaints.forEach(c => {
            const cat = c.category || 'Other';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.keys(counts).map(k => ({ name: k, count: counts[k] })).sort((a, b) => b.count - a.count);
    }, [complaints]);

    const techData = useMemo(() => {
        const counts = {};
        complaints.forEach(c => {
            if (c.technician && c.status !== 'resolved') {
                const emp = employees.find(e => e.employeeId === c.technician);
                const name = emp ? emp.fullName.split(' ')[0] : c.technician;
                counts[name] = (counts[name] || 0) + 1;
            }
        });
        return Object.keys(counts).map(k => ({ name: k, active: counts[k] })).slice(0, 10);
    }, [complaints, employees]);

    return (
        <div className="h-full overflow-y-auto p-8 custom-scrollbar">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
                    <div className="flex justify-between mb-4"><div className="p-2 bg-indigo-50 text-indigo-600 rounded"><Inbox size={20} /></div><span className="text-[10px] uppercase font-black text-slate-400">Total_Logs</span></div>
                    <h3 className="text-3xl font-black text-slate-900">{stats.total}</h3>
                </div>
                <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
                    <div className="flex justify-between mb-4"><div className="p-2 bg-emerald-50 text-emerald-600 rounded"><TrendingUp size={20} /></div><span className="text-[10px] uppercase font-black text-slate-400">Resolved</span></div>
                    <h3 className="text-3xl font-black text-slate-900">{stats.resolved}</h3>
                </div>
                <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
                    <div className="flex justify-between mb-4"><div className="p-2 bg-red-50 text-red-600 rounded"><Activity size={20} /></div><span className="text-[10px] uppercase font-black text-slate-400">Critical</span></div>
                    <h3 className="text-3xl font-black text-slate-900">{stats.highPriority}</h3>
                </div>
                <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
                    <div className="flex justify-between mb-4"><div className="p-2 bg-blue-50 text-blue-600 rounded"><Users size={20} /></div><span className="text-[10px] uppercase font-black text-slate-400">Staff_Active</span></div>
                    <h3 className="text-3xl font-black text-slate-900">{techData.length}</h3>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm h-80 flex flex-col">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-4">Category_Breakdown</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} /><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10, fontWeight: 'bold' }} /><Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px' }} /><Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} /></BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm h-80 flex flex-col">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-4">Status_Distribution</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{statusData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} /></PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;