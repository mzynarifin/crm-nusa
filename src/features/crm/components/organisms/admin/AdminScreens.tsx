import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, CheckCheck, FileText, MessageSquare, Settings, ShieldCheck, TrendingUp, UserRound, Users, Wallet } from "lucide-react";
import type { CRMData, Role, WorkspaceUser } from "@/features/crm/types";
import { compactMoney, initials } from "@/features/crm/utils/format";
import { roleLabels } from "@/features/crm/config/roles";
import { EmptyState, MetricCard, PageCard } from "@/features/crm/components/molecules/CRMUI";
import { StatusBadge } from "@/features/crm/components/atoms/StatusBadge";

export function ReportsPage({ data }: { data: CRMData }) {
  const revenue = data.transactions.reduce((sum, transaction) => sum + transaction.paidAmount, 0);
  const wonDeals = data.deals.filter((deal) => deal.stage === "Won");
  const closedLeads = data.leads.filter((lead) => lead.status === "Won").length;
  const conversion = data.leads.length ? Math.round(closedLeads / data.leads.length * 100) : 0;
  const openPipeline = data.deals.filter((deal) => !["Won", "Lost"].includes(deal.stage)).reduce((sum, deal) => sum + deal.amount, 0);
  const stages = ["Lead", "Contact", "Negotiation", "Won", "Lost"].map((stage, index) => ({
    name: stage,
    deals: data.deals.filter((deal) => deal.stage === stage),
    color: ["#8b9db0", "#5685d8", "#e9a23b", "#17a98e", "#d17b73"][index],
  }));
  const sources = Array.from(new Set(data.leads.map((lead) => lead.source))).map((name, index) => ({
    name,
    count: data.leads.filter((lead) => lead.source === name).length,
    color: ["#0d9488", "#5485d8", "#a27bd4", "#f1ae54", "#dc7d72"][index % 5],
  })).sort((a, b) => b.count - a.count);
  return <><div className="report-heading-row"><div><span className="summary-label">Cakupan laporan</span><strong>Seluruh data tersimpan</strong></div><span className="result-count">{data.transactions.length} transaksi · {data.deals.length} peluang · {data.leads.length} lead</span></div><div className="metrics-grid report-metrics"><MetricCard label="Pembayaran tercatat" value={compactMoney(revenue)} icon={Wallet} footnote="dari transaksi tersimpan" /><MetricCard label="Peluang dimenangkan" value={String(wonDeals.length)} icon={CheckCheck} tone="orange" footnote="deal berstatus Won" /><MetricCard label="Konversi lead" value={conversion + "%"} icon={TrendingUp} tone="blue" footnote={closedLeads + " lead berhasil dikonversi"} /><MetricCard label="Pipeline terbuka" value={compactMoney(openPipeline)} icon={Users} tone="purple" footnote="Lead, Contact, dan Negotiation" /></div><div className="dashboard-grid dashboard-grid-main"><PageCard title="Nilai peluang per tahap"><div className="pipeline-summary">{stages.map((stage) => { const amount = stage.deals.reduce((sum, deal) => sum + deal.amount, 0); return <div className="pipeline-row" key={stage.name}><div className="pipeline-label"><span><i style={{ background: stage.color }} />{stage.name}</span><strong>{stage.deals.length} · {compactMoney(amount)}</strong></div><div className="pipeline-track"><i style={{ width: openPipeline ? Math.min(100, amount / openPipeline * 100) + "%" : "0%", background: stage.color }} /></div></div>; })}</div></PageCard><PageCard title="Sumber lead"><div className="source-breakdown">{sources.length ? sources.map((source) => { const percent = data.leads.length ? Math.round(source.count / data.leads.length * 100) : 0; return <div key={source.name}><span>{source.name}</span><strong>{source.count} ({percent}%)</strong><i><b style={{ width: percent + "%", background: source.color }} /></i></div>; }) : <EmptyState title="Belum ada lead" detail="Distribusi sumber akan muncul saat lead tersimpan." />}</div></PageCard></div></>;
}

export function UsersPage({ role, isCloud, users, currentUserId, onUpdate }: { role: Role; isCloud: boolean; users: WorkspaceUser[]; currentUserId: string | null; onUpdate: (id: string, changes: Partial<Pick<WorkspaceUser, "role" | "isActive">>) => void }) {
  const active = users.filter((user) => user.isActive).length;
  const canManage = role === "admin";
  return <><div className="access-banner"><span><ShieldCheck size={19} /></span><div><strong>Akses berbasis peran aktif</strong><small>Role dan status akun membatasi akses workspace.</small></div><StatusBadge status="Active" /></div><div className="mini-summary-row"><div><span className="summary-label">Anggota terdaftar</span><strong>{users.length}</strong><small>profil CRM</small></div><div><span className="summary-label">Akun aktif</span><strong>{active}</strong><small>dapat mengakses workspace</small></div><div><span className="summary-label">Sales</span><strong>{users.filter((user) => user.role === "sales").length}</strong><small>profil Sales</small></div><div><span className="summary-label">Customer Service</span><strong>{users.filter((user) => user.role === "cs").length}</strong><small>profil CS</small></div></div><PageCard title="Anggota workspace" action={<span className="result-count">{users.length} pengguna</span>}><div className="table-scroll"><table className="data-table"><thead><tr><th>Pengguna</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{users.map((member) => { const isSelf = member.id === currentUserId; return <tr key={member.id}><td><div className="person-cell"><span className="avatar avatar-blue">{initials(member.name)}</span><span><strong>{member.name}{isSelf ? " (Anda)" : ""}</strong><small>{member.email || "Email tidak tersedia"}</small></span></div></td><td>{canManage && !isSelf ? <select className="select-small" aria-label={"Role " + member.name} value={member.role} onChange={(event) => onUpdate(member.id, { role: event.target.value as Role })}><option value="admin">Admin</option><option value="manager">Manager</option><option value="sales">Sales</option><option value="cs">Customer Service</option></select> : <span className="role-chip">{roleLabels[member.role]}</span>}</td><td><StatusBadge status={member.isActive ? "Active" : "Inactive"} /></td><td>{canManage && !isSelf ? <button className="button button-mini button-outline" onClick={() => onUpdate(member.id, { isActive: !member.isActive })}>{member.isActive ? "Nonaktifkan" : "Aktifkan"}</button> : <span className="muted-cell">—</span>}</td></tr>; })}</tbody></table>{users.length === 0 && <EmptyState title="Belum ada anggota" detail="Profil akan muncul setelah akun dibuat di Supabase Auth." />}</div></PageCard><PageCard title="Akun baru"><div className="integration-card"><p>{isCloud ? "Buat akun melalui Supabase Auth. Pengguna baru otomatis mendapat role Sales dan dapat disesuaikan dari tabel anggota ini." : "Mode demo menampilkan contoh role. Pembuatan akun baru tersedia saat Supabase Auth dikonfigurasi."}</p><div className="role-grid">{(["admin", "manager", "sales", "cs"] as Role[]).map((memberRole) => <div className="role-card" key={memberRole}><span className="role-card-icon"><UserRound size={17} /></span><span><strong>{roleLabels[memberRole]}</strong><small>{memberRole === "admin" ? "Konfigurasi dan pengelolaan workspace" : memberRole === "manager" ? "Pemantauan tim dan persetujuan quotation" : memberRole === "sales" ? "Pelanggan, lead, dan pipeline" : "Penanganan tiket pelanggan"}</small></span><b>{users.filter((user) => user.role === memberRole && user.isActive).length}</b></div>)}</div></div></PageCard></>;
}

export function SettingsPage({ isCloud, companyName, onCompanyNameChange }: { isCloud: boolean; companyName: string; onCompanyNameChange: (value: string) => void }) {
  const [dark, setDark] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let prefersDark = false;
    try {
      prefersDark = localStorage.getItem("nusa-crm-dark") === "true";
      const preferences = localStorage.getItem("nusa-crm-workspace-settings-v1");
      if (preferences) {
        const stored = JSON.parse(preferences) as { timezone?: string };
        if (stored.timezone) setTimezone(stored.timezone);
      }
    } catch { /* Browser storage may be unavailable. */ }
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
    setThemeReady(true);
  }, []);
  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("nusa-crm-dark", String(dark)); } catch { /* storage can be unavailable */ }
  }, [dark, themeReady]);
  function savePreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCloud) return;
    try {
      localStorage.setItem("nusa-crm-workspace-settings-v1", JSON.stringify({ companyName, timezone }));
      setSaved(true);
    } catch { setSaved(false); }
  }
  return <div className="settings-layout"><div className="settings-nav"><button className="selected"><Settings size={15} />Umum</button><button disabled><Users size={15} />Pengguna & role</button><button disabled><ShieldCheck size={15} />Keamanan</button><button disabled><MessageSquare size={15} />Integrasi</button><button disabled><FileText size={15} />Data & dokumen</button></div><div className="settings-content"><PageCard title="Informasi workspace"><form onSubmit={savePreferences}><div className="settings-fields"><label>Nama perusahaan<input value={companyName} onChange={(event) => { onCompanyNameChange(event.target.value); setSaved(false); }} disabled={isCloud} /></label><label>Zona waktu<select value={timezone} onChange={(event) => { setTimezone(event.target.value); setSaved(false); }} disabled={isCloud}><option value="Asia/Jakarta">WIB — Asia/Jakarta</option><option value="Asia/Makassar">WITA — Asia/Makassar</option><option value="Asia/Jayapura">WIT — Asia/Jayapura</option></select></label><label>Mata uang<select value="IDR" disabled><option value="IDR">Rupiah Indonesia (IDR)</option></select></label><label>Format tanggal<select value="id" disabled><option value="id">Format Indonesia</option></select></label></div><div className="settings-actions"><button className="button button-primary" type="submit" disabled={isCloud}>{isCloud ? "Belum tersedia untuk workspace cloud" : "Simpan preferensi demo"}</button>{saved && <small role="status">Preferensi tersimpan di perangkat ini.</small>}</div></form></PageCard><PageCard title="Preferensi tampilan"><div className="preference-row"><span><strong>Mode gelap</strong><small>Sesuaikan tampilan workspace dengan preferensi Anda.</small></span><button className={"toggle-switch " + (dark ? "toggle-on" : "")} aria-label="Aktifkan mode gelap" aria-pressed={dark} onClick={() => setDark(!dark)}><i /></button></div></PageCard><PageCard title="Integrasi Supabase"><div className={"integration-state " + (isCloud ? "connected" : "")}><span />{isCloud ? "Terhubung" : "Belum dikonfigurasi"}</div><div className="integration-card"><p>{isCloud ? "Database dan autentikasi Supabase tersedia. Identitas workspace dan pengaturan regional belum disimpan di database." : "Tambahkan URL dan publishable key Supabase ke .env.local, lalu jalankan migrasi database untuk mengaktifkan penyimpanan terpusat."}</p><a href="/docs/PRD_All_in_One_CRM.md" className="text-link">Baca kebutuhan sistem <ArrowRight size={14} /></a></div></PageCard></div></div>;
}
