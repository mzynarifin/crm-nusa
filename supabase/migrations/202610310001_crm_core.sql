-- Core CRM schema for the first production phase.
-- Apply with: supabase db push (after linking your Supabase project).

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  role text not null default 'sales' check (role in ('admin', 'manager', 'sales', 'cs')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists email text not null default '';
update public.profiles p set email = u.email from auth.users u where p.id = u.id and p.email = '';
create unique index if not exists profiles_email_unique_idx on public.profiles(lower(email)) where email <> '';

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text not null default '',
  email text,
  phone text,
  source text not null default 'Manual',
  status text not null default 'Active' check (status in ('Active', 'Prospect', 'Inactive')),
  owner_id uuid references public.profiles(id),
  owner_name text not null default '',
  lifetime_value numeric(14,2) not null default 0 check (lifetime_value >= 0),
  last_contact_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text not null default '',
  email text,
  phone text,
  source text not null default 'Manual',
  status text not null default 'New' check (status in ('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost')),
  owner_id uuid references public.profiles(id),
  owner_name text not null default '',
  estimated_value numeric(14,2) not null default 0 check (estimated_value >= 0),
  converted_customer_id uuid references public.customers(id),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  customer_id uuid references public.customers(id),
  customer_name text not null default '',
  stage text not null default 'Lead' check (stage in ('Lead', 'Contact', 'Negotiation', 'Won', 'Lost')),
  amount numeric(14,2) not null default 0 check (amount >= 0),
  owner_id uuid not null references public.profiles(id),
  owner_name text not null default '',
  close_date date,
  lost_reason text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  quotation_no text not null unique,
  customer_id uuid references public.customers(id),
  customer_name text not null default '',
  total_amount numeric(14,2) not null default 0 check (total_amount >= 0),
  status text not null default 'Draft' check (status in ('Draft', 'Pending Approval', 'Approved', 'Rejected', 'Sent', 'Accepted', 'Expired')),
  created_by uuid not null references public.profiles(id),
  owner_name text not null default '',
  expiry_date date,
  notes text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations(id) on delete cascade,
  product_id uuid,
  description text not null,
  quantity numeric(12,2) not null default 1 check (quantity > 0),
  unit_price numeric(14,2) not null default 0 check (unit_price >= 0),
  discount_percent numeric(5,2) not null default 0 check (discount_percent between 0 and 100),
  tax_percent numeric(5,2) not null default 0 check (tax_percent between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations(id) on delete cascade,
  approver_id uuid not null references public.profiles(id),
  decision text not null check (decision in ('approved', 'rejected')),
  note text,
  decided_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  description text,
  kind text not null default 'service' check (kind in ('physical', 'service')),
  category text,
  price numeric(14,2) not null default 0 check (price >= 0),
  stock_on_hand integer check (stock_on_hand is null or stock_on_hand >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (kind = 'physical' or stock_on_hand is null)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  activity_type text not null default 'Follow-up',
  customer_id uuid references public.customers(id),
  customer_name text not null default '',
  deal_id uuid references public.deals(id),
  assigned_to uuid not null references public.profiles(id),
  due_at timestamptz,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  status text not null default 'open' check (status in ('open', 'done', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_no text not null unique,
  customer_id uuid references public.customers(id),
  customer_name text not null default '',
  quotation_id uuid references public.quotations(id),
  total_amount numeric(14,2) not null default 0 check (total_amount >= 0),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'partial', 'paid', 'refunded')),
  owner_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  method text not null check (method in ('cash', 'bank_transfer', 'other')),
  reference_no text,
  paid_at timestamptz not null default now(),
  recorded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_no text not null unique,
  customer_id uuid references public.customers(id),
  customer_name text not null default '',
  subject text not null,
  category text not null default 'General',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists customers_owner_idx on public.customers(owner_id) where deleted_at is null;
create unique index if not exists customers_email_unique_idx on public.customers(lower(email)) where email is not null and deleted_at is null;
create index if not exists leads_owner_idx on public.leads(owner_id) where deleted_at is null;
create unique index if not exists leads_email_unique_idx on public.leads(lower(email)) where email is not null and deleted_at is null;
create index if not exists leads_status_idx on public.leads(status) where deleted_at is null;
create index if not exists deals_owner_stage_idx on public.deals(owner_id, stage) where deleted_at is null;
create index if not exists quotations_status_idx on public.quotations(status) where deleted_at is null;
create index if not exists quotations_creator_idx on public.quotations(created_by) where deleted_at is null;
create index if not exists activities_assignee_due_idx on public.activities(assigned_to, due_at);
create index if not exists transactions_customer_idx on public.transactions(customer_id);
create index if not exists tickets_status_idx on public.tickets(status, priority);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);

create or replace function public.current_crm_role()
returns text
language sql stable security definer
set search_path = public
as $$
  select case
    when p.role in ('admin','manager') and coalesce(auth.jwt()->>'aal', 'aal1') <> 'aal2' then null
    else p.role
  end
  from public.profiles p where p.id = auth.uid() and p.is_active = true
$$;

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), coalesce(new.email, ''), 'sales')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users
for each row execute function public.create_profile_for_new_user();

create or replace function public.sync_profile_email_from_auth()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  update public.profiles set email = coalesce(new.email, '') where id = new.id;
  return new;
end $$;

drop trigger if exists on_auth_user_email_updated_profile on auth.users;
create trigger on_auth_user_email_updated_profile after update of email on auth.users
for each row when (old.email is distinct from new.email)
execute function public.sync_profile_email_from_auth();

create or replace function public.is_crm_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$ select coalesce(public.current_crm_role() = 'admin', false) $$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end $$;

create or replace function public.log_crm_change()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare row_id uuid;
begin
  if tg_op = 'DELETE' then row_id := old.id; else row_id := new.id; end if;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, details)
  values (auth.uid(), lower(tg_op), tg_table_name, row_id, jsonb_build_object('table', tg_table_name));
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['profiles','customers','leads','deals','quotations','products','activities','transactions','tickets'] loop
    execute format('drop trigger if exists touch_%I_updated_at on public.%I', t, t);
    execute format('create trigger touch_%I_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

do $$
declare t text;
begin
  foreach t in array array['profiles','customers','leads','deals','quotations','products','activities','transactions','payments','tickets'] loop
    execute format('drop trigger if exists audit_%I_change on public.%I', t, t);
    execute format('create trigger audit_%I_change after insert or update or delete on public.%I for each row execute function public.log_crm_change()', t, t);
  end loop;
end $$;

create or replace function public.decide_quotation(target_quotation_id uuid, decision text)
returns public.quotations
language plpgsql security definer
set search_path = public
as $$
declare result public.quotations;
begin
  if coalesce(public.current_crm_role(), '') not in ('admin', 'manager') then
    raise exception 'Only Admin or Manager can decide quotations' using errcode = '42501';
  end if;
  if decision not in ('approved', 'rejected') then
    raise exception 'Decision must be approved or rejected';
  end if;
  if not exists (select 1 from public.quotation_items qi where qi.quotation_id = target_quotation_id) then
    raise exception 'Quotation needs at least one line item before approval';
  end if;
  update public.quotations
     set status = case when decision = 'approved' then 'Approved' else 'Rejected' end
   where id = target_quotation_id and status = 'Pending Approval'
   returning * into result;
  if result.id is null then raise exception 'Quotation is not awaiting approval'; end if;
  insert into public.approvals(quotation_id, approver_id, decision)
  values (target_quotation_id, auth.uid(), decision);
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, details)
  values (auth.uid(), 'quotation.' || decision, 'quotation', target_quotation_id, jsonb_build_object('decision', decision));
  return result;
end $$;

create or replace function public.send_quotation(target_quotation_id uuid)
returns public.quotations
language plpgsql security definer
set search_path = public
as $$
declare result public.quotations;
begin
  if exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','manager'))
     and coalesce(auth.jwt()->>'aal', 'aal1') <> 'aal2' then
    raise exception 'Admin and Manager accounts require MFA' using errcode = '42501';
  end if;
  update public.quotations q
     set status = 'Sent'
   where q.id = target_quotation_id
     and q.status = 'Approved'
     and (q.created_by = auth.uid() or public.current_crm_role() = 'admin')
   returning q.* into result;
  if result.id is null then raise exception 'Quotation must be approved and assigned to you' using errcode = '42501'; end if;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id)
  values (auth.uid(), 'quotation.sent', 'quotation', target_quotation_id);
  return result;
end $$;

create or replace function public.record_transaction_payment(target_transaction_id uuid, payment_amount numeric, payment_method text)
returns public.transactions
language plpgsql security definer
set search_path = public
as $$
declare
  transaction_row public.transactions;
  paid_total numeric(14,2);
  result public.transactions;
  actor_role text := public.current_crm_role();
begin
  if actor_role not in ('admin', 'manager', 'sales') then
    raise exception 'Only Admin, Manager, or Sales can record payments' using errcode = '42501';
  end if;
  if payment_amount is null or payment_amount <= 0 or payment_method is null or payment_method not in ('cash', 'bank_transfer', 'other') then
    raise exception 'Payment amount or method is invalid';
  end if;

  select * into transaction_row
    from public.transactions
   where id = target_transaction_id
   for update;
  if transaction_row.id is null then raise exception 'Transaction not found'; end if;
  if actor_role = 'sales' and transaction_row.owner_id <> auth.uid() then
    raise exception 'Sales can only record payments for assigned transactions' using errcode = '42501';
  end if;

  select coalesce(sum(amount), 0) into paid_total
    from public.payments where transaction_id = transaction_row.id;
  if payment_amount > transaction_row.total_amount - paid_total then
    raise exception 'Payment exceeds the outstanding balance';
  end if;

  insert into public.payments(transaction_id, amount, method, recorded_by)
  values (transaction_row.id, payment_amount, payment_method, auth.uid());
  select coalesce(sum(amount), 0) into paid_total
    from public.payments where transaction_id = transaction_row.id;
  update public.transactions
     set payment_status = case when paid_total >= total_amount then 'paid' when paid_total > 0 then 'partial' else 'unpaid' end
   where id = transaction_row.id
   returning * into result;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, details)
  values (auth.uid(), 'payment.recorded', 'transaction', transaction_row.id,
          jsonb_build_object('amount', payment_amount, 'method', payment_method));
  return result;
end $$;

create or replace function public.convert_lead_to_deal(target_lead_id uuid)
returns public.deals
language plpgsql security definer
set search_path = public
as $$
declare source_lead public.leads; customer_row public.customers; result public.deals;
begin
  select * into source_lead from public.leads
   where id = target_lead_id and deleted_at is null for update;
  if source_lead.id is null then raise exception 'Lead not found'; end if;
  if coalesce(public.current_crm_role(), '') <> 'admin'
     and not (coalesce(public.current_crm_role(), '') = 'sales' and source_lead.owner_id = auth.uid()) then
    raise exception 'Only Admin or the assigned Sales owner can convert this lead' using errcode = '42501';
  end if;
  if source_lead.status in ('Won', 'Lost') then raise exception 'Lead is already closed'; end if;

  if source_lead.converted_customer_id is not null then
    select * into customer_row from public.customers where id = source_lead.converted_customer_id;
  else
    select * into customer_row from public.customers
     where lower(company_name) = lower(source_lead.company_name) and deleted_at is null
     order by created_at desc limit 1 for update;
    if customer_row.id is null then
      insert into public.customers(name, company_name, email, phone, source, status, owner_id, owner_name, lifetime_value, last_contact_at)
      values (source_lead.name, source_lead.company_name, nullif(source_lead.email, ''), nullif(source_lead.phone, ''), source_lead.source, 'Active',
              coalesce(source_lead.owner_id, auth.uid()), source_lead.owner_name, source_lead.estimated_value, now())
      returning * into customer_row;
    end if;
    update public.leads set status = 'Won', converted_customer_id = customer_row.id where id = source_lead.id;
  end if;

  insert into public.deals(title, customer_id, customer_name, stage, amount, owner_id, owner_name)
  values ('Peluang ' || source_lead.company_name, customer_row.id, source_lead.company_name, 'Lead', source_lead.estimated_value,
          coalesce(source_lead.owner_id, auth.uid()), source_lead.owner_name)
  returning * into result;
  return result;
end $$;

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.leads enable row level security;
alter table public.deals enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_items enable row level security;
alter table public.approvals enable row level security;
alter table public.products enable row level security;
alter table public.activities enable row level security;
alter table public.transactions enable row level security;
alter table public.payments enable row level security;
alter table public.tickets enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_read_workspace" on public.profiles for select to authenticated
using (public.current_crm_role() in ('admin','manager') or id = auth.uid());
create policy "profiles_admin_manage" on public.profiles for all to authenticated
using (public.is_crm_admin()) with check (public.is_crm_admin());

create policy "customers_read_workspace" on public.customers for select to authenticated
using (deleted_at is null and public.current_crm_role() in ('admin','manager','sales','cs'));
create policy "customers_insert_admin_or_sales" on public.customers for insert to authenticated
with check (public.current_crm_role() = 'admin' or (public.current_crm_role() = 'sales' and owner_id = auth.uid()));
create policy "customers_update_admin" on public.customers for update to authenticated
using (public.current_crm_role() = 'admin') with check (public.current_crm_role() = 'admin');
create policy "customers_update_assigned_sales" on public.customers for update to authenticated
using (public.current_crm_role() = 'sales' and owner_id = auth.uid() and deleted_at is null)
with check (public.current_crm_role() = 'sales' and owner_id = auth.uid());

create policy "leads_read_workspace" on public.leads for select to authenticated
using (deleted_at is null and (public.current_crm_role() in ('admin','manager') or (public.current_crm_role() = 'sales' and owner_id = auth.uid())));
create policy "leads_insert_admin_or_sales" on public.leads for insert to authenticated
with check (public.current_crm_role() = 'admin' or (public.current_crm_role() = 'sales' and owner_id = auth.uid()));
create policy "leads_update_admin" on public.leads for update to authenticated
using (public.current_crm_role() = 'admin') with check (public.current_crm_role() = 'admin');
create policy "leads_update_assigned_sales" on public.leads for update to authenticated
using (public.current_crm_role() = 'sales' and owner_id = auth.uid() and deleted_at is null)
with check (public.current_crm_role() = 'sales' and owner_id = auth.uid());

create policy "deals_read_sales_workspace" on public.deals for select to authenticated
using (deleted_at is null and (public.current_crm_role() in ('admin','manager') or (public.current_crm_role() = 'sales' and owner_id = auth.uid())));
create policy "deals_insert_admin_or_sales" on public.deals for insert to authenticated
with check (public.current_crm_role() = 'admin' or (public.current_crm_role() = 'sales' and owner_id = auth.uid()));
create policy "deals_update_admin" on public.deals for update to authenticated
using (public.current_crm_role() = 'admin') with check (public.current_crm_role() = 'admin');
create policy "deals_update_assigned_sales" on public.deals for update to authenticated
using (public.current_crm_role() = 'sales' and owner_id = auth.uid() and deleted_at is null)
with check (public.current_crm_role() = 'sales' and owner_id = auth.uid());

create policy "quotations_read_by_role" on public.quotations for select to authenticated
using (deleted_at is null and (public.current_crm_role() in ('admin','manager') or (public.current_crm_role() = 'sales' and created_by = auth.uid())));
create policy "quotations_insert_owner" on public.quotations for insert to authenticated
with check ((public.current_crm_role() in ('admin','sales')) and created_by = auth.uid() and status in ('Draft','Pending Approval'));
create policy "quotation_items_read_by_role" on public.quotation_items for select to authenticated
using (exists (select 1 from public.quotations q where q.id = quotation_id));
create policy "quotation_items_insert_owner" on public.quotation_items for insert to authenticated
with check (exists (select 1 from public.quotations q where q.id = quotation_id and q.created_by = auth.uid() and q.status in ('Draft','Pending Approval')));
create policy "approvals_read_by_role" on public.approvals for select to authenticated
using (public.current_crm_role() in ('admin','manager') or exists (select 1 from public.quotations q where q.id = quotation_id and q.created_by = auth.uid()));

create policy "products_read_authenticated" on public.products for select to authenticated using (is_active or public.is_crm_admin());
create policy "products_admin_manage" on public.products for all to authenticated using (public.is_crm_admin()) with check (public.is_crm_admin());
create policy "activities_read_assigned_or_manager" on public.activities for select to authenticated
using (assigned_to = auth.uid() or public.current_crm_role() in ('admin','manager'));
create policy "activities_insert_assigned" on public.activities for insert to authenticated
with check (assigned_to = auth.uid() or public.current_crm_role() in ('admin','manager'));
create policy "activities_update_assigned_or_admin" on public.activities for update to authenticated
using (assigned_to = auth.uid() or public.current_crm_role() in ('admin','manager'))
with check (assigned_to = auth.uid() or public.current_crm_role() in ('admin','manager'));
create policy "transactions_read_by_role" on public.transactions for select to authenticated
using (public.current_crm_role() in ('admin','manager','cs') or (public.current_crm_role() = 'sales' and owner_id = auth.uid()));
create policy "transactions_admin_or_sales_insert" on public.transactions for insert to authenticated
with check (public.current_crm_role() = 'admin' or (public.current_crm_role() = 'sales' and owner_id = auth.uid()));
create policy "transactions_admin_manage" on public.transactions for all to authenticated using (public.is_crm_admin()) with check (public.is_crm_admin());
create policy "payments_read_by_role" on public.payments for select to authenticated
using (public.current_crm_role() in ('admin','manager','cs') or (public.current_crm_role() = 'sales' and exists (
  select 1 from public.transactions t where t.id = transaction_id and t.owner_id = auth.uid()
)));
create policy "tickets_read_service_team" on public.tickets for select to authenticated using (public.current_crm_role() in ('admin','manager','cs'));
create policy "tickets_cs_insert" on public.tickets for insert to authenticated with check (public.current_crm_role() in ('admin','cs'));
create policy "tickets_cs_update" on public.tickets for update to authenticated using (public.current_crm_role() in ('admin','cs')) with check (public.current_crm_role() in ('admin','cs'));
create policy "audit_logs_read_admin_manager" on public.audit_logs for select to authenticated using (public.current_crm_role() in ('admin','manager'));

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles, public.customers, public.leads, public.deals, public.quotations, public.quotation_items, public.products, public.activities, public.transactions, public.tickets to authenticated;
grant select on public.payments to authenticated;
grant select on public.approvals, public.audit_logs to authenticated;
grant execute on function public.decide_quotation(uuid, text) to authenticated;
grant execute on function public.send_quotation(uuid) to authenticated;
grant execute on function public.record_transaction_payment(uuid, numeric, text) to authenticated;
grant execute on function public.convert_lead_to_deal(uuid) to authenticated;
