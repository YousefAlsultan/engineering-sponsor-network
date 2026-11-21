'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const DURATION_MS = 5200;
const DISABLE_KEY = 'sponsierra-never-mission-animation-v2';

export default function RocketMoonLoader() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (localStorage.getItem(DISABLE_KEY) === 'yes' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), DURATION_MS);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setVisible(false); };
    window.addEventListener('keydown', onEscape);
    return () => { document.body.style.overflow = previous;window.removeEventListener('keydown', onEscape); };
  }, [visible]);

  if (!visible) return null;
  return <div className="ss-mission-loader ss-ml-earth-moon" role="dialog" aria-modal="true" aria-label="Rocket traveling from Earth to the orbiting Moon and back as the sponsor marketplace loads">
    <div className="ss-ml-grid" aria-hidden="true" />
    <div className="ss-ml-main">
      <p className="ss-ml-loading-label">Deploying your sponsor marketplace</p>
      <div className="ss-ml-scene" aria-hidden="true">
        <svg viewBox="0 0 900 470" xmlns="http://www.w3.org/2000/svg" role="presentation">
          <defs>
            <radialGradient id="mlEarth" cx=".35" cy=".29" r=".8"><stop stopColor="#91d9ff"/><stop offset=".56" stopColor="#2872c6"/><stop offset="1" stopColor="#103b78"/></radialGradient>
            <radialGradient id="mlMoon" cx=".33" cy=".3" r=".78"><stop stopColor="#f3f2f1"/><stop offset=".72" stopColor="#a9b5c8"/><stop offset="1" stopColor="#738399"/></radialGradient>
            <linearGradient id="mlRocketHull" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#aebecb"/></linearGradient>
          </defs>
          <g className="ss-ml-stars" fill="#d6e5fb"><circle cx="78" cy="87" r="2"/><circle cx="365" cy="78" r="2.5"/><circle cx="511" cy="115" r="2"/><circle cx="817" cy="80" r="2.1"/><circle cx="862" cy="336" r="2"/><circle cx="570" cy="399" r="2.3"/><circle cx="90" cy="359" r="2"/><circle cx="341" cy="383" r="1.5"/></g>
          <path className="ss-ml-transfer-orbit" d="M264 306C380 108 554 88 696 165C792 225 500 423 264 306" fill="none" stroke="#7c95ba" strokeDasharray="7 11" strokeWidth="2" opacity=".5" />
          <g className="ss-ml-earth" transform="translate(211 306)">
            <circle r="108" fill="#438de1" opacity=".12"/><circle r="95" fill="url(#mlEarth)" stroke="#7bc3ff" strokeWidth="3"/>
            <path d="M-80-32l23-31 26-6 19 21-10 16 21 16-12 22-28-1-16 22-18-24zM14-79l36 14 25 20-9 24-26-7-18 16-24-27zM-20 38l22-12 24 12 33 5-6 24-22 5-15 22-20-8-14-24z" fill="#66ceac" opacity=".89"/>
            <path d="M-79 28l27 7 18 23-4 18m92-99l23 13m-99-45l18-13" fill="none" stroke="#cce7ff" strokeWidth="6" opacity=".36" strokeLinecap="round"/>
          </g>
          <g className="ss-ml-moon-orbit"><g transform="translate(709 166)">
            <circle r="67" fill="#b7cbe8" opacity=".13"/><circle r="58" fill="url(#mlMoon)" stroke="#cad6e5" strokeWidth="2"/>
            <g fill="#708198" opacity=".39"><circle cx="-21" cy="-16" r="16"/><circle cx="24" cy="13" r="11"/><circle cx="-6" cy="32" r="8"/><circle cx="18" cy="-28" r="7"/></g>
            <g fill="none" stroke="#e6edf5" opacity=".65" strokeWidth="2"><circle cx="-21" cy="-16" r="16"/><circle cx="24" cy="13" r="11"/><circle cx="-6" cy="32" r="8"/></g>
          </g></g>
          <g className="ss-ml-rocket">
            <path d="M-40-13L-62-25l7 25-7 25 22-12z" fill="#cc1748"/>
            <path d="M-33-13h41q21 0 38 13-17 13-38 13h-41z" fill="url(#mlRocketHull)" stroke="#8396ae" strokeWidth="2"/>
            <path d="M-18-12L-30-25H-7L2-12M-18 12L-30 25H-7L2 12" fill="#ba1642"/>
            <circle cx="14" cy="0" r="8" fill="#88c5e9" stroke="#3c627d" strokeWidth="2"/>
            <path className="ss-ml-rocket-flame" d="M-48-7L-84 0l36 7z" fill="#ffbd66"/>
            <circle cx="15" cy="-2" r="2.4" fill="#f3fbff"/>
            <animateMotion dur="4.6s" repeatCount="indefinite" rotate="auto" path="M270 286 C375 115 552 77 650 144 C706 166 722 175 700 193 C560 369 374 393 270 286" />
          </g>
        </svg>
      </div>
      <div className="ss-ml-progress" aria-hidden="true"><span/></div>
    </div>
    <div className="ss-ml-bottom"><div className="ss-ml-actions">
      <button type="button" onClick={() => setVisible(false)}>Skip animation <ArrowRight size={15}/></button>
      <button type="button" onClick={() => { localStorage.setItem(DISABLE_KEY,'yes');setVisible(false); }}>Never show again <X size={14}/></button>
    </div></div>
  </div>;
}
