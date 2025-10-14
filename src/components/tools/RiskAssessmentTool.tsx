'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  Calculator,
  Download,
  RefreshCw,
  Info,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface RiskFactor {
  id: string;
  name: string;
  category:
    | 'operational'
    | 'financial'
    | 'environmental'
    | 'political'
    | 'market';
  weight: number; // 1-10
  probability: number; // 0-100
  impact: number; // 0-100
  mitigation: string[];
  currentLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface RiskScenario {
  id: string;
  name: string;
  description: string;
  factors: {
    factorId: string;
    adjustedProbability: number;
    adjustedImpact: number;
  }[];
  likelihood: number; // 0-100
}

interface RiskAssessmentToolProps {
  initialFactors?: RiskFactor[];
  scenarios?: RiskScenario[];
  onExport?: (data: any) => void;
}

const defaultRiskFactors: RiskFactor[] = [
  {
    id: 'climate-change',
    name: 'Climate Change Impact',
    category: 'environmental',
    weight: 9,
    probability: 85,
    impact: 90,
    mitigation: [
      'Diversify sourcing regions',
      'Climate-resilient farming practices',
      'Insurance coverage',
    ],
    currentLevel: 'high',
  },
  {
    id: 'price-volatility',
    name: 'Coffee Price Volatility',
    category: 'market',
    weight: 8,
    probability: 75,
    impact: 80,
    mitigation: [
      'Futures contracts',
      'Long-term partnerships',
      'Price hedging strategies',
    ],
    currentLevel: 'high',
  },
  {
    id: 'supply-disruption',
    name: 'Supply Chain Disruption',
    category: 'operational',
    weight: 7,
    probability: 60,
    impact: 85,
    mitigation: [
      'Multiple suppliers',
      'Buffer inventory',
      'Alternative logistics routes',
    ],
    currentLevel: 'medium',
  },
  {
    id: 'political-instability',
    name: 'Political Instability',
    category: 'political',
    weight: 6,
    probability: 45,
    impact: 75,
    mitigation: [
      'Political risk insurance',
      'Diversified sourcing',
      'Local partnerships',
    ],
    currentLevel: 'medium',
  },
  {
    id: 'currency-fluctuation',
    name: 'Currency Fluctuation',
    category: 'financial',
    weight: 7,
    probability: 70,
    impact: 60,
    mitigation: [
      'Currency hedging',
      'Multi-currency contracts',
      'Natural hedging',
    ],
    currentLevel: 'medium',
  },
  {
    id: 'quality-issues',
    name: 'Quality Control Issues',
    category: 'operational',
    weight: 8,
    probability: 40,
    impact: 70,
    mitigation: [
      'Rigorous testing protocols',
      'Supplier audits',
      'Quality certifications',
    ],
    currentLevel: 'low',
  },
];

const defaultScenarios: RiskScenario[] = [
  {
    id: 'climate-crisis',
    name: 'Severe Climate Crisis',
    description:
      'Major climate events affecting multiple coffee regions simultaneously',
    factors: [
      {
        factorId: 'climate-change',
        adjustedProbability: 95,
        adjustedImpact: 95,
      },
      {
        factorId: 'supply-disruption',
        adjustedProbability: 85,
        adjustedImpact: 90,
      },
      {
        factorId: 'price-volatility',
        adjustedProbability: 90,
        adjustedImpact: 85,
      },
    ],
    likelihood: 25,
  },
  {
    id: 'market-crash',
    name: 'Global Market Downturn',
    description: 'Economic recession affecting coffee demand and pricing',
    factors: [
      {
        factorId: 'price-volatility',
        adjustedProbability: 85,
        adjustedImpact: 90,
      },
      {
        factorId: 'currency-fluctuation',
        adjustedProbability: 80,
        adjustedImpact: 75,
      },
      {
        factorId: 'political-instability',
        adjustedProbability: 60,
        adjustedImpact: 80,
      },
    ],
    likelihood: 15,
  },
  {
    id: 'supply-chain-breakdown',
    name: 'Major Supply Chain Breakdown',
    description:
      'Significant disruption to global logistics and transportation',
    factors: [
      {
        factorId: 'supply-disruption',
        adjustedProbability: 90,
        adjustedImpact: 95,
      },
      {
        factorId: 'price-volatility',
        adjustedProbability: 80,
        adjustedImpact: 70,
      },
      {
        factorId: 'quality-issues',
        adjustedProbability: 60,
        adjustedImpact: 80,
      },
    ],
    likelihood: 10,
  },
];

export const RiskAssessmentTool: React.FC<RiskAssessmentToolProps> = ({
  initialFactors = defaultRiskFactors,
  scenarios = defaultScenarios,
  onExport,
}) => {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>(initialFactors);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'assessment' | 'scenarios' | 'mitigation'
  >('assessment');

  // Calculate risk scores
  const calculateRiskScore = useCallback(
    (factor: RiskFactor, scenarioAdjustments?: any) => {
      const probability =
        scenarioAdjustments?.adjustedProbability || factor.probability;
      const impact = scenarioAdjustments?.adjustedImpact || factor.impact;
      return (probability * impact * factor.weight) / 1000;
    },
    []
  );

  const overallRiskScore = useMemo(() => {
    const scenario = selectedScenario
      ? scenarios.find(s => s.id === selectedScenario)
      : null;

    return riskFactors.reduce((total, factor) => {
      const scenarioAdjustment = scenario?.factors.find(
        f => f.factorId === factor.id
      );
      return total + calculateRiskScore(factor, scenarioAdjustment);
    }, 0);
  }, [riskFactors, selectedScenario, scenarios, calculateRiskScore]);

  const getRiskLevel = (
    score: number
  ): { level: string; color: string; icon: React.ReactNode } => {
    if (score >= 70)
      return {
        level: 'Critical',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: <XCircle className="h-4 w-4 text-red-600" />,
      };
    if (score >= 50)
      return {
        level: 'High',
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
      };
    if (score >= 30)
      return {
        level: 'Medium',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: <Clock className="h-4 w-4 text-yellow-600" />,
      };
    return {
      level: 'Low',
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    };
  };

  // Prepare radar chart data
  const radarData = useMemo(() => {
    const scenario = selectedScenario
      ? scenarios.find(s => s.id === selectedScenario)
      : null;

    return riskFactors.map(factor => {
      const scenarioAdjustment = scenario?.factors.find(
        f => f.factorId === factor.id
      );
      const probability =
        scenarioAdjustment?.adjustedProbability || factor.probability;
      const impact = scenarioAdjustment?.adjustedImpact || factor.impact;

      return {
        factor: factor.name,
        score: calculateRiskScore(factor, scenarioAdjustment),
        probability,
        impact,
        weight: factor.weight * 10,
      };
    });
  }, [riskFactors, selectedScenario, scenarios, calculateRiskScore]);

  // Prepare bar chart data by category
  const categoryData = useMemo(() => {
    const categories = [
      'operational',
      'financial',
      'environmental',
      'political',
      'market',
    ];
    const scenario = selectedScenario
      ? scenarios.find(s => s.id === selectedScenario)
      : null;

    return categories.map(category => {
      const categoryFactors = riskFactors.filter(f => f.category === category);
      const totalScore = categoryFactors.reduce((sum, factor) => {
        const scenarioAdjustment = scenario?.factors.find(
          f => f.factorId === factor.id
        );
        return sum + calculateRiskScore(factor, scenarioAdjustment);
      }, 0);

      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        score: totalScore,
        count: categoryFactors.length,
      };
    });
  }, [riskFactors, selectedScenario, scenarios, calculateRiskScore]);

  const updateFactorValue = (
    factorId: string,
    field: keyof RiskFactor,
    value: any
  ) => {
    setRiskFactors(prev =>
      prev.map(factor =>
        factor.id === factorId ? { ...factor, [field]: value } : factor
      )
    );
  };

  const exportAssessment = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      overallRiskScore,
      riskLevel: getRiskLevel(overallRiskScore).level,
      selectedScenario,
      factors: riskFactors,
      categoryBreakdown: categoryData,
      scenarios: scenarios,
    };

    if (onExport) {
      onExport(exportData);
    } else {
      // Default export as JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `risk-assessment-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const resetToDefaults = () => {
    setRiskFactors(defaultRiskFactors);
    setSelectedScenario(null);
  };

  const currentRiskLevel = getRiskLevel(overallRiskScore);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Risk Assessment Tool
          </h3>
          <p className="text-sm text-gray-600">
            Evaluate and manage supply chain risks
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={exportAssessment}
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overall Risk Score */}
      <div className={`rounded-lg border p-4 ${currentRiskLevel.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {currentRiskLevel.icon}
            <div>
              <h4 className="font-medium">
                Overall Risk Level: {currentRiskLevel.level}
              </h4>
              <p className="text-sm opacity-75">
                Risk Score: {overallRiskScore.toFixed(1)}/100
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {overallRiskScore.toFixed(0)}
            </div>
            <div className="text-sm opacity-75">Risk Points</div>
          </div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Scenario Analysis
        </label>
        <select
          value={selectedScenario || ''}
          onChange={e => setSelectedScenario(e.target.value || null)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Baseline (Current Conditions)</option>
          {scenarios.map(scenario => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name} (Likelihood: {scenario.likelihood}%)
            </option>
          ))}
        </select>
        {selectedScenario && (
          <p className="text-sm text-gray-600">
            {scenarios.find(s => s.id === selectedScenario)?.description}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav
          className="-mb-px flex space-x-8"
          aria-label="Risk assessment tabs"
        >
          {[
            { key: 'assessment', label: 'Risk Assessment', icon: Calculator },
            { key: 'scenarios', label: 'Scenario Analysis', icon: TrendingUp },
            { key: 'mitigation', label: 'Mitigation Strategies', icon: Shield },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'assessment' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Radar Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h4 className="mb-4 font-medium text-gray-900">
              Risk Factor Analysis
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  name="Risk Score"
                  dataKey="score"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h4 className="mb-4 font-medium text-gray-900">Risk by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                <span className="text-sm text-gray-500">
                  Likelihood: {scenario.likelihood}%
                </span>
              </div>
              <p className="mb-3 text-sm text-gray-600">
                {scenario.description}
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {scenario.factors.map(factor => {
                  const originalFactor = riskFactors.find(
                    f => f.id === factor.factorId
                  );
                  if (!originalFactor) return null;

                  return (
                    <div
                      key={factor.factorId}
                      className="rounded bg-gray-50 p-3"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {originalFactor.name}
                      </div>
                      <div className="mt-1 text-xs text-gray-600">
                        Probability: {factor.adjustedProbability}% (
                        {factor.adjustedProbability > originalFactor.probability
                          ? '+'
                          : ''}
                        {factor.adjustedProbability -
                          originalFactor.probability}
                        )
                      </div>
                      <div className="text-xs text-gray-600">
                        Impact: {factor.adjustedImpact}% (
                        {factor.adjustedImpact > originalFactor.impact
                          ? '+'
                          : ''}
                        {factor.adjustedImpact - originalFactor.impact})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mitigation' && (
        <div className="space-y-4">
          {riskFactors.map(factor => {
            const riskScore = calculateRiskScore(factor);
            const riskLevel = getRiskLevel(riskScore);

            return (
              <div
                key={factor.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {riskLevel.icon}
                    <h4 className="font-medium text-gray-900">{factor.name}</h4>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${riskLevel.color}`}
                  >
                    {riskLevel.level} Risk
                  </span>
                </div>

                <div className="mb-3">
                  <div className="mb-2 text-sm text-gray-600">
                    Mitigation Strategies:
                  </div>
                  <ul className="space-y-1">
                    {factor.mitigation.map((strategy, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-sm"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="mb-1 block text-gray-600">
                      Probability (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={factor.probability}
                      onChange={e =>
                        updateFactorValue(
                          factor.id,
                          'probability',
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    <span className="text-gray-500">{factor.probability}%</span>
                  </div>
                  <div>
                    <label className="mb-1 block text-gray-600">
                      Impact (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={factor.impact}
                      onChange={e =>
                        updateFactorValue(
                          factor.id,
                          'impact',
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    <span className="text-gray-500">{factor.impact}%</span>
                  </div>
                  <div>
                    <label className="mb-1 block text-gray-600">
                      Weight (1-10)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={factor.weight}
                      onChange={e =>
                        updateFactorValue(
                          factor.id,
                          'weight',
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    <span className="text-gray-500">{factor.weight}/10</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
