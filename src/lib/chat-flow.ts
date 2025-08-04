import type { InsuranceType } from '@/types/insurance'

export interface ChatFlowStep {
  id: string
  message: string
  type: 'message' | 'buttons' | 'input' | 'consent' | 'location' | 'loading'
  options?: ChatOption[]
  inputType?: 'text' | 'email' | 'cpf' | 'phone'
  inputPlaceholder?: string
  validation?: (value: string) => boolean | string
  nextStep?: string | ((data: any) => string)
  isRequired?: boolean
  consentText?: string
}

export interface ChatOption {
  id: string
  label: string
  value: any
  nextStep?: string
}

export const chatFlow: Record<string, ChatFlowStep> = {
  welcome: {
    id: 'welcome',
    message: 'Olá! Vou te ajudar a encontrar o melhor seguro em apenas 2 minutos. Para começar, qual tipo de seguro você busca?',
    type: 'buttons',
    options: [
      { id: 'health', label: '🏥 Saúde', value: 'health', nextStep: 'get_name' },
      { id: 'dental', label: '🦷 Odontológico', value: 'dental', nextStep: 'get_name' },
      { id: 'life', label: '💼 Vida', value: 'life', nextStep: 'get_name' },
    ],
    isRequired: true
  },

  get_name: {
    id: 'get_name',
    message: 'Ótima escolha! Para personalizar sua cotação, preciso de algumas informações. Qual é o seu nome completo?',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'Digite seu nome completo',
    validation: (value: string) => {
      if (!value || value.trim().length < 3) return 'Por favor, digite seu nome completo'
      return true
    },
    nextStep: 'get_email',
    isRequired: true
  },

  get_email: {
    id: 'get_email',
    message: 'Obrigado! Agora, qual é o seu melhor e-mail? (Vamos enviar sua cotação por aqui)',
    type: 'input',
    inputType: 'email',
    inputPlaceholder: 'seu.email@exemplo.com',
    validation: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return 'Por favor, digite um e-mail válido'
      return true
    },
    nextStep: 'request_location',
    isRequired: true
  },

  request_location: {
    id: 'request_location',
    message: 'Para encontrar os melhores planos na sua região, precisamos da sua localização. Podemos acessar?',
    type: 'location',
    options: [
      { id: 'allow', label: '📍 Sim, pode acessar', value: true, nextStep: 'location_success' },
      { id: 'manual', label: '✍️ Prefiro digitar minha cidade', value: false, nextStep: 'get_city_manual' },
    ],
    isRequired: true
  },

  location_success: {
    id: 'location_success',
    message: 'Perfeito! Localizamos você. Agora vamos para a última etapa.',
    type: 'message',
    nextStep: 'cpf_consent'
  },

  get_city_manual: {
    id: 'get_city_manual',
    message: 'Sem problemas! Digite sua cidade e estado (ex: São Paulo, SP)',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'Cidade, Estado',
    validation: (value: string) => {
      if (!value || value.trim().length < 3) return 'Por favor, digite sua cidade e estado'
      return true
    },
    nextStep: 'cpf_consent',
    isRequired: true
  },

  cpf_consent: {
    id: 'cpf_consent',
    message: 'Para finalizar e encontrar as melhores ofertas personalizadas, precisamos do seu CPF.',
    type: 'consent',
    consentText: 'Eu concordo com a consulta do meu CPF para personalização das cotações de seguro e declaro estar ciente dos Termos de Uso e da Política de Privacidade, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    nextStep: 'get_cpf',
    isRequired: true
  },

  get_cpf: {
    id: 'get_cpf',
    message: 'Agora digite seu CPF:',
    type: 'input',
    inputType: 'cpf',
    inputPlaceholder: '000.000.000-00',
    validation: (value: string) => {
      // Implementar validação de CPF
      const cpf = value.replace(/\D/g, '')
      if (cpf.length !== 11) return 'CPF deve ter 11 dígitos'
      return true
    },
    nextStep: 'processing',
    isRequired: true
  },

  processing: {
    id: 'processing',
    message: 'Consultando seu perfil de crédito com segurança...',
    type: 'loading',
    nextStep: 'results'
  },

  results: {
    id: 'results',
    message: 'Encontramos várias opções para você! Vamos ver os resultados?',
    type: 'buttons',
    options: [
      { id: 'view_results', label: '🎯 Ver Minha Cotação', value: true },
    ]
  }
}

export const getNextStep = (currentStepId: string, userResponse: any, formData: any): string | null => {
  const currentStep = chatFlow[currentStepId]
  if (!currentStep) return null

  if (typeof currentStep.nextStep === 'function') {
    return currentStep.nextStep(formData)
  }

  return currentStep.nextStep || null
}
