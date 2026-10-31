"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Command,
  Ellipsis,
  Menu,
  Plus,
  Search,
  X,
} from "lucide-react";
import { roleLabels } from "@/features/crm/config/roles";
import type { CRMNavGroup } from "@/features/crm/config/navigation";
import type { RecordKind, Role } from "@/features/crm/types";
import { initials, todayID } from "@/features/crm/utils/format";

type PageAction = { kind: RecordKind; label: string } | null;

type CRMTemplateProps = {
  activeSection: string;
  sectionForRole: string;
  pageTitle: string;
  pageDescription: string;
  navGroups: CRMNavGroup[];
  pageAction: PageAction;
  role: Role;
  userName: string;
  workspaceName: string;
  isCloud: boolean;
  query: string;
  toast: string;
  children: ReactNode;
  onSearch: (value: string) => void;
  onCreate: (kind: RecordKind) => void;
  onDemoRoleChange: (role: Role) => void;
  onSignOut: () => void;
  onNotify: (message: string) => void;
  onDismissToast: () => void;
};

export function CRMTemplate({
  activeSection,
  sectionForRole,
  pageTitle,
  pageDescription,
  navGroups,
  pageAction,
  role,
  userName,
  workspaceName,
  isCloud,
  query,
  toast,
  children,
  onSearch,
  onCreate,
  onDemoRoleChange,
  onSignOut,
  onNotify,
  onDismissToast,
}: CRMTemplateProps) {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Lewati navigasi</a>
      {mobileNav && <button aria-label="Tutup navigasi" className="mobile-scrim" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Link className="brand-lockup" href="/" scroll={false}><span className="brand-mark"><Building2 size={18} /></span><span>Nusa<span className="brand-light">CRM</span></span></Link>
          <button className="icon-button mobile-close" aria-label="Tutup menu" onClick={() => setMobileNav(false)}><X size={18} /></button>
        </div>
        <button className="workspace-switch" aria-label="Workspace aktif"><span className="workspace-logo">{initials(workspaceName).slice(0, 1)}</span><span className="workspace-copy"><strong>{workspaceName}</strong><small>Workspace perusahaan</small></span><ChevronDown size={15} /></button>
        <nav className="main-nav" aria-label="Navigasi utama">
          {navGroups.map((group) => <div className="nav-group" key={group.label}>
            <span className="nav-caption">{group.label}</span>
            {group.items.map((item) => {
              const Icon = item.icon;
              return <Link key={item.id} href={item.id === "dashboard" ? "/" : `/${item.id}`} scroll={false} className={`nav-link ${activeSection === item.id ? "active" : ""}`} onClick={() => setMobileNav(false)}>
                <Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>
                {item.count && <span className={`nav-count ${item.badge ? "nav-count-alert" : ""}`}>{item.count}</span>}
              </Link>;
            })}
          </div>)}
        </nav>
        <div className="sidebar-bottom">
          {!isCloud && <div className="demo-role-control"><span>MODE DEMO</span><select aria-label="Ganti peran demo" value={role} onChange={(event) => onDemoRoleChange(event.target.value as Role)}><option value="admin">Admin</option><option value="manager">Manager</option><option value="sales">Sales</option><option value="cs">Customer Service</option></select></div>}
          <Link href="/settings" scroll={false} className="help-card"><span className="help-icon"><CircleHelp size={16} /></span><span><strong>Butuh bantuan?</strong><small>Lihat panduan penggunaan</small></span><ArrowUpRight size={14} /></Link>
          <div className="profile-row"><span className="avatar avatar-green">{initials(userName)}</span><span className="profile-copy"><strong>{userName}</strong><small>{roleLabels[role]}</small></span><button className="icon-button profile-menu" aria-label="Keluar" onClick={onSignOut}><Ellipsis size={18} /></button></div>
        </div>
      </aside>
      <main className="main-area" id="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Buka menu" onClick={() => setMobileNav(true)}><Menu size={19} /></button>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div>
          <div className="topbar-actions"><label className="global-search"><Search size={16} /><input aria-label="Cari di halaman" placeholder="Cari apa saja…" value={query} onChange={(event) => onSearch(event.target.value)} /><kbd><Command size={10} /> K</kbd></label><button className="icon-button notification-button" aria-label="Notifikasi" onClick={() => onNotify("Anda sudah melihat semua notifikasi baru.")}><Bell size={18} /><i /></button><span className="topbar-divider" /><button className="top-user" onClick={() => onNotify(`${userName} · ${roleLabels[role]}`)}><span className="avatar avatar-green">{initials(userName)}</span><ChevronDown size={14} /></button></div>
        </header>
        <div className="page-content">
          <div className="page-heading"><div><div className="eyebrow page-kicker">NUSA CRM <span>•</span> {sectionForRole.toUpperCase()}</div><h1>{pageTitle}</h1><p>{pageDescription}</p></div><div className="heading-actions"><span className="date-pill"><CalendarDays size={15} /> {todayID()} <ChevronDown size={13} /></span>{pageAction && <button className="button button-primary" onClick={() => onCreate(pageAction.kind)}><Plus size={16} />{pageAction.label}</button>}</div></div>
          {children}
          <footer className="page-footer"><span>© 2026 Nusa CRM</span><span><span className="status-dot" /> {isCloud ? "Supabase terhubung" : "Mode demo · data tersimpan di perangkat ini"}</span></footer>
        </div>
      </main>
      {toast && <div role="status" className="toast"><CheckCheck size={17} />{toast}<button aria-label="Tutup pesan" onClick={onDismissToast}><X size={15} /></button></div>}
    </div>
  );
}
