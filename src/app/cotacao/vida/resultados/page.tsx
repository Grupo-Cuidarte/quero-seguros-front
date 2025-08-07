'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Heart, Star, Filter, ChevronDown, Check, Zap, Award, Users } from 'lucide-react'

interface Quote {
  id: string
  seguradora: string
  logo: string
  plano: string
  cobertura: number
  preco: number
  precoOriginal?: number
  desconto?: number
  rating: number
  beneficios: string[]
  destaque?: boolean
  premium?: boolean
}

const mockQuotes: Quote[] = [
  {
    id: '1',
    seguradora: 'SulAmérica',
    logo: '🛡️',
    plano: 'Vida Família Premium',
    cobertura: 300000,
    preco: 89.90,
    precoOriginal: 120.00,
    desconto: 25,
    rating: 4.8,
    beneficios: ['Morte acidental', 'Invalidez permanente', 'Doenças graves', 'Assistência funeral'],
    destaque: true,
    premium: true
  },
  {
    id: '2',
    seguradora: 'Porto Seguro',
    logo: '🔒',
    plano: 'Vida Protegida',
    cobertura: 250000,
    preco: 75.50,
    rating: 4.6,
    beneficios: ['Morte natural/acidental', 'Invalidez permanente', 'Assistência médica'],
    destaque: false
  },
  {
    id: '3',
    seguradora: 'Bradesco Seguros',
    logo: '🏦',
    plano: 'Vida Segura Total',
    cobertura: 400000,
    preco: 112.30,
    rating: 4.7,
    beneficios: ['Cobertura ampla', 'Doenças graves', 'Invalidez', 'Apoio psicológico'],
    premium: true
  },
  {
    id: '4',
    seguradora: 'Mapfre',
    logo: '🌟',
    plano: 'Vida Essential',
    cobertura: 200000,
    preco: 58.90,
    rating: 4.4,
    beneficios: ['Morte natural/acidental', 'Invalidez permanente', 'Assistência funeral']
  }
]

export default function ResultadosVidaPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes)
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('preco')
  const [filterCobertura, setFilterCobertura] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Simular carregamento
    setTimeout(() => {
      setQuotes(mockQuotes)
    }, 1000)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuote(quoteId)
    const selected = quotes.find(q => q.id === quoteId)
    if (selected) {
      localStorage.setItem('selected_vida_quote', JSON.stringify(selected))
      router.push('/cotacao/vida/dados')
    }
  }

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (sortBy === 'preco') return a.preco - b.preco
    if (sortBy === 'cobertura') return b.cobertura - a.cobertura
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const filteredQuotes = sortedQuotes.filter(quote => {
    if (filterCobertura === 'baixa' && quote.cobertura > 200000) return false
    if (filterCobertura === 'media' && (quote.cobertura < 200000 || quote.cobertura > 400000)) return false
    if (filterCobertura === 'alta' && quote.cobertura < 400000) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-green-100 rounded-full">
              <span className="text-green-600 text-sm font-medium font-inter">Seguro Vida - Resultados</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/vida/inicio')}
              className="flex items-center space-x-2 text-[#656D7A] hover:text-[#2A2F8D] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-inter">Nova Cotação</span>
            </button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-[#656D7A]" />
                  <span className="text-[#1D2129] font-medium font-inter">Olá, {user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-[#656D7A] hover:text-[#2A2F8D] border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] transition-colors font-inter"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="bg-[#2A2F8D] text-white px-6 py-2 rounded-lg hover:bg-[#1E2464] transition-colors font-medium font-inter"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-3xl mb-6">
            <Heart className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1D2129] mb-4 font-inter">
            Encontramos {filteredQuotes.length} Opções de Seguro Vida
          </h1>
          <p className="text-lg text-[#656D7A] font-inter">
            Compare e escolha a melhor proteção para sua família
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1D2129] font-inter">Filtros e Ordenação</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-[#2A2F8D] hover:text-[#1E2464] font-inter"
            >
              <Filter className="w-5 h-5" />
              <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Ordenar por:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                >
                  <option value="preco">Menor Preço</option>
                  <option value="cobertura">Maior Cobertura</option>
                  <option value="rating">Melhor Avaliação</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Cobertura:
                </label>
                <select
                  value={filterCobertura}
                  onChange={(e) => setFilterCobertura(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                >
                  <option value="">Todas</option>
                  <option value="baixa">Até R$ 200.000</option>
                  <option value="media">R$ 200.000 - R$ 400.000</option>
                  <option value="alta">Acima de R$ 400.000</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className={`bg-white rounded-2xl border transition-all duration-300 cursor-pointer ${
                quote.destaque
                  ? 'border-[#2A2F8D] ring-2 ring-[#2A2F8D]/20 shadow-xl'
                  : 'border-[#E9EDF2] hover:border-[#2A2F8D] hover:shadow-lg'
              }`}
              onClick={() => handleSelectQuote(quote.id)}
            >
              {/* Header do Card */}
              <div className="p-6 border-b border-[#E9EDF2] relative">
                {quote.destaque && (
                  <div className="absolute -top-3 left-6">
                    <div className="bg-gradient-to-r from-[#2A2F8D] to-[#00C2FF] text-white px-4 py-1 rounded-full text-sm font-medium font-inter">
                      <Star className="w-4 h-4 inline mr-1" />
                      Mais Escolhido
                    </div>
                  </div>
                )}
                
                {quote.premium && (
                  <div className="absolute top-4 right-4">
                    <Award className="w-6 h-6 text-[#FFD700]" />
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{quote.logo}</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1D2129] font-inter">{quote.seguradora}</h3>
                    <p className="text-[#656D7A] font-inter">{quote.plano}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(quote.rating)
                              ? 'text-[#FFD700] fill-current'
                              : 'text-[#E9EDF2]'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-[#656D7A] ml-2 font-inter">{quote.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cobertura e Preço */}
              <div className="p-6 border-b border-[#E9EDF2]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-[#656D7A] font-inter">Cobertura</p>
                    <p className="text-xl font-bold text-[#1D2129] font-inter">
                      R$ {quote.cobertura.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {quote.precoOriginal && (
                      <p className="text-sm text-[#656D7A] line-through font-inter">
                        R$ {quote.precoOriginal.toFixed(2)}/mês
                      </p>
                    )}
                    <p className="text-2xl font-bold text-[#00BA88] font-inter">
                      R$ {quote.preco.toFixed(2)}/mês
                    </p>
                    {quote.desconto && (
                      <p className="text-sm text-[#00BA88] font-medium font-inter">
                        {quote.desconto}% de desconto
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div className="p-6">
                <h4 className="font-semibold text-[#1D2129] mb-3 font-inter">Coberturas Incluídas:</h4>
                <div className="space-y-2">
                  {quote.beneficios.map((beneficio, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-[#00BA88]" />
                      <span className="text-sm text-[#656D7A] font-inter">{beneficio}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectQuote(quote.id)
                  }}
                  className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors font-inter ${
                    quote.destaque
                      ? 'bg-[#2A2F8D] text-white hover:bg-[#1E2464]'
                      : 'bg-[#F7F9FC] text-[#2A2F8D] border border-[#2A2F8D] hover:bg-[#2A2F8D] hover:text-white'
                  }`}
                >
                  {quote.destaque ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Escolher Este Plano</span>
                    </div>
                  ) : (
                    'Selecionar Plano'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bottom */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-br from-[#2A2F8D] to-[#1E2464] rounded-2xl p-8 text-white">
            <Users className="w-12 h-12 mx-auto mb-4 text-[#00C2FF]" />
            <h3 className="text-2xl font-bold mb-4 font-inter">Precisa de Ajuda?</h3>
            <p className="text-lg mb-6 text-white/90 font-inter">
              Nossos especialistas podem te ajudar a escolher a melhor opção
            </p>
            <button className="bg-[#00C2FF] text-white px-8 py-3 rounded-lg hover:bg-[#00A8CC] transition-colors font-semibold font-inter">
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
