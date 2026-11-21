'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, CircleUserRound, LockKeyhole, LogIn, LogOut, Settings2, UserRound } from 'lucide-react';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase-browser';

type PreviewAccount = { name?: string; avatar?: string; university?: string };

export default function StudentAvatarMenu() {
  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState<PreviewAccount>({});
  const [signedIn,setSignedIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let active = true;
    const refresh = async (id:string | undefined) => {
      if (!active) return;
      if (!id) { setSignedIn(false);setPerson({});return; }
      setSignedIn(true);
      const {data} = await supabase.from('student_profiles').select('display_name,university,avatar_url').eq('user_id',id).maybeSingle();
      if (active) setPerson({name:data?.display_name || 'Student account',university:data?.university || 'The Ohio State University',avatar:data?.avatar_url || ''});
    };
    void supabase.auth.getUser().then(({data})=>refresh(data.user?.id));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{setTimeout(()=>{void refresh(session?.user?.id);},0);});
    const onProfileUpdated=()=>{void supabase.auth.getUser().then(({data})=>refresh(data.user?.id));};
    window.addEventListener('sponsierra-auth-changed',onProfileUpdated);
    return ()=>{active=false;subscription.unsubscribe();window.removeEventListener('sponsierra-auth-changed',onProfileUpdated);};
  },[]);

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setSignedIn(false);setPerson({});setOpen(false);
    window.dispatchEvent(new Event('sponsierra-auth-changed'));
  };

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => { if (!menuRef.current?.contains(event.target as Node)) setOpen(false); };
    const closeEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeEscape); };
  }, [open]);

  return <div className="ss-account-menu" ref={menuRef}>
    <button className="ss-account-trigger" aria-label="Open student account menu" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
      <span className="ss-account-avatar"><span className="ss-account-avatar-glow" aria-hidden="true"/>{person.avatar ? <img src={person.avatar} alt=""/> : <UserRound size={21}/>}</span>
      <ChevronDown size={14} className="ss-account-chevron"/>
    </button>
    {open && <div className="ss-account-popover" role="menu">
      <div className="ss-account-popover-head"><span className="ss-account-mini-avatar">{person.avatar ? <img src={person.avatar} alt=""/> : <CircleUserRound size={24}/>}</span><div><strong>{person.name || 'Student profile'}</strong><small>{person.university || 'Ohio State pilot · Preview'}</small></div></div>
      <span className="ss-account-preview-caption"><LockKeyhole size={13}/>{signedIn?'Signed in securely':isSupabaseConfigured?'Sign in to access your profile':'Cloud accounts are being connected'}</span>
      {!signedIn && <Link role="menuitem" href="/account" onClick={()=>setOpen(false)}><LogIn size={18}/> Sign in / Create account</Link>}
      <Link role="menuitem" href="/profile" onClick={() => setOpen(false)}><UserRound size={18}/> My student profile</Link>
      <Link role="menuitem" href="/settings" onClick={() => setOpen(false)}><Settings2 size={18}/> Profile settings</Link>
      <div className="ss-account-popover-separator"/>
      <button role="menuitem" disabled={!signedIn} title={!signedIn?'Log out becomes available after signing in':undefined} onClick={()=>{void signOut();}}><LogOut size={18}/> Log out {!signedIn&&<small>Not signed in</small>}</button>
    </div>}
  </div>;
}
