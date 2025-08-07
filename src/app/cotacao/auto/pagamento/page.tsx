'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, User, LogOut, CreditCard, Lock, CheckCircle, Calendar, DollarSign, FileText, Award } from 'lucide-react'

export default function PagamentoAutoPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [contratoFinal, setContratoFinal] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState('mensal')
  const [dadosPagamento, setDadosPagamento] = useState({
    cpf: '',
    numeroCartao: '',
    nomeCartao: '',
    validadeCartao: '',
    cvvCartao: '',
    parcelamento: '12'
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedContrato = localStorage.getItem('contratoFinal')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedContrato) {
      setContratoFinal(JSON.parse(savedContrato))
    } else {
      router.push('/cotacao/auto/plano')
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setDadosPagamento(prev => ({ ...prev, [field]: value }))
  }

  const handleFinalizarContratacao = async () => {
    setIsLoading(true)
    
    // Simular processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Salvar contrato finalizado
    const contratoCompleto = {
      ...contratoFinal,
      pagamento: dadosPagamento,
      formaPagamento,
      dataContratacao: new Date().toISOString(),
      numeroContrato: `AS${Date.now()}`,
      status: 'ativo'
    }
    
    localStorage.setItem('contratoFinalizado', JSON.stringify(contratoCompleto))
    
    // Limpar dados temporários
    localStorage.removeItem('cotacaoData')
    localStorage.removeItem('planoSelecionado')
    localStorage.removeItem('dadosPessoais')
    localStorage.removeItem('contratoFinal')
    
    router.push('/cotacao/auto/sucesso')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatCartao = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})\d+?$/, '$1')
  }

  const calcularPrecoFinal = () => {
    if (!contratoFinal) return 0
    
    if (formaPagamento === 'anual') {
      return contratoFinal.preco * 12 * 0.9 // 10% desconto
    }
    return contratoFinal.preco
  }

  const calcularParcela = () => {
    const precoTotal = calcularPrecoFinal()
    if (formaPagamento === 'anual') {
      return precoTotal // Valor anual
    }
    return precoTotal // Valor mensal
  }

  const isFormValid = dadosPagamento.cpf && dadosPagamento.numeroCartao && 
                     dadosPagamento.nomeCartao && dadosPagamento.validadeCartao && 
                     dadosPagamento.cvvCartao

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-green-100 rounded-full">
              <span className="text-green-600 text-sm font-medium font-inter">Pagamento Seguro</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/auto/plano')}
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Dados Finais */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h2 className="text-2xl font-bold text-[#1D2129] mb-6 font-inter flex items-center">
                <Lock className="w-6 h-6 mr-3 text-[#2A2F8D]" />
                Finalizar Contratação
              </h2>

              <div className="space-y-6">
                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    CPF do Segurado *
                  </label>
                  <input
                    type="text"
                    required
                    value={dadosPagamento.cpf}
                    onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                  />
                  <p className="text-xs text-[#656D7A] mt-1 font-inter">
                    Documento necessário para finalizar a contratação
                  </p>
                </div>

                {/* Forma de Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-4 font-inter">
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setFormaPagamento('mensal')}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                        formaPagamento === 'mensal'
                          ? 'border-[#2A2F8D] bg-[#F7F9FC]'
                          : 'border-[#E9EDF2] bg-white hover:border-[#2A2F8D]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-[#1D2129] font-inter">Pagamento Mensal</h4>
                        <Calendar className="w-5 h-5 text-[#2A2F8D]" />
                      </div>
                      <p className="text-sm text-[#656D7A] font-inter">
                        {contratoFinal && formatPrice(contratoFinal.preco)}/mês
                      </p>
                    </button>

                    <button
                      onClick={() => setFormaPagamento('anual')}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-300 relative ${
                        formaPagamento === 'anual'
                          ? 'border-[#2A2F8D] bg-[#F7F9FC]'
                          : 'border-[#E9EDF2] bg-white hover:border-[#2A2F8D]'
                      }`}
                    >
                      <div className="absolute -top-2 right-2">
                        <span className="bg-[#00BA88] text-white text-xs px-2 py-1 rounded-full font-medium font-inter">
                          10% OFF
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-[#1D2129] font-inter">Pagamento Anual</h4>
                        <DollarSign className="w-5 h-5 text-[#2A2F8D]" />
                      </div>
                      <p className="text-sm text-[#656D7A] font-inter">
                        {contratoFinal && formatPrice(contratoFinal.preco * 12 * 0.9)}/ano
                      </p>
                    </button>
                  </div>
                </div>

                {/* Dados do Cartão */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1D2129] mb-4 font-inter flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[#2A2F8D]" />
                    Dados do Cartão de Crédito
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                        Número do Cartão *
                      </label>
                      <input
                        type="text"
                        required
                        value={dadosPagamento.numeroCartao}
                        onChange={(e) => handleInputChange('numeroCartao', formatCartao(e.target.value))}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                        Nome no Cartão *
                      </label>
                      <input
                        type="text"
                        required
                        value={dadosPagamento.nomeCartao}
                        onChange={(e) => handleInputChange('nomeCartao', e.target.value.toUpperCase())}
                        placeholder="NOME COMO ESTÁ NO CARTÃO"
                        className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                          Validade *
                        </label>
                        <input
                          type="text"
                          required
                          value={dadosPagamento.validadeCartao}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
                            handleInputChange('validadeCartao', value)
                          }}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                          CVV *
                        </label>
                        <input
                          type="text"
                          required
                          value={dadosPagamento.cvvCartao}
                          onChange={(e) => handleInputChange('cvvCartao', e.target.value.replace(/\D/g, ''))}
                          placeholder="000"
                          maxLength={4}
                          className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Termos */}
                <div className="p-4 bg-[#F7F9FC] rounded-lg border border-[#E9EDF2]">
                  <div className="flex items-start space-x-3">
                    <input 
                      type="checkbox" 
                      id="termos"
                      className="mt-1 rounded border-[#E9EDF2] text-[#2A2F8D] focus:ring-[#2A2F8D]"
                      required
                    />
                    <label htmlFor="termos" className="text-sm text-[#656D7A] font-inter">
                      Concordo com os <a href="#" className="text-[#2A2F8D] underline">termos e condições</a> e 
                      autorizo a contratação do seguro auto conforme especificações apresentadas.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo Final */}
          <div>
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 sticky top-4">
              <h3 className="text-lg font-bold text-[#1D2129] mb-6 font-inter">Resumo Final</h3>
              
              {contratoFinal && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F7F9FC] rounded-lg border border-[#E9EDF2]">
                    <h4 className="font-semibold text-[#1D2129] font-inter">{contratoFinal.plano.seguradora}</h4>
                    <p className="text-sm text-[#656D7A] font-inter">{contratoFinal.plano.plano}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#656D7A] font-inter">Valor {formaPagamento === 'anual' ? 'Anual' : 'Mensal'}</span>
                      <span className="font-medium text-[#1D2129] font-inter">
                        {formatPrice(calcularParcela())}
                      </span>
                    </div>
                    
                    {formaPagamento === 'anual' && (
                      <div className="flex justify-between items-center text-[#00BA88]">
                        <span className="font-inter">Desconto (10%)</span>
                        <span className="font-medium font-inter">
                          -{formatPrice(contratoFinal.preco * 12 * 0.1)}
                        </span>
                      </div>
                    )}
                    
                    <div className="border-t border-[#E9EDF2] pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#1D2129] font-inter">
                          Total {formaPagamento === 'anual' ? 'Anual' : 'Mensal'}
                        </span>
                        <span className="text-xl font-bold text-[#2A2F8D] font-inter">
                          {formatPrice(calcularParcela())}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleFinalizarContratacao}
                    disabled={!isFormValid || isLoading}
                    className="w-full bg-[#2A2F8D] text-white py-4 rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium font-inter"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Contratar Seguro</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center space-x-2 text-xs text-[#656D7A] font-inter">
                    <Lock className="w-3 h-3" />
                    <span>Pagamento 100% seguro e criptografado</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
