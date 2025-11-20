import React, { useEffect, useRef, useState } from 'react';
import qualityHtml from '/USAA_Quality_Dashboards_Interactive.html?raw';

const QualityIntelligenceWrapper = ({ onBack }) => {
  const [now, setNow] = useState(() => new Date().toLocaleString('en-US', { hour12: true }));
  const headerRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(window.innerHeight);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toLocaleString('en-US', { hour12: true })), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const recalc = () => {
      const headerH = headerRef.current ? headerRef.current.offsetHeight : 0;
      setIframeHeight(window.innerHeight - headerH);
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, []);
  return (
    <div className="h-screen overflow-hidden bg-usaa-light flex flex-col">
      <div ref={headerRef} className="w-full px-4 py-3 border-b border-gray-200 bg-white text-usaa-navy">
        <div>
          <div className="font-semibold">P&C Quality Intelligence</div>
          <p className="mt-1">Real-Time End-to-End Testing Metrics | Traceability | Production Defect Intelligence</p>
          <p className="opacity-75">Updated: {now} | Refresh: Real-Time</p>
        </div>
      </div>
      <div className="flex-1">
        <iframe
          title="Quality Dashboards"
          srcDoc={qualityHtml}
          className="w-full h-full"
          style={{ border: 'none', height: iframeHeight }}
        />
      </div>
    </div>
  );
};

export default QualityIntelligenceWrapper;