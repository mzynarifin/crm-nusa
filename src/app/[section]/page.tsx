import CRMApp from "@/features/crm/CRMApp";

const sections = new Set([
  "dashboard", "customers", "leads", "pipeline", "quotations", "transactions",
  "activities", "calendar", "service", "products", "reports", "users", "settings",
]);

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <CRMApp section={sections.has(section) ? section : "dashboard"} />;
}
