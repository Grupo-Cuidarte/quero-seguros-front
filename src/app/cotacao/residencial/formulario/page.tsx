'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Home, DollarSign, MapPin, Calendar, Lock, AlertTriangle } from 'lucide-react'

interface FormData {
  tipoImovel: string
  areaConstituida: string
  anoPropriedade: string
  cep: string
  endereco: string
  cidade: string
  estado: string
  valorImovel: string
  valorConteudo: string
  portaria: string
  alarme: string
  garagem: string
  condominio: string
  coberturaDesejada: string
}

export default function FormularioResidencialPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [formData, setFormData] = useState<FormData>({
    tipoImovel: '',
    areaConstituida: '',
    anoPropriedade: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
    valorImovel: '',
    valorConteudo: '',
    portaria: '',
    alarme: '',
    garagem: '',
    condominio: '',
    coberturaDesejada: ''
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

    if (!formData.tipoImovel) newErrors.tipoImovel = 'Tipo de imóvel é obrigatório'
    if (!formData.areaConstituida) newErrors.areaConstituida = 'Área construída é obrigatória'
    if (!formData.cep) newErrors.cep = 'CEP é obrigatório'
    if (!formData.endereco) newErrors.endereco = 'Endereço é obrigatório'
    if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória'
    if (!formData.estado) newErrors.estado = 'Estado é obrigatório'
    if (!formData.valorImovel) newErrors.valorImovel = 'Valor do imóvel é obrigatório'
    if (!formData.valorConteudo) newErrors.valorConteudo = 'Valor do conteúdo é obrigatório'

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
      localStorage.setItem('cotacao_residencial_data', JSON.stringify(formData))
      
      // Redirecionar para resultados
      router.push('/cotacao/residencial/resultados')
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
            <div className="ml-4 px-3 py-1 bg-orange-100 rounded-full">
              <span className="text-orange-600 text-sm font-medium font-inter">Seguro Residencial - Formulário</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/residencial/inicio')}
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
            Cotação de Seguro Residencial
          </h1>
          <p className="text-lg text-[#656D7A] font-inter">
            Preencha os dados da sua propriedade para encontrar a melhor proteção
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações do Imóvel */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
            <div className="flex items-center mb-6">
              <Home className="w-6 h-6 text-[#2A2F8D] mr-3" />
              <h2 className="text-xl font-bold text-[#1D2129] font-inter">Informações do Imóvel</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Tipo de Imóvel *
                </label>
                <select
                  value={formData.tipoImovel}
                  onChange={(e) => handleInputChange('tipoImovel', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.tipoImovel ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="sobrado">Sobrado</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="studio">Studio</option>
                </select>
                {errors.tipoImovel && <p className="text-red-500 text-sm mt-1 font-inter">{errors.tipoImovel}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Área Construída (m²) *
                </label>
                <input
                  type="number"
                  value={formData.areaConstituida}
                  onChange={(e) => handleInputChange('areaConstituida', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.areaConstituida ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                  placeholder="Ex: 120"
                />
                {errors.areaConstituida && <p className="text-red-500 text-sm mt-1 font-inter">{errors.areaConstituida}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Ano de Construção
                </label>
                <input
                  type="number"
                  value={formData.anoPropriedade}
                  onChange={(e) => handleInputChange('anoPropriedade', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  placeholder="Ex: 2015"
                  min="1900"
                  max="2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  CEP *
                </label>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.cep ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                  placeholder="12345-678"
                />
                {errors.cep && <p className="text-red-500 text-sm mt-1 font-inter">{errors.cep}</p>}
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-[#2A2F8D] mr-3" />
              <h2 className="text-xl font-bold text-[#1D2129] font-inter">Localização</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.endereco ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                  placeholder="Rua, número, complemento"
                />
                {errors.endereco && <p className="text-red-500 text-sm mt-1 font-inter">{errors.endereco}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.cidade ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                  placeholder="Sua cidade"
                />
                {errors.cidade && <p className="text-red-500 text-sm mt-1 font-inter">{errors.cidade}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Estado *
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.estado ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
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
                {errors.estado && <p className="text-red-500 text-sm mt-1 font-inter">{errors.estado}</p>}
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-[#2A2F8D] mr-3" />
              <h2 className="text-xl font-bold text-[#1D2129] font-inter">Valores para Seguro</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Valor do Imóvel *
                </label>
                <select
                  value={formData.valorImovel}
                  onChange={(e) => handleInputChange('valorImovel', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.valorImovel ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="ate-200000">Até R$ 200.000</option>
                  <option value="200000-400000">R$ 200.000 - R$ 400.000</option>
                  <option value="400000-600000">R$ 400.000 - R$ 600.000</option>
                  <option value="600000-1000000">R$ 600.000 - R$ 1.000.000</option>
                  <option value="acima-1000000">Acima de R$ 1.000.000</option>
                </select>
                {errors.valorImovel && <p className="text-red-500 text-sm mt-1 font-inter">{errors.valorImovel}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Valor do Conteúdo (móveis, eletros) *
                </label>
                <select
                  value={formData.valorConteudo}
                  onChange={(e) => handleInputChange('valorConteudo', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                    errors.valorConteudo ? 'border-red-300' : 'border-[#E9EDF2]'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="ate-50000">Até R$ 50.000</option>
                  <option value="50000-100000">R$ 50.000 - R$ 100.000</option>
                  <option value="100000-200000">R$ 100.000 - R$ 200.000</option>
                  <option value="acima-200000">Acima de R$ 200.000</option>
                </select>
                {errors.valorConteudo && <p className="text-red-500 text-sm mt-1 font-inter">{errors.valorConteudo}</p>}
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-[#2A2F8D] mr-3" />
              <h2 className="text-xl font-bold text-[#1D2129] font-inter">Características de Segurança</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Portaria ou Segurança 24h
                </label>
                <select
                  value={formData.portaria}
                  onChange={(e) => handleInputChange('portaria', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Sistema de Alarme
                </label>
                <select
                  value={formData.alarme}
                  onChange={(e) => handleInputChange('alarme', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                  <option value="pretendo">Pretendo instalar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Garagem Coberta
                </label>
                <select
                  value={formData.garagem}
                  onChange={(e) => handleInputChange('garagem', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Condomínio Fechado
                </label>
                <select
                  value={formData.condominio}
                  onChange={(e) => handleInputChange('condominio', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Coberturas de Interesse
                </label>
                <textarea
                  value={formData.coberturaDesejada}
                  onChange={(e) => handleInputChange('coberturaDesejada', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  placeholder="Ex: Incêndio, Roubo, Danos elétricos, Responsabilidade civil"
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
                  <Home className="w-6 h-6" />
                  <span>Buscar Seguros Residenciais</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
