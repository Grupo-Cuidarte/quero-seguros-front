'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, User, LogOut, Edit3, Check, X, MapPin, Phone, Mail, Calendar } from 'lucide-react'

export default function DadosAutoPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dadosPessoais, setDadosPessoais] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: ''
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedPlano = localStorage.getItem('planoSelecionado')
    
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      
      // Auto-preencher dados se usuário está logado
      setDadosPessoais(prev => ({
        ...prev,
        nomeCompleto: userData.name || '',
        email: userData.email || ''
      }))
    } else {
      // Se não está logado, permitir edição
      setIsEditing(true)
    }
    
    if (savedPlano) {
      setPlanoSelecionado(JSON.parse(savedPlano))
    } else {
      router.push('/cotacao/auto/resultados')
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setDadosPessoais(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveData = () => {
    setIsEditing(false)
    // Aqui salvaria os dados no localStorage ou backend
    localStorage.setItem('dadosPessoais', JSON.stringify(dadosPessoais))
  }

  const handleContinuar = async () => {
    setIsLoading(true)
    
    // Salvar dados
    localStorage.setItem('dadosPessoais', JSON.stringify(dadosPessoais))
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push('/cotacao/auto/plano')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const isFormValid = dadosPessoais.nomeCompleto && dadosPessoais.email && 
                     dadosPessoais.telefone && dadosPessoais.dataNascimento

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 text-sm font-medium font-inter">Dados Pessoais</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/auto/resultados')}
              className="flex items-center space-x-2 text-[#656D7A] hover:text-[#2A2F8D] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-inter">Voltar às Cotações</span>
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
          
          {/* Formulário de Dados */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1D2129] font-inter">Seus Dados</h2>
                {user && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 text-[#2A2F8D] hover:text-[#1E2464] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="font-medium font-inter">
                      {isEditing ? 'Cancelar' : 'Editar'}
                    </span>
                  </button>
                )}
              </div>

              {user && !isEditing && (
                <div className="mb-6 p-4 bg-[#F0F8FF] border border-[#87CEEB] rounded-lg">
                  <p className="text-sm text-[#2C5282] font-inter">
                    ✅ Dados preenchidos automaticamente a partir do seu cadastro. 
                    Clique em "Editar" se precisar alterar alguma informação.
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {/* Dados Básicos */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1D2129] mb-4 font-inter flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#2A2F8D]" />
                    Informações Básicas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        disabled={!isEditing}
                        value={dadosPessoais.nomeCompleto}
                        onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter disabled:bg-[#F7F9FC] disabled:text-[#656D7A]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                        Data de Nascimento *
                      </label>
                      <input
                        type="date"
                        required
                        disabled={!isEditing}
                        value={dadosPessoais.dataNascimento}
                        onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                        className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter disabled:bg-[#F7F9FC] disabled:text-[#656D7A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Contato */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1D2129] mb-4 font-inter flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-[#2A2F8D]" />
                    Contato
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        disabled={!isEditing}
                        value={dadosPessoais.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter disabled:bg-[#F7F9FC] disabled:text-[#656D7A]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                        Telefone/WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        disabled={!isEditing}
                        value={dadosPessoais.telefone}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter disabled:bg-[#F7F9FC] disabled:text-[#656D7A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Endereço (Opcional) */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1D2129] mb-4 font-inter flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#2A2F8D]" />
                    Endereço (Opcional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                        Endereço Completo
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={dadosPessoais.endereco}
                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                        placeholder="Rua, número, complemento"
                        className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter disabled:bg-[#F7F9FC] disabled:text-[#656D7A]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                        Cidade
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={dadosPessoais.cidade}
                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                        placeholder="Sua cidade"
                        className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter disabled:bg-[#F7F9FC] disabled:text-[#656D7A]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                        Estado
                      </label>
                      <select
                        disabled={!isEditing}
                        value={dadosPessoais.estado}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter disabled:bg-[#F7F9FC] disabled:text-[#656D7A]"
                      >
                        <option value="">Selecionar</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="PR">Paraná</option>
                        <option value="SC">Santa Catarina</option>
                        {/* Adicionar outros estados */}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-[#E9EDF2]">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-[#656D7A] border border-[#E9EDF2] rounded-lg hover:bg-[#F7F9FC] transition-colors font-inter"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancelar</span>
                    </button>
                    <button
                      onClick={handleSaveData}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#2A2F8D] text-white rounded-lg hover:bg-[#1E2464] transition-colors font-inter"
                    >
                      <Check className="w-4 h-4" />
                      <span>Salvar Dados</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumo do Plano */}
          <div>
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 sticky top-4">
              <h3 className="text-lg font-bold text-[#1D2129] mb-4 font-inter">Plano Selecionado</h3>
              
              {planoSelecionado && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F7F9FC] rounded-lg border border-[#E9EDF2]">
                    <h4 className="font-semibold text-[#1D2129] font-inter">{planoSelecionado.seguradora}</h4>
                    <p className="text-sm text-[#656D7A] font-inter">{planoSelecionado.plano}</p>
                    <p className="text-lg font-bold text-[#2A2F8D] mt-2 font-inter">
                      {formatPrice(planoSelecionado.preco)}/mês
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-[#1D2129] font-inter">Coberturas Incluídas:</h5>
                    {planoSelecionado.cobertura.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-[#00BA88]" />
                        <span className="text-sm text-[#656D7A] font-inter">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleContinuar}
                    disabled={!isFormValid || isLoading}
                    className="w-full bg-[#2A2F8D] text-white py-3 rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium font-inter"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      'Continuar para Detalhes'
                    )}
                  </button>

                  <p className="text-xs text-[#656D7A] text-center font-inter">
                    CPF será solicitado apenas no pagamento
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
