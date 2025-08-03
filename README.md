# 🎵 Spotify Song Recommender Frontend

A Next.js web application for collecting public song ratings to improve music recommendation ML models. Users rate song compatibility on a 1-10 scale to help train AI models for better playlist creation.

![Song Rating Interface](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css)

## 🎯 Purpose

This frontend collects human ratings on song compatibility to train and improve the [Spotify Song Recommender](../spotify-song-recommender) ML model. The application connects directly to the ML repository API for real-time data collection and model improvement.

## ✨ Features

- **🎯 Intuitive Rating Interface**: Clean, responsive UI for rating song compatibility
- **🔄 Real-time ML Integration**: Direct connection to recommendation model API
- **📊 Statistics Dashboard**: Live metrics on rating collection and model performance
- **🐛 Built-in Debugging**: Comprehensive tools for monitoring API health
- **📱 Mobile-Friendly**: Optimized for all devices to maximize reach
- **🚀 Production-Ready**: Deployed on Vercel with full ML repository integration

## 🏗️ Architecture

```
Frontend (Next.js) ←→ ML Repository API (FastAPI) ←→ ML Model & Database
```

- **Frontend**: Collects ratings through intuitive interface
- **API Integration**: Real-time connection to ML repository
- **Data Flow**: Ratings immediately contribute to model training
- **Fallback**: Local database for offline development

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Integration**: FastAPI connection to ML repository
- **Deployment**: Vercel
- **Development**: Comprehensive debugging and testing tools

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ and npm
- ML Repository API running (see integration guide)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd spotify-song-recommender-frontend
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API settings
   ```

3. **Start ML Repository API**

   ```bash
   # In your ML repository directory
   cd ../spotify-song-recommender
   python api_server.py
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## � Configuration

### Environment Variables

| Variable                   | Description                  | Default                  |
| -------------------------- | ---------------------------- | ------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | ML Repository API URL        | `http://localhost:8000`  |
| `DATABASE_URL`             | Fallback database connection | `file:./data/ratings.db` |

### ML Repository Integration

Ensure your ML repository API is running:

```bash
# In your ML repository directory
cd ../spotify-song-recommender
python api_server.py
```

## � Available Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run start`    | Start production server  |
| `npm run lint`     | Run ESLint               |
| `npm run test-api` | Test API connectivity    |

## 🐛 Debugging

### Built-in Debug Tools

1. **API Debugger**: Click "🐛 Show Debugger" to test all endpoints
2. **Component Debug**: Click "🐛 Debug" for real-time status
3. **Console Logging**: Detailed request/response logs
4. **Command Line**: `npm run test-api` for quick health check

### Common Issues

- **API Connection**: Ensure ML repository is running on correct port
- **CORS Errors**: Add frontend URL to API's allowed origins
- **Environment**: Check `.env.local` configuration

## 📊 API Endpoints

### ML Repository Endpoints

- `GET /` - Health check
- `GET /api/songs/random` - Get two random songs for rating
- `POST /api/ratings` - Submit a rating (1-10)
- `GET /api/stats` - Get collection statistics

### Data Format

Ratings are submitted in the format expected by the ML model:

```json
{
  "song_a_id": "spotify_track_id",
  "song_b_id": "spotify_track_id",
  "user_rating": 7,
  "session_id": "unique_session",
  "timestamp": "2025-08-03T20:30:00Z"
}
```

## � Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://your-ml-api.herokuapp.com
   ```
3. **Deploy** automatically on push

### Docker

```bash
# Build and run
docker build -t song-recommender-frontend .
docker run -p 3000:3000 song-recommender-frontend
```

## 🏛️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes (fallback)
│   └── page.tsx           # Main application
├── components/            # React components
│   ├── SongRatingInterface.tsx
│   ├── StatsDashboard.tsx
│   └── ApiDebugger.tsx
├── hooks/                 # Custom React hooks
│   └── useApi.ts          # API integration hooks
├── lib/                   # Utility libraries
│   └── api-client.ts      # ML repository API client
├── types/                 # TypeScript definitions
└── scripts/               # Development tools
    ├── test-api-connection.js
    └── debug-api.sh
```

## 🔄 Development Workflow

1. **API Integration**: Direct connection to ML repository for real-time data
2. **Debug Mode**: Built-in tools for monitoring API health and performance
3. **Testing**: Comprehensive endpoint testing with detailed logging
4. **Data Flow**: Ratings immediately contribute to model training

## 🎨 Usage Flow

1. User visits the website
2. Two random songs are fetched from ML repository
3. User listens to songs and rates compatibility (1-10)
4. Rating is sent directly to ML repository for training
5. New song pair automatically loads
6. Real-time statistics show collection progress

## 🔐 Privacy & Security

- No personal information collected
- Anonymous session tracking only
- Secure API communication with CORS protection
- Rate limiting prevents abuse

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🔗 Related Projects

- [Spotify Song Recommender ML Model](../spotify-song-recommender) - Main ML repository
- [API Server](../spotify-song-recommender/api_server.py) - FastAPI backend

## � Support

- **Debug Tools**: Use built-in debugger for real-time troubleshooting
- **API Testing**: Run `npm run test-api` for connectivity check
- **Console Logs**: Detailed request/response tracking for development

## 📄 License

This project is part of the Spotify Song Recommender system for educational and research purposes.

---

Built with ❤️ for better music recommendations
