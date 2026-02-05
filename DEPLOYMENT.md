# 🚀 Deployment Guide - Bazoosh AI API

Complete step-by-step guide for deploying the Bazoosh AI Creative Writing Feedback API to Firebase Cloud Functions.

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Node.js 18+** installed ([download](https://nodejs.org/))
- [ ] **npm** or **yarn** package manager
- [ ] **Firebase CLI** installed: `npm install -g firebase-tools`
- [ ] **Google Cloud / Firebase account** with billing enabled
- [ ] **OpenAI account** with API access
- [ ] **OpenAI API key** ([get one here](https://platform.openai.com/api-keys))
- [ ] **Firebase project** created (or ready to create)
- [ ] **Blaze plan** enabled (pay-as-you-go - required for Cloud Functions)

## 🏗️ Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `bazoosh-ai` (or your choice)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

### 1.2 Upgrade to Blaze Plan

1. In Firebase Console, go to "Spark" plan indicator (bottom left)
2. Click "Upgrade"
3. Select "Blaze (Pay as you go)" plan
4. Add billing information
5. Confirm upgrade

> **Note:** Cloud Functions require the Blaze plan. You'll only pay for what you use beyond the generous free tier.

### 1.3 Enable Required APIs

In Google Cloud Console (click "Go to Google Cloud Console" in Firebase):

1. Enable **Cloud Functions API**
2. Enable **Cloud Firestore API**
3. Enable **Cloud Scheduler API** (for scheduled functions)

## 🗄️ Step 2: Firestore Database Setup

### 2.1 Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose your preferred region (e.g., `europe-west2` for London)
5. Click "Enable"

### 2.2 Configure Security Rules

In Firestore, go to "Rules" tab and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow Cloud Functions to write
    match /{document=**} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```

> **Security Note:** These rules prevent direct client access. Only Cloud Functions can read/write.

### 2.3 Create Indexes (Optional but Recommended)

Firestore will automatically create indexes, but you can pre-create them:

1. Go to "Indexes" tab
2. Click "Add Index"
3. Create composite index for `feedbackCache`:
   - Collection ID: `feedbackCache`
   - Fields: `promptType` (Ascending), `expiresAt` (Descending)
4. Create index for `rateLimits`:
   - Collection ID: `rateLimits`
   - Fields: `windowEnd` (Ascending)

## 📦 Step 3: Clone and Install

### 3.1 Clone Repository

```bash
git clone https://github.com/dineshkunwar007/bazoosh-api.git
cd bazoosh-api
```

### 3.2 Install Dependencies

```bash
cd functions
npm install
```

This installs:
- `firebase-admin` - Firebase SDK
- `firebase-functions` - Cloud Functions runtime
- `openai` - OpenAI API client
- `express` - Web framework
- `cors` - CORS middleware
- TypeScript and type definitions

### 3.3 Configure Firebase CLI

```bash
# Login to Firebase
firebase login

# Select your project
firebase use --add
# Choose your project from the list
# Enter alias: default

# Verify selection
firebase projects:list
```

## ⚙️ Step 4: Environment Configuration

### 4.1 Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name it "Bazoosh API"
4. Copy the key (you won't see it again!)
5. Store it securely

### 4.2 Set Firebase Functions Config

```bash
# Required: OpenAI API key
firebase functions:config:set openai.api_key="sk-your-openai-api-key-here"

# Optional: Rate limiting (defaults shown)
firebase functions:config:set rate_limit.max_per_hour="10"
firebase functions:config:set rate_limit.max_per_day="30"

# Optional: Cache configuration
firebase functions:config:set cache.enabled="true"
firebase functions:config:set cache.similarity_threshold="0.85"
firebase functions:config:set cache.ttl_hours="168"

# Optional: Budget controls
firebase functions:config:set budget.alert_usd="50"
firebase functions:config:set budget.limit_usd="100"

# Optional: CORS (use * for testing, restrict for production)
firebase functions:config:set cors.allowed_origins="*"
```

### 4.3 Verify Configuration

```bash
firebase functions:config:get
```

Expected output:
```json
{
  "openai": {
    "api_key": "sk-..."
  },
  "rate_limit": {
    "max_per_hour": "10",
    "max_per_day": "30"
  },
  "cache": {
    "enabled": "true",
    "similarity_threshold": "0.85",
    "ttl_hours": "168"
  },
  "budget": {
    "alert_usd": "50",
    "limit_usd": "100"
  }
}
```

## 🧪 Step 5: Local Testing (Optional)

### 5.1 Download Config for Local Testing

```bash
firebase functions:config:get > .runtimeconfig.json
```

### 5.2 Start Local Emulators

```bash
npm run serve
```

This starts:
- Functions emulator on `http://localhost:5001`
- Firestore emulator on `http://localhost:8080`

### 5.3 Test Locally

```bash
# Health check
curl http://localhost:5001/your-project-id/us-central1/api/health

# Test feedback endpoint
curl -X POST http://localhost:5001/your-project-id/us-central1/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "promptType": "metaphor-1",
    "userInput": "The moon was a pearl in the dark velvet sky. Stars were diamonds scattered across the night.",
    "imageReference": "night sky with moon",
    "userId": "test-user"
  }'
```

## 🚢 Step 6: Deploy to Production

### 6.1 Build TypeScript

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `lib/` directory.

### 6.2 Deploy Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:api
```

Deployment takes 2-5 minutes. You'll see output like:

```
✔  functions[api(us-central1)] Successful create operation.
✔  functions[cleanupCache(us-central1)] Successful create operation.
✔  functions[cleanupRateLimits(us-central1)] Successful create operation.
✔  functions[budgetAlert(us-central1)] Successful create operation.

Function URL (api): https://us-central1-your-project-id.cloudfunctions.net/api
```

### 6.3 Verify Deployment

```bash
# Check deployment status
firebase functions:list

# Test health endpoint
curl https://us-central1-your-project-id.cloudfunctions.net/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "openai": {
    "connected": true,
    "message": "OpenAI API is connected and working"
  },
  "firebase": {
    "connected": true
  },
  "timestamp": 1706630400000
}
```

## 🔗 Step 7: Frontend Integration

### 7.1 JavaScript Fetch Example

```javascript
const API_URL = 'https://us-central1-your-project-id.cloudfunctions.net/api';

async function getFeedback(promptType, userInput, imageReference, userId) {
  try {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        promptType,
        userInput,
        imageReference,
        userId,
        sessionId: generateSessionId(),
      }),
    });

    const data = await response.json();

    if (data.success) {
      return {
        feedback: data.feedback,
        cached: data.metadata.cached,
        cost: data.metadata.cost,
      };
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
}

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Usage
getFeedback(
  'metaphor-1',
  'The moon was a pearl in the dark velvet sky.',
  'night sky with moon',
  'user123'
).then(result => {
  console.log('Feedback:', result.feedback);
  console.log('Cached:', result.cached);
});
```

### 7.2 React Component Example

```jsx
import React, { useState } from 'react';

const API_URL = 'https://us-central1-your-project-id.cloudfunctions.net/api';

function WritingFeedback() {
  const [promptType, setPromptType] = useState('metaphor-1');
  const [userInput, setUserInput] = useState('');
  const [imageReference, setImageReference] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFeedback('');

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptType,
          userInput,
          imageReference,
          userId: 'user123', // Replace with actual user ID
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFeedback(data.feedback);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="writing-feedback">
      <h2>Get Writing Feedback</h2>
      <form onSubmit={handleSubmit}>
        <select value={promptType} onChange={(e) => setPromptType(e.target.value)}>
          <option value="metaphor-1">Metaphor (Image 1)</option>
          <option value="personification-1">Personification (Image 1)</option>
          <option value="bronze-alone">Bronze: Alone</option>
          {/* Add more options */}
        </select>

        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Write your story or description here..."
          rows={10}
          required
        />

        {promptType.includes('-1') && (
          <input
            type="text"
            value={imageReference}
            onChange={(e) => setImageReference(e.target.value)}
            placeholder="Describe the image (e.g., 'stormy ocean')"
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Getting Feedback...' : 'Get Feedback'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {feedback && (
        <div className="feedback">
          <h3>Feedback:</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export default WritingFeedback;
```

## 📊 Step 8: Monitoring and Maintenance

### 8.1 View Logs

```bash
# Real-time logs
firebase functions:log --only api

# Last 100 entries
firebase functions:log --limit 100

# Filter by severity
firebase functions:log --only api --severity ERROR
```

### 8.2 Monitor Costs

```bash
# Check monthly summary
curl https://us-central1-your-project-id.cloudfunctions.net/api/analytics/monthly

# View daily trends
curl "https://us-central1-your-project-id.cloudfunctions.net/api/analytics/trends?days=30"

# Cache performance
curl https://us-central1-your-project-id.cloudfunctions.net/api/analytics/cache
```

### 8.3 Set Up Alerting

In Google Cloud Console:
1. Go to "Monitoring" → "Alerting"
2. Create alert policy for:
   - Function execution errors (rate > 5%)
   - Function execution time (p95 > 10s)
   - Budget alerts (linked to your configured limits)

### 8.4 Regular Maintenance

**Daily:**
- Check logs for errors
- Monitor budget status

**Weekly:**
- Review cache hit rate (target: >30%)
- Check rate limit violations
- Review cost trends

**Monthly:**
- Analyze usage patterns
- Adjust rate limits if needed
- Review and optimize budget

## 🔧 Step 9: Troubleshooting

### Common Issues

#### Issue: "Billing account not configured"
**Solution:**
```bash
# Ensure Blaze plan is enabled in Firebase Console
# Add billing account in Google Cloud Console
```

#### Issue: "OpenAI API authentication failed"
**Solution:**
```bash
# Verify API key is set correctly
firebase functions:config:get openai.api_key

# Update if needed
firebase functions:config:set openai.api_key="sk-correct-key"

# Redeploy
firebase deploy --only functions
```

#### Issue: "Function timeout"
**Solution:**
In `functions/src/index.ts`, increase timeout:
```typescript
export const api = functions
  .runWith({ timeoutSeconds: 60 }) // Increase from default 60s
  .https.onRequest(app);
```

#### Issue: "CORS errors"
**Solution:**
```bash
# Add your domain to allowed origins
firebase functions:config:set cors.allowed_origins="https://yourdomain.com,https://www.yourdomain.com"
firebase deploy --only functions
```

#### Issue: "Rate limit too restrictive"
**Solution:**
```bash
# Increase limits
firebase functions:config:set rate_limit.max_per_hour="20"
firebase functions:config:set rate_limit.max_per_day="100"
firebase deploy --only functions
```

## ✅ Production Readiness Checklist

Before going live, ensure:

- [ ] Blaze plan enabled
- [ ] Firestore database created with security rules
- [ ] OpenAI API key configured correctly
- [ ] Rate limits set appropriately for your user base
- [ ] Budget limits configured
- [ ] CORS origins restricted to your domain(s)
- [ ] Monitoring and alerting set up
- [ ] Error handling tested (invalid inputs, rate limits, budget exceeded)
- [ ] Frontend integration tested
- [ ] Documentation shared with development team
- [ ] Backup plan for budget exceeded scenario
- [ ] User communication plan for rate limits

## 🎯 Next Steps

1. **Test thoroughly** - Try all prompt types with various inputs
2. **Monitor usage** - Watch costs and cache performance for first week
3. **Gather feedback** - Get student/teacher feedback on AI responses
4. **Optimize prompts** - Refine system prompts based on feedback quality
5. **Scale gradually** - Start with small user group before full rollout

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/dineshkunwar007/bazoosh-api/issues)
- Firebase Support: [Firebase Console Help](https://console.firebase.google.com/)
- OpenAI Support: [OpenAI Help Center](https://help.openai.com/)

---

**You're all set! 🎉 Your Bazoosh AI API is ready to help students improve their creative writing.**