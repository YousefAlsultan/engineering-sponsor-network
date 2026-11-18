'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react';

export default function SponDropdown({label,options,value,onChange,icon:Icon}: {
  label:string; options:string[]; value:string; onChange:(value:string)=>void; icon:LucideIcon;
}) {
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(0);
  const root=useRef<HTMLDivElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const menu=useRef<HTMLDivElement>(null);
  const id=useId();
  useEffect(()=>{
    if(!open) return;
    const dismiss=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)};
    window.addEventListener('pointerdown',dismiss);
    return ()=>window.removeEventListener('pointerdown',dismiss);
  },[open]);
  useEffect(()=>{if(open){menu.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')[active]?.focus()}},[open,active]);
  const choose=(option:string)=>{onChange(option);setOpen(false);trigger.current?.focus()};
  const onKey=(event:React.KeyboardEvent)=>{
    if(event.key==='Escape'){setOpen(false);trigger.current?.focus();return}
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){
      event.preventDefault();
      if(!open){setActive(Math.max(0,options.indexOf(value)));setOpen(true)}
      else setActive(n=>(n+(event.key==='ArrowDown'?1:-1)+options.length)%options.length);
    }
    if(event.key==='Home'){event.preventDefault();setActive(0)}
    if(event.key==='End'){event.preventDefault();setActive(options.length-1)}
  };
  return <div className={`ss-drop ${open?'is-open':''}`} ref={root} onKeyDown={onKey}>
    <button type="button" ref={trigger} className="ss-drop-trigger" aria-label={`${label}: ${value}`} aria-expanded={open} aria-haspopup="listbox" aria-controls={id} onClick={()=>{setActive(Math.max(0,options.indexOf(value)));setOpen(v=>!v)}}>
      <span className="ss-drop-trigger-icon"><Icon size={17}/></span><span className="ss-drop-choice"><small>{label}</small><strong>{value}</strong></span><ChevronDown className="ss-drop-chevron" size={18}/>
    </button>
    {open&&<div className="ss-drop-menu" role="listbox" id={id} ref={menu} aria-label={label}>
      <div className="ss-drop-menu-head">SELECT {label.toUpperCase()}</div>
      {options.map((option,index)=><button type="button" role="option" key={option} aria-selected={option===value} className={`ss-drop-option ${option===value?'is-current':''}`} tabIndex={index===active?0:-1} onMouseEnter={()=>setActive(index)} onClick={()=>choose(option)}><span>{option}</span>{option===value&&<Check size={16}/>}</button>)}
    </div>}
  </div>;
}
