export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      group_players: {
        Row: {
          id: string
          group_id: string
          player_id: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          player_id: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          player_id?: string
          created_at?: string
        }
      }
      active_players: {
        Row: {
          id: string
          user_id: string
          player_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          player_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          player_id?: string
          created_at?: string
        }
      }
    }
  }
}
