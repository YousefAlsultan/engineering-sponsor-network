import Link from 'next/link';
import { ArrowRight, Check, GraduationCap, Rocket, Sparkles } from 'lucide-react';

const FEATURES=[
  {name:'Student Basic',price:'$0',cadence:'/ month',sub:'For Ohio State students',icon:GraduationCap,points:['Create an account and personal bio','Browse sponsorship opportunities','Use Smart Match','Read team updates'],tag:'FREE PLAN',kind:'student'},
  {name:'Student Member',price:'TBD',cadence:'/ month',sub:'For active engineering builders',icon:Rocket,points:['Everything in Basic','Publish engineering updates and photos','Build a public team portfolio','Interact with organization posts'],tag:'MONTHLY SUBSCRIPTION · PLANNED',kind:'sponsor'},
  {name:'Sponsor programs',price:'Later',cadence:'',sub:'For company partners',icon:Sparkles,points:['Organization discovery','Company tools under development','No company registration in the Ohio State pilot'],tag:'FUTURE PHASE',kind:'growth'},
];

export default function PricingPage(){return <div className="ss-pricing-page">
  <div className="ss-pricing-heading" data-ss-reveal><span className="ss-eyebrow">OHIO STATE LAUNCH</span><h1>Start free. <span>Share when you're ready.</span></h1><p>Every student can create a profile and bio. Publishing posts will require a monthly membership after secure accounts and billing launch.</p><div className="ss-pricing-notice">Preview only · Accounts, subscriptions, and checkout are not yet active.</div></div>
  <div className="ss-pricing-grid">{FEATURES.map((p,i)=><article key={p.name} className={`ss-pricing-card ss-pricing-${p.kind}`} data-ss-reveal><div className="ss-pricing-icon"><p.icon size={24}/></div><span className="ss-pricing-tag">{p.tag}</span><h2>{p.name}</h2><p>{p.sub}</p><div className="ss-pricing-amount"><strong>{p.price}</strong><span>{p.cadence}</span></div><ul>{p.points.map(point=><li key={point}><Check size={16}/>{point}</li>)}</ul>{i===0?<Link href="/profile" className="ss-button ss-button-red">Preview a student profile <ArrowRight size={16}/></Link>:<button className="ss-button ss-button-outline" disabled>Coming soon</button>}</article>)}</div>
  <p className="ss-pricing-foot">No payments are being accepted. Membership pricing will be finalized before launch.</p>
</div>}
