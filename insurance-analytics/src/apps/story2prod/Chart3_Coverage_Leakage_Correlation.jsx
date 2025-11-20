import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, ReferenceLine, Cell } from 'recharts';

const CoverageLeakageChart = ({ variant = 'full' }) => {
  const isCard = variant === 'card';
  const rawData = [
    { Project: "Auto Insurance Core 1 ART", Portfolio: "Policy Core Systems", Domain: "Auto", Test_Coverage_Pct: 34.82, Defect_Leakage_Pct: 9.82, Story_Points_Total: 3810, Total_Test_Cases: 6346, QA_Story_Points_Pct: 25.85, Investment_Category: "High" },
    { Project: "Auto Insurance Core 3 ART", Portfolio: "Policy Core Systems", Domain: "Auto", Test_Coverage_Pct: 37.83, Defect_Leakage_Pct: 15.56, Story_Points_Total: 3913, Total_Test_Cases: 4094, QA_Story_Points_Pct: 28.14, Investment_Category: "High" },
    { Project: "Auto Insurance Core Platform ART", Portfolio: "Policy Core Systems", Domain: "Auto", Test_Coverage_Pct: 19.71, Defect_Leakage_Pct: 21.43, Story_Points_Total: 4633, Total_Test_Cases: 1589, QA_Story_Points_Pct: 19.19, Investment_Category: "Low" },
    { Project: "Auto Telematics ART 1", Portfolio: "Policy Core Systems", Domain: "Auto", Test_Coverage_Pct: 33.17, Defect_Leakage_Pct: 31.71, Story_Points_Total: 5320, Total_Test_Cases: 10637, QA_Story_Points_Pct: 28.65, Investment_Category: "High" },
    { Project: "USMB ART", Portfolio: "Policy Core Systems", Domain: "Umbrella", Test_Coverage_Pct: 43.00, Defect_Leakage_Pct: 23.75, Story_Points_Total: 5733, Total_Test_Cases: 5571, QA_Story_Points_Pct: 15.65, Investment_Category: "Low" },
    { Project: "Area 51 ART", Portfolio: "Policy Core Systems", Domain: "Property", Test_Coverage_Pct: 27.73, Defect_Leakage_Pct: 16.95, Story_Points_Total: 5802, Total_Test_Cases: 5542, QA_Story_Points_Pct: 20.53, Investment_Category: "Optimal" },
    { Project: "C2T P&C ART", Portfolio: "Policy Core Systems", Domain: "Property", Test_Coverage_Pct: 100.00, Defect_Leakage_Pct: 18.18, Story_Points_Total: 353, Total_Test_Cases: 2208, QA_Story_Points_Pct: 32.86, Investment_Category: "Very High" },
    { Project: "Mythos ART", Portfolio: "Policy Core Systems", Domain: "Property", Test_Coverage_Pct: 30.49, Defect_Leakage_Pct: 30.91, Story_Points_Total: 5060, Total_Test_Cases: 5720, QA_Story_Points_Pct: 21.17, Investment_Category: "Optimal" },
    { Project: "Property Formula 1 ART", Portfolio: "Policy Core Systems", Domain: "Property", Test_Coverage_Pct: 18.18, Defect_Leakage_Pct: 0.00, Story_Points_Total: 5234, Total_Test_Cases: 1248, QA_Story_Points_Pct: 5.79, Investment_Category: "Low" },
    { Project: "Think Tankers ART", Portfolio: "Policy Core Systems", Domain: "Property", Test_Coverage_Pct: 26.67, Defect_Leakage_Pct: 0.00, Story_Points_Total: 93, Total_Test_Cases: 73, QA_Story_Points_Pct: 60.22, Investment_Category: "Very High" },
    { Project: "Policy Mod Auto ART", Portfolio: "Policy Modernization", Domain: "Auto", Test_Coverage_Pct: 44.70, Defect_Leakage_Pct: 1.69, Story_Points_Total: 58879, Total_Test_Cases: 122522, QA_Story_Points_Pct: 11.45, Investment_Category: "Low" },
    { Project: "P3 – Back to the Future ART", Portfolio: "Policy Modernization", Domain: "P3 (VPP)", Test_Coverage_Pct: 69.89, Defect_Leakage_Pct: 1.82, Story_Points_Total: 3919, Total_Test_Cases: 37274, QA_Story_Points_Pct: 44.68, Investment_Category: "Very High" },
    { Project: "DW – Elemental ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Test_Coverage_Pct: 51.16, Defect_Leakage_Pct: 1.51, Story_Points_Total: 15359, Total_Test_Cases: 61599, QA_Story_Points_Pct: 27.03, Investment_Category: "High" },
    { Project: "DW – Mythology ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Test_Coverage_Pct: 52.50, Defect_Leakage_Pct: 2.88, Story_Points_Total: 16091, Total_Test_Cases: 151216, QA_Story_Points_Pct: 34.32, Investment_Category: "Very High" },
    { Project: "DW – Policy Pirates ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Test_Coverage_Pct: 44.25, Defect_Leakage_Pct: 5.38, Story_Points_Total: 7092, Total_Test_Cases: 9055, QA_Story_Points_Pct: 19.11, Investment_Category: "Low" },
    { Project: "DW – Rock 'N Rollouts ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Test_Coverage_Pct: 40.33, Defect_Leakage_Pct: 0.00, Story_Points_Total: 580, Total_Test_Cases: 362, QA_Story_Points_Pct: 15.17, Investment_Category: "Low" },
    { Project: "Umbrella Mod ART", Portfolio: "Policy Modernization", Domain: "Umbrella", Test_Coverage_Pct: 22.21, Defect_Leakage_Pct: 5.32, Story_Points_Total: 25558, Total_Test_Cases: 5571, QA_Story_Points_Pct: 26.83, Investment_Category: "High" },
    { Project: "Claims Modernization Core ART", Portfolio: "Claims", Domain: "Claims", Test_Coverage_Pct: 17.69, Defect_Leakage_Pct: 17.63, Story_Points_Total: 1760, Total_Test_Cases: 1, QA_Story_Points_Pct: 0.11, Investment_Category: "Low" },
    { Project: "Claims Modernization PHX ART", Portfolio: "Claims", Domain: "Claims", Test_Coverage_Pct: 15.08, Defect_Leakage_Pct: 38.95, Story_Points_Total: 4084, Total_Test_Cases: 10036, QA_Story_Points_Pct: 9.68, Investment_Category: "Low" },
    { Project: "Claims Modernization PTX ART", Portfolio: "Claims", Domain: "Claims", Test_Coverage_Pct: 13.97, Defect_Leakage_Pct: 35.64, Story_Points_Total: 3748, Total_Test_Cases: 3941, QA_Story_Points_Pct: 5.68, Investment_Category: "Low" },
    { Project: "Claims Modernization SAT ART", Portfolio: "Claims", Domain: "Claims", Test_Coverage_Pct: 45.50, Defect_Leakage_Pct: 35.75, Story_Points_Total: 5304, Total_Test_Cases: 38581, QA_Story_Points_Pct: 36.01, Investment_Category: "Very High" },
    { Project: "DM – Claims ART", Portfolio: "Data", Domain: "Data", Test_Coverage_Pct: 43.95, Defect_Leakage_Pct: 46.51, Story_Points_Total: 2946, Total_Test_Cases: 1434, QA_Story_Points_Pct: 27.39, Investment_Category: "High" },
    { Project: "DM – Financials and C&R ART", Portfolio: "Data", Domain: "Data", Test_Coverage_Pct: 17.79, Defect_Leakage_Pct: 12.50, Story_Points_Total: 4588, Total_Test_Cases: 19936, QA_Story_Points_Pct: 17.24, Investment_Category: "Low" },
    { Project: "DM – Policy ART", Portfolio: "Data", Domain: "Data", Test_Coverage_Pct: 58.21, Defect_Leakage_Pct: 8.60, Story_Points_Total: 5896, Total_Test_Cases: 32006, QA_Story_Points_Pct: 32.60, Investment_Category: "Very High" },
    { Project: "DM – Pricing and UW ART", Portfolio: "Data", Domain: "Data", Test_Coverage_Pct: 19.01, Defect_Leakage_Pct: 0.00, Story_Points_Total: 5889, Total_Test_Cases: 3783, QA_Story_Points_Pct: 9.34, Investment_Category: "Low" },
    { Project: "DM – Shared Services ART", Portfolio: "Data", Domain: "Data", Test_Coverage_Pct: 17.43, Defect_Leakage_Pct: 0.00, Story_Points_Total: 10891, Total_Test_Cases: 4336, QA_Story_Points_Pct: 9.27, Investment_Category: "Low" },
    { Project: "CAS – Billing (Dev) ART", Portfolio: "Shared Solutions", Domain: "BASE", Test_Coverage_Pct: 58.02, Defect_Leakage_Pct: 65.79, Story_Points_Total: 10331, Total_Test_Cases: 5692, QA_Story_Points_Pct: 57.25, Investment_Category: "Very High" },
    { Project: "PICS 2 ART", Portfolio: "Shared Solutions", Domain: "PICS", Test_Coverage_Pct: 21.67, Defect_Leakage_Pct: 94.12, Story_Points_Total: 2917.5, Total_Test_Cases: 5188, QA_Story_Points_Pct: 29.17, Investment_Category: "High" },
    { Project: "PICS 3 ART", Portfolio: "Shared Solutions", Domain: "PICS", Test_Coverage_Pct: 36.17, Defect_Leakage_Pct: 8.14, Story_Points_Total: 4547, Total_Test_Cases: 2574, QA_Story_Points_Pct: 35.01, Investment_Category: "Very High" },
    { Project: "FinPAL Loss Dev ART", Portfolio: "Shared Solutions", Domain: "FINPAL", Test_Coverage_Pct: 46.73, Defect_Leakage_Pct: 68.75, Story_Points_Total: 1806, Total_Test_Cases: 17272, QA_Story_Points_Pct: 65.84, Investment_Category: "Very High" },
    { Project: "FPDV – FinPAL Premium ART", Portfolio: "Shared Solutions", Domain: "FINPAL", Test_Coverage_Pct: 31.78, Defect_Leakage_Pct: 11.11, Story_Points_Total: 4479, Total_Test_Cases: 18658, QA_Story_Points_Pct: 25.83, Investment_Category: "High" },
    { Project: "PNC CRM ART", Portfolio: "D&S", Domain: "Salesforce CRM", Test_Coverage_Pct: 75.14, Defect_Leakage_Pct: 29.41, Story_Points_Total: 966, Total_Test_Cases: 3031, QA_Story_Points_Pct: 75.57, Investment_Category: "Very High" },
    { Project: "PNC Mobile ART", Portfolio: "D&S", Domain: "P&C Mobile", Test_Coverage_Pct: 73.88, Defect_Leakage_Pct: 100.00, Story_Points_Total: 1346, Total_Test_Cases: 18183, QA_Story_Points_Pct: 78.38, Investment_Category: "Very High" },
    { Project: "Omni Digital ART", Portfolio: "D&S", Domain: "Digital", Test_Coverage_Pct: 39.21, Defect_Leakage_Pct: 10.20, Story_Points_Total: 2134, Total_Test_Cases: 13249, QA_Story_Points_Pct: 25.84, Investment_Category: "High" },
    { Project: "Agency Technology ART", Portfolio: "D&S", Domain: "Agency", Test_Coverage_Pct: 18.10, Defect_Leakage_Pct: 40.00, Story_Points_Total: 2176, Total_Test_Cases: 6525, QA_Story_Points_Pct: 16.13, Investment_Category: "Low" },
    { Project: "New Business Ventures & Innovation ART A", Portfolio: "NBV&I", Domain: "Future of Auto, Innovation", Test_Coverage_Pct: 21.32, Defect_Leakage_Pct: 100.00, Story_Points_Total: 742, Total_Test_Cases: 388, QA_Story_Points_Pct: 12.13, Investment_Category: "Low" },
    { Project: "New Business Ventures & Innovation ART B", Portfolio: "NBV&I", Domain: "SBI", Test_Coverage_Pct: 28.93, Defect_Leakage_Pct: 4.35, Story_Points_Total: 1043, Total_Test_Cases: 4439, QA_Story_Points_Pct: 48.32, Investment_Category: "Very High" },
    { Project: "New Business Ventures & Innovation ART C", Portfolio: "NBV&I", Domain: "OEM", Test_Coverage_Pct: 22.01, Defect_Leakage_Pct: 0.83, Story_Points_Total: 5552, Total_Test_Cases: 5439, QA_Story_Points_Pct: 13.35, Investment_Category: "Low" },
    { Project: "New Business Ventures & Innovation ART D", Portfolio: "NBV&I", Domain: "Expanded Distribution, Auto Ecosystem", Test_Coverage_Pct: 53.18, Defect_Leakage_Pct: 0.28, Story_Points_Total: 2865, Total_Test_Cases: 3031, QA_Story_Points_Pct: 18.60, Investment_Category: "Low" },
    { Project: "ASC Technology ART", Portfolio: "ASC", Domain: "ASC", Test_Coverage_Pct: 45.66, Defect_Leakage_Pct: 100.00, Story_Points_Total: 542, Total_Test_Cases: 1422, QA_Story_Points_Pct: 29.70, Investment_Category: "High" }
  ];

  const [selectedPortfolio, setSelectedPortfolio] = useState('All');
  const [selectedInvestment, setSelectedInvestment] = useState('All');
  const [bubbleSize, setBubbleSize] = useState('story_points');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [highlightQuadrant, setHighlightQuadrant] = useState('all');

  const portfolios = ['All', ...new Set(rawData.map(d => d.Portfolio))];
  const investmentCategories = ['All', 'Low', 'Optimal', 'High', 'Very High'];

  const filteredData = useMemo(() => {
    let data = rawData.filter(d => d.Defect_Leakage_Pct !== null && d.Test_Coverage_Pct !== null);
    
    if (selectedPortfolio !== 'All') {
      data = data.filter(d => d.Portfolio === selectedPortfolio);
    }
    if (selectedInvestment !== 'All') {
      data = data.filter(d => d.Investment_Category === selectedInvestment);
    }
    
    // Add quadrant classification
    data = data.map(d => {
      const highCoverage = d.Test_Coverage_Pct >= 40;
      const lowLeakage = d.Defect_Leakage_Pct <= 15;
      let quadrant;
      if (highCoverage && lowLeakage) quadrant = 'optimal';
      else if (highCoverage && !lowLeakage) quadrant = 'inefficient';
      else if (!highCoverage && lowLeakage) quadrant = 'efficient';
      else quadrant = 'at-risk';
      return { ...d, quadrant };
    });

    if (highlightQuadrant !== 'all') {
      data = data.filter(d => d.quadrant === highlightQuadrant);
    }
    
    return data;
  }, [selectedPortfolio, selectedInvestment, highlightQuadrant]);

  const getBubbleValue = (d) => {
    if (bubbleSize === 'story_points') return Math.sqrt(d.Story_Points_Total) * 2;
    if (bubbleSize === 'test_cases') return Math.sqrt(d.Total_Test_Cases) * 0.5;
    return 200;
  };

  const getPointColor = (category) => {
    switch (category) {
      case 'Low': return '#ef4444';
      case 'Optimal': return '#22c55e';
      case 'High': return '#3b82f6';
      case 'Very High': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const summaryStats = useMemo(() => {
    const optimalQuadrant = filteredData.filter(d => d.quadrant === 'optimal').length;
    const atRiskQuadrant = filteredData.filter(d => d.quadrant === 'at-risk').length;
    const avgCoverage = filteredData.reduce((sum, d) => sum + d.Test_Coverage_Pct, 0) / filteredData.length;
    const avgLeakage = filteredData.reduce((sum, d) => sum + d.Defect_Leakage_Pct, 0) / filteredData.length;
    return { optimalQuadrant, atRiskQuadrant, avgCoverage, avgLeakage };
  }, [filteredData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg max-w-xs">
          <p className="font-bold text-sm mb-2">{data.Project}</p>
          <div className="text-xs space-y-1">
            <p><span className="font-semibold">Portfolio:</span> {data.Portfolio}</p>
            <p><span className="font-semibold">Test Coverage:</span> <span className="text-green-600 font-bold">{data.Test_Coverage_Pct.toFixed(1)}%</span></p>
            <p><span className="font-semibold">Defect Leakage:</span> <span className="text-red-600 font-bold">{data.Defect_Leakage_Pct.toFixed(1)}%</span></p>
            <p><span className="font-semibold">Story Points:</span> {data.Story_Points_Total.toLocaleString()}</p>
            <p><span className="font-semibold">Test Cases:</span> {data.Total_Test_Cases.toLocaleString()}</p>
            <p><span className="font-semibold">QA Investment:</span> {data.QA_Story_Points_Pct.toFixed(1)}%</p>
            <p><span className="font-semibold">Quadrant:</span> 
              <span className={`ml-1 px-2 py-0.5 rounded text-white capitalize ${
                data.quadrant === 'optimal' ? 'bg-green-500' :
                data.quadrant === 'efficient' ? 'bg-blue-500' :
                data.quadrant === 'inefficient' ? 'bg-amber-500' : 'bg-red-500'
              }`}>
                {data.quadrant}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={isCard ? "w-full p-3" : "w-full p-6 bg-gray-50 min-h-screen"}>
      {!isCard && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Test Coverage vs. Defect Leakage Correlation</h1>
          <p className="text-gray-600">Analyzing the relationship between test coverage and production defect leakage</p>
        </div>
      )}
      {isCard && (
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-gray-800">Coverage vs Leakage</h2>
        </div>
      )}

      {!isCard && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Optimal Quadrant</p>
          <p className="text-2xl font-bold text-green-600">{summaryStats.optimalQuadrant}</p>
          <p className="text-xs text-gray-500">High coverage, low leakage</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-600">At-Risk Quadrant</p>
          <p className="text-2xl font-bold text-red-600">{summaryStats.atRiskQuadrant}</p>
          <p className="text-xs text-gray-500">Low coverage, high leakage</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Avg Test Coverage</p>
          <p className="text-2xl font-bold text-blue-600">{summaryStats.avgCoverage.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-amber-500">
          <p className="text-sm text-gray-600">Avg Defect Leakage</p>
          <p className="text-2xl font-bold text-amber-600">{summaryStats.avgLeakage.toFixed(1)}%</p>
        </div>
      </div>
      )}

      <div className={isCard ? "mb-2" : "bg-white p-4 rounded-lg shadow mb-6"}>
        <div className={isCard ? "flex flex-wrap items-center gap-2 text-[11px]" : "grid grid-cols-2 md:grid-cols-5 gap-4"}>
          <div>
            {!isCard && <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>}
            <select 
              className={isCard ? "p-1 border rounded text-[11px]" : "w-full p-2 border border-gray-300 rounded-md text-sm"}
              value={selectedPortfolio}
              onChange={(e) => setSelectedPortfolio(e.target.value)}
            >
              {portfolios.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            {!isCard && <label className="block text-sm font-medium text-gray-700 mb-1">Investment Level</label>}
            <select 
              className={isCard ? "p-1 border rounded text-[11px]" : "w-full p-2 border border-gray-300 rounded-md text-sm"}
              value={selectedInvestment}
              onChange={(e) => setSelectedInvestment(e.target.value)}
            >
              {investmentCategories.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            {!isCard && <label className="block text-sm font-medium text-gray-700 mb-1">Bubble Size</label>}
            <select 
              className={isCard ? "p-1 border rounded text-[11px]" : "w-full p-2 border border-gray-300 rounded-md text-sm"}
              value={bubbleSize}
              onChange={(e) => setBubbleSize(e.target.value)}
            >
              <option value="story_points">Story Points</option>
              <option value="test_cases">Test Cases</option>
              <option value="fixed">Fixed Size</option>
            </select>
          </div>
          <div>
            {!isCard && <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Quadrant</label>}
            <select 
              className={isCard ? "p-1 border rounded text-[11px]" : "w-full p-2 border border-gray-300 rounded-md text-sm"}
              value={highlightQuadrant}
              onChange={(e) => setHighlightQuadrant(e.target.value)}
            >
              <option value="all">All Quadrants</option>
              <option value="optimal">Optimal (High Cov, Low Leak)</option>
              <option value="efficient">Efficient (Low Cov, Low Leak)</option>
              <option value="inefficient">Inefficient (High Cov, High Leak)</option>
              <option value="at-risk">At-Risk (Low Cov, High Leak)</option>
            </select>
          </div>
          <div className={isCard ? "flex items-center" : "flex items-end"}>
            <button 
              className={isCard ? "px-2 py-1 border rounded text-[11px]" : "w-full p-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"}
              onClick={() => {
                setSelectedPortfolio('All');
                setSelectedInvestment('All');
                setBubbleSize('story_points');
                setHighlightQuadrant('all');
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className={isCard ? "bg-white p-2 rounded-lg shadow mb-3" : "bg-white p-4 rounded-lg shadow mb-6"}>
        <div className="relative">
          <ResponsiveContainer width="100%" height={isCard ? 360 : 500}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="Test_Coverage_Pct" 
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
                label={isCard ? undefined : { value: 'Test Coverage (%)', position: 'bottom', offset: 40 }}
              />
              <YAxis 
                type="number" 
                dataKey="Defect_Leakage_Pct" 
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
                label={isCard ? undefined : { value: 'Defect Leakage (%)', angle: -90, position: 'insideLeft', offset: -40 }}
              />
              <ZAxis 
                type="number" 
                dataKey={(d) => getBubbleValue(d)} 
                range={[100, 2000]} 
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={40} stroke="#6b7280" strokeDasharray="5 5" />
              <ReferenceLine y={15} stroke="#6b7280" strokeDasharray="5 5" />
              <Scatter 
                data={filteredData} 
                onClick={(data) => setSelectedPoint(data)}
              >
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getPointColor(entry.Investment_Category)}
                    fillOpacity={0.7}
                    stroke={getPointColor(entry.Investment_Category)}
                    strokeWidth={2}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          
          {/* Quadrant Labels */}
          <div className="absolute top-8 left-16 text-xs text-gray-500 bg-green-50 px-2 py-1 rounded">
            Efficient Testing
          </div>
          <div className="absolute top-8 right-8 text-xs text-gray-500 bg-green-100 px-2 py-1 rounded font-semibold">
            OPTIMAL
          </div>
          <div className="absolute bottom-20 left-16 text-xs text-gray-500 bg-red-50 px-2 py-1 rounded">
            AT-RISK
          </div>
          <div className="absolute bottom-20 right-8 text-xs text-gray-500 bg-amber-50 px-2 py-1 rounded">
            Inefficient Testing
          </div>
        </div>
      </div>

      {!isCard && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-3">Quadrant Definitions</h3>
          <div className="space-y-3 text-sm">
            <div className="p-2 bg-green-50 rounded border-l-4 border-green-500">
              <p className="font-semibold">Optimal (Top Right)</p>
              <p className="text-xs text-gray-600">High coverage (≥40%) + Low leakage (≤15%). Best practice.</p>
            </div>
            <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-500">
              <p className="font-semibold">Efficient (Top Left)</p>
              <p className="text-xs text-gray-600">Low coverage + Low leakage. Good targeting but may miss defects.</p>
            </div>
            <div className="p-2 bg-amber-50 rounded border-l-4 border-amber-500">
              <p className="font-semibold">Inefficient (Bottom Right)</p>
              <p className="text-xs text-gray-600">High coverage + High leakage. Tests not catching defects.</p>
            </div>
            <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
              <p className="font-semibold">At-Risk (Bottom Left)</p>
              <p className="text-xs text-gray-600">Low coverage + High leakage. Immediate attention needed.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-3">Color Legend (Investment Level)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Low Investment (&lt;20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Optimal Investment (20-25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>High Investment (25-30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span>Very High Investment (&gt;30%)</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Bubble size represents {bubbleSize === 'story_points' ? 'story points' : bubbleSize === 'test_cases' ? 'test cases' : 'fixed size'}</p>
        </div>
      </div>
      )}

      {selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedPoint(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">{selectedPoint.Project}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Portfolio:</span> {selectedPoint.Portfolio}</p>
              <p><span className="font-semibold">Domain:</span> {selectedPoint.Domain}</p>
              <p><span className="font-semibold">Test Coverage:</span> {selectedPoint.Test_Coverage_Pct.toFixed(1)}%</p>
              <p><span className="font-semibold">Defect Leakage:</span> {selectedPoint.Defect_Leakage_Pct.toFixed(1)}%</p>
              <p><span className="font-semibold">Story Points:</span> {selectedPoint.Story_Points_Total.toLocaleString()}</p>
              <p><span className="font-semibold">Test Cases:</span> {selectedPoint.Total_Test_Cases.toLocaleString()}</p>
              <p><span className="font-semibold">QA Investment:</span> {selectedPoint.QA_Story_Points_Pct.toFixed(1)}%</p>
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="font-semibold mb-1">Analysis:</p>
                <p className="text-xs">
                  {selectedPoint.quadrant === 'optimal' && 'This ART demonstrates excellent testing practices with high coverage effectively preventing defects from reaching production.'}
                  {selectedPoint.quadrant === 'efficient' && 'This ART achieves low defect leakage with targeted testing. Consider if additional coverage would further reduce risk.'}
                  {selectedPoint.quadrant === 'inefficient' && 'Despite high test coverage, defects are reaching production. Review test effectiveness and consider improving test quality over quantity.'}
                  {selectedPoint.quadrant === 'at-risk' && 'Both low coverage and high leakage indicate urgent need for improved testing strategy and increased QA investment.'}
                </p>
              </div>
            </div>
            <button 
              className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelectedPoint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverageLeakageChart;
