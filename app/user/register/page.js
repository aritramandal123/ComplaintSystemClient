'use client';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../../../components/loadingScreen';

const Login = () => {
    // State management for form inputs and UI feedback
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', isError: false });
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isloginLoading, setIsloginLoading] = useState(false);
    const router = useRouter();

    const URL = process.env.NEXT_PUBLIC_API_URL;

    /**
     * Handles the admin login process
     * @param {Event} e - Form submission event
     */
    const handleSignUp = async (e) => {
        e.preventDefault();
        setMessage({ text: '', isError: false });

        try {
            setIsloginLoading(true);
            const response = await fetch(`${URL}/register/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, phoneNumber, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Set authentication cookies upon successful login
                setIsloginLoading(false);
                setMessage({ text: `Success! User ID: ${data.userId}`, isError: false });
                Cookies.set('token', data.token, { path: '/' });
                Cookies.set('isLoggedIn', 'true', { path: '/' });
                Cookies.set('userType', 'user', { path: '/' });
                Cookies.set('userId', data.userId, { path: '/' });

                // Redirect to admin dashboard
                router.push('/user/home');
            } else {
                setIsloginLoading(false);
                setMessage({ text: data.message || 'Invalid credentials', isError: true });
            }
        } catch (error) {
            setIsloginLoading(false);
            setMessage({ text: 'Server connection failed', isError: true });
        }
    };

    // Check if user is already logged in or is a standard user to prevent unauthorized access
    React.useEffect(() => {
        const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
        const userType = Cookies.get('userType');

        if (isLoggedIn || userType === 'user') {
            router.push('/');
        } else {
            setIsCheckingAuth(false);
        }
    }, [router]);

    // Show loading screen while checking authentication status
    if (isCheckingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <LoadingScreen />
            </div>
        );
    }

    // Render the User Register UI
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Sign Up as new User</h2>
                    <p className="text-gray-500 mt-2">Please enter your details</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSignUp} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-4 py-3 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="Enter Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            className="mt-1 block w-full px-4 py-3 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-4 py-3 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="Enter Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-4 py-3 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-0.5"
                    >
                        {isloginLoading ? (<span className="flex items-center justify-center gap-2">
                            <span className="inline-flex items-center">
                                Signing Up
                                <span className="flex ml-1">
                                    <span className="animate-[bounce_1s_infinite_100ms] text-current">.</span>
                                    <span className="animate-[bounce_1s_infinite_200ms] text-current">.</span>
                                    <span className="animate-[bounce_1s_infinite_300ms] text-current">.</span>
                                </span>
                            </span>
                        </span>) : 'Sign Up'}
                    </button>
                </form>

                {/* Feedback Message */}
                {message.text && (
                    <div className={`mt-6 p-3 rounded-lg text-center text-sm ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message.text}
                    </div>
                )}

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    Not an Admin? <a href="/user/login" className="text-blue-600 hover:underline font-medium">Login as User</a>
                </div>
            </div>
        </div>
    );
};

export default Login;