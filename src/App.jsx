import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Upload, FileSpreadsheet, TrendingUp, AlertCircle } from 'lucide-react';

const InsuranceAnalyticsPlatform = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [fileName, setFileName] = useState('');

  // Process uploaded Excel file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process data and create state mapping
        const processedData = processExcelData(jsonData);
        setStateData(processedData.stateMap);
        setKpiData(processedData.kpis);
        setFileUploaded(true);
      } catch (error) {
        alert('Error reading file. Please ensure it\'s a valid Excel file.');
        console.error(error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Map full state names to abbreviations
  const stateAbbreviations = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
  };

  // Process Excel data into usable format
  const processExcelData = (jsonData) => {
    const stateMap = {};
    let totalForms = 0;
    let totalAuto = 0;
    let totalHome = 0;
    const complexityCount = { 'High': 0, 'Medium': 0, 'Low': 0 };
    const filingTypes = {};
    const regulationTypes = {};

    jsonData.forEach(row => {
      const stateAbbr = stateAbbreviations[row.State];
      if (!stateAbbr) return;

      totalForms += row['Total Forms'] || 0;
      totalAuto += row['Auto Forms'] || 0;
      totalHome += row['Home/Dwelling'] || 0;

      const complexity = row.Complexity || 'Medium';
      complexityCount[complexity] = (complexityCount[complexity] || 0) + 1;

      const filingType = row['Overall Filing Type'] || 'Unknown';
      filingTypes[filingType] = (filingTypes[filingType] || 0) + 1;

      const regulation = row['Rate Regulation'] || 'Unknown';
      regulationTypes[regulation] = (regulationTypes[regulation] || 0) + 1;

      stateMap[stateAbbr] = {
        name: row.State,
        totalForms: row['Total Forms'] || 0,
        autoForms: row['Auto Forms'] || 0,
        homeForms: row['Home/Dwelling'] || 0,
        umbrella: row['Umbrella'] || 0,
        ratingReq: row['Rating Req.'] || 0,
        filingType: row['Overall Filing Type'] || 'N/A',
        autoFiling: row['Auto Filing'] || 'N/A',
        homeFiling: row['Home Filing'] || 'N/A',
        rateRegulation: row['Rate Regulation'] || 'N/A',
        pipRequired: row['PIP Required'] || 'N/A',
        umUim: row['UM/UIM'] || 'N/A',
        noFault: row['No-Fault'] || 'N/A',
        complexity: complexity,
        keyRequirements: row['Key State Requirements'] || 'N/A'
      };
    });

    const kpis = {
      totalForms,
      totalAuto,
      totalHome,
      avgFormsPerState: Math.round(totalForms / jsonData.length),
      stateCount: jsonData.length,
      complexityCount,
      filingTypes,
      regulationTypes
    };

    return { stateMap, kpis };
  };

  // Get color based on total forms
  const getStateColor = (stateCode) => {
    if (!stateData || !stateData[stateCode]) return '#e5e7eb';
    const forms = stateData[stateCode].totalForms;
    if (forms > 150) return '#1e40af';
    if (forms > 100) return '#3b82f6';
    if (forms > 50) return '#60a5fa';
    if (forms > 20) return '#93c5fd';
    return '#dbeafe';
  };

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-6">
            <FileSpreadsheet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            State Insurance Analytics Platform
          </h1>
          <p className="text-xl text-blue-200 mb-2">
            Upload your Excel file to visualize state filing jurisdiction analysis
          </p>
          <p className="text-sm text-blue-300">
            Supports .xlsx and .xls formats
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="border-4 border-dashed border-blue-300 rounded-xl p-12 text-center hover:border-blue-500 transition-all duration-300">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                Excel files only (Max 10MB)
              </p>
            </label>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Interactive Map</p>
              <p className="text-xs text-gray-600">Hover over states for details</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <BarChart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Real-time Charts</p>
              <p className="text-xs text-gray-600">Dynamic data visualization</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <AlertCircle className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Key Insights</p>
              <p className="text-xs text-gray-600">Automated KPI analysis</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-blue-200 text-sm">
          <p>Expected columns: State, Total Forms, Auto Forms, Home/Dwelling, Complexity, etc.</p>
        </div>
      </div>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => {
    const topStates = Object.entries(stateData)
      .sort((a, b) => b[1].totalForms - a[1].totalForms)
      .slice(0, 10)
      .map(([code, data]) => ({ name: data.name, forms: data.totalForms }));

    const complexityData = Object.entries(kpiData.complexityCount).map(([key, value]) => ({
      name: key,
      count: value
    }));

    const filingTypeData = Object.entries(kpiData.filingTypes).map(([key, value]) => ({
      name: key,
      count: value
    }));

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">State Insurance Filing Dashboard</h1>
                <p className="text-gray-600 mt-1">Data source: {fileName}</p>
              </div>
              <button
                onClick={() => {
                  setFileUploaded(false);
                  setStateData(null);
                  setFileName('');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload New File
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="text-gray-500 text-sm font-semibold mb-1">Total Forms</div>
              <div className="text-3xl font-bold text-gray-800">{kpiData.totalForms.toLocaleString()}</div>
              <div className="text-green-600 text-sm mt-1">Across {kpiData.stateCount} states</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="text-gray-500 text-sm font-semibold mb-1">Auto Forms</div>
              <div className="text-3xl font-bold text-gray-800">{kpiData.totalAuto.toLocaleString()}</div>
              <div className="text-gray-600 text-sm mt-1">{((kpiData.totalAuto/kpiData.totalForms)*100).toFixed(1)}% of total</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
              <div className="text-gray-500 text-sm font-semibold mb-1">Home Forms</div>
              <div className="text-3xl font-bold text-gray-800">{kpiData.totalHome.toLocaleString()}</div>
              <div className="text-gray-600 text-sm mt-1">{((kpiData.totalHome/kpiData.totalForms)*100).toFixed(1)}% of total</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
              <div className="text-gray-500 text-sm font-semibold mb-1">Avg per State</div>
              <div className="text-3xl font-bold text-gray-800">{kpiData.avgFormsPerState}</div>
              <div className="text-gray-600 text-sm mt-1">Forms filed</div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* USA Map Section */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Interactive State Map</h2>
              <p className="text-sm text-gray-600 mb-4">Hover over states to see details. Click to pin information.</p>
              
              <div className="relative">
                <svg viewBox="0 0 960 600" className="w-full h-auto">
                  {Object.keys(stateData).map(stateCode => {
                    const positions = {
                      CA: "M50,250 L150,250 L150,400 L50,400 Z",
                      TX: "M280,350 L420,350 L420,480 L280,480 Z",
                      FL: "M700,450 L800,450 L800,550 L700,550 Z",
                      NY: "M800,150 L880,150 L880,210 L800,210 Z",
                      PA: "M780,200 L860,200 L860,250 L780,250 Z",
                      IL: "M520,220 L590,220 L590,300 L520,300 Z",
                      OH: "M650,210 L720,210 L720,270 L650,270 Z",
                      GA: "M680,370 L750,370 L750,450 L680,450 Z",
                      NC: "M730,310 L820,310 L820,360 L730,360 Z",
                      MI: "M610,140 L680,140 L680,220 L610,220 Z",
                      NJ: "M850,190 L890,190 L890,230 L850,230 Z",
                      VA: "M750,280 L830,280 L830,330 L750,330 Z",
                      WA: "M80,50 L180,50 L180,120 L80,120 Z",
                      AZ: "M160,320 L240,320 L240,420 L160,420 Z",
                      MA: "M870,140 L920,140 L920,170 L870,170 Z",
                      TN: "M600,310 L710,310 L710,360 L600,360 Z",
                      IN: "M590,240 L650,240 L650,310 L590,310 Z",
                      MO: "M490,260 L570,260 L570,330 L490,330 Z",
                      MD: "M810,240 L870,240 L870,270 L810,270 Z",
                      WI: "M540,140 L600,140 L600,220 L540,220 Z",
                      CO: "M260,200 L360,200 L360,280 L260,280 Z",
                      MN: "M480,100 L560,100 L560,190 L480,190 Z",
                      SC: "M730,360 L800,360 L800,410 L730,410 Z",
                      AL: "M620,360 L680,360 L680,440 L620,440 Z",
                      LA: "M510,400 L590,400 L590,480 L510,480 Z",
                      KY: "M640,280 L720,280 L720,330 L640,330 Z",
                      OR: "M70,120 L170,120 L170,200 L70,200 Z",
                      OK: "M390,320 L490,320 L490,380 L390,380 Z",
                      CT: "M880,170 L920,170 L920,195 L880,195 Z",
                      UT: "M200,200 L270,200 L270,300 L200,300 Z",
                      IA: "M480,190 L560,190 L560,250 L480,250 Z",
                      NV: "M120,180 L190,180 L190,300 L120,300 Z",
                      AR: "M530,330 L600,330 L600,400 L530,400 Z",
                      MS: "M570,360 L620,360 L620,450 L570,450 Z",
                      KS: "M390,250 L480,250 L480,320 L390,320 Z",
                      NM: "M240,300 L330,300 L330,420 L240,420 Z",
                      NE: "M380,200 L480,200 L480,260 L380,260 Z",
                      ID: "M170,80 L240,80 L240,200 L170,200 Z",
                      WV: "M730,250 L790,250 L790,300 L730,300 Z",
                      HI: "M220,520 L280,520 L280,560 L220,560 Z",
                      NH: "M890,120 L925,120 L925,160 L890,160 Z",
                      ME: "M900,80 L940,80 L940,140 L900,140 Z",
                      RI: "M910,180 L935,180 L935,200 L910,200 Z",
                      MT: "M240,60 L380,60 L380,140 L240,140 Z",
                      DE: "M860,250 L885,250 L885,280 L860,280 Z",
                      SD: "M380,140 L480,140 L480,200 L380,200 Z",
                      ND: "M380,60 L480,60 L480,130 L380,130 Z",
                      AK: "M30,500 L120,500 L120,570 L30,570 Z",
                      VT: "M875,110 L905,110 L905,150 L875,150 Z",
                      WY: "M260,140 L360,140 L360,210 L260,210 Z"
                    };
                    
                    return (
                      <path
                        key={stateCode}
                        d={positions[stateCode] || "M0,0"}
                        fill={hoveredState === stateCode ? '#fbbf24' : getStateColor(stateCode)}
                        stroke="#fff"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200 hover:opacity-80"
                        onMouseEnter={() => setHoveredState(stateCode)}
                        onMouseLeave={() => setHoveredState(null)}
                        onClick={() => setSelectedState(stateCode)}
                      />
                    );
                  })}
                </svg>
                
                {/* Legend */}
                <div className="mt-4 flex items-center justify-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-900"></div>
                    <span>150+ forms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <span>100-150</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-300"></div>
                    <span>50-100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-200"></div>
                    <span>20-50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100"></div>
                    <span>&lt;20</span>
                  </div>
                </div>
              </div>

              {/* State Details */}
              {(hoveredState || selectedState) && stateData[hoveredState || selectedState] && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {stateData[hoveredState || selectedState].name}
                    </h3>
                    {selectedState && (
                      <button 
                        onClick={() => setSelectedState(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Forms</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stateData[hoveredState || selectedState].totalForms}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Auto Forms</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {stateData[hoveredState || selectedState].autoForms}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Home Forms</p>
                      <p className="text-2xl font-bold text-pink-600">
                        {stateData[hoveredState || selectedState].homeForms}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Complexity</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {stateData[hoveredState || selectedState].complexity}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Filing Type</p>
                      <p className="text-lg font-bold text-gray-700">
                        {stateData[hoveredState || selectedState].filingType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rate Regulation</p>
                      <p className="text-lg font-bold text-gray-700">
                        {stateData[hoveredState || selectedState].rateRegulation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Key Requirements</p>
                    <p className="text-sm text-gray-800">
                      {stateData[hoveredState || selectedState].keyRequirements}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-600">PIP:</span>
                      <span className="font-semibold ml-1">{stateData[hoveredState || selectedState].pipRequired}</span>
                    </div>
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-600">UM/UIM:</span>
                      <span className="font-semibold ml-1">{stateData[hoveredState || selectedState].umUim}</span>
                    </div>
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-600">No-Fault:</span>
                      <span className="font-semibold ml-1">{stateData[hoveredState || selectedState].noFault}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Analytics */}
            <div className="space-y-6">
              {/* Top 10 States */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Top 10 States by Total Forms</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topStates} layout="horizontal">
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="forms" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Complexity Distribution */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Complexity Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={complexityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, count }) => `${name}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {complexityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Filing Types */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Filing Types</h3>
                <div className="space-y-2">
                  {Object.entries(kpiData.filingTypes).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                      <span className="text-sm font-bold text-blue-600">{count} states</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return fileUploaded ? <Dashboard /> : <LandingPage />;
};

export default InsuranceAnalyticsPlatform;