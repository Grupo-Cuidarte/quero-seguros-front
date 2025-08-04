import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { InsuranceType, PersonalData, VehicleData, PropertyData, Quote } from '@/types/insurance'

export interface LocationData {
  latitude: number
  longitude: number
  city: string
  state: string
  country: string
}

export interface ChatStep {
  id: string
  message: string
  type: 'bot' | 'user'
  timestamp: Date
  stepIndex: number
}

export interface QuoteFormData {
  insuranceType: InsuranceType | null
  personalData: Partial<PersonalData>
  vehicleData: Partial<VehicleData> | null
  propertyData: Partial<PropertyData> | null
  locationData: LocationData | null
  lgpdConsent: boolean
  locationConsent: boolean
}

interface QuoteStore {
  // Estado do formulário
  formData: QuoteFormData
  
  // Estado do chat
  chatSteps: ChatStep[]
  currentStep: number
  isLoading: boolean
  
  // Estado das cotações
  quotes: Quote[]
  selectedQuote: Quote | null
  
  // Estado da localização
  locationPermission: 'granted' | 'denied' | 'prompt' | null
  
  // UTM parameters para tracking
  utmParams: Record<string, string>
  
  // Actions
  updateFormData: (data: Partial<QuoteFormData>) => void
  addChatStep: (step: Omit<ChatStep, 'timestamp'>) => void
  nextStep: () => void
  previousStep: () => void
  setLoading: (loading: boolean) => void
  setQuotes: (quotes: Quote[]) => void
  selectQuote: (quote: Quote) => void
  setLocationPermission: (permission: 'granted' | 'denied' | 'prompt') => void
  setLocationData: (location: LocationData) => void
  setUtmParams: (params: Record<string, string>) => void
  reset: () => void
}

const initialFormData: QuoteFormData = {
  insuranceType: null,
  personalData: {},
  vehicleData: null,
  propertyData: null,
  locationData: null,
  lgpdConsent: false,
  locationConsent: false,
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      formData: initialFormData,
      chatSteps: [],
      currentStep: 0,
      isLoading: false,
      quotes: [],
      selectedQuote: null,
      locationPermission: null,
      utmParams: {},
      
      // Actions
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      
      addChatStep: (step) =>
        set((state) => ({
          chatSteps: [...state.chatSteps, { ...step, timestamp: new Date() }]
        })),
      
      nextStep: () =>
        set((state) => ({
          currentStep: state.currentStep + 1
        })),
      
      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1)
        })),
      
      setLoading: (loading) =>
        set({ isLoading: loading }),
      
      setQuotes: (quotes) =>
        set({ quotes }),
      
      selectQuote: (quote) =>
        set({ selectedQuote: quote }),
      
      setLocationPermission: (permission) =>
        set({ locationPermission: permission }),
      
      setLocationData: (location) =>
        set((state) => ({
          formData: { ...state.formData, locationData: location }
        })),
      
      setUtmParams: (params) =>
        set({ utmParams: params }),
      
      reset: () =>
        set({
          formData: initialFormData,
          chatSteps: [],
          currentStep: 0,
          isLoading: false,
          quotes: [],
          selectedQuote: null,
        }),
    }),
    {
      name: 'quote-store',
      partialize: (state) => ({
        formData: state.formData,
        chatSteps: state.chatSteps,
        currentStep: state.currentStep,
        utmParams: state.utmParams,
      }),
    }
  )
)
