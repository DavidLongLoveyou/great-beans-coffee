'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
} from '@/components/ui/icons';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/presentation/components/ui/alert';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Progress } from '@/presentation/components/ui/progress';

interface ValidationRule {
  id: string;
  field: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  required: boolean;
}

interface ValidationResult {
  field: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  passed: boolean;
}

interface ContentMetadata {
  title?: string;
  description?: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  locale?: string;
  category?: string;
  featured?: boolean;
  publishedAt?: string;
  author?: string;
  coverImage?: string;
  slug?: string;
  status?: 'draft' | 'published' | 'archived';
  [key: string]: unknown;
}

interface ContentValidatorProps {
  content: string;
  metadata: ContentMetadata;
  contentType: 'blog' | 'market-report' | 'origin-story' | 'service';
  onValidationChange?: (isValid: boolean, results: ValidationResult[]) => void;
  showDetails?: boolean;
}

const VALIDATION_RULES: Record<string, ValidationRule[]> = {
  blog: [
    {
      id: 'title-length',
      field: 'title',
      rule: 'length',
      message: 'Title should be between 10-60 characters',
      severity: 'error',
      required: true,
    },
    {
      id: 'title-seo',
      field: 'seoTitle',
      rule: 'length',
      message: 'SEO title should be between 30-60 characters',
      severity: 'warning',
      required: false,
    },
    {
      id: 'description-length',
      field: 'description',
      rule: 'length',
      message: 'Description should be between 120-160 characters',
      severity: 'warning',
      required: false,
    },
    {
      id: 'content-length',
      field: 'content',
      rule: 'minLength',
      message: 'Content should be at least 300 words',
      severity: 'error',
      required: true,
    },
    {
      id: 'excerpt-length',
      field: 'excerpt',
      rule: 'length',
      message: 'Excerpt should be between 100-200 characters',
      severity: 'warning',
      required: false,
    },
    {
      id: 'keywords-count',
      field: 'keywords',
      rule: 'arrayLength',
      message: 'Should have 3-8 keywords',
      severity: 'info',
      required: false,
    },
    {
      id: 'cover-image',
      field: 'coverImage',
      rule: 'required',
      message: 'Cover image is required',
      severity: 'error',
      required: true,
    },
    {
      id: 'category',
      field: 'category',
      rule: 'required',
      message: 'Category is required',
      severity: 'error',
      required: true,
    },
  ],
  'market-report': [
    {
      id: 'title-format',
      field: 'title',
      rule: 'pattern',
      message: 'Title should include period (e.g., Q1 2024)',
      severity: 'warning',
      required: false,
    },
    {
      id: 'content-structure',
      field: 'content',
      rule: 'structure',
      message:
        'Should include Executive Summary, Market Analysis, and Forecast sections',
      severity: 'error',
      required: true,
    },
    {
      id: 'data-sources',
      field: 'content',
      rule: 'citations',
      message: 'Should include data sources and citations',
      severity: 'warning',
      required: false,
    },
  ],
  'origin-story': [
    {
      id: 'location-info',
      field: 'content',
      rule: 'location',
      message: 'Should include specific location information',
      severity: 'error',
      required: true,
    },
    {
      id: 'farmer-stories',
      field: 'content',
      rule: 'narrative',
      message: 'Should include farmer stories or personal narratives',
      severity: 'warning',
      required: false,
    },
    {
      id: 'images-gallery',
      field: 'content',
      rule: 'images',
      message: 'Should include multiple images showcasing the origin',
      severity: 'info',
      required: false,
    },
  ],
  service: [
    {
      id: 'service-benefits',
      field: 'content',
      rule: 'benefits',
      message: 'Should clearly outline service benefits',
      severity: 'error',
      required: true,
    },
    {
      id: 'pricing-info',
      field: 'content',
      rule: 'pricing',
      message: 'Should include pricing or contact information',
      severity: 'warning',
      required: false,
    },
    {
      id: 'cta-present',
      field: 'content',
      rule: 'cta',
      message: 'Should include clear call-to-action',
      severity: 'error',
      required: true,
    },
  ],
};

export function ContentValidator({
  content,
  metadata,
  contentType,
  onValidationChange,
  showDetails = true,
}: ContentValidatorProps) {
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateField = (
    rule: ValidationRule,
    value: unknown
  ): ValidationResult => {
    let passed = true;
    let message = rule.message;

    switch (rule.rule) {
      case 'length':
        if (typeof value === 'string') {
          const length = value.length;
          if (rule.field === 'title') {
            passed = length >= 10 && length <= 60;
          } else if (rule.field === 'seoTitle') {
            passed = length >= 30 && length <= 60;
          } else if (rule.field === 'description') {
            passed = length >= 120 && length <= 160;
          } else if (rule.field === 'excerpt') {
            passed = length >= 100 && length <= 200;
          }
          message = `${rule.message} (current: ${length})`;
        }
        break;

      case 'minLength':
        if (typeof value === 'string') {
          const wordCount = value
            .split(/\s+/)
            .filter(word => word.length > 0).length;
          passed = wordCount >= 300;
          message = `${rule.message} (current: ${wordCount} words)`;
        }
        break;

      case 'arrayLength':
        if (Array.isArray(value)) {
          passed = value.length >= 3 && value.length <= 8;
          message = `${rule.message} (current: ${value.length})`;
        }
        break;

      case 'required':
        passed = value !== undefined && value !== null && value !== '';
        break;

      case 'pattern':
        if (rule.field === 'title' && typeof value === 'string') {
          passed = /Q[1-4]\s+\d{4}|H[1-2]\s+\d{4}|\d{4}/.test(value);
        }
        break;

      case 'structure':
        if (typeof value === 'string') {
          const hasExecutiveSummary = /executive\s+summary/i.test(value);
          const hasMarketAnalysis = /market\s+analysis/i.test(value);
          const hasForecast = /forecast/i.test(value);
          passed = hasExecutiveSummary && hasMarketAnalysis && hasForecast;

          const missing = [];
          if (!hasExecutiveSummary) missing.push('Executive Summary');
          if (!hasMarketAnalysis) missing.push('Market Analysis');
          if (!hasForecast) missing.push('Forecast');

          if (!passed) {
            message = `Missing sections: ${missing.join(', ')}`;
          }
        }
        break;

      case 'citations':
        if (typeof value === 'string') {
          passed = /\[.*\]|\(.*\)|source:|reference:/i.test(value);
          if (!passed) {
            message = 'No citations or data sources found';
          }
        }
        break;

      case 'location':
        if (typeof value === 'string') {
          passed =
            /\b(farm|region|altitude|climate|terroir|latitude|longitude)\b/i.test(
              value
            );
          if (!passed) {
            message = 'Missing specific location or geographical information';
          }
        }
        break;

      case 'narrative':
        if (typeof value === 'string') {
          passed =
            /\b(farmer|family|generation|story|tradition|heritage)\b/i.test(
              value
            );
          if (!passed) {
            message = 'Missing personal narratives or farmer stories';
          }
        }
        break;

      case 'images':
        if (typeof value === 'string') {
          const imageCount = (value.match(/!\[.*?\]\(.*?\)/g) || []).length;
          passed = imageCount >= 3;
          message = `${rule.message} (current: ${imageCount} images)`;
        }
        break;

      case 'benefits':
        if (typeof value === 'string') {
          passed = /\b(benefit|advantage|feature|service|solution)\b/i.test(
            value
          );
          if (!passed) {
            message = 'Missing clear service benefits or features';
          }
        }
        break;

      case 'pricing':
        if (typeof value === 'string') {
          passed = /\b(price|cost|fee|contact|quote|inquiry)\b/i.test(value);
          if (!passed) {
            message = 'Missing pricing or contact information';
          }
        }
        break;

      case 'cta':
        if (typeof value === 'string') {
          passed =
            /\b(contact|get\s+quote|learn\s+more|start|begin|order|request)\b/i.test(
              value
            );
          if (!passed) {
            message = 'Missing clear call-to-action';
          }
        }
        break;

      default:
        passed = true;
    }

    return {
      field: rule.field,
      rule: rule.rule,
      message,
      severity: rule.severity,
      passed,
    };
  };

  const runValidation = useCallback(async () => {
    setIsValidating(true);

    const rules = VALIDATION_RULES[contentType] || [];
    const results: ValidationResult[] = [];

    for (const rule of rules) {
      let value;

      if (rule.field === 'content') {
        value = content;
      } else {
        value = metadata[rule.field];
      }

      const result = validateField(rule, value);
      results.push(result);
    }

    setValidationResults(results);

    const hasErrors = results.some(r => r.severity === 'error' && !r.passed);
    const isValid = !hasErrors;

    onValidationChange?.(isValid, results);
    setIsValidating(false);
  }, [content, metadata, contentType, onValidationChange]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      runValidation();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [content, metadata, contentType, runValidation]);

  const errorCount = validationResults.filter(
    r => r.severity === 'error' && !r.passed
  ).length;
  const warningCount = validationResults.filter(
    r => r.severity === 'warning' && !r.passed
  ).length;
  const infoCount = validationResults.filter(
    r => r.severity === 'info' && !r.passed
  ).length;
  const passedCount = validationResults.filter(r => r.passed).length;
  const totalCount = validationResults.length;
  const validationScore =
    totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-green-200 bg-green-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Content Validation
              {isValidating && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </CardTitle>
            <CardDescription>
              Validate content against {contentType.replace('-', ' ')} standards
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={errorCount > 0 ? 'destructive' : 'default'}>
              Score: {validationScore}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Validation Progress</span>
            <span>
              {passedCount}/{totalCount} checks passed
            </span>
          </div>
          <Progress value={validationScore} className="h-2" />
        </div>

        {/* Summary */}
        <div className="flex gap-4">
          {errorCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errorCount} error{errorCount !== 1 ? 's' : ''}
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </div>
          )}
          {infoCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <Info className="h-4 w-4" />
              {infoCount} suggestion{infoCount !== 1 ? 's' : ''}
            </div>
          )}
          {errorCount === 0 && warningCount === 0 && infoCount === 0 && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              All validations passed
            </div>
          )}
        </div>

        {/* Detailed Results */}
        {showDetails && (
          <div className="space-y-2">
            {validationResults.map(result => (
              <Alert
                key={`${result.field}-${result.message}`}
                className={`${getSeverityColor(result.severity)} ${
                  result.passed ? 'opacity-60' : ''
                }`}
              >
                {getSeverityIcon(result.severity)}
                <AlertTitle className="text-sm font-medium capitalize">
                  {result.field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {result.message}
                  {result.passed && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      ✓ Passed
                    </Badge>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={runValidation}
            disabled={isValidating}
          >
            Re-validate
          </Button>
          {errorCount === 0 && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Ready to publish
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
