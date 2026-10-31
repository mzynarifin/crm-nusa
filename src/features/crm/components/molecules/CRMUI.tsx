import type { ReactNode } from "react";
import { ArrowUpRight, ChevronDown, ListFilter, MoreHorizontal, Search, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Customer } from "@/features/crm/types";
import { initials, money } from "@/features/crm/utils/format";
import { StatusBadge } from "@/features/crm/components/atoms/StatusBadge";

export function PageCard({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`card page-card ${className}`}><div className="card-heading"><h2>{title}</h2>{action}</div>{children}</section>;
}

export function MetricCard({ label, value, change, icon: Icon, tone = "teal", footnote }: { label: string; value: string; change?: string; icon: LucideIcon; tone?: string; footnote: string }) {
  return <div className="metric-card card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={18} /></span></div><div className="metric-value">{value}</div><div className="metric-foot">{change && <span className="trend-up"><ArrowUpRight size={13} />{change}</span>}<span>{footnote}</span></div></div>;
}

export function AvatarStack({ names }: { names: string[] }) { return <div className="avatar-stack">{names.map((name, i) => <span className={`avatar avatar-${["green", "blue", "purple"][i % 3]}`} key={name} title={name}>{initials(name)}</span>)}</div>; }

export function TableToolbar({ value, onChange, filter = "Semua status" }: { value: string; onChange: (value: string) => void; filter?: string }) { return <div className="table-toolbar"><label className="table-search"><Search size={15} /><input aria-label="Cari data" placeholder="Cari nama atau perusahaan…" value={value} onChange={(e) => onChange(e.target.value)} /></label><button className="button button-outline"><ListFilter size={15} />{filter}<ChevronDown size={13} /></button><button className="button button-outline toolbar-filter"><SlidersHorizontal size={15} />Filter</button></div>; }

export function CustomerTable({ customers, compact = false }: { customers: Customer[]; compact?: boolean }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>Pelanggan</th><th>Status</th>{!compact && <th>Sumber</th>}<th>Nilai transaksi</th><th>Sales owner</th><th>Terakhir dihubungi</th><th /></tr></thead><tbody>{customers.length ? customers.map((customer) => <tr key={customer.id}><td><div className="person-cell"><span className={`avatar avatar-${customer.initials.charCodeAt(0) % 2 ? "green" : "blue"}`}>{customer.initials}</span><span><strong>{customer.name}</strong><small>{customer.company}</small></span></div></td><td><StatusBadge status={customer.status} /></td>{!compact && <td><span className="source-label">{customer.source}</span></td>}<td className="amount-cell">{money(customer.value)}</td><td><div className="owner-cell"><span className="avatar avatar-mini avatar-lilac">{initials(customer.owner)}</span>{customer.owner}</div></td><td className="muted-cell">{customer.lastContact}</td><td><button className="icon-button row-menu" aria-label={`Opsi ${customer.name}`}><MoreHorizontal size={17} /></button></td></tr>) : <tr><td colSpan={7}><EmptyState title="Pelanggan tidak ditemukan" detail="Coba ubah kata pencarian atau tambahkan pelanggan baru." /></td></tr>}</tbody></table></div>;
}

export function EmptyState({ title, detail }: { title: string; detail: string }) { return <div className="empty-state"><span><Search size={18} /></span><strong>{title}</strong><small>{detail}</small></div>; }
