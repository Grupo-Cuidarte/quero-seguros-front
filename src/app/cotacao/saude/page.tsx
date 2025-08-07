'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useQuoteStore } from '@/lib/store'
import { healthFlow, getNextStep } from '@/lib/chat-flows'
import { formatCPF, validateCPF } from '@/lib/utils'
import { MessageCircle, ArrowLeft, Shield, MapPin, Loader2, Heart, ToggleLeft, ToggleRight, User } from 'lucide-react'
import { InsuranceType } from '@/types/insurance'

export default function CotacaoSaudePage() {
  const router = useRouter()
  const [currentStepId, setCurrentStepId] = useState('welcome')
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [viewMode, setViewMode] = useState<'chat' | 'form'>('chat') // Nova state para controlar a visualização
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const {
    formData,
    chatSteps,
    updateFormData,
    addChatStep,
    setLocationData,
    setLocationPermission,
    isLoading,
    setLoading,
    reset
  } = useQuoteStore()

  const currentStep = healthFlow[currentStepId]

  useEffect(() => {
    reset()
    updateFormData({ insuranceType: InsuranceType.HEALTH })
    
    addChatStep({
      id: 'bot-welcome',
      message: currentStep.message,
      type: 'bot',
      stepIndex: 0
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatSteps])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleButtonClick = async (optionId: string, value: any, nextStep?: string) => {
    const selectedOption = currentStep.options?.find(opt => opt.id === optionId)
    
    addChatStep({
      id: `user-${Date.now()}`,
      message: selectedOption?.label || value.toString(),
      type: 'user',
      stepIndex: chatSteps.length
    })

    // Processa casos especiais
    if (currentStepId === 'request_location' && value === true) {
      await requestLocation()
    }

    const next = nextStep || getNextStep(currentStepId, value, formData, healthFlow)
    if (next) {
      setTimeout(() => {
        setCurrentStepId(next)
        simulateBotTyping(next)
      }, 500)
    }
  }

  const handleInputSubmit = () => {
    if (!userInput.trim()) return

    let processedInput = userInput.trim()
    let isValid = true

    if (currentStep.inputType === 'cpf') {
      processedInput = formatCPF(userInput)
      isValid = validateCPF(processedInput)
    }

    if (currentStep.validation) {
      const validationResult = currentStep.validation(processedInput)
      if (validationResult !== true) {
        isValid = false
      }
    }

    if (!isValid) return

    addChatStep({
      id: `user-${Date.now()}`,
      message: processedInput,
      type: 'user',
      stepIndex: chatSteps.length
    })

    const updates: any = {}
    if (currentStepId === 'welcome') {
      updates.personalData = { ...formData.personalData, name: processedInput }
    } else if (currentStepId === 'get_email') {
      updates.personalData = { ...formData.personalData, email: processedInput }
    } else if (currentStepId === 'get_cpf') {
      updates.personalData = { ...formData.personalData, cpf: processedInput }
      updates.lgpdConsent = true
    } else if (currentStepId === 'age') {
      updates.personalData = { ...formData.personalData, age: parseInt(processedInput) }
    } else if (currentStepId === 'get_city_manual') {
      const [city, state] = processedInput.split(',').map(s => s.trim())
      updates.locationData = { city, state, country: 'Brasil' }
    }

    updateFormData(updates)
    setUserInput('')

    const next = getNextStep(currentStepId, processedInput, { ...formData, ...updates }, healthFlow)
    if (next) {
      if (next === 'processing') {
        setTimeout(() => {
          setCurrentStepId(next)
          simulateProcessing()
        }, 500)
      } else {
        setTimeout(() => {
          setCurrentStepId(next)
          simulateBotTyping(next)
        }, 500)
      }
    }
  }

  const handleConsentSubmit = () => {
    if (!consentChecked) return

    updateFormData({ lgpdConsent: true })

    addChatStep({
      id: `user-${Date.now()}`,
      message: 'Aceito os termos e concordo com o uso dos meus dados.',
      type: 'user',
      stepIndex: chatSteps.length
    })

    const next = getNextStep(currentStepId, true, formData, healthFlow)
    if (next) {
      setTimeout(() => {
        setCurrentStepId(next)
        simulateBotTyping(next)
      }, 500)
    }
  }

  const requestLocation = async () => {
    try {
      setLocationPermission('prompt')
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        })
      })

      setLocationPermission('granted')
      
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil'
      }

      setLocationData(locationData)
    } catch (error) {
      setLocationPermission('denied')
      setCurrentStepId('get_city_manual')
      simulateBotTyping('get_city_manual')
    }
  }

  const simulateBotTyping = (stepId: string) => {
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      addChatStep({
        id: `bot-${Date.now()}`,
        message: healthFlow[stepId].message,
        type: 'bot',
        stepIndex: chatSteps.length
      })
    }, 1000 + Math.random() * 1000)
  }

  const simulateProcessing = () => {
    setLoading(true)
    addChatStep({
      id: `bot-${Date.now()}`,
      message: currentStep.message,
      type: 'bot',
      stepIndex: chatSteps.length
    })

    setTimeout(() => {
      setLoading(false)
      router.push('/resultados/saude')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header - Novo Design System */}
      <header className="bg-white backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-[#E9EDF2]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-[#656D7A] hover:text-[#2A2F8D] transition-colors duration-200 font-inter"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </button>
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-[#F73B5A]" />
              <span className="font-semibold text-[#1D2129] font-inter">Plano de Saúde</span>
            </div>
            
            {/* Toggle Switch Chat/Formulário */}
            <div className="flex items-center space-x-3">
              <div className="text-sm text-[#656D7A] font-inter">
                Etapa {chatSteps.filter(s => s.type === 'user').length + 1}/8
              </div>
              <div className="flex items-center bg-[#F7F9FC] rounded-lg p-1 border border-[#E9EDF2]">
                <button
                  onClick={() => setViewMode('chat')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 font-inter ${
                    viewMode === 'chat' 
                      ? 'bg-[#2A2F8D] text-white shadow-sm' 
                      : 'text-[#656D7A] hover:text-[#2A2F8D]'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setViewMode('form')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 font-inter ${
                    viewMode === 'form' 
                      ? 'bg-[#2A2F8D] text-white shadow-sm' 
                      : 'text-[#656D7A] hover:text-[#2A2F8D]'
                  }`}
                >
                  Formulário
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {viewMode === 'chat' ? (
          /* View Chat - Modo Chatbot Premium Minimalista */
          <div className="bg-white rounded-2xl border border-[#E9EDF2] min-h-[600px] flex flex-col hover:border-[#2A2F8D] transition-all duration-300">
            <div className="flex-1 p-10 overflow-y-auto">
              <div className="space-y-8">
                {chatSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex ${step.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-sm lg:max-w-lg px-6 py-5 rounded-2xl ${
                        step.type === 'user'
                          ? 'bg-[#2A2F8D] text-white'
                          : 'bg-[#F7F9FC] text-[#1D2129] border border-[#E9EDF2]'
                      }`}
                    >
                      {step.type === 'bot' && (
                        <div className="flex items-center mb-4">
                          {/* Avatar Premium - Ícone 3D placeholder */}
                          <div className="w-8 h-8 bg-gradient-to-br from-[#2A2F8D] to-[#00C2FF] rounded-full flex items-center justify-center mr-4">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-[#2A2F8D] font-inter">Assistente Saúde</span>
                        </div>
                      )}
                      <p className="text-base leading-relaxed font-inter">{step.message}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#F7F9FC] rounded-2xl px-6 py-5 border border-[#E9EDF2]">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#2A2F8D] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#2A2F8D] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-[#2A2F8D] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {!isTyping && !isLoading && (
              <div className="border-t border-[#E9EDF2] p-10">
                {currentStep?.type === 'buttons' && (
                  <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
                    {currentStep.options?.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleButtonClick(option.id, option.value, option.nextStep)}
                        className="px-8 py-4 bg-[#2A2F8D] text-white rounded-lg hover:bg-[#3E44A1] transition-all duration-300 font-semibold font-inter border border-[#2A2F8D] hover:border-[#3E44A1]"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}

                {currentStep?.type === 'input' && (
                  <div className="flex space-x-4">
                    <input
                      type={currentStep.inputType === 'email' ? 'email' : currentStep.inputType === 'age' ? 'number' : 'text'}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder={currentStep.inputPlaceholder}
                      className="flex-1 px-5 py-4 border border-[#E9EDF2] rounded-lg focus:border-[#2A2F8D] focus:outline-none font-inter bg-white text-lg transition-all duration-300"
                      onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                    />
                    <button
                      onClick={handleInputSubmit}
                      disabled={!userInput.trim()}
                      className="px-8 py-4 bg-[#2A2F8D] text-white rounded-lg hover:bg-[#3E44A1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold font-inter border border-[#2A2F8D] hover:border-[#3E44A1]"
                    >
                      Enviar
                    </button>
                  </div>
                )}

                {currentStep?.type === 'consent' && (
                  <div className="space-y-8">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        id="lgpd-consent"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="mt-1 h-5 w-5 text-[#2A2F8D] border-[#E9EDF2] rounded focus:ring-0 focus:ring-offset-0"
                      />
                      <label htmlFor="lgpd-consent" className="text-base text-[#656D7A] leading-relaxed font-inter">
                        {currentStep.consentText}
                      </label>
                    </div>
                    <button
                      onClick={handleConsentSubmit}
                      disabled={!consentChecked}
                      className="w-full px-8 py-4 bg-[#2A2F8D] text-white rounded-lg hover:bg-[#3E44A1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold font-inter border border-[#2A2F8D] hover:border-[#3E44A1]"
                    >
                      Concordo e Continuar
                    </button>
                  </div>
                )}

                {currentStep?.type === 'location' && (
                  <div className="grid grid-cols-1 gap-4">
                    {currentStep.options?.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleButtonClick(option.id, option.value, option.nextStep)}
                        className="flex items-center justify-center px-8 py-4 bg-[#2A2F8D] text-white rounded-lg hover:bg-[#3E44A1] transition-all duration-300 font-semibold font-inter border border-[#2A2F8D] hover:border-[#3E44A1]"
                      >
                        {option.id === 'allow' && <MapPin className="h-5 w-5 mr-3" />}
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}

                {currentStep?.type === 'loading' && (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-[#2A2F8D] mr-4" />
                    <span className="text-[#656D7A] font-inter text-lg">Processando sua solicitação...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* View Formulário - Premium Minimalista */
          <div className="bg-white rounded-2xl border border-[#E9EDF2] p-10 hover:border-[#2A2F8D] transition-all duration-300">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-[#1D2129] mb-4 font-inter">Preencha seus dados para a cotação</h2>
              <p className="text-lg text-[#656D7A] font-inter">Complete as informações abaixo para receber suas ofertas personalizadas</p>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              {/* Nome Completo */}
              <div>
                <label className="block text-base font-semibold text-[#1D2129] mb-3 font-inter">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.personalData?.name || ''}
                  onChange={(e) => updateFormData({ personalData: { ...formData.personalData, name: e.target.value }})}
                  className="w-full px-5 py-4 border border-[#E9EDF2] rounded-lg focus:border-[#2A2F8D] focus:outline-none font-inter bg-white text-lg transition-all duration-300"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-semibold text-[#1D2129] mb-3 font-inter">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.personalData?.email || ''}
                  onChange={(e) => updateFormData({ personalData: { ...formData.personalData, email: e.target.value }})}
                  className="w-full px-5 py-4 border border-[#E9EDF2] rounded-lg focus:border-[#2A2F8D] focus:outline-none font-inter bg-white text-lg transition-all duration-300"
                />
              </div>

              {/* CPF */}
              <div>
                <label className="block text-base font-semibold text-[#1D2129] mb-3 font-inter">CPF</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.personalData?.cpf || ''}
                  onChange={(e) => updateFormData({ personalData: { ...formData.personalData, cpf: formatCPF(e.target.value) }})}
                  className="w-full px-5 py-4 border border-[#E9EDF2] rounded-lg focus:border-[#2A2F8D] focus:outline-none font-inter bg-white text-lg transition-all duration-300"
                />
              </div>

              {/* Idade */}
              <div>
                <label className="block text-base font-semibold text-[#1D2129] mb-3 font-inter">Idade</label>
                <input
                  type="number"
                  placeholder="Sua idade"
                  value={formData.personalData?.age || ''}
                  onChange={(e) => updateFormData({ personalData: { ...formData.personalData, age: parseInt(e.target.value) }})}
                  className="w-full px-5 py-4 border border-[#E9EDF2] rounded-lg focus:border-[#2A2F8D] focus:outline-none font-inter bg-white text-lg transition-all duration-300"
                />
              </div>

              {/* Consentimento LGPD */}
              <div className="flex items-start space-x-4 py-4">
                <input
                  type="checkbox"
                  id="form-lgpd-consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-1 h-5 w-5 text-[#2A2F8D] border-[#E9EDF2] rounded focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="form-lgpd-consent" className="text-base text-[#656D7A] leading-relaxed font-inter">
                  Aceito receber informações sobre seguros e concordo com o uso dos meus dados conforme a Política de Privacidade e LGPD.
                </label>
              </div>

              {/* Botão de Ação */}
              <div className="pt-8">
                <button
                  onClick={() => router.push('/resultados/saude')}
                  disabled={!consentChecked}
                  className="w-full px-8 py-5 bg-[#2A2F8D] text-white rounded-lg hover:bg-[#3E44A1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg font-inter border border-[#2A2F8D] hover:border-[#3E44A1]"
                >
                  Ver Cotações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
