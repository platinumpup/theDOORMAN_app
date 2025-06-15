import { useEffect, useState } from 'react';

const ROOM_URLS = {
  TwackCity: 'http://lets-get-lit.com/',
  BeatSync: 'https://beat-sync.cloud',
  Official310: 'https://official310.live',
  VIP: 'https://pnpatvip.com',
};

// RELIABLE METHOD: Test if we can actually load resources from the site
const checkRoomStatus = async (url, roomName) => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 10000);

    // Method 1: Try to load favicon
    const testFavicon = () => {
      return new Promise((resolveFavicon) => {
        const img = new window.Image();
        img.onload = () => resolveFavicon(true);
        img.onerror = () => resolveFavicon(false);
        const faviconUrl = url.endsWith('/') ? url + 'favicon.ico' : url + '/favicon.ico';
        img.src = faviconUrl + '?t=' + Date.now();
      });
    };

    // Method 2: Try to load a tiny script/image from the domain
    const testDomain = () => {
      return new Promise((resolveDomain) => {
        const script = document.createElement('script');
        script.onload = () => {
          document.head.removeChild(script);
          resolveDomain(true);
        };
        script.onerror = () => {
          document.head.removeChild(script);
          resolveDomain(false);
        };
        script.src = url + 'test-connectivity.js?t=' + Date.now();
        document.head.appendChild(script);
      });
    };

    Promise.allSettled([
      testFavicon(),
      testDomain(),
    ]).then((results) => {
      clearTimeout(timeout);
      const passed = results.some(result => result.status === 'fulfilled' && result.value === true);
      resolve(passed);
    });
  });
};

export default function RoomList() {
  const [statuses, setStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [testDetails, setTestDetails] = useState({});

  const fetchStatuses = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled(
        Object.entries(ROOM_URLS).map(async ([name, url]) => {
          const isOpen = await checkRoomStatus(url, name);
          return { name, isOpen };
        })
      );

      const newStatuses = {};
      const newDetails = {};

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { name, isOpen } = result.value;
          newStatuses[name] = isOpen;
          newDetails[name] = isOpen ? 'Tests passed' : 'All tests failed';
        } else {
          const name = Object.keys(ROOM_URLS)[index];
          newStatuses[name] = false;
          newDetails[name] = 'Error during testing';
        }
      });

      setStatuses(newStatuses);
      setTestDetails(newDetails);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(fetchStatuses, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const onlineRooms = Object.entries(statuses)
    .filter(([_, isOpen]) => isOpen === true)
    .sort(([a], [b]) => a.localeCompare(b));

  const offlineRooms = Object.entries(statuses)
    .filter(([_, isOpen]) => isOpen === false)
    .sort(([a], [b]) => a.localeCompare(b));

  return (

<div className="text-center space-y-4">
      <div className="text-sm text-gray-400 mb-4">
        {isLoading ? (
          <span>🔄 Running comprehensive tests... (may take 10-15 seconds)</span>
        ) : (
          <span>Last updated: {lastUpdated || 'Never'}</span>
        )}
        <button
          onClick={fetchStatuses}
          disabled={isLoading}
          className="ml-4 text-blue-400 hover:text-blue-300 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' 
		  : '🔄️Check Again'}
        </button>
      </div>
      {onlineRooms.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-green-400 font-bold text-xl">
            <span className="superscript">{<sup>✅</sup>}</span> VERIFIED ONLINE
          </h3>
          {onlineRooms.map(([name]) => (
            <div key={name} className="bg-green-900 bg-opacity-30 p-3 rounded">
              <div className="text-lg">
                <a
                  href={ROOM_URLS[name]}
                  className="text-green-400 hover:text-green-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="superscript">{<sup>🟢</sup>}</span> JOIN <span className="font-bold underline">{name}</span> NOW!
                </a>
              </div>

            </div>
          ))}
        </div>
      )}
      {offlineRooms.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="text-red-400 font-bold text-xl">
            <span className="superscript">{<sup>❌</sup>}</span> OFFLINE:
          </h3>
          {offlineRooms.map(([name]) => (
            <div key={name} className="bg-red-900 bg-opacity-30 p-3 rounded">
              <div className="text-lg text-red-400">
                <span className="superscript">{<sup>🔴</sup>}</span> <span className="font-bold">{name}:</span> OFFLINE
              </div>

            </div>
          ))}
        </div>
      )}
      {Object.keys(statuses).length === 0 && !isLoading && (
        <div className="text-yellow-400 bg-yellow-900 bg-opacity-30 p-3 rounded">
          ⚠️ Unable to verify room statuses. Please try testing again.
        </div>
      )}
    </div>
  );
}