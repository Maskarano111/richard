# 🚀 Netlify Deployment Guide

## Quick Start

Your portfolio is ready to deploy to Netlify! Follow these steps:

### Step 1: Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub**
4. Choose your repository: `Maskarano111/richard`
5. Click **Deploy site**

Netlify will automatically detect your configuration from `netlify.toml`

### Step 2: Configure Environment Variables
After deployment starts, go to:
**Site settings** → **Build & Deploy** → **Environment**

Add these environment variables:
```
WEB3FORMS_ACCESS_KEY = your_web3forms_api_key
VITE_GEMINI_API_KEY = your_gemini_api_key
```

**How to get these:**
- **Web3Forms**: Sign up at https://web3forms.com and get your access key
- **Gemini API**: Get your API key from https://aistudio.google.com

### Step 3: Connect Custom Domain (Optional)
Once deployed:
1. Go to **Domain settings**
2. Click **Add custom domain**
3. Enter your domain (e.g., `richardmasika.dev`)
4. Update your domain's DNS records with Netlify's nameservers

### Step 4: Monitor Deployment

Your site will be live at: `https://your-site-name.netlify.app`

You can monitor builds and deployments in the Netlify dashboard.

---

## What's Included

✅ **Frontend**: React + Vite (optimized build)
✅ **Backend**: Netlify Functions (serverless)
✅ **Contact Form**: Runs on `/.netlify/functions/contact`
✅ **Email**: Integrated with Web3Forms
✅ **Security**: Input sanitization, rate limiting
✅ **Performance**: Automatic CDN caching
✅ **Redirects**: All routes handled by React Router

---

## Build Settings (Auto-configured)

```
Build command: npm run build
Publish directory: dist
Functions directory: netlify/functions
```

These are already set in `netlify.toml`

---

## Environment Variables Reference

| Variable | Purpose | Where to get |
|----------|---------|--------------|
| `WEB3FORMS_ACCESS_KEY` | Contact form email delivery | https://web3forms.com |
| `VITE_GEMINI_API_KEY` | AI chat responses | https://aistudio.google.com |

---

## Troubleshooting

### Build fails with "npm run build" error
- Make sure `package.json` has the build script
- Check that all dependencies are listed
- Try `npm ci` instead of `npm install`

### Contact form not working
- Verify `WEB3FORMS_ACCESS_KEY` is set in environment variables
- Check function logs: **Functions** → **contact** → **Logs**
- The endpoint is `/.netlify/functions/contact`

### Custom domain not resolving
- Wait 24-48 hours for DNS propagation
- Verify nameserver records are correct
- Check DNS settings at your domain registrar

### 3D background not rendering
- Make sure Three.js loads properly
- Check browser console for WebGL errors
- Verify no CSP (Content Security Policy) violations

---

## Performance Tips

✅ Images are optimized by Netlify's CDN
✅ 3D assets use efficient WebGL rendering
✅ React code is minified by Vite
✅ CSS is purged and optimized by Tailwind
✅ Fonts are preloaded in index.html

---

## Monitoring

After deployment, monitor:
1. **Build logs**: Check for warnings/errors
2. **Function logs**: Monitor API requests
3. **Analytics**: Track page views and errors
4. **Lighthouse**: Run performance audits

---

## Local Testing Before Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Test locally with Netlify
netlify dev

# This runs at http://localhost:3000
```

---

## Next Steps

1. ✅ Push code to GitHub (already done!)
2. ⏳ Connect to Netlify (deploy now)
3. 🔧 Set environment variables
4. 🌍 Add custom domain
5. 📊 Monitor and optimize

**Deployment time**: ~2-5 minutes

Your site will be live instantly! 🎉

---

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Web3Forms Docs**: https://web3forms.com/documentation
- **Vite Docs**: https://vitejs.dev

Need help? Check your Netlify dashboard or contact Netlify support.
