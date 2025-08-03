# Copilot Instructions for Spotify Song Rating Web App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js web application for collecting public song ratings to improve a music recommendation ML model.

## Project Context

- **Purpose**: Allow users to rate song compatibility (1-10 scale) for playlist creation
- **Goal**: Collect public ratings to improve the spotify-song-recommender ML model
- **Deployment**: Vercel with database integration

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL/SQLite for storing ratings
- **Audio**: Embedded Spotify players for song previews

## Key Features to Implement

1. **Song Rating Interface**: Display two random songs with embedded players
2. **Rating Collection**: 1-10 scale rating with data persistence
3. **API Endpoints**:
   - GET /api/songs/random - Fetch two random songs
   - POST /api/ratings - Store user ratings
4. **Database Schema**: Store ratings with song IDs and compatibility scores
5. **Responsive Design**: Mobile-friendly interface for maximum reach

## Code Guidelines

- Use TypeScript for all components and API routes
- Implement proper error handling for Spotify API integration
- Use Tailwind CSS for responsive, clean UI design
- Follow Next.js App Router conventions
- Ensure database operations are secure and efficient
- Include loading states and user feedback

## Integration Notes

- Ratings data should be exportable to merge with main project's human_ratings.json
- Song data should come from the main project's database or API
- Consider rate limiting to prevent spam ratings
