import * as AdminScreens from "@/features/crm/components/organisms/admin/AdminScreens";
import * as OperationsScreens from "@/features/crm/components/organisms/operations/OperationsScreens";
import * as SalesScreens from "@/features/crm/components/organisms/sales/SalesScreens";
import type { CRMData, DealStage, Quotation, Role, Ticket, Transaction, WorkspaceUser } from "@/features/crm/types";

type CRMPageContentProps = {
  section: string;
  data: CRMData;
  role: Role;
  userName: string;
  cloudUserId: string | null;
  isCloud: boolean;
  workspaceName: string;
  query: string;
  visibleLeads: CRMData["leads"];
  visibleDeals: CRMData["deals"];
  visibleQuotes: Quotation[];
  visibleTransactions: Transaction[];
  workspaceUsers: WorkspaceUser[];
  onToggleTask: (id: string) => void;
  onNavigate: (path: string) => void;
  onConvertLead: (id: string) => void;
  onChangeStage: (id: string, stage: DealStage) => void;
  onDecideQuote: (id: string, decision: "approved" | "rejected") => Promise<boolean>;
  onSendQuote: (id: string) => void;
  onCreate: (kind: "quote" | "task") => void;
  onPayment: (transaction: Transaction) => void;
  onStatusChange: (id: string, status: Ticket["status"]) => void;
  onUserUpdate: (id: string, changes: Partial<Pick<WorkspaceUser, "role" | "isActive">>) => void;
  onCompanyNameChange: (value: string) => void;
};

export function CRMPageContent({
  section,
  data,
  role,
  userName,
  cloudUserId,
  isCloud,
  workspaceName,
  query,
  visibleLeads,
  visibleDeals,
  visibleQuotes,
  visibleTransactions,
  workspaceUsers,
  onToggleTask,
  onNavigate,
  onConvertLead,
  onChangeStage,
  onDecideQuote,
  onSendQuote,
  onCreate,
  onPayment,
  onStatusChange,
  onUserUpdate,
  onCompanyNameChange,
}: CRMPageContentProps) {
  if (section === "dashboard") return <SalesScreens.Dashboard data={data} role={role} userName={userName} onToggleTask={onToggleTask} onNavigate={onNavigate} />;
  if (section === "customers") return <SalesScreens.CustomersPage customers={data.customers} query={query} />;
  if (section === "leads") return <SalesScreens.LeadsPage leads={visibleLeads} query={query} onConvert={onConvertLead} canConvert={role === "admin" || role === "sales"} />;
  if (section === "pipeline") return <SalesScreens.PipelinePage deals={visibleDeals} canEdit={role === "admin" || role === "sales"} onChangeStage={onChangeStage} onNavigate={onNavigate} />;
  if (section === "quotations") return <SalesScreens.QuotationsPage quotations={visibleQuotes} role={role} onDecide={onDecideQuote} onSend={onSendQuote} onAdd={() => onCreate("quote")} />;
  if (section === "transactions") return <OperationsScreens.TransactionsPage transactions={visibleTransactions} role={role} onPayment={onPayment} />;
  if (section === "activities") return <OperationsScreens.ActivitiesPage tasks={data.tasks} onToggleTask={onToggleTask} onAdd={() => onCreate("task")} />;
  if (section === "calendar") return <OperationsScreens.CalendarPage tasks={data.tasks} onAdd={() => onCreate("task")} />;
  if (section === "service") return <OperationsScreens.ServicePage tickets={data.tickets} role={role} onStatusChange={onStatusChange} />;
  if (section === "products") return <OperationsScreens.ProductsPage products={data.products} />;
  if (section === "reports") return <AdminScreens.ReportsPage data={data} />;
  if (section === "users") return <AdminScreens.UsersPage role={role} isCloud={isCloud} users={workspaceUsers} currentUserId={cloudUserId ?? "demo-admin"} onUpdate={onUserUpdate} />;
  if (section === "settings") return <AdminScreens.SettingsPage isCloud={isCloud} companyName={workspaceName} onCompanyNameChange={onCompanyNameChange} />;
  return null;
}
