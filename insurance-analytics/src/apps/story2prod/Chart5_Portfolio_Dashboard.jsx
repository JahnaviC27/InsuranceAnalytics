import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, ComposedChart, Line } from 'recharts';

const PortfolioDashboard = () => {
  const rawData = [
    { Project: "Auto Insurance Core 1 ART", Portfolio: "Policy Core Systems", Story_Points_Total: 3810, QA_Story_Points: 985, QA_Story_Points_Pct: 25.85, Total_Test_Cases: 6346, Prod_Defects: 16, Defect_Leakage_Pct: 9.82, Total_Teams: 9, Cost_Avoidance_Hours: 320 },
    { Project: "Auto Insurance Core 3 ART", Portfolio: "Policy Core Systems", Story_Points_Total: 3913, QA_Story_Points: 1101, QA_Story_Points_Pct: 28.14, Total_Test_Cases: 4094, Prod_Defects: 7, Defect_Leakage_Pct: 15.56, Total_Teams: 9, Cost_Avoidance_Hours: 140 },
    { Project: "Auto Insurance Core Platform ART", Portfolio: "Policy Core Systems", Story_Points_Total: 4633, QA_Story_Points: 889, QA_Story_Points_Pct: 19.19, Total_Test_Cases: 1589, Prod_Defects: 3, Defect_Leakage_Pct: 21.43, Total_Teams: 5, Cost_Avoidance_Hours: 60 },
    { Project: "Auto Telematics ART 1", Portfolio: "Policy Core Systems", Story_Points_Total: 5320, QA_Story_Points: 1524, QA_Story_Points_Pct: 28.65, Total_Test_Cases: 10637, Prod_Defects: 26, Defect_Leakage_Pct: 31.71, Total_Teams: 12, Cost_Avoidance_Hours: 520 },
    { Project: "USMB ART", Portfolio: "Policy Core Systems", Story_Points_Total: 5733, QA_Story_Points: 897, QA_Story_Points_Pct: 15.65, Total_Test_Cases: 5571, Prod_Defects: 19, Defect_Leakage_Pct: 23.75, Total_Teams: 5, Cost_Avoidance_Hours: 380 },
    { Project: "Area 51 ART", Portfolio: "Policy Core Systems", Story_Points_Total: 5802, QA_Story_Points: 1191, QA_Story_Points_Pct: 20.53, Total_Test_Cases: 5542, Prod_Defects: 10, Defect_Leakage_Pct: 16.95, Total_Teams: 13, Cost_Avoidance_Hours: 200 },
    { Project: "C2T P&C ART", Portfolio: "Policy Core Systems", Story_Points_Total: 353, QA_Story_Points: 116, QA_Story_Points_Pct: 32.86, Total_Test_Cases: 2208, Prod_Defects: 44, Defect_Leakage_Pct: 18.18, Total_Teams: 3, Cost_Avoidance_Hours: 880 },
    { Project: "Mythos ART", Portfolio: "Policy Core Systems", Story_Points_Total: 5060, QA_Story_Points: 1071, QA_Story_Points_Pct: 21.17, Total_Test_Cases: 5720, Prod_Defects: 34, Defect_Leakage_Pct: 30.91, Total_Teams: 6, Cost_Avoidance_Hours: 680 },
    { Project: "Platform (Property) ART", Portfolio: "Policy Core Systems", Story_Points_Total: 2997, QA_Story_Points: 528, QA_Story_Points_Pct: 17.62, Total_Test_Cases: 1072, Prod_Defects: 0, Defect_Leakage_Pct: null, Total_Teams: 8, Cost_Avoidance_Hours: 0 },
    { Project: "Property Formula 1 ART", Portfolio: "Policy Core Systems", Story_Points_Total: 5234, QA_Story_Points: 303, QA_Story_Points_Pct: 5.79, Total_Test_Cases: 1248, Prod_Defects: 0, Defect_Leakage_Pct: 0.00, Total_Teams: 8, Cost_Avoidance_Hours: 0 },
    { Project: "Think Tankers ART", Portfolio: "Policy Core Systems", Story_Points_Total: 93, QA_Story_Points: 56, QA_Story_Points_Pct: 60.22, Total_Test_Cases: 73, Prod_Defects: 0, Defect_Leakage_Pct: 0.00, Total_Teams: 1, Cost_Avoidance_Hours: 0 },
    { Project: "Policy Mod Auto ART", Portfolio: "Policy Modernization", Story_Points_Total: 58879, QA_Story_Points: 6739, QA_Story_Points_Pct: 11.45, Total_Test_Cases: 122522, Prod_Defects: 41, Defect_Leakage_Pct: 1.69, Total_Teams: 31, Cost_Avoidance_Hours: 820 },
    { Project: "P3 – Back to the Future ART", Portfolio: "Policy Modernization", Story_Points_Total: 3919, QA_Story_Points: 1751, QA_Story_Points_Pct: 44.68, Total_Test_Cases: 37274, Prod_Defects: 7, Defect_Leakage_Pct: 1.82, Total_Teams: 6, Cost_Avoidance_Hours: 140 },
    { Project: "DW – Elemental ART", Portfolio: "Policy Modernization", Story_Points_Total: 15359, QA_Story_Points: 4152, QA_Story_Points_Pct: 27.03, Total_Test_Cases: 61599, Prod_Defects: 13, Defect_Leakage_Pct: 1.51, Total_Teams: 15, Cost_Avoidance_Hours: 260 },
    { Project: "DW – Mythology ART", Portfolio: "Policy Modernization", Story_Points_Total: 16091, QA_Story_Points: 5522, QA_Story_Points_Pct: 34.32, Total_Test_Cases: 151216, Prod_Defects: 10, Defect_Leakage_Pct: 2.88, Total_Teams: 25, Cost_Avoidance_Hours: 200 },
    { Project: "DW – Policy Pirates ART", Portfolio: "Policy Modernization", Story_Points_Total: 7092, QA_Story_Points: 1355, QA_Story_Points_Pct: 19.11, Total_Test_Cases: 9055, Prod_Defects: 10, Defect_Leakage_Pct: 5.38, Total_Teams: 6, Cost_Avoidance_Hours: 200 },
    { Project: "DW – Rock 'N Rollouts ART", Portfolio: "Policy Modernization", Story_Points_Total: 580, QA_Story_Points: 88, QA_Story_Points_Pct: 15.17, Total_Test_Cases: 362, Prod_Defects: 0, Defect_Leakage_Pct: 0.00, Total_Teams: 2, Cost_Avoidance_Hours: 0 },
    { Project: "Umbrella Mod ART", Portfolio: "Policy Modernization", Story_Points_Total: 25558, QA_Story_Points: 6858, QA_Story_Points_Pct: 26.83, Total_Test_Cases: 5571, Prod_Defects: 59, Defect_Leakage_Pct: 5.32, Total_Teams: 5, Cost_Avoidance_Hours: 1180 },
    { Project: "Claims Modernization Core ART", Portfolio: "Claims", Story_Points_Total: 1760, QA_Story_Points: 2, QA_Story_Points_Pct: 0.11, Total_Test_Cases: 1, Prod_Defects: 58, Defect_Leakage_Pct: 17.63, Total_Teams: 1, Cost_Avoidance_Hours: 1160 },
    { Project: "Claims Modernization PHX ART", Portfolio: "Claims", Story_Points_Total: 4084, QA_Story_Points: 395.5, QA_Story_Points_Pct: 9.68, Total_Test_Cases: 10036, Prod_Defects: 67, Defect_Leakage_Pct: 38.95, Total_Teams: 10, Cost_Avoidance_Hours: 1340 },
    { Project: "Claims Modernization PTX ART", Portfolio: "Claims", Story_Points_Total: 3748, QA_Story_Points: 213, QA_Story_Points_Pct: 5.68, Total_Test_Cases: 3941, Prod_Defects: 67, Defect_Leakage_Pct: 35.64, Total_Teams: 6, Cost_Avoidance_Hours: 1340 },
    { Project: "Claims Modernization SAT ART", Portfolio: "Claims", Story_Points_Total: 5304, QA_Story_Points: 1910, QA_Story_Points_Pct: 36.01, Total_Test_Cases: 38581, Prod_Defects: 69, Defect_Leakage_Pct: 35.75, Total_Teams: 10, Cost_Avoidance_Hours: 1380 },
    { Project: "Claims BAU Core ART", Portfolio: "Claims", Story_Points_Total: 5602, QA_Story_Points: 228, QA_Story_Points_Pct: 4.07, Total_Test_Cases: 422, Prod_Defects: 0, Defect_Leakage_Pct: null, Total_Teams: 7, Cost_Avoidance_Hours: 0 },
    { Project: "DM – Claims ART", Portfolio: "Data", Story_Points_Total: 2946, QA_Story_Points: 807, QA_Story_Points_Pct: 27.39, Total_Test_Cases: 1434, Prod_Defects: 40, Defect_Leakage_Pct: 46.51, Total_Teams: 3, Cost_Avoidance_Hours: 800 },
    { Project: "DM – Financials and C&R ART", Portfolio: "Data", Story_Points_Total: 4588, QA_Story_Points: 791, QA_Story_Points_Pct: 17.24, Total_Test_Cases: 19936, Prod_Defects: 13, Defect_Leakage_Pct: 12.50, Total_Teams: 2, Cost_Avoidance_Hours: 260 },
    { Project: "DM – Policy ART", Portfolio: "Data", Story_Points_Total: 5896, QA_Story_Points: 1922, QA_Story_Points_Pct: 32.60, Total_Test_Cases: 32006, Prod_Defects: 8, Defect_Leakage_Pct: 8.60, Total_Teams: 5, Cost_Avoidance_Hours: 160 },
    { Project: "DM – Pricing and UW ART", Portfolio: "Data", Story_Points_Total: 5889, QA_Story_Points: 550, QA_Story_Points_Pct: 9.34, Total_Test_Cases: 3783, Prod_Defects: 0, Defect_Leakage_Pct: 0.00, Total_Teams: 4, Cost_Avoidance_Hours: 0 },
    { Project: "DM – Shared Services ART", Portfolio: "Data", Story_Points_Total: 10891, QA_Story_Points: 1010, QA_Story_Points_Pct: 9.27, Total_Test_Cases: 4336, Prod_Defects: 0, Defect_Leakage_Pct: 0.00, Total_Teams: 7, Cost_Avoidance_Hours: 0 },
    { Project: "CAS – Billing (Dev) ART", Portfolio: "Shared Solutions", Story_Points_Total: 10331, QA_Story_Points: 5915, QA_Story_Points_Pct: 57.25, Total_Test_Cases: 5692, Prod_Defects: 25, Defect_Leakage_Pct: 65.79, Total_Teams: 15, Cost_Avoidance_Hours: 500 },
    { Project: "PICS 2 ART", Portfolio: "Shared Solutions", Story_Points_Total: 2917.5, QA_Story_Points: 851, QA_Story_Points_Pct: 29.17, Total_Test_Cases: 5188, Prod_Defects: 64, Defect_Leakage_Pct: 94.12, Total_Teams: 6, Cost_Avoidance_Hours: 1280 },
    { Project: "PICS 3 ART", Portfolio: "Shared Solutions", Story_Points_Total: 4547, QA_Story_Points: 1592, QA_Story_Points_Pct: 35.01, Total_Test_Cases: 2574, Prod_Defects: 14, Defect_Leakage_Pct: 8.14, Total_Teams: 4, Cost_Avoidance_Hours: 280 },
    { Project: "FinPAL Loss Dev ART", Portfolio: "Shared Solutions", Story_Points_Total: 1806, QA_Story_Points: 1189, QA_Story_Points_Pct: 65.84, Total_Test_Cases: 17272, Prod_Defects: 11, Defect_Leakage_Pct: 68.75, Total_Teams: 4, Cost_Avoidance_Hours: 220 },
    { Project: "FPDV – FinPAL Premium ART", Portfolio: "Shared Solutions", Story_Points_Total: 4479, QA_Story_Points: 1157, QA_Story_Points_Pct: 25.83, Total_Test_Cases: 18658, Prod_Defects: 2, Defect_Leakage_Pct: 11.11, Total_Teams: 7, Cost_Avoidance_Hours: 40 },
    { Project: "PNC CRM ART", Portfolio: "D&S", Story_Points_Total: 966, QA_Story_Points: 730, QA_Story_Points_Pct: 75.57, Total_Test_Cases: 3031, Prod_Defects: 15, Defect_Leakage_Pct: 29.41, Total_Teams: 3, Cost_Avoidance_Hours: 300 },
    { Project: "PNC Salesforce ART", Portfolio: "D&S", Story_Points_Total: 2230, QA_Story_Points: 9, QA_Story_Points_Pct: 0.40, Total_Test_Cases: 14, Prod_Defects: 0, Defect_Leakage_Pct: null, Total_Teams: 1, Cost_Avoidance_Hours: 0 },
    { Project: "PNC Mobile ART", Portfolio: "D&S", Story_Points_Total: 1346, QA_Story_Points: 1055, QA_Story_Points_Pct: 78.38, Total_Test_Cases: 18183, Prod_Defects: 3, Defect_Leakage_Pct: 100.00, Total_Teams: 6, Cost_Avoidance_Hours: 60 },
    { Project: "Omni Digital ART", Portfolio: "D&S", Story_Points_Total: 2134, QA_Story_Points: 551.5, QA_Story_Points_Pct: 25.84, Total_Test_Cases: 13249, Prod_Defects: 10, Defect_Leakage_Pct: 10.20, Total_Teams: 5, Cost_Avoidance_Hours: 200 },
    { Project: "Agency Technology ART", Portfolio: "D&S", Story_Points_Total: 2176, QA_Story_Points: 351, QA_Story_Points_Pct: 16.13, Total_Test_Cases: 6525, Prod_Defects: 8, Defect_Leakage_Pct: 40.00, Total_Teams: 4, Cost_Avoidance_Hours: 160 },
    { Project: "International Auto ART", Portfolio: "D&S", Story_Points_Total: 1220, QA_Story_Points: 129, QA_Story_Points_Pct: 10.57, Total_Test_Cases: 1056, Prod_Defects: 0, Defect_Leakage_Pct: null, Total_Teams: 1, Cost_Avoidance_Hours: 0 },
    { Project: "New Business Ventures & Innovation ART A", Portfolio: "NBV&I", Story_Points_Total: 742, QA_Story_Points: 90, QA_Story_Points_Pct: 12.13, Total_Test_Cases: 388, Prod_Defects: 3, Defect_Leakage_Pct: 100.00, Total_Teams: 3, Cost_Avoidance_Hours: 60 },
    { Project: "New Business Ventures & Innovation ART B", Portfolio: "NBV&I", Story_Points_Total: 1043, QA_Story_Points: 504, QA_Story_Points_Pct: 48.32, Total_Test_Cases: 4439, Prod_Defects: 5, Defect_Leakage_Pct: 4.35, Total_Teams: 5, Cost_Avoidance_Hours: 100 },
    { Project: "New Business Ventures & Innovation ART C", Portfolio: "NBV&I", Story_Points_Total: 5552, QA_Story_Points: 741, QA_Story_Points_Pct: 13.35, Total_Test_Cases: 5439, Prod_Defects: 2, Defect_Leakage_Pct: 0.83, Total_Teams: 6, Cost_Avoidance_Hours: 40 },
    { Project: "New Business Ventures & Innovation ART D", Portfolio: "NBV&I", Story_Points_Total: 2865, QA_Story_Points: 533, QA_Story_Points_Pct: 18.60, Total_Test_Cases: 3031, Prod_Defects: 1, Defect_Leakage_Pct: 0.28, Total_Teams: 3, Cost_Avoidance_Hours: 20 },
    { Project: "ASC Technology ART", Portfolio: "ASC", Story_Points_Total: 542, QA_Story_Points: 161, QA_Story_Points_Pct: 29.70, Total_Test_Cases: 1422, Prod_Defects: 3, Defect_Leakage_Pct: 100.00, Total_Teams: 1, Cost_Avoidance_Hours: 60 }
  ];

  const [selectedMetric, setSelectedMetric] = useState('story_points');
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  const portfolioData = useMemo(() => {
    const portfolios = [...new Set(rawData.map(d => d.Portfolio))];
    
    return portfolios.map(portfolio => {
      const arts = rawData.filter(d => d.Portfolio === portfolio);
      const artsWithLeakage = arts.filter(d => d.Defect_Leakage_Pct !== null);
      
      return {
        Portfolio: portfolio,
        ARTs: arts.length,
        Total_Teams: arts.reduce((sum, d) => sum + d.Total_Teams, 0),
        Story_Points_Total: arts.reduce((sum, d) => sum + d.Story_Points_Total, 0),
        QA_Story_Points: arts.reduce((sum, d) => sum + d.QA_Story_Points, 0),
        Avg_QA_Investment: arts.reduce((sum, d) => sum + d.QA_Story_Points_Pct, 0) / arts.length,
        Total_Test_Cases: arts.reduce((sum, d) => sum + d.Total_Test_Cases, 0),
        Prod_Defects: arts.reduce((sum, d) => sum + d.Prod_Defects, 0),
        Avg_Defect_Leakage: artsWithLeakage.length > 0 
          ? artsWithLeakage.reduce((sum, d) => sum + d.Defect_Leakage_Pct, 0) / artsWithLeakage.length 
          : 0,
        Cost_Avoidance_Hours: arts.reduce((sum, d) => sum + d.Cost_Avoidance_Hours, 0)
      };
    }).sort((a, b) => b.Story_Points_Total - a.Story_Points_Total);
  }, []);

  const totalStats = useMemo(() => {
    return {
      totalARTs: rawData.length,
      totalTeams: rawData.reduce((sum, d) => sum + d.Total_Teams, 0),
      totalStoryPoints: rawData.reduce((sum, d) => sum + d.Story_Points_Total, 0),
      totalQAPoints: rawData.reduce((sum, d) => sum + d.QA_Story_Points, 0),
      totalTestCases: rawData.reduce((sum, d) => sum + d.Total_Test_Cases, 0),
      totalProdDefects: rawData.reduce((sum, d) => sum + d.Prod_Defects, 0),
      totalCostAvoidance: rawData.reduce((sum, d) => sum + d.Cost_Avoidance_Hours, 0)
    };
  }, []);

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#6b7280'];

  const getMetricValue = (d) => {
    switch (selectedMetric) {
      case 'story_points': return d.Story_Points_Total;
      case 'test_cases': return d.Total_Test_Cases;
      case 'prod_defects': return d.Prod_Defects;
      case 'cost_avoidance': return d.Cost_Avoidance_Hours;
      default: return d.Story_Points_Total;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'story_points': return 'Story Points';
      case 'test_cases': return 'Test Cases';
      case 'prod_defects': return 'Prod Defects';
      case 'cost_avoidance': return 'Cost Avoidance Hours';
      default: return 'Story Points';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-bold text-sm mb-2">{data.Portfolio}</p>
          <div className="text-xs space-y-1">
            <p><span className="font-semibold">ARTs:</span> {data.ARTs}</p>
            <p><span className="font-semibold">Teams:</span> {data.Total_Teams}</p>
            <p><span className="font-semibold">Story Points:</span> {data.Story_Points_Total.toLocaleString()}</p>
            <p><span className="font-semibold">QA Points:</span> {data.QA_Story_Points.toLocaleString()}</p>
            <p><span className="font-semibold">Avg QA %:</span> {data.Avg_QA_Investment.toFixed(1)}%</p>
            <p><span className="font-semibold">Test Cases:</span> {data.Total_Test_Cases.toLocaleString()}</p>
            <p><span className="font-semibold">Prod Defects:</span> {data.Prod_Defects}</p>
            <p><span className="font-semibold">Avg Leakage:</span> {data.Avg_Defect_Leakage.toFixed(1)}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((getMetricValue(data) / portfolioData.reduce((sum, d) => sum + getMetricValue(d), 0)) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-bold text-sm">{data.Portfolio}</p>
          <p className="text-xs">{getMetricValue(data).toLocaleString()} ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <p className="text-gray-600">Comprehensive overview of QA metrics across all portfolios</p>
      </div>

      {/* Executive Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-white p-3 rounded-lg shadow border-t-4 border-blue-500">
          <p className="text-xs text-gray-600">Total ARTs</p>
          <p className="text-xl font-bold text-blue-600">{totalStats.totalARTs}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-t-4 border-green-500">
          <p className="text-xs text-gray-600">Total Teams</p>
          <p className="text-xl font-bold text-green-600">{totalStats.totalTeams}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-t-4 border-purple-500">
          <p className="text-xs text-gray-600">Story Points</p>
          <p className="text-xl font-bold text-purple-600">{(totalStats.totalStoryPoints / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-t-4 border-cyan-500">
          <p className="text-xs text-gray-600">QA Points</p>
          <p className="text-xl font-bold text-cyan-600">{(totalStats.totalQAPoints / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-t-4 border-amber-500">
          <p className="text-xs text-gray-600">Test Cases</p>
          <p className="text-xl font-bold text-amber-600">{(totalStats.totalTestCases / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-t-4 border-red-500">
          <p className="text-xs text-gray-600">Prod Defects</p>
          <p className="text-xl font-bold text-red-600">{totalStats.totalProdDefects}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-t-4 border-pink-500">
          <p className="text-xs text-gray-600">Cost Avoidance</p>
          <p className="text-xl font-bold text-pink-600">{(totalStats.totalCostAvoidance / 1000).toFixed(1)}K hrs</p>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">View by:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'story_points', label: 'Story Points' },
              { value: 'test_cases', label: 'Test Cases' },
              { value: 'prod_defects', label: 'Prod Defects' },
              { value: 'cost_avoidance', label: 'Cost Avoidance' }
            ].map(metric => (
              <button
                key={metric.value}
                className={`px-3 py-1 rounded text-sm ${
                  selectedMetric === metric.value 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedMetric(metric.value)}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-4">{getMetricLabel()} by Portfolio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={portfolioData} layout="vertical" margin={{ left: 120, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}K` : val} />
              <YAxis type="category" dataKey="Portfolio" width={110} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={(d) => getMetricValue(d)} radius={[0, 4, 4, 0]}>
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-4">{getMetricLabel()} Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolioData}
                dataKey={(d) => getMetricValue(d)}
                nameKey="Portfolio"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ Portfolio, percent }) => `${Portfolio.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* QA Investment vs Defect Leakage Comparison */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">QA Investment vs. Defect Leakage by Portfolio</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={portfolioData} margin={{ left: 20, right: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="Portfolio" 
              angle={-45} 
              textAnchor="end" 
              height={80} 
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              yAxisId="left" 
              label={{ value: 'Avg QA Investment %', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              label={{ value: 'Avg Defect Leakage %', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                      <p className="font-bold text-sm mb-2">{label}</p>
                      <p className="text-xs text-blue-600">QA Investment: {payload[0]?.value?.toFixed(1)}%</p>
                      <p className="text-xs text-red-600">Defect Leakage: {payload[1]?.value?.toFixed(1)}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="Avg_QA_Investment" name="Avg QA Investment %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="Avg_Defect_Leakage" name="Avg Defect Leakage %" stroke="#ef4444" strokeWidth={3} dot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Portfolio Details Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-800 mb-4">Portfolio Summary Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left font-semibold">Portfolio</th>
                <th className="px-3 py-2 text-right font-semibold">ARTs</th>
                <th className="px-3 py-2 text-right font-semibold">Teams</th>
                <th className="px-3 py-2 text-right font-semibold">Story Points</th>
                <th className="px-3 py-2 text-right font-semibold">QA %</th>
                <th className="px-3 py-2 text-right font-semibold">Test Cases</th>
                <th className="px-3 py-2 text-right font-semibold">Prod Defects</th>
                <th className="px-3 py-2 text-right font-semibold">Avg Leakage</th>
                <th className="px-3 py-2 text-right font-semibold">Cost Avoid (hrs)</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.map((p, index) => (
                <tr key={p.Portfolio} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium">{p.Portfolio}</td>
                  <td className="px-3 py-2 text-right">{p.ARTs}</td>
                  <td className="px-3 py-2 text-right">{p.Total_Teams}</td>
                  <td className="px-3 py-2 text-right">{p.Story_Points_Total.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      p.Avg_QA_Investment >= 20 && p.Avg_QA_Investment <= 30 ? 'bg-green-100 text-green-800' :
                      p.Avg_QA_Investment < 20 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.Avg_QA_Investment.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">{p.Total_Test_Cases.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{p.Prod_Defects}</td>
                  <td className="px-3 py-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      p.Avg_Defect_Leakage <= 10 ? 'bg-green-100 text-green-800' :
                      p.Avg_Defect_Leakage <= 20 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {p.Avg_Defect_Leakage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">{p.Cost_Avoidance_Hours.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 font-semibold">
                <td className="px-3 py-2">Total</td>
                <td className="px-3 py-2 text-right">{totalStats.totalARTs}</td>
                <td className="px-3 py-2 text-right">{totalStats.totalTeams}</td>
                <td className="px-3 py-2 text-right">{totalStats.totalStoryPoints.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">-</td>
                <td className="px-3 py-2 text-right">{totalStats.totalTestCases.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">{totalStats.totalProdDefects}</td>
                <td className="px-3 py-2 text-right">-</td>
                <td className="px-3 py-2 text-right">{totalStats.totalCostAvoidance.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-800 mb-3">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
            <p className="font-semibold text-green-800">Best Performer</p>
            <p className="text-xs text-gray-600">
              Policy Modernization has lowest avg leakage ({portfolioData.find(p => p.Portfolio === 'Policy Modernization')?.Avg_Defect_Leakage.toFixed(1)}%) 
              with balanced QA investment.
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
            <p className="font-semibold text-red-800">Needs Attention</p>
            <p className="text-xs text-gray-600">
              Claims and Shared Solutions show highest defect leakage rates. 
              Review testing effectiveness and coverage.
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
            <p className="font-semibold text-blue-800">Investment Opportunity</p>
            <p className="text-xs text-gray-600">
              Several portfolios with &lt;20% QA investment may benefit from 
              increased testing resources to reduce production defects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
