'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, Hash, ChevronRight } from 'lucide-react';

const Landing = () => {
    const router = useRouter();

    const handleSelection = (role) => {
        if (role === 'client') {
            router.push('/user/login');
        } else if (role === 'admin') {
            router.push('/admin/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
            {/* Branding */}
            <div className="mb-12 flex flex-col items-center gap-4">
                <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl shadow-indigo-100">
                    <Hash size={32} strokeWidth={2.5} />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-black uppercase tracking-[0.3em] text-slate-900 italic">
                        Nexus CMS
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        Complaint Management System v2.0
                    </p>
                </div>
            </div>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">

                {/* Client Option */}
                <button
                    onClick={() => handleSelection('client')}
                    className="group relative bg-white border border-slate-200 p-8 rounded-sm shadow-sm hover:border-indigo-600 transition-all duration-300 text-left overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-slate-200 rounded-sm text-gray-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <User size={24} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-2">
                            Client Portal
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                            Submit tickets, track activity logs, and manage your account manifests.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-indigo-600">
                            Continue as Client <ChevronRight size={14} />
                        </div>
                    </div>
                    {/* Decorative background number */}
                    <span className="absolute -bottom-4 -right-2 text-8xl font-black text-slate-200 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">01</span>
                </button>

                {/* Admin Option */}
                <button
                    onClick={() => handleSelection('admin')}
                    className="group relative bg-white border border-slate-200 p-8 rounded-sm shadow-sm hover:border-indigo-600 transition-all duration-300 text-left overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-slate-200  text-gray-600 rounded-sm flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <ShieldCheck size={24} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-2">
                            Administrator
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                            Access system analytics, manage user permissions, and resolve global tickets.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-indigo-600">
                            Enter Terminal <ChevronRight size={14} />
                        </div>
                    </div>
                    {/* Decorative background number */}
                    <span className="absolute -bottom-4 -right-2 text-8xl font-black text-slate-50 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">02</span>
                </button>

            </div>
        </div>
    );
};

export default Landing;