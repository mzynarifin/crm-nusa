"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { seedData } from "@/features/crm/data/seed";
import { navGroups, sectionLabels } from "@/features/crm/config/navigation";
import { todayID, todayISO, initials } from "@/features/crm/utils/format";
import type { CRMData, Customer, Deal, DealStage, Lead, Product, Quotation, QuoteStatus, RecordKind, Role, TeamMember, Ticket, Transaction, WorkspaceUser } from "@/features/crm/types";
import { dbCustomer, dbDeal, dbLead, dbProduct, dbQuote, dbTask, dbTicket, dbTransaction, mapRows } from "@/features/crm/data/mappers";
import { RecordModal, PaymentModal } from "@/features/crm/components/organisms/modals/DataEntryModals";
import { CRMPageContent } from "@/features/crm/components/organisms/CRMPageContent";
import { CRMTemplate } from "@/features/crm/components/templates/CRMTemplate";
import type { CRMNavGroup } from "@/features/crm/config/navigation";

const demoTeam: TeamMember[] = [
  { id: "u-dimas", name: "Dimas Putra", role: "sales" },
  { id: "u-rani", name: "Rani Maharani", role: "sales" },
  { id: "u-fajar", name: "Fajar Nugraha", role: "sales" },
];
const demoWorkspaceUsers: WorkspaceUser[] = [
  { id: "demo-admin", name: "Dimas Putra", email: "dimas@nusa.co.id", role: "admin", isActive: true },
  { id: "demo-manager", name: "Nadia Putri", email: "nadia@nusa.co.id", role: "manager", isActive: true },
  { id: "u-dimas", name: "Dimas Putra", email: "dimas.sales@nusa.co.id", role: "sales", isActive: true },
  { id: "u-rani", name: "Rani Maharani", email: "rani@nusa.co.id", role: "sales", isActive: true },
  { id: "u-fajar", name: "Fajar Nugraha", email: "fajar@nusa.co.id", role: "sales", isActive: true },
  { id: "demo-cs", name: "Salsa Permata", email: "salsa@nusa.co.id", role: "cs", isActive: true },
];

export default function CRMApp({ section }: { section: string }) {
  const router = useRouter();
  const activeSection = sectionLabels[section] ? section : "dashboard";
  const [data, setData] = useState<CRMData>(seedData);
  const [role, setRole] = useState<Role>("admin");
  const [userName, setUserName] = useState("Dimas Putra");
  const [workspaceName, setWorkspaceName] = useState("Nusa Teknologi");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(demoTeam);
  const [workspaceUsers, setWorkspaceUsers] = useState<WorkspaceUser[]>(demoWorkspaceUsers);
  const [cloudUserId, setCloudUserId] = useState<string | null>(null);
  const [isCloud, setIsCloud] = useState(false);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<RecordKind | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<Transaction | null>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    async function boot() {
      const client = createSupabaseClient();
      if (client) {
        setIsCloud(true);
        setRole("sales");
        const { data: sessionData } = await client.auth.getSession();
        if (!sessionData.session) { window.location.replace("/login"); return; }
        const user = sessionData.session.user;
        if (!alive) return;
        setCloudUserId(user.id);
        const { data: profile } = await client.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
        if (profile?.full_name) setUserName(profile.full_name);
        if (profile?.role && ["admin", "manager", "sales", "cs"].includes(profile.role)) setRole(profile.role as Role);
        if (profile?.role === "admin" || profile?.role === "manager") {
          const { data: members } = await client.from("profiles").select("id, full_name, email, role, is_active").order("full_name");
          if (members) {
            const mapped: WorkspaceUser[] = members.filter((member) => ["admin", "manager", "sales", "cs"].includes(member.role)).map((member) => ({ id: member.id, name: member.full_name, email: member.email ?? "", role: member.role as Role, isActive: Boolean(member.is_active) }));
            setWorkspaceUsers(mapped);
            setTeamMembers(mapped.filter((member) => member.role === "sales" && member.isActive).map((member) => ({ id: member.id, name: member.name, role: "sales" as Role })));
          }
        }
        const [customers, leads, deals, quotations, activities, products, transactions, payments, tickets] = await Promise.all([
          client.from("customers").select("*").order("created_at", { ascending: false }).limit(200),
          client.from("leads").select("*").order("created_at", { ascending: false }).limit(200),
          client.from("deals").select("*").order("created_at", { ascending: false }).limit(200),
          client.from("quotations").select("*, quotation_items(*)").order("created_at", { ascending: false }).limit(200),
          client.from("activities").select("*").order("due_at", { ascending: true }).limit(50),
          client.from("products").select("*").order("name", { ascending: true }).limit(200),
          client.from("transactions").select("*").order("created_at", { ascending: false }).limit(200),
          client.from("payments").select("transaction_id, amount"),
          client.from("tickets").select("*").order("created_at", { ascending: false }).limit(200),
        ]);
        if (!alive) return;
        const firstError = [customers.error, leads.error, deals.error, quotations.error, activities.error, products.error, transactions.error, payments.error, tickets.error].find(Boolean);
        if (firstError) setToast("Sebagian data belum dapat dimuat. Periksa kebijakan RLS Supabase.");
        const paidByTransaction = new Map<string, number>();
        for (const payment of (payments.data ?? []) as Record<string, unknown>[]) {
          const key = String(payment.transaction_id);
          paidByTransaction.set(key, (paidByTransaction.get(key) ?? 0) + Number(payment.amount ?? 0));
        }
        setData({
          customers: mapRows(customers.data as Record<string, unknown>[] | null, dbCustomer),
          leads: mapRows(leads.data as Record<string, unknown>[] | null, dbLead),
          deals: mapRows(deals.data as Record<string, unknown>[] | null, dbDeal),
          quotations: mapRows(quotations.data as Record<string, unknown>[] | null, dbQuote),
          tasks: mapRows(activities.data as Record<string, unknown>[] | null, dbTask),
          products: mapRows(products.data as Record<string, unknown>[] | null, dbProduct),
          transactions: mapRows(transactions.data as Record<string, unknown>[] | null, (row) => dbTransaction(row, paidByTransaction.get(String(row.id)) ?? 0)),
          tickets: mapRows(tickets.data as Record<string, unknown>[] | null, dbTicket),
        });
      } else {
        try {
          const saved = localStorage.getItem("nusa-crm-demo-v1");
          if (saved) {
            const stored = JSON.parse(saved) as Partial<CRMData>;
            setData({ ...seedData, ...stored, tasks: (stored.tasks ?? seedData.tasks).map((task) => ({ ...task, date: task.date || todayISO() })) });
          }
          const savedSettings = localStorage.getItem("nusa-crm-workspace-settings-v1");
          if (savedSettings) {
            const settings = JSON.parse(savedSettings) as { companyName?: string };
            if (settings.companyName) setWorkspaceName(settings.companyName);
          }
          const savedRole = localStorage.getItem("nusa-crm-demo-role");
          if (savedRole && ["admin", "manager", "sales", "cs"].includes(savedRole)) {
            setRole(savedRole as Role);
            setUserName(savedRole === "sales" ? "Dimas Putra" : savedRole === "manager" ? "Nadia Putri" : savedRole === "cs" ? "Salsa Permata" : "Dimas Putra");
          }
        } catch { /* Browser storage may be disabled. */ }
      }
      if (alive) setReady(true);
    }
    void boot();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (ready && !isCloud) {
      try { localStorage.setItem("nusa-crm-demo-v1", JSON.stringify(data)); } catch { /* storage can be unavailable */ }
    }
  }, [data, ready, isCloud]);
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const ownCustomers = data.customers;
  const visibleLeads = useMemo(() => role === "sales" ? data.leads.filter((item) => item.owner === userName || item.ownerId === cloudUserId) : data.leads, [data.leads, role, userName, cloudUserId]);
  const visibleDeals = useMemo(() => role === "sales" ? data.deals.filter((item) => item.owner === userName || item.ownerId === cloudUserId) : data.deals, [data.deals, role, userName, cloudUserId]);
  const visibleQuotes = useMemo(() => role === "sales" ? data.quotations.filter((item) => item.owner === userName || item.ownerId === cloudUserId) : data.quotations, [data.quotations, role, userName, cloudUserId]);
  const visibleTransactions = useMemo(() => role === "sales" ? data.transactions.filter((item) => item.ownerId === cloudUserId || item.ownerId === "u-dimas") : data.transactions, [data.transactions, role, cloudUserId]);

  function notify(message: string) { setToast(message); }
  function updateDemoRole(value: Role) {
    setRole(value);
    const names: Record<Role, string> = { admin: "Dimas Putra", manager: "Nadia Putri", sales: "Dimas Putra", cs: "Salsa Permata" };
    setUserName(names[value]);
    try { localStorage.setItem("nusa-crm-demo-role", value); } catch { /* storage can be unavailable */ }
  }
  async function signOut() {
    const client = createSupabaseClient();
    if (client) { await client.auth.signOut(); window.location.assign("/login"); }
    else notify("Mode demo: data tersimpan di browser ini.");
  }

  async function createRecord(kind: "customer" | "lead" | "quote" | "task" | "product" | "transaction" | "ticket", values: Record<string, string>) {
    const hasPermission = kind === "task" || (role === "admin" || role === "sales") && ["customer", "lead", "quote", "transaction"].includes(kind) || role === "admin" && kind === "product" || (role === "admin" || role === "cs") && kind === "ticket";
    if (!hasPermission) { notify("Role Anda tidak memiliki izin membuat data ini."); return; }
    setSaving(true);
    const client = createSupabaseClient();
    const actor = cloudUserId ?? `demo-${role}`;
    const person = userName;
    let warning = "";
    if (kind === "customer") {
      if (values.email && data.customers.some((item) => item.email.toLowerCase() === values.email.toLowerCase())) { notify("Email ini sudah terdaftar sebagai pelanggan."); setSaving(false); return; }
      const record: Customer = { id: `CUS-${Date.now().toString().slice(-5)}`, name: values.name, company: values.company, email: values.email, phone: values.phone, source: values.source || "Manual", status: "Active", ownerId: actor, owner: person, value: Number(values.value || 0), lastContact: "Hari ini", initials: initials(values.name) };
      if (client && cloudUserId) {
        const { data: inserted, error } = await client.from("customers").insert({ name: record.name, company_name: record.company, email: record.email || null, phone: record.phone || null, source: record.source, status: record.status, owner_id: cloudUserId, owner_name: person, lifetime_value: record.value }).select("*").single();
        if (error || !inserted) { notify(`Pelanggan belum tersimpan: ${error?.message ?? "Tidak ada data balikan."}`); setSaving(false); return; }
        record.id = String(inserted.id);
      }
      setData((current) => ({ ...current, customers: [record, ...current.customers] }));
    } else if (kind === "lead") {
      if (values.email && data.leads.some((item) => item.email.toLowerCase() === values.email.toLowerCase())) { notify("Email ini sudah terdaftar sebagai lead."); setSaving(false); return; }
      const assigned = teamMembers.find((member) => member.id === values.ownerId);
      const record: Lead = { id: `LED-${Date.now().toString().slice(-5)}`, name: values.name, company: values.company, email: values.email, phone: values.phone, source: values.source || "Website", status: "New", ownerId: assigned?.id ?? actor, owner: assigned?.name ?? person, value: Number(values.value || 0), created: todayID() };
      if (client && cloudUserId) {
        const { data: inserted, error } = await client.from("leads").insert({ name: record.name, company_name: record.company, email: record.email || null, phone: record.phone || null, source: record.source, status: record.status, owner_id: assigned?.id ?? cloudUserId, owner_name: assigned?.name ?? person, estimated_value: record.value }).select("*").single();
        if (error || !inserted) { notify(`Lead belum tersimpan: ${error?.message ?? "Tidak ada data balikan."}`); setSaving(false); return; }
        record.id = String(inserted.id);
      }
      setData((current) => ({ ...current, leads: [record, ...current.leads] }));
    } else if (kind === "quote") {
      const quantity = Math.max(1, Number(values.quantity || 1));
      const unitPrice = Number(values.value || 0);
      const discount = Math.min(100, Math.max(0, Number(values.discount || 0)));
      const tax = Math.min(100, Math.max(0, Number(values.tax || 0)));
      const amount = Math.round(quantity * unitPrice * (1 - discount / 100) * (1 + tax / 100));
      const description = values.description || "Penawaran produk dan layanan";
      const record: Quotation = { id: `qt-${Date.now()}`, number: `QT-${new Date().getFullYear()}-${String(data.quotations.length + 82).padStart(4, "0")}`, customer: values.customer, amount, status: "Pending Approval", created: todayID(), ownerId: actor, owner: person, items: [{ description, quantity, amount }] };
      if (client && cloudUserId) {
        const { data: inserted, error } = await client.from("quotations").insert({ quotation_no: record.number, customer_name: record.customer, total_amount: amount, status: "Pending Approval", created_by: cloudUserId, owner_name: person }).select("*").single();
        if (error || !inserted) { notify(`Quotation belum tersimpan: ${error?.message ?? "Tidak ada data balikan."}`); setSaving(false); return; }
        record.id = String(inserted.id);
        const { error: itemError } = await client.from("quotation_items").insert({ quotation_id: record.id, description, quantity, unit_price: unitPrice, discount_percent: discount, tax_percent: tax });
        if (itemError) warning = "Quotation tersimpan, tetapi item gagal disimpan. Minta Admin melengkapi item sebelum approval.";
      }
      setData((current) => ({ ...current, quotations: [record, ...current.quotations] }));
    } else if (kind === "task") {
      const task = { id: "tsk-" + Date.now(), title: values.title, customer: values.customer || "Internal", time: values.time || "09:00", type: values.type || "Follow-up", done: false, date: values.date || todayISO() };
      if (client && cloudUserId) {
        const dueAt = new Date(task.date + "T" + task.time + ":00").toISOString();
        const { data: inserted, error } = await client.from("activities").insert({ title: task.title, activity_type: task.type, customer_name: task.customer, assigned_to: cloudUserId, due_at: dueAt, priority: "normal", status: "open" }).select("*").single();
        if (error || !inserted) { notify("Aktivitas belum tersimpan: " + (error?.message ?? "Tidak ada data balikan.")); setSaving(false); return; }
        task.id = String(inserted.id);
      }
      setData((current) => ({ ...current, tasks: [task, ...current.tasks] }));
    } else if (kind === "product") {
      const product: Product = { id: `PRD-${String(Date.now()).slice(-5)}`, sku: values.sku, name: values.name, category: values.category || "Umum", kind: values.kind === "physical" ? "physical" : "service", price: Number(values.value || 0), stock: values.kind === "physical" ? Number(values.stock || 0) : null, isActive: true };
      if (client) {
        const { data: inserted, error } = await client.from("products").insert({ sku: product.sku || null, name: product.name, category: product.category, kind: product.kind, price: product.price, stock_on_hand: product.stock, is_active: true }).select("*").single();
        if (error || !inserted) { notify(`Produk belum tersimpan: ${error?.message ?? "Tidak ada data balikan."}`); setSaving(false); return; }
        product.id = String(inserted.id);
      }
      setData((current) => ({ ...current, products: [product, ...current.products] }));
    } else if (kind === "transaction") {
      const amount = Number(values.value || 0);
      const record: Transaction = { id: `trx-${Date.now()}`, number: `TRX-${new Date().getFullYear()}-${String(data.transactions.length + 149).padStart(4, "0")}`, customer: values.customer, amount, paidAmount: 0, paymentStatus: "unpaid", ownerId: actor, created: todayID() };
      if (client && cloudUserId) {
        const customer = data.customers.find((item) => item.company === values.customer);
        const { data: inserted, error } = await client.from("transactions").insert({ transaction_no: record.number, customer_id: customer?.id ?? null, customer_name: record.customer, total_amount: amount, payment_status: "unpaid", owner_id: cloudUserId }).select("*").single();
        if (error || !inserted) { notify(`Transaksi belum tersimpan: ${error?.message ?? "Tidak ada data balikan."}`); setSaving(false); return; }
        record.id = String(inserted.id);
      }
      setData((current) => ({ ...current, transactions: [record, ...current.transactions] }));
    } else {
      const priority = (values.priority || "normal") as Ticket["priority"];
      const ticket: Ticket = { id: `tck-${Date.now()}`, number: `TCK-${String(data.tickets.length + 249).padStart(4, "0")}`, subject: values.subject, customer: values.customer, priority, status: "open", created: todayID() };
      if (client && cloudUserId) {
        const customer = data.customers.find((item) => item.company === values.customer);
        const { data: inserted, error } = await client.from("tickets").insert({ ticket_no: ticket.number, customer_id: customer?.id ?? null, customer_name: ticket.customer, subject: ticket.subject, priority: ticket.priority, status: "open", assigned_to: cloudUserId }).select("*").single();
        if (error || !inserted) { notify(`Tiket belum tersimpan: ${error?.message ?? "Tidak ada data balikan."}`); setSaving(false); return; }
        ticket.id = String(inserted.id);
      }
      setData((current) => ({ ...current, tickets: [ticket, ...current.tickets] }));
    }
    setSaving(false);
    setModal(null);
    notify(warning || (kind === "customer" ? "Pelanggan berhasil ditambahkan." : kind === "lead" ? "Lead berhasil ditambahkan." : kind === "quote" ? "Quotation dikirim untuk persetujuan manager." : kind === "task" ? "Aktivitas berhasil dibuat." : kind === "product" ? "Produk berhasil ditambahkan." : kind === "transaction" ? "Transaksi berhasil dibuat." : "Tiket berhasil dibuat."));
  }

  async function updateDeal(id: string, stage: DealStage) {
    const client = createSupabaseClient();
    if (client) {
      const { error } = await client.from("deals").update({ stage }).eq("id", id);
      if (error) { notify(`Tahap belum diperbarui: ${error.message}`); return; }
    }
    setData((current) => ({ ...current, deals: current.deals.map((deal) => deal.id === id ? { ...deal, stage } : deal) }));
    notify(`Peluang dipindahkan ke ${stage}.`);
  }
  async function convertLead(id: string) {
    const lead = data.leads.find((item) => item.id === id);
    if (!lead || ["Won", "Lost"].includes(lead.status)) return;
    const client = createSupabaseClient();
    if (client) {
      const { data: converted, error } = await client.rpc("convert_lead_to_deal", { target_lead_id: id });
      if (error || !converted) { notify(`Lead belum dapat dikonversi: ${error?.message ?? "Tidak ada data balikan."}`); return; }
      const deal = dbDeal(converted as Record<string, unknown>);
      const { data: customerRow } = await client.from("customers").select("*").eq("company_name", lead.company).maybeSingle();
      setData((current) => ({
        ...current,
        customers: customerRow ? [dbCustomer(customerRow as Record<string, unknown>), ...current.customers.filter((customer) => customer.id !== String(customerRow.id))] : current.customers,
        leads: current.leads.map((item) => item.id === id ? { ...item, status: "Won" } : item),
        deals: [deal, ...current.deals.filter((item) => item.id !== deal.id)],
      }));
    } else {
      let customer = data.customers.find((item) => item.company.toLowerCase() === lead.company.toLowerCase());
      if (!customer) {
        customer = { id: `CUS-${Date.now().toString().slice(-5)}`, name: lead.name, company: lead.company, email: lead.email, phone: lead.phone, source: lead.source, status: "Active", ownerId: lead.ownerId, owner: lead.owner, value: lead.value, lastContact: "Hari ini", initials: initials(lead.name) };
      }
      const deal: Deal = { id: `DL-${Date.now().toString().slice(-5)}`, title: `Peluang ${lead.company}`, customer: lead.company, stage: "Lead", amount: lead.value, ownerId: lead.ownerId, owner: lead.owner, closeDate: "Belum ditentukan" };
      setData((current) => ({ ...current, customers: current.customers.some((item) => item.id === customer?.id) ? current.customers : [customer!, ...current.customers], leads: current.leads.map((item) => item.id === id ? { ...item, status: "Won" } : item), deals: [deal, ...current.deals] }));
    }
    notify("Lead dikonversi menjadi pelanggan dan peluang pipeline.");
  }
  async function decideQuote(id: string, decision: "approved" | "rejected"): Promise<boolean> {
    if (role !== "admin" && role !== "manager") { notify("Hanya Manager atau Admin yang dapat memutuskan quotation."); return false; }
    const client = createSupabaseClient();
    if (client) {
      const { error } = await client.rpc("decide_quotation", { target_quotation_id: id, decision });
      if (error) { notify(`Keputusan belum tersimpan: ${error.message}`); return false; }
    }
    const status: QuoteStatus = decision === "approved" ? "Approved" : "Rejected";
    setData((current) => ({ ...current, quotations: current.quotations.map((quote) => quote.id === id ? { ...quote, status } : quote) }));
    notify(`Quotation ${decision === "approved" ? "disetujui" : "ditolak"}.`);
    return true;
  }
  async function sendQuote(id: string) {
    const quote = data.quotations.find((item) => item.id === id);
    if (quote?.status !== "Approved") { notify("Quotation harus disetujui Manager sebelum dikirim."); return; }
    if (role !== "admin" && !(role === "sales" && (quote.owner === userName || quote.ownerId === cloudUserId))) { notify("Hanya Sales pemilik quotation atau Admin yang dapat mengirim penawaran."); return; }
    const client = createSupabaseClient();
    if (client) {
      const { error } = await client.rpc("send_quotation", { target_quotation_id: id });
      if (error) { notify(`Quotation belum terkirim: ${error.message}`); return; }
    }
    setData((current) => ({ ...current, quotations: current.quotations.map((item) => item.id === id ? { ...item, status: "Sent" } : item) }));
    notify("Quotation ditandai terkirim kepada pelanggan.");
  }
  async function toggleTask(id: string) {
    const task = data.tasks.find((item) => item.id === id);
    const nextDone = !task?.done;
    const client = createSupabaseClient();
    if (client) {
      const { error } = await client.from("activities").update({ status: nextDone ? "done" : "open" }).eq("id", id);
      if (error) { notify(`Aktivitas belum diperbarui: ${error.message}`); return; }
    }
    setData((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === id ? { ...item, done: nextDone } : item) }));
  }

  async function recordPayment(id: string, amount: number, method: "cash" | "bank_transfer" | "other") {
    const transaction = data.transactions.find((item) => item.id === id);
    if (!transaction || amount <= 0 || amount > transaction.amount - transaction.paidAmount) {
      notify("Jumlah pembayaran melebihi sisa tagihan atau tidak valid.");
      return false;
    }
    const client = createSupabaseClient();
    if (client) {
      const { error } = await client.rpc("record_transaction_payment", { target_transaction_id: id, payment_amount: amount, payment_method: method });
      if (error) { notify(`Pembayaran belum tersimpan: ${error.message}`); return false; }
    }
    setData((current) => ({ ...current, transactions: current.transactions.map((item) => {
      if (item.id !== id) return item;
      const paidAmount = item.paidAmount + amount;
      return { ...item, paidAmount, paymentStatus: paidAmount >= item.amount ? "paid" : "partial" };
    }) }));
    notify("Pembayaran berhasil dicatat.");
    return true;
  }

  async function updateTicket(id: string, status: Ticket["status"]) {
    if (role !== "admin" && role !== "cs") { notify("Hanya Admin atau Customer Service yang dapat memperbarui tiket."); return; }
    const client = createSupabaseClient();
    if (client) {
      const { error } = await client.from("tickets").update({ status }).eq("id", id);
      if (error) { notify(`Status tiket belum diperbarui: ${error.message}`); return; }
    }
    setData((current) => ({ ...current, tickets: current.tickets.map((item) => item.id === id ? { ...item, status } : item) }));
    notify("Status tiket diperbarui.");
  }

  async function updateWorkspaceUser(id: string, changes: Partial<Pick<WorkspaceUser, "role" | "isActive">>) {
    if (role !== "admin" || id === (cloudUserId ?? "demo-admin")) { notify("Admin tidak dapat mengubah role atau status akun sendiri."); return; }
    const client = createSupabaseClient();
    if (client) {
      const update: Record<string, unknown> = {};
      if (changes.role) update.role = changes.role;
      if (changes.isActive !== undefined) update.is_active = changes.isActive;
      const { error } = await client.from("profiles").update(update).eq("id", id);
      if (error) { notify(`Akun belum diperbarui: ${error.message}`); return; }
    }
    setWorkspaceUsers((current) => current.map((member) => member.id === id ? { ...member, ...changes } : member));
    setTeamMembers((current) => {
      const member = workspaceUsers.find((item) => item.id === id);
      if (!member) return current;
      const nextRole = changes.role ?? member.role;
      const isActive = changes.isActive ?? member.isActive;
      const kept = current.filter((item) => item.id !== id);
      return nextRole === "sales" && isActive ? [...kept, { id, name: member.name, role: "sales" }] : kept;
    });
    notify("Akses pengguna diperbarui.");
  }

  const allowedSections: Record<Role, string[]> = {
    admin: Object.keys(sectionLabels),
    manager: ["dashboard", "customers", "leads", "pipeline", "quotations", "transactions", "activities", "calendar", "service", "products", "reports"],
    sales: ["dashboard", "customers", "leads", "pipeline", "quotations", "transactions", "activities", "calendar", "products", "reports"],
    cs: ["dashboard", "customers", "calendar", "service"],
  };
  const sectionForRole = allowedSections[role].includes(activeSection) ? activeSection : "dashboard";
  const [pageTitle, pageDescription] = sectionLabels[sectionForRole];
  const pageAction = sectionForRole === "customers" && (role === "admin" || role === "sales") ? { kind: "customer" as const, label: "Tambah pelanggan" }
    : sectionForRole === "leads" && (role === "admin" || role === "sales") ? { kind: "lead" as const, label: "Tambah lead" }
    : sectionForRole === "quotations" && (role === "admin" || role === "sales") ? { kind: "quote" as const, label: "Buat quotation" }
    : sectionForRole === "products" && role === "admin" ? { kind: "product" as const, label: "Tambah produk" }
    : sectionForRole === "transactions" && (role === "admin" || role === "sales") ? { kind: "transaction" as const, label: "Tambah transaksi" }
    : sectionForRole === "service" && (role === "admin" || role === "cs") ? { kind: "ticket" as const, label: "Buat tiket" }
    : null;
  const visibleNavGroups: CRMNavGroup[] = navGroups.map((group) => ({ ...group, items: group.items.filter((item) => allowedSections[role].includes(item.id)).map((item) => {
    const count = item.id === "customers" ? ownCustomers.length : item.id === "leads" ? visibleLeads.length : item.id === "quotations" ? data.quotations.filter((quote) => quote.status === "Pending Approval").length : 0;
    return { ...item, count: count ? String(count) : undefined };
  }) })).filter((group) => group.items.length > 0);
  return <>
    <CRMTemplate
      activeSection={activeSection}
      sectionForRole={sectionForRole}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      navGroups={visibleNavGroups}
      pageAction={pageAction}
      role={role}
      userName={userName}
      workspaceName={workspaceName}
      isCloud={isCloud}
      query={query}
      toast={toast}
      onSearch={setQuery}
      onCreate={setModal}
      onDemoRoleChange={updateDemoRole}
      onSignOut={() => { void signOut(); }}
      onNotify={notify}
      onDismissToast={() => setToast("")}
    >
      {!ready ? <div className="loading-block"><span className="spinner" /> Memuat workspace...</div> : (
        <CRMPageContent
          section={sectionForRole}
          data={data}
          role={role}
          userName={userName}
          cloudUserId={cloudUserId}
          isCloud={isCloud}
          workspaceName={workspaceName}
          query={query}
          visibleLeads={visibleLeads}
          visibleDeals={visibleDeals}
          visibleQuotes={visibleQuotes}
          visibleTransactions={visibleTransactions}
          workspaceUsers={workspaceUsers}
          onToggleTask={toggleTask}
          onNavigate={(path) => router.push(path, { scroll: false })}
          onConvertLead={(id) => { void convertLead(id); }}
          onChangeStage={(id, stage) => { void updateDeal(id, stage); }}
          onDecideQuote={decideQuote}
          onSendQuote={(id) => { void sendQuote(id); }}
          onCreate={(kind) => setModal(kind)}
          onPayment={setPaymentTarget}
          onStatusChange={(id, status) => { void updateTicket(id, status); }}
          onUserUpdate={(id, changes) => { void updateWorkspaceUser(id, changes); }}
          onCompanyNameChange={setWorkspaceName}
        />
      )}
    </CRMTemplate>
    {modal && <RecordModal kind={modal} customers={ownCustomers} teamMembers={teamMembers} role={role} saving={saving} onClose={() => setModal(null)} onSubmit={createRecord} />}
    {paymentTarget && <PaymentModal transaction={paymentTarget} onClose={() => setPaymentTarget(null)} onSubmit={recordPayment} />}
  </>;
}
