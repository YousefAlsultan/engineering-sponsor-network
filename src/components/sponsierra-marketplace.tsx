'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass, Cpu, Factory, Filter, Grid2X2, List, Rocket, Search, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import type { SponsorRecord } from '@/lib/sponsor-model';
import { asList, asText, isArchived } from '@/lib/sponsor-view';
import SponsorCard from './sponsierra-card';
import SponDropdown from './sponsierra-dropdown';

const CATEGORIES = [
  {title:'Manufacturing',desc:'Turn concepts into real hardware.',icon:Factory,value:'Manufacturing'},
  {title:'Software & CAD',desc:'Professional tools for your team.',icon:Cpu,value:'Software'},
  {title:'Components',desc:'Build with industry-grade parts.',icon:Rocket,value:'Components'},
  {title:'All opportunities',desc:'Explore the entire sponsor network.',icon:Compass,value:'All'},
];
const TEAMS=['Formula SAE','Baja SAE','Rocketry','Robotics','CubeSat / Satellite','UAV / Drone','Solar Car'];
const TYPES=['Cash Sponsorship','Complimentary Products','Components','Manufacturing','Electronics','Software','Technical Services','Materials','Discount'];

function BlueprintScene(){return <div className="ss-hero-blueprint" aria-hidden="true"><svg viewBox="0 0 900 610" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><pattern id="bp-grid" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" stroke="#83b9d2" strokeOpacity=".19" strokeWidth="1"/></pattern><pattern id="bp-small" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M7 0H0V7" stroke="#83b9d2" strokeOpacity=".07" strokeWidth=".6"/></pattern><radialGradient id="bp-glow"><stop stopColor="#73baca" stopOpacity=".24"/><stop offset="1" stopColor="#73baca" stopOpacity="0"/></radialGradient></defs>
  <rect width="900" height="610" fill="url(#bp-grid)"/><rect width="900" height="610" fill="url(#bp-small)"/><circle cx="590" cy="302" r="290" fill="url(#bp-glow)"/>
  <g className="ss-blueprint-orbit" stroke="#9dd5ed" strokeOpacity=".49" strokeWidth="1.4"><circle cx="593" cy="308" r="222" strokeDasharray="12 10"/><circle cx="593" cy="308" r="185"/><circle cx="593" cy="308" r="146" strokeDasharray="4 12"/><path d="M352 308H835M593 67V550" strokeDasharray="8 8"/></g>
  <g className="ss-blueprint-cad" stroke="#b9e4f6" strokeWidth="2.2" strokeLinejoin="round">
    <path d="M432 326l66-99 146-27 123 81-7 70-134 78-142-27z" fill="#4f91ac" fillOpacity=".11"/>
    <path d="M432 326l169-25 159 50M498 227l103 74 43-101M601 301l25 128M484 402l117-101M767 281l-166 20"/>
    <path d="M480 313l23-35 113-19 93 41-89 60-113-12z" strokeDasharray="5 6"/>
    <circle cx="592" cy="308" r="82"/><circle cx="592" cy="308" r="61"/><circle cx="592" cy="308" r="37" fill="#7bc9e6" fillOpacity=".13"/>
    <path d="M592 271l18 37-18 37-18-37zM555 308h74M592 271v74" strokeWidth="1.4"/>
    <path d="M489 227l-65-53h-87m424 107 71-64h49M479 400l-60 67h-86m293-39 86 59h110" strokeWidth="1.4" strokeDasharray="4 6"/>
  </g>
  <g fill="#b6e9fb" fontFamily="monospace" fontSize="11" letterSpacing="2" opacity=".76"><text x="337" y="163">A-01 / STRUCTURAL</text><text x="736" y="210">SECTION B</text><text x="286" y="485">CAD / ACTIVE</text><text x="755" y="505">1:250</text><text x="521" y="74">ENGINEERING SCHEMATIC</text></g>
  <g stroke="#77bbd7" strokeWidth="1.2" strokeOpacity=".74"><path d="M374 116h120m-120 0v-10m120 10v-10M796 382v93m-10-93h20m-20 93h20"/><path d="M270 302h88m-44-30v60" strokeDasharray="2 6"/></g>
  <circle className="ss-blueprint-beacon" cx="765" cy="190" r="5" fill="#ff6389"/><circle cx="420" cy="474" r="3" fill="#bbecf8"/>
  </svg><div className="ss-blueprint-scanner"/></div>}

export default function Marketplace({records,compact=false}:{records:SponsorRecord[];compact?:boolean}) {
  const heroRef=useRef<HTMLElement>(null);
  const [query,setQuery]=useState('');
  const [team,setTeam]=useState('');
  const [support,setSupport]=useState('');
  const [refining,setRefining]=useState(false);
  const [view,setView]=useState<'grid'|'list'>('grid');
  const [archived,setArchived]=useState(false);
  const [saved,setSaved]=useState<string[]>([]);
  useEffect(()=>{try{setSaved(JSON.parse(window.localStorage.getItem('sponsierra-saved')||'[]'))}catch{}},[]);
  useEffect(()=>{
    if(compact||window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame=0;
    const update=()=>{window.cancelAnimationFrame(frame);frame=window.requestAnimationFrame(()=>{const hero=heroRef.current;if(!hero)return;const rect=hero.getBoundingClientRect();const travel=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height)));hero.style.setProperty('--ss-blueprint-shift',`${Math.round(travel*92)}px`);hero.style.setProperty('--ss-blueprint-turn',`${Math.round(travel*16)}deg`)})};
    window.addEventListener('scroll',update,{passive:true});update();return ()=>{window.removeEventListener('scroll',update);window.cancelAnimationFrame(frame)};
  },[compact]);
  const toggleSave=(id:string)=>setSaved(old=>{const next=old.includes(id)?old.filter(v=>v!==id):[...old,id];window.localStorage.setItem('sponsierra-saved',JSON.stringify(next));return next});
  const filtered=useMemo(()=>records.filter(r=>{
    const f=r.fields; const hay=[asText(f['Company Name']),asText(f['Sponsorship Program Name']),asText(f['Public Summary']),asText(f['What They Provide'])].join(' ').toLowerCase();
    return (!query||hay.includes(query.trim().toLowerCase()))
      && (!team||asList(f['Engineering Team Types']).some(t=>t===team||t==='All Engineering Teams'))
      && (!support||asList(f['Sponsorship Type']).includes(support))
      && (archived||!isArchived(r));
  }),[records,query,team,support,archived]);
  const current=records.filter(r=>!isArchived(r)).length;
  return <div className="ss-marketplace">
    {!compact&&<section className="ss-hero" ref={heroRef}>
      <div className="ss-hero-grid"/>
      <BlueprintScene/>
      <div className="ss-hero-content">
        <span className="ss-hero-name" aria-label="SponSierra">Spon<span>Sierra</span></span>
        <h1>Your next breakthrough<br/><em>deserves backing.</em></h1>
        <p>Find the support your team needs to design, build, compete, and push boundaries.</p>
        <div className="ss-hero-buttons"><Link href="#opportunities" className="ss-button ss-button-white"><Compass size={17}/> Explore opportunities <ArrowRight size={17}/></Link><Link href="/match" className="ss-button ss-button-glass"><Sparkles size={17}/> Find my sponsor fit <ArrowRight size={17}/></Link></div>
        <div className="ss-hero-foot">
          <div className="ss-hero-orb"><strong>{records.length}</strong><small>Opportunities<br/>to explore</small></div>
          <div className="ss-hero-orb"><strong>{current}</strong><small>Current or<br/>upcoming</small></div>
        </div>
      </div>
    </section>}
    <div className="ss-marketplace-inner">
      {!compact&&<section className="ss-category-section">
        <div className="ss-section-head" data-ss-reveal><div><span className="ss-eyebrow">EXPLORE BY RESOURCE</span><h2>Everything your team needs to go further.</h2></div><Link href="#opportunities" className="ss-text-link">Browse the sponsor directory <ArrowUpRight size={16}/></Link></div>
        <div className="ss-category-grid">{CATEGORIES.map((cat,index)=><button data-ss-reveal key={cat.title} onClick={()=>{setSupport(cat.value==='All'?'':cat.value);setRefining(true);document.getElementById('opportunities')?.scrollIntoView({behavior:'smooth'})}} className={`ss-category-tile ss-category-${index}`}><span className="ss-category-index">CAPABILITY / 0{index+1}</span><span className="ss-category-icon"><cat.icon size={27}/></span><cat.icon className="ss-category-ghost" size={148} strokeWidth={0.65}/><strong>{cat.title}</strong><small>{cat.desc}</small><span className="ss-category-foot">EXPLORE SUPPORT <ArrowUpRight size={16}/></span></button>)}</div>
      </section>}
      <section className="ss-directory" id="opportunities">
        <div className="ss-section-head" data-ss-reveal><div><span className="ss-eyebrow">OHIO STATE / UNITED STATES</span><h2>{compact?'Sponsor directory':'Find your next breakthrough.'}</h2><p>Search opportunities for Ohio State organizations. Verify U.S. eligibility and current terms on each company's official website.</p></div></div>
        <div className="ss-search-panel" data-ss-reveal><div className="ss-search-top"><div className="ss-search-field"><Search size={20}/><input aria-label="Search sponsorships" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search sponsors, tools, companies, or support..." />{query&&<button onClick={()=>setQuery('')} aria-label="Clear search"><X size={17}/></button>}</div><button type="button" className={`ss-refine-toggle ${refining?'is-active':''}`} aria-label="Refine sponsor results" aria-expanded={refining} aria-controls="ss-refine-options" onClick={()=>setRefining(v=>!v)}><Filter size={21}/><span>Refine</span>{(team||support||archived)&&<i aria-label="Filters active"/>}</button></div>
          {refining&&<div id="ss-refine-options" className="ss-filter-row ss-filter-row-open"><SponDropdown label="Engineering discipline" icon={Users} options={TEAMS} value={team} onChange={setTeam}/><SponDropdown label="Type of support" icon={Filter} options={TYPES} value={support} onChange={setSupport}/><label className="ss-archived-toggle"><input type="checkbox" checked={archived} onChange={e=>setArchived(e.target.checked)}/><span>Show archived too</span></label><button type="button" className="ss-clear-filters" onClick={()=>{setTeam('');setSupport('');setArchived(false)}}>Clear filters</button></div>}
        </div>
        <div className="ss-results-bar"><div><strong>{filtered.length} opportunities</strong><span> · curated for engineering teams</span></div><div className="ss-view-toggle" role="group" aria-label="Card view"><button className={view==='grid'?'is-selected':''} onClick={()=>setView('grid')} aria-label="Grid view" aria-pressed={view==='grid'}><Grid2X2 size={17}/></button><button className={view==='list'?'is-selected':''} onClick={()=>setView('list')} aria-label="List view" aria-pressed={view==='list'}><List size={17}/></button></div></div>
        {filtered.length?<div className={`ss-sponsor-grid ${view==='list'?'ss-sponsor-grid-list':''}`}>{filtered.map(r=><SponsorCard key={r.id} record={r} view={view} saved={saved.includes(r.id)} onSave={toggleSave}/>)}</div>:<div className="ss-empty-state"><Search size={33}/><h3>No matches for those filters</h3><p>Try a different team type, resource, or keyword.</p><button onClick={()=>{setQuery('');setTeam('');setSupport('');setArchived(false)}}>Reset filters</button></div>}
      </section>
      <section className="ss-bottom-cta" data-ss-reveal><div><span className="ss-eyebrow ss-eyebrow-light">BUILD SOMETHING REMARKABLE</span><h2>Your team deserves to be seen.</h2><p>Create a team profile, showcase your work, and get ready to connect with future partners.</p></div><Link href="/profile" className="ss-button ss-button-white">Build your team profile <ArrowRight size={18}/></Link></section>
      <section className="ss-trust-line"><span><ShieldCheck size={17}/> Sponsor information is sourced from publicly available programs.</span><span><CheckCircle2 size={17}/> A source check does not mean a company partnership or guarantee funding.</span></section>
    </div>
  </div>;
}
