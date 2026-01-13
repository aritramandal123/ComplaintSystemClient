'use client';
import React from 'react';
import { ChevronRight, X, Hash, Users, LogOut } from 'lucide-react';

const QueueBoard = ({ complaints, employees, onSaveChanges }) => {
    // Local UI State (Moved from Parent)
    const [selectedComplaint, setSelectedComplaint] = React.useState(null);
    const [viewAllCategory, setViewAllCategory] = React.useState(null);
    const [viewAllEmployees, setViewAllEmployees] = React.useState(null);

    // Calculated stats
    const stats = {
        pending: complaints.filter(c => c.status === 'pending').length,
        active: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length
    };

    // --- LOCAL HANDLERS (Modifying the object in memory before saving) ---
    const handleUpdateStatus = (newStatus) => {
        if (!selectedComplaint) return;
        const updated = { ...selectedComplaint, status: newStatus };
        setSelectedComplaint(updated);
    };

    const togglePriority = () => {
        if (!selectedComplaint) return;
        const priorities = ['low', 'medium', 'high'];
        const currentIndex = priorities.indexOf(selectedComplaint.priority);
        const nextIndex = (currentIndex + 1) % priorities.length;
        const updated = { ...selectedComplaint, priority: priorities[nextIndex] };
        setSelectedComplaint(updated);
    };

    const assignEmp = (employee) => {
        if (!selectedComplaint) return;
        const updated = { ...selectedComplaint, technician: employee.employeeId };
        setSelectedComplaint(updated);
        setViewAllEmployees(null);
    };

    const handleCommitChanges = () => {
        onSaveChanges(selectedComplaint); // Call Parent API function
        setSelectedComplaint(null); // Close Modal
    };


    // Sub-Component: Status Column
    const StatusColumn = ({ title, count, accentColor, complaintsList, onSelect, selectedId }) => (
        <div className="flex flex-1 flex-col bg-slate-100/50 rounded-sm border border-slate-200 min-h-0">
            <div className="p-3 flex justify-between items-center border-b border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${accentColor}`}></div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600">{title}</h3>
                </div>
                <span className=" text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">{count}</span>
            </div>
            <div className="flex-1 max-h-full overflow-y-scroll no-scrollbar p-3 space-y-3">
                {complaintsList.map(complaint => (
                    <div
                        key={complaint.complaintId}
                        onClick={() => onSelect(complaint)}
                        className={`p-4 bg-white border border-slate-200 rounded-sm shadow-sm cursor-pointer transition-all hover:border-indigo-400 group ${selectedId === complaint.complaintId ? 'ring-2 ring-indigo-500' : ''}`}
                    >
                        <div className="text-[9px] font-mono text-slate-400 mb-1 flex justify-between">
                            <span>{complaint.id}</span>
                            <span>{complaint.category}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 uppercase leading-tight group-hover:text-indigo-600 transition-colors">
                            {complaint.title}
                        </h4>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={() => setViewAllCategory(complaintsList)} className="w-full flex items-center justify-center gap-2 p-2 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50 transition-all">
                    <ChevronRight size={14} /> View_All
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Quick Stats Header (Optional, copied from logic) */}
            <div className="flex items-center gap-4 px-8 py-2 bg-white border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2"><span className="text-xs font-black text-red-500">{stats.pending}</span><span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Pending</span></div>
                <div className="flex items-center gap-2"><span className="text-xs font-black text-yellow-500">{stats.active}</span><span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">In_Progress</span></div>
                <div className="flex items-center gap-2"><span className="text-xs font-black text-emerald-500">{stats.resolved}</span><span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Resolved</span></div>
            </div>

            {/* THREE COLUMN KANBAN BOARD */}
            <div className="flex-1 p-6 flex gap-6 overflow-hidden">
                <StatusColumn
                    title="Pending_Queue"
                    count={stats.pending}
                    accentColor="bg-red-500"
                    complaintsList={complaints.filter(c => c.status === 'pending')}
                    onSelect={setSelectedComplaint}
                    selectedId={selectedComplaint?.complaintId}
                />
                <StatusColumn
                    title="In_Progress"
                    count={stats.active}
                    accentColor="bg-yellow-500"
                    complaintsList={complaints.filter(c => c.status === 'in-progress')}
                    onSelect={setSelectedComplaint}
                    selectedId={selectedComplaint?.complaintId}
                />
                <StatusColumn
                    title="Resolved"
                    count={stats.resolved}
                    accentColor="bg-emerald-500"
                    complaintsList={complaints.filter(c => c.status === 'resolved')}
                    onSelect={setSelectedComplaint}
                    selectedId={selectedComplaint?.complaintId}
                />
            </div>

            {/* MODAL: INSPECTION PANEL */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex justify-center items-center p-4">
                    <div className="absolute inset-0" onClick={() => setSelectedComplaint(null)} />
                    <div className="relative w-full max-w-2xl bg-white max-h-[90vh] shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-300 flex flex-col border border-slate-200 overflow-hidden">

                        <div className="bg-slate-900 p-5 text-white flex justify-between items-center shrink-0">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Inspection_Module</span>
                                <span className="text-[9px] font-mono text-blue-400 mt-1 uppercase">System_Status: Active</span>
                            </div>
                            <button onClick={() => setSelectedComplaint(null)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-8 pb-0">
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedComplaint.title}</h2>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-slate-400 flex items-center gap-1"><Hash size={12} /> {selectedComplaint.id}</span>
                                            <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                            <span className="text-xs text-slate-500">{selectedComplaint.date}</span>
                                        </div>
                                    </div>
                                    <button onClick={togglePriority} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all hover:scale-105 active:scale-95 cursor-pointer ${selectedComplaint.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : selectedComplaint.priority === 'low' ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}>
                                        {selectedComplaint.priority || 'Standard'}_Priority
                                    </button>
                                </div>
                                <hr className="border-slate-100" />
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 underline decoration-blue-500 underline-offset-4">Report_Details</label>
                                        <p className="text-slate-600 text-sm leading-relaxed">{selectedComplaint.description || "No description."}</p>
                                    </div>
                                    <div onClick={() => selectedComplaint.status === 'pending' ? setViewAllEmployees(employees) : {}} className="bg-slate-50 p-4 rounded-xl border border-slate-100 cursor-pointer">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Assigned_Technician</label>
                                        <p className="text-sm font-semibold text-slate-700">{employees.find(u => u.employeeId === selectedComplaint.technician)?.fullName || "Unassigned"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {['pending', 'in-progress', 'resolved'].map((status) => (
                                        selectedComplaint.status !== status && (
                                            <button key={status} onClick={() => handleUpdateStatus(status)} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest">
                                                Mark_{status.replace('-', '_').toUpperCase()}
                                            </button>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                            <button onClick={() => setSelectedComplaint(null)} className="px-6 py-2.5 text-xs font-bold bg-slate-200 text-slate-400 rounded-lg hover:text-slate-600 transition-colors uppercase tracking-widest">Discard_Changes</button>
                            <button onClick={handleCommitChanges} className="px-6 py-2.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest">Update_Log</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: VIEW ALL CATEGORY */}
            {viewAllCategory && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex justify-center items-center p-4 sm:p-6">
                    <div className="w-full max-w-5xl bg-white h-[85vh] rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col border border-slate-200">
                        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">System / <span className="text-white">Complete_Queue</span></span>
                            </div>
                            <button onClick={() => setViewAllCategory(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all group"><LogOut size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <div className="px-8 pb-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pt-8">
                                <table className="w-full border-separate border-spacing-0">
                                    <thead className="sticky top-0 bg-white z-10">
                                        <tr>
                                            <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Title</th>
                                            <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Status</th>
                                            <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Date</th>
                                            <th className="text-right py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {viewAllCategory.map((complaint) => (
                                            <tr key={complaint.complaintId} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="py-4 px-4">
                                                    <span className="font-semibold text-slate-700 block truncate max-w-xs">{complaint.title}</span>
                                                    <span className="text-[10px] text-slate-400">ID: {complaint.complaintId}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${complaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{complaint.status}</span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-500 tabular-nums">{complaint.date}</td>
                                                <td className="py-4 px-4 text-right">
                                                    <button onClick={() => setSelectedComplaint(complaint)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity">VIEW_DETAILS</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: VIEW ALL EMPLOYEES */}
            {viewAllEmployees && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-52 flex justify-center items-center p-4">
                    <div className="absolute inset-0" onClick={() => setViewAllEmployees(null)} />
                    <div className="relative w-full max-w-3xl bg-white h-150 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl animate-in fade-in zoom-in-95 duration-300 flex flex-col border border-slate-200 overflow-hidden">
                        <div className="bg-slate-900 p-6 text-white shrink-0">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <Users size={18} className="text-blue-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Personnel_Database</span>
                                </div>
                                <button onClick={() => setViewAllEmployees(null)} className="hover:rotate-90 transition-transform p-1"><X size={20} /></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
                            <table className="w-full border-separate border-spacing-0">
                                <thead className="sticky top-0 bg-slate-50 z-10">
                                    <tr className="text-left">
                                        <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Employee</th>
                                        <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Department</th>
                                        <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {viewAllEmployees.map((item) => (
                                        <tr onClick={() => assignEmp(item)} key={item.employeeId} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">{item.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
                                                    <div className="flex flex-col"><span className="text-sm font-bold text-slate-800">{item.fullName}</span><span className="text-[10px] font-mono text-slate-400">{item.employeeId}</span></div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6"><span className="text-xs text-slate-600 font-medium">{item.role}</span></td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /><span className="text-[11px] text-slate-500 uppercase font-bold tracking-tight">Active</span></div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueueBoard;