# 🎓 Bazoosh AI - Creative Writing Feedback API

AI-powered creative writing feedback API for 11+ students preparing for UK selective school entrance exams. Built with Firebase Cloud Functions, OpenAI GPT-4o, and intelligent caching.

## 🌟 Key Features

- **30+ Specialized Prompts** - Metaphors, personification, sensory language, ISPACED sentence openers, character/setting descriptions, and full story writing across Bronze to Platinum levels
- **GPT-4o Integration** - Examiner-level feedback powered by OpenAI's latest model
- **Intelligent Caching** - 35-50% cost savings through exact and fuzzy matching (Jaccard similarity)
- **Rate Limiting** - Per-user/session/IP limits (10/hour, 30/day) to prevent abuse
- **Budget Controls** - Automated monitoring with alerts at $50 and hard limits at $100/month
- **Child-Friendly Errors** - Age-appropriate messages for 10-11 year olds
- **Comprehensive Analytics** - Usage tracking, cost monitoring, and cache performance metrics
- **Production Ready** - Express API with proper error handling, validation, and security

## 💰 Cost Estimates

Based on GPT-4o pricing ($2.50/1M input tokens, $10/1M output tokens) with intelligent caching:

| Students | Requests/Month | Avg Cost/Request | Monthly Cost (w/ caching) |
|----------|----------------|------------------|---------------------------|
| 100      | 3,000          | $0.02 - $0.03    | $45 - $67                 |
| 500      | 15,000         | $0.015 - $0.025  | $225 - $375               |
| 1,000    | 30,000         | $0.012 - $0.020  | $360 - $600               |

*Cost savings from caching: 35-50% reduction*

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project with Blaze (pay-as-you-go) plan
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dineshkunwar007/bazoosh-api.git
   cd bazoosh-api
   ```

2. **Install dependencies**
   ```bash
   cd functions
   npm install
   ```

3. **Configure Firebase**
   ```bash
   firebase login
   cp ../.firebaserc.example ../.firebaserc
   # Edit .firebaserc with your project ID
   ```

4. **Set environment variables**
   ```bash
   # Using Firebase Functions config
   firebase functions:config:set openai.api_key="your_openai_api_key"
   
   # Optional: Configure other settings
   firebase functions:config:set rate_limit.max_per_hour="10"
   firebase functions:config:set rate_limit.max_per_day="30"
   firebase functions:config:set cache.ttl_hours="168"
   firebase functions:config:set budget.limit_usd="100"
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

## 📡 API Endpoints

### POST /api/feedback

Get AI feedback on student writing.

**Request:**
```json
{
  "promptType": "metaphor-1",
  "userInput": "The moon was a pearl in the dark velvet sky...",
  "imageReference": "night sky with moon",
  "userId": "student123",
  "sessionId": "session456"
}
```

**Response:**
```json
{
  "success": true,
  "feedback": "Great job using metaphors! Your comparison of the moon to a pearl is lovely...",
  "metadata": {
    "tokensUsed": 127,
    "cost": 0.00085,
    "cached": false,
    "processingTime": 1843,
    "promptType": "metaphor-1",
    "cacheHitRate": 0.42
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**
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

### GET /api/prompts

List all available prompt types.

**Response:**
```json
{
  "success": true,
  "totalPrompts": 34,
  "categories": {
    "Metaphor": ["metaphor-1", "metaphor-2", "metaphor-3"],
    "Personification": ["personification-1", "personification-2", "personification-3"],
    "...": "..."
  },
  "prompts": { "...": "..." }
}
```

### GET /api/analytics/monthly

Get monthly cost summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "month": "2024-01",
    "totalCost": 42.37,
    "totalRequests": 2156,
    "cachedRequests": 891,
    "cacheHitRate": 0.413,
    "budgetExceeded": false,
    "averageCostPerRequest": 0.0196
  }
}
```

### GET /api/analytics/cache

Get cache performance statistics.

### GET /api/analytics/trends?days=30

Get daily usage trends.

### GET /api/rate-limit-status?userId=xxx

Check user's rate limit status.

## 📝 Available Prompt Types

### Metaphor (3 prompts)
- `metaphor-1`, `metaphor-2`, `metaphor-3` - 10-100 words, requires image

### Personification (3 prompts)
- `personification-1`, `personification-2`, `personification-3` - 10-100 words, requires image

### Sensory Language (3 prompts)
- `sensory-1`, `sensory-2`, `sensory-3` - 15-150 words, requires image

### Sentence Openers / ISPACED (3 prompts)
- `ispaced-1` (The boy walked into the bakery)
- `ispaced-2` (The girl sat down in the classroom)
- `ispaced-3` (Sam and Ella climbed the hill)
- 50-300 words, no image required

### Character Description (3 prompts)
- `character-1`, `character-2`, `character-3` - 20-150 words, requires image

### Setting Description (3 prompts)
- `setting-1`, `setting-2`, `setting-3` - 30-200 words, requires image

### Bronze Beginners (4 prompts)
- `bronze-alone` (Alone)
- `bronze-sweet-shop` (It all started when...)
- `bronze-new-pupil` (The New Pupil)
- `bronze-wizard` (My quest to find the wizard...)
- 100-500 words, story writing

### Silver Starters (4 prompts)
- `silver-everything-changed` (The day everything changed)
- `silver-lost` (Lost)
- `silver-weekend` (My weekend away)
- `silver-pet-letter` (Persuasive letter about pets)
- 100-600 words

### Gold (4 prompts)
- `gold-hobby` (My favourite hobby)
- `gold-accident` (The accident)
- `gold-person` (Describe a person you know)
- `gold-playground` (The empty playground in the park)
- 100-700 words

### Platinum (4 prompts)
- `platinum-robot` (The broken robot)
- `platinum-new-school` (A new school)
- `platinum-bedroom` (Describe your bedroom)
- `platinum-panicked` (The day they all panicked)
- 150-800 words, advanced writing

## ⚙️ Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `openai.api_key` | - | OpenAI API key (REQUIRED) |
| `rate_limit.max_per_hour` | 10 | Max requests per hour per user |
| `rate_limit.max_per_day` | 30 | Max requests per day per user |
| `cache.enabled` | true | Enable response caching |
| `cache.similarity_threshold` | 0.85 | Fuzzy match threshold (0-1) |
| `cache.ttl_hours` | 168 | Cache TTL (7 days) |
| `budget.alert_usd` | 50 | Budget alert threshold |
| `budget.limit_usd` | 100 | Budget hard limit |
| `cors.allowed_origins` | * | CORS allowed origins |

Set via Firebase Functions config:
```bash
firebase functions:config:set category.key="value"
```

Or use environment variables (local development only).

## 🔒 Security Best Practices

1. **API Keys** - Never commit API keys; use Firebase Functions config
2. **CORS** - Configure `cors.allowed_origins` to restrict access
3. **Rate Limiting** - Enabled by default to prevent abuse
4. **Input Validation** - All inputs sanitized and validated
5. **Budget Limits** - Hard cutoffs prevent runaway costs
6. **Firestore Rules** - Ensure only Cloud Functions can write to collections

## 📊 Monitoring

**View logs:**
```bash
firebase functions:log
```

**Monitor specific function:**
```bash
firebase functions:log --only api
```

**Check budget status:**
```bash
curl https://your-project.cloudfunctions.net/api/analytics/monthly
```

**View cache performance:**
```bash
curl https://your-project.cloudfunctions.net/api/analytics/cache
```

## 🐛 Troubleshooting

### OpenAI API errors
- Verify API key: `firebase functions:config:get openai.api_key`
- Check OpenAI account has credits
- Test connection: `curl https://your-project.cloudfunctions.net/api/health`

### Budget exceeded
- Check monthly costs: `/api/analytics/monthly`
- Increase limit: `firebase functions:config:set budget.limit_usd="200"`
- Redeploy: `npm run deploy`

### Rate limit issues
- Check status: `/api/rate-limit-status?userId=xxx`
- Adjust limits: `firebase functions:config:set rate_limit.max_per_hour="20"`

### Caching not working
- Verify cache enabled: `firebase functions:config:get cache.enabled`
- Check Firestore indexes and permissions
- View stats: `/api/analytics/cache`

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [OpenAI GPT-4o Docs](https://platform.openai.com/docs/models/gpt-4o)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Firestore](https://firebase.google.com/docs/firestore)

## 🤝 Contributing

This API serves 11+ students preparing for UK selective school entrance exams. All feedback and error messages must be clear, encouraging, and age-appropriate.

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

Created by [dineshkunwar007](https://github.com/dineshkunwar007) for Bazoosh AI

---

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**
