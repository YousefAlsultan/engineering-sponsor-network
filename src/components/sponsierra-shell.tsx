'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Compass, CreditCard, GraduationCap, Info, LayoutGrid, Menu, Moon, Orbit, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import MissionLoader from './mission-loader';

const NAV = [
  {href:'/', title:'Discover', icon:Compass},
  {href:'/sponsors', title:'Sponsor directory', icon:LayoutGrid},
  {href:'/match', title:'Smart Match', icon:Sparkles},
  {href:'/profile', title:'University profile', icon:GraduationCap},
];

function Brand({small=false}: {small?:boolean}) {
  return <span className="ss-brand"><span className="ss-brand-symbol"><Orbit size={small?18:21} strokeWidth={2.2}/></span>{!small&&<span>Spon<span className="ss-brand-accent">Sierra</span><small>ENGINEERING YOUR NEXT BREAKTHROUGH</small></span>}</span>;
}

export default function SponSierraShell({children}:{children:React.ReactNode}) {
  const path=usePathname();
  const [collapsed,setCollapsed]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [theme,setTheme]=useState<'light'|'dark'>('light');
  useEffect(()=>{const stored=window.localStorage.getItem('sponsierra-theme');if(stored==='dark')setTheme('dark')},[]);
  useEffect(()=>{document.documentElement.dataset.ssTheme=theme;window.localStorage.setItem('sponsierra-theme',theme)},[theme]);
  useEffect(()=>{
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const nodes=Array.from(document.querySelectorAll<HTMLElement>('[data-ss-reveal]'));
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('ss-reveal-visible');observer.unobserve(entry.target)}});
    },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
    nodes.forEach((node,index)=>{
      node.style.setProperty('--ss-reveal-delay',`${Math.min(index%4,3)*65}ms`);
      observer.observe(node);
    });
    document.documentElement.classList.add('ss-motion-ready');
    return ()=>observer.disconnect();
  },[path]);
  return <div className={`ss-shell ${collapsed?'ss-collapsed':''}`}>
    <MissionLoader/>
    <div className={`ss-mobile-shade ${mobile?'is-open':''}`} onClick={()=>setMobile(false)}/>
    <aside className={`ss-sidebar ${mobile?'ss-mobile-open':''}`}>
      <div className="ss-sidebar-head"><Link href="/" aria-label="SponSierra home" onClick={()=>setMobile(false)}><Brand small={collapsed}/></Link><button className="ss-sidebar-toggle" onClick={()=>setCollapsed(!collapsed)} aria-label={collapsed?'Expand navigation':'Collapse navigation'}>{collapsed?<ChevronRight size={17}/>:<ChevronLeft size={17}/>}</button></div>
      <div className="ss-nav-label">WORKSPACE</div>
      <nav className="ss-nav">{NAV.map(item=><Link key={item.href} href={item.href} onClick={()=>setMobile(false)} title={item.title} className={`ss-nav-item ${path===item.href?'is-active':''}`}><item.icon size={19}/><span>{item.title}</span>{item.href==='/match'&&<i className="ss-nav-new">NEW</i>}</Link>)}</nav>
      <div className="ss-sidebar-bottom">
        <div className="ss-nav-label">SPONSIERRA</div>
        <Link href="/about" title="About SponSierra" onClick={()=>setMobile(false)} className={`ss-nav-item ${path==='/about'?'is-active':''}`}><Info size={19}/><span>About SponSierra</span></Link>
        <Link href="/pricing" title="Pricing plans" onClick={()=>setMobile(false)} className={`ss-nav-item ${path==='/pricing'?'is-active':''}`}><CreditCard size={19}/><span>Pricing</span></Link>
        <div className="ss-sidebar-foot"><span className="ss-live-dot"/> Directory preview · 2026</div>
      </div>
    </aside>
    <div className="ss-app">
      <header className="ss-topbar"><button className="ss-mobile-menu" aria-label="Open navigation" onClick={()=>setMobile(true)}><Menu size={21}/></button><div className="ss-top-location"><span className="ss-top-desktop">PLATFORM / </span>{path==='/match'?'SMART MATCH':path==='/profile'?'UNIVERSITY PROFILE':path==='/about'?'ABOUT SPONSIERRA':path==='/pricing'?'PRICING':path==='/sponsors'?'SPONSOR DIRECTORY':path.startsWith('/sponsors/')?'SPONSOR INTELLIGENCE':'DISCOVER'}</div><Link href="/" className="ss-top-brand" aria-label="SponSierra homepage"><span><Orbit size={18}/></span><strong>Spon<em>Sierra</em></strong></Link><div className="ss-top-actions"><span className="ss-source-status"><ShieldCheck size={14}/> Source-backed opportunities</span><button className="ss-theme-button" onClick={()=>setTheme(v=>v==='light'?'dark':'light')} aria-label={theme==='dark'?'Switch to light mode':'Switch to dark mode'} aria-pressed={theme==='dark'} title={theme==='dark'?'Light mode':'Dark mode'}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}<span>{theme==='dark'?'Light':'Dark'} mode</span></button></div></header>
      <main className="ss-content">{children}</main>
      <footer className="ss-footer"><span>© 2026 SponSierra. Built for ambitious engineering teams.</span><span>Independent directory · Not affiliated with The Ohio State University</span></footer>
    </div>
  </div>;
}
