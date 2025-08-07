'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, User, LogOut, MessageCircle, Send, Bot, Clock } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'bot' | 'user'
  message: string
  timestamp: Date
}

const autoQuestions = [
  {
    id: 'welcome',
    message: 'Olá! 👋 Vou te ajudar a cotar o seguro do seu carro. Qual é a marca do seu veículo?',
    type: 'text',
    field: 'marca'
  },
  {
    id: 'modelo',
    message: 'Perfeito! Agora me diga o modelo do seu {marca}:',
    type: 'text',
    field: 'modelo'
  },
  {
    id: 'ano',
    message: 'Ótimo! Qual é o ano do seu {marca} {modelo}?',
    type: 'number',
    field: 'ano'
  },
  {
    id: 'valor',
    message: 'E qual é o valor aproximado do seu veículo? (Valor FIPE)',
    type: 'currency',
    field: 'valor'
  },
  {
    id: 'cep',
    message: 'Onde seu carro fica estacionado? Me diga o CEP:',
    type: 'text',
    field: 'cep'
  },
  {
    id: 'idade',
    message: 'Qual a sua idade? (Isso ajuda a calcular o melhor preço)',
    type: 'number',
    field: 'idade'
  },
  {
    id: 'final',
    message: 'Perfeito! 🎉 Agora vou buscar as melhores cotações para você. Isso pode levar alguns segundos...',
    type: 'final',
    field: 'complete'
  }
]

export default function ChatbotAutoPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    // Inicializar primeira mensagem
    addBotMessage(autoQuestions[0].message)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addBotMessage = (message: string, delay = 1000) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        message: message.replace(/\{(\w+)\}/g, (match, key) => formData[key] || match),
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, delay)
  }

  const addUserMessage = (message: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      message,
      timestamp: new Date()
    }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    const currentQuestion = autoQuestions[currentQuestionIndex]
    addUserMessage(userInput)
    
    // Salvar resposta
    const newFormData = { ...formData, [currentQuestion.field]: userInput }
    setFormData(newFormData)
    
    setUserInput('')
    
    // Próxima pergunta
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < autoQuestions.length) {
      setCurrentQuestionIndex(nextIndex)
      const nextQuestion = autoQuestions[nextIndex]
      
      if (nextQuestion.type === 'final') {
        addBotMessage(nextQuestion.message, 1500)
        setTimeout(() => {
          setIsLoading(true)
          // Salvar dados e redirecionar
          localStorage.setItem('cotacaoData', JSON.stringify(newFormData))
          router.push('/cotacao/auto/resultados')
        }, 3000)
      } else {
        addBotMessage(nextQuestion.message, 1500)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-sm font-medium font-inter">Seguro Auto - Assistente</span>
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

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        
        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#1D2129] font-inter">Progresso da Cotação</span>
            <span className="text-sm text-[#656D7A] font-inter">{currentQuestionIndex + 1} de {autoQuestions.length}</span>
          </div>
          <div className="w-full bg-[#E9EDF2] rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#2A2F8D] to-[#00C2FF] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / autoQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-[#2A2F8D]' 
                      : 'bg-gradient-to-br from-[#00C2FF] to-[#2A2F8D]'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-4 py-3 max-w-md ${
                      message.type === 'user'
                        ? 'bg-[#2A2F8D] text-white'
                        : 'bg-white border border-[#E9EDF2] text-[#1D2129]'
                    }`}>
                      <p className="font-inter">{message.message}</p>
                    </div>
                    <span className="text-xs text-[#656D7A] mt-1 font-inter">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#2A2F8D] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-[#E9EDF2] rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#656D7A] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#656D7A] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#656D7A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="bg-white rounded-2xl border border-[#E9EDF2] p-6 flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A2F8D]"></div>
                <div>
                  <p className="font-medium text-[#1D2129] font-inter">Buscando cotações...</p>
                  <p className="text-sm text-[#656D7A] font-inter">Comparando preços de +20 seguradoras</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {currentQuestionIndex < autoQuestions.length - 1 && !isLoading && (
          <div className="bg-white border-t border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Digite sua resposta..."
                  className="w-full px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                  disabled={isTyping}
                />
              </div>
              <button
                type="submit"
                disabled={!userInput.trim() || isTyping}
                className="bg-[#2A2F8D] text-white p-3 rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
