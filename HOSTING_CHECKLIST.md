# 🚀 Production Hosting Checklist

## Pre-Deployment Verification

### Environment Variables ✓
- [ ] Set `VITE_GEMINI_API_KEY` in Netlify environment variables
- [ ] Set `WEB3FORMS_ACCESS_KEY` in Netlify environment variables
- [ ] Set `APP_URL` to your production domain
- [ ] Reference `.env.example` for all required variables

### Build & Testing
- [ ] Run `npm install` to verify dependencies
- [ ] Run `npm run lint` to check TypeScript
- [ ] Run `npm run build` locally and verify `dist/` output
- [ ] Test locally with `npm run dev`
- [ ] Check browser console for any warnings/errors
- [ ] Test contact form submission
- [ ] Test 3D scene rendering

### Security Checklist
- [ ] Review environment variables are never committed to git
- [ ] Verify CORS headers are properly restricted
- [ ] Check input sanitization in contact form
- [ ] Verify rate limiting is enabled (5 requests/min per IP)
- [ ] Review security headers in `netlify.toml`
- [ ] Ensure no sensitive data in client-side code
- [ ] Use HTTPS only (enforced by Netlify)

### Performance Checklist
- [ ] Verify bundle splitting in `vite.config.ts`
- [ ] Check Three.js and React Three Fiber chunks load correctly
- [ ] Enable caching for static assets (configured in netlify.toml)
- [ ] Verify CDN caching is active
- [ ] Test on 3G/slow connection (DevTools throttling)
- [ ] Check Lighthouse scores

### SEO & Metadata
- [ ] Update `metadata.json` with your portfolio details
- [ ] Verify `robots.txt` is present and correct
- [ ] Check `sitemap.xml` is present
- [ ] Add Open Graph meta tags in `index.html`
- [ ] Verify page title and description

### Netlify Configuration
- [ ] Verify `netlify.toml` is correctly configured
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Set functions directory: `netlify/functions`
- [ ] Enable Netlify analytics (optional)
- [ ] Configure custom domain DNS records
- [ ] Set up auto-deployment from git

### Monitoring & Logging
- [ ] Check Netlify function logs for errors
- [ ] Set up email notifications for build failures
- [ ] Monitor Error Boundary component logs
- [ ] Track contact form submissions
- [ ] Set up error reporting (e.g., Sentry)

### Final Steps
- [ ] Create git repository if not already done
- [ ] Push code to GitHub
- [ ] Connect GitHub repo to Netlify
- [ ] Trigger first deployment
- [ ] Verify production site loads correctly
- [ ] Test all interactive features
- [ ] Test contact form end-to-end
- [ ] Verify 3D scene loads on mobile
- [ ] Check custom domain resolves correctly
- [ ] Enable HTTPS (automatic on Netlify)

## Deployment Commands

```bash
# Local verification
npm install
npm run lint
npm run build
npm run preview

# Clean build
npm run clean
npm run build
```

## Troubleshooting

### 3D Scene Not Loading
- Check browser console for WebGL errors
- Verify Three.js is loading from node_modules
- Check GPU/WebGL support

### Contact Form Not Working
- Verify `WEB3FORMS_ACCESS_KEY` is set
- Check Netlify function logs
- Verify API endpoint: `/.netlify/functions/contact`

### Build Failures
- Run `npm ci` instead of `npm install`
- Check Node version (v20+ recommended)
- Clear cache: `npm run clean`

### Performance Issues
- Check bundle size with Vite analyzer
- Verify chunking is working correctly
- Enable gzip compression (automatic on Netlify)

## Production URLs

- **Main Site**: `https://yourdomain.com`
- **Contact API**: `https://yourdomain.com/.netlify/functions/contact`
- **Function Logs**: Netlify Dashboard → Functions → contact → Logs
