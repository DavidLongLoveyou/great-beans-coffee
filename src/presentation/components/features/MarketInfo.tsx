'use client';

import {
  Clock,
  MapPin,
  DollarSign,
  Ship,
  Award,
  CreditCard,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { useMarket } from '@/shared/hooks/useMarket';

interface MarketInfoProps {
  showPorts?: boolean;
  showCertifications?: boolean;
  showPaymentTerms?: boolean;
  className?: string;
}

export function MarketInfo({
  showPorts = true,
  showCertifications = true,
  showPaymentTerms = true,
  className = '',
}: MarketInfoProps) {
  const {
    config,
    isBusinessHours,
    businessHours,
    coffeeGradingStandards,
    paymentTerms,
    certificationRequirements,
    formatDate,
  } = useMarket();

  const currentTime = formatDate(new Date());

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Market Information - {config.country}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Currency */}
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Currency</p>
                <p className="text-sm text-muted-foreground">
                  {config.currency.name} ({config.currency.symbol})
                </p>
              </div>
            </div>

            {/* Timezone */}
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Local Time</p>
                <p className="text-sm text-muted-foreground">{currentTime}</p>
                <Badge
                  variant={isBusinessHours ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {isBusinessHours ? 'Business Hours' : 'After Hours'}
                </Badge>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Business Hours</p>
                <p className="text-sm text-muted-foreground">
                  {businessHours.start} - {businessHours.end}
                </p>
                <p className="text-xs text-muted-foreground">
                  {businessHours.timezone}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Major Ports */}
      {showPorts && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5" />
              Major Ports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {config.majorPorts.map(port => (
                <div
                  key={`port-${port.code}`}
                  className="rounded-lg border p-3"
                >
                  <h4 className="font-medium">{port.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {port.city}, {port.country}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Code: {port.code}
                  </p>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Coordinates: {port.coordinates.lat.toFixed(4)},{' '}
                    {port.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 p-3">
              <p className="text-sm">
                <strong>Average Transit Time:</strong>{' '}
                {config.shippingInfo.averageTransitDays} days
              </p>
              <p className="mt-1 text-sm">
                <strong>Preferred Incoterms:</strong>{' '}
                {config.shippingInfo.preferredIncoterms.join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coffee Grading Standards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Coffee Grading Standards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="font-medium">{coffeeGradingStandards.standard}</p>
              <p className="text-sm text-muted-foreground">
                {coffeeGradingStandards.description}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Available Grades:</p>
              <div className="flex flex-wrap gap-2">
                {coffeeGradingStandards.grades.map(grade => (
                  <Badge key={`grade-${grade}`} variant="outline">
                    {grade}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Terms */}
      {showPaymentTerms && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium">
                  Preferred Payment Methods:
                </p>
                <div className="flex flex-wrap gap-2">
                  {paymentTerms.preferredMethods.map(method => (
                    <Badge key={`payment-method-${method}`} variant="default">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Standard Terms:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {paymentTerms.standardTerms.map(term => (
                    <li
                      key={`payment-term-${term.slice(0, 20)}`}
                      className="flex items-start gap-2"
                    >
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-current"></span>
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-sm">
                  <strong>Currency:</strong> {paymentTerms.currency}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {showCertifications && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certification Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-red-600">
                  Required:
                </p>
                <div className="flex flex-wrap gap-2">
                  {certificationRequirements.required.map(cert => (
                    <Badge key={`required-cert-${cert}`} variant="destructive">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-orange-600">
                  Preferred:
                </p>
                <div className="flex flex-wrap gap-2">
                  {certificationRequirements.preferred.map(cert => (
                    <Badge key={`preferred-cert-${cert}`} variant="default">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-blue-600">
                  Optional:
                </p>
                <div className="flex flex-wrap gap-2">
                  {certificationRequirements.optional.map(cert => (
                    <Badge key={`optional-cert-${cert}`} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MarketInfo;
