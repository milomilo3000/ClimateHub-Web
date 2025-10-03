# Render SPA 404 Troubleshooting Guide

## Current Status
- ✅ Build working correctly
- ✅ `_redirects` file present in build output
- ✅ `static.json` configured correctly
- ❌ Still getting 404 errors on direct route access

## Critical Render Service Settings

### 1. Service Type
**MUST BE**: Static Site (not Web Service)

### 2. Build Settings
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/build`
- **Auto-Deploy**: Yes

### 3. Environment Variables
- Set `NODE_ENV=production` if needed

## Step-by-Step Debugging

### Step 1: Verify Render Service Configuration
1. Go to Render Dashboard
2. Click on your service
3. Go to Settings
4. Verify:
   - Service Type: Static Site
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

### Step 2: Check Build Logs
1. Go to your service dashboard
2. Click on latest deployment
3. Check build logs for errors
4. Verify `_redirects` file is copied to build output

### Step 3: Manual Deploy
1. In Render dashboard, click "Manual Deploy"
2. Select "Deploy latest commit"
3. Wait for deployment to complete

### Step 4: Test After Deploy
Test these URLs directly in browser:
- `https://your-domain.com/` (should work)
- `https://your-domain.com/carbon-tracker` (should work, not 404)
- `https://your-domain.com/about` (should work, not 404)

### Step 5: Check Response Headers
Use browser dev tools or curl:
```bash
curl -I https://your-domain.com/carbon-tracker
```

Expected: `200 OK` with `text/html` content-type
Actual problem: Probably `404 Not Found`

## Common Issues & Solutions

### Issue 1: Wrong Service Type
**Problem**: Service is "Web Service" instead of "Static Site"
**Solution**: 
1. Delete current service
2. Create new "Static Site" service
3. Connect to same repository

### Issue 2: Wrong Publish Directory
**Problem**: Render serving from wrong directory
**Solution**: Set publish directory to `frontend/build`

### Issue 3: Build Command Issues
**Problem**: Build fails or doesn't include _redirects
**Solution**: Use exact command: `cd frontend && npm install && npm run build`

### Issue 4: _redirects Not Working
**Problem**: Render not recognizing _redirects file
**Solution**: 
1. Verify file exists in build output
2. Check file content: `/*    /index.html   200`
3. No extra spaces or characters

### Issue 5: Cache Issues
**Problem**: Old deployment cached
**Solution**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Try incognito/private browsing
3. Clear Render cache (manual deploy)

## Files That Should Be in Build Output
```
build/
├── _redirects          ← Critical for SPA routing
├── _headers           ← Optional security headers
├── index.html         ← Main app file
├── static/            ← JS/CSS assets
├── images/            ← Image assets
└── other files...
```

## Verification Commands

### Local Testing
```bash
cd frontend
npm run build
npm run serve
# Test: http://localhost:3000/carbon-tracker
```

### Check _redirects Content
```bash
cat frontend/build/_redirects
# Should show: /*    /index.html   200
```

### Check Build Output
```bash
ls -la frontend/build/
# Verify _redirects file exists
```

## If Still Not Working

### Option 1: Recreate Service
1. Delete current Render service
2. Create new "Static Site" service
3. Use these exact settings:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

### Option 2: Alternative _redirects Format
Try this in `frontend/public/_redirects`:
```
/*    /index.html   200!
```
(Note the `!` at the end for force redirect)

### Option 3: Add netlify.toml (Render supports this)
Create `netlify.toml` in root:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Contact Information
If none of these work, the issue might be:
1. Render service configuration bug
2. Domain/DNS issues
3. Render platform issue

Provide Render support with:
- Service URL
- Build logs
- This troubleshooting checklist
