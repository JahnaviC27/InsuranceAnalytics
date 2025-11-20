import React, { useState } from 'react'
import DefectLeakageChart from './Chart1_Defect_Leakage_Analysis.jsx'
import QAInvestmentChart from './Chart2_QA_Investment_Analysis.jsx'
import CoverageLeakageChart from './Chart3_Coverage_Leakage_Correlation.jsx'
import TestCaseEfficiency from './Chart4_Test_Case_Efficiency.jsx'
import PortfolioDashboard from './Chart5_Portfolio_Dashboard.jsx'
import ROIQuadrant from './Chart6_ROI_Quadrant_Analysis.jsx'
import OptimizationScenarios from './Chart7_Optimization_Scenarios.jsx'

const Tabs = () => {
  const [active, setActive] = useState('portfolio');
  const items = [
    { key: 'portfolio', label: 'Portfolio Dashboard' },
    { key: 'defect', label: 'Defect Leakage' },
    { key: 'qa', label: 'QA Investment' },
    { key: 'coverage', label: 'Coverage vs Leakage' },
    { key: 'efficiency', label: 'Test Case Efficiency' },
    { key: 'roi', label: 'ROI Quadrant' },
    { key: 'optimize', label: 'Optimization Scenarios' },
  ];
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {items.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={
              active === t.key
                ? 'px-3 py-1.5 rounded bg-usaa-blue text-white'
                : 'px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-2">
        {active === 'defect' && <DefectLeakageChart variant="full" />}
        {active === 'qa' && <QAInvestmentChart variant="full" />}
        {active === 'coverage' && <CoverageLeakageChart />}
        {active === 'efficiency' && <TestCaseEfficiency />}
        {active === 'portfolio' && <PortfolioDashboard />}
        {active === 'roi' && <ROIQuadrant />}
        {active === 'optimize' && <OptimizationScenarios />}
      </div>
    </div>
  )
}

const Story2ProdLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-usaa-navy to-usaa-blue text-white rounded-xl p-6 mb-6 shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Story2Prod</h1>
              <p className="opacity-80">Executive Dashboard</p>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <div className="text-lg font-bold">Insights</div>
                <div className="opacity-80">Charts curated for leadership</div>
              </div>
              <div>
                <div className="text-lg font-bold">Live</div>
                <div className="opacity-80">Interactive analytics</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <Tabs />
        </div>
      </div>
    </div>
  )
}

export default Story2ProdLanding