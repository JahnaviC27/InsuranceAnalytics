import React, { useState, useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const OptimizationScenariosChart = () => {
  const rawData = [
    { Project: "Auto Insurance Core 1 ART", Portfolio: "Policy Core Systems", QA_Story_Points_Pct: 25.85, Defect_Leakage_Pct: 9.82, Story_Points_Total: 3810, Prod_Defects: 16, Cost_Avoidance_Hours: 320 },
    { Project: "Auto Insurance Core 3 ART", Portfolio: "Policy Core Systems", QA_Story_Points_Pct: 28.14, Defect_Leakage_Pct: 15.56, Story_Points_Total: 3913, Prod_Defects: 7, Cost_Avoidance_Hours: 140 },
    { Project: "Auto Insurance Core Platform ART", Portfolio: "Policy Core Systems", QA_Story_Points_Pct: 19.19, Defect_Leakage_Pct: 21.43, Story_Points_Total: 4633, Prod_Defects: 3, Cost_Avoidance_Hours: 60 },
    { Project: "Auto Telematics ART 1", Portfolio: "Policy Core Systems", QA_Story_Points_Pct: 28.65, Defect_Leakage_Pct: 31.71, Story_Points_Total: 5320, Prod_Defects: 26, Cost_Avoidance_Hours: 520 },
    { Project: "USMB ART", Portfolio: "Policy Core Systems", QA_Story_Points_Pct: 15.65, Defect_Leakage_Pct: 23.75, Story_Points_Total: 5733, Prod_Defects: 19, Cost_Avoidance_Hours: 380 },
    { Project: "Area 51 ART", Portfolio: "Policy Core Systems", QA_Story_Points_Pct: 20.53, Defect_Leakage_Pct: 16.95, Story_Points_Total: 5802, Prod_Defects: 10, Cost_Avoidance_Hours: 200 },
    { Project: "C2T P&C ART", Portfolio: "Policy Core Systems", QA_Story_Points_Pct: 32.86, Defect_Leakage_Pct: 18.18, Story_Points_Total: 353, Prod_Defects: 44, Cost_Avoidance_Hours: 880 },
    { Project: "Mythos ART", Portfolio: "Policy Core Systems", QA_Story_Points_Pct: 21.17, Defect_Leakage_Pct: 30.91, Story_Points_Total: 5060, Prod_Defects: 34, Cost_Avoidance_Hours: 680 },
    { Project: "Property Formula 1 ART", Portfolio: "Policy Core Systems", QA_Story_Points_Pct: 5.79, Defect_Leakage_Pct: 0.00, Story_Points_Total: 5234, Prod_Defects: 0, Cost_Avoidance_Hours: 0 },
    { Project: "Think Tankers ART", Portfolio: "Policy Core Systems", QA_Story_Points_Pct: 60.22, Defect_Leakage_Pct: 0.00, Story_Points_Total: 93, Prod_Defects: 0, Cost_Avoidance_Hours: 0 },
    { Project: "Policy Mod Auto ART", Portfolio: "Policy Modernization", QA_Story_Points_Pct: 11.45, Defect_Leakage_Pct: 1.69, Story_Points_Total: 58879, Prod_Defects: 41, Cost_Avoidance_Hours: 820 },
    { Project: "P3 – Back to the Future ART", Portfolio: "Policy Modernization", QA_Story_Points_Pct: 44.68, Defect_Leakage_Pct: 1.82, Story_Points_Total: 3919, Prod_Defects: 7, Cost_Avoidance_Hours: 140 },
    { Project: "DW – Elemental ART", Portfolio: "Policy Modernization", QA_Story_Points_Pct: 27.03, Defect_Leakage_Pct: 1.51, Story_Points_Total: 15359, Prod_Defects: 13, Cost_Avoidance_Hours: 260 },
    { Project: "DW – Mythology ART", Portfolio: "Policy Modernization", QA_Story_Points_Pct: 34.32, Defect_Leakage_Pct: 2.88, Story_Points_Total: 16091, Prod_Defects: 10, Cost_Avoidance_Hours: 200 },
    { Project: "DW – Policy Pirates ART", Portfolio: "Policy Modernization", QA_Story_Points_Pct: 19.11, Defect_Leakage_Pct: 5.38, Story_Points_Total: 7092, Prod_Defects: 10, Cost_Avoidance_Hours: 200 },
    { Project: "DW – Rock 'N Rollouts ART", Portfolio: "Policy Modernization", QA_Story_Points_Pct: 15.17, Defect_Leakage_Pct: 0.00, Story_Points_Total: 580, Prod_Defects: 0, Cost_Avoidance_Hours: 0 },
    { Project: "Umbrella Mod ART", Portfolio: "Policy Modernization", QA_Story_Points_Pct: 26.83, Defect_Leakage_Pct: 5.32, Story_Points_Total: 25558, Prod_Defects: 59, Cost_Avoidance_Hours: 1180 },
    { Project: "Claims Modernization Core ART", Portfolio: "Claims", QA_Story_Points_Pct: 0.11, Defect_Leakage_Pct: 17.63, Story_Points_Total: 1760, Prod_Defects: 58, Cost_Avoidance_Hours: 1160 },
    { Project: "Claims Modernization PHX ART", Portfolio: "Claims", QA_Story_Points_Pct: 9.68, Defect_Leakage_Pct: 38.95, Story_Points_Total: 4084, Prod_Defects: 67, Cost_Avoidance_Hours: 1340 },
    { Project: "Claims Modernization PTX ART", Portfolio: "Claims", QA_Story_Points_Pct: 5.68, Defect_Leakage_Pct: 35.64, Story_Points_Total: 3748, Prod_Defects: 67, Cost_Avoidance_Hours: 1340 },
    { Project: "Claims Modernization SAT ART", Portfolio: "Claims", QA_Story_Points_Pct: 36.01, Defect_Leakage_Pct: 35.75, Story_Points_Total: 5304, Prod_Defects: 69, Cost_Avoidance_Hours: 1380 },
    { Project: "DM – Claims ART", Portfolio: "Data", QA_Story_Points_Pct: 27.39, Defect_Leakage_Pct: 46.51, Story_Points_Total: 2946, Prod_Defects: 40, Cost_Avoidance_Hours: 800 },
    { Project: "DM – Financials and C&R ART", Portfolio: "Data", QA_Story_Points_Pct: 17.24, Defect_Leakage_Pct: 12.50, Story_Points_Total: 4588, Prod_Defects: 13, Cost_Avoidance_Hours: 260 },
    { Project: "DM – Policy ART", Portfolio: "Data", QA_Story_Points_Pct: 32.60, Defect_Leakage_Pct: 8.60, Story_Points_Total: 5896, Prod_Defects: 8, Cost_Avoidance_Hours: 160 },
    { Project: "DM – Pricing and UW ART", Portfolio: "Data", QA_Story_Points_Pct: 9.34, Defect_Leakage_Pct: 0.00, Story_Points_Total: 5889, Prod_Defects: 0, Cost_Avoidance_Hours: 0 },
    { Project: "DM – Shared Services ART", Portfolio: "Data", QA_Story_Points_Pct: 9.27, Defect_Leakage_Pct: 0.00, Story_Points_Total: 10891, Prod_Defects: 0, Cost_Avoidance_Hours: 0 },
    { Project: "CAS – Billing (Dev) ART", Portfolio: "Shared Solutions", QA_Story_Points_Pct: 57.25, Defect_Leakage_Pct: 65.79, Story_Points_Total: 10331, Prod_Defects: 25, Cost_Avoidance_Hours: 500 },
    { Project: "PICS 2 ART", Portfolio: "Shared Solutions", QA_Story_Points_Pct: 29.17, Defect_Leakage_Pct: 94.12, Story_Points_Total: 2917.5, Prod_Defects: 64, Cost_Avoidance_Hours: 1280 },
    { Project: "PICS 3 ART", Portfolio: "Shared Solutions", QA_Story_Points_Pct: 35.01, Defect_Leakage_Pct: 8.14, Story_Points_Total: 4547, Prod_Defects: 14, Cost_Avoidance_Hours: 280 },
    { Project: "FinPAL Loss Dev ART", Portfolio: "Shared Solutions", QA_Story_Points_Pct: 65.84, Defect_Leakage_Pct: 68.75, Story_Points_Total: 1806, Prod_Defects: 11, Cost_Avoidance_Hours: 220 },
    { Project: "FPDV – FinPAL Premium ART", Portfolio: "Shared Solutions", QA_Story_Points_Pct: 25.83, Defect_Leakage_Pct: 11.11, Story_Points_Total: 4479, Prod_Defects: 2, Cost_Avoidance_Hours: 40 },
    { Project: "PNC CRM ART", Portfolio: "D&S", QA_Story_Points_Pct: 75.57, Defect_Leakage_Pct: 29.41, Story_Points_Total: 966, Prod_Defects: 15, Cost_Avoidance_Hours: 300 },
    { Project: "PNC Mobile ART", Portfolio: "D&S", QA_Story_Points_Pct: 78.38, Defect_Leakage_Pct: 100.00, Story_Points_Total: 1346, Prod_Defects: 3, Cost_Avoidance_Hours: 60 },
    { Project: "Omni Digital ART", Portfolio: "D&S", QA_Story_Points_Pct: 25.84, Defect_Leakage_Pct: 10.20, Story_Points_Total: 2134, Prod_Defects: 10, Cost_Avoidance_Hours: 200 },
    { Project: "Agency Technology ART", Portfolio: "D&S", QA_Story_Points_Pct: 16.13, Defect_Leakage_Pct: 40.00, Story_Points_Total: 2176, Prod_Defects: 8, Cost_Avoidance_Hours: 160 },
    { Project: "New Business Ventures & Innovation ART A", Portfolio: "NBV&I", QA_Story_Points_Pct: 12.13, Defect_Leakage_Pct: 100.00, Story_Points_Total: 742, Prod_Defects: 3, Cost_Avoidance_Hours: 60 },
    { Project: "New Business Ventures & Innovation ART B", Portfolio: "NBV&I", QA_Story_Points_Pct: 48.32, Defect_Leakage_Pct: 4.35, Story_Points_Total: 1043, Prod_Defects: 5, Cost_Avoidance_Hours: 100 },
    { Project: "New Business Ventures & Innovation ART C", Portfolio: "NBV&I", QA_Story_Points_Pct: 13.35, Defect_Leakage_Pct: 0.83, Story_Points_Total: 5552, Prod_Defects: 2, Cost_Avoidance_Hours: 40 },
    { Project: "New Business Ventures & Innovation ART D", Portfolio: "NBV&I", QA_Story_Points_Pct: 18.60, Defect_Leakage_Pct: 0.28, Story_Points_Total: 2865, Prod_Defects: 1, Cost_Avoidance_Hours: 20 },
    { Project: "ASC Technology ART", Portfolio: "ASC", QA_Story_Points_Pct: 29.70, Defect_Leakage_Pct: 100.00, Story_Points_Total: 542, Prod_Defects: 3, Cost_Avoidance_Hours: 60 }
  ];

  const [selectedScenario, setSelectedScenario] = useState('moderate');
  const [showProjections, setShowProjections] = useState(true);

  // Calculate current state metrics
  const currentMetrics = useMemo(() => {
    const dataWithLeakage = rawData.filter(d => d.Defect_Leakage_Pct !== null);
    const criticalARTs = dataWithLeakage.filter(d => d.Defect_Leakage_Pct > 20).length;
    const underInvested = rawData.filter(d => d.QA_Story_Points_Pct < 20).length;
    const totalDefects = rawData.reduce((sum, d) => sum + d.Prod_Defects, 0);
    const avgLeakage = dataWithLeakage.reduce((sum, d) => sum + d.Defect_Leakage_Pct, 0) / dataWithLeakage.length;
    const avgInvestment = rawData.reduce((sum, d) => sum + d.QA_Story_Points_Pct, 0) / rawData.length;
    const totalCostAvoidance = rawData.reduce((sum, d) => sum + d.Cost_Avoidance_Hours, 0);
    
    return { criticalARTs, underInvested, totalDefects, avgLeakage, avgInvestment, totalCostAvoidance };
  }, []);

  // Scenario definitions
  const scenarios = {
    conservative: {
      name: 'Conservative',
      description: 'Minimal investment increase, focus on quick wins',
      investmentIncrease: 5,
      leakageReduction: 15,
      defectReduction: 20,
      costAvoidanceMultiplier: 1.3,
      timelineMonths: 12,
      color: '#3b82f6'
    },
    moderate: {
      name: 'Moderate',
      description: 'Balanced approach with targeted improvements',
      investmentIncrease: 10,
      leakageReduction: 30,
      defectReduction: 40,
      costAvoidanceMultiplier: 1.8,
      timelineMonths: 18,
      color: '#22c55e'
    },
    aggressive: {
      name: 'Aggressive',
      description: 'Significant investment for transformational change',
      investmentIncrease: 15,
      leakageReduction: 50,
      defectReduction: 60,
      costAvoidanceMultiplier: 2.5,
      timelineMonths: 24,
      color: '#8b5cf6'
    }
  };

  const currentScenario = scenarios[selectedScenario];

  // Generate projection data
  const projectionData = useMemo(() => {
    const months = currentScenario.timelineMonths;
    const data = [];
    
    for (let i = 0; i <= months; i += 3) {
      const progress = i / months;
      const easeProgress = 1 - Math.pow(1 - progress, 2); // Ease-out curve
      
      data.push({
        month: i === 0 ? 'Current' : `Month ${i}`,
        monthNum: i,
        investment: currentMetrics.avgInvestment + (currentScenario.investmentIncrease * easeProgress),
        leakage: currentMetrics.avgLeakage * (1 - (currentScenario.leakageReduction / 100) * easeProgress),
        defects: Math.round(currentMetrics.totalDefects * (1 - (currentScenario.defectReduction / 100) * easeProgress)),
        costAvoidance: Math.round(currentMetrics.totalCostAvoidance * (1 + (currentScenario.costAvoidanceMultiplier - 1) * easeProgress)),
        criticalARTs: Math.round(currentMetrics.criticalARTs * (1 - easeProgress * 0.8))
      });
    }
    
    return data;
  }, [selectedScenario, currentMetrics]);

  // ROI calculation
  const roiData = useMemo(() => {
    const hourlyRate = 150; // Assumed cost per hour
    const defectCost = 5000; // Assumed cost per production defect
    
    const currentAnnualCost = currentMetrics.totalDefects * defectCost;
    const projectedDefects = currentMetrics.totalDefects * (1 - currentScenario.defectReduction / 100);
    const projectedAnnualCost = projectedDefects * defectCost;
    const annualSavings = currentAnnualCost - projectedAnnualCost;
    
    const additionalCostAvoidance = (currentMetrics.totalCostAvoidance * (currentScenario.costAvoidanceMultiplier - 1)) * hourlyRate;
    const totalBenefit = annualSavings + additionalCostAvoidance;
    
    // Investment cost (additional QA resources)
    const totalStoryPoints = rawData.reduce((sum, d) => sum + d.Story_Points_Total, 0);
    const additionalQAPoints = totalStoryPoints * (currentScenario.investmentIncrease / 100);
    const investmentCost = additionalQAPoints * 8 * (hourlyRate / 2); // Assuming 8 hours per story point
    
    const roi = ((totalBenefit - investmentCost) / investmentCost) * 100;
    const paybackMonths = (investmentCost / (totalBenefit / 12));
    
    return {
      currentAnnualCost,
      projectedAnnualCost,
      annualSavings,
      additionalCostAvoidance,
      totalBenefit,
      investmentCost,
      roi,
      paybackMonths
    };
  }, [selectedScenario, currentMetrics]);

  // Comparison chart data
  const comparisonData = [
    {
      metric: 'Avg QA Investment',
      current: currentMetrics.avgInvestment,
      projected: currentMetrics.avgInvestment + currentScenario.investmentIncrease,
      unit: '%',
      improvement: `+${currentScenario.investmentIncrease}%`
    },
    {
      metric: 'Avg Defect Leakage',
      current: currentMetrics.avgLeakage,
      projected: currentMetrics.avgLeakage * (1 - currentScenario.leakageReduction / 100),
      unit: '%',
      improvement: `-${currentScenario.leakageReduction}%`
    },
    {
      metric: 'Production Defects',
      current: currentMetrics.totalDefects,
      projected: Math.round(currentMetrics.totalDefects * (1 - currentScenario.defectReduction / 100)),
      unit: '',
      improvement: `-${currentScenario.defectReduction}%`
    },
    {
      metric: 'Critical ARTs',
      current: currentMetrics.criticalARTs,
      projected: Math.round(currentMetrics.criticalARTs * 0.2),
      unit: '',
      improvement: `-80%`
    }
  ];

  // Radar chart data for scenario comparison
  const radarData = [
    { metric: 'Investment Efficiency', conservative: 60, moderate: 80, aggressive: 95 },
    { metric: 'Defect Reduction', conservative: 40, moderate: 70, aggressive: 90 },
    { metric: 'Speed to Value', conservative: 90, moderate: 70, aggressive: 50 },
    { metric: 'Risk Mitigation', conservative: 50, moderate: 75, aggressive: 95 },
    { metric: 'Cost Efficiency', conservative: 85, moderate: 75, aggressive: 60 },
    { metric: 'Long-term ROI', conservative: 55, moderate: 80, aggressive: 95 }
  ];

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">QA Optimization Scenarios & ROI Projections</h1>
        <p className="text-gray-600">Strategic planning tool for QA investment optimization and projected outcomes</p>
      </div>

      {/* Scenario Selector */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Select Optimization Scenario</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <button
              key={key}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedScenario === key 
                  ? `border-${key === 'conservative' ? 'blue' : key === 'moderate' ? 'green' : 'purple'}-500 bg-${key === 'conservative' ? 'blue' : key === 'moderate' ? 'green' : 'purple'}-50` 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ borderColor: selectedScenario === key ? scenario.color : undefined }}
              onClick={() => setSelectedScenario(key)}
            >
              <p className="font-semibold text-lg" style={{ color: scenario.color }}>{scenario.name}</p>
              <p className="text-xs text-gray-600 mt-1">{scenario.description}</p>
              <div className="mt-2 text-xs space-y-1">
                <p>Investment: +{scenario.investmentIncrease}%</p>
                <p>Leakage Reduction: -{scenario.leakageReduction}%</p>
                <p>Timeline: {scenario.timelineMonths} months</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Key Projections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4" style={{ borderColor: currentScenario.color }}>
          <p className="text-sm text-gray-600">Projected Defect Reduction</p>
          <p className="text-2xl font-bold" style={{ color: currentScenario.color }}>-{currentScenario.defectReduction}%</p>
          <p className="text-xs text-gray-500">{Math.round(currentMetrics.totalDefects * (1 - currentScenario.defectReduction / 100))} defects</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Annual Savings</p>
          <p className="text-2xl font-bold text-green-600">${(roiData.annualSavings / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500">From defect reduction</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">ROI</p>
          <p className="text-2xl font-bold text-blue-600">{roiData.roi.toFixed(0)}%</p>
          <p className="text-xs text-gray-500">Return on investment</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Payback Period</p>
          <p className="text-2xl font-bold text-purple-600">{roiData.paybackMonths.toFixed(1)} mo</p>
          <p className="text-xs text-gray-500">Time to recover investment</p>
        </div>
      </div>

      {/* Main Projection Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Improvement Trajectory - {currentScenario.name} Scenario</h3>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={showProjections}
              onChange={(e) => setShowProjections(e.target.checked)}
              className="mr-2"
            />
            Show detailed projections
          </label>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={projectionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" label={{ value: 'Percentage / Count', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Hours', angle: 90, position: 'insideRight' }} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                      <p className="font-bold text-sm mb-2">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-xs" style={{ color: entry.color }}>
                          {entry.name}: {typeof entry.value === 'number' ? 
                            (entry.name.includes('%') ? entry.value.toFixed(1) + '%' : 
                             entry.name.includes('Hours') ? entry.value.toLocaleString() + ' hrs' :
                             entry.value.toLocaleString()) 
                            : entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="defects" name="Production Defects" fill="#ef4444" opacity={0.7} />
            <Line yAxisId="left" type="monotone" dataKey="investment" name="QA Investment %" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
            <Line yAxisId="left" type="monotone" dataKey="leakage" name="Defect Leakage %" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
            {showProjections && (
              <Line yAxisId="right" type="monotone" dataKey="costAvoidance" name="Cost Avoidance Hours" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Current vs Projected */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-4">Current vs. Projected State</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={comparisonData} layout="vertical" margin={{ left: 100, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="metric" width={90} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" name="Current" fill="#94a3b8" radius={[0, 4, 4, 0]} />
              <Bar dataKey="projected" name="Projected" fill={currentScenario.color} radius={[0, 4, 4, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario Comparison Radar */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-4">Scenario Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Conservative" dataKey="conservative" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Radar name="Moderate" dataKey="moderate" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
              <Radar name="Aggressive" dataKey="aggressive" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROI Details */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Financial Impact Analysis - {currentScenario.name} Scenario</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-red-50 rounded">
            <p className="text-xs text-gray-600">Current Annual Defect Cost</p>
            <p className="text-lg font-bold text-red-600">${(roiData.currentAnnualCost / 1000).toFixed(0)}K</p>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <p className="text-xs text-gray-600">Projected Annual Defect Cost</p>
            <p className="text-lg font-bold text-green-600">${(roiData.projectedAnnualCost / 1000).toFixed(0)}K</p>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-xs text-gray-600">Required Investment</p>
            <p className="text-lg font-bold text-blue-600">${(roiData.investmentCost / 1000).toFixed(0)}K</p>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <p className="text-xs text-gray-600">Total Annual Benefit</p>
            <p className="text-lg font-bold text-purple-600">${(roiData.totalBenefit / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-800 mb-4">Implementation Roadmap - {currentScenario.name} Scenario</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            <div className="relative pl-10">
              <div className="absolute left-2 w-4 h-4 rounded-full bg-blue-500"></div>
              <div className="p-3 bg-blue-50 rounded">
                <p className="font-semibold text-blue-800">Phase 1: Assessment (Months 1-3)</p>
                <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
                  <li>Identify critical ARTs requiring immediate attention</li>
                  <li>Baseline current metrics and establish KPIs</li>
                  <li>Develop detailed improvement plans per ART</li>
                </ul>
              </div>
            </div>
            <div className="relative pl-10">
              <div className="absolute left-2 w-4 h-4 rounded-full bg-green-500"></div>
              <div className="p-3 bg-green-50 rounded">
                <p className="font-semibold text-green-800">Phase 2: Quick Wins (Months 4-{Math.round(currentScenario.timelineMonths * 0.4)})</p>
                <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
                  <li>Address under-invested ARTs with highest leakage</li>
                  <li>Implement test automation for repetitive scenarios</li>
                  <li>Establish defect prevention practices</li>
                </ul>
              </div>
            </div>
            <div className="relative pl-10">
              <div className="absolute left-2 w-4 h-4 rounded-full bg-amber-500"></div>
              <div className="p-3 bg-amber-50 rounded">
                <p className="font-semibold text-amber-800">Phase 3: Optimization (Months {Math.round(currentScenario.timelineMonths * 0.4) + 1}-{Math.round(currentScenario.timelineMonths * 0.7)})</p>
                <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
                  <li>Rebalance over-invested ARTs for efficiency</li>
                  <li>Implement advanced testing strategies</li>
                  <li>Cross-portfolio knowledge sharing</li>
                </ul>
              </div>
            </div>
            <div className="relative pl-10">
              <div className="absolute left-2 w-4 h-4 rounded-full bg-purple-500"></div>
              <div className="p-3 bg-purple-50 rounded">
                <p className="font-semibold text-purple-800">Phase 4: Sustainment (Months {Math.round(currentScenario.timelineMonths * 0.7) + 1}-{currentScenario.timelineMonths})</p>
                <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
                  <li>Continuous monitoring and adjustment</li>
                  <li>Scale successful practices enterprise-wide</li>
                  <li>Establish governance and reporting cadence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions Note */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
        <p className="font-semibold mb-1">Assumptions:</p>
        <p>Projections based on: $150/hour labor rate, $5,000 average cost per production defect, 8 hours per story point. 
        Actual results may vary based on specific ART characteristics, technology stack, and implementation effectiveness. 
        ROI calculations assume linear improvement trajectory; actual improvements typically follow an S-curve pattern.</p>
      </div>
    </div>
  );
};

export default OptimizationScenariosChart;
