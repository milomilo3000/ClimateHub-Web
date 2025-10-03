# Render SPA Routing Debug Guide

## Current Issue
Direct URLs like `climatehub.sg/carbon-tracker` and `climatehub.sg/about` return 404 errors instead of serving the React app.

## Render-Specific Configuration

### 1. render.yaml Configuration
The `render.yaml` file in the root directory contains the proper SPA routing configuration:
```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

### 2. Alternative: _redirects File
If render.yaml doesn't work, the `_redirects` file in `frontend/public/` should handle routing:
```
/*    /index.html   200
```

## Debugging Steps

### Step 1: Check Render Dashboard
1. Go to your Render dashboard
2. Check the build logs for any errors
3. Verify the build completed successfully
4. Check if the static files are being served correctly

### Step 2: Test Build Locally
```bash
cd frontend
npm run build
npm run serve
```
Then test: `http://localhost:3000/carbon-tracker`

### Step 3: Check Network Tab
1. Open browser dev tools
2. Go to Network tab
3. Visit `climatehub.sg/carbon-tracker` directly
4. Check what response you get (should be 200, not 404)

### Step 4: Verify Render Service Type
In Render dashboard, ensure your service is configured as:
- **Service Type**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/build`

### Step 5: Check Headers
The app includes a RouteDebugger component (only visible in development) that shows:
- Current pathname
- URL information
- Route state

## Common Render Issues & Solutions

### Issue 1: Wrong Publish Directory
**Problem**: Render is serving from wrong directory
**Solution**: Set publish directory to `frontend/build`

### Issue 2: Build Command Issues
**Problem**: Build fails or incomplete
**Solution**: Use: `cd frontend && npm ci && npm run build`

### Issue 3: Missing Rewrite Rules
**Problem**: Server doesn't know to serve index.html for SPA routes
**Solution**: Ensure render.yaml or _redirects file is properly configured

### Issue 4: Cache Issues
**Problem**: Old configuration cached
**Solution**: 
1. Clear Render cache
2. Trigger manual deploy
3. Hard refresh browser (Ctrl+Shift+R)

## Testing Checklist

- [ ] Home page loads: `climatehub.sg`
- [ ] Direct route access: `climatehub.sg/carbon-tracker`
- [ ] Direct route access: `climatehub.sg/about`
- [ ] Navigation works within app
- [ ] Browser back/forward buttons work
- [ ] Page refresh on any route works

## Debug Commands

```bash
# Test build locally
cd frontend && npm run build && npm run serve

# Check build output
ls -la frontend/build/

# Verify index.html exists
cat frontend/build/index.html | head -20

# Test with curl (replace with your domain)
curl -I https://climatehub.sg/carbon-tracker
```

## Expected Behavior
All routes should return the same `index.html` file with a 200 status code, and React Router should handle the client-side routing.

## If Still Not Working
1. Check Render service logs
2. Verify domain DNS settings
3. Try deploying with manual deploy trigger
4. Contact Render support with this debug info
