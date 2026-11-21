'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

// Static pages contain no account data. Supabase RLS enforces data access.
export default function AccountRequired({children}:{children:React.ReactNode}) {
  const router = useRouter();
  const [allowed,setAllowed] = useState(false);
  useEffect(()=>{
    const client=getSupabaseBrowserClient();
    let active=true;
    const check=async()=>{
      const result=await client?.auth.getUser();
      if(!active)return;
      if(result?.data.user && !result.error)setAllowed(true);
      else {setAllowed(false);router.replace('/account');}
    };
    void check();
    const subscription=client?.auth.onAuthStateChange((_event,session)=>{
      if(!session){setAllowed(false);router.replace('/account');}
      else setTimeout(()=>{void check();},0);
    }).data.subscription;
    return ()=>{active=false;subscription?.unsubscribe();};
  },[router]);
  return allowed ? children : null;
}
