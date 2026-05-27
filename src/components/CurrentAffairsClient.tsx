'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface CurrentAffairsClientProps {
  refreshInterval: number; // in milliseconds
}

export default function CurrentAffairsClient({ refreshInterval }: CurrentAffairsClientProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nextRefreshIn, setNextRefreshIn] = useState<string>('');

  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;
    let countdownTimer: NodeJS.Timeout;

    const startRefreshCountdown = () => {
      let remainingTime = refreshInterval;

      const updateCountdown = () => {
        const hours = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        setNextRefreshIn(`${hours}h ${minutes}m`);
        remainingTime -= 1000;
      };

      updateCountdown();
      countdownTimer = setInterval(updateCountdown, 1000);

      // Schedule automatic refresh
      refreshTimer = setTimeout(async () => {
        setIsRefreshing(true);
        try {
          // Fetch latest news from refresh endpoint
          const response = await fetch('/api/current-affairs/refresh', { 
            cache: 'no-store',
            revalidate: 0 
          });
          if (response.ok) {
            // Reload the page to display updated content
            window.location.reload();
          }
        } catch (error) {
          console.error('Failed to refresh current affairs:', error);
        } finally {
          setIsRefreshing(false);
        }
      }, refreshInterval);
    };

    startRefreshCountdown();

    return () => {
      clearTimeout(refreshTimer);
      clearInterval(countdownTimer);
    };
  }, [refreshInterval]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/current-affairs/refresh', { 
        cache: 'no-store',
        revalidate: 0
      });
      if (response.ok) {
        // Reload the page to display updated content
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to refresh current affairs:', error);
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-right text-sm">
        <div className="font-medium text-gray-700">Auto-refresh</div>
        <div className="text-xs text-gray-500">{nextRefreshIn || 'Loading...'}</div>
      </div>
      <button
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh now or wait for automatic refresh every 2 hours"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span className="text-sm font-medium">{isRefreshing ? 'Updating...' : 'Refresh'}</span>
      </button>
    </div>
  );
}
