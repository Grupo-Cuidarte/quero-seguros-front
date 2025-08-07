'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, LogOut, User, Edit, Save, X, Heart, DollarSign, Star } from 'lucide-react'

interface Quote {
  id: string
  seguradora: string
  plano: string
  cobertura: number
  preco: number
}

interface UserData {
  nomeCompleto: string
  email: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  rg: string
  profissao: string
}

export default function DadosVidaPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    nomeCompleto: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    rg: '',
    profissao: ''
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedQuote = localStorage.getItem('selected_vida_quote')
    
    if (savedUser) {
      const userInfo = JSON.parse(savedUser)
      setUser(userInfo)
      
      // Auto-fill se usuário logado
      setUserData(prev => ({
        ...prev,
        nomeCompleto: userInfo.name || '',
        email: userInfo.email || ''
      }))
    }
    
    if (savedQuote) {
      setSelectedQuote(JSON.parse(savedQuote))
    } else {
      // Redirecionar se não há cotação selecionada
      router.push('/cotacao/vida/resultados')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Salvar dados
      localStorage.setItem('cotacao_vida_user_data', JSON.stringify(userData))
      
      // Redirecionar para página do plano
      router.push('/cotacao/vida/plano')
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      alert('Erro ao salvar seus dados. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateForm = () => {
    return userData.nomeCompleto && 
           userData.email && 
           userData.telefone && 
           userData.endereco && 
           userData.cidade && 
           userData.estado && 
           userData.cep
  }

  if (!selectedQuote) {
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
              <span className="text-green-600 text-sm font-medium font-inter">Seguro Vida - Dados</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/vida/resultados')}
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
          
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-3xl mb-6">
                <Heart className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-[#1D2129] mb-4 font-inter">
                Seus Dados Pessoais
              </h1>
              <p className="text-lg text-[#656D7A] font-inter">
                {user ? 'Confirme ou edite seus dados para prosseguir' : 'Preencha seus dados para continuar'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              {/* Dados Pessoais */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1D2129] font-inter">Informações Pessoais</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 text-[#2A2F8D] hover:text-[#1E2464] font-inter"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={userData.nomeCompleto}
                    onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                      !isEditing ? 'bg-[#F7F9FC] text-[#656D7A]' : ''
                    }`}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                      !isEditing ? 'bg-[#F7F9FC] text-[#656D7A]' : ''
                    }`}
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={userData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                      !isEditing ? 'bg-[#F7F9FC] text-[#656D7A]' : ''
                    }`}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    RG
                  </label>
                  <input
                    type="text"
                    value={userData.rg}
                    onChange={(e) => handleInputChange('rg', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                      !isEditing ? 'bg-[#F7F9FC] text-[#656D7A]' : ''
                    }`}
                    placeholder="12.345.678-9"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    Profissão
                  </label>
                  <input
                    type="text"
                    value={userData.profissao}
                    onChange={(e) => handleInputChange('profissao', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                      !isEditing ? 'bg-[#F7F9FC] text-[#656D7A]' : ''
                    }`}
                    placeholder="Sua profissão"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    CEP *
                  </label>
                  <input
                    type="text"
                    value={userData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                      !isEditing ? 'bg-[#F7F9FC] text-[#656D7A]' : ''
                    }`}
                    placeholder="12345-678"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    Endereço *
                  </label>
                  <input
                    type="text"
                    value={userData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                      !isEditing ? 'bg-[#F7F9FC] text-[#656D7A]' : ''
                    }`}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={userData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                      !isEditing ? 'bg-[#F7F9FC] text-[#656D7A]' : ''
                    }`}
                    placeholder="Sua cidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                    Estado *
                  </label>
                  <select
                    value={userData.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter ${
                      !isEditing ? 'bg-[#F7F9FC] text-[#656D7A]' : ''
                    }`}
                  >
                    <option value="">Selecione</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa Catarina</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!validateForm() || isSubmitting}
                  className="bg-[#2A2F8D] text-white px-8 py-3 rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold font-inter"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Continuar para o Plano</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Resumo da Cotação */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 sticky top-6">
              <h3 className="text-lg font-bold text-[#1D2129] mb-6 font-inter">Resumo da Cotação</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#656D7A] font-inter">Seguradora:</span>
                  <span className="font-medium text-[#1D2129] font-inter">{selectedQuote.seguradora}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[#656D7A] font-inter">Plano:</span>
                  <span className="font-medium text-[#1D2129] font-inter">{selectedQuote.plano}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[#656D7A] font-inter">Cobertura:</span>
                  <span className="font-bold text-[#1D2129] font-inter">
                    R$ {selectedQuote.cobertura.toLocaleString()}
                  </span>
                </div>
                
                <div className="border-t border-[#E9EDF2] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#656D7A] font-inter">Valor mensal:</span>
                    <span className="text-xl font-bold text-[#00BA88] font-inter">
                      R$ {selectedQuote.preco.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-[#F0F8FF] border border-[#87CEEB] rounded-lg">
                <div className="flex items-start space-x-2">
                  <Star className="w-5 h-5 text-[#2C5282] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#2C5282] font-inter">Proteção Garantida</p>
                    <p className="text-xs text-[#2C5282] mt-1 font-inter">
                      Sua família estará protegida em caso de imprevistos
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
