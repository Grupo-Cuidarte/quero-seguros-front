'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, LogOut, User, Home, CheckCircle, Download, FileText, Phone, Mail, Calendar, Star, ArrowRight } from 'lucide-react'

interface Plano {
  seguradora: string
  nome: string
  preco: number
}

interface UserData {
  name: string
  email: string
}

export default function SucessoResidencialPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [planoContratado, setPlanoContratado] = useState<Plano | null>(null)
  const [numeroApolice] = useState(() => 'RES' + Math.random().toString(36).substr(2, 9).toUpperCase())

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const savedPlano = localStorage.getItem('plano_selecionado')
    if (savedPlano) {
      setPlanoContratado(JSON.parse(savedPlano))
    }

    // Limpar dados da cotação após sucesso
    localStorage.removeItem('cotacao_residencial_data')
    localStorage.removeItem('dados_contratacao')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('plano_selecionado')
    router.push('/')
  }

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  const proximosPassos = [
    {
      icone: <Mail className="w-6 h-6" />,
      titulo: 'Email de Confirmação',
      descricao: 'Você receberá todos os documentos da apólice por email',
      prazo: 'Em até 5 minutos'
    },
    {
      icone: <Phone className="w-6 h-6" />,
      titulo: 'Contato da Seguradora',
      descricao: 'A seguradora entrará em contato para orientações finais',
      prazo: 'Em até 24 horas'
    },
    {
      icone: <FileText className="w-6 h-6" />,
      titulo: 'Documentos Físicos',
      descricao: 'Apólice física será enviada para seu endereço (opcional)',
      prazo: 'Em até 7 dias úteis'
    }
  ]

  const documentosDisponiveis = [
    { nome: 'Apólice de Seguro', tipo: 'PDF', tamanho: '2.1 MB' },
    { nome: 'Condições Gerais', tipo: 'PDF', tamanho: '1.8 MB' },
    { nome: 'Manual do Segurado', tipo: 'PDF', tamanho: '3.2 MB' },
    { nome: 'Certificado Digital', tipo: 'PDF', tamanho: '0.8 MB' }
  ]

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-green-100 rounded-full">
              <span className="text-green-600 text-sm font-medium font-inter">Contratação Realizada</span>
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
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#2A2F8D] text-white px-6 py-2 rounded-lg hover:bg-[#1E2464] transition-colors font-medium font-inter"
                >
                  Ir para Dashboard
                </button>
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
        {/* Hero - Sucesso */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#1D2129] mb-4 font-inter">
            Parabéns! Seu seguro foi contratado
          </h1>
          <p className="text-xl text-[#656D7A] mb-8 font-inter">
            Sua residência está protegida a partir de agora
          </p>
          
          {/* Número da Apólice */}
          <div className="inline-flex items-center bg-white border-2 border-green-200 rounded-xl px-6 py-4">
            <Home className="w-8 h-8 text-green-600 mr-4" />
            <div className="text-left">
              <p className="text-sm text-[#656D7A] font-inter">Número da Apólice</p>
              <p className="text-2xl font-bold text-[#1D2129] font-inter">{numeroApolice}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Plano Contratado */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resumo da Contratação */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h2 className="text-2xl font-bold text-[#1D2129] mb-6 font-inter">Resumo da Contratação</h2>
              
              {planoContratado && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-[#656D7A] font-inter">Plano Contratado</label>
                      <p className="text-lg font-semibold text-[#1D2129] font-inter">{planoContratado.nome}</p>
                    </div>
                    <div>
                      <label className="text-sm text-[#656D7A] font-inter">Seguradora</label>
                      <p className="text-lg font-semibold text-[#1D2129] font-inter">{planoContratado.seguradora}</p>
                    </div>
                    <div>
                      <label className="text-sm text-[#656D7A] font-inter">Vigência</label>
                      <p className="text-lg font-semibold text-[#1D2129] font-inter">12 meses</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-[#656D7A] font-inter">Valor Mensal</label>
                      <p className="text-2xl font-bold text-green-600 font-inter">
                        {formatarPreco(planoContratado.preco)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-[#656D7A] font-inter">Início da Vigência</label>
                      <p className="text-lg font-semibold text-[#1D2129] font-inter">
                        {new Date().toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-[#656D7A] font-inter">Renovação</label>
                      <p className="text-lg font-semibold text-[#1D2129] font-inter">Automática</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <p className="font-semibold text-green-800 font-inter">Cobertura Ativa</p>
                    <p className="text-green-700 font-inter">
                      Sua residência já está protegida contra os riscos cobertos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Próximos Passos */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h3 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Próximos Passos</h3>
              
              <div className="space-y-6">
                {proximosPassos.map((passo, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#2A2F8D] text-white rounded-lg flex items-center justify-center mr-4">
                      {passo.icone}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1D2129] mb-1 font-inter">{passo.titulo}</h4>
                      <p className="text-[#656D7A] mb-1 font-inter">{passo.descricao}</p>
                      <p className="text-sm text-[#2A2F8D] font-semibold font-inter">{passo.prazo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentos */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h3 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Seus Documentos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentosDisponiveis.map((doc, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between p-4 border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] transition-colors group"
                  >
                    <div className="flex items-center">
                      <FileText className="w-6 h-6 text-[#656D7A] group-hover:text-[#2A2F8D] mr-3" />
                      <div className="text-left">
                        <p className="font-semibold text-[#1D2129] font-inter">{doc.nome}</p>
                        <p className="text-sm text-[#656D7A] font-inter">{doc.tipo} • {doc.tamanho}</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-[#656D7A] group-hover:text-[#2A2F8D]" />
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 font-inter">Documentos por Email</p>
                    <p className="text-sm text-blue-700 font-inter">
                      Todos os documentos também serão enviados para seu email
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contatos de Emergência */}
            <div className="bg-white rounded-2xl border border-[#E9EDF2] p-8">
              <h3 className="text-xl font-bold text-[#1D2129] mb-6 font-inter">Contatos Importantes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2 font-inter">Emergência 24h</h4>
                  <p className="text-2xl font-bold text-red-600 font-inter">0800 123 4567</p>
                  <p className="text-sm text-red-700 font-inter">Para sinistros e emergências</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 font-inter">Atendimento Geral</h4>
                  <p className="text-2xl font-bold text-blue-600 font-inter">0800 987 6543</p>
                  <p className="text-sm text-blue-700 font-inter">Dúvidas e informações</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Ações Rápidas */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Avaliação */}
              <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6">
                <h3 className="text-lg font-bold text-[#1D2129] mb-4 font-inter">Avalie nossa experiência</h3>
                
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-yellow-400 hover:text-yellow-500">
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
                
                <textarea
                  className="w-full px-3 py-2 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  rows={3}
                  placeholder="Deixe seu comentário (opcional)"
                />
                
                <button className="w-full mt-3 bg-[#2A2F8D] text-white py-2 rounded-lg hover:bg-[#1E2464] transition-colors font-inter">
                  Enviar Avaliação
                </button>
              </div>

              {/* Ações Rápidas */}
              <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6">
                <h3 className="text-lg font-bold text-[#1D2129] mb-4 font-inter">Ações Rápidas</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full flex items-center justify-between p-3 border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] hover:bg-[#F7F9FC] transition-colors group"
                  >
                    <span className="text-[#1D2129] font-inter">Ir para Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-[#656D7A] group-hover:text-[#2A2F8D]" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] hover:bg-[#F7F9FC] transition-colors group">
                    <span className="text-[#1D2129] font-inter">Contratar Outro Seguro</span>
                    <ArrowRight className="w-4 h-4 text-[#656D7A] group-hover:text-[#2A2F8D]" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 border border-[#E9EDF2] rounded-lg hover:border-[#2A2F8D] hover:bg-[#F7F9FC] transition-colors group">
                    <span className="text-[#1D2129] font-inter">Indicar para Amigos</span>
                    <ArrowRight className="w-4 h-4 text-[#656D7A] group-hover:text-[#2A2F8D]" />
                  </button>
                </div>
              </div>

              {/* Suporte */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-orange-800 mb-4 font-inter">Precisa de Ajuda?</h3>
                
                <p className="text-orange-700 mb-4 font-inter">
                  Nossa equipe está pronta para ajudar com qualquer dúvida
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-orange-700">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="font-inter">0800 555 0123</span>
                  </div>
                  <div className="flex items-center text-orange-700">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="font-inter">suporte@queroseguros.com</span>
                  </div>
                  <div className="flex items-center text-orange-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-inter">Seg-Sex: 8h às 18h</span>
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
