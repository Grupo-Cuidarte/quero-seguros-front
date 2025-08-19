'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import AuthModal from '@/components/AuthModal'
import { Shield, Bookmark, Calendar, ExternalLink, Trash2 } from 'lucide-react'

export default function MinhasCotacoesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [savedQuotes, setSavedQuotes] = useState<any[]>([])

  // Mock data - em produção viria do Supabase
  const mockSavedQuotes = [
    {
      id: '1',
      insuranceName: 'Plano Família Premium',
      companyName: 'Bradesco Saúde',
      price: 289.90,
      savedAt: new Date('2025-01-01'),
      expiresAt: new Date('2025-01-15'),
      affiliateLink: 'https://partner.bradesco.com.br?ref=quero-seguros'
    },
    {
      id: '2',
      insuranceName: 'Saúde Essencial',
      companyName: 'SulAmérica',
      price: 245.50,
      savedAt: new Date('2024-12-28'),
      expiresAt: new Date('2025-01-12'),
      affiliateLink: 'https://partner.sulamerica.com.br?ref=quero-seguros'
    }
  ]

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true)
    } else if (user) {
      setSavedQuotes(mockSavedQuotes)
    }
  }, [user, loading])

  const handleDeleteQuote = (quoteId: string) => {
    setSavedQuotes(savedQuotes.filter(q => q.id !== quoteId))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const isExpiringSoon = (expiresAt: Date) => {
    const now = new Date()
    const diffTime = expiresAt.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Quero Seguros</span>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Olá, {user.name || user.email}</span>
                <button
                  onClick={() => router.push('/')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Nova Cotação
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Cotações</h1>
          <p className="text-gray-600">
            Gerencie suas cotações salvas e acompanhe prazos de validade.
          </p>
        </div>

        {savedQuotes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma cotação salva
            </h3>
            <p className="text-gray-600 mb-6">
              Você ainda não salvou nenhuma cotação. Que tal fazer uma nova?
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Fazer Nova Cotação
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedQuotes.map((quote) => (
              <div
                key={quote.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${
                  isExpiringSoon(quote.expiresAt) 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">
                        {quote.insuranceName}
                      </h3>
                      {isExpiringSoon(quote.expiresAt) && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          Expira em breve
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{quote.companyName}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Salvo em {formatDate(quote.savedAt)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Válido até {formatDate(quote.expiresAt)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      {formatPrice(quote.price)}
                    </p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(quote.affiliateLink, '_blank')}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Contratar
                      </button>
                      
                      <button
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remover cotação"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
