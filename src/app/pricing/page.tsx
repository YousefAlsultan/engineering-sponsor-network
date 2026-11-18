import Link from 'next/link';
import { ArrowRight, Check, GraduationCap, Rocket, Sparkles } from 'lucide-react';

const FEATURES=[
  {name:'Student teams',price:'$0',cadence:'/ month',sub:'For university builders',icon:GraduationCap,points:['Browse sponsor opportunities','Use Smart Match','Create a local portfolio preview'],tag:'FREE FOR TEAMS',kind:'student'},
  {name:'Sponsor Starter',price:'$49',cadence:'/ month',sub:'For growing companies',icon:Rocket,points:['Company presence concept','Program discovery tools','Future sponsor dashboard access'],tag:'PROPOSED',kind:'sponsor'},
  {name:'Sponsor Growth',price:'$149',cadence:'/ month',sub:'For larger sponsor programs',icon:Sparkles,points:['Everything in Starter','Future program management','Future analytics and insights'],tag:'PROPOSED',kind:'growth'},
];

export default function PricingPage(){return <div className="ss-pricing-page">
  <div className="ss-pricing-heading" data-ss-reveal><span className="ss-eyebrow">SIMPLE BY DESIGN</span><h1>Build more. <span>Spend smarter.</span></h1><p>Keep university team discovery free. Explore possible company subscription plans as SponSierra grows.</p><div className="ss-pricing-notice">Concept pricing only · Company subscriptions and checkout are not live.</div></div>
  <div className="ss-pricing-grid">{FEATURES.map((p,i)=><article key={p.name} className={`ss-pricing-card ss-pricing-${p.kind}`} data-ss-reveal><div className="ss-pricing-icon"><p.icon size={24}/></div><span className="ss-pricing-tag">{p.tag}</span><h2>{p.name}</h2><p>{p.sub}</p><div className="ss-pricing-amount"><strong>{p.price}</strong><span>{p.cadence}</span></div><ul>{p.points.map(point=><li key={point}><Check size={16}/>{point}</li>)}</ul>{i===0?<Link href="/profile" className="ss-button ss-button-red">Try your team profile <ArrowRight size={16}/></Link>:<button className="ss-button ss-button-outline" disabled>Coming soon</button>}</article>)}</div>
  <p className="ss-pricing-foot">No payments are being accepted. Sponsor pricing is a planning proposal and may change before launch.</p>
</div>}
