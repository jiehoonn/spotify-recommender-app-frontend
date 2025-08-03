export interface Song {
  id: string
  spotifyId: string
  name: string
  artist: string
  album?: string
  previewUrl?: string
  duration?: number
  popularity?: number
}
