import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, TrendingUp, AlertCircle, Car, Home, Umbrella, ChevronDown, ChevronRight, BarChart3, Activity } from 'lucide-react';
import './index.css';
import './App.css';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import TestDashboardWrapper from './apps/test-dashboard/TestDashboardWrapper.jsx';
import QualityIntelligenceWrapper from './apps/quality-intelligence/QualityIntelligenceWrapper.jsx';
import Story2ProdLanding from './apps/story2prod/Story2ProdLanding.jsx';
import headerImg from '../images/Header.png';
import footerImg from '../images/Footer.png';
import bgImage from '../images/Background.png';
import excelUrl from '../State_Filing_Jurisdiction_Analysis_New.xlsx?url';

const InsuranceAnalyticsPlatform = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [fileName, setFileName] = useState('');
  
  // New states for LOB navigation and timeline
  const [selectedLOB, setSelectedLOB] = useState('auto'); // 'overview', 'auto', 'home', 'umbrella'
  const [timelineData, setTimelineData] = useState(null);
  
  // Tree dropdown states
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedQuarters, setExpandedQuarters] = useState({});
  
  // NEW: State to track which year's quarters are visible
  const [selectedYear, setSelectedYear] = useState(null);
  const [appMode, setAppMode] = useState('home');

  const navigate = (mode) => {
    setAppMode(mode);
    if (mode === 'home') window.location.hash = '#/home';
    else if (mode === 'test') window.location.hash = '#/test-dashboard';
    else if (mode === 'state-rollout') window.location.hash = '#/state-rollout';
    else if (mode === 'quality') window.location.hash = '#/quality-intelligence';
    else if (mode === 'story2prod') window.location.hash = '#/story2prod';
  };

  useEffect(() => {
    const syncFromHash = () => {
      const h = window.location.hash;
      if (h.includes('test-dashboard')) setAppMode('test');
      else if (h.includes('state-rollout')) setAppMode('state-rollout');
      else if (h.includes('quality-intelligence')) setAppMode('quality');
      else if (h.includes('story2prod')) setAppMode('story2prod');
      else setAppMode('home');
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadBundledExcel = async () => {
      try {
        const res = await fetch(excelUrl);
        const buf = await res.arrayBuffer();
        const data = new Uint8Array(buf);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
        const processedData = processExcelData(jsonData);
        if (!mounted) return;
        setStateData(processedData.stateMap);
        setKpiData(processedData.kpis);
        setTimelineData(processedData.timeline);
        setFileUploaded(true);
        setSelectedLOB('auto');
        setFileName('State_Filing_Jurisdiction_Analysis_New.xlsx');
      } catch (err) {
        console.error('Failed to load bundled Excel asset', err);
      }
    };
    loadBundledExcel();
    return () => { mounted = false; };
  }, []);

  // Cache US states topology to avoid refetches and remount flicker
  const US_TOPO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
  const WORLD_TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
  const [usTopo, setUsTopo] = useState(null);
  const [worldTopo, setWorldTopo] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(US_TOPO_URL)
      .then((res) => res.json())
      .then((topology) => { if (mounted) setUsTopo(topology); })
      .catch((err) => console.error('Failed to load US topology', err));
    fetch(WORLD_TOPO_URL)
      .then((res) => res.json())
      .then((topology) => { if (mounted) setWorldTopo(topology); })
      .catch((err) => console.error('Failed to load world topology', err));
    return () => { mounted = false; };
  }, []);

  // Throttle hover updates to one per animation frame to reduce flicker
  const hoverRaf = useRef(0);
  const hoveredRef = useRef(null);
  useEffect(() => { hoveredRef.current = hoveredState; }, [hoveredState]);
  // Defer hover leave clearing; cancel if a new enter occurs
  const leaveTimeoutRef = useRef(0);
  const cancelLeave = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = 0;
    }
  }, []);
  const setHoverThrottled = useCallback((codeOrNull) => {
    // Skip redundant updates
    if (hoveredRef.current === codeOrNull) return;
    if (hoverRaf.current) cancelAnimationFrame(hoverRaf.current);
    hoverRaf.current = requestAnimationFrame(() => setHoveredState(codeOrNull));
  }, [setHoveredState]);

  const googleScriptLoadedRef = useRef(false);
  const googleMapElRef = useRef(null);
  const googleMapRef = useRef(null);

  const initGoogleWorldMap = useCallback(() => {
    if (!window.google || !googleMapElRef.current || googleMapRef.current) return;
    const map = new window.google.maps.Map(googleMapElRef.current, {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      mapTypeId: 'roadmap',
      disableDefaultUI: true
    });
    const locations = [
      {n:'United States', code:'USA', c:[-98.5795, 39.8283], col:'#8b5cf6'},
      {n:'Belize', code:'BEL', c:[-88.4976, 17.1899], col:'#ef4444'},
      {n:'Cuba', code:'CUB', c:[-77.7812, 21.5218], col:'#22c55e'},
      {n:'Puerto Rico', code:'PR', c:[-66.5901, 18.2208], col:'#1e40af'},
      {n:'Virgin Islands', code:'VI', c:[-64.8963, 18.3358], col:'#e11d48'},
      {n:'Azores', code:'AZO', c:[-25.6756, 37.7412], col:'#f59e0b'},
      {n:'Portugal', code:'POR', c:[-8.2245, 39.3999], col:'#ea580c'},
      {n:'Spain', code:'SPN', c:[-3.7492, 40.4637], col:'#dc2626'},
      {n:'United Kingdom', code:'UK', c:[-3.4360, 55.3781], col:'#10b981'},
      {n:'France', code:'FRN', c:[2.2137, 46.2276], col:'#3b82f6'},
      {n:'Netherlands', code:'NET', c:[5.2913, 52.1326], col:'#f59e0b'},
      {n:'Germany', code:'GER', c:[10.4515, 51.1657], col:'#6366f1'},
      {n:'Austria', code:'UST', c:[14.5501, 47.5162], col:'#f97316'},
      {n:'Italy', code:'ITA', c:[12.5674, 41.8719], col:'#ef4444'},
      {n:'Greece', code:'GRC', c:[21.8243, 39.0742], col:'#a855f7'},
      {n:'South Korea', code:'SKO', c:[127.7669, 35.9078], col:'#06b6d4'},
      {n:'Guam', code:'GU', c:[144.7937, 13.4443], col:'#22c55e'}
    ];
    locations.forEach(p => {
      new window.google.maps.Marker({
        position: { lat: p.c[1], lng: p.c[0] },
        map,
        title: `${p.n} (${p.code})`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: p.col,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1.5
        }
      });
    });
    googleMapRef.current = map;
  }, []);

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (selectedLOB === 'overview' && key && !googleScriptLoadedRef.current) {
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      s.async = true;
      s.defer = true;
      s.onload = () => {
        googleScriptLoadedRef.current = true;
        initGoogleWorldMap();
      };
      document.head.appendChild(s);
    } else if (selectedLOB === 'overview' && window.google && !googleMapRef.current) {
      initGoogleWorldMap();
    }
  }, [selectedLOB, initGoogleWorldMap]);

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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
        console.log('Loaded Excel data:', jsonData);
        const processedData = processExcelData(jsonData);
        setStateData(processedData.stateMap);
        setKpiData(processedData.kpis);
        setTimelineData(processedData.timeline);
        setFileUploaded(true);
        setSelectedLOB('auto');
      } catch (err) {
        alert('Failed to read file. Ensure it is a valid Excel (.xlsx/.xls).');
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const stateAbbreviations = {
    'Alabama': 'AL','Alaska': 'AK','Arizona': 'AZ','Arkansas': 'AR','California': 'CA','Colorado': 'CO','Connecticut': 'CT','Delaware': 'DE','District of Columbia': 'DC','Florida': 'FL','Georgia': 'GA','Hawaii': 'HI','Idaho': 'ID','Illinois': 'IL','Indiana': 'IN','Iowa': 'IA','Kansas': 'KS','Kentucky': 'KY','Louisiana': 'LA','Maine': 'ME','Maryland': 'MD','Massachusetts': 'MA','Michigan': 'MI','Minnesota': 'MN','Mississippi': 'MS','Missouri': 'MO','Montana': 'MT','Nebraska': 'NE','Nevada': 'NV','New Hampshire': 'NH','New Jersey': 'NJ','New Mexico': 'NM','New York': 'NY','North Carolina': 'NC','North Dakota': 'ND','Ohio': 'OH','Oklahoma': 'OK','Oregon': 'OR','Pennsylvania': 'PA','Rhode Island': 'RI','South Carolina': 'SC','South Dakota': 'SD','Tennessee': 'TN','Texas': 'TX','Utah': 'UT','Vermont': 'VT','Virginia': 'VA','Washington': 'WA','West Virginia': 'WV','Wisconsin': 'WI','Wyoming': 'WY'
  };

  // Simplified USA map positions for all states
  const statePositions = {
    'AK': { x: 10, y: 450, width: 100, height: 70 },
    'HI': { x: 250, y: 450, width: 80, height: 40 },
    'WA': { x: 70, y: 20, width: 90, height: 70 },
    'OR': { x: 70, y: 90, width: 90, height: 60 },
    'CA': { x: 40, y: 150, width: 90, height: 150 },
    'NV': { x: 130, y: 150, width: 70, height: 100 },
    'ID': { x: 160, y: 50, width: 70, height: 100 },
    'MT': { x: 230, y: 20, width: 120, height: 70 },
    'WY': { x: 230, y: 90, width: 90, height: 70 },
    'UT': { x: 200, y: 160, width: 70, height: 90 },
    'CO': { x: 270, y: 160, width: 90, height: 80 },
    'AZ': { x: 150, y: 250, width: 80, height: 90 },
    'NM': { x: 230, y: 240, width: 80, height: 100 },
    'ND': { x: 350, y: 20, width: 90, height: 60 },
    'SD': { x: 350, y: 80, width: 90, height: 60 },
    'NE': { x: 360, y: 140, width: 90, height: 60 },
    'KS': { x: 360, y: 200, width: 90, height: 60 },
    'OK': { x: 360, y: 260, width: 100, height: 60 },
    'TX': { x: 310, y: 320, width: 130, height: 130 },
    'MN': { x: 440, y: 50, width: 90, height: 90 },
    'IA': { x: 450, y: 140, width: 80, height: 60 },
    'MO': { x: 460, y: 200, width: 80, height: 70 },
    'AR': { x: 480, y: 270, width: 70, height: 60 },
    'LA': { x: 490, y: 330, width: 80, height: 70 },
    'WI': { x: 530, y: 80, width: 70, height: 90 },
    'IL': { x: 540, y: 170, width: 60, height: 100 },
    'MI': { x: 600, y: 90, width: 90, height: 100 },
    'IN': { x: 600, y: 190, width: 50, height: 80 },
    'OH': { x: 650, y: 180, width: 70, height: 70 },
    'KY': { x: 620, y: 250, width: 90, height: 50 },
    'TN': { x: 600, y: 300, width: 100, height: 50 },
    'MS': { x: 560, y: 350, width: 60, height: 80 },
    'AL': { x: 620, y: 350, width: 60, height: 80 },
    'WV': { x: 720, y: 220, width: 60, height: 70 },
    'VA': { x: 730, y: 250, width: 90, height: 50 },
    'NC': { x: 730, y: 300, width: 100, height: 50 },
    'SC': { x: 730, y: 350, width: 70, height: 60 },
    'GA': { x: 680, y: 380, width: 70, height: 80 },
    'FL': { x: 750, y: 410, width: 80, height: 90 },
    'PA': { x: 780, y: 170, width: 80, height: 60 },
    'NY': { x: 820, y: 110, width: 80, height: 80 },
    'VT': { x: 880, y: 90, width: 40, height: 50 },
    'NH': { x: 900, y: 100, width: 40, height: 50 },
    'ME': { x: 920, y: 50, width: 50, height: 90 },
    'MA': { x: 900, y: 140, width: 50, height: 30 },
    'RI': { x: 920, y: 160, width: 30, height: 20 },
    'CT': { x: 890, y: 170, width: 40, height: 30 },
    'NJ': { x: 860, y: 190, width: 40, height: 50 },
    'DE': { x: 850, y: 220, width: 30, height: 40 },
    'MD': { x: 810, y: 230, width: 60, height: 40 }
  };

  const processExcelData = (jsonData) => {
    const stateMap = {};
    let totalForms = 0, totalAuto = 0, totalHome = 0;
    const complexityCount = { High: 0, Medium: 0, Low: 0 };
    const filingTypes = {}; 
    const regulationTypes = {};
    
    
    const autoTimeline = {
      '2025': { 'Q1': [], 'Q2': [], 'Q3': [], 'Q4': ['WI'] },
      '2026': { 'Q1': [], 'Q2': [], 'Q3': [], 'Q4': ['IL', 'OH', 'AZ'] },
      '2027': { 'Q1': ['UT', 'IN'], 'Q2': ['NE'], 'Q3': ['IA', 'OR', 'TX', 'VA', 'MN'], 'Q4': ['AL', 'OK', 'AR', 'MS', 'TN'] },
      '2028': { 'Q1': ['KS', 'SC', 'MO', 'CO'], 'Q2': ['KY', 'MD'], 'Q3': [], 'Q4': ['WY', 'SD', 'ME', 'WV', 'FL'] },
      '2029': { 'Q1': ['ID', 'ND', 'NM', 'GA', 'NY'], 'Q2': ['VT', 'NV', 'MT', 'RI'], 'Q3': ['NH', 'AK', 'CT', 'DE', 'DC', 'PA'], 'Q4': ['LA'] },
      '2030': { 'Q1': ['MI', 'MA', 'NJ'], 'Q2': [], 'Q3': [], 'Q4': [] }
    };

    const homeTimeline = {
      '2025': { 'Q4': ['WI'] },
      '2026': { 'Q4': ['WI'] },
      '2027': { 'Q3': ['IL', 'OH', 'AZ'] },
      '2028': { 'Q1': ['UT', 'IN', 'NE'], 'Q3': ['-14'] },
      '2029': { 'Q1': ['10A'], 'Q4': ['10B'] },
      '2030': { 'Q2': ['10C'] }
    };

    const umbrellaTimeline = {
      '2025': { 'Q2': ['WI', 'AZ'] },
      '2026': { 'Q4': ['NJ', 'NY', 'PA', 'WA', 'GA', 'CA'] },
      '2027': { 'Q1': [], 'Q2': [], 'Q3': [], 'Q4': [] },
      '2028': { 'Q1': [], 'Q2': [], 'Q3': [], 'Q4': [] },
      '2029': { 'Q1': [], 'Q2': [], 'Q3': [], 'Q4': [] },
      '2030': { 'Q1': [], 'Q2': [], 'Q3': [], 'Q4': [] }
    };
    
    const timeline = {
      auto: {},
      home: {},
      umbrella: {}
    };

    const years = ['2025', '2026', '2027', '2028', '2029', '2030'];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    // Initialize timeline structure
    years.forEach(year => {
      timeline.auto[year] = {};
      timeline.home[year] = {};
      timeline.umbrella[year] = {};
      quarters.forEach(q => {
        timeline.auto[year][q] = [];
        timeline.home[year][q] = [];
        timeline.umbrella[year][q] = [];
      });
    });

    const parseNum = (v) => {
      if (typeof v === 'number') return v;
      if (v == null) return 0;
      const s = String(v).replace(/,/g, '').replace(/%/g, '').trim();
      const n = parseFloat(s);
      return Number.isNaN(n) ? 0 : n;
    };
    const normalizeKey = (k) => String(k || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    jsonData.forEach(row => {
      const abbr = stateAbbreviations[row.State];
      if (!abbr) return;
      const normRow = Object.keys(row).reduce((acc, k) => { acc[normalizeKey(k)] = row[k]; return acc; }, {});
      const pickNum = (candidates) => {
        for (let i = 0; i < candidates.length; i++) {
          const key = normalizeKey(candidates[i]);
          if (normRow.hasOwnProperty(key)) return parseNum(normRow[key]);
        }
        return 0;
      };
      
      totalForms += row['Total Forms'] || 0;
      totalAuto += row['Auto Forms'] || 0;
      totalHome += row['Home/Dwelling'] || 0;
      
      const complexity = row.Complexity || 'Medium';
      complexityCount[complexity] = (complexityCount[complexity]||0)+1;
      
      const filingType = row['Overall Filing Type'] || 'Unknown';
      filingTypes[filingType] = (filingTypes[filingType]||0)+1;
      
      const regulation = row['Rate Regulation'] || 'Unknown';
      regulationTypes[regulation] = (regulationTypes[regulation]||0)+1;
      
      const passVal = pickNum(['Pass','Passed','Test Pass','Pass Count']);
      const failVal = pickNum(['Fail','Failed','Test Fail','Fail Count']);
      const noRunVal = pickNum(['No Run','Not Run','NoRun','Pending']);
      let pctVal = parseNum(row['% Complete']);
      const pctText = row['% Complete'] != null ? String(row['% Complete']).trim() : '';

      stateMap[abbr] = {
        name: row.State,
        stateRanking: row['State Ranking'] || 0,
        totalForms: row['Total Forms'] || 0,
        autoForms: row['Auto Forms'] || 0,
        homeForms: row['Home/Dwelling'] || 0,
        umbrella: row['Umbrella'] || 0,
        ratingReq: row['Rating Req.'] || 0,
        filingType,
        autoFiling: row['Auto Filing'] || 'N/A',
        homeFiling: row['Home Filing'] || 'N/A',
        rateRegulation: row['Rate Regulation'] || 'N/A',
        pipRequired: row['PIP Required'] || 'N/A',
        pass: passVal,
        fail: failVal,
        noRun: noRunVal,
        percentComplete: pctVal,
        percentCompleteText: pctText,
        umUim: row['UM/UIM'] || 'N/A',
        noFault: row['No-Fault'] || 'N/A',
        complexity,
        testingComplexity: row['Testing Complexity'] || 'Medium',
        keyRequirements: row['Key State Requirements'] || 'N/A',
        autoTestingComplexity: row['Auto Testing Complexity'] || row['Testing Complexity'] || 'Medium',
        homeTestingComplexity: row['Dwelling Testing Complexity'] || row['Testing Complexity'] || 'Medium',
        umbrellaTestingComplexity: row['Umbrella Testing Complexity'] || row['Testing Complexity'] || 'Medium',
        autoKeyRequirements: row['Auto - Key State Requirements'] || row['Key State Requirements'] || 'N/A',
        homeKeyRequirements: row['Dwelling - Key State Requirements'] || row['Key State Requirements'] || 'N/A',
        umbrellaKeyRequirements: row['Umbrella - Key State Requirements'] || row['Key State Requirements'] || 'N/A'
      };
    });

    // Populate Auto timeline with predefined data
    const autoLow = new Set(['WI','IL','OH','AZ','UT','IN','NE','IA','OR','AL','OK','AR','MS','KS','SC','WY','SD','ME','WV','ID','ND','NM','VT','NH']);
    const autoMedium = new Set(['KY','MO','TN','NV','MI']);
    const autoHigh = new Set(['TX','VA','MN','CO','MD','FL','GA','NY','MT','RI','AK','CT','DE','DC','PA','LA','MA','NJ']);
    years.forEach(year => {
      quarters.forEach(quarter => {
        const stateCodes = autoTimeline[year][quarter];
        stateCodes.forEach(code => {
          // Add state even if not in stateMap (with default values)
          if (stateMap[code]) {
            let comp = 'Medium';
            if (autoLow.has(code)) comp = 'Low';
            else if (autoMedium.has(code)) comp = 'Medium';
            else if (autoHigh.has(code)) comp = 'High';
            timeline.auto[year][quarter].push({
              code: code,
              name: stateMap[code].name,
              complexity: comp
            });
          } else {
            // Add with defaults if state not found in Excel data
            timeline.auto[year][quarter].push({
              code: code,
              name: code,
              complexity: 'Medium'
            });
          }
        });
      });
    });

    years.forEach((year) => {
      quarters.forEach((quarter) => {
        const codes = homeTimeline[year]?.[quarter] || [];
        codes.forEach((code) => {
          if (stateMap[code]) {
            const nameOverride = year === '2025' && quarter === 'Q4' && code === 'WI'
              ? `${stateMap[code].name} (Foundational)`
              : year === '2026' && quarter === 'Q4' && code === 'WI'
              ? `${stateMap[code].name} (Scalable)`
              : stateMap[code].name;
            timeline.home[year][quarter].push({
              code,
              name: nameOverride,
              complexity: 'Low'
            });
          } else {
            timeline.home[year][quarter].push({
              code,
              name: code,
              complexity: 'Low'
            });
          }
        });
      });
    });

    years.forEach((year) => {
      quarters.forEach((quarter) => {
        const codes = umbrellaTimeline[year]?.[quarter] || [];
        codes.forEach((code) => {
          if (stateMap[code]) {
            const mediumStates = new Set(['NJ', 'NY']);
            const complexity = mediumStates.has(code) ? 'Medium' : 'High';
            timeline.umbrella[year][quarter].push({
              code,
              name: stateMap[code].name,
              complexity
            });
          } else {
            timeline.umbrella[year][quarter].push({
              code,
              name: code,
              complexity: 'Medium'
            });
          }
        });
      });
    });

    const kpis = {
      totalForms,
      totalAuto,
      totalHome,
      avgFormsPerState: jsonData.length ? Math.round(totalForms / jsonData.length) : 0,
      stateCount: Object.keys(stateMap).length,
      complexityCount,
      filingTypes,
      regulationTypes
    };
    
    return { stateMap, kpis, timeline };
  };

  const getStateColor = useCallback((code) => {
    if (!stateData || !stateData[code]) return '#e5e7eb';
    let testingComplexity = selectedLOB === 'auto'
      ? stateData[code].autoTestingComplexity
      : selectedLOB === 'home'
      ? stateData[code].homeTestingComplexity
      : selectedLOB === 'umbrella'
      ? stateData[code].umbrellaTestingComplexity
      : stateData[code].testingComplexity;
    if (selectedLOB !== 'auto' && testingComplexity === 'Critical') testingComplexity = 'High';
    if (testingComplexity === 'Low') return '#1a3a5c';
    if (testingComplexity === 'Medium') return '#4a90c2';
    if (testingComplexity === 'High') return '#a8d4f0';
    if (testingComplexity === 'Critical') return '#7ed321';
    return '#4a90c2';
  }, [stateData, selectedLOB]);

  const getComplexityColor = (complexity) => {
    if (complexity === 'Critical') return 'text-red-700 bg-red-100 border-red-300';
    if (complexity === 'High') return 'text-orange-700 bg-orange-100 border-orange-300';
    if (complexity === 'Medium') return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    return 'text-green-700 bg-green-100 border-green-300';
  };

  const toggleYear = (year) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  const toggleQuarter = (year, quarter) => {
    const key = `${year}-${quarter}`;
    setExpandedQuarters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const HomePage = () => (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundImage: `linear-gradient(to left, rgba(246,248,251,0) 0%, rgba(246,248,251,1) 32%), url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: '85% 80%', backgroundRepeat: 'no-repeat' }}>
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-usaa-navy mb-2">ValueMomentum Insurance Analytics</h1>
          <p className="text-gray-600">Choose an app to continue</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-usaa-blue" />
              <h2 className="text-xl font-semibold text-usaa-navy">Test Execution Dashboard</h2>
            </div>
            <p className="text-gray-600 mb-4">View test outcomes, code coverage, and sprint analytics.</p>
            <button
              onClick={() => navigate('test')}
              className="px-4 py-2 bg-usaa-blue text-white rounded hover:bg-usaa-navy-700"
            >
              Open
            </button>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileSpreadsheet className="w-6 h-6 text-usaa-blue" />
              <h2 className="text-xl font-semibold text-usaa-navy">State Rollout Analysis</h2>
            </div>
            <p className="text-gray-600 mb-4">Upload filing data to analyze state metrics and insights.</p>
            <button
              onClick={() => navigate('state-rollout')}
              className="px-4 py-2 bg-usaa-blue text-white rounded hover:bg-usaa-navy-700"
            >
              Start
            </button>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-usaa-blue" />
              <h2 className="text-xl font-semibold text-usaa-navy">P&C Quality Intelligence</h2>
            </div>
            <p className="text-gray-600 mb-4">Open interactive E2E Quality Intelligence dashboards.</p>
            <button
              onClick={() => navigate('quality')}
              className="px-4 py-2 bg-usaa-blue text-white rounded hover:bg-usaa-navy-700"
            >
              Open
            </button>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-usaa-blue" />
              <h2 className="text-xl font-semibold text-usaa-navy">Story2Prod</h2>
            </div>
            <p className="text-gray-600 mb-4">Executive landing aggregating Story-to-Production analytics.</p>
            <button
              onClick={() => navigate('story2prod')}
              className="px-4 py-2 bg-usaa-blue text-white rounded hover:bg-usaa-navy-700"
            >
              Open
            </button>
          </div>
        </div>
        <p className="text-center text-usaa-navy font-semibold mt-6">For USAA</p>
      </div>
    </div>
  );

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-usaa-navy via-usaa-blue to-usaa-navy flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-6">
            <FileSpreadsheet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Insurelytics
          </h1>
          <p className="text-xl text-white/80 mb-2">
            Upload your Excel file to visualize state filing jurisdiction analysis
          </p>
          <p className="text-sm text-white/70">
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
              <Upload className="w-16 h-16 text-usaa-blue mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                Excel files only (Max 10MB)
              </p>
            </label>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-usaa-light rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-usaa-blue mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Interactive Map</p>
              <p className="text-xs text-gray-600">Hover over states for details</p>
            </div>
            <div className="bg-usaa-light rounded-lg p-4 text-center">
              <Car className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">LOB Timeline</p>
              <p className="text-xs text-gray-600">Track rollouts by quarter</p>
            </div>
            <div className="bg-usaa-light rounded-lg p-4 text-center">
              <AlertCircle className="w-8 h-8 text-usaa-blue mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Key Insights</p>
              <p className="text-xs text-gray-600">Automated KPI analysis</p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );

  const Dashboard = () => {
    const StateDetailPanel = ({ code }) => {
      const d = stateData[code];
      if (!d) return null;
      const pct = d.percentComplete || 0;
      const pctClass = pct > 80 ? 'text-green-600' : (pct >= 60 && pct < 80) ? 'text-amber-600' : 'text-red-600';
      
      return (
        <div className="bg-white rounded-lg shadow-lg p-6 font-sans">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-800">{d.name}</h3>
            {selectedState && (
              <button onClick={() => setSelectedState(null)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            )}
          </div>
          <div className="text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <div className="font-bold text-gray-800">Testing Complexity</div>
                <div className="text-gray-800">{(() => { let c = selectedLOB === 'auto' ? d.autoTestingComplexity : selectedLOB === 'home' ? d.homeTestingComplexity : selectedLOB === 'umbrella' ? d.umbrellaTestingComplexity : d.testingComplexity; if (selectedLOB !== 'auto' && c === 'Critical') c = 'High'; return c; })()}</div>
              </div>
              <div>
                <div className="font-bold text-gray-800">Filing Type</div>
                <div className="text-gray-800">{d.filingType}</div>
              </div>
              <div>
                <div className="font-bold text-gray-800">Rate Regulation</div>
                <div className="text-gray-800">{d.rateRegulation}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div>
                <div className="font-bold text-gray-800">PIP</div>
                <div className="text-gray-800">{d.pipRequired}</div>
              </div>
              <div>
                <div className="font-bold text-gray-800">UM/UIM</div>
                <div className="text-gray-800">{d.umUim}</div>
              </div>
              <div>
                <div className="font-bold text-gray-800">No-Fault</div>
                <div className="text-gray-800">{d.noFault}</div>
              </div>
            </div>
            <div className="mb-3">
              <div className="text-sm font-bold text-gray-800 mb-1">Execution summary</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="font-bold text-gray-800">Pass</div>
                  <div className="text-green-600">{d.pass || 0}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-800">Fail</div>
                  <div className="text-red-600">{d.fail || 0}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-800">No Run</div>
                  <div className="text-gray-600">{d.noRun || 0}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-800">% Complete</div>
                  <div className={pctClass}>{d.percentCompleteText || (d.percentComplete ? (d.percentComplete.toFixed(1) + '%') : '0%')}</div>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="text-sm font-bold text-gray-800 mb-1">Key Requirements</div>
              <div className="text-gray-800">{selectedLOB === 'auto' ? d.autoKeyRequirements : selectedLOB === 'home' ? d.homeKeyRequirements : selectedLOB === 'umbrella' ? d.umbrellaKeyRequirements : d.keyRequirements}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <div className="font-bold text-gray-800">State Ranking</div>
                <div className="text-gray-800">{d.stateRanking ?? 0}</div>
              </div>
              <div>
                <div className="font-bold text-gray-800">Total Forms</div>
                <div className="text-gray-800">{d.totalForms ?? 0}</div>
              </div>
              <div>
                <div className="font-bold text-gray-800">Auto Forms</div>
                <div className="text-gray-800">{d.autoForms ?? 0}</div>
              </div>
              <div>
                <div className="font-bold text-gray-800">Home/Dwelling</div>
                <div className="text-gray-800">{d.homeForms ?? 0}</div>
              </div>
              <div>
                <div className="font-bold text-gray-800">Umbrella</div>
                <div className="text-gray-800">{d.umbrella ?? 0}</div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const HorizontalTreeTimeline = () => {
      if (!timelineData || !selectedLOB) return null;
      
      const lobData = timelineData[selectedLOB];
      if (!lobData) return null;

      const years = ['2025', '2026', '2027', '2028', '2029', '2030'];
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

      // Handler to toggle year selection
      const handleYearClick = (year) => {
        // Clear any existing hover/details when changing year selection
        setHoveredState(null);
        setSelectedState(null);

        if (selectedYear === year) {
          setSelectedYear(null); // Deselect if already selected
        } else {
          setSelectedYear(year); // Select new year
        }
      };

      return (
        <div className="bg-white rounded-lg shadow-md p-3 mb-4">
          <div className="flex items-center mb-3">
            <h3 className="text-sm font-bold text-gray-800 capitalize flex items-center gap-2">
              <span>{selectedLOB} LOB Timeline</span>
              <span className="text-xs text-gray-500 italic">Hover over or click a state to see details</span>
            </h3>
          </div>

          {/* Horizontal Timeline with Quarters */}
          <div className="relative pt-2 pb-4">
            {/* Timeline Bar */}
            <div className="absolute top-6 left-8 right-8 h-0.5 bg-blue-300"></div>
            
            {/* Years and Quarters */}
            <div className="flex justify-between relative px-6">
              {years.map((year, yearIndex) => {
                const yearData = lobData[year];
                const totalStatesInYear = quarters.reduce((sum, q) => 
                  sum + (yearData[q]?.length || 0), 0
                );

                return (
                  <div key={year} className="flex flex-col items-center flex-1 relative">
                    {/* Year Label */}
                    <div className="text-sm font-bold text-gray-800 mb-1">{year}</div>
                    
                    {/* Year Marker - CLICKABLE */}
                    <button
                      onClick={() => handleYearClick(year)}
                      disabled={totalStatesInYear === 0}
                      className={`w-3 h-3 rounded-full z-10 mb-1 shadow-sm transition-all ${
                        totalStatesInYear === 0 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : selectedYear === year
                            ? 'bg-yellow-500 ring-2 ring-yellow-300'
                            : 'bg-usaa-blue hover:bg-usaa-navy-700 cursor-pointer'
                      }`}
                      title={totalStatesInYear === 0 ? 'No states' : 'Click to view quarters'}
                    ></button>
                    
                    {/* State Count */}
                    <div className="text-[10px] text-gray-500">
                      {totalStatesInYear} {totalStatesInYear === 1 ? 'state' : 'states'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quarter Details Below - Shows when year is selected */}
            {selectedYear && (
              <div className="mt-4 border-t border-gray-300 pt-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800 text-xs">{selectedYear} - Quarters Breakdown</h4>
                    <button
                      onClick={() => {
                        setSelectedYear(null);
                        setHoveredState(null);
                        setSelectedState(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                    >
                      Close ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {quarters.map(quarter => {
                      const states = lobData[selectedYear][quarter] || [];
                      
                      return (
                        <div key={quarter} className={`border rounded p-1.5 ${
                          states.length === 0 ? 'border-gray-300 bg-white' : 'border-gray-400 bg-white'
                        }`}>
                          <div className="font-semibold text-gray-800 text-center mb-1 text-xs bg-gray-100 py-0.5 rounded">
                            {quarter}
                          </div>
                          {states.length === 0 ? (
                            <div className="text-center text-gray-400 text-[10px] py-1">No states</div>
                          ) : (
                            <div className="flex flex-wrap gap-0.5 justify-center">
                              {states.map((state, idx) => {
                                const c = stateData?.[state.code]?.autoTestingComplexity || state.complexity;
                                const colors = {
                                  'Low': '#1a3a5c',
                                  'Medium': '#4a90c2',
                                  'High': '#a8d4f0',
                                  'Critical': '#7ed321'
                                };
                                return (
                                  <span
                                    key={idx}
                                    className="px-1 py-0.5 text-white font-semibold rounded text-[10px] cursor-pointer hover:opacity-80"
                                    style={{ backgroundColor: colors[c] || '#6b7280' }}
                                    title={`${state.name} - ${c}`}
                                  >
                                    {state.code}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    const DataVisualizationCharts = () => {
      // Prepare data for charts
      const statesArray = Object.entries(stateData).map(([code, data]) => ({
        code,
        ...data
      }));

      // Sort states by total forms for top 10
      const top10States = [...statesArray]
        .sort((a, b) => b.totalForms - a.totalForms)
        .slice(0, 10);

      // Testing Complexity distribution
      const complexityData = statesArray.reduce((acc, state) => {
        acc[state.testingComplexity] = (acc[state.testingComplexity] || 0) + 1;
        return acc;
      }, {});

      // Filing Types distribution
      const filingTypeData = statesArray.reduce((acc, state) => {
        acc[state.filingType] = (acc[state.filingType] || 0) + 1;
        return acc;
      }, {});

      // Rate Regulation distribution
      const regulationData = statesArray.reduce((acc, state) => {
        acc[state.rateRegulation] = (acc[state.rateRegulation] || 0) + 1;
        return acc;
      }, {});

      // Product forms data
      const productData = [
        { name: 'Auto', value: kpiData.totalAuto, color: '#3b82f6' },
        { name: 'Home', value: kpiData.totalHome, color: '#ec4899' },
        { name: 'Umbrella', value: Object.values(stateData).reduce((sum, s) => sum + s.umbrella, 0), color: '#8b5cf6' }
      ];

      return (
        <div className="space-y-4">
          {/* Row 1: Product Forms + Testing Complexity + Filing Types */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bar Chart: Forms by Product Type */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Forms by Product Type</h3>
              <div className="h-48">
                <div className="flex items-end justify-around h-full gap-2 pb-6">
                  {productData.map((product) => {
                    const maxValue = Math.max(...productData.map(p => p.value));
                    const heightPercent = (product.value / maxValue) * 100;
                    return (
                      <div key={product.name} className="flex flex-col items-center flex-1">
                        <div className="text-xs font-semibold mb-1">{product.value}</div>
                        <div
                          className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                          style={{
                            backgroundColor: product.color,
                            height: `${heightPercent}%`,
                            minHeight: '20px'
                          }}
                        ></div>
                        <div className="text-xs font-medium mt-1">{product.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stacked Bar: Testing Complexity Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Testing Complexity Distribution</h3>
              <div className="space-y-2">
                {Object.entries(complexityData).map(([level, count]) => {
                  const colors = {
                    'Low': '#7fb069',
                    'Medium': '#b8985f',
                    'High': '#8b4513',
                    'Critical': '#e74c3c'
                  };
                  const percentage = (count / statesArray.length) * 100;
                  return (
                    <div key={level}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{level}</span>
                        <span className="text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-5">
                        <div
                          className="h-5 rounded-full transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: colors[level],
                            minWidth: count > 0 ? '25px' : '0'
                          }}
                        >
                          {count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pie Chart: Filing Types */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Filing Type Distribution</h3>
              <div className="space-y-1.5">
                {Object.entries(filingTypeData).map(([type, count], index) => {
                  const colors = ['#3b82f6', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981'];
                  const percentage = (count / statesArray.length) * 100;
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded flex-shrink-0"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium truncate">{type}</span>
                          <span className="text-gray-600 ml-2">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 2: Top 10 States + Histogram */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Line Chart: Top 10 States by Total Forms */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Top 10 States by Total Forms</h3>
              <div className="h-52 relative">
                <svg viewBox="0 0 800 200" className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="50"
                      y1={30 + i * 35}
                      x2="750"
                      y2={30 + i * 35}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Line chart */}
                  {top10States.map((state, index) => {
                    if (index === top10States.length - 1) return null;
                    const x1 = 100 + index * 70;
                    const x2 = 100 + (index + 1) * 70;
                    const maxForms = top10States[0].totalForms;
                    const y1 = 170 - (state.totalForms / maxForms) * 120;
                    const y2 = 170 - (top10States[index + 1].totalForms / maxForms) * 120;
                    
                    return (
                      <g key={state.code}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#3b82f6"
                          strokeWidth="2"
                        />
                        <circle cx={x1} cy={y1} r="4" fill="#3b82f6" />
                      </g>
                    );
                  })}
                  
                  {/* Last point */}
                  {top10States.length > 0 && (
                    <circle
                      cx={100 + (top10States.length - 1) * 70}
                      cy={170 - (top10States[top10States.length - 1].totalForms / top10States[0].totalForms) * 120}
                      r="4"
                      fill="#3b82f6"
                    />
                  )}
                  
                  {/* Labels */}
                  {top10States.map((state, index) => {
                    const x = 100 + index * 70;
                    const maxForms = top10States[0].totalForms;
                    const y = 170 - (state.totalForms / maxForms) * 120;
                    return (
                      <g key={state.code}>
                        <text x={x} y="190" textAnchor="middle" className="text-xs font-medium">{state.code}</text>
                        <text x={x} y={y - 8} textAnchor="middle" className="text-xs font-bold" fill="#3b82f6">{state.totalForms}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Histogram: Distribution of Total Forms */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Total Forms Distribution</h3>
              <div className="h-52">
                {(() => {
                  const bins = [
                    { range: '0-100', min: 0, max: 100, color: '#dbeafe' },
                    { range: '100-150', min: 100, max: 150, color: '#93c5fd' },
                    { range: '150-200', min: 150, max: 200, color: '#60a5fa' },
                    { range: '200-300', min: 200, max: 300, color: '#3b82f6' },
                    { range: '300+', min: 300, max: Infinity, color: '#1e40af' }
                  ];
                  
                  const histogram = bins.map(bin => ({
                    ...bin,
                    count: statesArray.filter(s => s.totalForms >= bin.min && s.totalForms < bin.max).length
                  }));
                  
                  const maxCount = Math.max(...histogram.map(h => h.count));
                  
                  return (
                    <div className="flex items-end justify-around h-full gap-2 pb-6">
                      {histogram.map((bin) => {
                        const heightPercent = maxCount > 0 ? (bin.count / maxCount) * 100 : 0;
                        return (
                          <div key={bin.range} className="flex flex-col items-center flex-1">
                            <div className="text-xs font-semibold mb-1">{bin.count}</div>
                            <div
                              className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                              style={{
                                backgroundColor: bin.color,
                                height: `${heightPercent}%`,
                                minHeight: bin.count > 0 ? '15px' : '5px'
                              }}
                            ></div>
                            <div className="text-xs font-medium mt-1 text-center">{bin.range}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Row 3: Bubble Chart (Full Width) */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Auto Forms vs Home Forms (Bubble Size = Total Forms)</h3>
            <div className="h-64 relative bg-gray-50 rounded-lg p-2">
              <svg viewBox="0 0 600 250" className="w-full h-full">
                {/* Axes */}
                <line x1="40" y1="220" x2="560" y2="220" stroke="#374151" strokeWidth="2" />
                <line x1="40" y1="30" x2="40" y2="220" stroke="#374151" strokeWidth="2" />
                
                {/* Axis labels */}
                <text x="300" y="245" textAnchor="middle" className="text-xs font-semibold">Auto Forms</text>
                <text x="15" y="125" textAnchor="middle" className="text-xs font-semibold" transform="rotate(-90 15 125)">Home Forms</text>
                
                {/* Bubbles */}
                {statesArray.slice(0, 30).map((state) => {
                  const maxAuto = Math.max(...statesArray.map(s => s.autoForms));
                  const maxHome = Math.max(...statesArray.map(s => s.homeForms));
                  const maxTotal = Math.max(...statesArray.map(s => s.totalForms));
                  
                  const x = 40 + (state.autoForms / maxAuto) * 520;
                  const y = 220 - (state.homeForms / maxHome) * 190;
                  const radius = 4 + (state.totalForms / maxTotal) * 15;
                  
                  const complexityColors = {
                    'Low': '#7fb069',
                    'Medium': '#b8985f',
                    'High': '#8b4513',
                    'Critical': '#e74c3c'
                  };
                  
                  return (
                    <g key={state.code}>
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill={complexityColors[state.testingComplexity]}
                        opacity="0.6"
                        className="hover:opacity-100 transition-opacity"
                      />
                      <text
                        x={x}
                        y={y + 3}
                        textAnchor="middle"
                        className="text-xs font-bold pointer-events-none"
                        fill="#fff"
                      >
                        {state.code}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Row 4: Rate Regulation Summary */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Rate Regulation Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(regulationData).map(([type, count]) => (
                <div key={type} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-usaa-blue">{count}</div>
                  <div className="text-xs font-medium text-gray-700 mt-1 truncate" title={type}>{type}</div>
                  <div className="text-xs text-gray-500">{((count / statesArray.length) * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    // Memoized US map component with DIM EFFECT
const USMap = React.memo(({ usTopo, stateAbbreviations, selectedYearStateSet, hoveredState, stateData, getStateColor, setHoverThrottled, setSelectedState }) => {
  if (!usTopo) {
    return <div className="h-64 flex items-center justify-center text-sm text-gray-500">Loading US map...</div>;
  }
  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={usTopo}>
        {({ geographies }) => (
          <>
            {geographies.map((geo) => {
              const name = geo.properties.name;
              const stateCode = stateAbbreviations[name];
              if (!stateCode) return null;
              const isInSelectedYear = selectedYearStateSet?.has(stateCode);
              const isHovered = hoveredState === stateCode;
              
              // Get the base color from complexity
              let fillColor = getStateColor(stateCode);
              let opacity = 1;
              let strokeWidth = 1;
              let strokeColor = '#fff';
              let pointerEvents = 'auto';
              let filterValue = 'none';
              
              // Apply DIM EFFECT when year is selected
              if (selectedYearStateSet && selectedYearStateSet.size > 0) {
                if (!isInSelectedYear) {
                  // Blur and dim non-selected states; disable interaction
                  opacity = 0.35; // was 10; keep visible but dimmed
                  pointerEvents = 'none';
                  filterValue = 'blur(1.2px) grayscale(50%)';
                } else {
                  // Highlight selected states with golden border
                  strokeWidth = 2;
                  strokeColor = '#fbbf24';
                }
              }
              
              // Hover effect (overrides selection)
              if (isHovered) {
                strokeWidth = 2.5;
                strokeColor = '#1e40af';
                opacity = 1; // fix incorrect 10 -> 1
                filterValue = 'none';
              }
              
              const centroid = geoCentroid(geo);
              const c = selectedLOB === 'auto'
                ? stateData?.[stateCode]?.autoTestingComplexity
                : selectedLOB === 'home'
                ? stateData?.[stateCode]?.homeTestingComplexity
                : selectedLOB === 'umbrella'
                ? stateData?.[stateCode]?.umbrellaTestingComplexity
                : stateData?.[stateCode]?.testingComplexity;
              const cNorm = selectedLOB !== 'auto' && c === 'Critical' ? 'High' : c;
              const labelFill = cNorm === 'Low' ? '#ffffff' : '#1f2937';
                    
              return (
                <React.Fragment key={geo.rsmKey}>
                  <Geography
                    geography={geo}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    onMouseEnter={() => {
                      cancelLeave();
                      if (hoveredRef.current !== stateCode) setHoverThrottled(stateCode);
                    }}
                    onMouseLeave={() => {
                      cancelLeave();
                      leaveTimeoutRef.current = setTimeout(() => {
                        // Clear hover and selection if pointer is not on any state
                        if (hoveredRef.current === stateCode) {
                          setHoverThrottled(null);
                          setSelectedState(null);
                        }
                      }, 80);
                    }}
                    onClick={() => {
                      if (!selectedYearStateSet || isInSelectedYear) {
                        setSelectedState(stateCode);
                      }
                    }}
                    style={{
                      default: { 
                        outline: 'none',
                        opacity: opacity,
                        pointerEvents: pointerEvents,
                        filter: filterValue,
                        cursor: pointerEvents === 'none' ? 'default' : 'pointer',
                        transition: 'all 0.3s ease-in-out'
                      },
                      hover: { 
                        outline: 'none',
                        opacity: 1,
                        pointerEvents: pointerEvents,
                        filter: filterValue,
                        cursor: pointerEvents === 'none' ? 'default' : 'pointer',
                        transition: 'all 0.2s ease-in-out'
                      },
                      pressed: { outline: 'none' },
                    }}
                  />
                  <Marker coordinates={centroid}>
                    <text
                      textAnchor="middle"
                      className="pointer-events-none text-xs font-bold"
                      fill={labelFill}
                      style={{
                        opacity: opacity,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      {stateCode}
                    </text>
                  </Marker>
                </React.Fragment>
              );
            })}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
});        

    const OverviewContent = () => {
      const selectedYearStateSet = useMemo(() => {
        if (!selectedYear || !timelineData || !selectedLOB) return null;
        const yearData = timelineData[selectedLOB][selectedYear];
        if (!yearData) return null;
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const codes = new Set();
        quarters.forEach((q) => yearData[q]?.forEach((s) => codes.add(s.code)));
        return codes;
      }, [selectedYear, timelineData, selectedLOB]);

      const selectedYearComplexity = useMemo(() => {
        if (!selectedYear || !timelineData || !selectedLOB) return null;
        const yearData = timelineData[selectedLOB][selectedYear];
        if (!yearData) return null;
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const map = {};
        quarters.forEach((q) => yearData[q]?.forEach((s) => { map[s.code] = s.complexity; }));
        return map;
      }, [selectedYear, timelineData, selectedLOB]);

      const getColorForSelectedYear = useCallback((code) => {
        if (selectedLOB === 'auto') {
          const c = stateData?.[code]?.autoTestingComplexity;
          if (c === 'Low') return '#1a3a5c';
          if (c === 'Medium') return '#4a90c2';
          if (c === 'High') return '#a8d4f0';
          if (c === 'Critical') return '#7ed321';
          return getStateColor(code);
        }
        const c = selectedYearComplexity?.[code] ?? (
          selectedLOB === 'home' ? stateData?.[code]?.homeTestingComplexity
          : selectedLOB === 'umbrella' ? stateData?.[code]?.umbrellaTestingComplexity
          : stateData?.[code]?.testingComplexity
        );
        const cNorm = selectedLOB !== 'auto' && c === 'Critical' ? 'High' : c;
        if (cNorm === 'Low') return '#1a3a5c';
        if (cNorm === 'Medium') return '#4a90c2';
        if (cNorm === 'High') return '#a8d4f0';
        if (cNorm === 'Critical') return '#7ed321';
        return getStateColor(code);
      }, [selectedYearComplexity, selectedLOB, stateData, getStateColor]);

      // Memoized per-state renderer to avoid unnecessary re-renders
      const GeoState = React.memo(
        ({ geo, stateCode, centroid, fill, labelFill, onEnter, onLeave, onClick }) => (
          <>
            <Geography
              geography={geo}
              fill={fill}
              stroke="#fff"
              strokeWidth={1}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              onClick={onClick}
              style={{
                default: { outline: 'none' },
                hover: { outline: 'none' },
                pressed: { outline: 'none' },
              }}
            />
            <Marker coordinates={centroid}>
              <text
                textAnchor="middle"
                className="pointer-events-none text-xs font-bold"
                fill={labelFill}
              >
                {stateCode}
              </text>
            </Marker>
          </>
        ),
        (prev, next) =>
          prev.fill === next.fill &&
          prev.labelFill === next.labelFill &&
          prev.stateCode === next.stateCode &&
          prev.centroid[0] === next.centroid[0] &&
          prev.centroid[1] === next.centroid[1]
      );

      return (
      <>
        

        {/* Conditional Content based on selectedLOB */}{selectedLOB === 'overview' ? (
  <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="relative">
      <>
        <div className="absolute top-0 left-0 text-sm font-bold text-gray-800">USAA Global Regions</div>
        {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
          <div ref={googleMapElRef} className="mt-0 h-[420px] w-full rounded-md overflow-hidden" />
        ) : (
          <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 160 }} className="-mt-4">
            <Geographies geography={worldTopo}>
              {({ geographies }) => (
                <>
                  {geographies.map((geo, idx) => {
                    const [lon, lat] = geoCentroid(geo);
                    const locs = [
                      {c:[-98.5795, 39.8283], col:'#8b5cf6'},
                      {c:[-88.4976, 17.1899], col:'#ef4444'},
                      {c:[-77.7812, 21.5218], col:'#22c55e'},
                      {c:[-66.5901, 18.2208], col:'#1e40af'},
                      {c:[-64.8963, 18.3358], col:'#e11d48'},
                      {c:[-25.6756, 37.7412], col:'#f59e0b'},
                      {c:[-8.2245, 39.3999], col:'#ea580c'},
                      {c:[-3.7492, 40.4637], col:'#dc2626'},
                      {c:[-3.4360, 55.3781], col:'#10b981'},
                      {c:[2.2137, 46.2276], col:'#3b82f6'},
                      {c:[5.2913, 52.1326], col:'#f59e0b'},
                      {c:[10.4515, 51.1657], col:'#6366f1'},
                      {c:[14.5501, 47.5162], col:'#f97316'},
                      {c:[12.5674, 41.8719], col:'#ef4444'},
                      {c:[21.8243, 39.0742], col:'#a855f7'},
                      {c:[127.7669, 35.9078], col:'#06b6d4'},
                      {c:[144.7937, 13.4443], col:'#22c55e'}
                    ];
                    const palette = ['#c7d2fe','#fecaca','#fde68a','#bbf7d0','#a5f3fc','#fbcfe8','#f5d0fe','#fde68a','#d1fae5','#bfdbfe','#fcd34d','#fca5a5'];
                    let color = palette[idx % palette.length];
                    let min = Infinity, match = null;
                    for (const p of locs) {
                      const dLon = Math.abs(lon - p.c[0]);
                      const dLat = Math.abs(lat - p.c[1]);
                      const score = dLon + dLat;
                      if (score < min) { min = score; match = p; }
                    }
                    
                    return (
                      <Geography 
                        key={geo.rsmKey} 
                        geography={geo} 
                        fill={color} 
                        stroke="#fff" 
                        strokeWidth={0.5} 
                      />
                    );
                  })}
                  {(() => {
                const locations = [
                  {n:'United States', code:'USA', c:[-98.5795, 39.8283], col:'#8b5cf6'},
                  {n:'Belize', code:'BEL', c:[-88.4976, 17.1899], col:'#ef4444'},
                  {n:'Cuba', code:'CUB', c:[-77.7812, 21.5218], col:'#22c55e'},
                  {n:'Puerto Rico', code:'PR', c:[-66.5901, 18.2208], col:'#1e40af'},
                  {n:'Virgin Islands', code:'VI', c:[-64.8963, 18.3358], col:'#e11d48'},
                  {n:'Azores', code:'AZO', c:[-25.6756, 37.7412], col:'#f59e0b'},
                  {n:'Portugal', code:'POR', c:[-8.2245, 39.3999], col:'#ea580c'},
                  {n:'Spain', code:'SPN', c:[-3.7492, 40.4637], col:'#dc2626'},
                  {n:'United Kingdom', code:'UK', c:[-3.4360, 55.3781], col:'#10b981'},
                  {n:'France', code:'FRN', c:[2.2137, 46.2276], col:'#3b82f6'},
                  {n:'Netherlands', code:'NET', c:[5.2913, 52.1326], col:'#f59e0b'},
                  {n:'Germany', code:'GER', c:[10.4515, 51.1657], col:'#6366f1'},
                  {n:'Austria', code:'UST', c:[14.5501, 47.5162], col:'#f97316'},
                  {n:'Italy', code:'ITA', c:[12.5674, 41.8719], col:'#ef4444'},
                  {n:'Greece', code:'GRC', c:[21.8243, 39.0742], col:'#a855f7'},
                  {n:'South Korea', code:'SKO', c:[127.7669, 35.9078], col:'#06b6d4'},
                  {n:'Guam', code:'GU', c:[144.7937, 13.4443], col:'#22c55e'}
                ];
                
const labelOffsets = {
  'USA': {dx: -50, dy: -25, align: 'end'},
  'BEL': {dx: -60, dy: 25, align: 'end'},
  'CUB': {dx: -50, dy: -20, align: 'end'},
  'PR': {dx: 15, dy: 35, align: 'start'},
  'VI': {dx: 45, dy: 20, align: 'start'},
  'AZO': {dx: -60, dy: -20, align: 'end'},
  'POR': {dx: -25, dy: 55, align: 'start'},
  'SPN': {dx: -25, dy: -10, align: 'end'},
  'UK': {dx: -55, dy: -30, align: 'end'},
  'FRN': {dx: -65, dy: -5, align: 'start'},
  'NET': {dx: 45, dy: -40, align: 'start'},
  'GER': {dx: 50, dy: -25, align: 'start'},
  'UST': {dx: 55, dy: -10, align: 'start'},
  'ITA': {dx: 55, dy: 15, align: 'start'},
  'GRC': {dx: 55, dy: 25, align: 'start'},
  'SKO': {dx: 50, dy: -20, align: 'start'},
  'GU': {dx: -55, dy: -15, align: 'end'}
};
                
                return locations.map((p, i) => {
                  const offset = labelOffsets[p.code];
                  return (
                    <Marker key={i} coordinates={p.c}>
                      <line 
                        x1={0} 
                        y1={0} 
                        x2={offset.dx * 0.7} 
                        y2={offset.dy * 0.7} 
                        stroke="#9ca3af" 
                        strokeWidth={1}
                      />
                      <circle r={5} fill={p.col} stroke="#fff" strokeWidth={1.5} />
                      <text 
                        x={offset.dx} 
                        y={offset.dy} 
                        textAnchor={offset.align} 
                        className="text-[8px] font-bold" 
                        fill="#1f2937"
                      >
                        {p.n} ({p.code})
                      </text>
                    </Marker>
                  );
                });
              })()}
                </>
          )}
        </Geographies>
      </ComposableMap>
        )}
      </>
      </div>
  </div>
) : (
          /* Map view for Auto, Home, Umbrella */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section - 2/3 width */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <div className="relative bg-gray-50 rounded-lg p-4">
                <USMap
                  usTopo={usTopo}
                  stateAbbreviations={stateAbbreviations}
                  selectedYearStateSet={selectedYearStateSet}
                  hoveredState={hoveredState}
                  stateData={stateData}
                  getStateColor={selectedYear ? getColorForSelectedYear : getStateColor}
                  setHoverThrottled={setHoverThrottled}
                  setSelectedState={setSelectedState}
                />
                
                {/* Legend and Title: Auto-specific positioning; others remain centered below */}
                {(() => {
                  const title = selectedLOB === 'auto' ? 'Personal Auto - USAA complexity' : selectedLOB === 'home' ? 'Home/Dwelling - USAA complexity' : 'Umbrella - USAA complexity';
                  return (
                    <>
                      <div className="absolute top-2 left-4 text-sm font-bold text-gray-800">{title}</div>
                      <div className="absolute top-2 right-4 flex items-center justify-end gap-4 text-sm bg-white/80 rounded-md px-2 py-1 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{backgroundColor: '#1a3a5c'}}></div>
                          <span>Low</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{backgroundColor: '#4a90c2'}}></div>
                          <span>Medium</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{backgroundColor: '#a8d4f0'}}></div>
                          <span>High</span>
                        </div>
                        {selectedLOB === 'auto' && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{backgroundColor: '#7ed321'}}></div>
                            <span>Critical</span>
                          </div>
                        )}
                        {selectedYear && (
                          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
                            <div className="w-4 h-4 rounded" style={{backgroundColor: '#fbbf24'}}></div>
                            <span className="font-semibold">Year {selectedYear}</span>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Right Sidebar - State Details */}
            <div className="space-y-6">
              {(hoveredState || selectedState) && stateData[hoveredState || selectedState] ? (
                <StateDetailPanel code={hoveredState || selectedState} />
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <p className="text-gray-500 text-center italic">Hover over or click a state to see details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
        {/* Left Navigation Pane */}
        <div className="w-48 bg-usaa-navy text-white p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1">Dashboard</h2>
            <p className="text-xs text-gray-400 truncate" title={fileName}>{fileName}</p>
          </div>
          <nav className="flex-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 mt-0">Lines of Business</h3>
            
            <button
              onClick={() => {
                setSelectedLOB('auto');
                setExpandedYears({});
                setExpandedQuarters({});
                setSelectedYear(null);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-2 transition-colors ${
                selectedLOB === 'auto' ? 'bg-usaa-blue' : 'hover:bg-usaa-navy-700'
              }`}
            >
              <Car className="w-4 h-4" />
              <span className="font-medium text-sm">Auto</span>
            </button>

            <button
              onClick={() => {
                setSelectedLOB('home');
                setExpandedYears({});
                setExpandedQuarters({});
                setSelectedYear(null);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-2 transition-colors ${
                selectedLOB === 'home' ? 'bg-usaa-blue' : 'hover:bg-usaa-navy-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="font-medium text-sm">Dwelling</span>
            </button>

            <button
              onClick={() => {
                setSelectedLOB('umbrella');
                setExpandedYears({});
                setExpandedQuarters({});
                setSelectedYear(null);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-2 transition-colors ${
                selectedLOB === 'umbrella' ? 'bg-usaa-blue' : 'hover:bg-usaa-navy-700'
              }`}
            >
              <Umbrella className="w-4 h-4" />
              <span className="font-medium text-sm">Umbrella</span>
            </button>

            <button
              onClick={() => {
                setSelectedLOB('overview');
                setExpandedYears({});
                setExpandedQuarters({});
                setSelectedYear(null);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-2 transition-colors ${
                selectedLOB === 'overview' ? 'bg-usaa-blue' : 'hover:bg-usaa-navy-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium text-sm">USAA Regions</span>
            </button>
          </nav>

          <button
            onClick={() => {
              setFileUploaded(false);
              setStateData(null);
              setFileName('');
              setSelectedLOB(null);
              setSelectedYear(null);
            }}
            className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-sm transition-colors"
          >
            Upload New
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Horizontal Tree Timeline at Top - only for LOB views */}
          {selectedLOB && selectedLOB !== 'overview' && <HorizontalTreeTimeline />}
          
          {/* Overview Content Below */}
          <OverviewContent />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (fileUploaded) {
      document.body.classList.add('dashboard-mode');
    } else {
      document.body.classList.remove('dashboard-mode');
    }
  }, [fileUploaded]);

  const renderContent = () => {
    if (appMode === 'home') return <HomePage />;
    if (appMode === 'test') return <TestDashboardWrapper onBack={() => navigate('home')} />;
    if (appMode === 'quality') return <QualityIntelligenceWrapper onBack={() => navigate('home')} />;
    if (appMode === 'story2prod') return <Story2ProdLanding />;
    if (appMode === 'state-rollout') {
      if (!stateData) {
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6 text-sm">Loading state rollout data...</div>
          </div>
        );
      }
      return <Dashboard />;
    }
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <img src={headerImg} alt="Header" className="h-10 cursor-pointer" onClick={() => navigate('home')} />
          {appMode !== 'home' && (
            <button
              onClick={() => navigate('home')}
              className="px-3 py-2 bg-usaa-blue text-white rounded hover:bg-usaa-navy-700"
            >
              Back to Home
            </button>
          )}
        </div>
      </header>
      <main className="flex-1">
        {renderContent()}
      </main>
      <footer className="w-full bg-usaa-blue">
        <div className="w-full px-4 py-2 text-white text-xs flex items-center justify-between">
          <span>2025 © ValueMomentum All Rights Reserved</span>
          <span>Let's insure the future. Together.</span>
        </div>
      </footer>
    </div>
  );
};

export default InsuranceAnalyticsPlatform;
