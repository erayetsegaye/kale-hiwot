-- =============================================================================
-- Migration 0004: Add 'super_admin' role and update RLS helper functions
-- =============================================================================

-- Add 'super_admin' to user_role enum if it does not already exist
do $$
begin
  if not exists (
    select 1 from pg_enum
    join pg_type on pg_enum.enumtypid = pg_type.oid
    where pg_type.typname = 'user_role' and pg_enum.enumlabel = 'super_admin'
  ) then
    alter type user_role add value 'super_admin' before 'admin';
  end if;
end $$;

-- Update is_admin() to include both 'admin' and 'super_admin'
create or replace function is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(current_role_name() in ('admin', 'super_admin'), false) $$;

-- Helper to check strictly for super_admin
create or replace function is_super_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(current_role_name() = 'super_admin', false) $$;

-- Helper to check strictly for parent
create or replace function is_parent()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(current_role_name() = 'parent', false) $$;
