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
          match_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color: string
          match_type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          match_type?: string
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
      sub_pages: {
        Row: {
          id: string
          group_id: string
          name: string
          date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          name: string
          date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          name?: string
          date?: string | null
          created_at?: string
        }
      }
      sub_page_players: {
        Row: {
          id: string
          sub_page_id: string
          player_id: string
          created_at: string
        }
        Insert: {
          id?: string
          sub_page_id: string
          player_id: string
          created_at?: string
        }
        Update: {
          id?: string
          sub_page_id?: string
          player_id?: string
          created_at?: string
        }
      }
    }
  }
}
