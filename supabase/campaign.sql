-- D&D V6, Supabase/PostgreSQL. Executar uma vez no SQL Editor de um projeto próprio.
-- Não contém credenciais. RLS por usuário/sala. Requer autenticação Supabase (email OTP).
create extension if not exists pgcrypto;

create table if not exists public.dnd_rooms (
  id uuid primary key default gen_random_uuid(),
  invite_code uuid unique not null default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now()
);
create table if not exists public.dnd_members (
  room_id uuid not null references public.dnd_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('master','player')) default 'player',
  joined_at timestamptz not null default now(),
  primary key(room_id, user_id)
);
create table if not exists public.dnd_sheets (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.dnd_rooms(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  character_id text not null check (char_length(character_id) between 1 and 120),
  payload jsonb not null check (jsonb_typeof(payload)='object'),
  updated_at timestamptz not null default now(),
  unique(room_id,owner_id,character_id)
);
create index if not exists dnd_sheets_room_idx on public.dnd_sheets(room_id,updated_at desc);
create index if not exists dnd_members_user_idx on public.dnd_members(user_id);

alter table public.dnd_rooms enable row level security;
alter table public.dnd_members enable row level security;
alter table public.dnd_sheets enable row level security;

-- Security-definer helper prevents recursive member-policy evaluation.
create or replace function public.dnd_is_member(room uuid, member uuid default auth.uid())
returns boolean language sql stable security definer set search_path=''
as $$
  select member is not null and exists
  (select 1 from public.dnd_members m where m.room_id=room and m.user_id=member)
$$;
create or replace function public.dnd_is_master(room uuid, member uuid default auth.uid())
returns boolean language sql stable security definer set search_path=''
as $$
  select member is not null and exists
  (select 1 from public.dnd_members m where m.room_id=room and m.user_id=member and m.role='master')
$$;
revoke all on function public.dnd_is_member(uuid,uuid) from public;
revoke all on function public.dnd_is_master(uuid,uuid) from public;
grant execute on function public.dnd_is_member(uuid,uuid) to authenticated;
grant execute on function public.dnd_is_master(uuid,uuid) to authenticated;

-- SECURITY: helper accepts a user id for internal RLS and must not be usable to
-- test arbitrary memberships. Restrict helpers further by verifying identity.
create or replace function public.dnd_is_member(room uuid, member uuid default auth.uid())
returns boolean language sql stable security definer set search_path=''
as $$
  select auth.uid() is not null and member=auth.uid() and exists
  (select 1 from public.dnd_members m where m.room_id=room and m.user_id=auth.uid())
$$;
create or replace function public.dnd_is_master(room uuid, member uuid default auth.uid())
returns boolean language sql stable security definer set search_path=''
as $$
  select auth.uid() is not null and member=auth.uid() and exists
  (select 1 from public.dnd_members m where m.room_id=room and m.user_id=auth.uid() and m.role='master')
$$;

-- A sala criada só fica visível ao dono ou membro autenticado.
drop policy if exists dnd_rooms_select on public.dnd_rooms;
create policy dnd_rooms_select on public.dnd_rooms for select to authenticated
using(owner_id=(select auth.uid()) or public.dnd_is_member(id));
drop policy if exists dnd_rooms_insert on public.dnd_rooms;
create policy dnd_rooms_insert on public.dnd_rooms for insert to authenticated
with check(owner_id=(select auth.uid()));
drop policy if exists dnd_rooms_update on public.dnd_rooms;
create policy dnd_rooms_update on public.dnd_rooms for update to authenticated
using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
drop policy if exists dnd_rooms_delete on public.dnd_rooms;
create policy dnd_rooms_delete on public.dnd_rooms for delete to authenticated
using(owner_id=(select auth.uid()));

-- Apenas membros autenticados leem a lista de membros.
drop policy if exists dnd_members_select on public.dnd_members;
create policy dnd_members_select on public.dnd_members for select to authenticated
using(public.dnd_is_member(room_id) or exists(select 1 from public.dnd_rooms r where r.id=room_id and r.owner_id=(select auth.uid())));
drop policy if exists dnd_members_insert_owner on public.dnd_members;
create policy dnd_members_insert_owner on public.dnd_members for insert to authenticated
with check(user_id=(select auth.uid()) and role='master' and exists(select 1 from public.dnd_rooms r where r.id=room_id and r.owner_id=(select auth.uid())));
drop policy if exists dnd_members_delete_self on public.dnd_members;
create policy dnd_members_delete_self on public.dnd_members for delete to authenticated
using(user_id=(select auth.uid()));

-- O jogador lê apenas suas próprias fichas; Mestre lê as da sua sala.
drop policy if exists dnd_sheets_select on public.dnd_sheets;
create policy dnd_sheets_select on public.dnd_sheets for select to authenticated
using((owner_id=(select auth.uid()) or public.dnd_is_master(room_id)) and public.dnd_is_member(room_id));
drop policy if exists dnd_sheets_insert on public.dnd_sheets;
create policy dnd_sheets_insert on public.dnd_sheets for insert to authenticated
with check(owner_id=(select auth.uid()) and public.dnd_is_member(room_id));
drop policy if exists dnd_sheets_update on public.dnd_sheets;
create policy dnd_sheets_update on public.dnd_sheets for update to authenticated
using(owner_id=(select auth.uid()) and public.dnd_is_member(room_id))
with check(owner_id=(select auth.uid()) and public.dnd_is_member(room_id));
drop policy if exists dnd_sheets_delete on public.dnd_sheets;
create policy dnd_sheets_delete on public.dnd_sheets for delete to authenticated
using(owner_id=(select auth.uid()) and public.dnd_is_member(room_id));

-- Convite de UUID de alta entropia; usuário autenticado entra somente sabendo o código.
create or replace function public.join_dnd_room(invite_code uuid)
returns uuid language plpgsql security definer set search_path=''
as $$
declare target uuid;
begin
  if auth.uid() is null then raise exception 'Faça login antes de entrar.'; end if;
  select r.id into target from public.dnd_rooms r where r.invite_code=join_dnd_room.invite_code;
  if target is null then raise exception 'Código de convite inválido.'; end if;
  insert into public.dnd_members(room_id,user_id,role)
  values(target,auth.uid(),'player')
  on conflict(room_id,user_id) do nothing;
  return target;
end;
$$;
revoke all on function public.join_dnd_room(uuid) from public;
grant execute on function public.join_dnd_room(uuid) to authenticated;

grant select, insert, update, delete on public.dnd_rooms,public.dnd_members,public.dnd_sheets to authenticated;
-- Realtime depende de o projeto ter a publicação supabase_realtime habilitada.
do $$ begin
 alter publication supabase_realtime add table public.dnd_sheets;
exception when duplicate_object then null; when undefined_object then null;
end $$;