import { useState, useEffect } from "react";
import {
  apiClient,
  RandomSongsResponse,
  RatingRequest,
  RatingResponse,
  ApiStats,
} from "@/lib/api-client";

export function useRandomSongs() {
  const [songs, setSongs] = useState<RandomSongsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomSongs = async () => {
    console.log('🔍 [useRandomSongs] Starting fetch request...');
    setLoading(true);
    setError(null);

    try {
      console.log('🌐 [useRandomSongs] Calling apiClient.getRandomSongs()...');
      const response = await apiClient.getRandomSongs();
      console.log('✅ [useRandomSongs] Success! Response:', response);
      setSongs(response);
    } catch (err) {
      console.error('❌ [useRandomSongs] Error:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch songs";
      console.error('❌ [useRandomSongs] Error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('🏁 [useRandomSongs] Fetch completed');
    }
  };

  useEffect(() => {
    fetchRandomSongs();
  }, []);

  return {
    songs,
    loading,
    error,
    refetch: fetchRandomSongs,
  };
}

export function useSubmitRating() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRating = async (
    rating: RatingRequest
  ): Promise<RatingResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.submitRating(rating);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitRating,
    loading,
    error,
  };
}

export function useApiStats() {
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getStats();
      setStats(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export function useHealthCheck() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.healthCheck();
      setIsHealthy(response.status === "healthy");
    } catch (err) {
      setIsHealthy(false);
      setError(err instanceof Error ? err.message : "Health check failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return {
    isHealthy,
    loading,
    error,
    refetch: checkHealth,
  };
}
