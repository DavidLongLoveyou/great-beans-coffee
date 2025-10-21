'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import {
  Eye,
  EyeOff,
  Building,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { Separator } from '@/presentation/components/ui/separator';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Icons, google as GoogleIcon } from '@/components/ui/icons';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyType: string;
  country: string;
  phone: string;
  website: string;
  termsAccepted: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const companyTypes = [
  { value: 'exporter', label: 'Coffee Exporter' },
  { value: 'importer', label: 'Coffee Importer' },
  { value: 'roaster', label: 'Coffee Roaster' },
  { value: 'distributor', label: 'Coffee Distributor' },
  { value: 'retailer', label: 'Coffee Retailer' },
  { value: 'trader', label: 'Coffee Trader' },
  { value: 'cooperative', label: 'Coffee Cooperative' },
  { value: 'farm', label: 'Coffee Farm' },
  { value: 'other', label: 'Other' },
];

const countries = [
  { value: 'VN', label: 'Vietnam' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CO', label: 'Colombia' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IN', label: 'India' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'HN', label: 'Honduras' },
  { value: 'PE', label: 'Peru' },
  { value: 'UG', label: 'Uganda' },
  { value: 'US', label: 'United States' },
  { value: 'DE', label: 'Germany' },
  { value: 'IT', label: 'Italy' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'FR', label: 'France' },
  { value: 'NL', label: 'Netherlands' },
];

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyType: '',
    country: '',
    phone: '',
    website: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Personal Information Validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('register.errors.firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('register.errors.lastNameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('register.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('register.errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('register.errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('register.errors.passwordMinLength');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.passwordMismatch');
    }

    // Company Information Validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = t('register.errors.companyNameRequired');
    }

    if (!formData.companyType) {
      newErrors.companyType = t('register.errors.companyTypeRequired');
    }

    if (!formData.country) {
      newErrors.country = t('register.errors.countryRequired');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('register.errors.phoneRequired');
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))
    ) {
      newErrors.phone = t('register.errors.phoneInvalid');
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = t('register.errors.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    // Validate current step
    const stepErrors: FormErrors = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim())
        stepErrors.firstName = t('register.errors.firstNameRequired');
      if (!formData.lastName.trim())
        stepErrors.lastName = t('register.errors.lastNameRequired');
      if (!formData.email.trim()) {
        stepErrors.email = t('register.errors.emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        stepErrors.email = t('register.errors.emailInvalid');
      }
      if (!formData.password) {
        stepErrors.password = t('register.errors.passwordRequired');
      } else if (formData.password.length < 8) {
        stepErrors.password = t('register.errors.passwordMinLength');
      }
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = t('register.errors.passwordMismatch');
      }
    }

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          companyType: formData.companyType,
          country: formData.country,
          phone: formData.phone,
          website: formData.website,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'EMAIL_EXISTS') {
          setErrors({ email: t('register.errors.emailExists') });
        } else {
          setErrors({
            submit: data.error || t('register.errors.registrationFailed'),
          });
        }
        return;
      }

      // Registration successful, redirect to verification page
      router.push(
        `/auth/verify-email?email=${encodeURIComponent(formData.email)}`
      );
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: t('register.errors.registrationFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Google sign up error:', error);
      setErrors({ submit: t('login.errors.oauthError') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {t('register.title')}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t('register.subtitle')}
          </CardDescription>

          {/* Step Indicator */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div
              className={`flex items-center ${currentStep >= 1 ? 'text-amber-600' : 'text-gray-400'}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}
              >
                <User className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">
                {t('register.personalInfo')}
              </span>
            </div>
            <div
              className={`h-1 w-8 ${currentStep >= 2 ? 'bg-amber-600' : 'bg-gray-200'}`}
            />
            <div
              className={`flex items-center ${currentStep >= 2 ? 'text-amber-600' : 'text-gray-400'}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}
              >
                <Building className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">
                {t('register.companyInfo')}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {errors.submit}
                </AlertDescription>
              </Alert>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('register.firstName')}</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={e =>
                        handleInputChange('firstName', e.target.value)
                      }
                      className={errors.firstName ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('register.lastName')}</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={e =>
                        handleInputChange('lastName', e.target.value)
                      }
                      className={errors.lastName ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('register.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('register.password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={e =>
                        handleInputChange('password', e.target.value)
                      }
                      className={errors.password ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t('register.confirmPassword')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={e =>
                        handleInputChange('confirmPassword', e.target.value)
                      }
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  disabled={isLoading}
                >
                  Continue to Company Information
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      {t('common.or')}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full"
                >
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  {t('register.signUpWithGoogle')}
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    {t('register.companyName')}
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={e =>
                        handleInputChange('companyName', e.target.value)
                      }
                      className={`pl-10 ${errors.companyName ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyType">
                    {t('register.companyType')}
                  </Label>
                  <Select
                    value={formData.companyType}
                    onValueChange={value =>
                      handleInputChange('companyType', value)
                    }
                  >
                    <SelectTrigger
                      className={errors.companyType ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.companyType && (
                    <p className="text-sm text-red-600">{errors.companyType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{t('register.country')}</Label>
                  <Select
                    value={formData.country}
                    onValueChange={value => handleInputChange('country', value)}
                  >
                    <SelectTrigger
                      className={errors.country ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-600">{errors.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('register.phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                      placeholder="+84 28 1234 5678"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">{t('register.website')}</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={e =>
                        handleInputChange('website', e.target.value)
                      }
                      className="pl-10"
                      disabled={isLoading}
                      placeholder="https://www.yourcompany.com"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={checked =>
                      handleInputChange('termsAccepted', checked as boolean)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    {t('register.termsAccept')}{' '}
                    <Link
                      href="/legal/terms"
                      className="text-amber-600 hover:text-amber-700"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/legal/privacy"
                      className="text-amber-600 hover:text-amber-700"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-sm text-red-600">{errors.termsAccepted}</p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.loading')}
                      </>
                    ) : (
                      t('register.createAccount')
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="text-center text-sm text-gray-600">
              {t('register.hasAccount')}{' '}
              <Link
                href="/auth/login"
                className="font-medium text-amber-600 hover:text-amber-700"
              >
                {t('register.signIn')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
