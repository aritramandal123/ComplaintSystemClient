'use client';
import Cookies from 'js-cookie';
import React, { use } from 'react';
import { Layout, Send, Clock, CheckCircle, AlertCircle, LogOut, ChevronRight, Plus, Hash, User, RefreshCw, Activity } from 'lucide-react';
import { complaintFormSubmit } from '../../../scripts/complaintFormSubmit';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../../../components/loadingScreen';

const UserHome = () => {
    // --- STATE MANAGEMENT ---
    const [userData, setUserData] = React.useState(null);
    const [complaints, setComplaints] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [category, setCategory] = React.useState('Technical');
    const [update, setUpdate] = React.useState(0);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedComplaint, setSelectedComplaint] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [pendingComplaintsCount, setPendingComplaintsCount] = React.useState(0);
    const [resolvedComplaintsCount, setResolvedComplaintsCount] = React.useState(0);
    const [inProgressComplaintsCount, setInProgressComplaintsCount] = React.useState(0);
    const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
    const router = useRouter();

    const URL = process.env.NEXT_PUBLIC_API_URL;

    // --- UTILITY FUNCTIONS ---
    const updateComplaintCounts = (complaintsList) => {
        let pending = 0;
        let resolved = 0;
        let inProgress = 0;

        complaintsList.forEach(complaint => {
            if (complaint.status === "pending") pending++;
            if (complaint.status === "resolved") resolved++;
            if (complaint.status === "in-progress") inProgress++;
        });

        setPendingComplaintsCount(pending);
        setResolvedComplaintsCount(resolved);
        setInProgressComplaintsCount(inProgress);
    };

    // --- API INTERACTIONS ---
    const fetchuserInfo = async () => {
        const userId = Cookies.get('userId');
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${URL}/getInfo/userInfo/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}` },
                body: JSON.stringify({ id: userId }),
            });
            const result = await response.json();
            if (response.ok) setUserData(result.profile);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const getComplaints = async () => {
        const userId = Cookies.get('userId');
        try {
            const response = await fetch(`${URL}/getInfo/user/complaints`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}` },
                body: JSON.stringify({ id: userId, userType: 'user' }),
            });
            const result = await response.json();
            if (response.ok) setComplaints(result.complaints);
            updateComplaintCounts(result.complaints);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- EVENT HANDLERS ---
    const handleLogout = () => {
        Cookies.remove('userId');
        Cookies.remove('token');
        Cookies.remove('isLoggedIn');
        Cookies.remove('userType');
        router.push('/');
    };

    const openDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    // --- LIFECYCLE EFFECTS ---
    React.useEffect(() => {
        fetchuserInfo();
        getComplaints();
    }, [update]);

    React.useEffect(() => {
        const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
        const userType = Cookies.get('userType');
        if (!isLoggedIn || userType !== 'user') {
            router.push('/');
        }
        else {
            setIsCheckingAuth(false);
        }
    }, [router]);

    // --- RENDER LOGIC ---
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-indigo-600 font-mono">
                <span className="animate-pulse tracking-widest text-sm uppercase">Loading_System_Assets...</span>
            </div>
        );
    }

    const currentUser = {
        full_name: userData?.full_name || "GUEST_USER",
        email: userData?.email || "N/A"
    };

    if (isCheckingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <LoadingScreen />
            </div>
        );
    }
    else {
        return (
            <>
                {/* COMPLAINT DETAILS MODAL */}
                {isModalOpen && selectedComplaint && (
                    <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="font-bold text-slate-800 text-lg uppercase tracking-tight">Complaint Details</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <LogOut size={20} className="rotate-90" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                                    <p className="text-slate-800 font-semibold">{selectedComplaint.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                                        <p className="text-slate-600 text-sm">{selectedComplaint.category}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                                        <p className="text-sm font-bold text-indigo-600 uppercase">{selectedComplaint.status}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Full Description</label>
                                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        {selectedComplaint.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors uppercase"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
                    {/* SIDEBAR NAVIGATION */}
                    <aside className="w-64 border-r border-slate-200 bg-white hidden md:flex flex-col">
                        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                            <div className="bg-slate-900 text-white p-1 rounded-sm">
                                <Hash size={18} strokeWidth={3} />
                            </div>
                            <span className="text-sm font-black tracking-tighter text-slate-900 uppercase italic">Nexus CMS</span>
                        </div>

                        <nav className="flex-1 p-4 space-y-1">
                            <button className="w-full flex items-center gap-3 p-2.5 text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all rounded-sm">
                                <Plus size={16} /> Your Complaints
                            </button>
                        </nav>

                        <div className="p-4">
                            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-2 text-[10px] font-bold uppercase tracking-[0.2em] border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all">
                                <LogOut size={14} /> Logoff
                            </button>
                        </div>
                    </aside>

                    <main className="flex-1 flex flex-col">
                        {/* TOP HEADER BAR */}
                        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-sm border border-slate-200">
                                    <User size={14} className="text-slate-500" />
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{currentUser.full_name}</span>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{pendingComplaintsCount} Pending</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{inProgressComplaintsCount} In Progress</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{resolvedComplaintsCount} Resolved</span>
                                </div>
                            </div>
                        </header>

                        <div className="p-8 grid grid-cols-12 gap-8 max-w-7xl mx-auto w-full">
                            {/* COMPLAINT SUBMISSION FORM */}
                            <section className="col-span-12 lg:col-span-4 space-y-6">
                                <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 mb-6 flex items-center gap-2">
                                        <Send size={14} className="text-indigo-600" /> Dispatch Complaint
                                    </h2>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const newErrors = {};
                                            if (!title.trim()) newErrors.title = "Subject is required";
                                            if (!description.trim()) newErrors.description = "Description is required";

                                            if (Object.keys(newErrors).length > 0) {
                                                setErrors(newErrors);
                                                return;
                                            }

                                            setErrors({});
                                            complaintFormSubmit(title, category, description, setUpdate)(e);
                                            setTitle('');
                                            setDescription('');
                                        }}
                                        className="space-y-5"
                                    >
                                        <div>
                                            <label className={`text-[10px] font-bold uppercase mb-1.5 block transition-colors ${errors.title ? 'text-red-500' : 'text-slate-400'}`}>
                                                Subject Line {errors.title && <span className="lowercase italic opacity-70">— {errors.title}</span>}
                                            </label>
                                            <input
                                                type="text"
                                                value={title}
                                                className={`w-full bg-white border p-3 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-300 font-mono ${errors.title ? 'border-red-500 ring-1 ring-red-50' : 'border-slate-200 focus:border-indigo-600'}`}
                                                placeholder="Brief issue title"
                                                onChange={(e) => {
                                                    setTitle(e.target.value);
                                                    if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">Category Class</label>
                                            <div className="relative">
                                                <select
                                                    value={category}
                                                    className="w-full bg-white border border-slate-200 p-3 text-xs text-slate-800 focus:border-indigo-600 outline-none transition-all appearance-none font-mono cursor-pointer"
                                                    onChange={(e) => setCategory(e.target.value)}
                                                >
                                                    <option>Technical</option>
                                                    <option>Billing</option>
                                                    <option>Facility</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <ChevronRight size={14} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`text-[10px] font-bold uppercase mb-1.5 block transition-colors ${errors.description ? 'text-red-500' : 'text-slate-400'}`}>
                                                Full Manifest {errors.description && <span className="lowercase italic opacity-70">— {errors.description}</span>}
                                            </label>
                                            <textarea
                                                rows="5"
                                                value={description}
                                                className={`w-full bg-white border p-3 text-xs text-slate-800 outline-none transition-all resize-none placeholder:text-slate-300 font-mono ${errors.description
                                                    ? 'border-red-500 ring-1 ring-red-50'
                                                    : 'border-slate-200 focus:border-indigo-600'
                                                    }`}
                                                placeholder="Detailed explanation of the issue..."
                                                onChange={(e) => {
                                                    setDescription(e.target.value);
                                                    if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                                                }}
                                            />
                                        </div>

                                        <button
                                            type='submit'
                                            className="w-full bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest py-4 transition-all active:scale-[0.98] rounded-sm shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                                        >
                                            Finalize Submission
                                        </button>
                                    </form>
                                </div>
                            </section>

                            <section className="col-span-12 lg:col-span-8">
                                <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Master Activity Log</span>
                                        <button
                                            onClick={() => setUpdate(prev => (prev === 0 ? 1 : 0))}
                                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                                            title="Refresh"
                                        >
                                            <RefreshCw size={16} />
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Status</th>
                                                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Identifier</th>
                                                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 text-right">Reference</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {complaints.map(complaint => (
                                                    <tr onClick={() => openDetails(complaint)} key={complaint.complaintId} className="hover:bg-indigo-50/30 cursor-pointer transition-colors group">
                                                        <td className="p-4">
                                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm border ${complaint.status === 'resolved' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-orange-200 text-orange-600 bg-orange-50'} uppercase`}>
                                                                {complaint.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 uppercase">{complaint.title}</div>
                                                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{complaint.category}</div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button className="text-slate-300 group-hover:text-indigo-600">
                                                                <ChevronRight size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </>
        );
    };
};

export default UserHome;