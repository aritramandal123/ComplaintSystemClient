'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import LoadingScreen from '../components/loadingScreen';
import Landing from './landing/page'; // Corrected typo from 'langing'

export default function Home() {
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
    const userType = Cookies.get('userType');

    if (isLoggedIn) {
      if (userType === 'user') {
        router.push('/user/home');
      } else if (userType === 'admin') {
        router.push('/admin/home');
      }
    } else {
      // If not logged in, we stop loading and show the Landing UI
      setShowLanding(true);
      setIsChecking(false);
    }
  }, [router]);

  // 1. While the app is checking cookies/redirecting, show loading
  if (isChecking && !showLanding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingScreen />
      </div>
    );
  }

  // 2. If the check is done and user isn't logged in, show Landing
  if (showLanding) {
    return <Landing />;
  }

  // 3. Fallback loading state for redirects
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <LoadingScreen />
    </div>
  );
}