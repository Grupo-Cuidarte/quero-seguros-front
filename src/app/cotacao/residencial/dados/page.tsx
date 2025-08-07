'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Home, Edit3, CheckCircle } from 'lucide-react'

interface Plano {
  seguradora: string
  nome: string
  preco: number
}

interface UserData {
  name: string
  email: string
  phone?: string
  cpf?: string
  birthDate?: string
  address?: string
  city?: string
  state?: string
  cep?: string
}

interface FormData {
  name: string
  email: string
  phone: string
  birthDate: string
  address: string
  city: string
  state: string
  cep: string
}

export default function DadosResidencialPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',
    state: '',
    cep: ''
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData: UserData = JSON.parse(savedUser)
      setUser(userData)
      
      // Auto-preencher formulário com dados do usuário
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        birthDate: userData.birthDate || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        cep: userData.cep || ''
      })
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
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
    if (!formData.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória'
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório'
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória'
    if (!formData.state) newErrors.state = 'Estado é obrigatório'
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório'

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.phone && !/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido'
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
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Salvar dados
      localStorage.setItem('dados_contratacao', JSON.stringify(formData))
      
      // Redirecionar para plano
      router.push('/cotacao/residencial/plano')
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      alert('Erro ao salvar seus dados. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  if (!planoSelecionado) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A2F8D]"></div>
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
              <span className="text-orange-600 text-sm font-medium font-inter">Confirmação de Dados</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/residencial/resultados')}
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
            <Home className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1D2129] mb-4 font-inter">
            Confirme seus dados
          </h1>
          <p className="text-lg text-[#656D7A] font-inter">
            Verifique se suas informações estão corretas para finalizar a contratação
          </p>
        </div>

        {/* Plano Selecionado */}
        <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1D2129] font-inter">
                {planoSelecionado.nome}
              </h3>
              <p className="text-[#656D7A] font-inter">{planoSelecionado.seguradora}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#1D2129] font-inter">
                {formatarPreco(planoSelecionado.preco)}
              </div>
              <div className="text-sm text-[#656D7A] font-inter">por mês</div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1D2129] font-inter">Seus Dados Pessoais</h2>
            {user && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 text-[#2A2F8D] hover:text-[#1E2464] transition-colors font-inter"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? 'Cancelar Edição' : 'Editar Dados'}</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={Boolean(user && !isEditing)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.name ? 'border-red-300' : 'border-[#E9EDF2]'
                  } ${user && !isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Seu nome completo"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 font-inter">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={Boolean(user && !isEditing)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.email ? 'border-red-300' : 'border-[#E9EDF2]'
                  } ${user && !isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1 font-inter">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={Boolean(user && !isEditing)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.phone ? 'border-red-300' : 'border-[#E9EDF2]'
                  } ${user && !isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1 font-inter">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  disabled={Boolean(user && !isEditing)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.birthDate ? 'border-red-300' : 'border-[#E9EDF2]'
                  } ${user && !isEditing ? 'bg-gray-50' : ''}`}
                />
                {errors.birthDate && <p className="text-red-500 text-sm mt-1 font-inter">{errors.birthDate}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={Boolean(user && !isEditing)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.address ? 'border-red-300' : 'border-[#E9EDF2]'
                  } ${user && !isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Rua, número, complemento"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1 font-inter">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={Boolean(user && !isEditing)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.city ? 'border-red-300' : 'border-[#E9EDF2]'
                  } ${user && !isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Sua cidade"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1 font-inter">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Estado *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  disabled={Boolean(user && !isEditing)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.state ? 'border-red-300' : 'border-[#E9EDF2]'
                  } ${user && !isEditing ? 'bg-gray-50' : ''}`}
                >
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="PR">Paraná</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="BA">Bahia</option>
                  <option value="GO">Goiás</option>
                  <option value="DF">Distrito Federal</option>
                </select>
                {errors.state && <p className="text-red-500 text-sm mt-1 font-inter">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  CEP *
                </label>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  disabled={Boolean(user && !isEditing)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.cep ? 'border-red-300' : 'border-[#E9EDF2]'
                  } ${user && !isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="12345-678"
                />
                {errors.cep && <p className="text-red-500 text-sm mt-1 font-inter">{errors.cep}</p>}
              </div>
            </div>

            {user && !isEditing && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium font-inter">
                    Dados preenchidos automaticamente da sua conta
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2A2F8D] text-white px-12 py-4 rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 text-lg font-semibold font-inter"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Confirmar e Continuar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
