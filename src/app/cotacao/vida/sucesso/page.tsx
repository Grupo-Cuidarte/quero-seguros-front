'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, Download, Phone, MessageCircle, Mail, ArrowLeft, User, LogOut, Heart, Star, Calendar, DollarSign } from 'lucide-react'

interface ContractData {
  planConfig: {
    quote: any
    totalPrice: number
  }
  contractNumber: string
  contractDate: string
}

export default function SucessoVidaPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [contractData, setContractData] = useState<ContractData | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedContract = localStorage.getItem('cotacao_vida_contract')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedContract) {
      setContractData(JSON.parse(savedContract))
    } else {
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleDownloadContract = () => {
    // Simular download do contrato
    alert('Download do contrato iniciado! O arquivo será enviado por email também.')
  }

  const handleGoToDashboard = () => {
    // Limpar dados da cotação
    localStorage.removeItem('cotacao_vida_data')
    localStorage.removeItem('selected_vida_quote')
    localStorage.removeItem('cotacao_vida_user_data')
    localStorage.removeItem('cotacao_vida_plan_config')
    localStorage.removeItem('cotacao_vida_contract')
    
    router.push('/dashboard')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!contractData) {
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
              <span className="text-green-600 text-sm font-medium font-inter">Seguro Vida - Contratado</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
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
        {/* Success Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#1D2129] mb-4 font-inter">
            🎉 Parabéns! Sua família está protegida!
          </h1>
          <p className="text-xl text-[#656D7A] font-inter max-w-2xl mx-auto">
            Seu seguro vida foi contratado com sucesso. Você receberá um email com todos os detalhes.
          </p>
        </div>

        {/* Contract Details */}
        <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8 mb-8">
          <div className="flex items-center mb-6">
            <Heart className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-[#1D2129] font-inter">Detalhes do Contrato</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <span className="text-[#656D7A] font-inter">Número do Contrato:</span>
                <p className="font-bold text-[#2A2F8D] text-lg font-inter">{contractData.contractNumber}</p>
              </div>
              
              <div>
                <span className="text-[#656D7A] font-inter">Data de Contratação:</span>
                <p className="font-medium text-[#1D2129] font-inter">{formatDate(contractData.contractDate)}</p>
              </div>
              
              <div>
                <span className="text-[#656D7A] font-inter">Seguradora:</span>
                <p className="font-medium text-[#1D2129] font-inter">{contractData.planConfig.quote.seguradora}</p>
              </div>
              
              <div>
                <span className="text-[#656D7A] font-inter">Plano:</span>
                <p className="font-medium text-[#1D2129] font-inter">{contractData.planConfig.quote.plano}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-[#656D7A] font-inter">Cobertura Total:</span>
                <p className="font-bold text-[#1D2129] text-xl font-inter">
                  R$ {contractData.planConfig.quote.cobertura.toLocaleString()}
                </p>
              </div>
              
              <div>
                <span className="text-[#656D7A] font-inter">Valor Mensal:</span>
                <p className="font-bold text-[#00BA88] text-xl font-inter">
                  R$ {contractData.planConfig.totalPrice.toFixed(2)}
                </p>
              </div>
              
              <div>
                <span className="text-[#656D7A] font-inter">Status:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-600 font-inter">Ativo</span>
                </div>
              </div>
              
              <div>
                <span className="text-[#656D7A] font-inter">Vigência:</span>
                <p className="font-medium text-[#1D2129] font-inter">Imediata</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Download Contract */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Download className="w-8 h-8 text-[#2A2F8D] mr-3" />
              <h3 className="text-lg font-bold text-[#1D2129] font-inter">Baixar Contrato</h3>
            </div>
            <p className="text-[#656D7A] mb-4 font-inter">
              Baixe uma cópia do seu contrato em PDF para seus arquivos pessoais.
            </p>
            <button
              onClick={handleDownloadContract}
              className="w-full bg-[#2A2F8D] text-white py-3 rounded-lg hover:bg-[#1E2464] transition-colors font-semibold font-inter"
            >
              Baixar PDF
            </button>
          </div>

          {/* Go to Dashboard */}
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-[#00C2FF] mr-3" />
              <h3 className="text-lg font-bold text-[#1D2129] font-inter">Meu Hub</h3>
            </div>
            <p className="text-[#656D7A] mb-4 font-inter">
              Acesse seu dashboard para gerenciar todos os seus seguros.
            </p>
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-[#00C2FF] text-white py-3 rounded-lg hover:bg-[#00A8CC] transition-colors font-semibold font-inter"
            >
              Ir para o Hub
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-br from-[#2A2F8D] to-[#1E2464] rounded-2xl p-8 text-white mb-8">
          <h3 className="text-2xl font-bold mb-6 font-inter">Precisa de Ajuda?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-3 text-[#00C2FF]" />
              <h4 className="font-semibold mb-2 font-inter">Central de Atendimento</h4>
              <p className="text-white/90 font-inter">0800 123 4567</p>
              <p className="text-sm text-white/70 font-inter">24h por dia</p>
            </div>
            
            <div className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-3 text-[#00C2FF]" />
              <h4 className="font-semibold mb-2 font-inter">WhatsApp</h4>
              <p className="text-white/90 font-inter">(11) 99999-9999</p>
              <p className="text-sm text-white/70 font-inter">Seg a Sex, 8h às 18h</p>
            </div>
            
            <div className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-3 text-[#00C2FF]" />
              <h4 className="font-semibold mb-2 font-inter">E-mail</h4>
              <p className="text-white/90 font-inter">suporte@queroseguros.com</p>
              <p className="text-sm text-white/70 font-inter">Resposta em 24h</p>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-[#F0F8FF] border border-[#87CEEB] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[#2C5282] mb-4 font-inter">Informações Importantes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#2C5282] font-inter">
            <div className="space-y-2">
              <p>• <strong>Vigência:</strong> Seu seguro está ativo imediatamente</p>
              <p>• <strong>Carência:</strong> 24 meses para doenças preexistentes</p>
              <p>• <strong>Renovação:</strong> Automática a cada 12 meses</p>
            </div>
            <div className="space-y-2">
              <p>• <strong>Prazo de arrependimento:</strong> 7 dias corridos</p>
              <p>• <strong>Reajuste:</strong> Anual conforme IPCA + 2%</p>
              <p>• <strong>Sinistro:</strong> Comunicar em até 30 dias</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="bg-white text-[#2A2F8D] border border-[#2A2F8D] px-8 py-3 rounded-lg hover:bg-[#2A2F8D] hover:text-white transition-colors font-semibold font-inter mr-4"
            >
              Cotar Outros Seguros
            </button>
            
            <button
              onClick={handleGoToDashboard}
              className="bg-[#2A2F8D] text-white px-8 py-3 rounded-lg hover:bg-[#1E2464] transition-colors font-semibold font-inter"
            >
              Ir para o Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
