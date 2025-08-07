'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Home, Heart, Star, Clock, CheckCircle, AlertTriangle, Filter } from 'lucide-react'

interface CotacaoData {
  tipoImovel?: string
  areaConstituida?: string
  valorImovel?: string
  valorConteudo?: string
  cidade?: string
  estado?: string
  coberturaDesejada?: string
}

interface Plano {
  id: string
  seguradora: string
  logo: string
  nome: string
  preco: number
  precoOriginal?: number
  desconto?: number
  coberturas: string[]
  diferenciais: string[]
  rating: number
  tempoAtendimento: string
  destaque?: boolean
}

export default function ResultadosResidencialPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [cotacaoData, setCotacaoData] = useState<CotacaoData>({})
  const [filtroPreco, setFiltroPreco] = useState<string>('todos')
  const [filtroSeguradora, setFiltroSeguradora] = useState<string>('todas')
  const [showFilters, setShowFilters] = useState(false)

  const planos: Plano[] = [
    {
      id: '1',
      seguradora: 'Porto Seguro',
      logo: '🏛️',
      nome: 'Residencial Essencial',
      preco: 145,
      precoOriginal: 180,
      desconto: 19,
      coberturas: [
        'Incêndio e Raio',
        'Roubo/Furto Qualificado',
        'Danos Elétricos',
        'Responsabilidade Civil Familiar',
        'Assistência 24h'
      ],
      diferenciais: [
        'Franquia reduzida',
        'Assistência pet incluída',
        'Desconto por dispositivos de segurança'
      ],
      rating: 4.8,
      tempoAtendimento: '24h',
      destaque: true
    },
    {
      id: '2',
      seguradora: 'SulAmérica',
      logo: '🔷',
      nome: 'Casa Protegida Plus',
      preco: 165,
      coberturas: [
        'Incêndio, Raio e Explosão',
        'Roubo/Furto Qualificado',
        'Danos Elétricos',
        'Vendaval e Granizo',
        'Responsabilidade Civil',
        'Assistência Residencial'
      ],
      diferenciais: [
        'Cobertura para equipamentos portáteis',
        'Hospedagem temporária incluída',
        'Chaveiro 24h'
      ],
      rating: 4.6,
      tempoAtendimento: '12h'
    },
    {
      id: '3',
      seguradora: 'Bradesco Seguros',
      logo: '🏦',
      nome: 'Lar Seguro Premium',
      preco: 189,
      precoOriginal: 220,
      desconto: 14,
      coberturas: [
        'Incêndio e Explosão',
        'Roubo/Furto',
        'Danos Elétricos',
        'Vendaval e Chuva',
        'Responsabilidade Civil',
        'Perda de Aluguel',
        'Assistência 24h'
      ],
      diferenciais: [
        'Cobertura para piscinas',
        'Jardinagem emergencial',
        'Seguro para empregada doméstica'
      ],
      rating: 4.7,
      tempoAtendimento: '6h'
    },
    {
      id: '4',
      seguradora: 'Mapfre',
      logo: '🔺',
      nome: 'Hogar Proteção',
      preco: 128,
      coberturas: [
        'Incêndio e Raio',
        'Roubo/Furto Qualificado',
        'Danos Elétricos',
        'Responsabilidade Civil'
      ],
      diferenciais: [
        'Preço econômico',
        'Processo digitalizado',
        'Desconto por indicação'
      ],
      rating: 4.3,
      tempoAtendimento: '48h'
    },
    {
      id: '5',
      seguradora: 'Zurich',
      logo: '⚡',
      nome: 'Casa Premium',
      preco: 198,
      coberturas: [
        'Incêndio, Raio e Explosão',
        'Roubo/Furto Qualificado',
        'Danos Elétricos',
        'Vendaval e Granizo',
        'Responsabilidade Civil',
        'Quebra de Vidros',
        'Assistência Completa'
      ],
      diferenciais: [
        'Cobertura internacional',
        'Concierge 24h',
        'Avaliação gratuita anual'
      ],
      rating: 4.9,
      tempoAtendimento: '2h'
    }
  ]

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const savedData = localStorage.getItem('cotacao_residencial_data')
    if (savedData) {
      setCotacaoData(JSON.parse(savedData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const selecionarPlano = (plano: Plano) => {
    localStorage.setItem('plano_selecionado', JSON.stringify(plano))
    router.push('/cotacao/residencial/dados')
  }

  const planosFiltrados = planos.filter(plano => {
    if (filtroPreco !== 'todos') {
      if (filtroPreco === 'ate-150' && plano.preco > 150) return false
      if (filtroPreco === '150-200' && (plano.preco < 150 || plano.preco > 200)) return false
      if (filtroPreco === 'acima-200' && plano.preco < 200) return false
    }
    
    if (filtroSeguradora !== 'todas' && plano.seguradora !== filtroSeguradora) {
      return false
    }
    
    return true
  })

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-orange-100 rounded-full">
              <span className="text-orange-600 text-sm font-medium font-inter">Cotações Residenciais</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/residencial/inicio')}
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Resumo da Cotação */}
        <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 mb-8">
          <div className="flex items-center mb-4">
            <Home className="w-6 h-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-bold text-[#1D2129] font-inter">Resumo da sua cotação</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-[#656D7A] font-inter">Tipo de Imóvel:</span>
              <p className="font-semibold text-[#1D2129] font-inter">
                {cotacaoData.tipoImovel || 'Casa'}
              </p>
            </div>
            <div>
              <span className="text-[#656D7A] font-inter">Área:</span>
              <p className="font-semibold text-[#1D2129] font-inter">
                {cotacaoData.areaConstituida || '120'}m²
              </p>
            </div>
            <div>
              <span className="text-[#656D7A] font-inter">Localização:</span>
              <p className="font-semibold text-[#1D2129] font-inter">
                {cotacaoData.cidade || 'São Paulo'}, {cotacaoData.estado || 'SP'}
              </p>
            </div>
            <div>
              <span className="text-[#656D7A] font-inter">Valor do Imóvel:</span>
              <p className="font-semibold text-[#1D2129] font-inter">
                {cotacaoData.valorImovel || 'R$ 400.000 - R$ 600.000'}
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1D2129] font-inter">Filtrar Resultados</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-[#2A2F8D] hover:text-[#1E2464] font-inter"
            >
              <Filter className="w-5 h-5" />
              <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
            </button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Faixa de Preço
                </label>
                <select
                  value={filtroPreco}
                  onChange={(e) => setFiltroPreco(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                >
                  <option value="todos">Todos os preços</option>
                  <option value="ate-150">Até R$ 150</option>
                  <option value="150-200">R$ 150 - R$ 200</option>
                  <option value="acima-200">Acima de R$ 200</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Seguradora
                </label>
                <select
                  value={filtroSeguradora}
                  onChange={(e) => setFiltroSeguradora(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                >
                  <option value="todas">Todas as seguradoras</option>
                  <option value="Porto Seguro">Porto Seguro</option>
                  <option value="SulAmérica">SulAmérica</option>
                  <option value="Bradesco Seguros">Bradesco Seguros</option>
                  <option value="Mapfre">Mapfre</option>
                  <option value="Zurich">Zurich</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Header dos Resultados */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1D2129] font-inter">
              {planosFiltrados.length} planos encontrados
            </h2>
            <p className="text-[#656D7A] font-inter">
              Seguros residenciais selecionados especialmente para você
            </p>
          </div>
        </div>

        {/* Lista de Planos */}
        <div className="space-y-6">
          {planosFiltrados.map((plano) => (
            <div
              key={plano.id}
              className={`bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
                plano.destaque 
                  ? 'border-orange-200 shadow-lg relative' 
                  : 'border-[#E9EDF2] hover:border-orange-200'
              }`}
            >
              {plano.destaque && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold font-inter">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{plano.logo}</span>
                    <div>
                      <h3 className="text-xl font-bold text-[#1D2129] font-inter">
                        {plano.nome}
                      </h3>
                      <p className="text-[#656D7A] font-inter">{plano.seguradora}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-[#1D2129] mb-3 font-inter">Coberturas Incluídas:</h4>
                      <ul className="space-y-2">
                        {plano.coberturas.map((cobertura, idx) => (
                          <li key={idx} className="flex items-center text-sm text-[#656D7A] font-inter">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {cobertura}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#1D2129] mb-3 font-inter">Diferenciais:</h4>
                      <ul className="space-y-2">
                        {plano.diferenciais.map((diferencial, idx) => (
                          <li key={idx} className="flex items-center text-sm text-[#656D7A] font-inter">
                            <Star className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                            {diferencial}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-[#656D7A]">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-inter">{plano.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-inter">Atendimento em {plano.tempoAtendimento}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:ml-8 mt-6 lg:mt-0 lg:text-right">
                  <div className="mb-4">
                    {plano.precoOriginal && (
                      <div className="flex items-center lg:justify-end space-x-2 mb-1">
                        <span className="text-sm text-[#656D7A] line-through font-inter">
                          {formatarPreco(plano.precoOriginal)}
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold font-inter">
                          -{plano.desconto}%
                        </span>
                      </div>
                    )}
                    <div className="text-3xl font-bold text-[#1D2129] font-inter">
                      {formatarPreco(plano.preco)}
                    </div>
                    <div className="text-sm text-[#656D7A] font-inter">por mês</div>
                  </div>

                  <button
                    onClick={() => selecionarPlano(plano)}
                    className={`w-full lg:w-auto px-8 py-3 rounded-lg font-semibold transition-colors font-inter ${
                      plano.destaque
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-[#2A2F8D] text-white hover:bg-[#1E2464]'
                    }`}
                  >
                    Contratar Agora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {planosFiltrados.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-[#656D7A] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1D2129] mb-2 font-inter">
              Nenhum plano encontrado
            </h3>
            <p className="text-[#656D7A] font-inter">
              Tente ajustar os filtros para ver mais opções
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
