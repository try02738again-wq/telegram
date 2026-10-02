require('dotenv').config();

const { Bot } = require('node-telegram-bot-api');
const { exec } = require('child_process');

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

function downloadYouTube(url, onComplete) {
    const command =
        `yt-dlp --js-runtimes node ` +
        `-f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" ` +
        `--print after_move:filepath ` +
        `-o "downloads/%(title)s.%(ext)s" "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Download failed:', error.message);
            return;
        }

        const lines = stdout.trim().split('\n');
        const filePath = lines[lines.length - 1];

        console.log('Download completed!');
        console.log(`File: ${filePath}`);

        onComplete(filePath);
    });
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
            '⬇️ Download started...'
        );

        downloadYouTube(url, (filePath) => {
            console.log('Ready to send:', filePath);
        });
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
