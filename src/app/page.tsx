'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuoteStore } from '@/lib/store'
import { Shield, Clock, Award, CheckCircle, Star, Users, Car, Home, Heart, Smile, ChevronLeft, ChevronRight, Zap, DollarSign, Timer } from 'lucide-react'

const insuranceCategories = [
  {
    id: 'auto',
    title: 'Seguro Auto',
    subtitle: 'Proteção completa para seu veículo',
    description: 'Cobertura contra roubo, furto, colisão e assistência 24h',
    icon: Car,
    color: 'blue',
    benefits: [
      'Cobertura contra terceiros',
      'Assistência 24h',
      'Carro reserva',
      'Proteção de vidros'
    ],
    route: '/cotacao/auto'
  },
  {
    id: 'health',
    title: 'Plano de Saúde',
    subtitle: 'Cuide da sua saúde e família',
    description: 'Acesso aos melhores hospitais e médicos especialistas',
    icon: Heart,
    color: 'red',
    benefits: [
      'Consultas ilimitadas',
      'Exames laboratoriais',
      'Internação hospitalar',
      'Rede nacional'
    ],
    route: '/cotacao/saude'
  },
  {
    id: 'dental',
    title: 'Plano Odontológico',
    subtitle: 'Sorriso sempre saudável',
    description: 'Tratamentos dentários com dentistas especializados',
    icon: Smile,
    color: 'green',
    benefits: [
      'Consultas preventivas',
      'Limpeza e fluoretação',
      'Tratamentos básicos',
      'Ortodontia'
    ],
    route: '/cotacao/odonto'
  },
  {
    id: 'life',
    title: 'Seguro de Vida',
    subtitle: 'Tranquilidade para toda família',
    description: 'Proteção financeira para quem você mais ama',
    icon: Shield,
    color: 'purple',
    benefits: [
      'Indenização por morte',
      'Invalidez permanente',
      'Assistência funeral',
      'Renda mensal'
    ],
    route: '/cotacao/vida'
  }
]

const advantages = [
  {
    id: 1,
    title: "Compare em 2 Minutos",
    description: "Nossa plataforma inteligente compara dezenas de seguradoras em poucos cliques. Sem perda de tempo!",
    icon: Timer,
    color: "blue"
  },
  {
    id: 2,
    title: "Economize até 40%",
    description: "Encontre o melhor preço do mercado. Nossos usuários economizam em média R$ 800 por ano.",
    icon: DollarSign,
    color: "green"
  },
  {
    id: 3,
    title: "100% Digital",
    description: "Sem corretor, sem burocracia. Tudo online, rápido e seguro. Contrate direto pela plataforma.",
    icon: Zap,
    color: "purple"
  }
]

const heroSlides = [
  {
    id: 1,
    title: "Proteja o que é mais",
    highlight: "importante",
    subtitle: "para você",
    description: "Compare seguros das melhores seguradoras do Brasil em poucos minutos. Encontre a proteção ideal para sua família com o melhor custo-benefício.",
    buttonText: "Começar Agora",
    features: ["100% Gratuito", "Sem Compromisso", "Resultado em 2 min"]
  },
  {
    id: 2,
    title: "Economize até",
    highlight: "40%",
    subtitle: "no seu seguro",
    description: "Nossa plataforma compara dezenas de seguradoras para encontrar o melhor preço. Milhares de famílias já economizaram conosco.",
    buttonText: "Ver Ofertas",
    features: ["Melhor Preço", "Sem Taxas Ocultas", "Transparência Total"]
  },
  {
    id: 3,
    title: "Cobertura",
    highlight: "completa",
    subtitle: "para toda família",
    description: "Auto, saúde, vida e odontológico. Tudo em um só lugar, com atendimento especializado e suporte quando você mais precisar.",
    buttonText: "Escolher Plano",
    features: ["4 Tipos de Seguro", "Suporte 24h", "Atendimento Especializado"]
  }
]

export default function LandingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setUtmParams = useQuoteStore((state) => state.setUtmParams)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // Captura parâmetros UTM para tracking
    const utmParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('utm_') || key === 'source' || key === 'medium' || key === 'campaign') {
        utmParams[key] = value
      }
    })
    if (Object.keys(utmParams).length > 0) {
      setUtmParams(utmParams)
    }
  }, [searchParams, setUtmParams])

  // Auto-slide do carrossel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        text: 'text-blue-600',
        bgLight: 'bg-blue-50',
        border: 'border-blue-200',
        hover: 'hover:from-blue-600 hover:to-blue-700'
      },
      red: {
        bg: 'from-red-500 to-red-600',
        text: 'text-red-600',
        bgLight: 'bg-red-50',
        border: 'border-red-200',
        hover: 'hover:from-red-600 hover:to-red-700'
      },
      green: {
        bg: 'from-green-500 to-green-600',
        text: 'text-green-600',
        bgLight: 'bg-green-50',
        border: 'border-green-200',
        hover: 'hover:from-green-600 hover:to-green-700'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        text: 'text-purple-600',
        bgLight: 'bg-purple-50',
        border: 'border-purple-200',
        hover: 'hover:from-purple-600 hover:to-purple-700'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-10 w-10 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Quero Seguros</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-base text-gray-600">
              <a href="#sobre" className="cursor-pointer hover:text-blue-600 transition-colors font-medium">Sobre Nós</a>
              <a href="#seguros" className="cursor-pointer hover:text-blue-600 transition-colors font-medium">Seguros</a>
              <a href="#contato" className="cursor-pointer hover:text-blue-600 transition-colors font-medium">Fale Conosco</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Banner Principal */}
      <section className="pt-10 pb-20 sm:pt-16 sm:pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px] relative">
            
            {/* Conteúdo à Esquerda - Carrossel */}
            <div className="text-white space-y-8 relative">
              {/* Container do Carrossel */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {heroSlides.map((slide, index) => (
                    <div key={slide.id} className="w-full flex-shrink-0">
                      {/* Título Principal */}
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        {slide.title}
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                          {slide.highlight}
                        </span>
                        {slide.subtitle}
                      </h1>
                      
                      {/* Subtítulo */}
                      <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed max-w-2xl mb-8">
                        {slide.description}
                      </p>
                      
                      {/* Botão de Ação */}
                      <button 
                        onClick={() => document.getElementById('seguros')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 rounded-2xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-yellow-300 hover:to-orange-300 mb-8"
                      >
                        <Shield className="h-6 w-6 mr-3" />
                        {slide.buttonText}
                      </button>
                      
                      {/* Informações Adicionais */}
                      <div className="flex flex-wrap items-center gap-6 text-blue-200">
                        {slide.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controles do Carrossel */}
              <div className=" bottom-4 left-4 flex items-center gap-4 ">
                <button
                  onClick={prevSlide}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
                
                {/* Indicadores */}
                <div className="flex space-x-2 ml-4">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        currentSlide === index ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Imagem à Direita */}
            <div className="relative">
              <div className="relative z-10">
                {/* Placeholder para imagem - Você pode substituir por uma imagem real */}
                <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="aspect-square bg-gradient-to-br from-blue-300/30 to-indigo-300/30 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white/80">
                      <Users className="h-24 w-24 mx-auto mb-4 text-white/60" />
                      <h3 className="text-2xl font-semibold mb-2">Família Protegida</h3>
                      <p className="text-lg">Segurança e tranquilidade para todos</p>
                    </div>
                  </div>
                </div>
                
                {/* Elementos decorativos */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-400/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Cards de Categorias de Seguros */}
      <section id="seguros" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Qual seguro você está procurando?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Clique no card para iniciar sua cotação personalizada e descobrir as melhores opções do mercado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceCategories.map((category) => {
              const colors = getColorClasses(category.color)
              const IconComponent = category.icon
              
              return (
                <div
                  key={category.id}
                  onClick={() => router.push(category.route)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 cursor-pointer transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bgLight} rounded-2xl mb-6`}>
                      <IconComponent className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {category.description}
                    </p>
                    
                    {/* Benefícios */}
                    <div className="space-y-2 mb-6">
                      {category.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>

                    {/* Botão CTA */}
                    <button className={`w-full bg-gradient-to-r ${colors.bg} ${colors.hover} text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center hover:shadow-lg`}>
                      <Clock className="h-4 w-4 mr-2" />
                      Cotar Agora
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-3xl font-bold text-gray-900">+10.000</span>
              </div>
              <p className="text-gray-600 font-medium">Pessoas já compararam</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-yellow-500 mr-3" />
                <span className="text-3xl font-bold text-gray-900">4.8/5</span>
              </div>
              <p className="text-gray-600 font-medium">Avaliação dos usuários</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <span className="text-3xl font-bold text-gray-900">100%</span>
              </div>
              <p className="text-gray-600 font-medium">Conforme LGPD</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Pronto para economizar no seu seguro?
          </h3>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Milhares de pessoas já economizaram com nossa plataforma. Escolha sua categoria e comece agora!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {insuranceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => router.push(category.route)}
                className="bg-white text-blue-600 px-6 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm hover:shadow-lg transform hover:scale-105"
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-2xl font-bold">Quero Seguros</span>
            </div>
            <p className="text-gray-400 mb-4">
              © 2025 Grupo Cuidarte. Todos os direitos reservados.
            </p>
            <div className="flex justify-center space-x-6 text-base text-gray-400">
              <a href="#termos" className="cursor-pointer hover:text-gray-300 transition-colors">Termos de Uso</a>
              <a href="#privacidade" className="cursor-pointer hover:text-gray-300 transition-colors">Política de Privacidade</a>
              <a href="#lgpd" className="cursor-pointer hover:text-gray-300 transition-colors">LGPD</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
