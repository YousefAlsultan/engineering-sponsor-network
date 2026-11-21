'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { BadgeCheck, BookOpen, Camera, Check, ChevronRight, CircleUserRound, GraduationCap, HeartHandshake, ImagePlus, LockKeyhole, MapPin, Pencil, Plus, Save, School, ShieldCheck, Sparkles, Stars, UserRound, Users, X } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export const STUDENT_PROFILE_KEY = 'sponsierra-student-profile-v1';

type StudentProfile = {
  name: string;
  headline: string;
  university: string;
  organization: string;
  major: string;
  year: string;
  location: string;
  bio: string;
  skills: string;
  project: string;
  website: string;
  contact: string;
  banner: string;
  avatar: string;
};

const DEFAULT: StudentProfile = {
  name: '', headline: '', university: 'The Ohio State University', organization: '',
  major: '', year: '', location: 'Columbus, Ohio, USA', bio: '', skills: '',
  project: '', website: '', contact: '', banner: '', avatar: '',
};

const EDIT_FIELDS: { key: keyof StudentProfile; label: string; placeholder: string; wide?: boolean; multiline?: boolean }[] = [
  { key: 'name', label: 'Your name', placeholder: 'Name as you want others to see it' },
  { key: 'headline', label: 'Your headline', placeholder: 'Aerospace student · Building what is next', wide: true },
  { key: 'university', label: 'University', placeholder: 'The Ohio State University' },
  { key: 'organization', label: 'Engineering organization / team', placeholder: 'Buckeye Rocketry, Formula Buckeyes…' },
  { key: 'major', label: 'Major or field', placeholder: 'Aerospace Engineering' },
  { key: 'year', label: 'Class / graduation year', placeholder: 'Class of 2028' },
  { key: 'location', label: 'Location', placeholder: 'Columbus, Ohio, USA' },
  { key: 'contact', label: 'Contact email (optional)', placeholder: 'you@example.com' },
  { key: 'website', label: 'Portfolio / project URL', placeholder: 'https://…', wide: true },
  { key: 'skills', label: 'Skills and interests (comma-separated)', placeholder: 'CAD, rocketry, Python, 3D printing', wide: true },
  { key: 'bio', label: 'About you', placeholder: 'What are you learning, making, dreaming about?', wide: true, multiline: true },
  { key: 'project', label: 'Project spotlight', placeholder: 'A project you are proud of, what it does, and what you contributed', wide: true, multiline: true },
];

function fromCloud(row: Record<string, unknown>): StudentProfile {
  const value = (key:string) => typeof row[key] === 'string' ? row[key] as string : '';
  return {
    name:value('display_name'),headline:value('headline'),university:value('university'),organization:value('organization'),
    major:value('major'),year:value('graduation_year'),location:value('location'),bio:value('bio'),
    skills:value('skills'),project:value('featured_project'),website:value('portfolio_url'),contact:value('contact_email'),
    banner:value('banner_url'),avatar:value('avatar_url'),
  };
}

async function resizePhoto(file: File, maxSize: number): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Choose a photo (JPG, PNG, or similar).');
  if (file.size > 8 * 1024 * 1024) throw new Error('Please choose a photo smaller than 8 MB.');
  const photo = new Image();
  const objectUrl = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      photo.onload = () => resolve();
      photo.onerror = () => reject(new Error('Could not open that photo.'));
      photo.src = objectUrl;
    });
    const ratio = Math.min(1, maxSize / Math.max(photo.width, photo.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(photo.width * ratio));
    canvas.height = Math.max(1, Math.round(photo.height * ratio));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Photo editing is not available in your browser.');
    context.drawImage(photo, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', .75);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function safeUrl(value: string) {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return ['https:', 'http:'].includes(url.protocol) && url.hostname.includes('.') ? url.href : '';
  } catch { return ''; }
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const [visitor, setVisitor] = useState(false);
  const [saved, setSaved] = useState(false);
  const [accountUserId,setAccountUserId] = useState<string | null>(null);
  const [saving,setSaving] = useState(false);
  const editRef = useRef<HTMLElement>(null);
  const web = safeUrl(profile.website);
  const skills = useMemo(() => profile.skills.split(',').map(skill => skill.trim()).filter(Boolean).slice(0, 12), [profile.skills]);
  const complete = ['name', 'headline', 'organization', 'major', 'bio', 'avatar']
    .filter(key => Boolean(profile[key as keyof StudentProfile].trim())).length;
  const percent = Math.round(complete / 6 * 100);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let active = true;
    void supabase.auth.getUser().then(async ({data}) => {
      if (!active || !data.user) return;
      const {data:cloudProfile,error} = await supabase.from('student_profiles').select('*').eq('user_id',data.user.id).maybeSingle();
      if (!active) return;
      if (error) {setNotice('Account connected, but the profile database is not ready yet.');return;}
      setAccountUserId(data.user.id);
      if (cloudProfile) setProfile(fromCloud(cloudProfile));
      setNotice('Your verified email account is connected. Profile changes will save to your secure database.');
    });
    return ()=>{active=false;};
  },[]);

  const setField = (key: keyof StudentProfile, value: string) => {
    setProfile(current => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const save = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase && accountUserId) {
      setSaving(true);
      try {
        const cloudPhoto = async (photo:string,field:'avatar'|'banner') => {
          if (!photo.startsWith('data:image/')) return photo;
          const blob = await (await fetch(photo)).blob();
          const path = `${accountUserId}/${field}.jpg`;
          const {error} = await supabase.storage.from('student-profile-media').upload(path,blob,{contentType:'image/jpeg',upsert:true,cacheControl:'3600'});
          if (error) throw error;
          const {data} = supabase.storage.from('student-profile-media').getPublicUrl(path);
          return `${data.publicUrl}?v=${Date.now()}`;
        };
        const avatar = await cloudPhoto(profile.avatar,'avatar');
        const banner = await cloudPhoto(profile.banner,'banner');
        const {error} = await supabase.from('student_profiles').update({
          display_name:profile.name,headline:profile.headline,university:profile.university,
          organization:profile.organization,major:profile.major,graduation_year:profile.year,
          location:profile.location,bio:profile.bio,skills:profile.skills,featured_project:profile.project,
          portfolio_url:profile.website,contact_email:profile.contact,avatar_url:avatar,banner_url:banner,
        }).eq('user_id',accountUserId).select('user_id').single();
        if (error) throw error;
        setProfile({...profile,avatar,banner});
        setEditing(false);setSaved(true);
        setNotice('Saved securely to your student account.');
        window.dispatchEvent(new Event('sponsierra-auth-changed'));
      } catch (error) {setNotice(error instanceof Error?error.message:'Could not save to your account. Please try again.');}
      finally {setSaving(false);}
      return;
    }
    setNotice('Please sign in before saving your profile.');
  };
  const upload = async (file: File | undefined, field: 'banner' | 'avatar') => {
    if (!file) return;
    try { setField(field, await resizePhoto(file, field === 'avatar' ? 360 : 1400)); setNotice('Photo ready. Save your profile to keep it.'); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Photo upload failed.'); }
  };
  const beginEditing = () => { setVisitor(false); setEditing(true); setTimeout(() => editRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); };

  return <div className="ss-student-page">
    <div className="ss-student-intro" data-ss-reveal>
      <div><span className="ss-eyebrow"><Stars size={15}/> YOUR STUDENT SPACE</span><h1>More than a résumé.<br/><em>Show what moves you.</em></h1><p>Tell your engineering story, highlight your projects, and represent your team.</p></div>
      <div className="ss-student-preview-label"><ShieldCheck size={17}/>{accountUserId?'Verified email account · Cloud profile':'Private profile preview · Saved on this device'}</div>
    </div>

    <div className="ss-student-cover" style={profile.banner ? { backgroundImage: `linear-gradient(120deg,rgba(18,13,27,.57),rgba(16,9,21,.14)),url("${profile.banner}")` } : undefined}>
      <div className="ss-student-cover-grid" aria-hidden="true"/>
      <div className="ss-student-cover-orbit" aria-hidden="true"/>
      <span className="ss-student-cover-badge"><Sparkles size={14}/> SPONSIERRA / STUDENT PROFILE</span>
      <span className="ss-student-cover-right">MADE FOR THE MAKERS.</span>
      {editing && !visitor && <label className="ss-student-cover-edit"><Camera size={17}/> Change banner<input type="file" accept="image/*" onChange={event => { void upload(event.target.files?.[0], 'banner'); event.target.value = ''; }}/></label>}
    </div>

    <div className="ss-student-identity">
      <div className="ss-student-avatar"><span className="ss-student-avatar-ring" aria-hidden="true"/>{profile.avatar ? <img src={profile.avatar} alt={`${profile.name || 'Student'} avatar`}/> : <UserRound size={45} strokeWidth={1.5}/>}</div>
      <div className="ss-student-primary">
        <span className="ss-student-kicker"><span className="ss-student-signal"/> STUDENT CREATOR · OHIO PILOT</span>
        <h2>{profile.name || 'Your name goes here'} <span className="ss-student-sticker">BUILD MODE <Sparkles size={13}/></span></h2>
        <p className="ss-student-headline">{profile.headline || 'Engineering student · Dreamer · Doer'}</p>
        <div className="ss-student-bio-meta">
          <span><School size={17}/>{profile.university || 'Add your university'}</span>
          <span><Users size={17}/>{profile.organization || 'Add your engineering organization'}</span>
          <span><MapPin size={17}/>{profile.location || 'United States'}</span>
        </div>
      </div>
      {!visitor && <button className="ss-student-edit-cta" onClick={beginEditing}><Pencil size={17}/> Edit profile</button>}
    </div>

    {(notice || saved) && <div className="ss-student-feedback" role="status"><Check size={17}/>{notice || 'Profile saved'}<button onClick={() => {setNotice('');setSaved(false);}} aria-label="Dismiss"><X size={16}/></button></div>}

    {editing && !visitor && <section className="ss-student-editor" ref={editRef}>
      <div className="ss-student-editor-heading"><div><span className="ss-eyebrow">PROFILE STUDIO</span><h3>Make this space yours.</h3><p>University and organization names can be entered manually—no specific email domain is required for this preview.</p></div><button onClick={() => setEditing(false)} aria-label="Close profile editor"><X size={19}/></button></div>
      <div className="ss-student-photo-controls">
        <label><Camera size={18}/> Change profile photo<input type="file" accept="image/*" onChange={event => { void upload(event.target.files?.[0], 'avatar'); event.target.value = ''; }}/></label>
        <label><ImagePlus size={18}/> Change cover<input type="file" accept="image/*" onChange={event => { void upload(event.target.files?.[0], 'banner'); event.target.value = ''; }}/></label>
      </div>
      <div className="ss-student-editor-fields">{EDIT_FIELDS.map(field => <label className={field.wide ? 'is-wide' : ''} key={field.key}><span>{field.label}</span>{field.multiline ? <textarea rows={4} value={profile[field.key]} placeholder={field.placeholder} onChange={event => setField(field.key, event.target.value)}/> : <input type={field.key === 'contact' ? 'email' : 'text'} value={profile[field.key]} maxLength={field.key === 'bio' ? 600 : 280} placeholder={field.placeholder} onChange={event => setField(field.key, event.target.value)}/>}</label>)}</div>
      <div className="ss-student-editor-foot"><button className="ss-button ss-button-red" onClick={()=>{void save();}} disabled={saving}><Save size={17}/>{saving?'Saving securely…':'Save student profile'}</button><span>{accountUserId?'Your information saves to your private student account. Uploaded profile pictures have publicly accessible URLs.':'Your details and photos remain in this browser until you sign in with a connected account.'}</span></div>
    </section>}

    <div className="ss-student-layout">
      <div className="ss-student-main">
        <section className="ss-student-panel ss-student-about" data-ss-reveal>
          <div className="ss-student-panel-heading"><div><span className="ss-eyebrow">ABOUT ME</span><h3>The person behind the projects.</h3></div><button onClick={beginEditing} aria-label="Edit about section"><Pencil size={17}/></button></div>
          <p>{profile.bio || 'Your next chapter starts here. Add a few lines about what you are passionate about, the problems you want to solve, and the engineering ideas keeping you up at night.'}</p>
          {skills.length > 0 ? <div className="ss-student-skill-list">{skills.map((skill, index) => <span key={`${skill}-${index}`}>{index % 3 === 0 ? '✦' : index % 3 === 1 ? '◌' : '✧'} {skill}</span>)}</div> : <button className="ss-student-add-detail" onClick={beginEditing}><Plus size={16}/> Add skills that represent you</button>}
        </section>

        <section className="ss-student-panel ss-student-experience" data-ss-reveal>
          <div className="ss-student-panel-heading"><div><span className="ss-eyebrow">MY JOURNEY</span><h3>Education & campus life.</h3></div><button onClick={beginEditing} aria-label="Edit university and organization"><Pencil size={17}/></button></div>
          <div className="ss-student-experience-row"><span className="ss-student-experience-icon"><GraduationCap size={25}/></span><div><strong>{profile.university || 'Your university'}</strong><p>{profile.major || 'Add your field of study'}{profile.year ? ` · ${profile.year}` : ''}</p><small><BadgeCheck size={14}/> University shown as entered · Verification will follow account launch</small></div></div>
          <div className="ss-student-experience-row"><span className="ss-student-experience-icon is-team"><Users size={24}/></span><div><strong>{profile.organization || 'Your engineering team or organization'}</strong><p>Share your student organization and your role in the team.</p><small><HeartHandshake size={14}/> Team membership will be verified separately from email domain</small></div></div>
        </section>

        <section className="ss-student-panel ss-student-projects" data-ss-reveal>
          <div className="ss-student-panel-heading"><div><span className="ss-eyebrow">PROJECT SPOTLIGHT</span><h3>Built, not just imagined.</h3></div><button onClick={beginEditing} aria-label="Edit featured project"><Pencil size={17}/></button></div>
          <div className="ss-student-project-card"><div className="ss-student-project-art"><span>01 / FEATURED BUILD</span><Sparkles size={54} strokeWidth={1.1}/></div><div><strong>{profile.project ? 'My latest build' : 'Add your first project'}</strong><p>{profile.project || 'Bring your résumé to life with a rocket, robot, code project, or anything your team is proud to have built.'}</p>{web && <a href={web} target="_blank" rel="noopener noreferrer">View my portfolio <ChevronRight size={16}/></a>}</div></div>
        </section>

        <section className="ss-student-panel ss-student-activity" data-ss-reveal>
          <div className="ss-student-panel-heading"><div><span className="ss-eyebrow">ACTIVITY</span><h3>Your engineering story, in real time.</h3></div><span className="ss-student-lock-tag"><LockKeyhole size={15}/> MEMBERSHIP FEATURE</span></div>
          <div className="ss-student-post-locked"><div className="ss-student-post-lock-icon"><LockKeyhole size={26}/></div><div><strong>Posting unlocks with Student Membership.</strong><p>Free accounts will have a student profile and bio. Posts, photos, and community interactions will be for subscribers when secure payments launch.</p><small>Membership price: under research · No charges today</small></div></div>
        </section>
      </div>

      <aside className="ss-student-rail">
        <section className="ss-student-panel ss-student-progress" data-ss-reveal><span className="ss-eyebrow"><Stars size={15}/> PROFILE ENERGY</span><div className="ss-student-progress-top"><span className="ss-student-progress-ring" style={{ '--progress': `${percent}%` } as React.CSSProperties}><strong>{percent}%</strong></span><div><strong>Make it unmistakably you.</strong><small>{complete} of 6 essentials completed</small></div></div><div className="ss-student-progress-line"><span style={{width:`${percent}%`}}/></div><p>More details help future teammates and sponsors understand what you do.</p><button onClick={beginEditing}>Keep building your profile <ChevronRight size={16}/></button></section>
        <section className="ss-student-panel ss-student-rail-note" data-ss-reveal><span className="ss-eyebrow">YOUR CAMPUS CREW</span><h3>{profile.organization || 'Find your team identity.'}</h3><p>Start with Ohio State. Individual profiles can connect to student organizations once account verification is available.</p><span><School size={17}/> OHIO STATE PILOT</span></section>
        <section className="ss-student-panel ss-student-member" data-ss-reveal><div className="ss-student-member-icon"><CircleUserRound size={24}/></div><span>YOUR ACCESS</span><h3>Student Basic</h3><p>A free profile and bio. Posting will require an individual monthly membership after launch.</p><div><LockKeyhole size={15}/> Paid features inactive in preview</div></section>
      </aside>
    </div>
  </div>;
}
