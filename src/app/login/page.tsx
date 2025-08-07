'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowLeft, Eye, EyeOff, Mail, Lock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulação de API call - Substituir por chamada real ao backend
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simula delay da API
      
      // Mock de validação - Substituir por validação real
      if (formData.email === 'user@test.com' && formData.password === '123456') {
        const mockUser = {
          name: 'João Silva',
          email: formData.email
        }
        
        // Aqui você salvaria o token no localStorage/cookies
        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.setItem('token', 'mock-jwt-token-12345')
        
        // Redirecionar para o dashboard
        router.push('/dashboard')
      } else {
        alert('Email ou senha incorretos. Use: user@test.com / 123456')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      alert('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-[#656D7A] hover:text-[#2A2F8D] transition-colors mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
            
            <div className="flex items-center mb-6">
              <Shield className="text-[#2A2F8D] w-8 h-8 mr-3" />
              <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
            </div>
            
            <h2 className="text-3xl font-bold text-[#1D2129] mb-2 font-inter">
              Bem-vindo de volta!
            </h2>
            <p className="text-[#656D7A] font-inter">
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#656D7A] w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                  placeholder="seu@email.com"
                />
              </div>
              <p className="text-xs text-[#656D7A] mt-1 font-inter">
                Demo: use <span className="font-medium">user@test.com</span>
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1D2129] mb-2 font-inter">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#656D7A] w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-[#E9EDF2] rounded-lg focus:ring-2 focus:ring-[#2A2F8D] focus:border-transparent transition-colors font-inter"
                  placeholder="Sua senha"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#656D7A] hover:text-[#2A2F8D]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-[#656D7A] mt-1 font-inter">
                Demo: use <span className="font-medium">123456</span>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-[#E9EDF2] text-[#2A2F8D] focus:ring-[#2A2F8D]" />
                <span className="ml-2 text-sm text-[#656D7A] font-inter">Lembrar-me</span>
              </label>
              <a href="#" className="text-sm text-[#2A2F8D] hover:text-[#1E2464] font-inter">
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#2A2F8D] text-white rounded-lg hover:bg-[#1E2464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium font-inter"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-8 text-center">
            <p className="text-[#656D7A] font-inter">
              Não tem uma conta?{' '}
              <Link href="/registro" className="text-[#2A2F8D] hover:text-[#1E2464] font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Lado Direito - Informativo */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#2A2F8D] to-[#1E2464] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 flex items-center justify-center p-12">
          <div className="text-center text-white max-w-lg">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
                <Shield className="w-12 h-12 text-[#00C2FF]" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-6 font-inter">
              Sua proteção em primeiro lugar
            </h3>
            
            <p className="text-xl leading-relaxed mb-8 text-white/90 font-inter">
              Acesse milhares de opções de seguros com as melhores condições do mercado. 
              Proteção completa para você e sua família.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-left">
                <CheckCircle2 className="w-5 h-5 text-[#00BA88] mr-3 flex-shrink-0" />
                <span className="font-inter">Comparação instantânea de preços</span>
              </div>
              <div className="flex items-center text-left">
                <CheckCircle2 className="w-5 h-5 text-[#00BA88] mr-3 flex-shrink-0" />
                <span className="font-inter">Atendimento especializado 24h</span>
              </div>
              <div className="flex items-center text-left">
                <CheckCircle2 className="w-5 h-5 text-[#00BA88] mr-3 flex-shrink-0" />
                <span className="font-inter">Processo 100% digital e seguro</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-[#00C2FF]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-[#00BA88]/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}
