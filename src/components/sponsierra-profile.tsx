'use client';

import { useEffect, useRef, useState } from 'react';
import { Award, BookOpen, Camera, Check, ExternalLink, GraduationCap, Heart, ImagePlus, Mail, MapPin, MessageCircle, Pencil, Plus, Send, ShieldCheck, Sparkles, Trash2, Upload, Users, X } from 'lucide-react';

type Profile={university:string;team:string;discipline:string;about:string;location:string;website:string;contact:string;members:string;achievements:string;banner:string;avatar:string};
type Comment={id:string;author:string;text:string};
type Post={id:string;text:string;image:string;createdAt:string;likes:number;liked:boolean;comments:Comment[]};
const PROFILE_KEY='sponsierra-profile-demo';
const POSTS_KEY='sponsierra-profile-posts-demo';
const DEFAULT:Profile={university:'Your university',team:'Your engineering team',discipline:'Rocketry · Robotics · Formula SAE',about:'Tell the story of your engineering team: the challenges you tackle, the things you build, and the impact you hope to create.',location:'United States',website:'',contact:'',members:'',achievements:'',banner:'',avatar:''};
function safeWebsite(value:string){try{const url=new URL(/^https?:\/\//i.test(value)?value:`https://${value}`);return ['http:','https:'].includes(url.protocol)&&url.hostname.includes('.')?url.toString():''}catch{return ''}}

// Resize images locally before saving to avoid large uploads and strip metadata.
async function compressPhoto(file:File,limit:number):Promise<string>{
  if(!file.type.startsWith('image/'))throw new Error('Please choose an image file.');
  if(file.size>8*1024*1024)throw new Error('Please choose an image smaller than 8 MB.');
  const picture=new Image();const objectUrl=URL.createObjectURL(file);
  try{
    await new Promise<void>((resolve,reject)=>{picture.onload=()=>resolve();picture.onerror=()=>reject(new Error('That image could not be opened.'));picture.src=objectUrl});
    const scale=Math.min(1,limit/Math.max(picture.width,picture.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(picture.width*scale));canvas.height=Math.max(1,Math.round(picture.height*scale));
    const context=canvas.getContext('2d');if(!context)throw new Error('Image editing is unavailable in this browser.');
    context.drawImage(picture,0,0,canvas.width,canvas.height);
    return canvas.toDataURL('image/jpeg',.73);
  }finally{URL.revokeObjectURL(objectUrl)}
}

export default function UniversityProfile(){
  const [profile,setProfile]=useState<Profile>(DEFAULT);
  const [posts,setPosts]=useState<Post[]>([]);
  const [editing,setEditing]=useState(false);
  const [visitor,setVisitor]=useState(false);
  const [saved,setSaved]=useState(false);
  const [notice,setNotice]=useState('');
  const [postText,setPostText]=useState('');
  const [postImage,setPostImage]=useState('');
  const [commentDrafts,setCommentDrafts]=useState<Record<string,string>>({});
  const [guestName,setGuestName]=useState('Preview visitor');
  const websiteHref=safeWebsite(profile.website);
  const editorRef=useRef<HTMLDivElement>(null);
  const feedRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    try{
      const raw=window.localStorage.getItem(PROFILE_KEY);if(raw)setProfile({...DEFAULT,...JSON.parse(raw)});
      const feed=window.localStorage.getItem(POSTS_KEY);if(feed){const parsed=JSON.parse(feed);if(Array.isArray(parsed))setPosts(parsed)}
    }catch{setNotice('Some saved demo data could not be loaded. You can still start fresh.')}
  },[]);
  const update=(key:keyof Profile,value:string)=>{setProfile(previous=>({...previous,[key]:value}));setSaved(false)};
  const persist=()=>{try{window.localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));setSaved(true);setEditing(false);setNotice('Your profile was saved on this device.')}catch{setNotice('Your browser storage is full. Try a smaller photo.')}};
  const persistPosts=(next:Post[])=>{try{window.localStorage.setItem(POSTS_KEY,JSON.stringify(next));setPosts(next);setNotice('');return true}catch{setNotice('Your browser storage is full. Try a smaller photo or delete an old post.');return false}};
  const handleImage=async(file:File|undefined,target:'banner'|'avatar'|'post')=>{if(!file)return;try{setNotice('Optimizing image…');const photo=await compressPhoto(file,target==='avatar'?420:target==='banner'?1300:1050);if(target==='post')setPostImage(photo);else update(target,photo);setNotice('Image ready. Save your profile or publish the post to keep it.')}catch(error){setNotice(error instanceof Error?error.message:'Could not open that image.')}};
  const openEditor=()=>{setVisitor(false);setEditing(true);window.setTimeout(()=>editorRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),60)};
  const publishPost=()=>{
    if(!postText.trim()&&!postImage)return;
    const next:Post={id:crypto.randomUUID(),text:postText.trim().slice(0,1200),image:postImage,createdAt:new Date().toISOString(),likes:0,liked:false,comments:[]};
    const list=[next,...posts];if(list.length>20){setNotice('This demo holds up to 20 posts. Remove an older post first.');return}
    if(persistPosts(list)){setPostText('');setPostImage('')}
  };
  const toggleLike=(id:string)=>persistPosts(posts.map(post=>post.id!==id?post:{...post,liked:!post.liked,likes:Math.max(0,post.likes+(post.liked?-1:1))}));
  const addComment=(id:string)=>{const value=(commentDrafts[id]||'').trim().slice(0,500);if(!value)return;const author=guestName.trim().slice(0,45)||'Preview visitor';persistPosts(posts.map(post=>post.id!==id?post:{...post,comments:[...post.comments,{id:crypto.randomUUID(),author:visitor?author:'Team member',text:value}]}));setCommentDrafts(previous=>({...previous,[id]:''}))};
  const deletePost=(id:string)=>persistPosts(posts.filter(post=>post.id!==id));

  return <div className="ss-profile-page">
    <div className="ss-profile-heading" data-ss-reveal><div><span className="ss-eyebrow">YOUR UNIVERSITY IDENTITY</span><h1>Every team has a story.<br/><span>Make yours stand out.</span></h1><p>Give future sponsors a real look at what your engineering team is building.</p><div className="ss-profile-heading-actions"><button className="ss-button ss-button-red ss-profile-start" onClick={openEditor}><Pencil size={17}/> Edit your team profile</button><button className={`ss-visitor-toggle ${visitor?'is-active':''}`} onClick={()=>{setVisitor(v=>!v);setEditing(false)}}><Users size={17}/>{visitor?'Leave visitor preview':'Preview as a visitor'}</button></div></div><div className="ss-preview-badge"><ShieldCheck size={17}/> Interactive demo · Only on this device</div></div>
    <div className={`ss-profile-cover ${profile.banner?'has-upload':''}`} style={profile.banner?{backgroundImage:`linear-gradient(90deg,rgba(21,15,30,.55),rgba(21,15,30,.06)),url("${profile.banner}")`}:undefined}><div className="ss-profile-orbits"/><span>SPONSIERRA / ENGINEERING TEAM</span><span className="ss-profile-cover-symbol"><Sparkles size={48}/></span>{editing&&<label className="ss-cover-upload"><Upload size={16}/> Change cover photo<input type="file" accept="image/*" onChange={e=>{void handleImage(e.target.files?.[0],'banner');e.target.value=''}} /></label>}</div>
    <div className="ss-profile-card"><div className={`ss-profile-avatar ${profile.avatar?'has-upload':''}`}>{profile.avatar?<img src={profile.avatar} alt={`${profile.team} profile picture`}/>:<GraduationCap size={42}/>} {editing&&<label className="ss-avatar-upload" title="Change profile picture"><Camera size={16}/><input type="file" accept="image/*" aria-label="Change profile picture" onChange={e=>{void handleImage(e.target.files?.[0],'avatar');e.target.value=''}}/></label>}</div>
      {!visitor&&<button className="ss-profile-edit" onClick={()=>editing?setEditing(false):openEditor()}><Pencil size={15}/>{editing?'Cancel edit':'Edit profile'}</button>}
      <div className="ss-eyebrow">UNIVERSITY ENGINEERING ORGANIZATION</div><h2>{profile.team}</h2><p>{profile.university}</p><div className="ss-profile-meta"><span><MapPin size={15}/>{profile.location}</span><span><Sparkles size={15}/>{profile.discipline}</span>{profile.members&&<span><Users size={15}/>{profile.members} members</span>}{websiteHref&&<a href={websiteHref} target="_blank" rel="noopener noreferrer"><ExternalLink size={15}/> Team website</a>}{profile.contact&&<a href={`mailto:${profile.contact}`}><Mail size={15}/> Contact team</a>}</div>
      {saved&&<div className="ss-profile-saved"><Check size={15}/> Saved in your browser</div>}
    </div>
    {(visitor||notice)&&<div className="ss-profile-demo-alert"><ShieldCheck size={18}/><span>{visitor?'Visitor preview: you can test likes and comments, but other people cannot see them yet.':'Local demo: your changes are visible only on this device.'}{notice&&<strong> {notice}</strong>}</span>{notice&&<button onClick={()=>setNotice('')} aria-label="Dismiss message"><X size={16}/></button>}</div>}
    {editing&&<div className="ss-profile-editor" ref={editorRef}><span className="ss-eyebrow">TEAM PROFILE STUDIO</span><h3>Make your profile your own.</h3><p>Upload a cover or profile photo, then add the details that help people understand your work.</p><div className="ss-editor-photo-row"><label className="ss-editor-photo-upload"><ImagePlus size={19}/><strong>Upload cover banner</strong><small>Landscape photo</small><input type="file" accept="image/*" onChange={e=>{void handleImage(e.target.files?.[0],'banner');e.target.value=''}}/></label><label className="ss-editor-photo-upload"><Camera size={19}/><strong>Upload team avatar</strong><small>Square image</small><input type="file" accept="image/*" onChange={e=>{void handleImage(e.target.files?.[0],'avatar');e.target.value=''}}/></label></div><div className="ss-proposal-fields">{(['university','team','discipline','location','members','website','contact','achievements','about'] as const).map(key=><label key={key}>{({about:'Your team story',achievements:'Awards and milestones',contact:'Public contact email',members:'Team members',website:'Team website'} as Record<string,string>)[key]||key.charAt(0).toUpperCase()+key.slice(1)}{key==='about'||key==='achievements'?<textarea rows={key==='about'?4:2} value={profile[key]} onChange={e=>update(key,e.target.value)} placeholder={key==='achievements'?'Competitions, prototypes, research milestones…':undefined}/>:<input value={profile[key]} onChange={e=>update(key,e.target.value)} type={key==='members'?'number':key==='contact'?'email':'text'}/>}</label>)}</div><div className="ss-profile-editor-actions"><button onClick={persist} className="ss-button ss-button-red"><Check size={16}/> Save profile</button>{(profile.banner||profile.avatar)&&<button className="ss-reset-images" onClick={()=>{setProfile(v=>({...v,banner:'',avatar:''}));setSaved(false)}}><Trash2 size={15}/> Remove photos</button>}</div><small>Images and profile details stay in this browser. Public profiles and account sign-in require the next backend milestone.</small></div>}
    <div className="ss-profile-sections"><section className="ss-profile-about"><span className="ss-eyebrow">01 / OUR STORY</span><h3>Driven by the desire to build.</h3><p>{profile.about}</p><div className="ss-profile-info"><div><Users size={22}/><strong>Team identity</strong><span>{profile.university}</span></div><div><Award size={22}/><strong>Achievements</strong><span>{profile.achievements||'Add your latest competition or project milestone'}</span></div><div><BookOpen size={22}/><strong>Engineering focus</strong><span>{profile.discipline}</span></div></div></section><aside className="ss-profile-actions"><span className="ss-eyebrow">YOUR ENGINEERING PORTFOLIO</span><h3>Build a record of progress.</h3><p>Show real projects, prototype updates, and team milestones in an activity feed.</p><button className="ss-button ss-button-red" onClick={()=>feedRef.current?.scrollIntoView({behavior:'smooth',block:'start'})}><Plus size={16}/> Explore the team feed</button><div className="ss-profile-note"><ShieldCheck size={18}/> Posts and reactions are interactive examples, not shared with real users yet.</div></aside></div>
    <section className="ss-profile-feed" ref={feedRef}><div className="ss-section-head"><div><span className="ss-eyebrow">02 / ENGINEERING JOURNAL</span><h2>From the workshop to the world.</h2><p>Document prototypes, progress, competitions, and the people behind each breakthrough.</p></div><span className="ss-feed-count">{posts.length} {posts.length===1?'POST':'POSTS'}</span></div>
      {!visitor&&<div className="ss-post-composer"><div className="ss-composer-avatar">{profile.avatar?<img src={profile.avatar} alt=""/>:<GraduationCap size={23}/>}</div><div className="ss-composer-body"><strong>Share something from {profile.team}</strong><textarea rows={3} maxLength={1200} placeholder="What did your team build or achieve today?" value={postText} onChange={e=>setPostText(e.target.value)}/>{postImage&&<div className="ss-post-attachment"><img src={postImage} alt="New post attachment preview"/><button onClick={()=>setPostImage('')} aria-label="Remove attached image"><X size={17}/></button></div>}<div className="ss-composer-actions"><label className="ss-post-photo"><ImagePlus size={19}/> Add a photo<input type="file" accept="image/*" aria-label="Attach a post photo" onChange={e=>{void handleImage(e.target.files?.[0],'post');e.target.value=''}}/></label><button className="ss-button ss-button-red" disabled={!postText.trim()&&!postImage} onClick={publishPost}><Send size={16}/> Publish demo post</button></div></div></div>}
      {visitor&&<div className="ss-guest-control"><Users size={18}/><label>Comment as <input value={guestName} maxLength={45} onChange={e=>setGuestName(e.target.value)}/></label><span>Local visitor simulation</span></div>}
      <div className="ss-post-list">{posts.length===0?<div className="ss-feed-empty"><Camera size={32}/><h3>Your story starts with a single update.</h3><p>{visitor?'Switch back to team mode to create the first post.':'Share a team photo, workshop milestone, or competition result to see it appear in your portfolio.'}</p></div>:posts.map(post=><article className="ss-post" key={post.id}><header><div className="ss-post-avatar">{profile.avatar?<img src={profile.avatar} alt=""/>:<GraduationCap size={20}/>}</div><div><strong>{profile.team}</strong><small>{new Date(post.createdAt).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})} · Team update</small></div>{!visitor&&<button className="ss-post-delete" onClick={()=>deletePost(post.id)} title="Delete this local demo post" aria-label="Delete post"><Trash2 size={17}/></button>}</header>{post.text&&<p>{post.text}</p>}{post.image&&<img className="ss-post-image" src={post.image} alt={`Photo shared by ${profile.team}`}/>}<div className="ss-post-engagement"><button aria-label={post.liked?'Unlike post':'Like post'} aria-pressed={post.liked} className={post.liked?'is-liked':''} onClick={()=>toggleLike(post.id)}><Heart size={19} fill={post.liked?'currentColor':'none'}/>{post.likes} {post.likes===1?'like':'likes'}</button><span><MessageCircle size={18}/>{post.comments.length} {post.comments.length===1?'comment':'comments'}</span></div>{post.comments.length>0&&<div className="ss-post-comments">{post.comments.map(comment=><div key={comment.id}><strong>{comment.author}</strong><span>{comment.text}</span></div>)}</div>}<form className="ss-comment-composer" onSubmit={e=>{e.preventDefault();addComment(post.id)}}><input aria-label="Write a comment" placeholder={visitor?'Write a preview visitor comment…':'Write a team comment…'} maxLength={500} value={commentDrafts[post.id]||''} onChange={e=>setCommentDrafts(old=>({...old,[post.id]:e.target.value}))}/><button type="submit" disabled={!commentDrafts[post.id]?.trim()} aria-label="Post comment"><Send size={16}/></button></form></article>)}</div>
      <p className="ss-feed-disclaimer"><ShieldCheck size={16}/> Demo feed: no other students or companies can access these posts yet. Account-based shared interaction is planned for a server-backed release.</p>
    </section>
  </div>;
}
