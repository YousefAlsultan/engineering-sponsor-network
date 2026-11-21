-- Milestone 2.1: student accounts for the Ohio State pilot.
-- Run in your own Supabase project's SQL editor. No live data is changed by committing this file.

create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 120),
  headline text not null default '' check (char_length(headline) <= 280),
  university text not null default 'The Ohio State University' check (char_length(university) <= 180),
  organization text not null default '' check (char_length(organization) <= 180),
  major text not null default '' check (char_length(major) <= 180),
  graduation_year text not null default '' check (char_length(graduation_year) <= 80),
  location text not null default 'Columbus, Ohio, USA' check (char_length(location) <= 150),
  bio text not null default '' check (char_length(bio) <= 1200),
  skills text not null default '' check (char_length(skills) <= 500),
  featured_project text not null default '' check (char_length(featured_project) <= 1800),
  portfolio_url text not null default '' check (char_length(portfolio_url) <= 500),
  contact_email text not null default '' check (char_length(contact_email) <= 320),
  avatar_url text not null default '' check (char_length(avatar_url) <= 1000),
  banner_url text not null default '' check (char_length(banner_url) <= 1000),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_affiliations (
  user_id uuid primary key references auth.users(id) on delete cascade,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','rejected')),
  verified_at timestamptz,
  verified_by uuid,
  updated_at timestamptz not null default now()
);

create table if not exists public.student_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free','student_plus')),
  billing_status text not null default 'inactive'
    check (billing_status in ('inactive','trialing','active','past_due','canceled')),
  paid_until timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.student_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists student_posts_recent_idx on public.student_posts (created_at desc);
create index if not exists student_posts_owner_idx on public.student_posts (user_id);

create table if not exists public.student_activity (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  occurred_at timestamptz not null default now()
);
create index if not exists student_activity_recent_idx on public.student_activity (user_id, occurred_at desc);

-- Service-only queue for the planned Notion account tracker integration.
-- Contains no credentials, passwords, or email contents.
create table if not exists public.notion_account_sync_queue (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  queued_at timestamptz not null default now(),
  processed_at timestamptz,
  attempts integer not null default 0
);
create index if not exists notion_account_sync_pending_idx on public.notion_account_sync_queue (queued_at) where processed_at is null;
create index if not exists notion_account_sync_owner_idx on public.notion_account_sync_queue (user_id);

alter table public.student_profiles enable row level security;
alter table public.student_affiliations enable row level security;
alter table public.student_memberships enable row level security;
alter table public.student_posts enable row level security;
alter table public.student_activity enable row level security;
alter table public.notion_account_sync_queue enable row level security;

-- Restrict exposed tables to the smallest roles and operations needed.
revoke all on public.student_profiles,public.student_affiliations,public.student_memberships,
  public.student_posts,public.student_activity,public.notion_account_sync_queue from anon,authenticated;
grant select,insert,update on public.student_profiles to authenticated;
grant select on public.student_affiliations,public.student_memberships,public.student_activity to authenticated;
grant select,insert,delete on public.student_posts to authenticated;

-- Profile fields are student-editable; verified affiliation and membership are isolated tables.
create policy "View own or published profile" on public.student_profiles for select
  to authenticated using ((select auth.uid()) = user_id or is_public);
create policy "Create own profile" on public.student_profiles for insert
  to authenticated with check ((select auth.uid()) = user_id);
create policy "Edit own profile" on public.student_profiles for update
  to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "View own verified affiliation" on public.student_affiliations for select
  to authenticated using ((select auth.uid()) = user_id);
create policy "View own membership" on public.student_memberships for select
  to authenticated using ((select auth.uid()) = user_id);
create policy "Read published posts" on public.student_posts for select
  to authenticated using (true);
create policy "Subscribers may post" on public.student_posts for insert
  to authenticated with check (
    (select auth.uid()) = user_id and exists (
      select 1 from public.student_memberships m
      where m.user_id = (select auth.uid())
        and m.tier = 'student_plus' and m.billing_status = 'active'
        and m.paid_until > now()
    )
  );
create policy "Owners may remove posts" on public.student_posts for delete
  to authenticated using ((select auth.uid()) = user_id);
create policy "View own activity" on public.student_activity for select
  to authenticated using ((select auth.uid()) = user_id);
-- No client write policies on verification, membership, activities, or Notion sync.

create or replace function public.touch_student_profile_timestamp()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger student_profile_timestamp before update on public.student_profiles
for each row execute function public.touch_student_profile_timestamp();

create or replace function public.create_student_account()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.student_profiles(user_id) values(new.id);
  insert into public.student_affiliations(user_id) values(new.id);
  insert into public.student_memberships(user_id) values(new.id);
  insert into public.student_activity(user_id,event_type) values(new.id,'account_created');
  insert into public.notion_account_sync_queue(user_id,event_type) values(new.id,'account_created');
  return new;
end;
$$;
-- Trigger-only SECURITY DEFINER function: never expose direct execution.
revoke all on function public.create_student_account() from public, anon, authenticated;
create trigger on_student_auth_created after insert on auth.users
for each row execute function public.create_student_account();

create or replace function public.record_student_activity(action text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'Not authenticated'; end if;
  if action not in ('signed_in','viewed_directory','saved_sponsor') then
    raise exception 'Activity type not allowed';
  end if;
  -- Prevent excessive activity entries from repeated taps or page refreshes.
  if exists (
    select 1 from public.student_activity
    where user_id = (select auth.uid()) and event_type = action
      and occurred_at > now() - interval '10 minutes'
  ) then return; end if;
  insert into public.student_activity(user_id,event_type) values ((select auth.uid()),action);
  insert into public.notion_account_sync_queue(user_id,event_type) values ((select auth.uid()),action);
end;
$$;
revoke all on function public.record_student_activity(text) from public, anon;
grant execute on function public.record_student_activity(text) to authenticated;

create or replace function public.track_student_profile_update()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.student_activity(user_id,event_type) values(new.user_id,'profile_updated');
  insert into public.notion_account_sync_queue(user_id,event_type) values(new.user_id,'profile_updated');
  return new;
end;
$$;
revoke all on function public.track_student_profile_update() from public, anon, authenticated;
create trigger on_student_profile_updated after update on public.student_profiles
for each row execute function public.track_student_profile_update();

-- Supabase Storage: uploads must live under each logged-in user's ID.
-- Public bucket means uploaded profile pictures can be viewed by URL; only upload
-- pictures intended to be publicly visible. Private posts/uploads come later.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('student-profile-media','student-profile-media',true,6291456,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "Students upload own profile media" on storage.objects for insert to authenticated
  with check (bucket_id='student-profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Students view own profile media" on storage.objects for select to authenticated
  using (bucket_id='student-profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Students update own profile media" on storage.objects for update to authenticated
  using (bucket_id='student-profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id='student-profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Students delete own profile media" on storage.objects for delete to authenticated
  using (bucket_id='student-profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
