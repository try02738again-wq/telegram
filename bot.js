require('dotenv').config();

const { Bot } = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);

function classifyUrl(urlText) {
    try {
        const url = new URL(urlText);
        const hostname = url.hostname.toLowerCase();

        if (
            hostname === 'youtube.com' ||
            hostname === 'www.youtube.com' ||
            hostname === 'youtu.be' ||
            hostname === 'www.youtu.be'
        ) {
            return 'YouTube';
        }

        return 'Unknown';
    } catch {
        return 'Invalid';
    }
}

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
    const text = ctx.message?.text;

    console.log(
        `Message from ${ctx.from?.username || ctx.from?.first_name}: ${text || '[non-text message]'}`
    );

    if (!text) return;

    const urlPattern = /https?:\/\/[^\s]+/i;
    const match = text.match(urlPattern);

    if (!match) return;

    const url = match[0];
    const source = classifyUrl(url);

    console.log(`URL: ${url}`);
    console.log(`Source: ${source}`);

    if (source === 'YouTube') {
        ctx.reply(
            '▶️ YouTube URL detected!\n\n' +
            'Downloader support is coming soon. 🚀'
        );
    } else if (source === 'Unknown') {
        ctx.reply(
            '⚠️ I found a URL, but I do not support this website yet.'
        );
    } else {
        ctx.reply(
            '❌ That does not appear to be a valid URL.'
        );
    }
});

bot.startPolling();

console.log('Downloader bot is running...');
