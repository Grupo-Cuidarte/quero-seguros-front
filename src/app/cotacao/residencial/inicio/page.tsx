'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, MessageCircle, FileText, ArrowLeft, User, LogOut, Zap, Clock, Bot, Users, Star, Home } from 'lucide-react'

export default function InicioResidencialPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

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

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-orange-100 rounded-full">
              <span className="text-orange-600 text-sm font-medium font-inter">Seguro Residencial</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-3xl mb-6">
            <Home className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#1D2129] mb-4 font-inter">
            Seguro Residencial
          </h1>
          <p className="text-xl text-[#656D7A] mb-8 font-inter max-w-2xl mx-auto">
            Proteja seu lar contra incêndios, roubos, danos elétricos e muito mais. Escolha como prefere fazer sua cotação:
          </p>
        </div>

        {/* Opções de Cotação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Chatbot Option */}
          <div 
            onClick={() => router.push('/cotacao/residencial/chatbot')}
            className="bg-white rounded-2xl border border-[#E9EDF2] hover:border-[#2A2F8D] transition-all duration-300 p-8 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-[#FFD700] fill-current" />
                <span className="text-xs font-medium text-[#656D7A] font-inter">Recomendado</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2A2F8D] to-[#00C2FF] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-[#1D2129] mb-4 font-inter">
              Assistente Inteligente
            </h3>
            
            <p className="text-[#656D7A] leading-relaxed mb-6 font-inter">
              Conversa sobre sua casa, localização e necessidades específicas. Perguntas simples para encontrar a melhor proteção.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-[#00BA88]" />
                <span className="text-sm text-[#656D7A] font-inter">Mais rápido e intuitivo</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-[#00BA88]" />
                <span className="text-sm text-[#656D7A] font-inter">Conversa natural</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#00BA88]" />
                <span className="text-sm text-[#656D7A] font-inter">3-4 minutos</span>
              </div>
            </div>
            
            <div className="w-full bg-[#2A2F8D] text-white py-4 rounded-lg font-semibold transition-all duration-300 group-hover:bg-[#1E2464] font-inter text-center">
              Começar Conversa
            </div>
          </div>

          {/* Formulário Traditional */}
          <div 
            onClick={() => router.push('/cotacao/residencial/formulario')}
            className="bg-white rounded-2xl border border-[#E9EDF2] hover:border-[#2A2F8D] transition-all duration-300 p-8 cursor-pointer group"
          >
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F7F9FC] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-[#2A2F8D]" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-[#1D2129] mb-4 font-inter">
              Formulário Tradicional
            </h3>
            
            <p className="text-[#656D7A] leading-relaxed mb-6 font-inter">
              Preencha um formulário detalhado com informações sobre sua propriedade e localização.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-[#00BA88]" />
                <span className="text-sm text-[#656D7A] font-inter">Controle total dos dados</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-[#00BA88]" />
                <span className="text-sm text-[#656D7A] font-inter">Formato familiar</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#00BA88]" />
                <span className="text-sm text-[#656D7A] font-inter">4-5 minutos</span>
              </div>
            </div>
            
            <div className="w-full bg-[#2A2F8D] text-white py-4 rounded-lg font-semibold transition-all duration-300 group-hover:bg-[#1E2464] font-inter text-center">
              Preencher Formulário
            </div>
          </div>
        </div>

        {/* Informações Específicas para Residencial */}
        <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
          <h3 className="text-xl font-bold text-[#1D2129] mb-4 font-inter">
            O que você vai precisar:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-[#1D2129] font-inter">Sobre a Propriedade:</h4>
              <ul className="text-sm text-[#656D7A] space-y-1 font-inter">
                <li>• Tipo de imóvel (casa/apartamento)</li>
                <li>• Área construída em m²</li>
                <li>• Ano de construção</li>
                <li>• CEP e endereço completo</li>
                <li>• Valor do imóvel e conteúdo</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-[#1D2129] font-inter">Características de Segurança:</h4>
              <ul className="text-sm text-[#656D7A] space-y-1 font-inter">
                <li>• Portaria ou segurança 24h</li>
                <li>• Sistema de alarme</li>
                <li>• Grades e fechaduras</li>
                <li>• Garagem coberta</li>
                <li>• Condomínio fechado</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-[#FFF5F0] border border-[#FED7AA] rounded-lg">
            <p className="text-sm text-[#EA580C] font-inter">
              🏠 <strong>Dica:</strong> Tenha em mãos informações sobre sua casa como metragem, 
              valor estimado dos móveis e eletrônicos, e medidas de segurança já existentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
