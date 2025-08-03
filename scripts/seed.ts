/**
 * Seed script to populate the database with sample songs
 * This will be used to test the rating interface
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample songs for testing (these would come from your main project's database)
const sampleSongs = [
  {
    spotifyId: '7qiZfU4dY1lWllzX7mkmXr',
    name: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Deluxe)',
    previewUrl: 'https://p.scdn.co/mp3-preview/c6f756b20eb35b6ac4b9e3bf939acb3f52d33ff1',
    duration: 233713,
    popularity: 87,
  },
  {
    spotifyId: '4VqPOruhp5EdPBeR92t6lQ',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    previewUrl: 'https://p.scdn.co/mp3-preview/56b5b2b4c8a6b8c9b2b4c8a6b8c9b2b4c8a6b8c9',
    duration: 200040,
    popularity: 88,
  },
  {
    spotifyId: '2plbrEY59IikOBgBGLjaoe',
    name: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    previewUrl: 'https://p.scdn.co/mp3-preview/56b5b2b4c8a6b8c9b2b4c8a6b8c9b2b4c8a6b8c9',
    duration: 203064,
    popularity: 85,
  },
  {
    spotifyId: '0VjIjW4GlUZAMYd2vXMi3b',
    name: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    previewUrl: 'https://p.scdn.co/mp3-preview/56b5b2b4c8a6b8c9b2b4c8a6b8c9b2b4c8a6b8c9',
    duration: 174000,
    popularity: 84,
  },
  {
    spotifyId: '1r9xUipOqoNwggBpENDsvJ',
    name: 'good 4 u',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    previewUrl: 'https://p.scdn.co/mp3-preview/56b5b2b4c8a6b8c9b2b4c8a6b8c9b2b4c8a6b8c9',
    duration: 178147,
    popularity: 83,
  },
  {
    spotifyId: '7ytR5pFWmSjzHJIeQkgog4',
    name: 'INDUSTRY BABY',
    artist: 'Lil Nas X',
    album: 'MONTERO',
    previewUrl: 'https://p.scdn.co/mp3-preview/56b5b2b4c8a6b8c9b2b4c8a6b8c9b2b4c8a6b8c9',
    duration: 212000,
    popularity: 86,
  },
  {
    spotifyId: '4kV4N9D1iKVxx1KLvtTpjS',
    name: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    previewUrl: 'https://p.scdn.co/mp3-preview/56b5b2b4c8a6b8c9b2b4c8a6b8c9b2b4c8a6b8c9',
    duration: 238805,
    popularity: 82,
  },
  {
    spotifyId: '1mWdTewIgB3gtBM3TOSFhB',
    name: 'Shivers',
    artist: 'Ed Sheeran',
    album: '= (Equals)',
    previewUrl: 'https://p.scdn.co/mp3-preview/56b5b2b4c8a6b8c9b2b4c8a6b8c9b2b4c8a6b8c9',
    duration: 207835,
    popularity: 81,
  },
  {
    spotifyId: '0lYBSQXN6rCTvUZvg9S0lU',
    name: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'Stay',
    previewUrl: 'https://p.scdn.co/mp3-preview/56b5b2b4c8a6b8c9b2b4c8a6b8c9b2b4c8a6b8c9',
    duration: 141806,
    popularity: 89,
  },
  {
    spotifyId: '5ChkMS8OtdzJeqyybCc9R5',
    name: 'Lucid Dreams',
    artist: 'Juice WRLD',
    album: 'Goodbye & Good Riddance',
    previewUrl: 'https://p.scdn.co/mp3-preview/56b5b2b4c8a6b8c9b2b4c8a6b8c9b2b4c8a6b8c9',
    duration: 239836,
    popularity: 80,
  },
]

async function seed() {
  console.log('🌱 Seeding database with sample songs...')

  try {
    // Clear existing songs
    await prisma.rating.deleteMany()
    await prisma.song.deleteMany()
    console.log('📝 Cleared existing data')

    // Insert sample songs
    for (const songData of sampleSongs) {
      await prisma.song.create({
        data: songData,
      })
    }

    console.log(`✅ Successfully seeded ${sampleSongs.length} songs`)
    console.log('🎵 Sample songs include:')
    sampleSongs.forEach((song, index) => {
      console.log(`   ${index + 1}. "${song.name}" by ${song.artist}`)
    })

    console.log('\n🚀 Database is ready! You can now test the rating interface.')
    console.log('💡 To add songs from your main project, update the sampleSongs array with real data.')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seed()
  .catch((error) => {
    console.error('❌ Seed script failed:', error)
    process.exit(1)
  })
