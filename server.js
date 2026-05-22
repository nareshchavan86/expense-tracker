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


// ── OAuth Callback — exchanges auth code for access token, relays to APK ──
// Google redirects here: GET /auth/callback?code=AUTH_CODE&state=PAIR_CODE
app.get('/auth/callback', async (req, res) => {
    const { code, state: pairCode, error } = req.query;

    if (error) {
        return res.send(`<!DOCTYPE html><html><body style="font-family:system-ui;text-align:center;padding:40px">
            <h2 style="color:#ef4444">Sign-in cancelled</h2>
            <p>${error}</p><a href="/" style="color:#6366f1">Try again</a>
        </body></html>`);
    }
    if (!code || !pairCode) return res.status(400).send('Missing code or state');

    try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id:     process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri:  (process.env.APP_URL || 'https://expense-tracker-1-39kb.onrender.com') + '/auth/callback',
                grant_type:    'authorization_code'
            })
        });
        const tokenData = await tokenRes.json();

        if (!tokenData.access_token) {
            console.error('Token exchange failed:', tokenData);
            return res.status(500).send(`<!DOCTYPE html><html><body style="font-family:system-ui;text-align:center;padding:40px">
                <h2 style="color:#ef4444">Sign-in failed</h2>
                <p>${tokenData.error_description || 'Token exchange error'}</p>
                <a href="/" style="color:#6366f1">Try again</a>
            </body></html>`);
        }

        // Store in relay map so APK polling picks it up
        tokenRelay.set(pairCode.toUpperCase(), {
            token: tokenData.access_token,
            expiresIn: tokenData.expires_in || 3600,
            ts: Date.now()
        });

        const deepLink = 'expensetracker://auth?code=' + pairCode;
        res.send(`<!DOCTYPE html><html><head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>Signed in!</title>
            <style>
                *{margin:0;padding:0;box-sizing:border-box}
                body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                     background:#f1f5f9;display:flex;align-items:center;justify-content:center;
                     min-height:100vh;text-align:center;padding:24px}
                .card{background:#fff;border-radius:20px;padding:40px 32px;
                      box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:340px;width:100%}
                .icon{font-size:64px;margin-bottom:16px}
                h1{font-size:22px;font-weight:800;color:#1e293b;margin-bottom:10px}
                p{color:#64748b;font-size:14px;line-height:1.6;margin-bottom:28px}
                .btn{display:flex;align-items:center;justify-content:center;gap:10px;
                     padding:16px;background:#6366f1;color:#fff;border-radius:14px;
                     font-size:16px;font-weight:700;text-decoration:none;
                     box-shadow:0 4px 16px rgba(99,102,241,.4)}
                .hint{margin-top:16px;font-size:12px;color:#94a3b8}
            </style>
        </head><body>
            <div class="card">
                <div class="icon">✅</div>
                <h1>Signed in!</h1>
                <p>Going back to <strong>Expense Tracker</strong>…</p>
                <a href="${deepLink}" class="btn">📱 Open Expense Tracker</a>
                <p class="hint">Tap the button if the app doesn't open automatically</p>
            </div>
            <script>setTimeout(()=>{ window.location.href="${deepLink}"; },1200);</script>
        </body></html>`);

    } catch (err) {
        console.error('OAuth callback error:', err);
        res.status(500).send('Server error: ' + err.message);
    }
});

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
