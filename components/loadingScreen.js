'use client';
import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-transparent backdrop-blur-sm">
            {/* Container for the spinner */}
            <div className="relative flex items-center justify-center">

                {/* The Outer Rotating Ring */}
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            </div>
        </div>
    );
};

export default LoadingScreen;