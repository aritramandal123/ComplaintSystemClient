'use client';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../../../components/loadingScreen';

const Login = () => {
  // State management for form inputs and UI feedback
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  const URL = process.env.NEXT_PUBLIC_API_URL;

  /**
   * Handles the login form submission.
   * Sends credentials to the server and manages session cookies on success.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });
    try {
      const response = await fetch(`${URL}/login/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Persist authentication state in cookies
        setMessage({ text: `Success! User ID: ${data.userId}`, isError: false });
        Cookies.set('token', data.token, { path: '/' });
        Cookies.set('isLoggedIn', 'true', { path: '/' });
        Cookies.set('userType', 'user', { path: '/' });
        Cookies.set('userId', data.userId, { path: '/' });
        router.push('/user/home');
      } else {
        setMessage({ text: data.message || 'Invalid credentials', isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Server connection failed', isError: true });
    }
  };

  /**
   * Authentication Guard: Redirects already authenticated users
   * away from the login page.
   */
  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
    const userType = Cookies.get('userType');
    if (isLoggedIn || userType === 'admin') {
      router.push('/');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  // Display loading state while verifying authentication
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome User</h2>
          <p className="text-gray-500 mt-2">Please enter your user details</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-3 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-3 text-gray-600 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </form>

        {/* Status Messages */}
        {message.text && (
          <div className={`mt-6 p-3 rounded-lg text-center text-sm ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Not a user? <a href="/admin" className="text-blue-600 hover:underline font-medium">Login as Admin</a>
        </div>
      </div>
    </div>
  );
};

export default Login;