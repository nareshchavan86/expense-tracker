const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'",
                "https://accounts.google.com",
                "https://apis.google.com",
                "https://www.gstatic.com"],
            styleSrc: ["'self'", "'unsafe-inline'",
                "https://accounts.google.com"],
            connectSrc: ["'self'",
                "https://accounts.google.com",
                "https://www.googleapis.com",
                "https://sheets.googleapis.com",
                "https://oauth2.googleapis.com",
                "https://content-sheets.googleapis.com"],
            frameSrc: ["https://accounts.google.com",
                "https://content-sheets.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            fontSrc: ["'self'", "https:", "data:"],
        },
    },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginEmbedderPolicy: false,
}));

// Serve static files
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
        if (filePath.endsWith('.png') || filePath.endsWith('.ico')) {
            res.setHeader('Cache-Control', 'public, max-age=604800');
        }
    }
}));

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║   💰 Expense Tracker Running              ║
    ║   🌐 http://localhost:${PORT}                ║
    ║                                            ║
    ║   📌 Setup Steps:                          ║
    ║   1. Go to console.cloud.google.com        ║
    ║   2. Enable Sheets API & Drive API         ║
    ║   3. Create OAuth 2.0 Client ID            ║
    ║   4. Add http://localhost:${PORT} as origin  ║
    ║   5. Paste Client ID in index.html         ║
    ╚════════════════════════════════════════════╝
    `);
});
