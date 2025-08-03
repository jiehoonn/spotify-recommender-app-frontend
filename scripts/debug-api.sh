#!/bin/bash

# API Debugging Script
# This script tests your ML repository API endpoints directly with curl

API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000}"

echo "🧪 Testing ML Repository API Endpoints"
echo "📡 API Base URL: $API_BASE_URL"
echo ""

# Test 1: Health Check (Root endpoint)
echo "🔍 Test 1: Health Check (GET /)"
echo "----------------------------------------"
curl -s -w "Status: %{http_code}\nTime: %{time_total}s\n" \
     -H "Accept: application/json" \
     "$API_BASE_URL/" | jq . 2>/dev/null || echo "Response is not valid JSON"
echo ""

# Test 2: Random Songs
echo "🔍 Test 2: Random Songs (GET /api/songs/random)"
echo "----------------------------------------"
curl -s -w "Status: %{http_code}\nTime: %{time_total}s\n" \
     -H "Accept: application/json" \
     "$API_BASE_URL/api/songs/random" | jq . 2>/dev/null || echo "Response is not valid JSON"
echo ""

# Test 3: Statistics
echo "🔍 Test 3: Statistics (GET /api/stats)"
echo "----------------------------------------"
curl -s -w "Status: %{http_code}\nTime: %{time_total}s\n" \
     -H "Accept: application/json" \
     "$API_BASE_URL/api/stats" | jq . 2>/dev/null || echo "Response is not valid JSON"
echo ""

# Test 4: Submit Rating (POST)
echo "🔍 Test 4: Submit Rating (POST /api/ratings)"
echo "----------------------------------------"
curl -s -w "Status: %{http_code}\nTime: %{time_total}s\n" \
     -X POST \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{
       "song_a_id": "debug_song_a_' $(date +%s) '",
       "song_b_id": "debug_song_b_' $(date +%s) '",
       "user_rating": 7,
       "session_id": "debug_session_' $(date +%s) '",
       "source": "debug_script"
     }' \
     "$API_BASE_URL/api/ratings" | jq . 2>/dev/null || echo "Response is not valid JSON"
echo ""

# Test 5: CORS Preflight (OPTIONS)
echo "🔍 Test 5: CORS Preflight (OPTIONS)"
echo "----------------------------------------"
curl -s -w "Status: %{http_code}\nTime: %{time_total}s\n" \
     -X OPTIONS \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     "$API_BASE_URL/api/ratings"
echo ""

# Test 6: List all available endpoints
echo "🔍 Test 6: API Documentation (GET /docs)"
echo "----------------------------------------"
echo "Visit: $API_BASE_URL/docs for interactive API documentation"
echo ""

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "💡 Tip: Install 'jq' for better JSON formatting: brew install jq"
fi

echo "✅ API debugging complete!"
echo ""
echo "🔧 Troubleshooting:"
echo "- If all requests fail: Check if your ML API server is running"
echo "- If CORS fails: Add your frontend URL to API's allowed origins"
echo "- If 404 errors: Verify the endpoint paths match your API implementation"
