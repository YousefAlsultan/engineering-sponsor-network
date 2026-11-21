'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const DURATION_MS = 4400;
const DISABLE_KEY = 'sponsierra-never-mission-animation-v2';

export default function MissionLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(DISABLE_KEY) === 'yes') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVisible(false);
    };
    window.addEventListener('keydown', dismissOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', dismissOnEscape);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="ss-mission-loader" role="dialog" aria-modal="true" aria-label="Animated rover deployer lowering a rover while SponSierra opens">
      <div className="ss-ml-grid" aria-hidden="true" />
      <div className="ss-ml-main">
        <p className="ss-ml-loading-label">Deploying your sponsor marketplace</p>

        <div className="ss-ml-scene" aria-hidden="true">
          <svg viewBox="0 0 900 470" xmlns="http://www.w3.org/2000/svg" role="presentation">
            <defs>
              <linearGradient id="mlPlanet" x1="0" y1="0" x2="0.85" y2="1">
                <stop stopColor="#f3b9a8" />
                <stop offset="0.5" stopColor="#d9736b" />
                <stop offset="1" stopColor="#ae3b4e" />
              </linearGradient>
              <linearGradient id="mlHull" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#fff" />
                <stop offset="1" stopColor="#c9ced8" />
              </linearGradient>
              <linearGradient id="mlGlass" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#88adc1" />
                <stop offset="1" stopColor="#283e58" />
              </linearGradient>
            </defs>

            <circle cx="128" cy="75" r="3" fill="#bfc4d0" className="ss-ml-star ss-ml-star-a" />
            <circle cx="745" cy="92" r="2.8" fill="#c4a1ac" className="ss-ml-star ss-ml-star-b" />
            <circle cx="816" cy="203" r="2" fill="#b7becd" className="ss-ml-star ss-ml-star-c" />
            <circle cx="205" cy="193" r="2.1" fill="#d4b5bf" />
            <path d="M250 102h16m-8-8v16M712 177h12m-6-6v12" stroke="#c5c9d2" strokeWidth="2" strokeLinecap="round" />
            <circle cx="450" cy="406" r="282" fill="#e3d8db" opacity=".15" />
            <ellipse cx="450" cy="416" rx="375" ry="41" fill="#c0a6a6" opacity=".14" />

            <g className="ss-ml-mars">
              <path d="M30 409C150 378 262 396 358 374c83-19 137-11 222 5 121 22 195-2 290 30v61H30z" fill="url(#mlPlanet)" />
              <path d="M30 410c141-30 237-10 339-34 81-18 149-3 223 10 107 20 193-3 278 24" fill="none" stroke="#ab5760" strokeWidth="5" opacity=".45" />
              <path d="M80 430c98-24 155 8 246-8m252 12c87-27 153 3 255-16" fill="none" stroke="#96384b" strokeWidth="7" strokeLinecap="round" opacity=".24" />
              <ellipse cx="263" cy="422" rx="29" ry="9" fill="#9f4550" opacity=".3" />
              <ellipse cx="682" cy="438" rx="51" ry="11" fill="#9f4550" opacity=".28" />
              <path d="M122 401l13-10 11 12m580-7 20-13 15 19" fill="#b8555d" opacity=".55" />
            </g>

            <ellipse className="ss-ml-rover-shadow" cx="456" cy="397" rx="63" ry="9" fill="#6a3444" />

            <g transform="translate(463 182)">
              <path className="ss-ml-tether" d="M0 0V153" fill="none" stroke="#8a96a9" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            <g transform="translate(463 354)">
              <g className="ss-ml-rover">
                <path d="M-47 19l-18 15m112-15 18 15M-20 17l-8 19m48-19 8 19" stroke="#424b59" strokeWidth="6" strokeLinecap="round" />
                <circle cx="-66" cy="38" r="12" fill="#343a48" stroke="#777b86" strokeWidth="4" />
                <circle cx="-28" cy="39" r="12" fill="#343a48" stroke="#777b86" strokeWidth="4" />
                <circle cx="28" cy="39" r="12" fill="#343a48" stroke="#777b86" strokeWidth="4" />
                <circle cx="66" cy="38" r="12" fill="#343a48" stroke="#777b86" strokeWidth="4" />
                <rect x="-48" y="-19" width="96" height="47" rx="8" fill="url(#mlHull)" stroke="#646b79" strokeWidth="3" />
                <path d="M-48-5h96M-27-19v47M28-19v47" stroke="#8e96a3" strokeWidth="2" opacity=".7" />
                <rect x="-18" y="-10" width="36" height="17" rx="4" fill="#a31638" />
                <path d="M-1-19v-34m0 0 26-10" stroke="#525d70" strokeWidth="5" strokeLinecap="round" />
                <rect x="-20" y="-65" width="52" height="13" rx="2" fill="#385c77" stroke="#97b8c5" strokeWidth="3" />
                <path d="M-7-65v13M6-65v13M19-65v13" stroke="#bcd2d9" strokeWidth="2" />
                <circle cx="-5" cy="-3" r="3" fill="#f8d2d5" />
              </g>
            </g>

            <g className="ss-ml-dust" fill="#c67772">
              <ellipse cx="390" cy="392" rx="50" ry="11" />
              <ellipse cx="522" cy="395" rx="65" ry="12" />
              <circle cx="385" cy="380" r="8" />
              <circle cx="530" cy="375" r="9" />
            </g>

            <g transform="translate(463 145)">
              <g className="ss-ml-deployer">
                <path d="M-67-18L-122-40M67-18l55-22M-67 16l-45 22M67 16l45 22" stroke="#697486" strokeWidth="9" strokeLinecap="round" />
                <path d="M-133-49h31v29h-31zM102-49h31v29h-31z" fill="#9faab9" stroke="#606f7f" strokeWidth="4" />
                <path d="M-136 24h32v25h-32zM104 24h32v25h-32z" fill="#8f9cac" stroke="#606f7f" strokeWidth="4" />
                <g className="ss-ml-thruster" fill="#efae76">
                  <path d="M-129 49l9 43 9-43zM111 49l9 43 9-43z" />
                  <path d="M-126-20l7 22 8-22zM111-20l8 22 8-22z" />
                </g>
                <path d="M-63-30h126l18 19v31L62 37H-62L-81 20v-31z" fill="url(#mlHull)" stroke="#677587" strokeWidth="4" strokeLinejoin="round" />
                <path d="M-60-14H60M-60 17H60" stroke="#a6b3c2" strokeWidth="3" />
                <rect x="-28" y="-20" width="56" height="42" rx="8" fill="#e2e8f0" stroke="#8592a2" strokeWidth="3" />
                <circle cx="0" cy="0" r="13" fill="url(#mlGlass)" stroke="#8091a2" strokeWidth="4" />
                <circle cx="0" cy="0" r="4" fill="#c7e2ea" />
                <path d="M-12 37v8h24v-8" fill="#a9b6c4" stroke="#677587" strokeWidth="3" />
                <rect x="-55" y="-31" width="21" height="6" rx="2" fill="#c31741" />
                <rect x="35" y="-31" width="21" height="6" rx="2" fill="#c31741" />
              </g>
            </g>
          </svg>
        </div>

        <div className="ss-ml-progress" aria-hidden="true"><span /></div>
      </div>

      <div className="ss-ml-bottom">
        <div className="ss-ml-actions">
          <button type="button" onClick={() => setVisible(false)}>Skip animation <ArrowRight size={15} /></button>
          <button type="button" onClick={() => {window.localStorage.setItem(DISABLE_KEY, 'yes'); setVisible(false);}}>Never show again <X size={14} /></button>
        </div>
      </div>
    </div>
  );
}
