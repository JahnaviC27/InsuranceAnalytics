import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell, ReferenceLine } from 'recharts';

const TestCaseEfficiencyChart = () => {
  const rawData = [
    { Project: "Auto Insurance Core 1 ART", Portfolio: "Policy Core Systems", Domain: "Auto", TC_per_Story_Point: 1.67, Defect_Leakage_Pct: 9.82, Story_Points_Total: 3810, Total_Test_Cases: 6346, Prod_Defects: 16, Defects_per_1K_TC: 25.69 },
    { Project: "Auto Insurance Core 3 ART", Portfolio: "Policy Core Systems", Domain: "Auto", TC_per_Story_Point: 1.05, Defect_Leakage_Pct: 15.56, Story_Points_Total: 3913, Total_Test_Cases: 4094, Prod_Defects: 7, Defects_per_1K_TC: 10.99 },
    { Project: "Auto Insurance Core Platform ART", Portfolio: "Policy Core Systems", Domain: "Auto", TC_per_Story_Point: 0.34, Defect_Leakage_Pct: 21.43, Story_Points_Total: 4633, Total_Test_Cases: 1589, Prod_Defects: 3, Defects_per_1K_TC: 8.81 },
    { Project: "Auto Telematics ART 1", Portfolio: "Policy Core Systems", Domain: "Auto", TC_per_Story_Point: 2.00, Defect_Leakage_Pct: 31.71, Story_Points_Total: 5320, Total_Test_Cases: 10637, Prod_Defects: 26, Defects_per_1K_TC: 7.71 },
    { Project: "USMB ART", Portfolio: "Policy Core Systems", Domain: "Umbrella", TC_per_Story_Point: 0.97, Defect_Leakage_Pct: 23.75, Story_Points_Total: 5733, Total_Test_Cases: 5571, Prod_Defects: 19, Defects_per_1K_TC: 14.36 },
    { Project: "Area 51 ART", Portfolio: "Policy Core Systems", Domain: "Property", TC_per_Story_Point: 0.96, Defect_Leakage_Pct: 16.95, Story_Points_Total: 5802, Total_Test_Cases: 5542, Prod_Defects: 10, Defects_per_1K_TC: 10.65 },
    { Project: "C2T P&C ART", Portfolio: "Policy Core Systems", Domain: "Property", TC_per_Story_Point: 6.25, Defect_Leakage_Pct: 18.18, Story_Points_Total: 353, Total_Test_Cases: 2208, Prod_Defects: 44, Defects_per_1K_TC: 109.60 },
    { Project: "Mythos ART", Portfolio: "Policy Core Systems", Domain: "Property", TC_per_Story_Point: 1.13, Defect_Leakage_Pct: 30.91, Story_Points_Total: 5060, Total_Test_Cases: 5720, Prod_Defects: 34, Defects_per_1K_TC: 19.23 },
    { Project: "Property Formula 1 ART", Portfolio: "Policy Core Systems", Domain: "Property", TC_per_Story_Point: 0.24, Defect_Leakage_Pct: 0.00, Story_Points_Total: 5234, Total_Test_Cases: 1248, Prod_Defects: 0, Defects_per_1K_TC: 13.62 },
    { Project: "Think Tankers ART", Portfolio: "Policy Core Systems", Domain: "Property", TC_per_Story_Point: 0.78, Defect_Leakage_Pct: 0.00, Story_Points_Total: 93, Total_Test_Cases: 73, Prod_Defects: 0, Defects_per_1K_TC: 2876.71 },
    { Project: "Policy Mod Auto ART", Portfolio: "Policy Modernization", Domain: "Auto", TC_per_Story_Point: 2.08, Defect_Leakage_Pct: 1.69, Story_Points_Total: 58879, Total_Test_Cases: 122522, Prod_Defects: 41, Defects_per_1K_TC: 19.79 },
    { Project: "P3 – Back to the Future ART", Portfolio: "Policy Modernization", Domain: "P3 (VPP)", TC_per_Story_Point: 9.51, Defect_Leakage_Pct: 1.82, Story_Points_Total: 3919, Total_Test_Cases: 37274, Prod_Defects: 7, Defects_per_1K_TC: 10.33 },
    { Project: "DW – Elemental ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", TC_per_Story_Point: 4.01, Defect_Leakage_Pct: 1.51, Story_Points_Total: 15359, Total_Test_Cases: 61599, Prod_Defects: 13, Defects_per_1K_TC: 13.98 },
    { Project: "DW – Mythology ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", TC_per_Story_Point: 9.40, Defect_Leakage_Pct: 2.88, Story_Points_Total: 16091, Total_Test_Cases: 151216, Prod_Defects: 10, Defects_per_1K_TC: 2.29 },
    { Project: "DW – Policy Pirates ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", TC_per_Story_Point: 1.28, Defect_Leakage_Pct: 5.38, Story_Points_Total: 7092, Total_Test_Cases: 9055, Prod_Defects: 10, Defects_per_1K_TC: 20.54 },
    { Project: "DW – Rock 'N Rollouts ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", TC_per_Story_Point: 0.62, Defect_Leakage_Pct: 0.00, Story_Points_Total: 580, Total_Test_Cases: 362, Prod_Defects: 0, Defects_per_1K_TC: 35.91 },
    { Project: "Umbrella Mod ART", Portfolio: "Policy Modernization", Domain: "Umbrella", TC_per_Story_Point: 0.22, Defect_Leakage_Pct: 5.32, Story_Points_Total: 25558, Total_Test_Cases: 5571, Prod_Defects: 59, Defects_per_1K_TC: 199.07 },
    { Project: "Claims Modernization Core ART", Portfolio: "Claims", Domain: "Claims", TC_per_Story_Point: 0.001, Defect_Leakage_Pct: 17.63, Story_Points_Total: 1760, Total_Test_Cases: 1, Prod_Defects: 58, Defects_per_1K_TC: 329000.00 },
    { Project: "Claims Modernization PHX ART", Portfolio: "Claims", Domain: "Claims", TC_per_Story_Point: 2.46, Defect_Leakage_Pct: 38.95, Story_Points_Total: 4084, Total_Test_Cases: 10036, Prod_Defects: 67, Defects_per_1K_TC: 17.14 },
    { Project: "Claims Modernization PTX ART", Portfolio: "Claims", Domain: "Claims", TC_per_Story_Point: 1.05, Defect_Leakage_Pct: 35.64, Story_Points_Total: 3748, Total_Test_Cases: 3941, Prod_Defects: 67, Defects_per_1K_TC: 47.70 },
    { Project: "Claims Modernization SAT ART", Portfolio: "Claims", Domain: "Claims", TC_per_Story_Point: 7.27, Defect_Leakage_Pct: 35.75, Story_Points_Total: 5304, Total_Test_Cases: 38581, Prod_Defects: 69, Defects_per_1K_TC: 5.00 },
    { Project: "DM – Claims ART", Portfolio: "Data", Domain: "Data", TC_per_Story_Point: 0.49, Defect_Leakage_Pct: 46.51, Story_Points_Total: 2946, Total_Test_Cases: 1434, Prod_Defects: 40, Defects_per_1K_TC: 59.97 },
    { Project: "DM – Financials and C&R ART", Portfolio: "Data", Domain: "Data", TC_per_Story_Point: 4.35, Defect_Leakage_Pct: 12.50, Story_Points_Total: 4588, Total_Test_Cases: 19936, Prod_Defects: 13, Defects_per_1K_TC: 5.22 },
    { Project: "DM – Policy ART", Portfolio: "Data", Domain: "Data", TC_per_Story_Point: 5.43, Defect_Leakage_Pct: 8.60, Story_Points_Total: 5896, Total_Test_Cases: 32006, Prod_Defects: 8, Defects_per_1K_TC: 2.91 },
    { Project: "DM – Pricing and UW ART", Portfolio: "Data", Domain: "Data", TC_per_Story_Point: 0.64, Defect_Leakage_Pct: 0.00, Story_Points_Total: 5889, Total_Test_Cases: 3783, Prod_Defects: 0, Defects_per_1K_TC: 1.85 },
    { Project: "DM – Shared Services ART", Portfolio: "Data", Domain: "Data", TC_per_Story_Point: 0.40, Defect_Leakage_Pct: 0.00, Story_Points_Total: 10891, Total_Test_Cases: 4336, Prod_Defects: 0, Defects_per_1K_TC: 5.30 },
    { Project: "CAS – Billing (Dev) ART", Portfolio: "Shared Solutions", Domain: "BASE", TC_per_Story_Point: 0.55, Defect_Leakage_Pct: 65.79, Story_Points_Total: 10331, Total_Test_Cases: 5692, Prod_Defects: 25, Defects_per_1K_TC: 6.68 },
    { Project: "PICS 2 ART", Portfolio: "Shared Solutions", Domain: "PICS", TC_per_Story_Point: 1.78, Defect_Leakage_Pct: 94.12, Story_Points_Total: 2917.5, Total_Test_Cases: 5188, Prod_Defects: 64, Defects_per_1K_TC: 13.11 },
    { Project: "PICS 3 ART", Portfolio: "Shared Solutions", Domain: "PICS", TC_per_Story_Point: 0.57, Defect_Leakage_Pct: 8.14, Story_Points_Total: 4547, Total_Test_Cases: 2574, Prod_Defects: 14, Defects_per_1K_TC: 66.82 },
    { Project: "FinPAL Loss Dev ART", Portfolio: "Shared Solutions", Domain: "FINPAL", TC_per_Story_Point: 9.56, Defect_Leakage_Pct: 68.75, Story_Points_Total: 1806, Total_Test_Cases: 17272, Prod_Defects: 11, Defects_per_1K_TC: 0.93 },
    { Project: "FPDV – FinPAL Premium ART", Portfolio: "Shared Solutions", Domain: "FINPAL", TC_per_Story_Point: 4.17, Defect_Leakage_Pct: 11.11, Story_Points_Total: 4479, Total_Test_Cases: 18658, Prod_Defects: 2, Defects_per_1K_TC: 0.96 },
    { Project: "PNC CRM ART", Portfolio: "D&S", Domain: "Salesforce CRM", TC_per_Story_Point: 3.14, Defect_Leakage_Pct: 29.41, Story_Points_Total: 966, Total_Test_Cases: 3031, Prod_Defects: 15, Defects_per_1K_TC: 16.83 },
    { Project: "PNC Mobile ART", Portfolio: "D&S", Domain: "P&C Mobile", TC_per_Story_Point: 13.51, Defect_Leakage_Pct: 100.00, Story_Points_Total: 1346, Total_Test_Cases: 18183, Prod_Defects: 3, Defects_per_1K_TC: 0.16 },
    { Project: "Omni Digital ART", Portfolio: "D&S", Domain: "Digital", TC_per_Story_Point: 6.21, Defect_Leakage_Pct: 10.20, Story_Points_Total: 2134, Total_Test_Cases: 13249, Prod_Defects: 10, Defects_per_1K_TC: 7.40 },
    { Project: "Agency Technology ART", Portfolio: "D&S", Domain: "Agency", TC_per_Story_Point: 3.00, Defect_Leakage_Pct: 40.00, Story_Points_Total: 2176, Total_Test_Cases: 6525, Prod_Defects: 8, Defects_per_1K_TC: 3.07 },
    { Project: "New Business Ventures & Innovation ART A", Portfolio: "NBV&I", Domain: "Future of Auto, Innovation", TC_per_Story_Point: 0.52, Defect_Leakage_Pct: 100.00, Story_Points_Total: 742, Total_Test_Cases: 388, Prod_Defects: 3, Defects_per_1K_TC: 7.73 },
    { Project: "New Business Ventures & Innovation ART B", Portfolio: "NBV&I", Domain: "SBI", TC_per_Story_Point: 4.26, Defect_Leakage_Pct: 4.35, Story_Points_Total: 1043, Total_Test_Cases: 4439, Prod_Defects: 5, Defects_per_1K_TC: 25.91 },
    { Project: "New Business Ventures & Innovation ART C", Portfolio: "NBV&I", Domain: "OEM", TC_per_Story_Point: 0.98, Defect_Leakage_Pct: 0.83, Story_Points_Total: 5552, Total_Test_Cases: 5439, Prod_Defects: 2, Defects_per_1K_TC: 44.31 },
    { Project: "New Business Ventures & Innovation ART D", Portfolio: "NBV&I", Domain: "Expanded Distribution, Auto Ecosystem", TC_per_Story_Point: 1.06, Defect_Leakage_Pct: 0.28, Story_Points_Total: 2865, Total_Test_Cases: 3031, Prod_Defects: 1, Defects_per_1K_TC: 115.80 },
    { Project: "ASC Technology ART", Portfolio: "ASC", Domain: "ASC", TC_per_Story_Point: 2.62, Defect_Leakage_Pct: 100.00, Story_Points_Total: 542, Total_Test_Cases: 1422, Prod_Defects: 3, Defects_per_1K_TC: 2.11 }
  ];

  const [selectedPortfolio, setSelectedPortfolio] = useState('All');
  const [efficiencyFilter, setEfficiencyFilter] = useState('all');
  const [bubbleSize, setBubbleSize] = useState('test_cases');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [maxTCRatio, setMaxTCRatio] = useState(15);

  const portfolios = ['All', ...new Set(rawData.map(d => d.Portfolio))];

  const filteredData = useMemo(() => {
    let data = rawData.filter(d => 
      d.Defect_Leakage_Pct !== null && 
      d.TC_per_Story_Point !== null &&
      d.TC_per_Story_Point <= maxTCRatio
    );
    
    if (selectedPortfolio !== 'All') {
      data = data.filter(d => d.Portfolio === selectedPortfolio);
    }
    
    // Add efficiency classification
    data = data.map(d => {
      const highEfficiency = d.TC_per_Story_Point >= 2;
      const lowLeakage = d.Defect_Leakage_Pct <= 15;
      let efficiency;
      if (highEfficiency && lowLeakage) efficiency = 'high-roi';
      else if (highEfficiency && !lowLeakage) efficiency = 'over-tested';
      else if (!highEfficiency && lowLeakage) efficiency = 'lean-effective';
      else efficiency = 'under-tested';
      return { ...d, efficiency };
    });

    if (efficiencyFilter !== 'all') {
      data = data.filter(d => d.efficiency === efficiencyFilter);
    }
    
    return data;
  }, [selectedPortfolio, efficiencyFilter, maxTCRatio]);

  const getBubbleValue = (d) => {
    if (bubbleSize === 'test_cases') return Math.sqrt(d.Total_Test_Cases) * 0.8;
    if (bubbleSize === 'story_points') return Math.sqrt(d.Story_Points_Total) * 2;
    if (bubbleSize === 'prod_defects') return Math.sqrt(d.Prod_Defects + 1) * 20;
    return 200;
  };

  const getPointColor = (efficiency) => {
    switch (efficiency) {
      case 'high-roi': return '#22c55e';
      case 'lean-effective': return '#3b82f6';
      case 'over-tested': return '#f59e0b';
      case 'under-tested': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const summaryStats = useMemo(() => {
    const highROI = filteredData.filter(d => d.efficiency === 'high-roi').length;
    const underTested = filteredData.filter(d => d.efficiency === 'under-tested').length;
    const avgTCRatio = filteredData.reduce((sum, d) => sum + d.TC_per_Story_Point, 0) / filteredData.length;
    const totalTestCases = filteredData.reduce((sum, d) => sum + d.Total_Test_Cases, 0);
    return { highROI, underTested, avgTCRatio, totalTestCases };
  }, [filteredData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg max-w-xs">
          <p className="font-bold text-sm mb-2">{data.Project}</p>
          <div className="text-xs space-y-1">
            <p><span className="font-semibold">Portfolio:</span> {data.Portfolio}</p>
            <p><span className="font-semibold">TC per Story Point:</span> <span className="text-blue-600 font-bold">{data.TC_per_Story_Point.toFixed(2)}</span></p>
            <p><span className="font-semibold">Defect Leakage:</span> <span className="text-red-600 font-bold">{data.Defect_Leakage_Pct.toFixed(1)}%</span></p>
            <p><span className="font-semibold">Total Test Cases:</span> {data.Total_Test_Cases.toLocaleString()}</p>
            <p><span className="font-semibold">Story Points:</span> {data.Story_Points_Total.toLocaleString()}</p>
            <p><span className="font-semibold">Prod Defects:</span> {data.Prod_Defects}</p>
            <p><span className="font-semibold">Defects/1K TC:</span> {data.Defects_per_1K_TC.toFixed(2)}</p>
            <p><span className="font-semibold">Efficiency:</span> 
              <span className={`ml-1 px-2 py-0.5 rounded text-white ${
                data.efficiency === 'high-roi' ? 'bg-green-500' :
                data.efficiency === 'lean-effective' ? 'bg-blue-500' :
                data.efficiency === 'over-tested' ? 'bg-amber-500' : 'bg-red-500'
              }`}>
                {data.efficiency.replace('-', ' ')}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Test Case Efficiency Analysis</h1>
        <p className="text-gray-600">Analyzing the relationship between test case density and defect prevention effectiveness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">High ROI ARTs</p>
          <p className="text-2xl font-bold text-green-600">{summaryStats.highROI}</p>
          <p className="text-xs text-gray-500">High TC ratio, low leakage</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Under-Tested ARTs</p>
          <p className="text-2xl font-bold text-red-600">{summaryStats.underTested}</p>
          <p className="text-xs text-gray-500">Low TC ratio, high leakage</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Avg TC per Story Point</p>
          <p className="text-2xl font-bold text-blue-600">{summaryStats.avgTCRatio.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Total Test Cases</p>
          <p className="text-2xl font-bold text-purple-600">{summaryStats.totalTestCases.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={selectedPortfolio}
              onChange={(e) => setSelectedPortfolio(e.target.value)}
            >
              {portfolios.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Efficiency Category</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={efficiencyFilter}
              onChange={(e) => setEfficiencyFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="high-roi">High ROI</option>
              <option value="lean-effective">Lean & Effective</option>
              <option value="over-tested">Over-Tested</option>
              <option value="under-tested">Under-Tested</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bubble Size</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={bubbleSize}
              onChange={(e) => setBubbleSize(e.target.value)}
            >
              <option value="test_cases">Test Cases</option>
              <option value="story_points">Story Points</option>
              <option value="prod_defects">Prod Defects</option>
              <option value="fixed">Fixed Size</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max TC Ratio</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={maxTCRatio}
              onChange={(e) => setMaxTCRatio(Number(e.target.value))}
            >
              <option value={5}>Up to 5</option>
              <option value={10}>Up to 10</option>
              <option value={15}>Up to 15</option>
              <option value={20}>Up to 20</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              className="w-full p-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
              onClick={() => {
                setSelectedPortfolio('All');
                setEfficiencyFilter('all');
                setBubbleSize('test_cases');
                setMaxTCRatio(15);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="TC_per_Story_Point" 
                domain={[0, maxTCRatio]}
                label={{ value: 'Test Cases per Story Point', position: 'bottom', offset: 40 }}
              />
              <YAxis 
                type="number" 
                dataKey="Defect_Leakage_Pct" 
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
                label={{ value: 'Defect Leakage (%)', angle: -90, position: 'insideLeft', offset: -40 }}
              />
              <ZAxis 
                type="number" 
                dataKey={(d) => getBubbleValue(d)} 
                range={[100, 2000]} 
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={2} stroke="#6b7280" strokeDasharray="5 5" />
              <ReferenceLine y={15} stroke="#6b7280" strokeDasharray="5 5" />
              <Scatter 
                data={filteredData} 
                onClick={(data) => setSelectedPoint(data)}
              >
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getPointColor(entry.efficiency)}
                    fillOpacity={0.7}
                    stroke={getPointColor(entry.efficiency)}
                    strokeWidth={2}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          
          {/* Quadrant Labels */}
          <div className="absolute top-8 left-16 text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
            Lean & Effective
          </div>
          <div className="absolute top-8 right-8 text-xs text-gray-500 bg-green-100 px-2 py-1 rounded font-semibold">
            HIGH ROI
          </div>
          <div className="absolute bottom-20 left-16 text-xs text-gray-500 bg-red-50 px-2 py-1 rounded">
            UNDER-TESTED
          </div>
          <div className="absolute bottom-20 right-8 text-xs text-gray-500 bg-amber-50 px-2 py-1 rounded">
            Over-Tested
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-3">Efficiency Categories</h3>
          <div className="space-y-3 text-sm">
            <div className="p-2 bg-green-50 rounded border-l-4 border-green-500">
              <p className="font-semibold">High ROI (Top Right)</p>
              <p className="text-xs text-gray-600">≥2 TC/SP + ≤15% leakage. Excellent test investment with strong defect prevention.</p>
            </div>
            <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-500">
              <p className="font-semibold">Lean & Effective (Top Left)</p>
              <p className="text-xs text-gray-600">&lt;2 TC/SP + ≤15% leakage. Efficient testing achieving good results with fewer tests.</p>
            </div>
            <div className="p-2 bg-amber-50 rounded border-l-4 border-amber-500">
              <p className="font-semibold">Over-Tested (Bottom Right)</p>
              <p className="text-xs text-gray-600">≥2 TC/SP + &gt;15% leakage. Many tests but poor defect prevention. Review test quality.</p>
            </div>
            <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
              <p className="font-semibold">Under-Tested (Bottom Left)</p>
              <p className="text-xs text-gray-600">&lt;2 TC/SP + &gt;15% leakage. Insufficient testing leading to defects. Increase coverage.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-3">Key Insights</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-gray-700">Optimal Range</p>
              <p className="text-xs text-gray-600">2-5 test cases per story point typically yields the best ROI for defect prevention.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-gray-700">Diminishing Returns</p>
              <p className="text-xs text-gray-600">Beyond 10 TC/SP, additional tests often don't proportionally reduce defect leakage.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-gray-700">Quality vs. Quantity</p>
              <p className="text-xs text-gray-600">High TC ratio with high leakage indicates test quality issues, not volume problems.</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Bubble size represents {
            bubbleSize === 'test_cases' ? 'total test cases' : 
            bubbleSize === 'story_points' ? 'story points' : 
            bubbleSize === 'prod_defects' ? 'production defects' : 'fixed size'
          }</p>
        </div>
      </div>

      {selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedPoint(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">{selectedPoint.Project}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Portfolio:</span> {selectedPoint.Portfolio}</p>
              <p><span className="font-semibold">Domain:</span> {selectedPoint.Domain}</p>
              <p><span className="font-semibold">TC per Story Point:</span> {selectedPoint.TC_per_Story_Point.toFixed(2)}</p>
              <p><span className="font-semibold">Defect Leakage:</span> {selectedPoint.Defect_Leakage_Pct.toFixed(1)}%</p>
              <p><span className="font-semibold">Total Test Cases:</span> {selectedPoint.Total_Test_Cases.toLocaleString()}</p>
              <p><span className="font-semibold">Story Points:</span> {selectedPoint.Story_Points_Total.toLocaleString()}</p>
              <p><span className="font-semibold">Prod Defects:</span> {selectedPoint.Prod_Defects}</p>
              <p><span className="font-semibold">Defects per 1K TC:</span> {selectedPoint.Defects_per_1K_TC.toFixed(2)}</p>
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="font-semibold mb-1">Recommendation:</p>
                <p className="text-xs">
                  {selectedPoint.efficiency === 'high-roi' && 'Excellent testing efficiency. Maintain current practices and consider sharing best practices with other ARTs.'}
                  {selectedPoint.efficiency === 'lean-effective' && 'Efficient testing with good results. Consider if slight increase in test coverage could further reduce risk for critical features.'}
                  {selectedPoint.efficiency === 'over-tested' && 'High test volume but poor defect prevention. Focus on improving test quality, not quantity. Review test design and coverage targeting.'}
                  {selectedPoint.efficiency === 'under-tested' && 'Insufficient test coverage leading to production defects. Prioritize increasing test cases for high-risk areas and critical functionality.'}
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

export default TestCaseEfficiencyChart;
