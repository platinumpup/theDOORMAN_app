const fs = require('fs');
const path = require('path');

const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

function getSubscribers() {
  try {
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function addSubscriber(id) {
  const subs = getSubscribers();
  if (!subs.includes(id)) {
    subs.push(id);
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2));
  }
}

function removeSubscriber(id) {
  const subs = getSubscribers();
  const filtered = subs.filter(uid => uid !== id);
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(filtered, null, 2));
}

module.exports = { getSubscribers, addSubscriber, removeSubscriber };