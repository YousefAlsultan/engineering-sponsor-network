'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bot, Building2, Check, ChevronRight, Clock3, Cpu, Factory, Flag, Globe2, GraduationCap, Medal, Rocket, Search, ShieldCheck, Sparkles, Target, Wrench } from 'lucide-react';
import type { SponsorRecord } from '@/lib/sponsor-model';
import { scoreSponsor, type MatchAnswers } from '@/lib/sponsor-view';
import SponsorCard from './sponsierra-card';

type IconType = typeof Rocket;
type Choice={value:string;label:string;sub:string;icon:IconType};
type Question={field:keyof MatchAnswers;kicker:string;title:string;description:string;choices:Choice[]};
const QUESTIONS: Question[]=[
  {field:'team',kicker:'YOUR ENGINEERING DISCIPLINE',title:'What kind of team are you building?',description:'We’ll look for sponsors supporting your engineering discipline.',choices:[
    {value:'Rocketry',label:'Rocketry & propulsion',sub:'Launch vehicles, engines, flight',icon:Rocket},
    {value:'Formula SAE',label:'Formula SAE',sub:'Motorsport, race engineering',icon:Flag},
    {value:'Robotics',label:'Robotics',sub:'Autonomy, mechatronics, AI',icon:Bot},
    {value:'CubeSat / Satellite',label:'Space systems',sub:'CubeSats and satellite missions',icon:Globe2},
    {value:'UAV / Drone',label:'UAV & drones',sub:'Uncrewed aerial vehicles',icon:Target},
    {value:'All Engineering Teams',label:'Other engineering team',sub:'Interdisciplinary or emerging project',icon:GraduationCap},
  ]},
  {field:'support',kicker:'RESOURCE REQUIREMENTS',title:'What would help your project most?',description:'Choose your highest priority. You can explore other resources afterward.',choices:[
    {value:'Software',label:'Software & simulation',sub:'CAD, CAE and simulation tools',icon:Cpu},
    {value:'Manufacturing',label:'Manufacturing',sub:'CNC, sheet metal, fabrication',icon:Factory},
    {value:'Components',label:'Parts & components',sub:'Mechanical and electronic hardware',icon:Wrench},
    {value:'Cash Sponsorship',label:'Funding',sub:'Financial or competition support',icon:Medal},
    {value:'Electronics',label:'Electronics',sub:'Sensors, PCB, control systems',icon:Bot},
    {value:'Complimentary Products',label:'Products & materials',sub:'In-kind sponsorship and donations',icon:Building2},
  ]},
  {field:'region',kicker:'GEOGRAPHIC ELIGIBILITY',title:'Where is your team based?',description:'We only award geographic-fit points when the published source supports them.',choices:[
    {value:'United States',label:'United States',sub:'U.S. universities and organizations',icon:Flag},
    {value:'Canada',label:'Canada',sub:'Canadian institutions',icon:Globe2},
    {value:'Europe',label:'Europe',sub:'European university teams',icon:Globe2},
    {value:'Global',label:'Other / global',sub:'Teams based elsewhere',icon:Globe2},
  ]},
  {field:'stage',kicker:'PROJECT STAGE',title:'Where are you in your project?',description:'This helps us understand your needs. Program data does not yet support scoring by stage.',choices:[
    {value:'Concept',label:'Concept & research',sub:'Planning and early design',icon:Sparkles},
    {value:'Prototype',label:'Building the prototype',sub:'Manufacturing and iteration',icon:Wrench},
    {value:'Competition',label:'Competition ready',sub:'Testing, travel and deployment',icon:Rocket},
    {value:'Growth',label:'Scaling the team',sub:'Continuing a long-term program',icon:GraduationCap},
  ]},
  {field:'timeframe',kicker:'TIMELINE',title:'When do you need support?',description:'Deadline freshness is considered when showing current programs.',choices:[
    {value:'Now',label:'As soon as possible',sub:'This semester',icon:Clock3},
    {value:'3 months',label:'Within three months',sub:'Upcoming build milestone',icon:Flag},
    {value:'6 months',label:'Within six months',sub:'Planning ahead',icon:Target},
    {value:'Exploring',label:'Just exploring',sub:'No strict deadline yet',icon:Search},
  ]},
  {field:'priority',kicker:'YOUR PRIORITY',title:'What matters most to your team?',description:'We’ll keep this preference for future matching improvements.',choices:[
    {value:'Relevance',label:'Best technical fit',sub:'Resources suited to our design',icon:Target},
    {value:'Access',label:'Ease of applying',sub:'Clear public application routes',icon:ArrowRight},
    {value:'Value',label:'Potential support value',sub:'Meaningful resources for the project',icon:Medal},
    {value:'Relationships',label:'Long-term collaboration',sub:'Build relationships with industry',icon:ShieldCheck},
  ]},
];
const EMPTY:MatchAnswers={team:'',support:'',region:'',stage:'',timeframe:'',priority:''};

export default function SmartMatch({records}:{records:SponsorRecord[]}) {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState<MatchAnswers>(EMPTY);
  const results=useMemo(()=>records.map(record=>({record,match:scoreSponsor(record,answers)})).filter(item=>!item.match.archived).sort((a,b)=>b.match.score-a.match.score),[records,answers]);
  const question=QUESTIONS[step];
  const choose=(value:string)=>{
    const updated={...answers,[question.field]:value};
    setAnswers(updated);
    if(step<5) window.setTimeout(()=>setStep(s=>Math.min(s+1,6)),180);
    else setStep(6);
  };
  return <div className="ss-match-page">
    <div className="ss-match-intro"><div className="ss-eyebrow"><Sparkles size={14}/> SPONSIERRA / SMART MATCH</div><h1>Your mission is unique.<br/><span>Your sponsors should be too.</span></h1><p>Six thoughtful questions. Curated sponsor recommendations. Transparent compatibility estimates.</p></div>
    {step<6?<div className="ss-quiz-panel"><div className="ss-quiz-heading"><span>QUESTION {String(step+1).padStart(2,'0')} OF 06</span><span>{Math.round(step/6*100)}% COMPLETE</span></div><div className="ss-quiz-progress"><span style={{width:`${step/6*100}%`}}/></div>
      <div className="ss-eyebrow">{question.kicker}</div><h2>{question.title}</h2><p className="ss-quiz-description">{question.description}</p>
      <div className="ss-quiz-choices">{question.choices.map(choice=><button key={choice.value} className={`ss-quiz-choice ${answers[question.field]===choice.value?'is-selected':''}`} onClick={()=>choose(choice.value)}><span className="ss-quiz-icon"><choice.icon size={23}/></span><span><strong>{choice.label}</strong><small>{choice.sub}</small></span><ChevronRight size={19} className="ss-quiz-chevron"/></button>)}</div>
      <div className="ss-quiz-footer"><button disabled={step===0} onClick={()=>setStep(s=>s-1)}><ArrowLeft size={16}/> Back</button><span>Personalized for university engineering teams</span></div>
    </div>:<div className="ss-results-page"><div className="ss-results-hero"><div><span className="ss-eyebrow ss-eyebrow-light"><Check size={15}/> MISSION PROFILE CREATED</span><h2>Your sponsor shortlist is ready.</h2><p>Based on your {answers.team.toLowerCase()} team looking for {answers.support.toLowerCase()}.</p></div><button onClick={()=>{setStep(0);setAnswers(EMPTY)}}>Retake assessment <ArrowRight size={16}/></button></div>
      <div className="ss-score-explainer"><ShieldCheck size={20}/><p><strong>How percentages work:</strong> These are estimated compatibility scores, not funding probabilities. Team type (35%), support type (35%), geography (20%), and application availability (10%) determine each score. Unknown eligibility is never treated as confirmed. Your project stage and preferences are saved only in this temporary assessment and do not yet influence the scores.</p></div>
      <div className="ss-section-head"><div><span className="ss-eyebrow">YOUR TOP SPONSORS</span><h2>Opportunities worth exploring.</h2></div><Link href="/sponsors" className="ss-text-link">Browse all sponsors <ArrowRight size={16}/></Link></div>
      <div className="ss-sponsor-grid">{results.slice(0,9).map(r=><SponsorCard key={r.record.id} record={r.record} match={r.match}/>)}</div>
      <div className="ss-profile-next"><GraduationCap size={24}/><div><strong>Want a home for your engineering team?</strong><p>Explore the university profile preview. Account creation is coming later.</p></div><Link href="/profile">Preview profile <ArrowRight size={16}/></Link></div>
    </div>}
  </div>;
}
