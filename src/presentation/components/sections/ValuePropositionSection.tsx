import { 
  Shield, 
  Award, 
  Globe, 
  Truck, 
  Coffee, 
  CheckCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

interface ValuePropositionSectionProps {
  locale: string;
}

export function ValuePropositionSection({ locale }: ValuePropositionSectionProps) {
  const t = useTranslations('homepage');

  const valueProps = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'ISO 22000 certified facilities with rigorous quality control at every stage',
      features: ['ISO 22000 Certified', 'HACCP Compliant', 'Third-party Audited'],
      color: 'forest'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Serving 25+ countries with reliable international shipping and logistics',
      features: ['25+ Countries', 'FOB/CIF Terms', 'Full Documentation'],
      color: 'emerald'
    },
    {
      icon: Award,
      title: 'Premium Origins',
      description: 'Direct sourcing from Vietnam\'s finest coffee growing regions',
      features: ['Direct Trade', 'Traceability', 'Sustainable Sourcing'],
      color: 'forest'
    },
    {
      icon: TrendingUp,
      title: 'Market Leadership',
      description: '15+ years of experience in international coffee export',
      features: ['500+ Partners', '15+ Years', 'Market Expertise'],
      color: 'emerald'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-forest-50 to-emerald-50 py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-forest-400 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 h-36 w-36 rounded-full bg-emerald-400 animate-pulse delay-1000"></div>
        <div className="absolute left-1/3 top-1/2 h-20 w-20 rounded-full bg-forest-300 animate-pulse delay-500"></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-100 px-6 py-3">
            <Coffee className="h-5 w-5 text-forest-600" />
            <span className="font-medium text-forest-700">Why Choose The Great Beans</span>
          </div>
          
          <h2 className="mb-6 text-4xl font-bold leading-tight text-forest-900 md:text-5xl">
            Your Trusted Partner for
            <span className="block bg-gradient-to-r from-forest-600 to-emerald-600 bg-clip-text text-transparent">
              Premium Vietnamese Coffee
            </span>
          </h2>
          
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-forest-600">
            We combine traditional Vietnamese coffee expertise with modern B2B solutions, 
            delivering exceptional quality and service to international partners worldwide.
          </p>
        </div>

        {/* Value Propositions Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            const isEmerald = prop.color === 'emerald';
            
            return (
              <Card 
                key={prop.title}
                className={`group relative overflow-hidden border-2 transition-all duration-500 hover:-translate-y-2 ${
                  isEmerald 
                    ? 'border-emerald-200 bg-white/80 hover:border-emerald-300 hover:shadow-emerald-strong' 
                    : 'border-forest-200 bg-white/80 hover:border-forest-300 hover:shadow-forest-strong'
                } backdrop-blur-sm`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 ${
                  isEmerald ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-forest-400 to-forest-600'
                }`}></div>
                
                <CardHeader className="relative pb-4">
                  <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                    isEmerald 
                      ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-emerald-soft group-hover:shadow-emerald-medium' 
                      : 'bg-gradient-to-br from-forest-100 to-forest-200 shadow-forest-soft group-hover:shadow-forest-medium'
                  }`}>
                    <Icon className={`h-10 w-10 ${isEmerald ? 'text-emerald-600' : 'text-forest-600'}`} />
                  </div>
                  
                  <CardTitle className="text-center text-xl font-bold text-forest-800 transition-colors group-hover:text-forest-600">
                    {prop.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative text-center">
                  <p className="mb-6 leading-relaxed text-forest-600">
                    {prop.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-2">
                    {prop.features.map((feature) => (
                      <div key={feature} className="flex items-center justify-center gap-2 text-sm">
                        <CheckCircle className={`h-4 w-4 flex-shrink-0 ${isEmerald ? 'text-emerald-500' : 'text-forest-500'}`} />
                        <span className="text-forest-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-6 py-3">
            <Users className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-emerald-700">Trusted by Industry Leaders</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {/* Partner logos placeholders */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                className="flex h-16 w-32 items-center justify-center rounded-lg border border-forest-200/50 bg-gradient-to-r from-forest-100/30 to-emerald-100/30 shadow-sm transition-all duration-300 hover:opacity-80"
              >
                <Coffee className="h-8 w-8 text-forest-400" />
              </div>
            ))}
          </div>
          
          <p className="mt-6 text-sm text-forest-500">
            Serving 500+ B2B partners across 25+ countries since 2018
          </p>
        </div>
      </div>
    </section>
  );
}