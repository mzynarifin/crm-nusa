import type { CRMData, Customer, Deal, DealStage, Lead, Product, Quotation, QuoteStatus, Ticket, Transaction } from "@/features/crm/types";
import { initials } from "@/features/crm/utils/format";

export function mapRows<T>(rows: Record<string, unknown>[] | null, map: (row: Record<string, unknown>) => T): T[] {
  return rows?.length ? rows.map(map) : [];
}

export function dbCustomer(row: Record<string, unknown>): Customer {
  const name = String(row.name ?? "Pelanggan");
  return { id: String(row.id), name, company: String(row.company_name ?? ""), email: String(row.email ?? ""), phone: String(row.phone ?? ""), source: String(row.source ?? "Manual"), status: (row.status as Customer["status"]) ?? "Active", ownerId: String(row.owner_id ?? ""), owner: String(row.owner_name ?? "Tim CRM"), value: Number(row.lifetime_value ?? 0), lastContact: row.last_contact_at ? new Date(String(row.last_contact_at)).toLocaleDateString("id-ID") : "—", initials: initials(name) };
}

export function dbLead(row: Record<string, unknown>): Lead {
  return { id: String(row.id), name: String(row.name ?? "Lead"), company: String(row.company_name ?? ""), email: String(row.email ?? ""), phone: String(row.phone ?? ""), source: String(row.source ?? "Manual"), status: String(row.status ?? "New"), ownerId: String(row.owner_id ?? ""), owner: String(row.owner_name ?? "Tim CRM"), value: Number(row.estimated_value ?? 0), created: new Date(String(row.created_at ?? Date.now())).toLocaleDateString("id-ID") };
}

export function dbDeal(row: Record<string, unknown>): Deal {
  return { id: String(row.id), title: String(row.title ?? "Peluang baru"), customer: String(row.customer_name ?? "Pelanggan"), stage: (row.stage as DealStage) ?? "Lead", amount: Number(row.amount ?? 0), ownerId: String(row.owner_id ?? ""), owner: String(row.owner_name ?? "Tim CRM"), closeDate: row.close_date ? new Date(String(row.close_date)).toLocaleDateString("id-ID") : "—" };
}

export function dbQuote(row: Record<string, unknown>): Quotation {
  const rows = Array.isArray(row.quotation_items) ? row.quotation_items as Record<string, unknown>[] : [];
  const items = rows.map((item) => {
    const subtotal = Number(item.quantity ?? 1) * Number(item.unit_price ?? 0);
    const discounted = subtotal * (1 - Number(item.discount_percent ?? 0) / 100);
    return { description: String(item.description ?? "Item quotation"), quantity: Number(item.quantity ?? 1), amount: discounted * (1 + Number(item.tax_percent ?? 0) / 100) };
  });
  return { id: String(row.id), number: String(row.quotation_no ?? "QT-0000"), customer: String(row.customer_name ?? "Pelanggan"), amount: Number(row.total_amount ?? 0), status: (row.status as QuoteStatus) ?? "Draft", created: new Date(String(row.created_at ?? Date.now())).toLocaleDateString("id-ID"), ownerId: String(row.created_by ?? ""), owner: String(row.owner_name ?? "Tim CRM"), items };
}

export function dbTask(row: Record<string, unknown>): CRMData["tasks"][number] {
  const due = row.due_at ? new Date(String(row.due_at)) : null;
  const date = due ? due.getFullYear() + "-" + String(due.getMonth() + 1).padStart(2, "0") + "-" + String(due.getDate()).padStart(2, "0") : undefined;
  return { id: String(row.id), title: String(row.title ?? "Aktivitas"), customer: String(row.customer_name ?? "Pelanggan"), time: due ? due.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "—", type: String(row.activity_type ?? "Follow-up"), done: row.status === "done", date };
}

export function dbProduct(row: Record<string, unknown>): Product {
  return { id: String(row.id), sku: String(row.sku ?? ""), name: String(row.name ?? "Produk"), category: String(row.category ?? "Umum"), kind: row.kind === "physical" ? "physical" : "service", price: Number(row.price ?? 0), stock: row.stock_on_hand == null ? null : Number(row.stock_on_hand), isActive: Boolean(row.is_active) };
}

export function dbTransaction(row: Record<string, unknown>, paidAmount: number): Transaction {
  const amount = Number(row.total_amount ?? 0);
  return { id: String(row.id), number: String(row.transaction_no ?? "TRX-0000"), customer: String(row.customer_name ?? "Pelanggan"), amount, paidAmount, paymentStatus: paidAmount >= amount ? "paid" : paidAmount > 0 ? "partial" : "unpaid", ownerId: String(row.owner_id ?? ""), created: new Date(String(row.created_at ?? Date.now())).toLocaleDateString("id-ID") };
}

export function dbTicket(row: Record<string, unknown>): Ticket {
  return { id: String(row.id), number: String(row.ticket_no ?? "TCK-0000"), subject: String(row.subject ?? "Tiket baru"), customer: String(row.customer_name ?? "Pelanggan"), priority: (row.priority as Ticket["priority"]) ?? "normal", status: (row.status as Ticket["status"]) ?? "open", created: new Date(String(row.created_at ?? Date.now())).toLocaleDateString("id-ID") };
}
