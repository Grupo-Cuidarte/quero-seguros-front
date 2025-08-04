'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error during auth callback:', error)
          router.push('/?error=auth_error')
          return
        }

        if (data.session) {
          // Usuário autenticado com sucesso
          router.push('/minhas-cotacoes')
        } else {
          // Sem sessão, redireciona para home
          router.push('/')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        router.push('/?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Finalizando autenticação...</p>
      </div>
    </div>
  )
}
