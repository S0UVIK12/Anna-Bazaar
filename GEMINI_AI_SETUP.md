# Google Gemini AI Integration - Setup Guide

## 🎯 Overview

The product upload feature now uses **Google Gemini AI** to analyze uploaded product images and automatically predict:
- ✅ Product name
- ✅ Product category
- ✅ Detailed description
- ✅ Quality grade/certification
- ✅ Suggested pricing (retail & bulk)
- ✅ Product characteristics

## 🔑 Getting Your Gemini API Key

### Step 1: Get API Key from Google AI Studio

1. Visit: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the generated API key

### Step 2: Configure the API Key

You have **two options**:

#### Option A: Using Environment Variable (Recommended)

1. Create a `.env` file in the project root directory:
   ```bash
   # Location: d:\Anna-Bazaar-main\Anna-Bazaar-main\.env
   ```

2. Add your API key to the `.env` file:
   ```env
   REACT_APP_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

3. **Important**: Add `.env` to `.gitignore` to keep your key secure:
   ```gitignore
   .env
   .env.local
   ```

4. Restart the development server:
   ```bash
   npm start
   ```

#### Option B: Direct Configuration (Not Recommended for Production)

1. Open: `src/config/geminiConfig.js`
2. Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual API key:
   ```javascript
   export const GEMINI_CONFIG = {
     apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     model: 'gemini-1.5-flash',
   };
   ```

⚠️ **Warning**: Never commit your API key to version control!

## 📦 Dependencies

Already installed:
- ✅ `@google/generative-ai` - Google's Generative AI SDK

## 🚀 How to Use

### 1. Upload Product Image

1. Login as a Farmer
2. Go to **Products** tab
3. Click **Add Product**
4. Upload a product image (click the upload area)

### 2. AI Analysis

1. After uploading, click **"✨ Analyze Image & Auto-Fill Details"**
2. Wait a few seconds for AI to analyze the image
3. All fields will be automatically filled with AI predictions

### 3. Review & Edit

1. Review the AI-generated information
2. Edit any fields as needed (all fields remain editable)
3. Add/adjust pricing
4. Click **Add Product** to save

## 🎨 Features

### AI-Powered Detection
- **Image Analysis**: Gemini Vision AI analyzes the uploaded image
- **Product Recognition**: Identifies the product type
- **Smart Descriptions**: Generates professional product descriptions
- **Category Matching**: Automatically selects appropriate category
- **Price Suggestions**: Recommends retail and bulk pricing

### User Experience
- **Visual Feedback**: Loading animations during AI processing
- **Error Handling**: Clear error messages if API fails
- **Manual Override**: All AI-generated fields are editable
- **Fallback Support**: Can fill manually if AI is unavailable

## 🔧 Technical Details

### API Configuration

**File**: `src/config/geminiConfig.js`
```javascript
{
  apiKey: process.env.REACT_APP_GEMINI_API_KEY,
  model: 'gemini-1.5-flash' // Supports image + text analysis
}
```

### Supported Models
- ✅ `gemini-1.5-flash` (Fast, efficient, recommended)
- ✅ `gemini-1.5-pro` (More accurate, slower)

### Image Processing
- Converts uploaded image to base64
- Sends to Gemini Vision API
- Processes multimodal input (image + text prompt)

### Response Format
AI returns structured JSON:
```json
{
  "productName": "Organic Tomatoes",
  "category": "Vegetables",
  "description": "Fresh, vine-ripened organic tomatoes...",
  "qualityGrade": "Premium/Grade A",
  "suggestedRetailPrice": 45,
  "suggestedBulkPrice": 38,
  "characteristics": "Bright red, firm texture, ripe"
}
```

## 🛡️ Security Best Practices

### API Key Protection

1. **Never commit API keys to Git**
   ```gitignore
   # Add to .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use environment variables**
   ```env
   REACT_APP_GEMINI_API_KEY=your_key_here
   ```

3. **Restrict API key usage** (in Google Cloud Console):
   - Set API restrictions
   - Limit to Generative Language API
   - Add HTTP referrer restrictions

4. **Monitor usage**:
   - Check Google Cloud Console regularly
   - Set up usage alerts
   - Monitor API quotas

## 💰 API Pricing

### Free Tier
- **15 requests per minute (RPM)**
- **1 million tokens per day**
- **1,500 requests per day**

### Paid Tier
- Higher rate limits
- More requests per day
- Enterprise support

**Get pricing**: https://ai.google.dev/pricing

## 🐛 Troubleshooting

### Common Issues

#### 1. "API key not configured" error
**Solution**: 
- Check `.env` file exists
- Verify `REACT_APP_GEMINI_API_KEY` is set
- Restart development server

#### 2. "Quota exceeded" error
**Solution**:
- Check Google Cloud Console usage
- Wait for quota reset (daily)
- Consider upgrading to paid tier

#### 3. "Failed to analyze image" error
**Solutions**:
- Check internet connection
- Verify API key is valid
- Ensure image format is supported (JPG, PNG, WebP)
- Check image size (max 4MB recommended)

#### 4. JSON parsing errors
**Solution**:
- AI sometimes returns malformed JSON
- Fallback parser extracts data manually
- Check console logs for details

### Debug Mode

Enable detailed logging:
```javascript
// In ProductUploadForm.js
console.log('Gemini Response:', text);
console.log('Parsed Data:', aiData);
```

## 📱 Testing

### Test the Integration

1. **Upload a test image** (e.g., tomato, banana, wheat)
2. **Click AI analyze button**
3. **Check console for logs**:
   - Open browser DevTools (F12)
   - Check Console tab
   - Look for "Gemini Response"

### Expected Behavior
- ✅ Image uploads successfully
- ✅ AI button appears after upload
- ✅ Loading animation shows during processing
- ✅ Fields auto-populate with predictions
- ✅ Success banner displays
- ✅ All fields remain editable

## 📊 Workflow

```
Upload Image → Click AI Analyze → AI Processing → Auto-Fill Fields → Review → Edit if Needed → Save Product
```

## 🎓 Resources

- **Google AI Studio**: https://makersuite.google.com/
- **Gemini API Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **API Reference**: https://ai.google.dev/api

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review error messages in console
3. Verify API key configuration
4. Check Google Cloud Console for API status

---

## ✅ Quick Setup Checklist

- [ ] Get Gemini API key from Google AI Studio
- [ ] Create `.env` file in project root
- [ ] Add `REACT_APP_GEMINI_API_KEY=your_key` to `.env`
- [ ] Add `.env` to `.gitignore`
- [ ] Restart development server (`npm start`)
- [ ] Test by uploading a product image
- [ ] Click "Analyze Image & Auto-Fill Details"
- [ ] Verify all fields are populated correctly

**Version**: 3.0  
**Last Updated**: October 31, 2025  
**API**: Google Gemini 1.5 Flash
