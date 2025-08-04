'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useQuoteStore } from '@/lib/store'
import { autoFlow, getNextStep } from '@/lib/chat-flows'
import { formatCPF, validateCPF } from '@/lib/utils'
import { MessageCircle, ArrowLeft, Shield, MapPin, Loader2, Car } from 'lucide-react'
import { InsuranceType } from '@/types/insurance'

export default function CotacaoAutoPage() {
  const router = useRouter()
  const [currentStepId, setCurrentStepId] = useState('welcome')
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
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

  const currentStep = autoFlow[currentStepId]

  useEffect(() => {
    // Reset store e define tipo de seguro
    reset()
    updateFormData({ insuranceType: InsuranceType.AUTO })
    
    // Inicializa o chat
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
    
    // Adiciona resposta do usuário
    addChatStep({
      id: `user-${Date.now()}`,
      message: selectedOption?.label || value.toString(),
      type: 'user',
      stepIndex: chatSteps.length
    })

    // Atualiza dados do formulário específicos para auto
    const updates: any = {}
    if (currentStepId === 'vehicle_brand') {
      updates.vehicleData = { ...formData.vehicleData, brand: value }
    }

    if (Object.keys(updates).length > 0) {
      updateFormData(updates)
    }

    // Processa casos especiais
    if (currentStepId === 'request_location' && value === true) {
      await requestLocation()
    }

    // Vai para próximo step
    const next = nextStep || getNextStep(currentStepId, value, { ...formData, ...updates }, autoFlow)
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
    let errorMessage = ''

    // Validação específica por tipo de input
    if (currentStep.inputType === 'cpf') {
      processedInput = formatCPF(userInput)
      isValid = validateCPF(processedInput)
      if (!isValid) errorMessage = 'CPF inválido'
    }

    if (currentStep.validation) {
      const validationResult = currentStep.validation(processedInput)
      if (validationResult !== true) {
        errorMessage = validationResult as string
        isValid = false
      }
    }

    if (!isValid) {
      // TODO: Mostrar erro
      return
    }

    // Adiciona resposta do usuário
    addChatStep({
      id: `user-${Date.now()}`,
      message: processedInput,
      type: 'user',
      stepIndex: chatSteps.length
    })

    // Atualiza dados do formulário
    const updates: any = {}
    if (currentStepId === 'welcome') {
      updates.personalData = { ...formData.personalData, name: processedInput }
    } else if (currentStepId === 'get_email') {
      updates.personalData = { ...formData.personalData, email: processedInput }
    } else if (currentStepId === 'get_cpf') {
      updates.personalData = { ...formData.personalData, cpf: processedInput }
      updates.lgpdConsent = true
    } else if (currentStepId === 'vehicle_year') {
      updates.vehicleData = { ...formData.vehicleData, year: parseInt(processedInput) }
    } else if (currentStepId === 'vehicle_model') {
      updates.vehicleData = { ...formData.vehicleData, model: processedInput }
    } else if (currentStepId === 'get_city_manual') {
      const [city, state] = processedInput.split(',').map(s => s.trim())
      updates.locationData = { city, state, country: 'Brasil' }
    }

    updateFormData(updates)

    // Limpa input
    setUserInput('')

    // Próximo step
    const next = getNextStep(currentStepId, processedInput, { ...formData, ...updates }, autoFlow)
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

    const next = getNextStep(currentStepId, true, formData, autoFlow)
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
        city: 'São Paulo', // Seria obtido via API de geocoding
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
        message: autoFlow[stepId].message,
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
      router.push('/resultados/auto')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </button>
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Seguro Auto</span>
            </div>
            <div className="text-sm text-gray-500">
              Etapa {chatSteps.filter(s => s.type === 'user').length + 1}/8
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm min-h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {chatSteps.map((step) => (
                <div
                  key={step.id}
                  className={`flex ${step.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      step.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {step.type === 'bot' && (
                      <div className="flex items-center mb-2">
                        <Car className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-xs font-medium text-blue-600">Assistente Auto</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{step.message}</p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!isTyping && !isLoading && (
            <div className="border-t border-gray-200 p-6">
              {currentStep?.type === 'buttons' && (
                <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                  {currentStep.options?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleButtonClick(option.id, option.value, option.nextStep)}
                      className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {currentStep?.type === 'input' && (
                <div className="flex space-x-3">
                  <input
                    type={currentStep.inputType === 'email' ? 'email' : currentStep.inputType === 'age' || currentStep.inputType === 'year' ? 'number' : 'text'}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={currentStep.inputPlaceholder}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                  />
                  <button
                    onClick={handleInputSubmit}
                    disabled={!userInput.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar
                  </button>
                </div>
              )}

              {currentStep?.type === 'consent' && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="lgpd-consent"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="lgpd-consent" className="text-sm text-gray-700 leading-relaxed">
                      {currentStep.consentText}
                    </label>
                  </div>
                  <button
                    onClick={handleConsentSubmit}
                    disabled={!consentChecked}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Concordo e Continuar
                  </button>
                </div>
              )}

              {currentStep?.type === 'location' && (
                <div className="grid grid-cols-1 gap-3">
                  {currentStep.options?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleButtonClick(option.id, option.value, option.nextStep)}
                      className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      {option.id === 'allow' && <MapPin className="h-5 w-5 mr-2" />}
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {currentStep?.type === 'loading' && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                  <span className="text-gray-600">Processando sua solicitação...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
