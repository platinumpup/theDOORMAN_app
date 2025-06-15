require('dotenv').config({ path: __dirname + '/.env' });
const { Telegraf } = require('telegraf');
const { checkRooms } = require('./checkRooms');
const { addSubscriber, removeSubscriber, getSubscribers } = require('./subscriberUtils');
const path = require('path');

// Slogans/blurbs for fun notifications
const slogans = [
  "Hey Stud. Looking? Here’s who’s hosting:",
  "Hard Up? These Hosts Are Too.",
  "Ding Dong. Your Late-Night Daddy Just Opened His Doors.",
  "Booty Call Incoming: Here’s Who’s Barely Dressed & Ready.",
  "Unlocked & Loaded. These Parties Are Going All Night.",
  "Looking to Slide In? Here’s Where the Lube’s Already Flowing.",
  "That Thump You Hear? It’s Not Just the Bass. Click to Join.",
  "Things Are Getting Wet & Wild—And You’re Missing It.",
  "Thirst Trap Alert: Your Favorite Host Just Dropped his Pants.",
  "Your Invite to the Naughtiest Rooms On Zoom.",
  "Feeling Submissive or Dominant? Either Way, There’s a Room for You.",
  "Your Type Just Logged On... Wanna Play or Watch?",
  "No Judgement. Just Lube, Lights, and Loaded Rooms.",
  "You’ve Got the Look. They’ve Got the Room. Time to Click.",
  "Kink Unlocked: Here’s Where the Fetish Freaks Are Freakin’.",
  "Boys, Toys & No Noise Complaints — These Hosts Play Hard.",
  "Fisting, Fog, or Full-On Fantasy? Your Scene is LIVE.",
  "Everyone’s Already There. Are You Gonna Be ‘Late’ Again?",
  "Your Tribe Just Checked In. You Coming or Just Watching?",
  "Room’s Filling Fast. Don’t Be the Last Load to Arrive.",
];

// Path to your logo.gif
const GIF_PATH = path.join(__dirname, 'gifs', 'logo.gif');

// Your Vercel app URL
const VERCEL_APP_URL = "https://thedoormanapp.vercel.app"; 

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not set in .env');

const bot = new Telegraf(TOKEN);

bot.command('status', async (ctx) => {
  await ctx.reply('Checking rooms...');
  const statuses = await checkRooms();
  let message = `<b>Room Statuses</b>\n`;
  for (const [name, info] of Object.entries(statuses)) {
    message += `\n<b>${name}</b>: ${info.online ? '🟢 Online' : '🔴 Offline'} (HTTP ${info.status})\n${info.url}\n`;
  }
  await ctx.replyWithHTML(message);
});

bot.command('subscribe', (ctx) => {
  addSubscriber(ctx.from.id);
  ctx.reply('✅ You will now get notified when rooms open!');
});

bot.command('unsubscribe', (ctx) => {
  removeSubscriber(ctx.from.id);
  ctx.reply('❌ You will no longer receive room notifications.');
});

let previousStatus = {};

async function notifyIfRoomOpened() {
  const statuses = await checkRooms();
  const openRooms = Object.entries(statuses)
    .filter(([name, info]) => info.online)
    .map(([name, info]) => ({ name, url: info.url }));

  // Compare with previousStatus
  const newlyOpened = openRooms.filter(({ name }) => !previousStatus[name]);
  previousStatus = Object.fromEntries(openRooms.map(r => [r.name, true]));

  if (newlyOpened.length > 0) {
    const slogan = slogans[Math.floor(Math.random() * slogans.length)];

    let text = `${slogan}\n\nOpen rooms:\n`;
    newlyOpened.forEach(room => {
      text += `• <b>${room.name}</b>\n`;
    });

    // Inline buttons for open rooms and Vercel app
    const buttons = [
      ...newlyOpened.map(room => [{ text: room.name, url: room.url }]),
      [{ text: "See All Rooms (Vercel App)", url: VERCEL_APP_URL }]
    ];

    const subscribers = getSubscribers();
    for (const uid of subscribers) {
      try {
        await bot.telegram.sendAnimation(uid, { source: GIF_PATH }, {
          caption: text,
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: buttons }
        });
      } catch (err) {
        console.error(`Failed to send to ${uid}:`, err.message);
      }
    }
  }
}

setInterval(() => {
  notifyIfRoomOpened();
}, 30000);

bot.launch();
console.log('Telegram bot started.');

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));