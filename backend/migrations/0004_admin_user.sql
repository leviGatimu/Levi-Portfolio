-- 0004_admin_user.sql
-- Grants admin access to the auth user created in the Supabase dashboard.
-- UID for getmorelev@gmail.com (Authentication -> Users). Safe to run more than once.

insert into public.admins (user_id)
values ('a7e82642-39f4-440d-9bda-3fd69047150d')
on conflict (user_id) do nothing;

-- Check: should return exactly one row.
select a.user_id, u.email, a.created_at
from public.admins a
join auth.users u on u.id = a.user_id;
