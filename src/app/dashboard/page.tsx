'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, User, LogOut, Car, Heart, Home, RefreshCw, ExternalLink, BookOpen, TrendingUp, Calendar, Award, Phone, AlertCircle, Star, Gift, Zap, UserPlus, Clock, Headphones } from 'lucide-react'

interface UserData {
  name: string
  email: string
}

interface ContractedInsurance {
  id: string
  type: 'auto' | 'saude' | 'vida' | 'residencial'
  companyLogo: string
  companyName: string
  planName: string
  contractDate: string
  quotedPrice: number
  icon: any
}

const mockContractedInsurances: ContractedInsurance[] = [
  {
    id: '1',
    type: 'auto',
    companyLogo: '/logos/porto-seguro.png',
    companyName: 'Porto Seguro',
    planName: 'Auto Conectado Plus',
    contractDate: '2024-03-15',
    quotedPrice: 1250.00,
    icon: Car
  },
  {
    id: '2',
    type: 'saude',
    companyLogo: '/logos/unimed.png',
    companyName: 'Unimed',
    planName: 'Plano Família Premium',
    contractDate: '2024-01-20',
    quotedPrice: 850.00,
    icon: Heart
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [contractedInsurances] = useState(mockContractedInsurances)

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')
      
      if (!savedUser || !savedToken) {
        router.push('/login')
        return
      }
      
      setUser(JSON.parse(savedUser))
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const calculateCoverageIndex = () => {
    let points = 0
    contractedInsurances.forEach(insurance => {
      switch (insurance.type) {
        case 'auto':
          points += 250
          break
        case 'saude':
          points += 200
          break
        case 'vida':
          points += 300
          break
        case 'residencial':
          points += 150
          break
      }
    })
    return Math.min(points, 1000) // Máximo 1000 pontos
  }

  const getCoverageLevel = (points: number) => {
    if (points >= 800) return { level: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (points >= 500) return { level: 'Boa', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (points >= 200) return { level: 'Básica', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { level: 'Iniciante', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleQuoteAgain = (insurance: ContractedInsurance) => {
    router.push(`/cotacao/${insurance.type}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A2F8D]"></div>
          <span className="text-[#656D7A] font-inter">Carregando...</span>
        </div>
      </div>
    )
  }

  const coveragePoints = calculateCoverageIndex()
  const coverageLevel = getCoverageLevel(coveragePoints)
  const progressPercentage = (coveragePoints / 1000) * 100

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header Expandido com Serviços e Dicas */}
      <header className="bg-white border-b border-gray-100">
        {/* Barra Superior Principal */}
        <div className="border-b border-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="text-[#2A2F8D] w-8 h-8" />
              <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
              <div className="ml-4 px-3 py-1 bg-[#00C2FF]/10 rounded-full">
                <span className="text-[#00C2FF] text-sm font-medium font-inter">Hub Premium</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-[#656D7A]" />
                <span className="text-[#1D2129] font-medium font-inter">Olá, {user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-[#656D7A] hover:text-[#2A2F8D] border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] transition-colors font-inter"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Serviços e Benefícios */}
        <div className="py-6 bg-gradient-to-r from-[#F7F9FC] to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Serviços Rápidos */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-[#1D2129] mb-4 font-inter flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-[#2A2F8D]" />
                  Serviços Disponíveis
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => router.push('/cotacao/auto')}
                    className="flex items-center space-x-2 p-3 bg-white border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] hover:bg-[#F7F9FC] transition-colors"
                  >
                    <Car className="w-4 h-4 text-[#2A2F8D]" />
                    <span className="text-sm font-medium text-[#1D2129] font-inter">Seguro Auto</span>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/cotacao/saude')}
                    className="flex items-center space-x-2 p-3 bg-white border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] hover:bg-[#F7F9FC] transition-colors"
                  >
                    <Heart className="w-4 h-4 text-[#2A2F8D]" />
                    <span className="text-sm font-medium text-[#1D2129] font-inter">Plano Saúde</span>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/sinistro')}
                    className="flex items-center space-x-2 p-3 bg-white border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] hover:bg-[#F7F9FC] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#2A2F8D]" />
                    <span className="text-sm font-medium text-[#1D2129] font-inter">Sinistro 24h</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 p-3 bg-white border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] hover:bg-[#F7F9FC] transition-colors">
                    <Headphones className="w-4 h-4 text-[#2A2F8D]" />
                    <span className="text-sm font-medium text-[#1D2129] font-inter">Suporte</span>
                  </button>
                </div>
              </div>

              {/* Dica do Dia */}
              <div className="bg-gradient-to-br from-[#2A2F8D] to-[#1E2464] rounded-xl p-6 text-white">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="w-5 h-5 text-[#00C2FF]" />
                  <h3 className="font-bold font-inter">Dica do Dia</h3>
                </div>
                <p className="text-sm text-white/90 font-inter leading-relaxed">
                  💡 Renove seu seguro auto 30 dias antes do vencimento e ganhe até <strong>15% de desconto</strong> por fidelidade!
                </p>
                <button className="mt-3 text-xs text-[#00C2FF] hover:text-white font-medium font-inter underline">
                  Ver mais dicas
                </button>
              </div>

              {/* CTA para Convidar Amigos */}
              <div className="bg-gradient-to-br from-[#00C2FF] to-[#0099CC] rounded-xl p-6 text-white">
                <div className="flex items-center space-x-2 mb-3">
                  <Gift className="w-5 h-5 text-white" />
                  <h3 className="font-bold font-inter">Indique & Ganhe</h3>
                </div>
                <p className="text-sm text-white/90 font-inter leading-relaxed mb-3">
                  Convide amigos e ganhe <strong>R$ 50</strong> a cada indicação que contratar!
                </p>
                <button className="flex items-center space-x-2 bg-white text-[#00C2FF] px-4 py-2 rounded-lg text-sm font-medium font-inter hover:bg-gray-50 transition-colors">
                  <UserPlus className="w-4 h-4" />
                  <span>Convidar Agora</span>
                </button>
              </div>
            </div>

            {/* Barra de Status/Benefícios */}
            <div className="mt-6 flex flex-wrap items-center justify-between bg-white rounded-lg border border-[#E9EDF2] p-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#00BA88]" />
                  <span className="text-sm font-inter text-[#656D7A]">
                    <strong className="text-[#00BA88]">Atendimento 24h</strong> - Sempre disponível
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#2A2F8D]" />
                  <span className="text-sm font-inter text-[#656D7A]">
                    <strong className="text-[#2A2F8D]">{contractedInsurances.length} seguros</strong> ativos
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-sm font-inter text-[#656D7A]">
                    <strong className="text-[#FFD700]">{coveragePoints} pontos</strong> de proteção
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-[#656D7A] font-inter">Precisa de algo?</span>
                <button className="flex items-center space-x-2 bg-[#2A2F8D] text-white px-4 py-2 rounded-lg text-sm font-medium font-inter hover:bg-[#1E2464] transition-colors">
                  <Headphones className="w-4 h-4" />
                  <span>Falar com Especialista</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Título da Página */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-[#1D2129] mb-2 font-inter">Meu Hub de Proteção</h2>
          <p className="text-xl text-[#656D7A] font-inter">Acompanhe seu histórico e encontre novas oportunidades de economia</p>
        </div>

        {/* CTA para Completar Cadastro */}
        <div className="mb-8 bg-gradient-to-r from-[#2A2F8D] via-[#00C2FF] to-[#2A2F8D] p-[2px] rounded-2xl">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2A2F8D] to-[#00C2FF] rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1D2129] font-inter">Complete seu perfil agora!</h3>
                    <p className="text-[#656D7A] font-inter">É bem rapidinho - apenas 2 minutos ⚡</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-4 bg-[#F7F9FC] rounded-lg border border-[#E9EDF2]">
                    <div className="w-8 h-8 bg-[#00BA88] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1D2129] font-inter">Dados Pessoais</h4>
                      <p className="text-sm text-[#656D7A] font-inter">CPF, telefone, endereço</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-[#F7F9FC] rounded-lg border border-[#E9EDF2]">
                    <div className="w-8 h-8 bg-[#00BA88] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1D2129] font-inter">Preferências</h4>
                      <p className="text-sm text-[#656D7A] font-inter">Tipos de seguro, orçamento</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-[#F7F9FC] rounded-lg border border-[#E9EDF2]">
                    <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1D2129] font-inter">Benefícios</h4>
                      <p className="text-sm text-[#656D7A] font-inter">Descontos exclusivos</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-[#FFD700]" />
                      <span className="text-sm font-inter text-[#656D7A]">
                        <strong className="text-[#1D2129]">+15% desconto</strong> em todas as cotações
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-[#00BA88]" />
                      <span className="text-sm font-inter text-[#656D7A]">
                        <strong className="text-[#1D2129]">Só 2 minutos</strong> para completar
                      </span>
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-[#2A2F8D] to-[#00C2FF] text-white px-8 py-3 rounded-lg font-medium font-inter hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Completar Agora</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Índice de Cobertura */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#1D2129] font-inter">Índice de Cobertura</h3>
                <div className={`px-4 py-2 rounded-full ${coverageLevel.bgColor}`}>
                  <span className={`font-semibold font-inter ${coverageLevel.color}`}>
                    {coverageLevel.level}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="relative">
                  <div className="w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#E9EDF2"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#2A2F8D"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${progressPercentage * 2.51} 251`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#1D2129] font-inter">{coveragePoints}</div>
                        <div className="text-xs text-[#656D7A] font-inter">pontos</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-[#656D7A] mb-4 font-inter">
                    Seu índice é calculado com base nos tipos de seguros que você contratou através da nossa plataforma.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-inter">
                      <span className="text-[#656D7A]">Seguro Auto: +250 pontos</span>
                      <span className="text-[#656D7A]">Seguro Vida: +300 pontos</span>
                    </div>
                    <div className="flex justify-between text-sm font-inter">
                      <span className="text-[#656D7A]">Seguro Saúde: +200 pontos</span>
                      <span className="text-[#656D7A]">Seguro Residencial: +150 pontos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meus Seguros Contratados */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#1D2129] font-inter">Meus Seguros Contratados</h3>
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 text-[#2A2F8D] hover:text-[#1E2464] font-medium font-inter"
                >
                  <span>Contratar Novo</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {contractedInsurances.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contractedInsurances.map((insurance) => {
                    const IconComponent = insurance.icon
                    return (
                      <div key={insurance.id} className="border border-[#E9EDF2] rounded-lg p-6 hover:border-[#2A2F8D] transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-[#F7F9FC] rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-[#2A2F8D]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#1D2129] font-inter">{insurance.companyName}</h4>
                              <p className="text-[#656D7A] text-sm font-inter">{insurance.planName}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-[#656D7A] font-inter">
                            <Calendar className="w-4 h-4 mr-2" />
                            Contratado em: {formatDate(insurance.contractDate)}
                          </div>
                          <div className="flex items-center text-sm text-[#656D7A] font-inter">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Cotação na época: {formatPrice(insurance.quotedPrice)}
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuoteAgain(insurance)}
                          className="w-full flex items-center justify-center space-x-2 bg-[#2A2F8D] text-white py-3 rounded-lg hover:bg-[#1E2464] transition-colors font-medium font-inter"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Cotar Novamente</span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-[#E9EDF2] mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-[#656D7A] mb-2 font-inter">Nenhum seguro contratado ainda</h4>
                  <p className="text-[#656D7A] mb-6 font-inter">Comece sua jornada de proteção conosco!</p>
                  <button
                    onClick={() => router.push('/')}
                    className="bg-[#2A2F8D] text-white px-6 py-3 rounded-lg hover:bg-[#1E2464] transition-colors font-medium font-inter"
                  >
                    Fazer Primeira Cotação
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Ações Rápidas */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6">
              <h3 className="text-lg font-bold text-[#1D2129] mb-4 font-inter">Ações Rápidas</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/sinistro')}
                  className="w-full flex items-center space-x-3 p-4 border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] hover:bg-[#F7F9FC] transition-colors text-left"
                >
                  <Phone className="w-5 h-5 text-[#2A2F8D]" />
                  <div>
                    <div className="font-medium text-[#1D2129] font-inter">Acionar Sinistro</div>
                    <div className="text-sm text-[#656D7A] font-inter">Guia completo de contatos</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => router.push('/')}
                  className="w-full flex items-center space-x-3 p-4 border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] hover:bg-[#F7F9FC] transition-colors text-left"
                >
                  <RefreshCw className="w-5 h-5 text-[#2A2F8D]" />
                  <div>
                    <div className="font-medium text-[#1D2129] font-inter">Nova Cotação</div>
                    <div className="text-sm text-[#656D7A] font-inter">Compare e economize</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Check-up de Proteção */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-5 h-5 text-[#2A2F8D]" />
                <h3 className="text-lg font-bold text-[#1D2129] font-inter">Check-up de Proteção</h3>
              </div>
              
              <div className="space-y-4">
                {contractedInsurances.length > 0 && (
                  <div className="p-4 bg-[#FFF7E6] border border-[#FFD700] rounded-lg">
                    <h4 className="font-medium text-[#B76E00] mb-2 font-inter">💡 Oportunidade de Economia</h4>
                    <p className="text-sm text-[#8B5A00] font-inter">
                      O Seguro Auto que você contratou há quase um ano pode estar perto da renovação. 
                      Que tal fazer uma nova cotação e garantir o melhor preço?
                    </p>
                    <button 
                      onClick={() => router.push('/cotacao/auto')}
                      className="mt-3 text-sm text-[#B76E00] hover:text-[#8B5A00] font-medium font-inter underline"
                    >
                      Fazer Nova Cotação Auto
                    </button>
                  </div>
                )}
                
                {!contractedInsurances.some(i => i.type === 'vida') && (
                  <div className="p-4 bg-[#F0F8FF] border border-[#87CEEB] rounded-lg">
                    <h4 className="font-medium text-[#1E6091] mb-2 font-inter">🛡️ Gap de Proteção</h4>
                    <p className="text-sm text-[#2C5282] font-inter">
                      Você ainda não tem um Seguro de Vida. É a proteção mais importante para sua família.
                    </p>
                    <button 
                      onClick={() => router.push('/cotacao/vida')}
                      className="mt-3 text-sm text-[#1E6091] hover:text-[#2C5282] font-medium font-inter underline"
                    >
                      Cotar Seguro de Vida
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Fique por Dentro */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-[#2A2F8D]" />
                <h3 className="text-lg font-bold text-[#1D2129] font-inter">Fique por Dentro</h3>
              </div>
              
              <div className="space-y-3">
                <a href="#" className="block p-3 hover:bg-[#F7F9FC] rounded-lg transition-colors">
                  <h4 className="font-medium text-[#1D2129] text-sm mb-1 font-inter">Como economizar no seguro auto</h4>
                  <p className="text-xs text-[#656D7A] font-inter">5 dicas para reduzir sua mensalidade</p>
                </a>
                
                <a href="#" className="block p-3 hover:bg-[#F7F9FC] rounded-lg transition-colors">
                  <h4 className="font-medium text-[#1D2129] text-sm mb-1 font-inter">O que fazer em caso de acidente</h4>
                  <p className="text-xs text-[#656D7A] font-inter">Passo a passo para acionar o seguro</p>
                </a>
                
                <a href="#" className="block p-3 hover:bg-[#F7F9FC] rounded-lg transition-colors">
                  <h4 className="font-medium text-[#1D2129] text-sm mb-1 font-inter">Seguro de vida vale a pena?</h4>
                  <p className="text-xs text-[#656D7A] font-inter">Entenda os benefícios para sua família</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
