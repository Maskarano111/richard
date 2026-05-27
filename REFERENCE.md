# HOSTING REFERENCE CARD

## TL;DR - 3 Steps to Ship

```bash
# 1. Verify locally
npm ci && npm run lint && npm run build

# 2. Push to GitHub
git push origin main

# 3. Deploy (Netlify auto-detects from netlify.toml)
# → Site live in 1-2 minutes
```

---

## Environment Variables (Required in Netlify)

```
VITE_GEMINI_API_KEY=<from ai.google.dev>
WEB3FORMS_ACCESS_KEY=<from web3forms.com>
APP_URL=https://yourdomain.com
NODE_ENV=production
```

---

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm ci` | Install dependencies (CI mode) |
| `npm run lint` | TypeScript type check |
| `npm run build` | Production build (creates `dist/`) |
| `npm run preview` | Preview build locally |
| `npm run clean` | Remove build artifacts |
| `npm run dev` | Local development server |

---

## Network Requests

| URL | Purpose | Dev | Prod |
|-----|---------|-----|------|
| Contact API | Form submission | `/api/contact` | `/.netlify/functions/contact` |
| Gemini API | AI chat | `https://generativelanguage.googleapis.com` | (same) |
| Web3Forms | Email | `https://api.web3forms.com/submit` | (same) |

---

## File Sizes (Post-Build)

```
dist/
├── index.html           ~5KB
├── assets/
│   ├── index-xxx.js     ~180KB (main bundle)
│   ├── three-xxx.js     ~250KB (Three.js)
│   ├── r3f-xxx.js       ~80KB  (R3F + Drei)
│   ├── genai-xxx.js     ~40KB  (Google AI)
│   ├── motion-xxx.js    ~30KB  (Motion)
│   ├── index-xxx.css    ~15KB  (Tailwind)
│   └── ...
└── robots.txt, sitemap.xml
```
**Total Gzipped: ~150-200KB**

---

## Cache Strategy

| Asset | Cache-Control |
|-------|----------------|
| `index.html` | `no-cache, must-revalidate` |
| `*.js`, `*.css`, `*.wasm` | `public, max-age=31536000, immutable` |
| `/assets/*` | `public, max-age=31536000, immutable` |
| `/fonts/*` | `public, max-age=31536000, immutable` |
| `robots.txt`, `sitemap.xml` | `public, max-age=86400` |

---

## Security Headers (Netlify)

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: [restricted to necessary APIs]
```

---

## Error Codes (Contact Function)

| Code | Meaning | Fix |
|------|---------|-----|
| 200 | Success | ✓ |
| 400 | Invalid input | Check form validation |
| 429 | Rate limited | Wait 1 min (5 req/min limit) |
| 500 | Server error | Check WEB3FORMS_ACCESS_KEY |

---

## Netlify CLI (Quick)

```bash
# Install
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# View logs
netlify functions:invoke contact

# Monitor
netlify watch
```

---

## Debugging Checklist

- [ ] `VITE_GEMINI_API_KEY` set in Netlify env
- [ ] `WEB3FORMS_ACCESS_KEY` set in Netlify env
- [ ] `APP_URL` matches deployed domain
- [ ] `NODE_ENV=production` in Netlify env
- [ ] Check Netlify Functions logs
- [ ] Browser console for errors
- [ ] DevTools Network tab for 500s
- [ ] Test contact form end-to-end

---

## Performance Benchmarks

```
Lighthouse (Desktop):
- Performance: 85-90
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

Metrics:
- FCP (First Contentful Paint): 1.2s
- LCP (Largest Contentful Paint): 2.5s
- CLS (Cumulative Layout Shift): 0.05
- TTFB (Time to First Byte): 100-200ms
```

---

## Domain Setup (DNS)

```
Option 1: Netlify DNS (easiest)
→ Use Netlify nameservers at registrar

Option 2: CNAME (keep existing DNS)
→ yourdomain.com CNAME your-site.netlify.app

SSL/TLS: Automatic (Let's Encrypt)
HTTPS: Enforced automatically
```

---

## Monitoring Dashboard

**Netlify → Site settings → Notifications**
- Enable build notifications
- Enable function errors
- Set failure email

**Optional integrations:**
- Sentry (error tracking)
- Google Analytics (traffic)
- Datadog (monitoring)

---

## Rollback (Emergency)

```
Netlify Dashboard → Deploys → [Select old version]
→ Click "Restore deploy"
→ Site reverts in seconds
```

---

## Useful Links

| Resource | Link |
|----------|------|
| Netlify Docs | docs.netlify.com |
| React 19 | react.dev |
| Vite Docs | vitejs.dev |
| Three.js | threejs.org |
| Tailwind v4 | tailwindcss.com |
| Web3Forms | web3forms.com |

---

## Version Info

```
Node: v20+
React: 19.0.1
Three.js: 0.184.0
Vite: 6.2.3
Tailwind: 4.1.14
TypeScript: 5.8.2
```

---

## Questions?

1. Check `PRODUCTION_HOSTING_GUIDE.md` (comprehensive)
2. Check `DEPLOYMENT.md` (step-by-step)
3. Check `HOSTING_CHECKLIST.md` (verification)
4. Run `./verify-production.sh` (automated checks)
