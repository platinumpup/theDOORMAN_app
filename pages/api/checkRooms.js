const rooms = [
  { room: "TwackCity", url: "http://lets-get-lit.com/" },
  { room: "BeatSync", url: "https://beat-sync.cloud" },
  { room: "Official310", url: "https://official310.live" },
  { room: "VIP", url: "https://pnpatvip.com" }
];

// Dummy health check: mark all rooms as open (true) for now.
// Replace this logic with real checks (e.g., fetch or ping each room) as needed.
async function getRoomStatus(url) {
  // Example: You could use fetch(url) and check for a 200 response, etc.
  return true;
}

export default async function handler(req, res) {
  const results = await Promise.all(
    rooms.map(async (room) => ({
      ...room,
      open: await getRoomStatus(room.url)
    }))
  );
  res.status(200).json(results);
}