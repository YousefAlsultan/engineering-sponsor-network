'use client';

import Link from 'next/link';
import AccountRequired from '@/components/account-required';
import { ArrowLeft, Bell, Eye, LockKeyhole, Settings2, ShieldCheck, UserRound } from 'lucide-react';

export default function SettingsPage(){
  return <AccountRequired><main className="ss-student-settings">
    <Link href="/profile" className="ss-student-settings-back"><ArrowLeft size={17}/> Student profile</Link>
    <div className="ss-student-settings-head"><span className="ss-eyebrow"><Settings2 size={15}/> PROFILE SETTINGS</span><h1>Keep your space yours.</h1><p>Account preferences for the SponSierra Ohio State pilot.</p></div>
    <section><span><UserRound size={24}/></span><div><h2>Profile information</h2><p>Update your name, university, organization, photos, skills, and bio.</p><Link href="/profile">Edit your student profile</Link></div></section>
    <section><span><Eye size={24}/></span><div><h2>Visibility and privacy</h2><p>Your profile is private by default and saved to your signed-in account. Uploaded profile photos are viewable by their direct URL.</p></div></section>
    <section><span><Bell size={24}/></span><div><h2>Email notifications</h2><p>Email is used for sign-in verification. Marketing notifications are not enabled.</p></div></section>
    <section><span><LockKeyhole size={24}/></span><div><h2>Membership and security</h2><p>Student profiles are free. Paid membership and checkout are not available yet.</p><small><ShieldCheck size={14}/> No passwords, sign-in codes, or session tokens are stored in Notion.</small></div></section>
  </main></AccountRequired>;
}
