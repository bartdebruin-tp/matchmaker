// Global type definitions for the MatchMaker app

export interface Player {
  id: string
  name: string
  createdAt: number
}

export interface Group {
  id: string
  name: string
  color: string
  playerIds: string[]
  matchType: 'random' | 'scheduled'
  createdAt: number
}

export interface SubPage {
  id: string
  groupId: string
  name: string
  date?: number
  presentPlayerIds: string[]
  createdAt: number
}

export interface Team {
  id: string
  player1Id: string
  player2Id: string
}

export interface Match {
  id: string
  team1: Team
  team2: Team
  createdAt: number
}

export interface AppData {
  players: Player[]
  groups: Group[]
  activePlayerIds: string[]
}