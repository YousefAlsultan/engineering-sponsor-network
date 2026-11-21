'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, KeyRound, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase-browser';

export default function AccountPage() {
  const router = useRouter();
  const [email,setEmail] = useState('');
  const [code,setCode] = useState('');
  const [codeSent,setCodeSent] = useState(false);
  const [signedIn,setSignedIn] = useState(false);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let live = true;
    void supabase.auth.getUser().then(({data}) => { if (live) setSignedIn(Boolean(data.user)); });
    const { data: {subscription} } = supabase.auth.onAuthStateChange((_event,session) => {
      if (live) setSignedIn(Boolean(session?.user));
    });
    return () => { live=false;subscription.unsubscribe(); };
  },[]);

  const sendCode = async (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase || busy) return;
    setBusy(true);setMessage('');
    const { error } = await supabase.auth.signInWithOtp({email:email.trim(),options:{
      shouldCreateUser:true,
      emailRedirectTo:'https://engineering-sponsor-network-yousef-preview.yousefalsultan.chatgpt.site/account',
    }});
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    setCodeSent(true);
    setMessage('Check your inbox for a sign-in link or code. Open the link in your browser, or enter a numeric code below if your email includes one.');
  };

  const verifyCode = async (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase || busy) return;
    setBusy(true);setMessage('');
    const {data,error} = await supabase.auth.verifyOtp({email:email.trim(),token:code.trim(),type:'email'});
    setBusy(false);
    if (error || !data.user) {setMessage(error?.message || 'Could not verify that code.');return;}
    void supabase.rpc('record_student_activity',{action:'signed_in'});
    window.dispatchEvent(new Event('sponsierra-auth-changed'));
    router.push('/profile');
  };

  return <section className="ss-auth-page">
    <Link href="/" className="ss-auth-back"><ArrowLeft size={17}/> Back to opportunities</Link>
    <div className="ss-auth-card">
      <span className="ss-eyebrow"><ShieldCheck size={17}/> YOUR ENGINEERING IDENTITY</span>
      <h1>Make your mark.<br/><em>Build your profile.</em></h1>
      <p>Join the student engineering community with your own verified email address. You can use your university email or your organization’s address.</p>
      <p className="ss-auth-notice" role="status">Private testing: email-code delivery is still being configured. Registration is not yet verified for general use.</p>
      {!isSupabaseConfigured ? <div className="ss-auth-notice" role="status"><LockKeyhole size={20}/><span>Account setup is being connected. Your existing device-only profile is still available for preview.</span></div>
      : signedIn ? <div className="ss-auth-success"><CheckCircle2 size={30}/><strong>You’re signed in.</strong><Link href="/profile">Go to my student profile</Link></div>
      : !codeSent ? <form onSubmit={sendCode} className="ss-auth-form">
        <label htmlFor="ss-auth-email">Email address</label>
        <div><Mail size={19}/><input id="ss-auth-email" type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@yourteam.org" autoComplete="email" maxLength={320} required/></div>
        <button type="submit" disabled={busy}>{busy?'Sending code…':'Continue with email'}</button>
        <button type="button" className="ss-auth-secondary" disabled={busy} onClick={event=>{
          const form=event.currentTarget.form;
          if(!form?.reportValidity())return;
          setCodeSent(true);setMessage('Enter your existing one-time code. No new email has been requested.');
        }}>I already have a code</button>
        <small>No specific email domain is required. OSU affiliation and organization membership are checked separately.</small>
      </form>
      : <form onSubmit={verifyCode} className="ss-auth-form">
        <p>Signing in as {email.trim()}</p>
        <label htmlFor="ss-auth-code">Enter your email code</label>
        <div><KeyRound size={19}/><input id="ss-auth-code" type="text" value={code} onChange={event=>setCode(event.target.value.replace(/[^0-9]/g,'').slice(0,8))} inputMode="numeric" pattern="[0-9]{6,8}" minLength={6} maxLength={8} autoComplete="one-time-code" placeholder="6-digit code" required/></div>
        <button type="submit" disabled={busy}>{busy?'Verifying…':'Verify and open my profile'}</button>
        <button type="button" className="ss-auth-secondary" onClick={()=>{setCodeSent(false);setCode('');setMessage('');}}>Use a different email</button>
      </form>}
      {message && <p className="ss-auth-message" role="status">{message}</p>}
      <p className="ss-auth-footnote"><LockKeyhole size={15}/> Free student profiles first. Posting will require membership when subscriptions launch.</p>
    </div>
  </section>;
}
