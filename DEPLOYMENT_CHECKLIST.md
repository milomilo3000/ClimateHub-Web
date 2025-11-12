# 🚀 Production Deployment Checklist for climatehub.sg

## ✅ Current Status
- **Frontend Configuration**: ✅ Fixed for production
- **Backend RSS Feeds**: ✅ Working (16 articles)
- **Backend Chatbot**: ⚠️ Working but may need OpenAI API key update

## 🔧 Required Steps for Full Production Deployment

### 1. Update Render Backend Environment Variables
Make sure your Render backend service has these environment variables set:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-atlas-connection-string
FRONTEND_URL=https://climatehub.sg
FIREBASE_PROJECT_ID=climatehub-sg
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=your-jwt-secret-key
```

### 2. Deploy Latest Backend Code to Render
The backend needs the latest RSS feeds and OpenAI improvements:

1. **Push your latest backend code to GitHub**
2. **Trigger a new deployment on Render** (or it will auto-deploy if connected to GitHub)
3. **Verify the deployment includes**:
   - Updated RSS feeds configuration (`backend/routes/news.js`)
   - Enhanced OpenAI chatbot with formatting (`backend/routes/chatbot.js`)
   - CORS configuration for production

### 3. Deploy Frontend to climatehub.sg
1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload the build folder** to your hosting (Hostinger VPS)

3. **Verify the configuration**:
   - Frontend will use `https://climatehub-backend.onrender.com` in production
   - Frontend will use proxy to `localhost:5001` in development

### 4. Test Production Features

After deployment, test these features on `climatehub.sg`:

#### RSS Feeds Test:
- ✅ Go to Education Hub
- ✅ Verify news articles load
- ✅ Test "Local News" filter (Singapore content)
- ✅ Test "Global News" filter (International content)
- ✅ Test search functionality

#### OpenAI Chatbot Test:
- ✅ Go to Education Hub chatbot
- ✅ Ask: "What is the Singapore Green Plan 2030?"
- ✅ Verify proper markdown formatting (bold text, numbered lists)
- ✅ Verify it's not using fallback responses

## 🔍 Troubleshooting

### If RSS Feeds Don't Work:
1. Check Render backend logs for RSS parsing errors
2. Verify the news API endpoint: `https://climatehub-backend.onrender.com/api/news`
3. Check if RSS feed URLs are accessible from Render servers

### If OpenAI Chatbot Doesn't Work:
1. Verify `OPENAI_API_KEY` is set in Render environment variables
2. Check Render backend logs for OpenAI API errors
3. Test the chatbot endpoint: `https://climatehub-backend.onrender.com/api/chatbot/chat`

### If CORS Errors Occur:
1. Verify `FRONTEND_URL=https://climatehub.sg` in Render environment
2. Check that `https://climatehub.sg` is in the allowed origins list

## 📝 Environment Configuration Summary

### Development (Local):
- Frontend: Uses proxy to `localhost:5001`
- Backend: Runs on `localhost:5001`
- Configuration: Automatic via `NODE_ENV=development`

### Production (climatehub.sg):
- Frontend: Uses `https://climatehub-backend.onrender.com`
- Backend: Runs on Render at `https://climatehub-backend.onrender.com`
- Configuration: Automatic via `NODE_ENV=production`

## ✅ Final Verification

Once deployed, verify these URLs work:
- ✅ `https://climatehub.sg` - Main website
- ✅ `https://climatehub.sg/education` - Education Hub with news and chatbot
- ✅ `https://climatehub-backend.onrender.com/api/news` - RSS feeds API
- ✅ `https://climatehub-backend.onrender.com/api/chatbot/chat` - Chatbot API

## 🎯 Key Changes Made

1. **Frontend Configuration**: 
   - Environment-based backend URL selection
   - Development uses proxy, production uses Render URL

2. **RSS Feeds**: 
   - Re-enabled news loading
   - Added pagination for better UX
   - Proper Singapore/Global filtering

3. **OpenAI Chatbot**:
   - Enhanced markdown formatting
   - Better system prompts
   - Improved error handling

Your production deployment should now work perfectly with both RSS feeds and OpenAI chatbot! 🚀
