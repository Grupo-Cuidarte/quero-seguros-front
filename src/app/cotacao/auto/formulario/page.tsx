'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, User, LogOut, Car, MapPin, Calendar, DollarSign, FileText } from 'lucide-react'

export default function FormularioAutoPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    valor: '',
    cep: '',
    idade: '',
    genero: '',
    estadoCivil: '',
    profissao: ''
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Salvar dados e redirecionar
    localStorage.setItem('cotacaoData', JSON.stringify(formData))
    router.push('/cotacao/auto/resultados')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const isFormValid = formData.marca && formData.modelo && formData.ano && formData.valor && formData.cep && formData.idade

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-sm font-medium font-inter">Seguro Auto - Formulário</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/auto/inicio')}
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
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Car className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1D2129] mb-2 font-inter">
            Cotação de Seguro Auto
          </h1>
          <p className="text-lg text-[#656D7A] font-inter">
            Preencha os dados abaixo para receber cotações personalizadas
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E9EDF2] p-8 space-y-8">
          
          {/* Dados do Veículo */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Car className="w-5 h-5 text-[#2A2F8D]" />
              <h3 className="text-xl font-bold text-[#1D2129] font-inter">Dados do Veículo</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Marca *
                </label>
                <select
                  required
                  value={formData.marca}
                  onChange={(e) => handleInputChange('marca', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                >
                  <option value="">Selecione a marca</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Ford">Ford</option>
                  <option value="Fiat">Fiat</option>
                  <option value="Honda">Honda</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Nissan">Nissan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Modelo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  placeholder="Ex: Gol, Onix, Ka..."
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Ano *
                </label>
                <select
                  required
                  value={formData.ano}
                  onChange={(e) => handleInputChange('ano', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                >
                  <option value="">Selecione o ano</option>
                  {Array.from({ length: 20 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return <option key={year} value={year}>{year}</option>
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Valor FIPE *
                </label>
                <input
                  type="text"
                  required
                  value={formData.valor}
                  onChange={(e) => handleInputChange('valor', e.target.value)}
                  placeholder="R$ 50.000"
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="w-5 h-5 text-[#2A2F8D]" />
              <h3 className="text-xl font-bold text-[#1D2129] font-inter">Localização</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  CEP onde o veículo fica estacionado *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  placeholder="00000-000"
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                />
              </div>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-5 h-5 text-[#2A2F8D]" />
              <h3 className="text-xl font-bold text-[#1D2129] font-inter">Dados Pessoais</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Idade *
                </label>
                <input
                  type="number"
                  required
                  min="18"
                  max="100"
                  value={formData.idade}
                  onChange={(e) => handleInputChange('idade', e.target.value)}
                  placeholder="30"
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Gênero
                </label>
                <select
                  value={formData.genero}
                  onChange={(e) => handleInputChange('genero', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                >
                  <option value="">Selecionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                  Estado Civil
                </label>
                <select
                  value={formData.estadoCivil}
                  onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                >
                  <option value="">Selecionar</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informação Adicional */}
          <div className="bg-[#F7F9FC] rounded-lg p-6 border border-[#E9EDF2]">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-[#2A2F8D] mt-1" />
              <div>
                <h4 className="font-medium text-[#1D2129] mb-2 font-inter">Informação Importante</h4>
                <p className="text-sm text-[#656D7A] font-inter">
                  Os dados pessoais completos (CPF, documentos) serão solicitados apenas no momento do pagamento. 
                  Por enquanto, precisamos apenas dessas informações básicas para calcular sua cotação.
                </p>
              </div>
            </div>
          </div>

          {/* Botão Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="bg-[#2A2F8D] text-white px-8 py-4 rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium font-inter"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Buscando Cotações...</span>
                </>
              ) : (
                <>
                  <Car className="w-5 h-5" />
                  <span>Buscar Cotações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
