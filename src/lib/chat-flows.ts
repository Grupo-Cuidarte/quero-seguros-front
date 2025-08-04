import { InsuranceType } from '@/types/insurance'

export interface ChatFlowStep {
  id: string
  message: string
  type: 'message' | 'buttons' | 'input' | 'consent' | 'location' | 'loading'
  options?: ChatOption[]
  inputType?: 'text' | 'email' | 'cpf' | 'phone' | 'age' | 'year'
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

// Fluxo para Seguro Auto
export const autoFlow: Record<string, ChatFlowStep> = {
  welcome: {
    id: 'welcome',
    message: '🚗 Ótimo! Vou te ajudar a encontrar o melhor seguro auto. Para começar, qual é o seu nome?',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'Digite seu nome completo',
    validation: (value: string) => value.trim().length >= 3 ? true : 'Por favor, digite seu nome completo',
    nextStep: 'get_email',
    isRequired: true
  },

  get_email: {
    id: 'get_email',
    message: 'Perfeito! Agora preciso do seu e-mail para enviar sua cotação.',
    type: 'input',
    inputType: 'email',
    inputPlaceholder: 'seu.email@exemplo.com',
    validation: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? true : 'Por favor, digite um e-mail válido'
    },
    nextStep: 'vehicle_year',
    isRequired: true
  },

  vehicle_year: {
    id: 'vehicle_year',
    message: 'Qual o ano do seu veículo?',
    type: 'input',
    inputType: 'year',
    inputPlaceholder: 'Ex: 2020',
    validation: (value: string) => {
      const year = parseInt(value)
      const currentYear = new Date().getFullYear()
      return year >= 1990 && year <= currentYear + 1 ? true : 'Digite um ano válido entre 1990 e ' + (currentYear + 1)
    },
    nextStep: 'vehicle_brand',
    isRequired: true
  },

  vehicle_brand: {
    id: 'vehicle_brand',
    message: 'Qual a marca do seu veículo?',
    type: 'buttons',
    options: [
      { id: 'fiat', label: 'Fiat', value: 'Fiat', nextStep: 'vehicle_model' },
      { id: 'ford', label: 'Ford', value: 'Ford', nextStep: 'vehicle_model' },
      { id: 'gm', label: 'Chevrolet', value: 'Chevrolet', nextStep: 'vehicle_model' },
      { id: 'vw', label: 'Volkswagen', value: 'Volkswagen', nextStep: 'vehicle_model' },
      { id: 'toyota', label: 'Toyota', value: 'Toyota', nextStep: 'vehicle_model' },
      { id: 'honda', label: 'Honda', value: 'Honda', nextStep: 'vehicle_model' },
      { id: 'other', label: 'Outra marca', value: 'Outra', nextStep: 'vehicle_model' }
    ],
    isRequired: true
  },

  vehicle_model: {
    id: 'vehicle_model',
    message: 'Qual o modelo do seu veículo?',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'Ex: Civic, Corolla, Onix...',
    validation: (value: string) => value.trim().length >= 2 ? true : 'Digite o modelo do veículo',
    nextStep: 'request_location',
    isRequired: true
  },

  request_location: {
    id: 'request_location',
    message: 'Para calcular seu seguro com precisão, preciso saber onde você mora. Posso acessar sua localização?',
    type: 'location',
    options: [
      { id: 'allow', label: '📍 Sim, pode acessar', value: true, nextStep: 'location_success' },
      { id: 'manual', label: '✍️ Prefiro digitar minha cidade', value: false, nextStep: 'get_city_manual' }
    ],
    isRequired: true
  },

  location_success: {
    id: 'location_success',
    message: 'Perfeito! Agora vamos para a última etapa.',
    type: 'message',
    nextStep: 'cpf_consent'
  },

  get_city_manual: {
    id: 'get_city_manual',
    message: 'Digite sua cidade e estado:',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'São Paulo, SP',
    validation: (value: string) => value.trim().length >= 3 ? true : 'Digite sua cidade e estado',
    nextStep: 'cpf_consent',
    isRequired: true
  },

  cpf_consent: {
    id: 'cpf_consent',
    message: 'Para finalizar sua cotação de seguro auto, preciso do seu CPF para consultar seu histórico.',
    type: 'consent',
    consentText: 'Eu concordo com a consulta do meu CPF para personalização das cotações de seguro auto e declaro estar ciente dos Termos de Uso e da Política de Privacidade, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    nextStep: 'get_cpf',
    isRequired: true
  },

  get_cpf: {
    id: 'get_cpf',
    message: 'Digite seu CPF:',
    type: 'input',
    inputType: 'cpf',
    inputPlaceholder: '000.000.000-00',
    validation: (value: string) => {
      const cpf = value.replace(/\D/g, '')
      return cpf.length === 11 ? true : 'CPF deve ter 11 dígitos'
    },
    nextStep: 'processing',
    isRequired: true
  },

  processing: {
    id: 'processing',
    message: 'Analisando seu perfil e buscando as melhores ofertas de seguro auto...',
    type: 'loading',
    nextStep: 'results'
  }
}

// Fluxo para Plano de Saúde
export const healthFlow: Record<string, ChatFlowStep> = {
  welcome: {
    id: 'welcome',
    message: '🏥 Vou te ajudar a encontrar o melhor plano de saúde! Qual é o seu nome?',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'Digite seu nome completo',
    validation: (value: string) => value.trim().length >= 3 ? true : 'Por favor, digite seu nome completo',
    nextStep: 'get_email',
    isRequired: true
  },

  get_email: {
    id: 'get_email',
    message: 'Qual é o seu e-mail para enviarmos sua cotação?',
    type: 'input',
    inputType: 'email',
    inputPlaceholder: 'seu.email@exemplo.com',
    validation: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? true : 'Por favor, digite um e-mail válido'
    },
    nextStep: 'age',
    isRequired: true
  },

  age: {
    id: 'age',
    message: 'Qual a sua idade?',
    type: 'input',
    inputType: 'age',
    inputPlaceholder: 'Ex: 35',
    validation: (value: string) => {
      const age = parseInt(value)
      return age >= 0 && age <= 120 ? true : 'Digite uma idade válida'
    },
    nextStep: 'plan_type',
    isRequired: true
  },

  plan_type: {
    id: 'plan_type',
    message: 'Que tipo de plano você está procurando?',
    type: 'buttons',
    options: [
      { id: 'individual', label: '👤 Individual', value: 'individual', nextStep: 'coverage_type' },
      { id: 'family', label: '👨‍👩‍👧‍👦 Familiar', value: 'family', nextStep: 'family_members' },
      { id: 'couple', label: '💑 Casal', value: 'couple', nextStep: 'coverage_type' }
    ],
    isRequired: true
  },

  family_members: {
    id: 'family_members',
    message: 'Quantas pessoas serão incluídas no plano?',
    type: 'buttons',
    options: [
      { id: '2', label: '2 pessoas', value: 2, nextStep: 'coverage_type' },
      { id: '3', label: '3 pessoas', value: 3, nextStep: 'coverage_type' },
      { id: '4', label: '4 pessoas', value: 4, nextStep: 'coverage_type' },
      { id: '5+', label: '5 ou mais', value: 5, nextStep: 'coverage_type' }
    ],
    isRequired: true
  },

  coverage_type: {
    id: 'coverage_type',
    message: 'Que tipo de cobertura você prefere?',
    type: 'buttons',
    options: [
      { id: 'basic', label: '🏥 Básica', value: 'basic', nextStep: 'request_location' },
      { id: 'intermediate', label: '🏥+ Intermediária', value: 'intermediate', nextStep: 'request_location' },
      { id: 'premium', label: '🏥⭐ Premium', value: 'premium', nextStep: 'request_location' }
    ],
    isRequired: true
  },

  request_location: {
    id: 'request_location',
    message: 'Para encontrar planos disponíveis na sua região, preciso da sua localização.',
    type: 'location',
    options: [
      { id: 'allow', label: '📍 Acessar localização', value: true, nextStep: 'location_success' },
      { id: 'manual', label: '✍️ Digitar cidade', value: false, nextStep: 'get_city_manual' }
    ],
    isRequired: true
  },

  location_success: {
    id: 'location_success',
    message: 'Ótimo! Vamos finalizar sua cotação.',
    type: 'message',
    nextStep: 'cpf_consent'
  },

  get_city_manual: {
    id: 'get_city_manual',
    message: 'Digite sua cidade e estado:',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'São Paulo, SP',
    validation: (value: string) => value.trim().length >= 3 ? true : 'Digite sua cidade e estado',
    nextStep: 'cpf_consent',
    isRequired: true
  },

  cpf_consent: {
    id: 'cpf_consent',
    message: 'Para finalizar, preciso do seu CPF para verificar planos disponíveis.',
    type: 'consent',
    consentText: 'Eu concordo com a consulta do meu CPF para personalização das cotações de plano de saúde e declaro estar ciente dos Termos de Uso e da Política de Privacidade, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    nextStep: 'get_cpf',
    isRequired: true
  },

  get_cpf: {
    id: 'get_cpf',
    message: 'Digite seu CPF:',
    type: 'input',
    inputType: 'cpf',
    inputPlaceholder: '000.000.000-00',
    validation: (value: string) => {
      const cpf = value.replace(/\D/g, '')
      return cpf.length === 11 ? true : 'CPF deve ter 11 dígitos'
    },
    nextStep: 'processing',
    isRequired: true
  },

  processing: {
    id: 'processing',
    message: 'Buscando os melhores planos de saúde para seu perfil...',
    type: 'loading',
    nextStep: 'results'
  }
}

// Fluxo para Plano Odontológico
export const dentalFlow: Record<string, ChatFlowStep> = {
  welcome: {
    id: 'welcome',
    message: '🦷 Vamos encontrar o plano odontológico ideal para você! Qual é o seu nome?',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'Digite seu nome completo',
    validation: (value: string) => value.trim().length >= 3 ? true : 'Por favor, digite seu nome completo',
    nextStep: 'get_email',
    isRequired: true
  },

  get_email: {
    id: 'get_email',
    message: 'Qual é o seu e-mail?',
    type: 'input',
    inputType: 'email',
    inputPlaceholder: 'seu.email@exemplo.com',
    validation: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? true : 'Por favor, digite um e-mail válido'
    },
    nextStep: 'age',
    isRequired: true
  },

  age: {
    id: 'age',
    message: 'Qual a sua idade?',
    type: 'input',
    inputType: 'age',
    inputPlaceholder: 'Ex: 35',
    validation: (value: string) => {
      const age = parseInt(value)
      return age >= 0 && age <= 120 ? true : 'Digite uma idade válida'
    },
    nextStep: 'plan_type',
    isRequired: true
  },

  plan_type: {
    id: 'plan_type',
    message: 'Que tipo de plano odontológico você procura?',
    type: 'buttons',
    options: [
      { id: 'individual', label: '👤 Individual', value: 'individual', nextStep: 'treatment_type' },
      { id: 'family', label: '👨‍👩‍👧‍👦 Familiar', value: 'family', nextStep: 'family_members' }
    ],
    isRequired: true
  },

  family_members: {
    id: 'family_members',
    message: 'Quantas pessoas no plano familiar?',
    type: 'buttons',
    options: [
      { id: '2', label: '2 pessoas', value: 2, nextStep: 'treatment_type' },
      { id: '3', label: '3 pessoas', value: 3, nextStep: 'treatment_type' },
      { id: '4', label: '4 pessoas', value: 4, nextStep: 'treatment_type' },
      { id: '5+', label: '5 ou mais', value: 5, nextStep: 'treatment_type' }
    ],
    isRequired: true
  },

  treatment_type: {
    id: 'treatment_type',
    message: 'Que tipo de tratamento você mais precisa?',
    type: 'buttons',
    options: [
      { id: 'preventive', label: '🦷 Preventivo', value: 'preventive', nextStep: 'request_location' },
      { id: 'basic', label: '🦷+ Básico + Restaurações', value: 'basic', nextStep: 'request_location' },
      { id: 'complete', label: '🦷⭐ Completo + Ortodontia', value: 'complete', nextStep: 'request_location' }
    ],
    isRequired: true
  },

  request_location: {
    id: 'request_location',
    message: 'Para encontrar dentistas na sua região, preciso da sua localização.',
    type: 'location',
    options: [
      { id: 'allow', label: '📍 Acessar localização', value: true, nextStep: 'location_success' },
      { id: 'manual', label: '✍️ Digitar cidade', value: false, nextStep: 'get_city_manual' }
    ],
    isRequired: true
  },

  location_success: {
    id: 'location_success',
    message: 'Perfeito! Vamos finalizar.',
    type: 'message',
    nextStep: 'cpf_consent'
  },

  get_city_manual: {
    id: 'get_city_manual',
    message: 'Digite sua cidade e estado:',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'São Paulo, SP',
    validation: (value: string) => value.trim().length >= 3 ? true : 'Digite sua cidade e estado',
    nextStep: 'cpf_consent',
    isRequired: true
  },

  cpf_consent: {
    id: 'cpf_consent',
    message: 'Para finalizar, preciso do seu CPF.',
    type: 'consent',
    consentText: 'Eu concordo com a consulta do meu CPF para personalização das cotações de plano odontológico e declaro estar ciente dos Termos de Uso e da Política de Privacidade, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    nextStep: 'get_cpf',
    isRequired: true
  },

  get_cpf: {
    id: 'get_cpf',
    message: 'Digite seu CPF:',
    type: 'input',
    inputType: 'cpf',
    inputPlaceholder: '000.000.000-00',
    validation: (value: string) => {
      const cpf = value.replace(/\D/g, '')
      return cpf.length === 11 ? true : 'CPF deve ter 11 dígitos'
    },
    nextStep: 'processing',
    isRequired: true
  },

  processing: {
    id: 'processing',
    message: 'Encontrando os melhores planos odontológicos...',
    type: 'loading',
    nextStep: 'results'
  }
}

// Fluxo para Seguro de Vida
export const lifeFlow: Record<string, ChatFlowStep> = {
  welcome: {
    id: 'welcome',
    message: '💼 Vou te ajudar a encontrar o melhor seguro de vida. Qual é o seu nome?',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'Digite seu nome completo',
    validation: (value: string) => value.trim().length >= 3 ? true : 'Por favor, digite seu nome completo',
    nextStep: 'get_email',
    isRequired: true
  },

  get_email: {
    id: 'get_email',
    message: 'Qual é o seu e-mail?',
    type: 'input',
    inputType: 'email',
    inputPlaceholder: 'seu.email@exemplo.com',
    validation: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? true : 'Por favor, digite um e-mail válido'
    },
    nextStep: 'age',
    isRequired: true
  },

  age: {
    id: 'age',
    message: 'Qual a sua idade?',
    type: 'input',
    inputType: 'age',
    inputPlaceholder: 'Ex: 35',
    validation: (value: string) => {
      const age = parseInt(value)
      return age >= 18 && age <= 80 ? true : 'Idade deve estar entre 18 e 80 anos'
    },
    nextStep: 'coverage_amount',
    isRequired: true
  },

  coverage_amount: {
    id: 'coverage_amount',
    message: 'Qual valor de cobertura você gostaria?',
    type: 'buttons',
    options: [
      { id: '50k', label: 'R$ 50.000', value: 50000, nextStep: 'beneficiaries' },
      { id: '100k', label: 'R$ 100.000', value: 100000, nextStep: 'beneficiaries' },
      { id: '200k', label: 'R$ 200.000', value: 200000, nextStep: 'beneficiaries' },
      { id: '500k', label: 'R$ 500.000', value: 500000, nextStep: 'beneficiaries' },
      { id: '1m', label: 'R$ 1.000.000+', value: 1000000, nextStep: 'beneficiaries' }
    ],
    isRequired: true
  },

  beneficiaries: {
    id: 'beneficiaries',
    message: 'Você tem dependentes/beneficiários?',
    type: 'buttons',
    options: [
      { id: 'yes', label: '✅ Sim, tenho', value: true, nextStep: 'request_location' },
      { id: 'no', label: '❌ Não tenho', value: false, nextStep: 'request_location' }
    ],
    isRequired: true
  },

  request_location: {
    id: 'request_location',
    message: 'Para calcular o valor do seu seguro, preciso da sua localização.',
    type: 'location',
    options: [
      { id: 'allow', label: '📍 Acessar localização', value: true, nextStep: 'location_success' },
      { id: 'manual', label: '✍️ Digitar cidade', value: false, nextStep: 'get_city_manual' }
    ],
    isRequired: true
  },

  location_success: {
    id: 'location_success',
    message: 'Ótimo! Última etapa.',
    type: 'message',
    nextStep: 'cpf_consent'
  },

  get_city_manual: {
    id: 'get_city_manual',
    message: 'Digite sua cidade e estado:',
    type: 'input',
    inputType: 'text',
    inputPlaceholder: 'São Paulo, SP',
    validation: (value: string) => value.trim().length >= 3 ? true : 'Digite sua cidade e estado',
    nextStep: 'cpf_consent',
    isRequired: true
  },

  cpf_consent: {
    id: 'cpf_consent',
    message: 'Para finalizar, preciso do seu CPF.',
    type: 'consent',
    consentText: 'Eu concordo com a consulta do meu CPF para personalização das cotações de seguro de vida e declaro estar ciente dos Termos de Uso e da Política de Privacidade, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    nextStep: 'get_cpf',
    isRequired: true
  },

  get_cpf: {
    id: 'get_cpf',
    message: 'Digite seu CPF:',
    type: 'input',
    inputType: 'cpf',
    inputPlaceholder: '000.000.000-00',
    validation: (value: string) => {
      const cpf = value.replace(/\D/g, '')
      return cpf.length === 11 ? true : 'CPF deve ter 11 dígitos'
    },
    nextStep: 'processing',
    isRequired: true
  },

  processing: {
    id: 'processing',
    message: 'Calculando as melhores opções de seguro de vida...',
    type: 'loading',
    nextStep: 'results'
  }
}

export const getFlowByType = (type: InsuranceType): Record<string, ChatFlowStep> => {
  switch (type) {
    case InsuranceType.AUTO:
      return autoFlow
    case InsuranceType.HEALTH:
      return healthFlow
    case InsuranceType.DENTAL:
      return dentalFlow
    case InsuranceType.LIFE:
      return lifeFlow
    default:
      return healthFlow
  }
}

export const getNextStep = (currentStepId: string, userResponse: any, formData: any, flow: Record<string, ChatFlowStep>): string | null => {
  const currentStep = flow[currentStepId]
  if (!currentStep) return null

  if (typeof currentStep.nextStep === 'function') {
    return currentStep.nextStep(formData)
  }

  return currentStep.nextStep || null
}
