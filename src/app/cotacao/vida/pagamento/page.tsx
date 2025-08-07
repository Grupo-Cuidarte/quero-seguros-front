'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Heart, CreditCard, Lock, Calendar, DollarSign, Check } from 'lucide-react'

interface PlanConfig {
  quote: any
  selectedCoverages: string[]
  totalPrice: number
}

interface PaymentData {
  cpf: string
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
  installments: string
}

export default function PagamentoVidaPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [planConfig, setPlanConfig] = useState<PlanConfig | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cpf: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: '1'
  })
  const [errors, setErrors] = useState<Partial<PaymentData>>({})

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedPlanConfig = localStorage.getItem('cotacao_vida_plan_config')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedPlanConfig) {
      setPlanConfig(JSON.parse(savedPlanConfig))
    } else {
      router.push('/cotacao/vida/plano')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    let formattedValue = value

    // Formatações específicas
    if (field === 'cpf') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim()
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2')
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
    }

    setPaymentData(prev => ({ ...prev, [field]: formattedValue }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentData> = {}

    if (!paymentData.cpf || paymentData.cpf.length < 14) {
      newErrors.cpf = 'CPF é obrigatório'
    }
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Número do cartão é obrigatório'
    }
    if (!paymentData.cardName) {
      newErrors.cardName = 'Nome no cartão é obrigatório'
    }
    if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Data de validade é obrigatória'
    }
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simular API call de pagamento
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Salvar dados finais do contrato
      const contractData = {
        planConfig,
        paymentData,
        contractDate: new Date().toISOString(),
        contractNumber: `VID-${Date.now()}`
      }
      
      localStorage.setItem('cotacao_vida_contract', JSON.stringify(contractData))
      
      // Redirecionar para sucesso
      router.push('/cotacao/vida/sucesso')
    } catch (error) {
      console.error('Erro no pagamento:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateInstallmentValue = (installments: number) => {
    if (!planConfig) return 0
    return planConfig.totalPrice / installments
  }

  if (!planConfig) {
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
              <span className="text-green-600 text-sm font-medium font-inter">Seguro Vida - Pagamento</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/vida/plano')}
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
          
          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-3xl mb-6">
                <Heart className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-[#1D2129] mb-4 font-inter">
                Finalizar Contratação
              </h1>
              <p className="text-lg text-[#656D7A] font-inter">
                Preencha os dados de pagamento para ativar sua proteção
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* CPF */}
              <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
                <h2 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Dados Pessoais</h2>
                
                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={paymentData.cpf}
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
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                        errors.cardNumber ? 'border-red-300' : 'border-[#E9EDF2]'
                      }`}
                      placeholder="1234 5678 9012 3456"
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
                      value={paymentData.cardName}
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
                      value={paymentData.expiryDate}
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
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                        errors.cvv ? 'border-red-300' : 'border-[#E9EDF2]'
                      }`}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1 font-inter">{errors.cvv}</p>}
                  </div>
                </div>
              </div>

              {/* Parcelamento */}
              <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
                <h2 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Parcelamento</h2>
                
                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    Dividir em quantas vezes? *
                  </label>
                  <select
                    value={paymentData.installments}
                    onChange={(e) => handleInputChange('installments', e.target.value)}
                    className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  >
                    <option value="1">1x de R$ {planConfig.totalPrice.toFixed(2)} (à vista)</option>
                    <option value="2">2x de R$ {calculateInstallmentValue(2).toFixed(2)}</option>
                    <option value="3">3x de R$ {calculateInstallmentValue(3).toFixed(2)}</option>
                    <option value="6">6x de R$ {calculateInstallmentValue(6).toFixed(2)}</option>
                    <option value="12">12x de R$ {calculateInstallmentValue(12).toFixed(2)}</option>
                  </select>
                </div>

                <div className="mt-4 p-4 bg-[#F0F8FF] border border-[#87CEEB] rounded-lg">
                  <p className="text-sm text-[#2C5282] font-inter">
                    💳 <strong>Pagamento seguro:</strong> Seus dados são protegidos por criptografia SSL de 256 bits.
                  </p>
                </div>
              </div>

              {/* Botão Submit */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2A2F8D] text-white px-12 py-4 rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 text-lg font-semibold font-inter"
                >
                  {isSubmitting ? (
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

          {/* Resumo Final */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 sticky top-6">
              <h3 className="text-lg font-bold text-[#1D2129] mb-6 font-inter">Resumo Final</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[#656D7A] font-inter">Seguradora:</span>
                  <span className="font-medium text-[#1D2129] font-inter">{planConfig.quote.seguradora}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[#656D7A] font-inter">Plano:</span>
                  <span className="font-medium text-[#1D2129] font-inter">{planConfig.quote.plano}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[#656D7A] font-inter">Cobertura:</span>
                  <span className="font-bold text-[#1D2129] font-inter">
                    R$ {planConfig.quote.cobertura.toLocaleString()}
                  </span>
                </div>
                
                <div className="border-t border-[#E9EDF2] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1D2129] font-inter">Total Mensal:</span>
                    <span className="text-2xl font-bold text-[#00BA88] font-inter">
                      R$ {planConfig.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-[#00BA88]" />
                  <span className="text-sm text-[#656D7A] font-inter">Ativação imediata</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-[#00BA88]" />
                  <span className="text-sm text-[#656D7A] font-inter">7 dias para arrependimento</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-[#00BA88]" />
                  <span className="text-sm text-[#656D7A] font-inter">Suporte 24h por telefone</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#2A2F8D] to-[#1E2464] rounded-xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-5 h-5 text-[#00C2FF]" />
                  <span className="font-semibold font-inter">Pagamento Seguro</span>
                </div>
                <p className="text-sm text-white/90 font-inter">
                  Transação protegida por criptografia SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
