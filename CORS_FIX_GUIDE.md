# 🔧 CORS Fix Guide for ML Repository Integration

## Issue Detected

The frontend is successfully connecting to the ML repository API for GET requests, but POST requests to `/api/ratings` are being blocked by CORS policy:

```
Access to fetch at 'http://localhost:8000/api/ratings' from origin 'http://localhost:3000'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Working Endpoints ✅

- `GET /` - Health check: **WORKING**
- `GET /api/songs/random` - Random songs: **WORKING**
- `GET /api/stats` - Statistics: **WORKING**

## Blocked Endpoint ❌

- `POST /api/ratings` - Submit ratings: **BLOCKED BY CORS**

## Solution: Update ML Repository API

In your ML repository (`../spotify-song-recommender`), you need to update the FastAPI server to allow CORS for POST requests.

### Option 1: Add CORS Middleware (Recommended)

Add this to your `api_server.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Your existing routes...
```

### Option 2: Manual Headers (Alternative)

If you prefer manual control, add headers to your POST endpoint:

```python
from fastapi import Response

@app.post("/api/ratings")
async def submit_rating(rating_data: dict, response: Response):
    # Add CORS headers
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"

    # Your existing rating logic...
    return {"success": True}

# Also add OPTIONS handler for preflight requests
@app.options("/api/ratings")
async def ratings_options(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return {}
```

### Option 3: Development Only (Quick Fix)

For development only, you can disable CORS checking:

```python
# DEVELOPMENT ONLY - NOT FOR PRODUCTION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)
```

## After Fixing CORS

1. **Restart the ML repository API server**:

   ```bash
   cd ../spotify-song-recommender
   python api_server.py
   ```

2. **Test the fix in the frontend**:

   - Open http://localhost:3000
   - Click "🐛 Show Debugger"
   - Run "Test All Endpoints"
   - Verify all endpoints show ✅ status

3. **Test rating submission**:
   - Rate a song pair in the main interface
   - Check that the rating submits successfully
   - Verify new song pair loads automatically

## Production Deployment

For production, make sure to:

1. **Update allowed origins** in your ML API:

   ```python
   allow_origins=["https://your-frontend-domain.vercel.app"]
   ```

2. **Set environment variables** in both frontend and API
3. **Test CORS** in production environment

## Verification

After implementing the fix, you should see:

```
✅ [ApiClient] Success response: {"success": true}
```

Instead of:

```
❌ [ApiClient] Request failed: /api/ratings TypeError: Failed to fetch
```

---

**Note**: This CORS issue only affects POST requests because browsers send a "preflight" OPTIONS request for POST/PUT/DELETE operations, which needs explicit CORS permission.
