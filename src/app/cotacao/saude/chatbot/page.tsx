'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Send, Bot, User, ArrowLeft, LogOut, Heart } from 'lucide-react'

interface Message {
  id: number
  type: 'bot' | 'user'
  content: string
  timestamp: Date
}

interface QuotationData {
  idade: string
  sexo: string
  estadoCivil: string
  dependentes: string
  renda: string
  profissao: string
  planoCrianca: string
  planoAdulto: string
  historicoSaude: string
  medicamentos: string
  planoAnterior: string
  coberturaNacional: string
}

const saudeQuestions = [
  {
    id: 'idade',
    question: 'Qual é a sua idade?',
    placeholder: 'Ex: 32 anos'
  },
  {
    id: 'sexo',
    question: 'Qual é o seu sexo?',
    placeholder: 'Masculino ou Feminino'
  },
  {
    id: 'estadoCivil',
    question: 'Qual é o seu estado civil?',
    placeholder: 'Solteiro, Casado, Divorciado, Viúvo'
  },
  {
    id: 'dependentes',
    question: 'Quantos dependentes (cônjuge e filhos) você quer incluir no plano?',
    placeholder: 'Ex: 2 (esposa e 1 filho)'
  },
  {
    id: 'renda',
    question: 'Qual é a sua renda familiar mensal?',
    placeholder: 'Ex: R$ 8.000'
  },
  {
    id: 'profissao',
    question: 'Qual é a sua profissão?',
    placeholder: 'Ex: Analista, Médico, Professor'
  },
  {
    id: 'planoCrianca',
    question: 'Tem filhos? Se sim, qual faixa etária?',
    placeholder: 'Ex: 1 filho de 8 anos ou Não tenho filhos'
  },
  {
    id: 'planoAdulto',
    question: 'Que tipo de plano você procura?',
    placeholder: 'Básico, Intermediário, Premium'
  },
  {
    id: 'historicoSaude',
    question: 'Você ou seus dependentes têm algum problema de saúde?',
    placeholder: 'Ex: Diabetes, Hipertensão ou Nenhum'
  },
  {
    id: 'medicamentos',
    question: 'Faz uso contínuo de algum medicamento?',
    placeholder: 'Ex: Remédio para pressão ou Nenhum'
  },
  {
    id: 'planoAnterior',
    question: 'Já teve plano de saúde antes? Se sim, por quanto tempo?',
    placeholder: 'Ex: Sim, 3 anos ou Nunca tive'
  },
  {
    id: 'coberturaNacional',
    question: 'Precisa de cobertura nacional ou apenas na sua região?',
    placeholder: 'Nacional ou Regional'
  }
]

export default function ChatbotSaudePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [quotationData, setQuotationData] = useState<Partial<QuotationData>>({})
  const [isComplete, setIsComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Mensagem inicial
    const initialMessage: Message = {
      id: 1,
      type: 'bot',
      content: 'Olá! Sou seu assistente para plano de saúde. Vou fazer algumas perguntas para encontrar a melhor opção de saúde para você e sua família. Vamos começar?',
      timestamp: new Date()
    }
    
    setMessages([initialMessage])
    
    setTimeout(() => {
      addBotMessage(saudeQuestions[0].question)
    }, 1500)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addBotMessage = (content: string) => {
    setIsTyping(true)
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now(),
        type: 'bot',
        content,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newMessage])
      setIsTyping(false)
    }, 1000)
  }

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = () => {
    if (!currentInput.trim()) return

    addUserMessage(currentInput)
    
    // Salvar resposta
    const currentQuestion = saudeQuestions[currentQuestionIndex]
    const newData = { ...quotationData, [currentQuestion.id]: currentInput }
    setQuotationData(newData)

    setCurrentInput('')
    
    // Próxima pergunta ou finalizar
    if (currentQuestionIndex < saudeQuestions.length - 1) {
      setTimeout(() => {
        addBotMessage(saudeQuestions[currentQuestionIndex + 1].question)
        setCurrentQuestionIndex(prev => prev + 1)
      }, 1500)
    } else {
      // Finalizar cotação
      setTimeout(() => {
        addBotMessage('Perfeito! Coletei todas as informações necessárias. Agora vou buscar os melhores planos de saúde para você e sua família.')
        
        setTimeout(() => {
          // Salvar dados e redirecionar
          localStorage.setItem('cotacao_saude_data', JSON.stringify(newData))
          setIsComplete(true)
          
          setTimeout(() => {
            router.push('/cotacao/saude/resultados')
          }, 2000)
        }, 2000)
      }, 1500)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const progressPercentage = ((currentQuestionIndex + 1) / saudeQuestions.length) * 100

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            <div className="ml-4 px-3 py-1 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-sm font-medium font-inter">Plano de Saúde - Assistente</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/cotacao/saude/inicio')}
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

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#656D7A] font-inter">
              Progresso da Cotação
            </span>
            <span className="text-sm font-medium text-[#2A2F8D] font-inter">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-[#E9EDF2] rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#2A2F8D] to-[#00C2FF] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-[#2A2F8D]' 
                      : 'bg-gradient-to-br from-[#2A2F8D] to-[#00C2FF]'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                
                {/* Message */}
                <div className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-[#2A2F8D] text-white'
                    : 'bg-white border border-[#E9EDF2] text-[#1D2129]'
                }`}>
                  <p className="font-inter leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex">
                <div className="mr-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2A2F8D] to-[#00C2FF] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="bg-white border border-[#E9EDF2] px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#656D7A] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#656D7A] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#656D7A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {!isComplete && (
          <div className="border-t border-[#E9EDF2] bg-white p-6">
            <div className="max-w-4xl mx-auto">
              {currentQuestionIndex < saudeQuestions.length && (
                <div className="mb-4">
                  <p className="text-sm text-[#656D7A] font-inter">
                    🏥 {saudeQuestions[currentQuestionIndex]?.placeholder}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua resposta..."
                  className="flex-1 px-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent font-inter"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim() || isTyping}
                  className="px-6 py-3 bg-[#2A2F8D] text-white rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-inter"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
