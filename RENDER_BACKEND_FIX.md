# 🔧 Fix OpenAI Chatbot on Render Backend

## 🚨 Current Issue
The production backend on Render is returning **fallback responses** instead of **OpenAI responses**.

**Current Response Pattern:**
```
"I understand you're asking about 'X'. While I don't have a specific response for that, I can help you with topics like climate change, carbon footprint..."
```

**Expected AI Response Pattern:**
```
"The Singapore Green Plan 2030 is a comprehensive framework aimed at promoting sustainability and addressing climate change in Singapore. It was launched in February 2021 and outlines various initiatives..."
```

## 🔍 Root Cause Analysis

The fallback response indicates the OpenAI API call is **failing** and falling back to the generic response. This happens when:

1. **Missing OpenAI API Key** - Not set in Render environment variables
2. **Invalid OpenAI API Key** - Key is expired or incorrect
3. **Outdated Backend Code** - Render backend doesn't have latest OpenAI integration
4. **API Quota Issues** - OpenAI account has no credits

## ✅ Solution Steps

### Step 1: Update Render Environment Variables

1. **Go to your Render Dashboard** → Your backend service
2. **Navigate to Environment** tab
3. **Add/Update these variables:**

```env
OPENAI_API_KEY=sk-proj-your-actual-openai-api-key-here
NODE_ENV=production
FRONTEND_URL=https://climatehub.sg
```

### Step 2: Deploy Latest Backend Code

The Render backend needs the **latest chatbot improvements**. Make sure your GitHub repository has:

1. **Enhanced OpenAI Integration** (`backend/routes/chatbot.js`)
2. **Improved System Prompts** with formatting instructions
3. **Better Error Handling** and logging

**To deploy:**
1. **Push your latest backend code** to GitHub
2. **Trigger manual deploy** on Render (or it will auto-deploy)
3. **Wait for deployment** to complete

### Step 3: Verify OpenAI API Key

Test your OpenAI API key locally:

```bash
curl -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 50
  }'
```

If this fails, your API key needs to be updated.

### Step 4: Check OpenAI Account Credits

1. **Go to** https://platform.openai.com/usage
2. **Verify** you have available credits
3. **Add billing** if needed

## 🧪 Testing After Fix

After updating Render, test these endpoints:

### Test 1: Singapore Green Plan
```bash
curl -X POST "https://climatehub-backend.onrender.com/api/chatbot/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "what is the singapore green plan 2030?"}'
```

**Expected:** Detailed AI response about Singapore Green Plan with **bold formatting** and **numbered lists**.

### Test 2: General Climate Question
```bash
curl -X POST "https://climatehub-backend.onrender.com/api/chatbot/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "how can I reduce my carbon footprint?"}'
```

**Expected:** Personalized AI advice, not generic fallback.

## 🔧 Quick Fix Commands

If you have access to Render CLI or want to redeploy:

```bash
# Force redeploy on Render
# (Go to Render Dashboard → Manual Deploy)

# Or if using Render CLI:
render deploy --service-id your-service-id
```

## 📋 Verification Checklist

- [ ] OpenAI API key is set in Render environment variables
- [ ] Latest backend code is deployed to Render
- [ ] OpenAI account has available credits
- [ ] Test endpoints return AI responses (not fallback)
- [ ] Responses include proper markdown formatting
- [ ] Local development still works with proxy

## 🚨 If Still Not Working

If the chatbot still returns fallback responses after these steps:

1. **Check Render Logs** for OpenAI API errors
2. **Verify Environment Variables** are properly set
3. **Test API Key** with direct OpenAI API call
4. **Check Network/Firewall** issues on Render

The key is ensuring the **OpenAI API key is properly configured** in your Render backend environment variables! 🔑

