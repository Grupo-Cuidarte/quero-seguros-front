'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, User, LogOut, Star, CheckCircle, Award, ArrowRight, Filter, SortDesc } from 'lucide-react'

interface Cotacao {
  id: string
  seguradora: string
  logo: string
  plano: string
  preco: number
  precoOriginal?: number
  desconto?: number
  cobertura: string[]
  destaque?: boolean
  selo?: string
  avaliacao: number
  avaliacoes: number
}

const mockCotacoes: Cotacao[] = [
  {
    id: '1',
    seguradora: 'Porto Seguro',
    logo: '/logos/porto.png',
    plano: 'Auto Conectado Plus',
    preco: 1250.90,
    precoOriginal: 1450.00,
    desconto: 15,
    cobertura: ['Cobertura Total', 'Assistência 24h', 'Carro Reserva', 'Vidros'],
    destaque: true,
    selo: 'Mais Vendido',
    avaliacao: 4.8,
    avaliacoes: 2847
  },
  {
    id: '2',
    seguradora: 'SulAmérica',
    logo: '/logos/sulamérica.png',
    plano: 'Clássico Proteção',
    preco: 1180.50,
    cobertura: ['Cobertura Total', 'Assistência 24h', 'Carro Reserva'],
    avaliacao: 4.6,
    avaliacoes: 1932
  },
  {
    id: '3',
    seguradora: 'Bradesco Seguros',
    logo: '/logos/bradesco.png',
    plano: 'Auto Fácil Premium',
    preco: 1320.00,
    cobertura: ['Cobertura Total', 'Assistência 24h', 'Vidros', 'Proteção Terceiros'],
    avaliacao: 4.7,
    avaliacoes: 3521
  },
  {
    id: '4',
    seguradora: 'Azul Seguros',
    logo: '/logos/azul.png',
    plano: 'Proteção Completa',
    preco: 1095.80,
    cobertura: ['Cobertura Básica', 'Assistência 24h'],
    selo: 'Melhor Preço',
    avaliacao: 4.4,
    avaliacoes: 1247
  }
]

export default function ResultadosAutoPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<any>(null)
  const [filtroOrdem, setFiltroOrdem] = useState('preco')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const savedFormData = localStorage.getItem('cotacaoData')
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData))
    }

    // Simular carregamento das cotações
    setTimeout(() => {
      setCotacoes(mockCotacoes)
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleSelecionarPlano = (cotacao: Cotacao) => {
    localStorage.setItem('planoSelecionado', JSON.stringify(cotacao))
    router.push('/cotacao/auto/dados')
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const ordenarCotacoes = (ordem: string) => {
    let cotacoesOrdenadas = [...cotacoes]
    
    switch (ordem) {
      case 'preco':
        cotacoesOrdenadas.sort((a, b) => a.preco - b.preco)
        break
      case 'avaliacao':
        cotacoesOrdenadas.sort((a, b) => b.avaliacao - a.avaliacao)
        break
      case 'nome':
        cotacoesOrdenadas.sort((a, b) => a.seguradora.localeCompare(b.seguradora))
        break
    }
    
    setCotacoes(cotacoesOrdenadas)
    setFiltroOrdem(ordem)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2A2F8D] mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-[#1D2129] mb-2 font-inter">Buscando as melhores cotações</h2>
          <p className="text-[#656D7A] font-inter">Comparando preços de +20 seguradoras...</p>
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
              <span className="text-green-600 text-sm font-medium font-inter">Cotações Encontradas</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/auto/inicio')}
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Resumo da Busca */}
        <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1D2129] mb-2 font-inter">Suas Cotações</h2>
              <p className="text-[#656D7A] font-inter">
                {formData && `${formData.marca} ${formData.modelo} ${formData.ano} - ${cotacoes.length} opções encontradas`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SortDesc className="w-4 h-4 text-[#656D7A]" />
                <span className="text-sm text-[#656D7A] font-inter">Ordenar por:</span>
              </div>
              <select
                value={filtroOrdem}
                onChange={(e) => ordenarCotacoes(e.target.value)}
                className="px-3 py-2 border border-[#E9EDF2] rounded-lg text-sm font-inter"
              >
                <option value="preco">Menor Preço</option>
                <option value="avaliacao">Melhor Avaliação</option>
                <option value="nome">Nome da Seguradora</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Cotações */}
        <div className="space-y-6">
          {cotacoes.map((cotacao, index) => (
            <div
              key={cotacao.id}
              className={`bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                cotacao.destaque 
                  ? 'border-[#2A2F8D] relative' 
                  : 'border-[#E9EDF2] hover:border-[#2A2F8D]'
              }`}
            >
              {cotacao.destaque && (
                <div className="absolute -top-3 left-6">
                  <div className="bg-[#2A2F8D] text-white px-4 py-1 rounded-full text-sm font-medium font-inter">
                    ⭐ Recomendado
                  </div>
                </div>
              )}
              
              {cotacao.selo && !cotacao.destaque && (
                <div className="absolute -top-3 left-6">
                  <div className="bg-[#00BA88] text-white px-4 py-1 rounded-full text-sm font-medium font-inter">
                    {cotacao.selo}
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-[#F7F9FC] rounded-lg flex items-center justify-center border border-[#E9EDF2]">
                      <span className="text-xs font-medium text-[#656D7A] font-inter">
                        {cotacao.seguradora.substring(0, 3)}
                      </span>
                    </div>

                    {/* Informações */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-[#1D2129] font-inter">
                          {cotacao.seguradora}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-[#FFD700] fill-current" />
                          <span className="text-sm font-medium text-[#1D2129] font-inter">
                            {cotacao.avaliacao}
                          </span>
                          <span className="text-xs text-[#656D7A] font-inter">
                            ({cotacao.avaliacoes} avaliações)
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-[#656D7A] mb-4 font-inter">{cotacao.plano}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {cotacao.cobertura.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-1 bg-[#F7F9FC] px-3 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3 text-[#00BA88]" />
                            <span className="text-xs text-[#656D7A] font-inter">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preço e Ação */}
                  <div className="text-right">
                    <div className="mb-4">
                      {cotacao.precoOriginal && (
                        <div className="text-sm text-[#656D7A] line-through font-inter">
                          {formatPrice(cotacao.precoOriginal)}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-[#1D2129] font-inter">
                        {formatPrice(cotacao.preco)}
                      </div>
                      <div className="text-sm text-[#656D7A] font-inter">por mês</div>
                      {cotacao.desconto && (
                        <div className="text-sm text-[#00BA88] font-medium font-inter">
                          {cotacao.desconto}% OFF
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleSelecionarPlano(cotacao)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors font-inter ${
                        cotacao.destaque
                          ? 'bg-[#2A2F8D] text-white hover:bg-[#1E2464]'
                          : 'bg-[#F7F9FC] text-[#2A2F8D] border border-[#2A2F8D] hover:bg-[#2A2F8D] hover:text-white'
                      }`}
                    >
                      <span>Selecionar Plano</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E9EDF2] p-6">
          <div className="flex items-start space-x-4">
            <Award className="w-6 h-6 text-[#2A2F8D] mt-1" />
            <div>
              <h3 className="text-lg font-bold text-[#1D2129] mb-2 font-inter">
                Próximos Passos
              </h3>
              <p className="text-[#656D7A] font-inter">
                Após selecionar um plano, você irá preencher seus dados pessoais, 
                conhecer os detalhes da cobertura e finalizar a contratação de forma 100% digital.
                O CPF será solicitado apenas no momento do pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
