import { createClient } from '@supabase/supabase-js'

// Mock values for development - replace with real values when needed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-development'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      quotes: {
        Row: {
          id: string
          user_id: string | null
          insurance_type: string
          personal_data: any
          vehicle_data: any | null
          property_data: any | null
          location_data: any
          results: any
          status: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          insurance_type: string
          personal_data: any
          vehicle_data?: any | null
          property_data?: any | null
          location_data: any
          results: any
          status?: string
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          user_id?: string | null
          insurance_type?: string
          personal_data?: any
          vehicle_data?: any | null
          property_data?: any | null
          location_data?: any
          results?: any
          status?: string
          created_at?: string
          expires_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          cpf: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          cpf?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          cpf?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}