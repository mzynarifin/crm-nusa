import {
  Activity,
  CalendarDays,
  ClipboardCheck,
  ContactRound,
  FileCheck2,
  Headset,
  LayoutDashboard,
  Package,
  Settings,
  Target,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type CRMNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: string;
  badge?: boolean;
};

export type CRMNavGroup = {
  label: string;
  items: CRMNavItem[];
};

export const navGroups: CRMNavGroup[] = [
  {
    label: "WORKSPACE",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "customers", label: "Pelanggan", icon: ContactRound },
      { id: "leads", label: "Leads", icon: Target },
      { id: "pipeline", label: "Sales pipeline", icon: TrendingUp },
      { id: "quotations", label: "Quotation", icon: FileCheck2, badge: true },
      { id: "transactions", label: "Transaksi", icon: Wallet },
      { id: "activities", label: "Aktivitas & tugas", icon: ClipboardCheck },
      { id: "calendar", label: "Kalender", icon: CalendarDays },
    ],
  },
  {
    label: "CUSTOMER EXPERIENCE",
    items: [{ id: "service", label: "Customer service", icon: Headset }],
  },
  {
    label: "INSIGHTS & SYSTEM",
    items: [
      { id: "products", label: "Produk & layanan", icon: Package },
      { id: "reports", label: "Laporan", icon: Activity },
      { id: "users", label: "Pengguna & akses", icon: Users },
      { id: "settings", label: "Pengaturan", icon: Settings },
    ],
  },
];

export const sectionLabels: Record<string, [string, string]> = {
  dashboard: ["Dashboard", "Ringkasan performa dan aktivitas bisnis Anda."],
  customers: ["Pelanggan", "Kelola hubungan dan informasi pelanggan dalam satu tempat."],
  leads: ["Leads", "Lacak prospek dan pastikan setiap peluang mendapat tindak lanjut."],
  pipeline: ["Sales pipeline", "Pantau peluang penjualan dari lead hingga transaksi."],
  quotations: ["Quotation", "Buat penawaran dan kelola alur persetujuan harga."],
  transactions: ["Transaksi", "Pantau transaksi dan status pembayaran pelanggan."],
  activities: ["Aktivitas & tugas", "Atur follow-up dan pekerjaan tim hari ini."],
  calendar: ["Kalender", "Jadwal meeting, follow-up, dan agenda tim."],
  service: ["Customer service", "Kelola tiket dan percakapan pelanggan."],
  products: ["Produk & layanan", "Kelola katalog dan informasi harga penawaran."],
  reports: ["Laporan", "Lihat tren penjualan dan aktivitas tim."],
  users: ["Pengguna & akses", "Atur peran dan tanggung jawab pengguna CRM."],
  settings: ["Pengaturan", "Konfigurasi workspace dan integrasi CRM."],
};
