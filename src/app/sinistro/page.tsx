'use client'

import { Shield, Phone, ExternalLink, Clock, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const insuranceCompanies = [
  {
    name: 'Porto Seguro',
    phone: '3003-4040',
    website: 'https://www.portoseguro.com.br/sinistros',
    logo: '/logos/porto-seguro.png',
    hours: '24h'
  },
  {
    name: 'Bradesco Seguros',
    phone: '4002-6692',
    website: 'https://www.bradescoseguros.com.br/sinistros',
    logo: '/logos/bradesco.png',
    hours: '24h'
  },
  {
    name: 'SulAmérica',
    phone: '4003-4400',
    website: 'https://www.sulaamerica.com.br/sinistros',
    logo: '/logos/sulaamerica.png',
    hours: '24h'
  },
  {
    name: 'Unimed',
    phone: '0800-942-0300',
    website: 'https://www.unimed.coop.br/atendimento',
    logo: '/logos/unimed.png',
    hours: '24h'
  },
  {
    name: 'Allianz',
    phone: '4002-4040',
    website: 'https://www.allianz.com.br/sinistros',
    logo: '/logos/allianz.png',
    hours: '24h'
  }
]

const emergencySteps = [
  {
    step: 1,
    title: 'Mantenha a Calma',
    description: 'Respire fundo e avalie a situação. Sua segurança vem primeiro.',
    icon: AlertTriangle,
    color: 'text-red-600'
  },
  {
    step: 2,
    title: 'Verifique se Há Feridos',
    description: 'Se houver feridos, chame o SAMU (192) ou Bombeiros (193) imediatamente.',
    icon: Phone,
    color: 'text-orange-600'
  },
  {
    step: 3,
    title: 'Registre o Ocorrido',
    description: 'Tire fotos dos veículos, documentos e da situação geral do acidente.',
    icon: CheckCircle,
    color: 'text-blue-600'
  },
  {
    step: 4,
    title: 'Entre em Contato com o Seguro',
    description: 'Ligue para sua seguradora o quanto antes usando os números abaixo.',
    icon: Phone,
    color: 'text-green-600'
  }
]

export default function SinistroPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#2A2F8D] w-8 h-8" />
            <h1 className="text-2xl font-bold text-[#2A2F8D] font-inter">QueroSeguros</h1>
          </div>
          
          <Link href="/dashboard" className="flex items-center space-x-2 text-[#656D7A] hover:text-[#2A2F8D] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-inter">Voltar ao Dashboard</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Título */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2A2F8D] rounded-full mb-6">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-[#1D2129] mb-4 font-inter">Como Acionar seu Seguro</h2>
          <p className="text-xl text-[#656D7A] font-inter">Guia completo para situações de emergência e sinistros</p>
        </div>

        {/* Passos de Emergência */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-[#1D2129] mb-8 font-inter">Em caso de acidente, siga estes passos:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencySteps.map((step) => {
              const IconComponent = step.icon
              return (
                <div key={step.step} className="bg-white rounded-2xl border border-[#E9EDF2] p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#F7F9FC] rounded-full flex items-center justify-center">
                        <IconComponent className={`w-6 h-6 ${step.color}`} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-6 h-6 bg-[#2A2F8D] text-white text-sm font-bold rounded-full flex items-center justify-center">
                          {step.step}
                        </span>
                        <h4 className="text-lg font-bold text-[#1D2129] font-inter">{step.title}</h4>
                      </div>
                      <p className="text-[#656D7A] font-inter">{step.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Números de Emergência Geral */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-12">
          <h3 className="text-xl font-bold text-red-800 mb-4 font-inter">🚨 Números de Emergência</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600 font-inter">192</div>
              <div className="text-red-800 font-inter">SAMU</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600 font-inter">193</div>
              <div className="text-red-800 font-inter">Bombeiros</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600 font-inter">190</div>
              <div className="text-red-800 font-inter">Polícia Militar</div>
            </div>
          </div>
        </div>

        {/* Contatos das Seguradoras */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-[#1D2129] mb-8 font-inter">Contatos das Principais Seguradoras</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insuranceCompanies.map((company) => (
              <div key={company.name} className="bg-white rounded-2xl border border-[#E9EDF2] p-6 hover:border-[#2A2F8D] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-[#1D2129] font-inter">{company.name}</h4>
                  <div className="flex items-center text-sm text-[#656D7A] font-inter">
                    <Clock className="w-4 h-4 mr-1" />
                    {company.hours}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <a 
                    href={`tel:${company.phone}`}
                    className="flex items-center space-x-3 p-3 bg-[#F7F9FC] rounded-lg hover:bg-[#E9EDF2] transition-colors"
                  >
                    <Phone className="w-5 h-5 text-[#2A2F8D]" />
                    <div>
                      <div className="font-semibold text-[#1D2129] font-inter">{company.phone}</div>
                      <div className="text-sm text-[#656D7A] font-inter">Toque para ligar</div>
                    </div>
                  </a>
                  
                  <a 
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-[#F7F9FC] rounded-lg hover:bg-[#E9EDF2] transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-[#2A2F8D]" />
                    <div>
                      <div className="font-semibold text-[#1D2129] font-inter">Portal de Sinistros</div>
                      <div className="text-sm text-[#656D7A] font-inter">Abrir no navegador</div>
                    </div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentos Necessários */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-12">
          <h3 className="text-xl font-bold text-blue-800 mb-4 font-inter">📋 Documentos que você vai precisar:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-blue-700 font-inter">
              <li>• Número da apólice</li>
              <li>• CPF do segurado</li>
              <li>• Carteira de motorista (CNH)</li>
              <li>• Documento do veículo (CRLV)</li>
            </ul>
            <ul className="space-y-2 text-blue-700 font-inter">
              <li>• Fotos dos danos</li>
              <li>• Boletim de ocorrência (se houver)</li>
              <li>• Dados do terceiro envolvido</li>
              <li>• Local, data e hora do acidente</li>
            </ul>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-white rounded-2xl border border-[#E9EDF2] p-8">
          <h3 className="text-2xl font-bold text-[#1D2129] mb-4 font-inter">Precisa de mais ajuda?</h3>
          <p className="text-[#656D7A] mb-6 font-inter">
            Nossa equipe está sempre disponível para te orientar em situações de sinistro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="px-6 py-3 bg-[#2A2F8D] text-white rounded-lg hover:bg-[#1E2464] transition-colors font-medium font-inter"
            >
              Voltar ao Dashboard
            </Link>
            <a 
              href="tel:0800-123-4567"
              className="px-6 py-3 border border-[#2A2F8D] text-[#2A2F8D] rounded-lg hover:bg-[#F7F9FC] transition-colors font-medium font-inter"
            >
              Falar com Suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
