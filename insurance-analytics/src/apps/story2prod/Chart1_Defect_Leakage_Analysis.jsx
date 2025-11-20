import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const DefectLeakageChart = ({ variant = 'card' }) => {
  const isCard = variant === 'card';
  const rawData = [
    { Project: "Auto Insurance Core 1 ART", Portfolio: "Policy Core Systems", Domain: "Auto", Story_Points_Total: 3810, Defect_Leakage_Pct: 9.82, Prod_Defects: 16, Quality_Category: "Excellent", Total_Test_Cases: 6346 },
    { Project: "Auto Insurance Core 3 ART", Portfolio: "Policy Core Systems", Domain: "Auto", Story_Points_Total: 3913, Defect_Leakage_Pct: 15.56, Prod_Defects: 7, Quality_Category: "Acceptable", Total_Test_Cases: 4094 },
    { Project: "Auto Insurance Core Platform ART", Portfolio: "Policy Core Systems", Domain: "Auto", Story_Points_Total: 4633, Defect_Leakage_Pct: 21.43, Prod_Defects: 3, Quality_Category: "Critical", Total_Test_Cases: 1589 },
    { Project: "Auto Telematics ART 1", Portfolio: "Policy Core Systems", Domain: "Auto", Story_Points_Total: 5320, Defect_Leakage_Pct: 31.71, Prod_Defects: 26, Quality_Category: "Critical", Total_Test_Cases: 10637 },
    { Project: "USMB ART", Portfolio: "Policy Core Systems", Domain: "Umbrella", Story_Points_Total: 5733, Defect_Leakage_Pct: 23.75, Prod_Defects: 19, Quality_Category: "Critical", Total_Test_Cases: 5571 },
    { Project: "Area 51 ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 5802, Defect_Leakage_Pct: 16.95, Prod_Defects: 10, Quality_Category: "Acceptable", Total_Test_Cases: 5542 },
    { Project: "C2T P&C ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 353, Defect_Leakage_Pct: 18.18, Prod_Defects: 44, Quality_Category: "Acceptable", Total_Test_Cases: 2208 },
    { Project: "Mythos ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 5060, Defect_Leakage_Pct: 30.91, Prod_Defects: 34, Quality_Category: "Critical", Total_Test_Cases: 5720 },
    { Project: "Property Formula 1 ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 5234, Defect_Leakage_Pct: 0.00, Prod_Defects: 0, Quality_Category: "Excellent", Total_Test_Cases: 1248 },
    { Project: "Think Tankers ART", Portfolio: "Policy Core Systems", Domain: "Property", Story_Points_Total: 93, Defect_Leakage_Pct: 0.00, Prod_Defects: 0, Quality_Category: "Excellent", Total_Test_Cases: 73 },
    { Project: "Policy Mod Auto ART", Portfolio: "Policy Modernization", Domain: "Auto", Story_Points_Total: 58879, Defect_Leakage_Pct: 1.69, Prod_Defects: 41, Quality_Category: "Excellent", Total_Test_Cases: 122522 },
    { Project: "P3 – Back to the Future ART", Portfolio: "Policy Modernization", Domain: "P3 (VPP)", Story_Points_Total: 3919, Defect_Leakage_Pct: 1.82, Prod_Defects: 7, Quality_Category: "Excellent", Total_Test_Cases: 37274 },
    { Project: "DW – Elemental ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Story_Points_Total: 15359, Defect_Leakage_Pct: 1.51, Prod_Defects: 13, Quality_Category: "Excellent", Total_Test_Cases: 61599 },
    { Project: "DW – Mythology ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Story_Points_Total: 16091, Defect_Leakage_Pct: 2.88, Prod_Defects: 10, Quality_Category: "Excellent", Total_Test_Cases: 151216 },
    { Project: "DW – Policy Pirates ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Story_Points_Total: 7092, Defect_Leakage_Pct: 5.38, Prod_Defects: 10, Quality_Category: "Excellent", Total_Test_Cases: 9055 },
    { Project: "DW – Rock 'N Rollouts ART", Portfolio: "Policy Modernization", Domain: "Dwelling (HOM, RPI, RP)", Story_Points_Total: 580, Defect_Leakage_Pct: 0.00, Prod_Defects: 0, Quality_Category: "Excellent", Total_Test_Cases: 362 },
    { Project: "Umbrella Mod ART", Portfolio: "Policy Modernization", Domain: "Umbrella", Story_Points_Total: 25558, Defect_Leakage_Pct: 5.32, Prod_Defects: 59, Quality_Category: "Excellent", Total_Test_Cases: 5571 },
    { Project: "Claims Modernization Core ART", Portfolio: "Claims", Domain: "Claims", Story_Points_Total: 1760, Defect_Leakage_Pct: 17.63, Prod_Defects: 58, Quality_Category: "Acceptable", Total_Test_Cases: 1 },
    { Project: "Claims Modernization PHX ART", Portfolio: "Claims", Domain: "Claims", Story_Points_Total: 4084, Defect_Leakage_Pct: 38.95, Prod_Defects: 67, Quality_Category: "Critical", Total_Test_Cases: 10036 },
    { Project: "Claims Modernization PTX ART", Portfolio: "Claims", Domain: "Claims", Story_Points_Total: 3748, Defect_Leakage_Pct: 35.64, Prod_Defects: 67, Quality_Category: "Critical", Total_Test_Cases: 3941 },
    { Project: "Claims Modernization SAT ART", Portfolio: "Claims", Domain: "Claims", Story_Points_Total: 5304, Defect_Leakage_Pct: 35.75, Prod_Defects: 69, Quality_Category: "Critical", Total_Test_Cases: 38581 },
    { Project: "DM – Claims ART", Portfolio: "Data", Domain: "Data", Story_Points_Total: 2946, Defect_Leakage_Pct: 46.51, Prod_Defects: 40, Quality_Category: "Critical", Total_Test_Cases: 1434 },
    { Project: "DM – Financials and C&R ART", Portfolio: "Data", Domain: "Data", Story_Points_Total: 4588, Defect_Leakage_Pct: 12.50, Prod_Defects: 13, Quality_Category: "Good", Total_Test_Cases: 19936 },
    { Project: "DM – Policy ART", Portfolio: "Data", Domain: "Data", Story_Points_Total: 5896, Defect_Leakage_Pct: 8.60, Prod_Defects: 8, Quality_Category: "Excellent", Total_Test_Cases: 32006 },
    { Project: "DM – Pricing and UW ART", Portfolio: "Data", Domain: "Data", Story_Points_Total: 5889, Defect_Leakage_Pct: 0.00, Prod_Defects: 0, Quality_Category: "Excellent", Total_Test_Cases: 3783 },
    { Project: "DM – Shared Services ART", Portfolio: "Data", Domain: "Data", Story_Points_Total: 10891, Defect_Leakage_Pct: 0.00, Prod_Defects: 0, Quality_Category: "Excellent", Total_Test_Cases: 4336 },
    { Project: "CAS – Billing (Dev) ART", Portfolio: "Shared Solutions", Domain: "BASE", Story_Points_Total: 10331, Defect_Leakage_Pct: 65.79, Prod_Defects: 25, Quality_Category: "Critical", Total_Test_Cases: 5692 },
    { Project: "PICS 2 ART", Portfolio: "Shared Solutions", Domain: "PICS", Story_Points_Total: 2917.5, Defect_Leakage_Pct: 94.12, Prod_Defects: 64, Quality_Category: "Critical", Total_Test_Cases: 5188 },
    { Project: "PICS 3 ART", Portfolio: "Shared Solutions", Domain: "PICS", Story_Points_Total: 4547, Defect_Leakage_Pct: 8.14, Prod_Defects: 14, Quality_Category: "Excellent", Total_Test_Cases: 2574 },
    { Project: "FinPAL Loss Dev ART", Portfolio: "Shared Solutions", Domain: "FINPAL", Story_Points_Total: 1806, Defect_Leakage_Pct: 68.75, Prod_Defects: 11, Quality_Category: "Critical", Total_Test_Cases: 17272 },
    { Project: "FPDV – FinPAL Premium ART", Portfolio: "Shared Solutions", Domain: "FINPAL", Story_Points_Total: 4479, Defect_Leakage_Pct: 11.11, Prod_Defects: 2, Quality_Category: "Good", Total_Test_Cases: 18658 },
    { Project: "PNC CRM ART", Portfolio: "D&S", Domain: "Salesforce CRM", Story_Points_Total: 966, Defect_Leakage_Pct: 29.41, Prod_Defects: 15, Quality_Category: "Critical", Total_Test_Cases: 3031 },
    { Project: "PNC Mobile ART", Portfolio: "D&S", Domain: "P&C Mobile", Story_Points_Total: 1346, Defect_Leakage_Pct: 100.00, Prod_Defects: 3, Quality_Category: "Critical", Total_Test_Cases: 18183 },
    { Project: "Omni Digital ART", Portfolio: "D&S", Domain: "Digital", Story_Points_Total: 2134, Defect_Leakage_Pct: 10.20, Prod_Defects: 10, Quality_Category: "Good", Total_Test_Cases: 13249 },
    { Project: "Agency Technology ART", Portfolio: "D&S", Domain: "Agency", Story_Points_Total: 2176, Defect_Leakage_Pct: 40.00, Prod_Defects: 8, Quality_Category: "Critical", Total_Test_Cases: 6525 },
    { Project: "New Business Ventures & Innovation ART A", Portfolio: "NBV&I", Domain: "Future of Auto, Innovation", Story_Points_Total: 742, Defect_Leakage_Pct: 100.00, Prod_Defects: 3, Quality_Category: "Critical", Total_Test_Cases: 388 },
    { Project: "New Business Ventures & Innovation ART B", Portfolio: "NBV&I", Domain: "SBI", Story_Points_Total: 1043, Defect_Leakage_Pct: 4.35, Prod_Defects: 5, Quality_Category: "Excellent", Total_Test_Cases: 4439 },
    { Project: "New Business Ventures & Innovation ART C", Portfolio: "NBV&I", Domain: "OEM", Story_Points_Total: 5552, Defect_Leakage_Pct: 0.83, Prod_Defects: 2, Quality_Category: "Excellent", Total_Test_Cases: 5439 },
    { Project: "New Business Ventures & Innovation ART D", Portfolio: "NBV&I", Domain: "Expanded Distribution, Auto Ecosystem", Story_Points_Total: 2865, Defect_Leakage_Pct: 0.28, Prod_Defects: 1, Quality_Category: "Excellent", Total_Test_Cases: 3031 },
    { Project: "ASC Technology ART", Portfolio: "ASC", Domain: "ASC", Story_Points_Total: 542, Defect_Leakage_Pct: 100.00, Prod_Defects: 3, Quality_Category: "Critical", Total_Test_Cases: 1422 }
  ];

  const [selectedPortfolio, setSelectedPortfolio] = useState('All');
  const [selectedQuality, setSelectedQuality] = useState('All');
  const [sortBy, setSortBy] = useState('leakage');
  const [showTopN, setShowTopN] = useState(15);
  const [selectedART, setSelectedART] = useState(null);

  const portfolios = ['All', ...new Set(rawData.map(d => d.Portfolio))];
  const qualityCategories = ['All', 'Excellent', 'Good', 'Acceptable', 'Critical'];

  const filteredData = useMemo(() => {
    let data = rawData.filter(d => d.Defect_Leakage_Pct !== null && d.Defect_Leakage_Pct !== undefined);
    
    if (selectedPortfolio !== 'All') {
      data = data.filter(d => d.Portfolio === selectedPortfolio);
    }
    if (selectedQuality !== 'All') {
      data = data.filter(d => d.Quality_Category === selectedQuality);
    }
    
    if (sortBy === 'leakage') {
      data = data.sort((a, b) => b.Defect_Leakage_Pct - a.Defect_Leakage_Pct);
    } else if (sortBy === 'story_points') {
      data = data.sort((a, b) => b.Story_Points_Total - a.Story_Points_Total);
    } else if (sortBy === 'prod_defects') {
      data = data.sort((a, b) => b.Prod_Defects - a.Prod_Defects);
    }
    
    return data.slice(0, showTopN);
  }, [selectedPortfolio, selectedQuality, sortBy, showTopN]);

  const getBarColor = (quality) => {
    switch (quality) {
      case 'Excellent': return '#22c55e';
      case 'Good': return '#84cc16';
      case 'Acceptable': return '#f59e0b';
      case 'Critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const summaryStats = useMemo(() => {
    const criticalCount = filteredData.filter(d => d.Quality_Category === 'Critical').length;
    const avgLeakage = filteredData.reduce((sum, d) => sum + d.Defect_Leakage_Pct, 0) / filteredData.length;
    const totalProdDefects = filteredData.reduce((sum, d) => sum + d.Prod_Defects, 0);
    return { criticalCount, avgLeakage, totalProdDefects };
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
            <p><span className="font-semibold">Defect Leakage:</span> <span className="text-red-600 font-bold">{data.Defect_Leakage_Pct.toFixed(2)}%</span></p>
            <p><span className="font-semibold">Prod Defects:</span> {data.Prod_Defects}</p>
            <p><span className="font-semibold">Story Points:</span> {data.Story_Points_Total.toLocaleString()}</p>
            <p><span className="font-semibold">Test Cases:</span> {data.Total_Test_Cases.toLocaleString()}</p>
            <p><span className="font-semibold">Quality:</span> 
              <span className={`ml-1 px-2 py-0.5 rounded text-white ${
                data.Quality_Category === 'Excellent' ? 'bg-green-500' :
                data.Quality_Category === 'Good' ? 'bg-lime-500' :
                data.Quality_Category === 'Acceptable' ? 'bg-amber-500' : 'bg-red-500'
              }`}>
                {data.Quality_Category}
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Production Defect Leakage Rate Analysis</h1>
          <p className="text-gray-600">Interactive analysis of defect leakage rates across ARTs</p>
        </div>
      )}
      {isCard && (
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-gray-800">Defect Leakage Rate</h2>
        </div>
      )}

      {!isCard && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Critical ARTs</p>
          <p className="text-2xl font-bold text-red-600">{summaryStats.criticalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-amber-500">
          <p className="text-sm text-gray-600">Avg Leakage Rate</p>
          <p className="text-2xl font-bold text-amber-600">{summaryStats.avgLeakage.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Prod Defects</p>
          <p className="text-2xl font-bold text-blue-600">{summaryStats.totalProdDefects}</p>
        </div>
      </div>
      )}

      {isCard ? (
        <div className="mb-2">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <select className="p-1 border rounded" value={selectedPortfolio} onChange={(e) => setSelectedPortfolio(e.target.value)}>
              {portfolios.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select className="p-1 border rounded" value={selectedQuality} onChange={(e) => setSelectedQuality(e.target.value)}>
              {qualityCategories.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <select className="p-1 border rounded" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="leakage">Leakage %</option>
              <option value="story_points">Story Points</option>
              <option value="prod_defects">Prod Defects</option>
            </select>
            <select className="p-1 border rounded" value={showTopN} onChange={(e) => setShowTopN(Number(e.target.value))}>
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={20}>Top 20</option>
            </select>
            <button className="px-2 py-1 border rounded" onClick={() => { setSelectedPortfolio('All'); setSelectedQuality('All'); setSortBy('leakage'); setShowTopN(15); }}>Reset</button>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality Category</label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm" value={selectedQuality} onChange={(e) => setSelectedQuality(e.target.value)}>
                {qualityCategories.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="leakage">Defect Leakage %</option>
                <option value="story_points">Story Points</option>
                <option value="prod_defects">Prod Defects</option>
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
              <button className="w-full p-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300" onClick={() => { setSelectedPortfolio('All'); setSelectedQuality('All'); setSortBy('leakage'); setShowTopN(15); }}>Reset Filters</button>
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
               label={isCard ? undefined : { value: 'Defect Leakage Rate (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={10} stroke="#22c55e" strokeDasharray="5 5" label={{ value: '10%', position: 'right', fontSize: 10 }} />
            <ReferenceLine y={20} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: '20%', position: 'right', fontSize: 10 }} />
            <Bar 
              dataKey="Defect_Leakage_Pct" 
              radius={[4, 4, 0, 0]}
              onClick={(data) => setSelectedART(data)}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.Quality_Category)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={isCard ? "bg-white p-2 rounded-lg shadow" : "bg-white p-4 rounded-lg shadow"}>
        {!isCard && <h3 className="font-semibold text-gray-800 mb-3">Legend & Thresholds</h3>}
        <div className={isCard ? "flex flex-wrap gap-3 text-[10px]" : "flex flex-wrap gap-4 text-sm"}>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Excellent (&lt;10%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-lime-500 rounded"></div>
            <span>Good (10-15%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span>Acceptable (15-20%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Critical (&gt;20%)</span>
          </div>
        </div>
      </div>

      {selectedART && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedART(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">{selectedART.Project}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Portfolio:</span> {selectedART.Portfolio}</p>
              <p><span className="font-semibold">Domain:</span> {selectedART.Domain}</p>
              <p><span className="font-semibold">Defect Leakage:</span> {selectedART.Defect_Leakage_Pct.toFixed(2)}%</p>
              <p><span className="font-semibold">Production Defects:</span> {selectedART.Prod_Defects}</p>
              <p><span className="font-semibold">Story Points:</span> {selectedART.Story_Points_Total.toLocaleString()}</p>
              <p><span className="font-semibold">Test Cases:</span> {selectedART.Total_Test_Cases.toLocaleString()}</p>
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

export default DefectLeakageChart;
