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
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://accounts.google.com",
                "https://apis.google.com",
                "https://www.gstatic.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://accounts.google.com",
                "https://fonts.googleapis.com"
            ],
            connectSrc: [
                "'self'",
                "https://accounts.google.com",
                "https://www.googleapis.com",
                "https://sheets.googleapis.com",
                "https://oauth2.googleapis.com",
                "https://content-sheets.googleapis.com",
                "https://content.googleapis.com"
            ],
            frameSrc: [
                "https://accounts.google.com",
                "https://content-sheets.googleapis.com"
            ],
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
        if (filePath.endsWith('sw.js')) {
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Service-Worker-Allowed', '/');
        }
    }
}));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// ── Token Relay for WebView sign-in ──────────────────────────────────────
// In-memory store: { CODE -> { token, expiresIn, ts } }
// Tokens are deleted after first read or after 5 minutes.
const tokenRelay = new Map();

setInterval(() => {
    const cutoff = Date.now() - 5 * 60 * 1000;
    for (const [k, v] of tokenRelay) {
        if (v.ts < cutoff) tokenRelay.delete(k);
    }
}, 60 * 1000);

app.use(express.json());

// Chrome calls this after sign-in to deposit the token
app.post('/api/token-relay', (req, res) => {
    const { code, token, expiresIn } = req.body || {};
    if (!code || !token || typeof code !== 'string' || code.length > 20) {
        return res.status(400).json({ error: 'Invalid' });
    }
    tokenRelay.set(code.toUpperCase(), { token, expiresIn: expiresIn || 3600, ts: Date.now() });
    res.json({ ok: true });
});

// WebView polls this every second waiting for its token
app.get('/api/token-relay', (req, res) => {
    const code = (req.query.code || '').toUpperCase();
    if (!code) return res.status(400).json({ error: 'No code' });
    const entry = tokenRelay.get(code);
    if (!entry) return res.status(404).json({ waiting: true });
    tokenRelay.delete(code); // one-time read
    res.json({ token: entry.token, expiresIn: entry.expiresIn });
});
// ─────────────────────────────────────────────────────────────────────────

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║   💰 Expense Tracker Running               ║
    ║   🌐 http://localhost:${PORT}                 ║
    ║                                            ║
    ║   📌 Setup Steps:                          ║
    ║   1. Go to console.cloud.google.com        ║
    ║   2. Enable Sheets API & Drive API         ║
    ║   3. Create OAuth 2.0 Client ID            ║
    ║   4. Add http://localhost:${PORT} as origin   ║
    ║   5. Paste Client ID in index.html         ║
    ╚════════════════════════════════════════════╝
    `);
});
