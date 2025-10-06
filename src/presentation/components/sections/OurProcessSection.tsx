'use client';

import { 
  Sprout, 
  Truck, 
  Shield, 
  Ship, 
  CheckCircle,
  ArrowRight,
  Coffee,
  Award,
  Users,
  Globe
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';

interface OurProcessSectionProps {
  locale: string;
}

interface ProcessStep {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string[];
  stats: {
    label: string;
    value: string;
  }[];
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function OurProcessSection({ locale }: OurProcessSectionProps) {
  const t = useTranslations('homepage');
  const [activeStep, setActiveStep] = useState(0);

  const processSteps: ProcessStep[] = [
    {
      id: 'sourcing',
      icon: Sprout,
      title: 'Farm Sourcing & Partnership',
      description: 'Direct partnerships with premium coffee farms across Vietnam\'s finest growing regions',
      details: [
        'Direct trade relationships with 500+ farmers',
        'Sustainable farming practice support',
        'Quality training and certification programs',
        'Fair pricing and long-term contracts'
      ],
      stats: [
        { label: 'Partner Farms', value: '500+' },
        { label: 'Growing Regions', value: '12' },
        { label: 'Certified Organic', value: '85%' }
      ],
      color: {
        primary: 'emerald-500',
        secondary: 'emerald-100',
        accent: 'emerald-600'
      }
    },
    {
      id: 'processing',
      icon: Coffee,
      title: 'Processing & Quality Control',
      description: 'State-of-the-art processing facilities with rigorous quality control at every stage',
      details: [
        'Advanced wet and dry processing methods',
        'Multi-stage quality inspection',
        'Moisture and defect rate monitoring',
        'Cupping and sensory evaluation'
      ],
      stats: [
        { label: 'Processing Capacity', value: '50,000MT' },
        { label: 'Quality Checks', value: '15+' },
        { label: 'Defect Rate', value: '<3%' }
      ],
      color: {
        primary: 'forest-500',
        secondary: 'forest-100',
        accent: 'forest-600'
      }
    },
    {
      id: 'certification',
      icon: Award,
      title: 'Certification & Compliance',
      description: 'Comprehensive certification programs ensuring international quality standards',
      details: [
        'ISO 22000 food safety management',
        'Organic and Fair Trade certifications',
        'Rainforest Alliance compliance',
        'HACCP implementation'
      ],
      stats: [
        { label: 'Certifications', value: '8+' },
        { label: 'Compliance Rate', value: '100%' },
        { label: 'Audit Score', value: '98%' }
      ],
      color: {
        primary: 'amber-500',
        secondary: 'amber-100',
        accent: 'amber-600'
      }
    },
    {
      id: 'logistics',
      icon: Ship,
      title: 'Global Logistics & Export',
      description: 'Efficient logistics network ensuring timely delivery to global markets',
      details: [
        'Strategic port locations in Ho Chi Minh City',
        'Temperature-controlled storage facilities',
        'Real-time shipment tracking',
        'Flexible Incoterms (FOB, CIF, CFR)'
      ],
      stats: [
        { label: 'Export Markets', value: '45+' },
        { label: 'Monthly Capacity', value: '5,000MT' },
        { label: 'On-time Delivery', value: '99.2%' }
      ],
      color: {
        primary: 'blue-500',
        secondary: 'blue-100',
        accent: 'blue-600'
      }
    }
  ];

  const currentStep = processSteps[activeStep];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sage-50 via-white to-emerald-50 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-emerald-400 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-forest-400 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3">
            <Shield className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-emerald-800">From Farm to Port</span>
          </div>
          
          <h2 className="mb-6 text-4xl font-bold leading-tight text-forest-900 md:text-5xl">
            Our Coffee
            <span className="block bg-gradient-to-r from-emerald-600 to-forest-600 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-forest-700">
            From sustainable farming partnerships to global logistics, discover how we ensure 
            the highest quality Vietnamese coffee reaches your business
          </p>
        </div>

        {/* Process Navigation */}
        <div className="mb-16 flex flex-wrap justify-center gap-4">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`group relative flex items-center gap-3 rounded-xl border-2 px-6 py-4 transition-all duration-300 ${
                  isActive
                    ? `border-${step.color.primary} bg-${step.color.primary} text-white shadow-lg`
                    : 'border-forest-200 bg-white text-forest-700 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <div className={`rounded-lg p-2 ${
                  isActive 
                    ? 'bg-white/20' 
                    : `bg-${step.color.secondary}`
                }`}>
                  <Icon className={`h-5 w-5 ${
                    isActive 
                      ? 'text-white' 
                      : `text-${step.color.primary}`
                  }`} />
                </div>
                
                <div className="text-left">
                  <div className="font-semibold">{step.title}</div>
                  <div className={`text-sm ${
                    isActive ? 'text-white/80' : 'text-forest-500'
                  }`}>
                    Step {index + 1}
                  </div>
                </div>

                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 lg:block">
                    <ArrowRight className="h-4 w-4 text-forest-300" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Step Details */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Details */}
          <div className="space-y-8">
            <Card className="border-forest-200 bg-white shadow-forest-soft">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl bg-${currentStep.color.primary} p-3`}>
                    <currentStep.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-forest-900">
                      {currentStep.title}
                    </CardTitle>
                    <CardDescription className="text-lg text-forest-600">
                      {currentStep.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Process Details */}
                <div className="space-y-4">
                  {currentStep.details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className={`mt-0.5 h-5 w-5 flex-shrink-0 text-${currentStep.color.primary}`} />
                      <span className="text-forest-700">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  {currentStep.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-2xl font-bold text-${currentStep.color.primary}`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-forest-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <Card className="border-forest-200 bg-gradient-to-br from-white to-sage-50 shadow-forest-soft">
              <CardContent className="p-8">
                {/* Process Flow Visualization */}
                <div className="space-y-6">
                  {processSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === activeStep;
                    const isPassed = index < activeStep;
                    
                    return (
                      <div key={step.id} className="relative">
                        <div className="flex items-center gap-4">
                          {/* Step Icon */}
                          <div className={`relative z-10 rounded-full p-3 transition-all duration-300 ${
                            isActive
                              ? `bg-${step.color.primary} shadow-lg`
                              : isPassed
                              ? `bg-${step.color.accent} shadow-md`
                              : 'bg-forest-100'
                          }`}>
                            <Icon className={`h-6 w-6 ${
                              isActive || isPassed ? 'text-white' : 'text-forest-400'
                            }`} />
                          </div>

                          {/* Step Info */}
                          <div className="flex-1">
                            <div className={`font-semibold transition-colors ${
                              isActive ? `text-${step.color.primary}` : 'text-forest-700'
                            }`}>
                              {step.title}
                            </div>
                            <div className="text-sm text-forest-500">
                              {step.description}
                            </div>
                          </div>

                          {/* Status Badge */}
                          {isActive && (
                            <Badge className={`bg-${step.color.primary} text-white`}>
                              Active
                            </Badge>
                          )}
                          {isPassed && (
                            <CheckCircle className={`h-5 w-5 text-${step.color.accent}`} />
                          )}
                        </div>

                        {/* Connection Line */}
                        {index < processSteps.length - 1 && (
                          <div className={`absolute left-6 top-12 h-8 w-0.5 transition-colors ${
                            isPassed ? `bg-${step.color.accent}` : 'bg-forest-200'
                          }`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quality Assurance Badge */}
                <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-emerald-800">Quality Guaranteed</div>
                      <div className="text-sm text-emerald-600">
                        ISO 22000 certified process with 99.8% quality compliance
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Global Reach Section */}
        <div className="mt-20 text-center">
          <Card className="border-forest-200 bg-gradient-to-r from-forest-900 to-emerald-900 shadow-forest-strong">
            <CardContent className="p-12">
              <div className="mb-8 flex justify-center">
                <Globe className="h-16 w-16 text-emerald-400" />
              </div>
              
              <h3 className="mb-4 text-3xl font-bold text-white">
                Trusted by Coffee Businesses Worldwide
              </h3>
              
              <p className="mb-8 text-xl text-forest-100">
                Our proven process delivers premium Vietnamese coffee to 45+ countries
              </p>

              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">500+</div>
                  <div className="text-forest-200">Partner Farms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">45+</div>
                  <div className="text-forest-200">Export Markets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">50,000MT</div>
                  <div className="text-forest-200">Annual Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">99.2%</div>
                  <div className="text-forest-200">On-time Delivery</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}