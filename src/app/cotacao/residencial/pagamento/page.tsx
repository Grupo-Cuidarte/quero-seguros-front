'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Home, CreditCard, Calendar, Lock, AlertCircle, CheckCircle } from 'lucide-react'

interface Plano {
  seguradora: string
  nome: string
  preco: number
}

interface UserData {
  name: string
  email: string
}

interface FormData {
  cpf: string
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
  installments: string
}

export default function PagamentoResidencialPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null)
  const [formData, setFormData] = useState<FormData>({
    cpf: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: '1'
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value

    // Formatação de campos específicos
    if (field === 'cpf') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim()
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2')
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '')
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório'
    else if (formData.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = 'CPF inválido'

    if (!formData.cardNumber) newErrors.cardNumber = 'Número do cartão é obrigatório'
    else if (formData.cardNumber.replace(/\D/g, '').length !== 16) newErrors.cardNumber = 'Número do cartão inválido'

    if (!formData.cardName) newErrors.cardName = 'Nome no cartão é obrigatório'

    if (!formData.expiryDate) newErrors.expiryDate = 'Data de validade é obrigatória'
    else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Data inválida (MM/AA)'

    if (!formData.cvv) newErrors.cvv = 'CVV é obrigatório'
    else if (formData.cvv.length < 3) newErrors.cvv = 'CVV inválido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simular sucesso do pagamento
      setShowSuccess(true)
      
      // Aguardar um momento e redirecionar
      setTimeout(() => {
        router.push('/cotacao/residencial/sucesso')
      }, 2000)
      
    } catch (error) {
      console.error('Erro no pagamento:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
      setIsProcessing(false)
    }
  }

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  const calcularValorParcelado = (valor: number, parcelas: number) => {
    return valor / parcelas
  }

  const opcoesParcelas = [
    { value: '1', label: 'À vista', taxa: 0 },
    { value: '2', label: '2x sem juros', taxa: 0 },
    { value: '3', label: '3x sem juros', taxa: 0 },
    { value: '4', label: '4x sem juros', taxa: 0 },
    { value: '5', label: '5x sem juros', taxa: 0 },
    { value: '6', label: '6x sem juros', taxa: 0 },
    { value: '12', label: '12x com juros', taxa: 0.029 }
  ]

  if (!planoSelecionado) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A2F8D]"></div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-[#E9EDF2] p-12 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1D2129] mb-4 font-inter">
            Pagamento Aprovado!
          </h2>
          <p className="text-[#656D7A] font-inter">
            Redirecionando para confirmação...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mt-4"></div>
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
              <span className="text-orange-600 text-sm font-medium font-inter">Pagamento Seguro</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/residencial/plano')}
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

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-3xl mb-6">
            <CreditCard className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1D2129] mb-4 font-inter">
            Finalize seu Seguro Residencial
          </h1>
          <p className="text-lg text-[#656D7A] font-inter">
            Dados do pagamento e confirmação da contratação
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* CPF */}
              <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
                <div className="flex items-center mb-6">
                  <Lock className="w-6 h-6 text-[#2A2F8D] mr-3" />
                  <h2 className="text-xl font-bold text-[#1D2129] font-inter">Identificação</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                      errors.cpf ? 'border-red-300' : 'border-[#E9EDF2]'
                    }`}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {errors.cpf && <p className="text-red-500 text-sm mt-1 font-inter">{errors.cpf}</p>}
                </div>
              </div>

              {/* Dados do Cartão */}
              <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 text-[#2A2F8D] mr-3" />
                  <h2 className="text-xl font-bold text-[#1D2129] font-inter">Dados do Cartão</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                      Número do Cartão *
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                        errors.cardNumber ? 'border-red-300' : 'border-[#E9EDF2]'
                      }`}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1 font-inter">{errors.cardNumber}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                      Nome no Cartão *
                    </label>
                    <input
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                        errors.cardName ? 'border-red-300' : 'border-[#E9EDF2]'
                      }`}
                      placeholder="NOME COMO NO CARTÃO"
                    />
                    {errors.cardName && <p className="text-red-500 text-sm mt-1 font-inter">{errors.cardName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                      Validade *
                    </label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                        errors.expiryDate ? 'border-red-300' : 'border-[#E9EDF2]'
                      }`}
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1 font-inter">{errors.expiryDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                        errors.cvv ? 'border-red-300' : 'border-[#E9EDF2]'
                      }`}
                      placeholder="000"
                      maxLength={4}
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1 font-inter">{errors.cvv}</p>}
                  </div>
                </div>
              </div>

              {/* Parcelamento */}
              <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
                <div className="flex items-center mb-6">
                  <Calendar className="w-6 h-6 text-[#2A2F8D] mr-3" />
                  <h2 className="text-xl font-bold text-[#1D2129] font-inter">Forma de Pagamento</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    Parcelamento
                  </label>
                  <select
                    value={formData.installments}
                    onChange={(e) => handleInputChange('installments', e.target.value)}
                    className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  >
                    {opcoesParcelas.map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label} - {formatarPreco(calcularValorParcelado(planoSelecionado.preco, parseInt(opcao.value)))}
                        {parseInt(opcao.value) === 1 ? '' : ` x ${opcao.value}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botão de Finalizar */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-[#2A2F8D] text-white px-12 py-4 rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 text-lg font-semibold font-inter"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Processando Pagamento...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6" />
                      <span>Finalizar Contratação</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar - Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 sticky top-6">
              <h3 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Resumo do Pedido</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-semibold text-[#1D2129] font-inter">{planoSelecionado.nome}</p>
                  <p className="text-[#656D7A] font-inter">{planoSelecionado.seguradora}</p>
                </div>
                
                <hr className="border-[#E9EDF2]" />
                
                <div className="flex justify-between items-center">
                  <span className="text-[#656D7A] font-inter">Valor mensal:</span>
                  <span className="font-semibold text-[#1D2129] font-inter">
                    {formatarPreco(planoSelecionado.preco)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#656D7A] font-inter">Parcelamento:</span>
                  <span className="font-semibold text-[#1D2129] font-inter">
                    {opcoesParcelas.find(op => op.value === formData.installments)?.label}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#656D7A] font-inter">Valor da parcela:</span>
                  <span className="font-semibold text-[#1D2129] font-inter">
                    {formatarPreco(calcularValorParcelado(planoSelecionado.preco, parseInt(formData.installments)))}
                  </span>
                </div>
                
                <hr className="border-[#E9EDF2]" />
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-[#1D2129] font-inter">Total:</span>
                  <span className="font-bold text-[#1D2129] font-inter">
                    {formatarPreco(planoSelecionado.preco)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-800 font-inter">Pagamento Seguro</p>
                      <p className="text-sm text-green-700 font-inter">
                        Seus dados estão protegidos com criptografia SSL
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800 font-inter">Cobertura Imediata</p>
                      <p className="text-sm text-blue-700 font-inter">
                        Seu seguro entra em vigor após aprovação do pagamento
                      </p>
                    </div>
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
