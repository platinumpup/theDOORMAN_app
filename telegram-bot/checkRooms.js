const fetch = require('node-fetch');

const ROOM_URLS = {
  TwackCity: 'http://lets-get-lit.com/',
  BeatSync: 'https://beat-sync.cloud',
  Official310: 'https://official310.live',
  VIP: 'https://pnpatvip.com',
};

async function checkRooms() {
  const results = {};
  for (const [name, url] of Object.entries(ROOM_URLS)) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow', timeout: 10000 });
      results[name] = {
        online: res.status === 200,
        status: res.status,
        url,
      };
    } catch (e) {
      results[name] = {
        online: false,
        status: 'error',
        url,
      };
    }
  }
  return results;
}

module.exports = { checkRooms };