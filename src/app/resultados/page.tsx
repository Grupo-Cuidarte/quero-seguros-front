'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuoteStore } from '@/lib/store'
import { Star, Shield, CheckCircle, ExternalLink, Bookmark, Filter, ArrowLeft } from 'lucide-react'

// Mock data para demonstração
const mockQuotes = [
  {
    id: '1',
    insuranceName: 'Plano Família Premium',
    companyName: 'Bradesco Saúde',
    companyLogo: '/companies/bradesco.png',
    price: 289.90,
    originalPrice: 350.00,
    rating: 4.8,
    isRecommended: true,
    coverage: [
      'Consultas ilimitadas',
      'Exames laboratoriais',
      'Internação hospitalar',
      'UTI'
    ],
    highlights: [
      'Rede com +15.000 médicos',
      'Atendimento 24h',
      'App exclusivo'
    ],
    affiliateLink: 'https://partner.bradesco.com.br?ref=quero-seguros'
  },
  {
    id: '2',
    insuranceName: 'Saúde Essencial',
    companyName: 'SulAmérica',
    companyLogo: '/companies/sulamerica.png',
    price: 245.50,
    originalPrice: 280.00,
    rating: 4.6,
    isRecommended: false,
    coverage: [
      'Consultas médicas',
      'Exames básicos',
      'Internação hospitalar'
    ],
    highlights: [
      'Melhor custo-benefício',
      'Rede nacional',
      'Telemedicina inclusa'
    ],
    affiliateLink: 'https://partner.sulamerica.com.br?ref=quero-seguros'
  },
  {
    id: '3',
    insuranceName: 'Premium Care',
    companyName: 'Unimed',
    companyLogo: '/companies/unimed.png',
    price: 425.00,
    originalPrice: 480.00,
    rating: 4.9,
    isRecommended: false,
    coverage: [
      'Cobertura completa',
      'Medicina preventiva',
      'Internação em quarto privativo',
      'Home care'
    ],
    highlights: [
      'Cobertura premium',
      'Hospitais de referência',
      'Medicina preventiva'
    ],
    affiliateLink: 'https://partner.unimed.com.br?ref=quero-seguros'
  }
]

export default function ResultadosPage() {
  const router = useRouter()
  const { formData, setQuotes, selectQuote } = useQuoteStore()
  const [filter, setFilter] = useState('recommended')
  const [savedQuotes, setSavedQuotes] = useState<string[]>([])
  const [sortedQuotes, setSortedQuotes] = useState(mockQuotes)

  useEffect(() => {
    // Simula carregamento dos resultados
    setQuotes(mockQuotes as any)
  }, [setQuotes])

  useEffect(() => {
    // Aplica filtros e ordenação
    let filtered = [...mockQuotes]
    
    switch (filter) {
      case 'cheapest':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'recommended':
      default:
        filtered.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1
          if (!a.isRecommended && b.isRecommended) return 1
          return b.rating - a.rating
        })
    }
    
    setSortedQuotes(filtered)
  }, [filter])

  const handleSaveQuote = (quoteId: string) => {
    if (savedQuotes.includes(quoteId)) {
      setSavedQuotes(savedQuotes.filter(id => id !== quoteId))
    } else {
      setSavedQuotes([...savedQuotes, quoteId])
    }
  }

  const handleContractQuote = (quote: any) => {
    selectQuote(quote)
    // Redireciona para o link de afiliação
    window.open(quote.affiliateLink, '_blank')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (!formData.personalData.name) {
    router.push('/cotacao')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Quero Seguros</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Olá, {formData.personalData.name?.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Encontramos {sortedQuotes.length} opções para você!
          </h1>
          <p className="text-gray-600">
            Baseado no seu perfil em {formData.locationData?.city}, {formData.locationData?.state}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar com filtros */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Filtros</h3>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    value="recommended"
                    checked={filter === 'recommended'}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Recomendado para você</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    value="cheapest"
                    checked={filter === 'cheapest'}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Menor preço</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    value="rating"
                    checked={filter === 'rating'}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Melhor avaliado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Lista de cotações */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {sortedQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                    quote.isRecommended ? 'border-blue-200 ring-2 ring-blue-100' : 'border-gray-200'
                  }`}
                >
                  {quote.isRecommended && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-t-xl">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        <span className="text-sm font-semibold">Recomendado para Você</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Shield className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {quote.insuranceName}
                          </h3>
                          <p className="text-gray-600">{quote.companyName}</p>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {[...Array(Math.floor(quote.rating))].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              {quote.rating} ({Math.floor(Math.random() * 1000) + 500} avaliações)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {quote.originalPrice > quote.price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(quote.originalPrice)}
                          </p>
                        )}
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(quote.price)}
                        </p>
                        <p className="text-sm text-gray-600">por mês</p>
                      </div>
                    </div>

                    {/* Cobertura */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Cobertura:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {quote.coverage.map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Destaques:</h4>
                      <div className="flex flex-wrap gap-2">
                        {quote.highlights.map((highlight, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleContractQuote(quote)}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Contratar Agora
                      </button>
                      
                      <button
                        onClick={() => handleSaveQuote(quote.id)}
                        className={`px-4 py-3 rounded-lg border transition-colors ${
                          savedQuotes.includes(quote.id)
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${savedQuotes.includes(quote.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA para não encontrou o que procurava */}
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Não encontrou o que procurava?
              </h3>
              <p className="text-gray-600 mb-4">
                Nossa equipe pode te ajudar a encontrar opções personalizadas.
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border border-blue-200 hover:bg-blue-50 transition-colors">
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
