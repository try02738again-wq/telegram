require('dotenv').config();

const { Bot } = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);

bot.command('start', (ctx) => {
    ctx.reply(
        '👋 Welcome to Downloader Bot!\n\n' +
        'Send me a link to download a video or audio.'
    );
});

bot.command('help', (ctx) => {
    ctx.reply(
        'ℹ️ Send me a supported video or audio URL.'
    );
});

bot.on('message', (ctx) => {
    console.log(`Message from ${ctx.from?.username || ctx.from?.first_name}: ${ctx.message?.text || '[non-text message]'}`);
});

bot.startPolling();

console.log('Downloader bot is running...');
