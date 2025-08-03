// API Client for connecting to the ML repository FastAPI server

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-api-domain.com"
    : "http://localhost:8000";

export interface Song {
  id: string;
  name: string;
  artist: string;
  preview_url?: string;
  spotify_url: string;
}

export interface RandomSongsResponse {
  song_a: Song;
  song_b: Song;
  session_id: string;
}

export interface RatingRequest {
  song_a_id: string;
  song_b_id: string;
  user_rating: number; // 1-10 scale
  model_prediction?: number;
  session_id: string;
  timestamp?: string;
  user_agent?: string;
  source?: string;
}

export interface RatingResponse {
  success: boolean;
  message: string;
  rating_id?: string;
  model_prediction?: number;
}

export interface ApiStats {
  total_ratings_json: number;
  total_ratings_database: number;
  total_ratings_combined: number;
  total_tracks: number;
  model_loaded: boolean;
  api_version: string;
  timestamp: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get random songs for rating
  async getRandomSongs(): Promise<RandomSongsResponse> {
    return this.request<RandomSongsResponse>("/api/songs/random");
  }

  // Submit a song rating
  async submitRating(rating: RatingRequest): Promise<RatingResponse> {
    const requestBody = {
      ...rating,
      timestamp: rating.timestamp || new Date().toISOString(),
      user_agent: rating.user_agent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'),
      source: rating.source || "web_interface",
    };

    return this.request<RatingResponse>("/api/ratings", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  }

  // Get API statistics
  async getStats(): Promise<ApiStats> {
    return this.request<ApiStats>("/api/stats");
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>("/");
  }
}

export const apiClient = new ApiClient();
