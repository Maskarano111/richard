# 🚀 Production Deployment Guide

## Quick Deployment (5 minutes)

### 1. **Prepare Your Code**
```bash
# Ensure clean state
npm run clean

# Install fresh dependencies
npm ci

# Run type checking
npm run lint

# Build locally to verify
npm run build
```

### 2. **Create GitHub Repository** (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: 3D portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 3. **Deploy to Netlify**

**Option A: Via Netlify UI (Easiest)**
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and authorize
4. Choose your repository
5. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
6. Click "Deploy site"

**Option B: Via Netlify CLI**
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Connect to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### 4. **Configure Environment Variables**

In Netlify Dashboard:
1. Go to **Site settings** → **Build & Deploy** → **Environment**
2. Add environment variables:

| Key | Value | Where to Get |
|-----|-------|--------------|
| `VITE_GEMINI_API_KEY` | Your API key | [ai.google.dev](https://ai.google.dev) |
| `WEB3FORMS_ACCESS_KEY` | Your access key | [web3forms.com](https://web3forms.com) |
| `APP_URL` | Your deployed URL | e.g., `https://yoursite.netlify.app` |

3. After adding variables, trigger a new deploy

### 5. **Set Up Custom Domain** (Optional)

1. In Netlify, go to **Domain settings**
2. Click **Add custom domain**
3. Enter your domain (e.g., `portfolio.dev`)
4. Follow DNS configuration steps:
   - If using Netlify DNS: Update your domain registrar to use Netlify nameservers
   - If keeping existing DNS: Add the provided CNAME records
5. Wait 24-48 hours for DNS propagation
6. Netlify automatically provisions HTTPS via Let's Encrypt

---

## Detailed Setup Steps

### Get Gemini API Key
1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key"
3. Create new project or select existing
4. Copy your API key
5. **Never commit this to git** - only store in Netlify environment variables

### Get Web3Forms Access Key
1. Go to [web3forms.com](https://web3forms.com)
2. Sign up / Log in
3. Create new form
4. Copy your access key
5. Store securely in Netlify environment variables

---

## Verify Deployment

### ✅ Health Checks
After deployment, verify:

**1. Site is Live**
```bash
curl https://yourdomain.com
# Should return HTML (not error)
```

**2. Contact Form Works**
Open browser DevTools → Network tab, then:
1. Fill contact form
2. Check request to `/.netlify/functions/contact`
3. Should get 200 response with `{"success": true}`

**3. 3D Scene Renders**
1. Open site in browser
2. Check Console tab for errors
3. Should see 3D background animation
4. No WebGL errors

**4. Environment Variables Loaded**
Check browser console:
```javascript
console.log(import.meta.env.VITE_GEMINI_API_KEY)
// Should NOT be undefined
```

---

## Monitoring & Maintenance

### Netlify Dashboard
- **Analytics**: Site settings → Analytics (enable for insights)
- **Functions**: Functions tab → contact → Logs (debug issues)
- **Builds**: Deploys tab (view build history)
- **Performance**: Monitor site performance over time

### Error Tracking
Check logs for:
1. **Build failures**: Netlify Dashboard → Builds
2. **Function errors**: Netlify Dashboard → Functions → Logs
3. **Client errors**: Browser console when testing

### Auto-Deploy
Your site auto-deploys when you push to `main` branch:
```bash
git push origin main
# Netlify automatically rebuilds and deploys
```

---

## Performance Optimization

### Already Configured ✅
- **Code splitting**: Three.js, R3F, and motion in separate chunks
- **Asset caching**: Versioned files cached for 1 year
- **HTML cache busting**: HTML never cached
- **Security headers**: HTTPS, CSP, XSS protection
- **CDN delivery**: Netlify global CDN

### Monitor Performance
1. Run Lighthouse: DevTools → Lighthouse
2. Check bundle size:
   ```bash
   npm run build
   # Check dist/ folder size
   ```
3. Test on slow connection: DevTools → Network → Slow 3G

---

## Troubleshooting

### Site Won't Build
```bash
# Verify locally first
npm ci
npm run lint
npm run build
npm run preview
```
Check Netlify build logs for specific errors.

### 3D Scene Not Loading
- Check browser console for WebGL errors
- Verify `VITE_GEMINI_API_KEY` is set (for AI features)
- Ensure no CSP violations in console

### Contact Form Returns 500 Error
1. Check function logs in Netlify
2. Verify `WEB3FORMS_ACCESS_KEY` is set
3. Check web3forms.com dashboard for API issues

### Custom Domain Not Resolving
- Wait 24-48 hours for DNS propagation
- Verify nameserver changes in domain registrar
- Test with: `nslookup yourdomain.com`

### CORS Errors
The contact function now restricts CORS to:
- `localhost:3000` (dev)
- `localhost:3001` (server)
- Your `APP_URL` (production)

Make sure `APP_URL` is set in Netlify env vars.

---

## Security Checklist

✅ **Already Implemented:**
- HTTPS enforcement
- Security headers (CSP, X-Frame-Options, etc.)
- Input sanitization (contact form)
- Rate limiting (5 req/min per IP)
- CORS restrictions
- Environment variables secure storage
- TypeScript for type safety

❌ **Optional Enhancements:**
- Add Sentry for error tracking
- Set up monitoring/alerts
- Add robots.txt and sitemap
- Configure analytics
- Add security.txt for responsible disclosure

---

## Deployment Checklist

Before going live:

- [ ] All environment variables set in Netlify
- [ ] Local build passes: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Contact form tested locally
- [ ] 3D scene renders correctly
- [ ] No console errors
- [ ] Responsive design tested on mobile
- [ ] Images/assets load correctly
- [ ] metadata.json updated with your info
- [ ] robots.txt configured
- [ ] sitemap.xml present
- [ ] Custom domain DNS configured
- [ ] Auto-deploy from GitHub verified
- [ ] Netlify build notifications enabled
- [ ] Production URL accessible and fast

---

## Post-Deployment

### Next Steps
1. Test everything on live site
2. Monitor Netlify dashboard for errors
3. Set up custom analytics (optional)
4. Share your portfolio!
5. Monitor performance metrics

### Keep Updated
```bash
# Check for dependency updates
npm outdated

# Update as needed
npm update
```

### Backup & Version Control
- Keep git history clean and meaningful
- Tag releases: `git tag v1.0.0`
- Maintain clear commit messages

---

## Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **Three.js Docs**: https://threejs.org/docs
- **Web3Forms**: https://web3forms.com/docs

---

## Emergency Rollback

If deployment goes wrong:
1. Netlify Dashboard → Deploys
2. Select previous working deploy
3. Click "Restore deploy"

Your site will revert instantly to that version!
