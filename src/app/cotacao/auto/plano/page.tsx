'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, User, LogOut, CheckCircle, X, FileText, Phone, Car, MapPin, Clock, Award, CreditCard } from 'lucide-react'

interface CoberturasDetalhadas {
  [key: string]: {
    titulo: string
    descricao: string
    valor?: string
    incluido: boolean
  }
}

const coberturasDisponiveis: CoberturasDetalhadas = {
  'Cobertura Total': {
    titulo: 'Cobertura Compreensiva',
    descricao: 'Proteção contra roubo, furto, colisão, incêndio e fenômenos da natureza',
    incluido: true
  },
  'Assistência 24h': {
    titulo: 'Assistência 24 horas',
    descricao: 'Socorro mecânico, elétrico, pane seca, troca de pneu e reboque',
    incluido: true
  },
  'Carro Reserva': {
    titulo: 'Veículo Reserva',
    descricao: 'Carro substituto por até 15 dias em caso de sinistro',
    incluido: true
  },
  'Vidros': {
    titulo: 'Cobertura de Vidros',
    descricao: 'Reparo ou troca de para-brisa, vidros laterais e traseiros',
    incluido: true
  },
  'Proteção Terceiros': {
    titulo: 'Responsabilidade Civil',
    descricao: 'Cobertura para danos causados a terceiros',
    valor: 'Até R$ 100.000',
    incluido: true
  },
  'Kit Gás': {
    titulo: 'Cobertura Kit Gás',
    descricao: 'Proteção para instalação de GNV',
    incluido: false
  },
  'Acessórios': {
    titulo: 'Equipamentos e Acessórios',
    descricao: 'Cobertura para som, alarme e outros equipamentos',
    valor: 'Até R$ 5.000',
    incluido: false
  }
}

export default function PlanoAutoPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<any>(null)
  const [dadosPessoais, setDadosPessoais] = useState<any>(null)
  const [coberturasSelecionadas, setCoberturasSelecionadas] = useState<string[]>([])
  const [precoFinal, setPrecoFinal] = useState(0)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedPlano = localStorage.getItem('planoSelecionado')
    const savedDados = localStorage.getItem('dadosPessoais')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedPlano) {
      const plano = JSON.parse(savedPlano)
      setPlanoSelecionado(plano)
      setCoberturasSelecionadas(plano.cobertura || [])
      setPrecoFinal(plano.preco)
    } else {
      router.push('/cotacao/auto/resultados')
    }
    
    if (savedDados) {
      setDadosPessoais(JSON.parse(savedDados))
    } else {
      router.push('/cotacao/auto/dados')
    }
  }, [router])

  const handleCoberturaToggle = (cobertura: string) => {
    const novasCoberturas = coberturasSelecionadas.includes(cobertura)
      ? coberturasSelecionadas.filter(c => c !== cobertura)
      : [...coberturasSelecionadas, cobertura]
    
    setCoberturasSelecionadas(novasCoberturas)
    
    // Simular cálculo de preço (adicionar/remover R$ 50-100 por cobertura adicional)
    let novoPreco = planoSelecionado.preco
    const coberturasAdicionais = novasCoberturas.filter(c => !planoSelecionado.cobertura.includes(c))
    novoPreco += coberturasAdicionais.length * 75
    
    setPrecoFinal(novoPreco)
  }

  const handleContinuar = () => {
    // Salvar dados finais
    const dadosFinais = {
      plano: planoSelecionado,
      coberturas: coberturasSelecionadas,
      preco: precoFinal,
      dados: dadosPessoais
    }
    localStorage.setItem('contratoFinal', JSON.stringify(dadosFinais))
    router.push('/cotacao/auto/pagamento')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const diferencaPreco = precoFinal - (planoSelecionado?.preco || 0)

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-purple-100 rounded-full">
              <span className="text-purple-600 text-sm font-medium font-inter">Detalhes do Plano</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/auto/dados')}
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Detalhes do Plano */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Informações Principais */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-[#F7F9FC] rounded-lg flex items-center justify-center border border-[#E9EDF2]">
                  <span className="text-sm font-medium text-[#656D7A] font-inter">
                    {planoSelecionado?.seguradora.substring(0, 3)}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1D2129] font-inter">
                    {planoSelecionado?.seguradora}
                  </h2>
                  <p className="text-lg text-[#656D7A] font-inter">{planoSelecionado?.plano}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#F7F9FC] rounded-lg">
                <div className="text-center">
                  <Car className="w-8 h-8 text-[#2A2F8D] mx-auto mb-2" />
                  <h4 className="font-medium text-[#1D2129] font-inter">Veículo Protegido</h4>
                  <p className="text-sm text-[#656D7A] font-inter">100% do valor FIPE</p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-[#2A2F8D] mx-auto mb-2" />
                  <h4 className="font-medium text-[#1D2129] font-inter">Assistência</h4>
                  <p className="text-sm text-[#656D7A] font-inter">24 horas, 7 dias</p>
                </div>
                <div className="text-center">
                  <Award className="w-8 h-8 text-[#2A2F8D] mx-auto mb-2" />
                  <h4 className="font-medium text-[#1D2129] font-inter">Rede Credenciada</h4>
                  <p className="text-sm text-[#656D7A] font-inter">+5.000 oficinas</p>
                </div>
              </div>
            </div>

            {/* Coberturas */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h3 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">
                Coberturas Disponíveis
              </h3>

              <div className="space-y-4">
                {Object.entries(coberturasDisponiveis).map(([key, cobertura]) => {
                  const isIncluded = coberturasSelecionadas.includes(key)
                  const isOriginal = planoSelecionado?.cobertura.includes(key)
                  
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        isIncluded 
                          ? 'border-[#2A2F8D] bg-[#F7F9FC]' 
                          : 'border-[#E9EDF2] bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-3">
                            <div className={`mt-1 ${isOriginal ? '' : 'cursor-pointer'}`}>
                              {isIncluded ? (
                                <CheckCircle className="w-5 h-5 text-[#00BA88]" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-[#E9EDF2] rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-[#1D2129] font-inter">
                                {cobertura.titulo}
                                {isOriginal && (
                                  <span className="ml-2 px-2 py-1 text-xs bg-[#2A2F8D] text-white rounded-full">
                                    Incluído
                                  </span>
                                )}
                              </h4>
                              <p className="text-sm text-[#656D7A] mt-1 font-inter">
                                {cobertura.descricao}
                              </p>
                              {cobertura.valor && (
                                <p className="text-sm font-medium text-[#2A2F8D] mt-1 font-inter">
                                  {cobertura.valor}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {!isOriginal && (
                          <button
                            onClick={() => handleCoberturaToggle(key)}
                            className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors font-inter ${
                              isIncluded
                                ? 'bg-[#2A2F8D] text-white hover:bg-[#1E2464]'
                                : 'bg-[#F7F9FC] text-[#2A2F8D] border border-[#2A2F8D] hover:bg-[#2A2F8D] hover:text-white'
                            }`}
                          >
                            {isIncluded ? 'Remover' : 'Adicionar'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Termos e Condições */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h3 className="text-xl font-bold text-[#1D2129] mb-4 font-inter flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#2A2F8D]" />
                Informações Importantes
              </h3>
              
              <div className="space-y-4 text-sm text-[#656D7A] font-inter">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#00BA88] mt-0.5 flex-shrink-0" />
                  <p>Vigência de 12 meses a partir da contratação</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#00BA88] mt-0.5 flex-shrink-0" />
                  <p>Pagamento em até 12x no cartão de crédito ou desconto para pagamento anual</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#00BA88] mt-0.5 flex-shrink-0" />
                  <p>Carência de 30 dias apenas para roubo/furto em estacionamentos privados</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#00BA88] mt-0.5 flex-shrink-0" />
                  <p>Direito de arrependimento em até 7 dias após a contratação</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo e Checkout */}
          <div>
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 sticky top-4">
              <h3 className="text-lg font-bold text-[#1D2129] mb-6 font-inter">Resumo do Pedido</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#656D7A] font-inter">Plano Base</span>
                  <span className="font-medium text-[#1D2129] font-inter">
                    {formatPrice(planoSelecionado?.preco || 0)}
                  </span>
                </div>
                
                {diferencaPreco > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#656D7A] font-inter">Coberturas Adicionais</span>
                    <span className="font-medium text-[#1D2129] font-inter">
                      +{formatPrice(diferencaPreco)}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-[#E9EDF2] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#1D2129] font-inter">Total Mensal</span>
                    <span className="text-xl font-bold text-[#2A2F8D] font-inter">
                      {formatPrice(precoFinal)}
                    </span>
                  </div>
                  <p className="text-xs text-[#656D7A] mt-1 font-inter">
                    ou {formatPrice(precoFinal * 12 * 0.9)} anual (10% desconto)
                  </p>
                </div>
              </div>

              {/* Dados do Cliente */}
              {dadosPessoais && (
                <div className="mb-6 p-4 bg-[#F7F9FC] rounded-lg border border-[#E9EDF2]">
                  <h4 className="font-medium text-[#1D2129] mb-2 font-inter">Dados do Segurado</h4>
                  <p className="text-sm text-[#656D7A] font-inter">{dadosPessoais.nomeCompleto}</p>
                  <p className="text-sm text-[#656D7A] font-inter">{dadosPessoais.email}</p>
                </div>
              )}

              <button
                onClick={handleContinuar}
                className="w-full bg-[#2A2F8D] text-white py-4 rounded-lg hover:bg-[#1E2464] transition-colors flex items-center justify-center space-x-2 font-medium font-inter mb-4"
              >
                <CreditCard className="w-5 h-5" />
                <span>Finalizar Contratação</span>
              </button>

              <p className="text-xs text-[#656D7A] text-center font-inter">
                🔒 Pagamento 100% seguro. CPF será solicitado na próxima etapa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
