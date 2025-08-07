'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Home, CheckCircle, Star, Clock, Download, FileText, Phone, AlertTriangle } from 'lucide-react'

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

interface UserData {
  name: string
  email: string
}

export default function PlanoResidencialPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const savedPlano = localStorage.getItem('plano_selecionado')
    if (savedPlano) {
      setPlanoSelecionado(JSON.parse(savedPlano))
    } else {
      router.push('/cotacao/residencial/resultados')
      return
    }

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleContinuar = () => {
    router.push('/cotacao/residencial/pagamento')
  }

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A2F8D]"></div>
      </div>
    )
  }

  if (!planoSelecionado) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-[#656D7A] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1D2129] mb-2 font-inter">Plano não encontrado</h2>
          <p className="text-[#656D7A] font-inter">Redirecionando...</p>
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
            <div className="ml-4 px-3 py-1 bg-orange-100 rounded-full">
              <span className="text-orange-600 text-sm font-medium font-inter">Detalhes do Plano</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/residencial/dados')}
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
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-3xl mb-6">
            <Home className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1D2129] mb-4 font-inter">
            Detalhes do seu Seguro Residencial
          </h1>
          <p className="text-lg text-[#656D7A] font-inter">
            Confira todas as informações do plano selecionado antes de finalizar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Plano */}
          <div className="lg:col-span-2 space-y-8">
            {/* Card Principal do Plano */}
            <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{planoSelecionado.logo}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1D2129] font-inter">
                      {planoSelecionado.nome}
                    </h2>
                    <p className="text-lg text-[#656D7A] font-inter">{planoSelecionado.seguradora}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  {planoSelecionado.precoOriginal && (
                    <div className="flex items-center justify-end space-x-2 mb-1">
                      <span className="text-lg text-[#656D7A] line-through font-inter">
                        {formatarPreco(planoSelecionado.precoOriginal)}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold font-inter">
                        -{planoSelecionado.desconto}%
                      </span>
                    </div>
                  )}
                  <div className="text-4xl font-bold text-[#1D2129] font-inter">
                    {formatarPreco(planoSelecionado.preco)}
                  </div>
                  <div className="text-lg text-[#656D7A] font-inter">por mês</div>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-[#E9EDF2]">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-[#1D2129] font-inter">{planoSelecionado.rating}</span>
                  <span className="text-[#656D7A] font-inter">avaliação</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#656D7A]" />
                  <span className="text-[#656D7A] font-inter">Atendimento em {planoSelecionado.tempoAtendimento}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#1D2129] mb-4 font-inter">Coberturas Incluídas</h3>
                  <ul className="space-y-3">
                    {planoSelecionado.coberturas.map((cobertura, idx) => (
                      <li key={idx} className="flex items-start text-[#656D7A] font-inter">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span>{cobertura}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1D2129] mb-4 font-inter">Diferenciais</h3>
                  <ul className="space-y-3">
                    {planoSelecionado.diferenciais.map((diferencial, idx) => (
                      <li key={idx} className="flex items-start text-[#656D7A] font-inter">
                        <Star className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span>{diferencial}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Informações Importantes */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h3 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Informações Importantes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#1D2129] mb-2 font-inter">Prazo de Carência</h4>
                    <p className="text-[#656D7A] font-inter">30 dias para sinistros por roubo/furto</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#1D2129] mb-2 font-inter">Vigência</h4>
                    <p className="text-[#656D7A] font-inter">12 meses com renovação automática</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#1D2129] mb-2 font-inter">Forma de Pagamento</h4>
                    <p className="text-[#656D7A] font-inter">Mensal via cartão de crédito ou débito automático</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#1D2129] mb-2 font-inter">Franquia</h4>
                    <p className="text-[#656D7A] font-inter">10% do valor da indenização (mín. R$ 500)</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#1D2129] mb-2 font-inter">Cancelamento</h4>
                    <p className="text-[#656D7A] font-inter">Pode ser cancelado a qualquer momento</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#1D2129] mb-2 font-inter">Suporte</h4>
                    <p className="text-[#656D7A] font-inter">Central de atendimento 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentos */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h3 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Documentos e Condições</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] transition-colors group">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-[#656D7A] group-hover:text-[#2A2F8D] mr-3" />
                    <span className="text-[#1D2129] font-inter">Condições Gerais</span>
                  </div>
                  <Download className="w-4 h-4 text-[#656D7A] group-hover:text-[#2A2F8D]" />
                </button>

                <button className="flex items-center justify-between p-4 border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] transition-colors group">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-[#656D7A] group-hover:text-[#2A2F8D] mr-3" />
                    <span className="text-[#1D2129] font-inter">Manual do Segurado</span>
                  </div>
                  <Download className="w-4 h-4 text-[#656D7A] group-hover:text-[#2A2F8D]" />
                </button>

                <button className="flex items-center justify-between p-4 border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] transition-colors group">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-[#656D7A] group-hover:text-[#2A2F8D] mr-3" />
                    <span className="text-[#1D2129] font-inter">Tabela de Coberturas</span>
                  </div>
                  <Download className="w-4 h-4 text-[#656D7A] group-hover:text-[#2A2F8D]" />
                </button>

                <button className="flex items-center justify-between p-4 border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] transition-colors group">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-[#656D7A] group-hover:text-[#2A2F8D] mr-3" />
                    <span className="text-[#1D2129] font-inter">Contatos de Emergência</span>
                  </div>
                  <Download className="w-4 h-4 text-[#656D7A] group-hover:text-[#2A2F8D]" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Resumo da Contratação */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 sticky top-6">
              <h3 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Resumo da Contratação</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#656D7A] font-inter">Plano selecionado:</span>
                  <span className="font-semibold text-[#1D2129] font-inter">{planoSelecionado.nome}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#656D7A] font-inter">Seguradora:</span>
                  <span className="font-semibold text-[#1D2129] font-inter">{planoSelecionado.seguradora}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#656D7A] font-inter">Vigência:</span>
                  <span className="font-semibold text-[#1D2129] font-inter">12 meses</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#656D7A] font-inter">Pagamento:</span>
                  <span className="font-semibold text-[#1D2129] font-inter">Mensal</span>
                </div>
                
                <hr className="border-[#E9EDF2]" />
                
                {planoSelecionado.precoOriginal && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#656D7A] font-inter">Preço original:</span>
                    <span className="text-[#656D7A] line-through font-inter">
                      {formatarPreco(planoSelecionado.precoOriginal)}
                    </span>
                  </div>
                )}
                
                {planoSelecionado.desconto && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-inter">Desconto ({planoSelecionado.desconto}%):</span>
                    <span className="text-green-600 font-semibold font-inter">
                      -{formatarPreco((planoSelecionado.precoOriginal || planoSelecionado.preco) - planoSelecionado.preco)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-[#1D2129] font-inter">Valor mensal:</span>
                  <span className="font-bold text-[#1D2129] text-xl font-inter">
                    {formatarPreco(planoSelecionado.preco)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleContinuar}
                  className="w-full bg-[#2A2F8D] text-white py-4 rounded-lg hover:bg-[#1E2464] transition-colors font-semibold text-lg font-inter"
                >
                  Continuar para Pagamento
                </button>
                
                <button
                  onClick={() => router.push('/cotacao/residencial/resultados')}
                  className="w-full border border-[#E9EDF2] text-[#656D7A] py-3 rounded-lg hover:border-[#2A2F8D] hover:text-[#2A2F8D] transition-colors font-medium font-inter"
                >
                  Escolher Outro Plano
                </button>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-800 font-inter">100% Digital</p>
                    <p className="text-sm text-orange-700 font-inter">
                      Contratação rápida e segura, sem burocracias
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
