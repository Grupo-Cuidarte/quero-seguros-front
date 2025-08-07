'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Heart, Users, DollarSign, Briefcase, Calendar, AlertTriangle, Activity } from 'lucide-react'

interface FormData {
  idade: string
  sexo: string
  profissao: string
  renda: string
  estadoCivil: string
  dependentes: string
  coberturaDesejada: string
  atividadeRisco: string
  historicoSaude: string
  prazoSeguro: string
}

export default function FormularioVidaPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [formData, setFormData] = useState<FormData>({
    idade: '',
    sexo: '',
    profissao: '',
    renda: '',
    estadoCivil: '',
    dependentes: '',
    coberturaDesejada: '',
    atividadeRisco: '',
    historicoSaude: '',
    prazoSeguro: ''
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
    if (!formData.profissao) newErrors.profissao = 'Profissão é obrigatória'
    if (!formData.renda) newErrors.renda = 'Renda é obrigatória'
    if (!formData.estadoCivil) newErrors.estadoCivil = 'Estado civil é obrigatório'
    if (!formData.dependentes) newErrors.dependentes = 'Número de dependentes é obrigatório'
    if (!formData.coberturaDesejada) newErrors.coberturaDesejada = 'Cobertura é obrigatória'
    if (!formData.prazoSeguro) newErrors.prazoSeguro = 'Prazo do seguro é obrigatório'

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
      localStorage.setItem('cotacao_vida_data', JSON.stringify(formData))
      
      // Redirecionar para resultados
      router.push('/cotacao/vida/resultados')
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
            <div className="ml-4 px-3 py-1 bg-green-100 rounded-full">
              <span className="text-green-600 text-sm font-medium font-inter">Seguro Vida - Formulário</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/vida/inicio')}
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-3xl mb-6">
            <Heart className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1D2129] mb-4 font-inter">
            Cotação de Seguro Vida
          </h1>
          <p className="text-lg text-[#656D7A] font-inter">
            Preencha seus dados para encontrar a melhor proteção para sua família
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
                  placeholder="Ex: 35"
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
                  Estado Civil *
                </label>
                <select
                  value={formData.estadoCivil}
                  onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.estadoCivil ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                </select>
                {errors.estadoCivil && <p className="text-red-500 text-sm mt-1 font-inter">{errors.estadoCivil}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Número de Dependentes *
                </label>
                <select
                  value={formData.dependentes}
                  onChange={(e) => handleInputChange('dependentes', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.dependentes ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="0">Nenhum</option>
                  <option value="1">1 dependente</option>
                  <option value="2">2 dependentes</option>
                  <option value="3">3 dependentes</option>
                  <option value="4+">4 ou mais dependentes</option>
                </select>
                {errors.dependentes && <p className="text-red-500 text-sm mt-1 font-inter">{errors.dependentes}</p>}
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
                  placeholder="Ex: Engenheiro, Professor, Empresário"
                />
                {errors.profissao && <p className="text-red-500 text-sm mt-1 font-inter">{errors.profissao}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Renda Mensal *
                </label>
                <select
                  value={formData.renda}
                  onChange={(e) => handleInputChange('renda', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.renda ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="ate-2000">Até R$ 2.000</option>
                  <option value="2000-5000">R$ 2.000 - R$ 5.000</option>
                  <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
                  <option value="10000-20000">R$ 10.000 - R$ 20.000</option>
                  <option value="acima-20000">Acima de R$ 20.000</option>
                </select>
                {errors.renda && <p className="text-red-500 text-sm mt-1 font-inter">{errors.renda}</p>}
              </div>
            </div>
          </div>

          {/* Cobertura Desejada */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-[#2A2F8D] mr-3" />
              <h2 className="text-xl font-bold text-[#1D2129] font-inter">Cobertura Desejada</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Valor de Cobertura *
                </label>
                <select
                  value={formData.coberturaDesejada}
                  onChange={(e) => handleInputChange('coberturaDesejada', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.coberturaDesejada ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="100000">R$ 100.000</option>
                  <option value="200000">R$ 200.000</option>
                  <option value="300000">R$ 300.000</option>
                  <option value="500000">R$ 500.000</option>
                  <option value="1000000">R$ 1.000.000</option>
                  <option value="customizado">Valor customizado</option>
                </select>
                {errors.coberturaDesejada && <p className="text-red-500 text-sm mt-1 font-inter">{errors.coberturaDesejada}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Prazo do Seguro *
                </label>
                <select
                  value={formData.prazoSeguro}
                  onChange={(e) => handleInputChange('prazoSeguro', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.prazoSeguro ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="10-anos">10 anos</option>
                  <option value="20-anos">20 anos</option>
                  <option value="30-anos">30 anos</option>
                  <option value="ate-65">Até 65 anos</option>
                  <option value="vitalicio">Vitalício</option>
                </select>
                {errors.prazoSeguro && <p className="text-red-500 text-sm mt-1 font-inter">{errors.prazoSeguro}</p>}
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-[#F0F8FF] border border-[#87CEEB] rounded-lg">
              <p className="text-sm text-[#2C5282] font-inter">
                💡 <strong>Recomendação:</strong> Sugerimos uma cobertura de 5 a 10 vezes sua renda anual para garantir proteção adequada à sua família.
              </p>
            </div>
          </div>

          {/* Informações de Saúde e Risco */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
            <div className="flex items-center mb-6">
              <Activity className="w-6 h-6 text-[#2A2F8D] mr-3" />
              <h2 className="text-xl font-bold text-[#1D2129] font-inter">Informações de Saúde e Risco</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Atividades de Risco
                </label>
                <textarea
                  value={formData.atividadeRisco}
                  onChange={(e) => handleInputChange('atividadeRisco', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  placeholder="Ex: Mergulho, Paraquedismo, Motociclismo, ou 'Nenhuma'"
                  rows={3}
                />
              </div>

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
                  <span>Buscar Melhores Seguros</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
