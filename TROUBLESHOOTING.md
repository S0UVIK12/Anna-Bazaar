# 🔧 Quick Troubleshooting Guide

## If AI Image Analysis Fails

### Check Browser Console (F12)

Look for these messages:

1. **"Gemini API configured"** - Should show `hasKey: true`
2. **"Initializing Gemini API..."** - API is starting
3. **"Gemini Response:"** - Should show AI response

### Common Errors & Fixes

#### 1. "API key not configured"
**Fix**: 
- Verify `.env` file exists in root folder
- Check it contains: `REACT_APP_GEMINI_API_KEY=AIzaSy...`
- **Restart the server** (Stop with Ctrl+C, then `npm start`)

#### 2. "Invalid API key"
**Fix**:
- Verify key is correct (starts with `AIzaSy`)
- Get new key from: https://makersuite.google.com/app/apikey
- Update `.env` file
- Restart server

#### 3. "Permission denied"
**Fix**:
- Enable Generative Language API in Google Cloud Console
- Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
- Click "Enable"

#### 4. "Quota exceeded"
**Fix**:
- Free tier: 15 requests/minute, 1,500/day
- Wait a few minutes
- Or upgrade to paid tier

#### 5. "Network error"
**Fix**:
- Check internet connection
- Check firewall settings
- Try different network

### Quick Test

1. Open browser console (F12)
2. Look for: `"Gemini API configured: { hasKey: true, ...}"`
3. If `hasKey: false`, restart the server

### Restart Server

```bash
# In terminal, press Ctrl+C to stop
# Then run:
npm start
```

### Verify .env File

Check file content:
```bash
Get-Content .env
```

Should show:
```
REACT_APP_GEMINI_API_KEY=AIzaSyAcYnivWvloJe7gDfjGzvLMvQmsEy7OeUU
```

---

## ✅ Working Correctly When:

- ✅ Browser console shows "Gemini API configured: hasKey: true"
- ✅ Upload image successfully
- ✅ Click AI button shows "Analyzing Image with AI..."
- ✅ Fields auto-populate after 2-5 seconds
- ✅ Success banner appears

## 📞 Still Not Working?

Check:
1. Browser console for detailed errors
2. API key is valid (not expired/deleted)
3. Server was restarted after adding .env
4. Image is valid format (JPG, PNG, WebP)
5. Image size is reasonable (<4MB)
