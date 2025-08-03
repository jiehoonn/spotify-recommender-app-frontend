# 🔗 ML Repository Integration Guide

This guide explains how the frontend integrates with the main Spotify Song Recommender ML repository and provides comprehensive troubleshooting for the real-time API connection.

## 🏗️ Architecture Overview

```
┌─────────────────────┐    HTTP/JSON    ┌─────────────────────┐
│   Frontend (Next.js) │ ←────────────→ │  ML Repository API  │
│   - Rating Interface │                │  - FastAPI Server   │
│   - Debug Tools     │                │  - Song Database    │
│   - Statistics      │                │  - ML Training      │
└─────────────────────┘                └─────────────────────┘
```

## 🚀 Quick Start

### 1. Start the ML Repository API Server

In your ML repository directory:

```bash
cd ../spotify-song-recommender
python api_server.py
```

The API will start on `http://localhost:8000` with endpoints:

- `GET /` - Health check
- `GET /api/songs/random` - Get random song pairs
- `POST /api/ratings` - Submit user ratings
- `GET /api/stats` - Get collection statistics

### 2. Configure Frontend Environment

Create/update `.env.local` in your frontend project:

```bash
# Development - ML Repository API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Database (fallback)
DATABASE_URL="file:./data/ratings.db"

# Optional: Production API URL
# NEXT_PUBLIC_API_BASE_URL=https://your-ml-api.herokuapp.com
```

### 3. Start the Frontend

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see:

- ✅ "Connected to ML Repository" indicator
- Real-time song pairs from your ML model's database
- Rating submission with model predictions
- Statistics dashboard showing collection progress

## Architecture

```
Frontend (Next.js) ←→ ML Repository API (FastAPI) ←→ ML Model & Database
```

### Data Flow

1. **Song Fetching**: Frontend requests random song pairs from ML API
2. **Rating Submission**: User ratings sent to ML API with session tracking
3. **Model Training**: Ratings immediately available for model improvement
4. **Statistics**: Real-time collection metrics displayed on dashboard

### API Client Features

- **Automatic Retry**: Failed requests retry with exponential backoff
- **Health Monitoring**: Continuous connection status checking
- **Error Handling**: Graceful fallback with helpful error messages
- **TypeScript Safety**: Full type checking for API responses

## Production Deployment

### Option 1: Vercel + Railway/Heroku API

1. **Deploy ML API**: Deploy your ML repository to Railway/Heroku
2. **Configure Frontend**: Set production API URL in Vercel environment
3. **Deploy Frontend**: Push to Vercel with environment variables

```bash
# Vercel deployment
vercel --prod

# Environment variables in Vercel dashboard:
NEXT_PUBLIC_API_BASE_URL=https://your-ml-api.railway.app
```

### Option 2: Docker Compose

```yaml
# docker-compose.yml
version: "3.8"
services:
  ml-api:
    build: ../spotify-song-recommender
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://...

  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://ml-api:8000
    depends_on:
      - ml-api
```

## Monitoring & Analytics

The `StatsDashboard` component provides real-time insights:

- **Connection Status**: API health and response times
- **Collection Metrics**: Total ratings, active sessions, recent submissions
- **Model Performance**: Prediction accuracy, learning progress
- **User Engagement**: Session duration, completion rates

## Data Synchronization

Even with API integration, you can still sync data:

```bash
# Export frontend ratings to ML repository
npm run sync-to-main

# This updates human_ratings.json in your ML project
```

## Troubleshooting

### API Connection Issues

1. **Check ML API Status**:

   ```bash
   curl http://localhost:8000/health
   ```

2. **Verify Environment Variables**:

   ```bash
   echo $NEXT_PUBLIC_API_BASE_URL
   ```

3. **Check CORS Settings** in your ML API:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000", "https://your-frontend.vercel.app"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### Common Issues

- **CORS Errors**: Add your frontend URL to ML API's allowed origins
- **Timeout Issues**: Check network connectivity and API server status
- **Type Errors**: Ensure API response format matches TypeScript interfaces
- **Rate Limiting**: Implement proper retry logic for high-volume usage

## Development Tips

1. **Hot Reloading**: Both servers support hot reloading for development
2. **API Testing**: Use the health dashboard to monitor API performance
3. **Error Logging**: Check browser console and API server logs
4. **Data Validation**: API client validates all responses for consistency

## Next Steps

1. **Scale Testing**: Test with multiple concurrent users
2. **Performance Optimization**: Add caching and request batching
3. **Analytics Integration**: Add Google Analytics or Mixpanel tracking
4. **A/B Testing**: Experiment with different rating interfaces
5. **Mobile Optimization**: Ensure smooth mobile experience

Your frontend is now fully integrated with the ML repository for scalable public rating collection! 🎵
