import { useEffect, useState } from 'react';

const ROOM_URLS = {
  TwackCity: 'http://lets-get-lit.com/',
  BeatSync: 'https://beat-sync.cloud',
  Official310LA: 'https://official310.live',
  VIP: 'https://pnpatvip.com',
};

const checkRoomStatus = async (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => resolve(false), 5000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };

    const faviconUrl = url.endsWith('/') ? url + 'favicon.ico' : url + '/favicon.ico';
    img.src = faviconUrl + '?t=' + Date.now();
  });
};

export default function RoomList() {
  const [statuses, setStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStatuses = async () => {
    setIsLoading(true);

    try {
      const results = await Promise.all(
        Object.entries(ROOM_URLS).map(async ([name, url]) => {
          const isOpen = await checkRoomStatus(url);
          return { name, isOpen };
        })
      );

      const newStatuses = {};
      results.forEach(({ name, isOpen }) => {
        newStatuses[name] = isOpen;
      });

      setStatuses(newStatuses);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      // fallback to all offline
      const fallbackStatuses = Object.keys(ROOM_URLS).reduce((acc, name) => {
        acc[name] = false;
        return acc;
      }, {});
      setStatuses(fallbackStatuses);
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
    .filter(([_, isOpen]) => isOpen)
    .sort(([a], [b]) => a.localeCompare(b));

  const offlineRooms = Object.entries(statuses)
    .filter(([_, isOpen]) => !isOpen)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="text-center space-y-4">
      <div className="text-sm text-gray-400 mb-4">
        {isLoading ? (
          <span>🔄 Checking room statuses...</span>
        ) : (
          <span>Last updated: {lastUpdated || 'Never'}</span>
        )}
        <button
          onClick={fetchStatuses}
          disabled={isLoading}
          className="ml-4 text-blue-400 hover:text-blue-300 disabled:opacity-50"
        >
          {isLoading ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {onlineRooms.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-green-400 font-bold text-xl">🟢 Online Rooms</h3>
          {onlineRooms.map(([name]) => (
            <div key={name} className="bg-green-900 bg-opacity-30 p-3 rounded">
              <a
                href={ROOM_URLS[name]}
                className="text-green-400 hover:text-green-300 text-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                ✅ Join <span className="font-bold underline">{name}</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {offlineRooms.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="text-red-400 font-bold text-xl">🔴 Offline Rooms</h3>
          {offlineRooms.map(([name]) => (
            <div key={name} className="bg-red-900 bg-opacity-30 p-3 rounded text-red-400">
              ❌ {name} is currently offline
            </div>
          ))}
        </div>
      )}

      {Object.keys(statuses).length === 0 && !isLoading && (
        <div className="text-yellow-400 bg-yellow-900 bg-opacity-30 p-3 rounded">
          ⚠️ Unable to verify room statuses. Please try again later.
        </div>
      )}
    </div>
  );
}
