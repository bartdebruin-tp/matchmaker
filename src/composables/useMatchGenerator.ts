import { ref } from 'vue'
import type { Match, Team, Player } from '@/types'

export function useMatchGenerator() {
  const matches = ref<Match[]>([])

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  function generateMatches(players: Player[]): Match[] {
    if (players.length < 4) {
      return []
    }

    const shuffledPlayers = shuffleArray(players)
    const newMatches: Match[] = []

    for (let i = 0; i < shuffledPlayers.length; i += 4) {
      if (i + 3 < shuffledPlayers.length) {
        const team1: Team = {
          id: crypto.randomUUID(),
          player1Id: shuffledPlayers[i].id,
          player2Id: shuffledPlayers[i + 1].id
        }

        const team2: Team = {
          id: crypto.randomUUID(),
          player1Id: shuffledPlayers[i + 2].id,
          player2Id: shuffledPlayers[i + 3].id
        }

        const match: Match = {
          id: crypto.randomUUID(),
          team1,
          team2,
          createdAt: Date.now()
        }

        newMatches.push(match)
      }
    }

    matches.value = newMatches
    return newMatches
  }

  function clearMatches(): void {
    matches.value = []
  }

  return {
    matches,
    generateMatches,
    clearMatches
  }
}
