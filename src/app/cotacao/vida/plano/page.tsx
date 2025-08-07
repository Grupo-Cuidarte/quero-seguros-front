'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Heart, Check, X, Info, CreditCard, DollarSign, Star, Users, Phone } from 'lucide-react'

interface Quote {
  id: string
  seguradora: string
  plano: string
  cobertura: number
  preco: number
}

interface CoverageOption {
  id: string
  nome: string
  descricao: string
  incluido: boolean
  preco?: number
}

const coverageOptions: CoverageOption[] = [
  {
    id: 'morte-natural',
    nome: 'Morte Natural',
    descricao: 'Cobertura em caso de morte por causas naturais',
    incluido: true
  },
  {
    id: 'morte-acidental',
    nome: 'Morte Acidental',
    descricao: 'Cobertura ampliada para acidentes',
    incluido: true
  },
  {
    id: 'invalidez-permanente',
    nome: 'Invalidez Permanente',
    descricao: 'Indenização em caso de invalidez permanente',
    incluido: true
  },
  {
    id: 'doencas-graves',
    nome: 'Doenças Graves',
    descricao: 'Antecipação do seguro para doenças graves',
    incluido: true
  },
  {
    id: 'assistencia-funeral',
    nome: 'Assistência Funeral',
    descricao: 'Serviços funerários completos',
    incluido: true
  },
  {
    id: 'cobertura-conjugue',
    nome: 'Cobertura do Cônjuge',
    descricao: 'Proteção estendida para o cônjuge',
    incluido: false,
    preco: 25.90
  },
  {
    id: 'cobertura-filhos',
    nome: 'Cobertura dos Filhos',
    descricao: 'Proteção para filhos até 24 anos',
    incluido: false,
    preco: 18.50
  },
  {
    id: 'renda-temporaria',
    nome: 'Renda Temporária',
    descricao: 'Pagamento mensal por 24 meses',
    incluido: false,
    preco: 35.00
  }
]

export default function PlanoVidaPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [selectedCoverages, setSelectedCoverages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedQuote = localStorage.getItem('selected_vida_quote')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedQuote) {
      setSelectedQuote(JSON.parse(savedQuote))
    } else {
      router.push('/cotacao/vida/resultados')
    }

    // Inicializar com coberturas incluídas
    const includedCoverages = coverageOptions
      .filter(option => option.incluido)
      .map(option => option.id)
    setSelectedCoverages(includedCoverages)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const toggleCoverage = (coverageId: string) => {
    const coverage = coverageOptions.find(opt => opt.id === coverageId)
    if (coverage?.incluido) return // Não pode desmarcar coberturas incluídas

    setSelectedCoverages(prev => 
      prev.includes(coverageId)
        ? prev.filter(id => id !== coverageId)
        : [...prev, coverageId]
    )
  }

  const calculateTotalPrice = () => {
    if (!selectedQuote) return 0
    
    const additionalPrice = selectedCoverages
      .map(id => coverageOptions.find(opt => opt.id === id))
      .filter(opt => opt && !opt.incluido)
      .reduce((sum, opt) => sum + (opt?.preco || 0), 0)
    
    return selectedQuote.preco + additionalPrice
  }

  const handleContinue = async () => {
    setIsSubmitting(true)

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Salvar configuração do plano
      const planConfig = {
        quote: selectedQuote,
        selectedCoverages,
        totalPrice: calculateTotalPrice()
      }
      
      localStorage.setItem('cotacao_vida_plan_config', JSON.stringify(planConfig))
      
      // Redirecionar para pagamento
      router.push('/cotacao/vida/pagamento')
    } catch (error) {
      console.error('Erro ao processar plano:', error)
      alert('Erro ao processar o plano. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedQuote) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A2F8D] mx-auto mb-4"></div>
          <p className="text-[#656D7A] font-inter">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-green-100 rounded-full">
              <span className="text-green-600 text-sm font-medium font-inter">Seguro Vida - Plano</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/vida/dados')}
              className="flex items-center space-x-2 text-[#656D7A] hover:text-[#2A2F8D] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-inter">Voltar</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-3xl mb-6">
                <Heart className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-[#1D2129] mb-4 font-inter">
                Personalize Sua Proteção
              </h1>
              <p className="text-lg text-[#656D7A] font-inter">
                Ajuste as coberturas conforme suas necessidades
              </p>
            </div>

            {/* Informações do Plano Selecionado */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8 mb-8">
              <h2 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Plano Selecionado</h2>
              
              <div className="bg-gradient-to-r from-[#2A2F8D] to-[#1E2464] rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-inter">{selectedQuote.seguradora}</h3>
                    <p className="text-white/90 font-inter">{selectedQuote.plano}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/90 font-inter">Cobertura</p>
                    <p className="text-2xl font-bold font-inter">R$ {selectedQuote.cobertura.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Star className="w-5 h-5 text-[#FFD700] fill-current" />
                  <span className="font-inter">Plano Premium com cobertura ampla</span>
                </div>
              </div>
            </div>

            {/* Opções de Cobertura */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h2 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Coberturas Disponíveis</h2>
              
              <div className="space-y-4">
                {coverageOptions.map((option) => {
                  const isSelected = selectedCoverages.includes(option.id)
                  const isRequired = option.incluido
                  
                  return (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-6 transition-all duration-300 ${
                        isRequired
                          ? 'border-[#00BA88] bg-[#F0FDF4]'
                          : isSelected
                          ? 'border-[#2A2F8D] bg-[#F8FAFF]'
                          : 'border-[#E9EDF2] hover:border-[#2A2F8D]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`mt-1 ${isRequired ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <div
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? isRequired
                                    ? 'bg-[#00BA88] border-[#00BA88]'
                                    : 'bg-[#2A2F8D] border-[#2A2F8D]'
                                  : 'border-[#E9EDF2] hover:border-[#2A2F8D]'
                              }`}
                              onClick={() => !isRequired && toggleCoverage(option.id)}
                            >
                              {isSelected && <Check className="w-4 h-4 text-white" />}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-[#1D2129] font-inter">{option.nome}</h3>
                              {isRequired && (
                                <span className="px-2 py-1 bg-[#00BA88] text-white text-xs rounded-full font-inter">
                                  Incluído
                                </span>
                              )}
                            </div>
                            <p className="text-[#656D7A] text-sm font-inter">{option.descricao}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {option.preco ? (
                            <p className="font-bold text-[#1D2129] font-inter">
                              +R$ {option.preco.toFixed(2)}/mês
                            </p>
                          ) : (
                            <p className="text-[#00BA88] font-medium font-inter">Incluído</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 p-6 bg-[#F0F8FF] border border-[#87CEEB] rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="w-6 h-6 text-[#2C5282] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#2C5282] mb-2 font-inter">Informações Importantes</h4>
                    <ul className="text-sm text-[#2C5282] space-y-1 font-inter">
                      <li>• As coberturas básicas estão sempre incluídas no plano</li>
                      <li>• Coberturas adicionais podem ser removidas a qualquer momento</li>
                      <li>• Carência de 24 meses para doenças preexistentes</li>
                      <li>• Cobertura válida em todo território nacional</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo Lateral */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 sticky top-6">
              <h3 className="text-lg font-bold text-[#1D2129] mb-6 font-inter">Resumo do Plano</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[#656D7A] font-inter">Plano Base:</span>
                  <span className="font-medium text-[#1D2129] font-inter">
                    R$ {selectedQuote.preco.toFixed(2)}
                  </span>
                </div>
                
                {selectedCoverages
                  .map(id => coverageOptions.find(opt => opt.id === id))
                  .filter(opt => opt && !opt.incluido)
                  .map(option => (
                    <div key={option!.id} className="flex items-center justify-between">
                      <span className="text-[#656D7A] text-sm font-inter">{option!.nome}:</span>
                      <span className="text-sm text-[#1D2129] font-inter">
                        +R$ {option!.preco!.toFixed(2)}
                      </span>
                    </div>
                  ))}
                
                <div className="border-t border-[#E9EDF2] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1D2129] font-inter">Total Mensal:</span>
                    <span className="text-2xl font-bold text-[#00BA88] font-inter">
                      R$ {calculateTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#00BA88]" />
                  <span className="text-sm text-[#656D7A] font-inter">Proteção garantida</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-[#00BA88]" />
                  <span className="text-sm text-[#656D7A] font-inter">Cobertura familiar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-[#00BA88]" />
                  <span className="text-sm text-[#656D7A] font-inter">Suporte 24h</span>
                </div>
              </div>
              
              <button
                onClick={handleContinue}
                disabled={isSubmitting}
                className="w-full bg-[#2A2F8D] text-white py-4 rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold font-inter"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Ir para Pagamento</span>
                  </>
                )}
              </button>
              
              <p className="text-xs text-[#656D7A] text-center mt-3 font-inter">
                Próximo passo: dados de pagamento e finalização
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
