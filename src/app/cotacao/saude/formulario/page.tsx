'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Heart, Users, DollarSign, Briefcase, Calendar, AlertTriangle, Activity } from 'lucide-react'

interface FormData {
  idade: string
  sexo: string
  estadoCivil: string
  dependentes: string
  renda: string
  profissao: string
  planoCrianca: string
  planoAdulto: string
  historicoSaude: string
  medicamentos: string
  planoAnterior: string
  coberturaNacional: string
}

export default function FormularioSaudePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [formData, setFormData] = useState<FormData>({
    idade: '',
    sexo: '',
    estadoCivil: '',
    dependentes: '',
    renda: '',
    profissao: '',
    planoCrianca: '',
    planoAdulto: '',
    historicoSaude: '',
    medicamentos: '',
    planoAnterior: '',
    coberturaNacional: ''
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

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

    if (!formData.idade) newErrors.idade = 'Idade é obrigatória'
    if (!formData.sexo) newErrors.sexo = 'Sexo é obrigatório'
    if (!formData.renda) newErrors.renda = 'Renda é obrigatória'
    if (!formData.profissao) newErrors.profissao = 'Profissão é obrigatória'
    if (!formData.planoAdulto) newErrors.planoAdulto = 'Tipo de plano é obrigatório'
    if (!formData.coberturaNacional) newErrors.coberturaNacional = 'Cobertura é obrigatória'

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
      localStorage.setItem('cotacao_saude_data', JSON.stringify(formData))
      
      // Redirecionar para resultados
      router.push('/cotacao/saude/resultados')
    } catch (error) {
      console.error('Erro ao processar cotação:', error)
      alert('Erro ao processar sua cotação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-sm font-medium font-inter">Plano de Saúde - Formulário</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/saude/inicio')}
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-3xl mb-6">
            <Heart className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1D2129] mb-4 font-inter">
            Cotação de Plano de Saúde
          </h1>
          <p className="text-lg text-[#656D7A] font-inter">
            Preencha seus dados para encontrar o melhor plano de saúde para você e sua família
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Pessoais */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-[#2A2F8D] mr-3" />
              <h2 className="text-xl font-bold text-[#1D2129] font-inter">Informações Pessoais</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Idade *
                </label>
                <input
                  type="number"
                  value={formData.idade}
                  onChange={(e) => handleInputChange('idade', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.idade ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                  placeholder="Ex: 32"
                />
                {errors.idade && <p className="text-red-500 text-sm mt-1 font-inter">{errors.idade}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Sexo *
                </label>
                <select
                  value={formData.sexo}
                  onChange={(e) => handleInputChange('sexo', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.sexo ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
                {errors.sexo && <p className="text-red-500 text-sm mt-1 font-inter">{errors.sexo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Estado Civil
                </label>
                <select
                  value={formData.estadoCivil}
                  onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                >
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Dependentes para incluir no plano
                </label>
                <select
                  value={formData.dependentes}
                  onChange={(e) => handleInputChange('dependentes', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                >
                  <option value="">Selecione</option>
                  <option value="0">Nenhum</option>
                  <option value="1">1 dependente</option>
                  <option value="2">2 dependentes</option>
                  <option value="3">3 dependentes</option>
                  <option value="4+">4 ou mais dependentes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informações Profissionais */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
            <div className="flex items-center mb-6">
              <Briefcase className="w-6 h-6 text-[#2A2F8D] mr-3" />
              <h2 className="text-xl font-bold text-[#1D2129] font-inter">Informações Profissionais</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Profissão *
                </label>
                <input
                  type="text"
                  value={formData.profissao}
                  onChange={(e) => handleInputChange('profissao', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.profissao ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                  placeholder="Ex: Analista, Médico, Professor"
                />
                {errors.profissao && <p className="text-red-500 text-sm mt-1 font-inter">{errors.profissao}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Renda Familiar Mensal *
                </label>
                <select
                  value={formData.renda}
                  onChange={(e) => handleInputChange('renda', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.renda ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="ate-3000">Até R$ 3.000</option>
                  <option value="3000-6000">R$ 3.000 - R$ 6.000</option>
                  <option value="6000-10000">R$ 6.000 - R$ 10.000</option>
                  <option value="10000-20000">R$ 10.000 - R$ 20.000</option>
                  <option value="acima-20000">Acima de R$ 20.000</option>
                </select>
                {errors.renda && <p className="text-red-500 text-sm mt-1 font-inter">{errors.renda}</p>}
              </div>
            </div>
          </div>

          {/* Tipo de Plano */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
            <div className="flex items-center mb-6">
              <Heart className="w-6 h-6 text-[#2A2F8D] mr-3" />
              <h2 className="text-xl font-bold text-[#1D2129] font-inter">Tipo de Plano</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Tipo de Plano Desejado *
                </label>
                <select
                  value={formData.planoAdulto}
                  onChange={(e) => handleInputChange('planoAdulto', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.planoAdulto ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="basico">Básico - Mais econômico</option>
                  <option value="intermediario">Intermediário - Boa cobertura</option>
                  <option value="premium">Premium - Cobertura completa</option>
                </select>
                {errors.planoAdulto && <p className="text-red-500 text-sm mt-1 font-inter">{errors.planoAdulto}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Cobertura Geográfica *
                </label>
                <select
                  value={formData.coberturaNacional}
                  onChange={(e) => handleInputChange('coberturaNacional', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.coberturaNacional ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="nacional">Nacional - Todo o Brasil</option>
                  <option value="regional">Regional - Sua região</option>
                </select>
                {errors.coberturaNacional && <p className="text-red-500 text-sm mt-1 font-inter">{errors.coberturaNacional}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Filhos (idades)
                </label>
                <input
                  type="text"
                  value={formData.planoCrianca}
                  onChange={(e) => handleInputChange('planoCrianca', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  placeholder="Ex: 1 filho de 8 anos, 1 filha de 12 anos ou Não tenho filhos"
                />
              </div>
            </div>
          </div>

          {/* Informações de Saúde */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
            <div className="flex items-center mb-6">
              <Activity className="w-6 h-6 text-[#2A2F8D] mr-3" />
              <h2 className="text-xl font-bold text-[#1D2129] font-inter">Informações de Saúde</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Histórico de Saúde
                </label>
                <textarea
                  value={formData.historicoSaude}
                  onChange={(e) => handleInputChange('historicoSaude', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  placeholder="Ex: Diabetes, Hipertensão, Histórico familiar de doenças cardíacas, ou 'Nenhum'"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Medicamentos em Uso
                </label>
                <textarea
                  value={formData.medicamentos}
                  onChange={(e) => handleInputChange('medicamentos', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  placeholder="Ex: Remédio para pressão, Insulina, ou 'Nenhum'"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Plano de Saúde Anterior
                </label>
                <input
                  type="text"
                  value={formData.planoAnterior}
                  onChange={(e) => handleInputChange('planoAnterior', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  placeholder="Ex: Sim, 3 anos na Unimed ou Nunca tive plano de saúde"
                />
              </div>
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
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <Heart className="w-6 h-6" />
                  <span>Buscar Planos de Saúde</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
