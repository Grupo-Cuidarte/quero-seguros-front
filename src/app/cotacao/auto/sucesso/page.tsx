'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, Download, Mail, Phone, Calendar, FileText, Home, User } from 'lucide-react'

export default function SucessoAutoPage() {
  const router = useRouter()
  const [contratoFinalizado, setContratoFinalizado] = useState<any>(null)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedContrato = localStorage.getItem('contratoFinalizado')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedContrato) {
      setContratoFinalizado(JSON.parse(savedContrato))
    } else {
      router.push('/')
    }
  }, [router])

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleDownloadPDF = () => {
    // Simular download do PDF
    alert('PDF da apólice será enviado por email e estará disponível no seu dashboard!')
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-[#2A2F8D] text-white px-6 py-2 rounded-lg hover:bg-[#1E2464] transition-colors font-medium font-inter"
              >
                Ir para o Dashboard
              </button>
            ) : (
              <button
                onClick={() => router.push('/')}
                className="bg-[#2A2F8D] text-white px-6 py-2 rounded-lg hover:bg-[#1E2464] transition-colors font-medium font-inter"
              >
                Voltar ao Início
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Sucesso Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#1D2129] mb-4 font-inter">
            🎉 Parabéns! Seu seguro foi contratado!
          </h1>
          <p className="text-xl text-[#656D7A] font-inter">
            Agora você está protegido com o melhor seguro auto do mercado
          </p>
        </div>

        {/* Informações do Contrato */}
        {contratoFinalizado && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Detalhes do Seguro */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h2 className="text-xl font-bold text-[#1D2129] mb-6 font-inter flex items-center">
                <Shield className="w-6 h-6 mr-3 text-[#2A2F8D]" />
                Detalhes do Contrato
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-[#E9EDF2]">
                  <span className="text-[#656D7A] font-inter">Número do Contrato</span>
                  <span className="font-bold text-[#2A2F8D] font-inter">{contratoFinalizado.numeroContrato}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-[#E9EDF2]">
                  <span className="text-[#656D7A] font-inter">Seguradora</span>
                  <span className="font-medium text-[#1D2129] font-inter">{contratoFinalizado.plano.seguradora}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-[#E9EDF2]">
                  <span className="text-[#656D7A] font-inter">Plano</span>
                  <span className="font-medium text-[#1D2129] font-inter">{contratoFinalizado.plano.plano}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-[#E9EDF2]">
                  <span className="text-[#656D7A] font-inter">Valor</span>
                  <span className="font-bold text-[#1D2129] font-inter">
                    {formatPrice(contratoFinalizado.preco)}
                    {contratoFinalizado.formaPagamento === 'anual' ? '/ano' : '/mês'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-[#656D7A] font-inter">Data de Contratação</span>
                  <span className="font-medium text-[#1D2129] font-inter">{formatDate(contratoFinalizado.dataContratacao)}</span>
                </div>
              </div>
            </div>

            {/* Próximos Passos */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h2 className="text-xl font-bold text-[#1D2129] mb-6 font-inter flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-[#2A2F8D]" />
                Próximos Passos
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#00BA88] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1D2129] font-inter">Documentos Enviados</h4>
                    <p className="text-sm text-[#656D7A] font-inter">
                      A apólice será enviada por email em até 24 horas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#2A2F8D] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1D2129] font-inter">Ativação da Cobertura</h4>
                    <p className="text-sm text-[#656D7A] font-inter">
                      Seu seguro está ativo imediatamente para acidentes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#656D7A] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1D2129] font-inter">Carência para Roubo/Furto</h4>
                    <p className="text-sm text-[#656D7A] font-inter">
                      30 dias apenas para estacionamentos privados
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <button
            onClick={handleDownloadPDF}
            className="bg-white rounded-2xl border border-[#E9EDF2] p-6 hover:border-[#2A2F8D] transition-all duration-300 text-center group"
          >
            <Download className="w-8 h-8 text-[#2A2F8D] mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-[#1D2129] mb-2 font-inter">Baixar Apólice</h3>
            <p className="text-sm text-[#656D7A] font-inter">Download do documento em PDF</p>
          </button>

          <button
            onClick={() => router.push('/sinistro')}
            className="bg-white rounded-2xl border border-[#E9EDF2] p-6 hover:border-[#2A2F8D] transition-all duration-300 text-center group"
          >
            <Phone className="w-8 h-8 text-[#2A2F8D] mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-[#1D2129] mb-2 font-inter">Emergência 24h</h3>
            <p className="text-sm text-[#656D7A] font-inter">Contatos para sinistros</p>
          </button>

          <button
            onClick={() => user ? router.push('/dashboard') : router.push('/')}
            className="bg-white rounded-2xl border border-[#E9EDF2] p-6 hover:border-[#2A2F8D] transition-all duration-300 text-center group"
          >
            {user ? (
              <User className="w-8 h-8 text-[#2A2F8D] mx-auto mb-3 group-hover:scale-110 transition-transform" />
            ) : (
              <Home className="w-8 h-8 text-[#2A2F8D] mx-auto mb-3 group-hover:scale-110 transition-transform" />
            )}
            <h3 className="font-semibold text-[#1D2129] mb-2 font-inter">
              {user ? 'Meu Dashboard' : 'Página Inicial'}
            </h3>
            <p className="text-sm text-[#656D7A] font-inter">
              {user ? 'Gerenciar meus seguros' : 'Voltar ao início'}
            </p>
          </button>
        </div>

        {/* Informações de Contato */}
        <div className="bg-gradient-to-br from-[#2A2F8D] to-[#1E2464] rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 font-inter">Precisa de Ajuda?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#00C2FF]" />
                  <span className="font-inter">0800 123 4567 (24h)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#00C2FF]" />
                  <span className="font-inter">suporte@queroseguros.com.br</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 font-inter">Documentos Importantes</h3>
              <p className="text-white/90 font-inter">
                Guarde bem o número do seu contrato: <strong>{contratoFinalizado?.numeroContrato}</strong>. 
                Você precisará dele para qualquer atendimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
