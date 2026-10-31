import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, X } from "lucide-react";
import type { Customer, RecordKind, Role, TeamMember, Transaction } from "@/features/crm/types";
import { money, todayISO } from "@/features/crm/utils/format";

export type { RecordKind } from "@/features/crm/types";

export function RecordModal({ kind, customers, teamMembers, role, saving, onClose, onSubmit }: { kind: RecordKind; customers: Customer[]; teamMembers: TeamMember[]; role: Role; saving: boolean; onClose: () => void; onSubmit: (kind: RecordKind, values: Record<string, string>) => void }) {
  const title: Record<RecordKind, string> = { customer: "Tambah pelanggan", lead: "Tambah lead baru", quote: "Buat quotation", task: "Tambah aktivitas", product: "Tambah produk", transaction: "Tambah transaksi", ticket: "Buat tiket layanan" };
  useEffect(() => {
    function handleKey(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;
    onSubmit(kind, values);
  }
  const customerOptions = <>{customers.map((customer) => <option key={customer.id} value={customer.company}>{customer.company}</option>)}</>;
  let fields: ReactNode;
  if (kind === "quote") fields = <><label className="full-field">Pelanggan<select name="customer" required defaultValue=""><option value="" disabled>Pilih pelanggan</option>{customerOptions}</select></label><label>Harga per unit<input type="number" name="value" min="1" required placeholder="Contoh: 25000000" autoFocus /></label><label>Jumlah<input type="number" name="quantity" min="1" step="0.01" defaultValue="1" required /></label><label>Diskon (%)<input type="number" name="discount" min="0" max="100" defaultValue="0" /></label><label>Pajak (%)<input type="number" name="tax" min="0" max="100" defaultValue="0" /></label><label className="full-field">Deskripsi penawaran<input name="description" placeholder="Produk atau layanan" /></label></>;
  else if (kind === "task") fields = <><label className="full-field">Judul aktivitas<input name="title" required placeholder="Contoh: Follow-up proposal" autoFocus /></label><label>Pelanggan<select name="customer" defaultValue=""><option value="">Internal / tanpa pelanggan</option>{customerOptions}</select></label><label>Waktu<input name="time" type="time" defaultValue="09:00" required /></label><label>Tanggal<input name="date" type="date" defaultValue={todayISO()} required /></label><label className="full-field">Jenis aktivitas<select name="type" defaultValue="Follow-up"><option>Follow-up</option><option>Meeting</option><option>Telepon</option><option>Email</option><option>Task</option></select></label></>;
  else if (kind === "product") fields = <><label className="full-field">Nama produk atau layanan<input name="name" required placeholder="Nama katalog" autoFocus /></label><label>SKU<input name="sku" placeholder="Opsional" /></label><label>Kategori<input name="category" required placeholder="Contoh: Lisensi tahunan" /></label><label>Jenis<select name="kind" defaultValue="service"><option value="service">Layanan</option><option value="physical">Produk fisik</option></select></label><label>Harga (IDR)<input name="value" type="number" min="0" required placeholder="0" /></label><label>Stok awal<input name="stock" type="number" min="0" defaultValue="0" /></label></>;
  else if (kind === "transaction") fields = <><label className="full-field">Pelanggan<select name="customer" required defaultValue=""><option value="" disabled>Pilih pelanggan</option>{customerOptions}</select></label><label className="full-field">Total transaksi (IDR)<input name="value" type="number" min="1" required placeholder="Contoh: 25000000" autoFocus /></label></>;
  else if (kind === "ticket") fields = <><label className="full-field">Pelanggan<select name="customer" required defaultValue=""><option value="" disabled>Pilih pelanggan</option>{customerOptions}</select></label><label className="full-field">Subjek tiket<input name="subject" required placeholder="Ringkasan masalah pelanggan" autoFocus /></label><label>Prioritas<select name="priority" defaultValue="normal"><option value="low">Rendah</option><option value="normal">Normal</option><option value="high">Tinggi</option><option value="urgent">Mendesak</option></select></label></>;
  else fields = <><label>Nama kontak<input name="name" required placeholder="Nama lengkap" autoFocus /></label><label>Nama perusahaan<input name="company" required placeholder="Nama perusahaan" /></label><label>Email<input name="email" type="email" placeholder="nama@perusahaan.com" /></label><label>Nomor telepon<input name="phone" type="tel" placeholder="+62 812…" /></label><label>Sumber<select name="source" defaultValue="Website"><option>Website</option><option>Referral</option><option>LinkedIn</option><option>Instagram</option><option>Event</option><option>Manual</option></select></label><label>{kind === "customer" ? "Nilai transaksi awal" : "Nilai potensial"}<input name="value" type="number" min="0" placeholder="0" /></label>{kind === "lead" && role === "admin" && <label className="full-field">Tugaskan ke Sales<select name="ownerId" required defaultValue=""><option value="" disabled>Pilih Sales</option>{teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>}</>;
  const intro: Record<RecordKind, string> = { customer: "Informasi pelanggan disimpan di workspace CRM.", lead: "Lead baru siap ditindaklanjuti oleh tim Sales.", quote: "Quotation baru masuk ke antrean persetujuan Manager.", task: "Aktivitas akan ditambahkan ke daftar tugas Anda.", product: "Produk atau layanan tersedia pada katalog workspace.", transaction: "Transaksi baru dibuat dengan status pembayaran belum dibayar.", ticket: "Tiket baru akan masuk ke antrean layanan pelanggan." };
  const submitLabel: Record<RecordKind, string> = { customer: "Simpan pelanggan", lead: "Simpan lead", quote: "Kirim untuk approval", task: "Simpan aktivitas", product: "Simpan produk", transaction: "Simpan transaksi", ticket: "Buat tiket" };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><span className="eyebrow">NUSA CRM</span><h2 id="modal-title">{title[kind]}</h2></div><button className="icon-button" aria-label="Tutup" onClick={onClose}><X size={19} /></button></div><p className="modal-intro">{intro[kind]}</p><form onSubmit={submit}><div className="form-grid">{fields}</div><div className="modal-footer"><button type="button" className="button button-outline" onClick={onClose}>Batal</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? "Menyimpan…" : submitLabel[kind]}<ArrowRight size={15} /></button></div></form></section></div>;
}

export function PaymentModal({ transaction, onClose, onSubmit }: { transaction: Transaction; onClose: () => void; onSubmit: (id: string, amount: number, method: "cash" | "bank_transfer" | "other") => Promise<boolean> }) {
  const [working, setWorking] = useState(false);
  const remaining = Math.max(0, transaction.amount - transaction.paidAmount);
  useEffect(() => {
    function handleKey(event: KeyboardEvent) { if (event.key === "Escape" && !working) onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, working]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setWorking(true);
    const success = await onSubmit(transaction.id, Number(form.get("amount")), form.get("method") as "cash" | "bank_transfer" | "other");
    setWorking(false);
    if (success) onClose();
  }
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !working) onClose(); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title"><div className="modal-header"><div><span className="eyebrow">PEMBAYARAN TRANSAKSI</span><h2 id="payment-modal-title">{transaction.number}</h2></div><button className="icon-button" aria-label="Tutup" onClick={onClose} disabled={working}><X size={19} /></button></div><p className="modal-intro">Sisa tagihan {transaction.customer}: <strong>{money(remaining)}</strong></p><form onSubmit={(event) => void submit(event)}><div className="form-grid"><label className="full-field">Jumlah pembayaran<input name="amount" type="number" min="1" max={remaining} step="0.01" required autoFocus /></label><label className="full-field">Metode pembayaran<select name="method" defaultValue="bank_transfer"><option value="bank_transfer">Transfer bank</option><option value="cash">Tunai</option><option value="other">Lainnya</option></select></label></div><div className="modal-footer"><button type="button" className="button button-outline" onClick={onClose} disabled={working}>Batal</button><button type="submit" className="button button-primary" disabled={working}>{working ? "Menyimpan…" : "Catat pembayaran"}<ArrowRight size={15} /></button></div></form></section></div>;
}
