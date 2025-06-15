require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN; // Set this in your .env file
const API_BASE_URL = 'https://thedoormanapp.vercel.app/api/room-status?url=';

const ROOM_URLS = {
  TwackCity: 'http://lets-get-lit.com/',
  BeatSync: 'https://beat-sync.cloud',
  Official310: 'https://official310.live',
  VIP: 'https://pnpatvip.com',
};

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Select a room to check:', {
    reply_markup: {
      inline_keyboard: [
        Object.entries(ROOM_URLS).map(([name]) => ({
          text: name,
          callback_data: `room_${name}`
        }))
      ]
    }
  });
});

// Handle button presses
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  if (data.startsWith('room_')) {
    const roomName = data.replace('room_', '');
    const url = ROOM_URLS[roomName];
    bot.answerCallbackQuery(query.id, { text: `Checking ${roomName}...` });

    try {
      const res = await axios.get(API_BASE_URL + encodeURIComponent(url));
      const info = res.data;
      if (info.available && info.joinUrl) {
        bot.sendMessage(chatId, `🟢 ${roomName} is ONLINE!\n[Join Now](${info.joinUrl})`, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Join Room', url: info.joinUrl }],
              [{ text: 'Refresh', callback_data: `room_${roomName}` }]
            ]
          }
        });
      } else {
        bot.sendMessage(chatId, `🔴 ${roomName} is OFFLINE.\n${info.reason || ""}`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Refresh', callback_data: `room_${roomName}` }]
            ]
          }
        });
      }
    } catch (e) {
      bot.sendMessage(chatId, `Error checking status for ${roomName}.`);
    }
  }
});