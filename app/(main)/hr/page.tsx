'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_AUTHENTICATED_HR_ROUTE } from '@/lib/constants/routes';

export default function HRPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to default HR dashboard
    router.replace(DEFAULT_AUTHENTICATED_HR_ROUTE);
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}