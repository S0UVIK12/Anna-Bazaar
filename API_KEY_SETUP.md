# 🔑 API Key Setup - Quick Reference

## What You Need to Provide

### Google Gemini API Key

**Get it here**: https://makersuite.google.com/app/apikey

---

## Setup Instructions (Simple)

### Step 1: Get Your API Key
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX`)

### Step 2: Add to Project

**Option A - Create `.env` file** (Recommended):

1. Create a new file named `.env` in:
   ```
   d:\Anna-Bazaar-main\Anna-Bazaar-main\.env
   ```

2. Add this line (replace with your actual key):
   ```
   REACT_APP_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

3. Save the file

4. Restart the server:
   ```bash
   npm start
   ```

**Option B - Direct configuration**:

1. Open: `src/config/geminiConfig.js`
2. Replace this line:
   ```javascript
   apiKey: process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE',
   ```
   
   With your actual key:
   ```javascript
   apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX',
   ```

---

## ✅ Testing

1. Open http://localhost:3000
2. Login as Farmer
3. Click "Add Product"
4. Upload an image
5. Click "✨ Analyze Image & Auto-Fill Details"
6. Watch the magic happen! 🎉

---

## 📞 When You Have Your Key

Just provide your Gemini API key and I'll help you set it up!

**Format**: 
```
REACT_APP_GEMINI_API_KEY=AIzaSy...
```

---

## 🚨 Important Notes

- ✅ Free tier: 15 requests/minute, 1,500 requests/day
- ✅ Keep your API key secret (never share publicly)
- ✅ The `.env` file is already added to `.gitignore`
- ✅ Restart server after adding the key

---

**Ready to provide your key?** Just paste it and I'll set it up for you! 🚀
