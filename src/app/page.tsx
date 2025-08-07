'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, Star, Users, Car, Home, Heart, ChevronLeft, ChevronRight, LogIn, User, Clock } from 'lucide-react'

const insuranceCategories = [
  {
    id: 'auto',
    title: 'Seguro Auto',
    description: 'Proteção completa para seu veículo com cobertura contra roubo, furto e danos.',
    icon: Car,
    color: 'blue',
    route: '/cotacao/auto/inicio'
  },
  {
    id: 'saude',
    title: 'Seguro Saúde',
    description: 'Cuidados médicos quando você mais precisa, com rede credenciada ampla.',
    icon: Heart,
    color: 'red',
    route: '/cotacao/saude/inicio'
  },
  {
    id: 'vida',
    title: 'Seguro Vida',
    description: 'Segurança financeira para sua família em todos os momentos.',
    icon: Shield,
    color: 'green',
    route: '/cotacao/vida'
  },
  {
    id: 'residencial',
    title: 'Seguro Residencial',
    description: 'Proteção total para seu lar contra incêndios, roubos e danos elétricos.',
    icon: Home,
    color: 'purple',
    route: '/cotacao/residencial/inicio'
  }
]

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { text: 'text-blue-600' },
      red: { text: 'text-red-600' },
      green: { text: 'text-green-600' },
      purple: { text: 'text-purple-600' }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-primary w-8 h-8" />
            <h1 className="text-2xl font-bold text-primary">QueroSeguros</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <a
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-[#2A2F8D] hover:text-[#1E2464] border border-[#2A2F8D] rounded-lg hover:bg-[#F7F9FC] transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Meu Hub</span>
                </a>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">Olá, {user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-primary border border-gray-200 rounded-lg hover:border-primary transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 bg-gradient-to-br from-[#2A2F8D] to-[#00C2FF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-6xl font-bold mb-6 font-inter">
              Encontre o Seguro Ideal
            </h2>
            <p className="text-2xl mb-8 text-[#00C2FF] font-semibold font-inter">
              Compare preços e coberturas
            </p>
            <p className="text-xl mb-12 text-white/90 font-inter max-w-3xl mx-auto">
              Mais de 20 seguradoras parceiras oferecendo as melhores condições para você.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('seguros')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-white text-[#2A2F8D] px-10 py-4 rounded-lg font-bold text-lg hover:bg-[#F7F9FC] transition-all duration-200 shadow-lg hover:shadow-xl font-inter"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </section>

      {/* Cards de Seguros */}
      <section id="seguros" className="py-24 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-[#1D2129] mb-8 font-inter">
              Qual seguro você está procurando?
            </h2>
            <p className="text-xl text-[#656D7A] max-w-3xl mx-auto font-inter">
              Clique no card para iniciar sua cotação personalizada
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {insuranceCategories.map((category) => {
              const colors = getColorClasses(category.color)
              const IconComponent = category.icon
              
              return (
                <div
                  key={category.id}
                  onClick={() => router.push(category.route)}
                  className="bg-white rounded-2xl border border-[#E9EDF2] hover:border-[#2A2F8D] transition-all duration-300 p-10 cursor-pointer group text-center"
                >
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F7F9FC] rounded-3xl group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className={`w-10 h-10 ${colors.text}`} />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#1D2129] mb-6 font-inter">
                    {category.title}
                  </h3>
                  
                  <p className="text-[#656D7A] leading-relaxed mb-8 font-inter text-lg">
                    {category.description}
                  </p>
                  
                  <div className="pt-4">
                                  <button
                onClick={() => router.push('/cotacao/vida/inicio')}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg font-inter"
              >
                Cotar Agora
              </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1D2129] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-10 w-10 text-[#00C2FF] mr-3" />
              <span className="text-2xl font-bold font-inter">Quero Seguros</span>
            </div>
            <p className="text-[#656D7A] mb-8 font-inter">
              © 2025 Grupo Cuidarte. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
