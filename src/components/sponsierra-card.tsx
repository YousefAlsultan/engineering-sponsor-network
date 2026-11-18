'use client';
import Link from 'next/link';
import { ArrowUpRight, BadgePercent, Banknote, Check, CircuitBoard, Code2, Cpu, Factory, Gift, Globe2, Heart, Layers3, Package, Wrench, type LucideIcon } from 'lucide-react';
import type { SponsorRecord } from '@/lib/sponsor-model';
import { asList, asText, isArchived, sponsorInitials, sponsorUrl } from '@/lib/sponsor-view';

function serviceIcon(type:string):LucideIcon {
  const key=type.toLowerCase();
  if(key.includes('cash')||key.includes('fund'))return Banknote;
  if(key.includes('discount'))return BadgePercent;
  if(key.includes('software')||key.includes('cad'))return Code2;
  if(key.includes('manufactur')||key.includes('fabricat'))return Factory;
  if(key.includes('electronic'))return CircuitBoard;
  if(key.includes('component'))return Cpu;
  if(key.includes('technical')||key.includes('service'))return Wrench;
  if(key.includes('material'))return Layers3;
  if(key.includes('product'))return Package;
  return Gift;
}

export default function SponsorCard({record, view='grid', saved=false, onSave, match}:{
  record:SponsorRecord; view?:'grid'|'list'; saved?:boolean; onSave?:(id:string)=>void; match?:{score:number;reasons:string[]};
}) {
  const f=record.fields;
  const company=asText(f['Company Name']);
  const status=asText(f['Application Status']);
  const archived=isArchived(record);
  const types=asList(f['Sponsorship Type']);
  const geos=asList(f['Geographic Eligibility']).filter(g=>g && g.toLowerCase()!=='unknown');
  const recordNumber=Number(record.id.split('-').pop());
  const palette=Number.isFinite(recordNumber)?recordNumber%6:0;
  return <article className={`ss-sponsor-card ss-palette-${palette} ${view==='list'?'ss-sponsor-list':''}`}>
    <div className="ss-card-main">
      <div className="ss-card-logo">{sponsorInitials(record)}</div>
      <div className="ss-card-identity"><div className="ss-card-company">{company}</div><div className="ss-card-program">{asText(f['Sponsorship Program Name'])}</div></div>
      {match&&<div className="ss-match-pill"><strong>{match.score}%</strong><span>match</span></div>}
      {onSave&&<button className={`ss-bookmark ${saved?'is-saved':''}`} onClick={()=>onSave(record.id)} aria-label={saved?`Unlike ${company}`:`Like ${company}`} title={saved?'Unlike sponsor':'Save to favorites'} aria-pressed={saved}><Heart size={19} fill={saved?'currentColor':'none'}/></button>}
    </div>
    <p className="ss-card-copy">{asText(f['Public Summary'])||asText(f['What They Provide'])}</p>
    <div className="ss-service-icons" aria-label="Available sponsorship resources">{types.slice(0,5).map(t=>{const Icon=serviceIcon(t);return <span className="ss-service-icon" tabIndex={0} key={t} data-tooltip={t} title={t} aria-label={t}><Icon size={18}/></span>})}{types.length>5&&<span className="ss-service-extra" tabIndex={0} title={types.slice(5).join(', ')} aria-label={`Other support: ${types.slice(5).join(', ')}`}>+{types.length-5}</span>}</div>
    {match&&<div className="ss-match-reasons">{match.reasons.slice(0,2).map(t=><span key={t}><Check size={12}/>{t}</span>)}</div>}
    <div className="ss-card-bottom">
      <div className="ss-card-meta"><span className={`ss-card-status ${archived?'is-archived':'is-current'}`}>{archived?'Archived':status==='Seasonal'?'Upcoming':status||'Ongoing'}</span>{geos.length>0&&<span className="ss-card-region"><Globe2 size={13}/>{geos.slice(0,2).join(', ')}</span>}</div>
      <Link href={sponsorUrl(record)} className="ss-card-arrow" aria-label={`View ${company} sponsorship`}><span>Explore program</span><ArrowUpRight size={18}/></Link>
    </div>
  </article>;
}
