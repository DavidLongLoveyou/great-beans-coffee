'use client';

import React from 'react';
import { Clock, MapPin, DollarSign, Ship, Award, CreditCard } from 'lucide-react';
import { useMarket } from '@/shared/hooks/useMarket';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';

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
  className = '' 
}: MarketInfoProps) {
  const {
    config,
    isBusinessHours,
    businessHours,
    coffeeGradingStandards,
    paymentTerms,
    certificationRequirements,
    formatDate
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <p className="text-sm text-muted-foreground">
                  {currentTime}
                </p>
                <Badge variant={isBusinessHours ? "default" : "secondary"} className="mt-1">
                  {isBusinessHours ? "Business Hours" : "After Hours"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.majorPorts.map((port, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-medium">{port.name}</h4>
                  <p className="text-sm text-muted-foreground">{port.city}, {port.country}</p>
                  <p className="text-xs text-muted-foreground mt-1">Code: {port.code}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    Coordinates: {port.coordinates.lat.toFixed(4)}, {port.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <strong>Average Transit Time:</strong> {config.shippingInfo.averageTransitDays} days
              </p>
              <p className="text-sm mt-1">
                <strong>Preferred Incoterms:</strong> {config.shippingInfo.preferredIncoterms.join(', ')}
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
              <p className="text-sm text-muted-foreground">{coffeeGradingStandards.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Available Grades:</p>
              <div className="flex flex-wrap gap-2">
                {coffeeGradingStandards.grades.map((grade, index) => (
                  <Badge key={index} variant="outline">
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
                <p className="text-sm font-medium mb-2">Preferred Payment Methods:</p>
                <div className="flex flex-wrap gap-2">
                  {paymentTerms.preferredMethods.map((method, index) => (
                    <Badge key={index} variant="default">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Standard Terms:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {paymentTerms.standardTerms.map((term, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0"></span>
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
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
                <p className="text-sm font-medium mb-2 text-red-600">Required:</p>
                <div className="flex flex-wrap gap-2">
                  {certificationRequirements.required.map((cert, index) => (
                    <Badge key={index} variant="destructive">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2 text-orange-600">Preferred:</p>
                <div className="flex flex-wrap gap-2">
                  {certificationRequirements.preferred.map((cert, index) => (
                    <Badge key={index} variant="default">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2 text-blue-600">Optional:</p>
                <div className="flex flex-wrap gap-2">
                  {certificationRequirements.optional.map((cert, index) => (
                    <Badge key={index} variant="outline">
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