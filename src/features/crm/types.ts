export type Role = "admin" | "manager" | "sales" | "cs";
export type TeamMember = { id: string; name: string; role: Role };
export type RecordKind = "customer" | "lead" | "quote" | "task" | "product" | "transaction" | "ticket";
export type WorkspaceUser = { id: string; name: string; email: string; role: Role; isActive: boolean };
export type DealStage = "Lead" | "Contact" | "Negotiation" | "Won" | "Lost";
export type QuoteStatus = "Draft" | "Pending Approval" | "Approved" | "Rejected" | "Sent" | "Accepted" | "Expired";

export type Customer = {
  id: string; name: string; company: string; email: string; phone: string; source: string;
  status: "Active" | "Prospect" | "Inactive"; ownerId: string; owner: string;
  value: number; lastContact: string; initials: string;
};
export type Lead = {
  id: string; name: string; company: string; email: string; phone: string;
  source: string; status: string; ownerId: string; owner: string; value: number; created: string;
};
export type Deal = {
  id: string; title: string; customer: string; stage: DealStage; amount: number;
  ownerId: string; owner: string; closeDate: string;
};
export type Quotation = {
  id: string; number: string; customer: string; amount: number; status: QuoteStatus;
  created: string; ownerId: string; owner: string;
  items?: { description: string; quantity: number; amount: number }[];
};
export type Task = { id: string; title: string; customer: string; time: string; type: string; done: boolean; date?: string };
export type Product = { id: string; sku: string; name: string; category: string; kind: "physical" | "service"; price: number; stock: number | null; isActive: boolean };
export type Transaction = { id: string; number: string; customer: string; amount: number; paidAmount: number; paymentStatus: "unpaid" | "partial" | "paid"; ownerId: string; created: string };
export type Ticket = { id: string; number: string; subject: string; customer: string; priority: "low" | "normal" | "high" | "urgent"; status: "open" | "in_progress" | "waiting" | "resolved" | "closed"; created: string };
export type CRMData = { customers: Customer[]; leads: Lead[]; deals: Deal[]; quotations: Quotation[]; tasks: Task[]; products: Product[]; transactions: Transaction[]; tickets: Ticket[] };
