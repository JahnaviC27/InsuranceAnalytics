import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const QAInvestmentChart = ({ variant = 'card' }) => {
  const isCard = variant === 'card';
  const rawData = [
    { Project: "Auto Insurance Core 1 ART", Portfolio: "Policy Core Systems", Domain: "Auto", Story_Points_Total: 3810, QA_Story_Points: 985, QA_Story_Points_Pct: 25.85, Dev_Story_Points: 2825, Investment_Category: "High", Defect_Leakage_Pct: 9.82 },
    { Project: "Auto Insurance Core 3 ART", Portfolio: "Policy Core Systems", Domain: "Auto", Story_Points_Total: 3913, QA_Story_Points: 1101, QA_Story_Points_Pct: 28.14, Dev_Story_Points: 2812, Investment_Category: "High", Defect_Leakage_Pct: 15.56 },
    { Project: "Auto Insurance Core Platform ART", Portfolio: "Policy Core Systems", Domain: "Auto", Story_Points_Total: 4633, QA_Story_Points: 889, QA_Story_Points_Pct: 19.19, Dev_Story_Points: 3744, Investment_Category: "Low", Defect_Leakage_Pct: 21.43 },
    { Project: "Auto Telematics ART 1", Portfolio: "Policy Core Systems", Domain: "Auto", Story_Points_Total: 5320, QA_Story_Points: 1524, QA_Story_Points_Pct: 28.65, Dev_Story_Points: 3796, Investment_Category: "High", Defect_Leakage_Pct: 31.71 },
    { Project: "USMB ART", Portfolio: "Policy Core Systems", Domain: "Umbrella", Story_Points_Total: 5733, QA_Story_Points: 897, QA_Story_Points_Pct: 15.65, Dev_Story_Points: 4836, Investment_Category: "Low", Defect_Leakage_Pct: 23.75 },
    { Project: "Area 51 ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 5802, QA_Story_Points: 1191, QA_Story_Points_Pct: 20.53, Dev_Story_Points: 4611, Investment_Category: "Optimal", Defect_Leakage_Pct: 16.95 },
    { Project: "C2T P&C ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 353, QA_Story_Points: 116, QA_Story_Points_Pct: 32.86, Dev_Story_Points: 237, Investment_Category: "Very High", Defect_Leakage_Pct: 18.18 },
    { Project: "Mythos ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 5060, QA_Story_Points: 1071, QA_Story_Points_Pct: 21.17, Dev_Story_Points: 3989, Investment_Category: "Optimal", Defect_Leakage_Pct: 30.91 },
    { Project: "Platform (Property) ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 2997, QA_Story_Points: 528, QA_Story_Points_Pct: 17.62, Dev_Story_Points: 2469, Investment_Category: "Low", Defect_Leakage_Pct: null },
    { Project: "Property Formula 1 ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 5234, QA_Story_Points: 303, QA_Story_Points_Pct: 5.79, Dev_Story_Points: 4931, Investment_Category: "Low", Defect_Leakage_Pct: 0.00 },
    { Project: "Think Tankers ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 93, QA_Story_Points: 56, QA_Story_Points_Pct: 60.22, Dev_Story_Points: 37, Investment_Category: "Very High", Defect_Leakage_Pct: 0.00 },
    { Project: "Policy Mod Auto ART", Portfolio: "Policy Modernization", Domain: "Auto", Story_Points_Total: 58879, QA_Story_Points: 6739, QA_Story_Points_Pct: 11.45, Dev_Story_Points: 52140, Investment_Category: "Low", Defect_Leakage_Pct: 1.69 },
    { Project: "P3 – Back to the Future ART", Portfolio: "Policy Modernization", Domain: "P3 (VPP)", Story_Points_Total: 3919, QA_Story_Points: 1751, QA_Story_Points_Pct: 44.68, Dev_Story_Points: 2168, Investment_Category: "Very High", Defect_Leakage_Pct: 1.82 },
    { Project: "DW – Elemental ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Story_Points_Total: 15359, QA_Story_Points: 4152, QA_Story_Points_Pct: 27.03, Dev_Story_Points: 11207, Investment_Category: "High", Defect_Leakage_Pct: 1.51 },
    { Project: "DW – Mythology ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Story_Points_Total: 16091, QA_Story_Points: 5522, QA_Story_Points_Pct: 34.32, Dev_Story_Points: 10569, Investment_Category: "Very High", Defect_Leakage_Pct: 2.88 },
    { Project: "DW – Policy Pirates ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Story_Points_Total: 7092, QA_Story_Points: 1355, QA_Story_Points_Pct: 19.11, Dev_Story_Points: 5737, Investment_Category: "Low", Defect_Leakage_Pct: 5.38 },
    { Project: "DW – Rock 'N Rollouts ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Story_Points_Total: 580, QA_Story_Points: 88, QA_Story_Points_Pct: 15.17, Dev_Story_Points: 492, Investment_Category: "Low", Defect_Leakage_Pct: 0.00 },
    { Project: "Umbrella Mod ART", Portfolio: "Policy Modernization", Domain: "Umbrella", Story_Points_Total: 25558, QA_Story_Points: 6858, QA_Story_Points_Pct: 26.83, Dev_Story_Points: 18700, Investment_Category: "High", Defect_Leakage_Pct: 5.32 },
    { Project: "Claims Modernization Core ART", Portfolio: "Claims", Domain: "Claims", Story_Points_Total: 1760, QA_Story_Points: 2, QA_Story_Points_Pct: 0.11, Dev_Story_Points: 1758, Investment_Category: "Low", Defect_Leakage_Pct: 17.63 },
    { Project: "Claims Modernization PHX ART", Portfolio: "Claims", Domain: "Claims", Story_Points_Total: 4084, QA_Story_Points: 395.5, QA_Story_Points_Pct: 9.68, Dev_Story_Points: 3688.5, Investment_Category: "Low", Defect_Leakage_Pct: 38.95 },
    { Project: "Claims Modernization PTX ART", Portfolio: "Claims", Domain: "Claims", Story_Points_Total: 3748, QA_Story_Points: 213, QA_Story_Points_Pct: 5.68, Dev_Story_Points: 3535, Investment_Category: "Low", Defect_Leakage_Pct: 35.64 },
    { Project: "Claims Modernization SAT ART", Portfolio: "Claims", Domain: "Claims", Story_Points_Total: 5304, QA_Story_Points: 1910, QA_Story_Points_Pct: 36.01, Dev_Story_Points: 3394, Investment_Category: "Very High", Defect_Leakage_Pct: 35.75 },
    { Project: "Claims BAU Core ART", Portfolio: "Claims", Domain: "Claims", Story_Points_Total: 5602, QA_Story_Points: 228, QA_Story_Points_Pct: 4.07, Dev_Story_Points: 5374, Investment_Category: "Low", Defect_Leakage_Pct: null },
    { Project: "DM – Claims ART", Portfolio: "Data", Domain: "Data", Story_Points_Total: 2946, QA_Story_Points: 807, QA_Story_Points_Pct: 27.39, Dev_Story_Points: 2139, Investment_Category: "High", Defect_Leakage_Pct: 46.51 },
    { Project: "DM – Financials and C&R ART", Portfolio: "Data", Domain: "Data", Story_Points_Total: 4588, QA_Story_Points: 791, QA_Story_Points_Pct: 17.24, Dev_Story_Points: 3797, Investment_Category: "Low", Defect_Leakage_Pct: 12.50 },
    { Project: "DM – Policy ART", Portfolio: "Data", Domain: "Data", Story_Points_Total: 5896, QA_Story_Points: 1922, QA_Story_Points_Pct: 32.60, Dev_Story_Points: 3974, Investment_Category: "Very High", Defect_Leakage_Pct: 8.60 },
    { Project: "DM – Pricing and UW ART", Portfolio: "Data", Domain: "Data", Story_Points_Total: 5889, QA_Story_Points: 550, QA_Story_Points_Pct: 9.34, Dev_Story_Points: 5339, Investment_Category: "Low", Defect_Leakage_Pct: 0.00 },
    { Project: "DM – Shared Services ART", Portfolio: "Data", Domain: "Data", Story_Points_Total: 10891, QA_Story_Points: 1010, QA_Story_Points_Pct: 9.27, Dev_Story_Points: 9881, Investment_Category: "Low", Defect_Leakage_Pct: 0.00 },
    { Project: "CAS – Billing (Dev) ART", Portfolio: "Shared Solutions", Domain: "BASE", Story_Points_Total: 10331, QA_Story_Points: 5915, QA_Story_Points_Pct: 57.25, Dev_Story_Points: 4416, Investment_Category: "Very High", Defect_Leakage_Pct: 65.79 },
    { Project: "PICS 2 ART", Portfolio: "Shared Solutions", Domain: "PICS", Story_Points_Total: 2917.5, QA_Story_Points: 851, QA_Story_Points_Pct: 29.17, Dev_Story_Points: 2066.5, Investment_Category: "High", Defect_Leakage_Pct: 94.12 },
    { Project: "PICS 3 ART", Portfolio: "Shared Solutions", Domain: "PICS", Story_Points_Total: 4547, QA_Story_Points: 1592, QA_Story_Points_Pct: 35.01, Dev_Story_Points: 2955, Investment_Category: "Very High", Defect_Leakage_Pct: 8.14 },
    { Project: "FinPAL Loss Dev ART", Portfolio: "Shared Solutions", Domain: "FINPAL", Story_Points_Total: 1806, QA_Story_Points: 1189, QA_Story_Points_Pct: 65.84, Dev_Story_Points: 617, Investment_Category: "Very High", Defect_Leakage_Pct: 68.75 },
    { Project: "FPDV – FinPAL Premium ART", Portfolio: "Shared Solutions", Domain: "FINPAL", Story_Points_Total: 4479, QA_Story_Points: 1157, QA_Story_Points_Pct: 25.83, Dev_Story_Points: 3322, Investment_Category: "High", Defect_Leakage_Pct: 11.11 },
    { Project: "PNC CRM ART", Portfolio: "D&S", Domain: "Salesforce CRM", Story_Points_Total: 966, QA_Story_Points: 730, QA_Story_Points_Pct: 75.57, Dev_Story_Points: 236, Investment_Category: "Very High", Defect_Leakage_Pct: 29.41 },
    { Project: "PNC Salesforce ART", Portfolio: "D&S", Domain: "Salesforce CRM", Story_Points_Total: 2230, QA_Story_Points: 9, QA_Story_Points_Pct: 0.40, Dev_Story_Points: 2221, Investment_Category: "Low", Defect_Leakage_Pct: null },
    { Project: "PNC Mobile ART", Portfolio: "D&S", Domain: "P&C Mobile", Story_Points_Total: 1346, QA_Story_Points: 1055, QA_Story_Points_Pct: 78.38, Dev_Story_Points: 291, Investment_Category: "Very High", Defect_Leakage_Pct: 100.00 },
    { Project: "Omni Digital ART", Portfolio: "D&S", Domain: "Digital", Story_Points_Total: 2134, QA_Story_Points: 551.5, QA_Story_Points_Pct: 25.84, Dev_Story_Points: 1582.5, Investment_Category: "High", Defect_Leakage_Pct: 10.20 },
    { Project: "Agency Technology ART", Portfolio: "D&S", Domain: "Agency", Story_Points_Total: 2176, QA_Story_Points: 351, QA_Story_Points_Pct: 16.13, Dev_Story_Points: 1825, Investment_Category: "Low", Defect_Leakage_Pct: 40.00 },
    { Project: "International Auto ART", Portfolio: "D&S", Domain: "Agency", Story_Points_Total: 1220, QA_Story_Points: 129, QA_Story_Points_Pct: 10.57, Dev_Story_Points: 1091, Investment_Category: "Low", Defect_Leakage_Pct: null },
    { Project: "New Business Ventures & Innovation ART A", Portfolio: "NBV&I", Domain: "Future of Auto, Innovation", Story_Points_Total: 742, QA_Story_Points: 90, QA_Story_Points_Pct: 12.13, Dev_Story_Points: 652, Investment_Category: "Low", Defect_Leakage_Pct: 100.00 },
    { Project: "New Business Ventures & Innovation ART B", Portfolio: "NBV&I", Domain: "SBI", Story_Points_Total: 1043, QA_Story_Points: 504, QA_Story_Points_Pct: 48.32, Dev_Story_Points: 539, Investment_Category: "Very High", Defect_Leakage_Pct: 4.35 },
    { Project: "New Business Ventures & Innovation ART C", Portfolio: "NBV&I", Domain: "OEM", Story_Points_Total: 5552, QA_Story_Points: 741, QA_Story_Points_Pct: 13.35, Dev_Story_Points: 4811, Investment_Category: "Low", Defect_Leakage_Pct: 0.83 },
    { Project: "New Business Ventures & Innovation ART D", Portfolio: "NBV&I", Domain: "Expanded Distribution, Auto Ecosystem", Story_Points_Total: 2865, QA_Story_Points: 533, QA_Story_Points_Pct: 18.60, Dev_Story_Points: 2332, Investment_Category: "Low", Defect_Leakage_Pct: 0.28 },
    { Project: "ASC Technology ART", Portfolio: "ASC", Domain: "ASC", Story_Points_Total: 542, QA_Story_Points: 161, QA_Story_Points_Pct: 29.70, Dev_Story_Points: 381, Investment_Category: "High", Defect_Leakage_Pct: 100.00 }
  ];

  const [selectedPortfolio, setSelectedPortfolio] = useState('All');
  const [selectedInvestment, setSelectedInvestment] = useState('All');
  const [sortBy, setSortBy] = useState('qa_pct');
  const [showTopN, setShowTopN] = useState(15);
  const [selectedART, setSelectedART] = useState(null);

  const portfolios = ['All', ...new Set(rawData.map(d => d.Portfolio))];
  const investmentCategories = ['All', 'Low', 'Optimal', 'High', 'Very High'];

  const filteredData = useMemo(() => {
    let data = [...rawData];
    
    if (selectedPortfolio !== 'All') {
      data = data.filter(d => d.Portfolio === selectedPortfolio);
    }
    if (selectedInvestment !== 'All') {
      data = data.filter(d => d.Investment_Category === selectedInvestment);
    }
    
    if (sortBy === 'qa_pct') {
      data = data.sort((a, b) => b.QA_Story_Points_Pct - a.QA_Story_Points_Pct);
    } else if (sortBy === 'story_points') {
      data = data.sort((a, b) => b.Story_Points_Total - a.Story_Points_Total);
    } else if (sortBy === 'qa_points') {
      data = data.sort((a, b) => b.QA_Story_Points - a.QA_Story_Points);
    }
    
    return data.slice(0, showTopN);
  }, [selectedPortfolio, selectedInvestment, sortBy, showTopN]);

  const getBarColor = (category) => {
    switch (category) {
      case 'Low': return '#ef4444';
      case 'Optimal': return '#22c55e';
      case 'High': return '#3b82f6';
      case 'Very High': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const summaryStats = useMemo(() => {
    const lowCount = filteredData.filter(d => d.Investment_Category === 'Low').length;
    const optimalCount = filteredData.filter(d => d.Investment_Category === 'Optimal').length;
    const avgInvestment = filteredData.reduce((sum, d) => sum + d.QA_Story_Points_Pct, 0) / filteredData.length;
    const totalQAPoints = filteredData.reduce((sum, d) => sum + d.QA_Story_Points, 0);
    return { lowCount, optimalCount, avgInvestment, totalQAPoints };
  }, [filteredData]);

  const CustomYAxisTick = (props) => {
    const { x, y, payload, isCard } = props;
    const label = payload.value;
    const text = isCard && label.length > 26 ? label.slice(0, 26) + '…' : label;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={4} textAnchor="end" fontSize={isCard ? 10 : 11} title={label}>
          {text}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg max-w-xs">
          <p className="font-bold text-sm mb-2">{data.Project}</p>
          <div className="text-xs space-y-1">
            <p><span className="font-semibold">Portfolio:</span> {data.Portfolio}</p>
            <p><span className="font-semibold">Domain:</span> {data.Domain}</p>
            <p><span className="font-semibold">QA Investment:</span> <span className="text-blue-600 font-bold">{data.QA_Story_Points_Pct.toFixed(2)}%</span></p>
            <p><span className="font-semibold">QA Story Points:</span> {data.QA_Story_Points.toLocaleString()}</p>
            <p><span className="font-semibold">Dev Story Points:</span> {data.Dev_Story_Points.toLocaleString()}</p>
            <p><span className="font-semibold">Total Story Points:</span> {data.Story_Points_Total.toLocaleString()}</p>
            {data.Defect_Leakage_Pct !== null && (
              <p><span className="font-semibold">Defect Leakage:</span> {data.Defect_Leakage_Pct.toFixed(2)}%</p>
            )}
            <p><span className="font-semibold">Investment Level:</span> 
              <span className={`ml-1 px-2 py-0.5 rounded text-white ${
                data.Investment_Category === 'Low' ? 'bg-red-500' :
                data.Investment_Category === 'Optimal' ? 'bg-green-500' :
                data.Investment_Category === 'High' ? 'bg-blue-500' : 'bg-purple-500'
              }`}>
                {data.Investment_Category}
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">QA Investment Ratio Analysis</h1>
          <p className="text-gray-600">QA Story Points as percentage of total effort by ART</p>
        </div>
      )}
      {isCard && (
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-gray-800">QA Investment %</h2>
        </div>
      )}

      {!isCard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <p className="text-sm text-gray-600">Under-Invested ARTs</p>
            <p className="text-2xl font-bold text-red-600">{summaryStats.lowCount}</p>
            <p className="text-xs text-gray-500">&lt;20% QA Investment</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Optimal ARTs</p>
            <p className="text-2xl font-bold text-green-600">{summaryStats.optimalCount}</p>
            <p className="text-xs text-gray-500">20-25% QA Investment</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Avg QA Investment</p>
            <p className="text-2xl font-bold text-blue-600">{summaryStats.avgInvestment.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <p className="text-sm text-gray-600">Total QA Points</p>
            <p className="text-2xl font-bold text-purple-600">{summaryStats.totalQAPoints.toLocaleString()}</p>
          </div>
        </div>
      )}

      {isCard ? (
        <div className="mb-2">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <select className="p-1 border rounded" value={selectedPortfolio} onChange={(e) => setSelectedPortfolio(e.target.value)}>
              {portfolios.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select className="p-1 border rounded" value={selectedInvestment} onChange={(e) => setSelectedInvestment(e.target.value)}>
              {investmentCategories.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select className="p-1 border rounded" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="qa_pct">QA %</option>
              <option value="story_points">SP Total</option>
              <option value="qa_points">QA SP</option>
            </select>
            <select className="p-1 border rounded" value={showTopN} onChange={(e) => setShowTopN(Number(e.target.value))}>
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={20}>Top 20</option>
            </select>
            <button className="px-2 py-1 border rounded" onClick={() => { setSelectedPortfolio('All'); setSelectedInvestment('All'); setSortBy('qa_pct'); setShowTopN(15); }}>Reset</button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm" value={selectedPortfolio} onChange={(e) => setSelectedPortfolio(e.target.value)}>
                {portfolios.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Level</label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm" value={selectedInvestment} onChange={(e) => setSelectedInvestment(e.target.value)}>
                {investmentCategories.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="qa_pct">QA Investment %</option>
                <option value="story_points">Total Story Points</option>
                <option value="qa_points">QA Story Points</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Show Top N</label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm" value={showTopN} onChange={(e) => setShowTopN(Number(e.target.value))}>
                <option value={10}>Top 10</option>
                <option value={15}>Top 15</option>
                <option value={20}>Top 20</option>
                <option value={50}>All</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full p-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300" onClick={() => { setSelectedPortfolio('All'); setSelectedInvestment('All'); setSortBy('qa_pct'); setShowTopN(15); }}>Reset Filters</button>
            </div>
          </div>
        </div>
      )}

      <div className={isCard ? "bg-white p-2 rounded-lg shadow mb-3" : "bg-white p-4 rounded-lg shadow mb-6"}>
        <ResponsiveContainer width="100%" height={isCard ? 300 : 420}>
          <BarChart
            data={filteredData}
            layout="horizontal"
            margin={isCard ? { top: 10, right: 16, left: 16, bottom: 80 } : { top: 20, right: 30, left: 30, bottom: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              type="category"
              dataKey="Project"
            />
            <YAxis 
               type="number" 
               domain={[0, 100]}
               tickFormatter={(val) => `${val}%`}
               label={isCard ? undefined : { value: 'QA Story Points Percentage (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '20%', position: 'right', fontSize: 10 }} />
            <ReferenceLine y={25} stroke="#22c55e" strokeDasharray="5 5" label={{ value: '25%', position: 'right', fontSize: 10 }} />
            <ReferenceLine y={30} stroke="#3b82f6" strokeDasharray="5 5" label={{ value: '30%', position: 'right', fontSize: 10 }} />
            <Bar 
              dataKey="QA_Story_Points_Pct" 
              radius={[4, 4, 0, 0]}
              onClick={(data) => setSelectedART(data)}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.Investment_Category)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!isCard && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-3">Investment Categories & Recommendations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-red-50 rounded border border-red-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="font-semibold">Low (&lt;20%)</span>
              </div>
              <p className="text-xs text-gray-600">Under-invested in QA. Consider increasing testing resources.</p>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-semibold">Optimal (20-25%)</span>
              </div>
              <p className="text-xs text-gray-600">Balanced investment. Industry best practice range.</p>
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="font-semibold">High (25-30%)</span>
              </div>
              <p className="text-xs text-gray-600">Strong QA focus. Good for complex/critical systems.</p>
            </div>
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="font-semibold">Very High (&gt;30%)</span>
              </div>
              <p className="text-xs text-gray-600">Heavy QA investment. Review for optimization opportunities.</p>
            </div>
          </div>
        </div>
      )}

      {selectedART && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedART(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">{selectedART.Project}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Portfolio:</span> {selectedART.Portfolio}</p>
              <p><span className="font-semibold">Domain:</span> {selectedART.Domain}</p>
              <p><span className="font-semibold">QA Investment:</span> {selectedART.QA_Story_Points_Pct.toFixed(2)}%</p>
              <p><span className="font-semibold">QA Story Points:</span> {selectedART.QA_Story_Points.toLocaleString()}</p>
              <p><span className="font-semibold">Dev Story Points:</span> {selectedART.Dev_Story_Points.toLocaleString()}</p>
              <p><span className="font-semibold">Total Story Points:</span> {selectedART.Story_Points_Total.toLocaleString()}</p>
              {selectedART.Defect_Leakage_Pct !== null && (
                <p><span className="font-semibold">Defect Leakage:</span> {selectedART.Defect_Leakage_Pct.toFixed(2)}%</p>
              )}
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="font-semibold mb-1">Recommendation:</p>
                <p className="text-xs">
                  {selectedART.Investment_Category === 'Low' && 'Consider increasing QA investment to reduce defect leakage and improve quality outcomes.'}
                  {selectedART.Investment_Category === 'Optimal' && 'Maintain current QA investment level. This is within industry best practice range.'}
                  {selectedART.Investment_Category === 'High' && 'Good QA focus. Monitor defect metrics to ensure ROI on testing investment.'}
                  {selectedART.Investment_Category === 'Very High' && 'Review for optimization opportunities. Consider test automation to improve efficiency.'}
                </p>
              </div>
            </div>
            <button 
              className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelectedART(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QAInvestmentChart;
