import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell, ReferenceLine, ReferenceArea } from 'recharts';

const ROIQuadrantChart = () => {
  const rawData = [
    { Project: "Auto Insurance Core 1 ART", Portfolio: "Policy Core Systems", Domain: "Auto", QA_Story_Points_Pct: 25.85, Defect_Leakage_Pct: 9.82, Story_Points_Total: 3810, Prod_Defects: 16, Cost_Avoidance_Hours: 320, Total_Test_Cases: 6346 },
    { Project: "Auto Insurance Core 3 ART", Portfolio: "Policy Core Systems", Domain: "Auto", QA_Story_Points_Pct: 28.14, Defect_Leakage_Pct: 15.56, Story_Points_Total: 3913, Prod_Defects: 7, Cost_Avoidance_Hours: 140, Total_Test_Cases: 4094 },
    { Project: "Auto Insurance Core Platform ART", Portfolio: "Policy Core Systems", Domain: "Auto", QA_Story_Points_Pct: 19.19, Defect_Leakage_Pct: 21.43, Story_Points_Total: 4633, Prod_Defects: 3, Cost_Avoidance_Hours: 60, Total_Test_Cases: 1589 },
    { Project: "Auto Telematics ART 1", Portfolio: "Policy Core Systems", Domain: "Auto", QA_Story_Points_Pct: 28.65, Defect_Leakage_Pct: 31.71, Story_Points_Total: 5320, Prod_Defects: 26, Cost_Avoidance_Hours: 520, Total_Test_Cases: 10637 },
    { Project: "USMB ART", Portfolio: "Policy Core Systems", Domain: "Umbrella", QA_Story_Points_Pct: 15.65, Defect_Leakage_Pct: 23.75, Story_Points_Total: 5733, Prod_Defects: 19, Cost_Avoidance_Hours: 380, Total_Test_Cases: 5571 },
    { Project: "Area 51 ART", Portfolio: "Policy Core Systems", Domain: "Property", QA_Story_Points_Pct: 20.53, Defect_Leakage_Pct: 16.95, Story_Points_Total: 5802, Prod_Defects: 10, Cost_Avoidance_Hours: 200, Total_Test_Cases: 5542 },
    { Project: "C2T P&C ART", Portfolio: "Policy Core Systems", Domain: "Property", QA_Story_Points_Pct: 32.86, Defect_Leakage_Pct: 18.18, Story_Points_Total: 353, Prod_Defects: 44, Cost_Avoidance_Hours: 880, Total_Test_Cases: 2208 },
    { Project: "Mythos ART", Portfolio: "Policy Core Systems", Domain: "Property", QA_Story_Points_Pct: 21.17, Defect_Leakage_Pct: 30.91, Story_Points_Total: 5060, Prod_Defects: 34, Cost_Avoidance_Hours: 680, Total_Test_Cases: 5720 },
    { Project: "Property Formula 1 ART", Portfolio: "Policy Core Systems", Domain: "Property", QA_Story_Points_Pct: 5.79, Defect_Leakage_Pct: 0.00, Story_Points_Total: 5234, Prod_Defects: 0, Cost_Avoidance_Hours: 0, Total_Test_Cases: 1248 },
    { Project: "Think Tankers ART", Portfolio: "Policy Core Systems", Domain: "Property", QA_Story_Points_Pct: 60.22, Defect_Leakage_Pct: 0.00, Story_Points_Total: 93, Prod_Defects: 0, Cost_Avoidance_Hours: 0, Total_Test_Cases: 73 },
    { Project: "Policy Mod Auto ART", Portfolio: "Policy Modernization", Domain: "Auto", QA_Story_Points_Pct: 11.45, Defect_Leakage_Pct: 1.69, Story_Points_Total: 58879, Prod_Defects: 41, Cost_Avoidance_Hours: 820, Total_Test_Cases: 122522 },
    { Project: "P3 – Back to the Future ART", Portfolio: "Policy Modernization", Domain: "P3 (VPP)", QA_Story_Points_Pct: 44.68, Defect_Leakage_Pct: 1.82, Story_Points_Total: 3919, Prod_Defects: 7, Cost_Avoidance_Hours: 140, Total_Test_Cases: 37274 },
    { Project: "DW – Elemental ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", QA_Story_Points_Pct: 27.03, Defect_Leakage_Pct: 1.51, Story_Points_Total: 15359, Prod_Defects: 13, Cost_Avoidance_Hours: 260, Total_Test_Cases: 61599 },
    { Project: "DW – Mythology ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", QA_Story_Points_Pct: 34.32, Defect_Leakage_Pct: 2.88, Story_Points_Total: 16091, Prod_Defects: 10, Cost_Avoidance_Hours: 200, Total_Test_Cases: 151216 },
    { Project: "DW – Policy Pirates ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", QA_Story_Points_Pct: 19.11, Defect_Leakage_Pct: 5.38, Story_Points_Total: 7092, Prod_Defects: 10, Cost_Avoidance_Hours: 200, Total_Test_Cases: 9055 },
    { Project: "DW – Rock 'N Rollouts ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", QA_Story_Points_Pct: 15.17, Defect_Leakage_Pct: 0.00, Story_Points_Total: 580, Prod_Defects: 0, Cost_Avoidance_Hours: 0, Total_Test_Cases: 362 },
    { Project: "Umbrella Mod ART", Portfolio: "Policy Modernization", Domain: "Umbrella", QA_Story_Points_Pct: 26.83, Defect_Leakage_Pct: 5.32, Story_Points_Total: 25558, Prod_Defects: 59, Cost_Avoidance_Hours: 1180, Total_Test_Cases: 5571 },
    { Project: "Claims Modernization Core ART", Portfolio: "Claims", Domain: "Claims", QA_Story_Points_Pct: 0.11, Defect_Leakage_Pct: 17.63, Story_Points_Total: 1760, Prod_Defects: 58, Cost_Avoidance_Hours: 1160, Total_Test_Cases: 1 },
    { Project: "Claims Modernization PHX ART", Portfolio: "Claims", Domain: "Claims", QA_Story_Points_Pct: 9.68, Defect_Leakage_Pct: 38.95, Story_Points_Total: 4084, Prod_Defects: 67, Cost_Avoidance_Hours: 1340, Total_Test_Cases: 10036 },
    { Project: "Claims Modernization PTX ART", Portfolio: "Claims", Domain: "Claims", QA_Story_Points_Pct: 5.68, Defect_Leakage_Pct: 35.64, Story_Points_Total: 3748, Prod_Defects: 67, Cost_Avoidance_Hours: 1340, Total_Test_Cases: 3941 },
    { Project: "Claims Modernization SAT ART", Portfolio: "Claims", Domain: "Claims", QA_Story_Points_Pct: 36.01, Defect_Leakage_Pct: 35.75, Story_Points_Total: 5304, Prod_Defects: 69, Cost_Avoidance_Hours: 1380, Total_Test_Cases: 38581 },
    { Project: "DM – Claims ART", Portfolio: "Data", Domain: "Data", QA_Story_Points_Pct: 27.39, Defect_Leakage_Pct: 46.51, Story_Points_Total: 2946, Prod_Defects: 40, Cost_Avoidance_Hours: 800, Total_Test_Cases: 1434 },
    { Project: "DM – Financials and C&R ART", Portfolio: "Data", Domain: "Data", QA_Story_Points_Pct: 17.24, Defect_Leakage_Pct: 12.50, Story_Points_Total: 4588, Prod_Defects: 13, Cost_Avoidance_Hours: 260, Total_Test_Cases: 19936 },
    { Project: "DM – Policy ART", Portfolio: "Data", Domain: "Data", QA_Story_Points_Pct: 32.60, Defect_Leakage_Pct: 8.60, Story_Points_Total: 5896, Prod_Defects: 8, Cost_Avoidance_Hours: 160, Total_Test_Cases: 32006 },
    { Project: "DM – Pricing and UW ART", Portfolio: "Data", Domain: "Data", QA_Story_Points_Pct: 9.34, Defect_Leakage_Pct: 0.00, Story_Points_Total: 5889, Prod_Defects: 0, Cost_Avoidance_Hours: 0, Total_Test_Cases: 3783 },
    { Project: "DM – Shared Services ART", Portfolio: "Data", Domain: "Data", QA_Story_Points_Pct: 9.27, Defect_Leakage_Pct: 0.00, Story_Points_Total: 10891, Prod_Defects: 0, Cost_Avoidance_Hours: 0, Total_Test_Cases: 4336 },
    { Project: "CAS – Billing (Dev) ART", Portfolio: "Shared Solutions", Domain: "BASE", QA_Story_Points_Pct: 57.25, Defect_Leakage_Pct: 65.79, Story_Points_Total: 10331, Prod_Defects: 25, Cost_Avoidance_Hours: 500, Total_Test_Cases: 5692 },
    { Project: "PICS 2 ART", Portfolio: "Shared Solutions", Domain: "PICS", QA_Story_Points_Pct: 29.17, Defect_Leakage_Pct: 94.12, Story_Points_Total: 2917.5, Prod_Defects: 64, Cost_Avoidance_Hours: 1280, Total_Test_Cases: 5188 },
    { Project: "PICS 3 ART", Portfolio: "Shared Solutions", Domain: "PICS", QA_Story_Points_Pct: 35.01, Defect_Leakage_Pct: 8.14, Story_Points_Total: 4547, Prod_Defects: 14, Cost_Avoidance_Hours: 280, Total_Test_Cases: 2574 },
    { Project: "FinPAL Loss Dev ART", Portfolio: "Shared Solutions", Domain: "FINPAL", QA_Story_Points_Pct: 65.84, Defect_Leakage_Pct: 68.75, Story_Points_Total: 1806, Prod_Defects: 11, Cost_Avoidance_Hours: 220, Total_Test_Cases: 17272 },
    { Project: "FPDV – FinPAL Premium ART", Portfolio: "Shared Solutions", Domain: "FINPAL", QA_Story_Points_Pct: 25.83, Defect_Leakage_Pct: 11.11, Story_Points_Total: 4479, Prod_Defects: 2, Cost_Avoidance_Hours: 40, Total_Test_Cases: 18658 },
    { Project: "PNC CRM ART", Portfolio: "D&S", Domain: "Salesforce CRM", QA_Story_Points_Pct: 75.57, Defect_Leakage_Pct: 29.41, Story_Points_Total: 966, Prod_Defects: 15, Cost_Avoidance_Hours: 300, Total_Test_Cases: 3031 },
    { Project: "PNC Mobile ART", Portfolio: "D&S", Domain: "P&C Mobile", QA_Story_Points_Pct: 78.38, Defect_Leakage_Pct: 100.00, Story_Points_Total: 1346, Prod_Defects: 3, Cost_Avoidance_Hours: 60, Total_Test_Cases: 18183 },
    { Project: "Omni Digital ART", Portfolio: "D&S", Domain: "Digital", QA_Story_Points_Pct: 25.84, Defect_Leakage_Pct: 10.20, Story_Points_Total: 2134, Prod_Defects: 10, Cost_Avoidance_Hours: 200, Total_Test_Cases: 13249 },
    { Project: "Agency Technology ART", Portfolio: "D&S", Domain: "Agency", QA_Story_Points_Pct: 16.13, Defect_Leakage_Pct: 40.00, Story_Points_Total: 2176, Prod_Defects: 8, Cost_Avoidance_Hours: 160, Total_Test_Cases: 6525 },
    { Project: "New Business Ventures & Innovation ART A", Portfolio: "NBV&I", Domain: "Future of Auto, Innovation", QA_Story_Points_Pct: 12.13, Defect_Leakage_Pct: 100.00, Story_Points_Total: 742, Prod_Defects: 3, Cost_Avoidance_Hours: 60, Total_Test_Cases: 388 },
    { Project: "New Business Ventures & Innovation ART B", Portfolio: "NBV&I", Domain: "SBI", QA_Story_Points_Pct: 48.32, Defect_Leakage_Pct: 4.35, Story_Points_Total: 1043, Prod_Defects: 5, Cost_Avoidance_Hours: 100, Total_Test_Cases: 4439 },
    { Project: "New Business Ventures & Innovation ART C", Portfolio: "NBV&I", Domain: "OEM", QA_Story_Points_Pct: 13.35, Defect_Leakage_Pct: 0.83, Story_Points_Total: 5552, Prod_Defects: 2, Cost_Avoidance_Hours: 40, Total_Test_Cases: 5439 },
    { Project: "New Business Ventures & Innovation ART D", Portfolio: "NBV&I", Domain: "Expanded Distribution, Auto Ecosystem", QA_Story_Points_Pct: 18.60, Defect_Leakage_Pct: 0.28, Story_Points_Total: 2865, Prod_Defects: 1, Cost_Avoidance_Hours: 20, Total_Test_Cases: 3031 },
    { Project: "ASC Technology ART", Portfolio: "ASC", Domain: "ASC", QA_Story_Points_Pct: 29.70, Defect_Leakage_Pct: 100.00, Story_Points_Total: 542, Prod_Defects: 3, Cost_Avoidance_Hours: 60, Total_Test_Cases: 1422 }
  ];

  const [selectedPortfolio, setSelectedPortfolio] = useState('All');
  const [selectedQuadrant, setSelectedQuadrant] = useState('all');
  const [bubbleSize, setBubbleSize] = useState('story_points');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [investmentThreshold, setInvestmentThreshold] = useState(26);
  const [leakageThreshold, setLeakageThreshold] = useState(15);

  const portfolios = ['All', ...new Set(rawData.map(d => d.Portfolio))];

  const filteredData = useMemo(() => {
    let data = rawData.filter(d => d.Defect_Leakage_Pct !== null);
    
    if (selectedPortfolio !== 'All') {
      data = data.filter(d => d.Portfolio === selectedPortfolio);
    }
    
    // Add quadrant classification based on thresholds
    data = data.map(d => {
      const highInvestment = d.QA_Story_Points_Pct >= investmentThreshold;
      const lowLeakage = d.Defect_Leakage_Pct <= leakageThreshold;
      let quadrant, roiCategory;
      
      if (!highInvestment && lowLeakage) {
        quadrant = 'efficient';
        roiCategory = 'High ROI - Lean';
      } else if (highInvestment && lowLeakage) {
        quadrant = 'optimal';
        roiCategory = 'Good ROI - Balanced';
      } else if (!highInvestment && !lowLeakage) {
        quadrant = 'underinvested';
        roiCategory = 'Poor ROI - Under-invested';
      } else {
        quadrant = 'overinvested';
        roiCategory = 'Low ROI - Over-invested';
      }
      
      return { ...d, quadrant, roiCategory };
    });

    if (selectedQuadrant !== 'all') {
      data = data.filter(d => d.quadrant === selectedQuadrant);
    }
    
    return data;
  }, [selectedPortfolio, selectedQuadrant, investmentThreshold, leakageThreshold]);

  const getBubbleValue = (d) => {
    if (bubbleSize === 'story_points') return Math.sqrt(d.Story_Points_Total) * 2;
    if (bubbleSize === 'prod_defects') return Math.sqrt(d.Prod_Defects + 1) * 25;
    if (bubbleSize === 'cost_avoidance') return Math.sqrt(d.Cost_Avoidance_Hours + 1) * 3;
    return 300;
  };

  const getPointColor = (quadrant) => {
    switch (quadrant) {
      case 'efficient': return '#22c55e';
      case 'optimal': return '#3b82f6';
      case 'underinvested': return '#ef4444';
      case 'overinvested': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const summaryStats = useMemo(() => {
    const efficient = filteredData.filter(d => d.quadrant === 'efficient').length;
    const optimal = filteredData.filter(d => d.quadrant === 'optimal').length;
    const underinvested = filteredData.filter(d => d.quadrant === 'underinvested').length;
    const overinvested = filteredData.filter(d => d.quadrant === 'overinvested').length;
    
    const totalCostAvoidance = filteredData.reduce((sum, d) => sum + d.Cost_Avoidance_Hours, 0);
    const atRiskDefects = filteredData
      .filter(d => d.quadrant === 'underinvested' || d.quadrant === 'overinvested')
      .reduce((sum, d) => sum + d.Prod_Defects, 0);
    
    return { efficient, optimal, underinvested, overinvested, totalCostAvoidance, atRiskDefects };
  }, [filteredData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg max-w-xs">
          <p className="font-bold text-sm mb-2">{data.Project}</p>
          <div className="text-xs space-y-1">
            <p><span className="font-semibold">Portfolio:</span> {data.Portfolio}</p>
            <p><span className="font-semibold">QA Investment:</span> <span className="text-blue-600 font-bold">{data.QA_Story_Points_Pct.toFixed(1)}%</span></p>
            <p><span className="font-semibold">Defect Leakage:</span> <span className="text-red-600 font-bold">{data.Defect_Leakage_Pct.toFixed(1)}%</span></p>
            <p><span className="font-semibold">Story Points:</span> {data.Story_Points_Total.toLocaleString()}</p>
            <p><span className="font-semibold">Prod Defects:</span> {data.Prod_Defects}</p>
            <p><span className="font-semibold">Cost Avoidance:</span> {data.Cost_Avoidance_Hours} hrs</p>
            <p><span className="font-semibold">ROI Category:</span> 
              <span className={`ml-1 px-2 py-0.5 rounded text-white text-xs ${
                data.quadrant === 'efficient' ? 'bg-green-500' :
                data.quadrant === 'optimal' ? 'bg-blue-500' :
                data.quadrant === 'underinvested' ? 'bg-red-500' : 'bg-amber-500'
              }`}>
                {data.roiCategory}
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ROI Quadrant Analysis</h1>
        <p className="text-gray-600">Strategic view of QA investment efficiency and optimization opportunities</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-xs text-gray-600">High ROI (Lean)</p>
          <p className="text-xl font-bold text-green-600">{summaryStats.efficient}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-xs text-gray-600">Good ROI (Balanced)</p>
          <p className="text-xl font-bold text-blue-600">{summaryStats.optimal}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-xs text-gray-600">Under-invested</p>
          <p className="text-xl font-bold text-red-600">{summaryStats.underinvested}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-amber-500">
          <p className="text-xs text-gray-600">Over-invested</p>
          <p className="text-xl font-bold text-amber-600">{summaryStats.overinvested}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-xs text-gray-600">Cost Avoidance</p>
          <p className="text-xl font-bold text-purple-600">{(summaryStats.totalCostAvoidance/1000).toFixed(1)}K hrs</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow border-l-4 border-pink-500">
          <p className="text-xs text-gray-600">At-Risk Defects</p>
          <p className="text-xl font-bold text-pink-600">{summaryStats.atRiskDefects}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Quadrant Filter</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={selectedQuadrant}
              onChange={(e) => setSelectedQuadrant(e.target.value)}
            >
              <option value="all">All Quadrants</option>
              <option value="efficient">High ROI (Lean)</option>
              <option value="optimal">Good ROI (Balanced)</option>
              <option value="underinvested">Under-invested</option>
              <option value="overinvested">Over-invested</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bubble Size</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={bubbleSize}
              onChange={(e) => setBubbleSize(e.target.value)}
            >
              <option value="story_points">Story Points</option>
              <option value="prod_defects">Prod Defects</option>
              <option value="cost_avoidance">Cost Avoidance</option>
              <option value="fixed">Fixed Size</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Investment Threshold</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={investmentThreshold}
              onChange={(e) => setInvestmentThreshold(Number(e.target.value))}
            >
              <option value={20}>20%</option>
              <option value={25}>25%</option>
              <option value={26}>26% (Median)</option>
              <option value={30}>30%</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leakage Threshold</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={leakageThreshold}
              onChange={(e) => setLeakageThreshold(Number(e.target.value))}
            >
              <option value={10}>10%</option>
              <option value={15}>15%</option>
              <option value={20}>20%</option>
              <option value={25}>25%</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              className="w-full p-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
              onClick={() => {
                setSelectedPortfolio('All');
                setSelectedQuadrant('all');
                setBubbleSize('story_points');
                setInvestmentThreshold(26);
                setLeakageThreshold(15);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <ResponsiveContainer width="100%" height={550}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              
              {/* Quadrant background colors */}
              <ReferenceArea x1={0} x2={investmentThreshold} y1={0} y2={leakageThreshold} fill="#dcfce7" fillOpacity={0.5} />
              <ReferenceArea x1={investmentThreshold} x2={100} y1={0} y2={leakageThreshold} fill="#dbeafe" fillOpacity={0.5} />
              <ReferenceArea x1={0} x2={investmentThreshold} y1={leakageThreshold} y2={100} fill="#fee2e2" fillOpacity={0.5} />
              <ReferenceArea x1={investmentThreshold} x2={100} y1={leakageThreshold} y2={100} fill="#fef3c7" fillOpacity={0.5} />
              
              <XAxis 
                type="number" 
                dataKey="QA_Story_Points_Pct" 
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
                label={{ value: 'QA Investment (% of Story Points)', position: 'bottom', offset: 40 }}
              />
              <YAxis 
                type="number" 
                dataKey="Defect_Leakage_Pct" 
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
                label={{ value: 'Production Defect Leakage (%)', angle: -90, position: 'insideLeft', offset: -40 }}
              />
              <ZAxis 
                type="number" 
                dataKey={(d) => getBubbleValue(d)} 
                range={[100, 2000]} 
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={investmentThreshold} stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />
              <ReferenceLine y={leakageThreshold} stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />
              <Scatter 
                data={filteredData} 
                onClick={(data) => setSelectedPoint(data)}
              >
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getPointColor(entry.quadrant)}
                    fillOpacity={0.7}
                    stroke={getPointColor(entry.quadrant)}
                    strokeWidth={2}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          
          {/* Quadrant Labels */}
          <div className="absolute top-8 left-20 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
            HIGH ROI - LEAN
          </div>
          <div className="absolute top-8 right-12 text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">
            GOOD ROI - BALANCED
          </div>
          <div className="absolute bottom-24 left-20 text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">
            POOR ROI - UNDER-INVESTED
          </div>
          <div className="absolute bottom-24 right-12 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded">
            LOW ROI - OVER-INVESTED
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-3">Quadrant Strategies</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
              <p className="font-semibold text-green-800">High ROI - Lean (Top Left)</p>
              <p className="text-xs text-gray-600">Low investment, low leakage. Excellent efficiency! Share best practices. Monitor for technical debt.</p>
            </div>
            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
              <p className="font-semibold text-blue-800">Good ROI - Balanced (Top Right)</p>
              <p className="text-xs text-gray-600">Higher investment with quality results. Standard operating model. Optimize where possible.</p>
            </div>
            <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
              <p className="font-semibold text-red-800">Poor ROI - Under-invested (Bottom Left)</p>
              <p className="text-xs text-gray-600">Low investment causing defects. Increase QA resources. Priority for improvement.</p>
            </div>
            <div className="p-3 bg-amber-50 rounded border-l-4 border-amber-500">
              <p className="font-semibold text-amber-800">Low ROI - Over-invested (Bottom Right)</p>
              <p className="text-xs text-gray-600">High investment but still leaking defects. Review test effectiveness and quality.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-3">Optimization Actions</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-gray-700">Under-invested ARTs</p>
              <p className="text-xs text-gray-600">
                {summaryStats.underinvested > 0 
                  ? `${summaryStats.underinvested} ARTs need increased QA investment. Potential to prevent ~${Math.round(summaryStats.atRiskDefects * 0.4)} defects with targeted improvement.`
                  : 'No ARTs in this category with current filters.'
                }
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-gray-700">Over-invested ARTs</p>
              <p className="text-xs text-gray-600">
                {summaryStats.overinvested > 0 
                  ? `${summaryStats.overinvested} ARTs may benefit from test optimization. Focus on test quality over quantity.`
                  : 'No ARTs in this category with current filters.'
                }
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-gray-700">Cost Avoidance Potential</p>
              <p className="text-xs text-gray-600">
                Current cost avoidance: {summaryStats.totalCostAvoidance.toLocaleString()} hours. 
                Moving all ARTs to optimal quadrant could save additional ~{Math.round(summaryStats.atRiskDefects * 20)} hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-800 mb-3">Chart Legend</h3>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>High ROI - Lean</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Good ROI - Balanced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Poor ROI - Under-invested</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
            <span>Low ROI - Over-invested</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Bubble size represents {
            bubbleSize === 'story_points' ? 'total story points' : 
            bubbleSize === 'prod_defects' ? 'production defects' : 
            bubbleSize === 'cost_avoidance' ? 'cost avoidance hours' : 'fixed size'
          }. 
          Thresholds: Investment at {investmentThreshold}%, Leakage at {leakageThreshold}%.
        </p>
      </div>

      {/* Detail Modal */}
      {selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedPoint(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">{selectedPoint.Project}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Portfolio:</span> {selectedPoint.Portfolio}</p>
              <p><span className="font-semibold">Domain:</span> {selectedPoint.Domain}</p>
              <p><span className="font-semibold">QA Investment:</span> {selectedPoint.QA_Story_Points_Pct.toFixed(1)}%</p>
              <p><span className="font-semibold">Defect Leakage:</span> {selectedPoint.Defect_Leakage_Pct.toFixed(1)}%</p>
              <p><span className="font-semibold">Story Points:</span> {selectedPoint.Story_Points_Total.toLocaleString()}</p>
              <p><span className="font-semibold">Test Cases:</span> {selectedPoint.Total_Test_Cases.toLocaleString()}</p>
              <p><span className="font-semibold">Prod Defects:</span> {selectedPoint.Prod_Defects}</p>
              <p><span className="font-semibold">Cost Avoidance:</span> {selectedPoint.Cost_Avoidance_Hours} hours</p>
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="font-semibold mb-1">Strategic Recommendation:</p>
                <p className="text-xs">
                  {selectedPoint.quadrant === 'efficient' && 'Excellent efficiency! This ART achieves low defect leakage with lean QA investment. Document and share practices with other teams. Monitor for potential technical debt accumulation.'}
                  {selectedPoint.quadrant === 'optimal' && 'Well-balanced approach with good ROI. Maintain current investment level while looking for optimization opportunities through test automation or improved test design.'}
                  {selectedPoint.quadrant === 'underinvested' && 'Critical: Insufficient QA investment is causing production defects. Recommend immediate increase in testing resources, particularly in risk-based testing and automation coverage.'}
                  {selectedPoint.quadrant === 'overinvested' && 'High QA investment not preventing defects effectively. Focus on improving test quality rather than quantity. Review test design, coverage targeting, and defect root cause analysis.'}
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

export default ROIQuadrantChart;
