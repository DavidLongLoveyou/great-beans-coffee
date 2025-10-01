'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Download,
  RefreshCw,
  Globe,
  Zap,
  Eye,
  Target
} from 'lucide-react';
import { type SEOAuditResult, type SEOIssue, type SEORecommendation } from '@/shared/utils/seo-audit';

interface SEODashboardProps {
  className?: string;
  defaultUrl?: string;
  showBatchAudit?: boolean;
}

interface AuditState {
  loading: boolean;
  result: SEOAuditResult | null;
  error: string | null;
}

interface BatchAuditState {
  loading: boolean;
  results: Array<{ url: string; audit: SEOAuditResult }>;
  summary: {
    totalUrls: number;
    successful: number;
    failed: number;
    averageScore: number;
    totalIssues: number;
  } | null;
  error: string | null;
}

export function SEODashboard({ 
  className = '',
  defaultUrl = '',
  showBatchAudit = true 
}: SEODashboardProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [batchUrls, setBatchUrls] = useState('');
  const [auditState, setAuditState] = useState<AuditState>({
    loading: false,
    result: null,
    error: null,
  });
  const [batchState, setBatchState] = useState<BatchAuditState>({
    loading: false,
    results: [],
    summary: null,
    error: null,
  });

  // Perform single URL audit
  const performAudit = async () => {
    if (!url.trim()) return;

    setAuditState({ loading: true, result: null, error: null });

    try {
      const response = await fetch('/api/seo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Audit failed');
      }

      setAuditState({ loading: false, result: data.audit, error: null });
    } catch (error) {
      setAuditState({ 
        loading: false, 
        result: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  // Perform batch audit
  const performBatchAudit = async () => {
    const urls = batchUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length === 0) return;

    setBatchState({ loading: true, results: [], summary: null, error: null });

    try {
      const response = await fetch('/api/seo/audit/batch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Batch audit failed');
      }

      setBatchState({ 
        loading: false, 
        results: data.results, 
        summary: data.summary,
        error: null 
      });
    } catch (error) {
      setBatchState({ 
        loading: false, 
        results: [], 
        summary: null,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  // Download audit report
  const downloadReport = async () => {
    if (!url.trim()) return;

    try {
      const response = await fetch('/api/seo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), format: 'report' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `seo-audit-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get issue icon
  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get impact badge variant
  const getImpactVariant = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SEO Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and optimize your website's SEO performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadReport}
            disabled={!auditState.result || auditState.loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="single" className="space-y-4">
        <TabsList>
          <TabsTrigger value="single">Single URL Audit</TabsTrigger>
          {showBatchAudit && <TabsTrigger value="batch">Batch Audit</TabsTrigger>}
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* Single URL Audit */}
        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                SEO Audit
              </CardTitle>
              <CardDescription>
                Analyze a single page for SEO optimization opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter URL to audit (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && performAudit()}
                />
                <Button 
                  onClick={performAudit} 
                  disabled={auditState.loading || !url.trim()}
                >
                  {auditState.loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Audit
                </Button>
              </div>

              {auditState.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{auditState.error}</AlertDescription>
                </Alert>
              )}

              {auditState.result && (
                <div className="space-y-6">
                  {/* Score Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>SEO Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor(auditState.result.score)}`}>
                          {auditState.result.score}/100
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={auditState.result.score} className="w-full" />
                    </CardContent>
                  </Card>

                  {/* Issues */}
                  {auditState.result.issues.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Issues ({auditState.result.issues.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {auditState.result.issues.map((issue, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                              {getIssueIcon(issue.type)}
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{issue.title}</h4>
                                  <Badge variant={getImpactVariant(issue.impact)}>
                                    {issue.impact} impact
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {issue.description}
                                </p>
                                <p className="text-sm font-medium text-blue-600">
                                  💡 {issue.recommendation}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommendations */}
                  {auditState.result.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Target className="h-5 w-5 mr-2" />
                          Recommendations ({auditState.result.recommendations.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {auditState.result.recommendations.map((rec, index) => (
                            <div key={index} className="p-3 border rounded-lg space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{rec.title}</h4>
                                <div className="flex space-x-2">
                                  <Badge variant="outline">
                                    {rec.priority} priority
                                  </Badge>
                                  <Badge variant="secondary">
                                    {rec.effort} effort
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {rec.description}
                              </p>
                              <p className="text-sm font-medium">
                                🔧 {rec.implementation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Detailed Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Metadata */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Metadata
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Title</span>
                          <span className={auditState.result.metadata.title.optimal ? 'text-green-600' : 'text-red-600'}>
                            {auditState.result.metadata.title.present ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Description</span>
                          <span className={auditState.result.metadata.description.optimal ? 'text-green-600' : 'text-red-600'}>
                            {auditState.result.metadata.description.present ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Open Graph</span>
                          <span className={auditState.result.metadata.openGraph.complete ? 'text-green-600' : 'text-red-600'}>
                            {auditState.result.metadata.openGraph.present ? '✓' : '✗'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Structured Data */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-sm">
                          <Globe className="h-4 w-4 mr-2" />
                          Structured Data
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Present</span>
                          <span className={auditState.result.structuredData.present ? 'text-green-600' : 'text-red-600'}>
                            {auditState.result.structuredData.present ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Valid</span>
                          <span className={auditState.result.structuredData.valid ? 'text-green-600' : 'text-red-600'}>
                            {auditState.result.structuredData.valid ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Coverage</span>
                          <span>{auditState.result.structuredData.coverage}%</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Performance */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-sm">
                          <Zap className="h-4 w-4 mr-2" />
                          Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>LCP</span>
                          <span>{auditState.result.performance.coreWebVitals.lcp.rating}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>FID</span>
                          <span>{auditState.result.performance.coreWebVitals.fid.rating}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>CLS</span>
                          <span>{auditState.result.performance.coreWebVitals.cls.rating}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Batch Audit */}
        {showBatchAudit && (
          <TabsContent value="batch" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Batch SEO Audit
                </CardTitle>
                <CardDescription>
                  Audit multiple URLs at once (max 10 URLs)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">URLs (one per line)</label>
                  <textarea
                    className="w-full h-32 p-3 border rounded-md resize-none"
                    placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                    value={batchUrls}
                    onChange={(e) => setBatchUrls(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={performBatchAudit} 
                  disabled={batchState.loading || !batchUrls.trim()}
                  className="w-full"
                >
                  {batchState.loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Run Batch Audit
                </Button>

                {batchState.error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{batchState.error}</AlertDescription>
                  </Alert>
                )}

                {batchState.summary && (
                  <div className="space-y-4">
                    {/* Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Batch Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{batchState.summary.totalUrls}</div>
                            <div className="text-sm text-muted-foreground">Total URLs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{batchState.summary.successful}</div>
                            <div className="text-sm text-muted-foreground">Successful</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{batchState.summary.failed}</div>
                            <div className="text-sm text-muted-foreground">Failed</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${getScoreColor(batchState.summary.averageScore)}`}>
                              {batchState.summary.averageScore}
                            </div>
                            <div className="text-sm text-muted-foreground">Avg Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{batchState.summary.totalIssues}</div>
                            <div className="text-sm text-muted-foreground">Total Issues</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Results */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {batchState.results.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium truncate">{result.url}</div>
                                <div className="text-sm text-muted-foreground">
                                  {result.audit.issues.length} issues found
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className={`text-lg font-bold ${getScoreColor(result.audit.score)}`}>
                                  {result.audit.score}
                                </div>
                                <Progress value={result.audit.score} className="w-20" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {auditState.result?.score || '--'}/100
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall SEO performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {auditState.result?.issues.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Items need attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Structured Data</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {auditState.result?.structuredData.coverage || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Schema coverage
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {auditState.result ? '✓' : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Core Web Vitals
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SEO Best Practices</CardTitle>
              <CardDescription>
                Follow these guidelines to improve your SEO performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Technical SEO</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Optimize page titles (30-60 characters)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Write compelling meta descriptions (120-160 characters)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Implement structured data markup
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Use proper heading hierarchy (H1-H6)
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Performance</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Optimize Core Web Vitals
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Compress and optimize images
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Minimize JavaScript and CSS
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Enable browser caching
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}