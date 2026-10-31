import type { CRMData } from "@/features/crm/types";

export const seedData: CRMData = {
  customers: [
    { id: "CUS-1048", name: "Aditya Pratama", company: "Arunika Teknologi", email: "aditya@arunika.co.id", phone: "+62 812-8812-3100", source: "Referral", status: "Active", ownerId: "u-dimas", owner: "Dimas Putra", value: 82500000, lastContact: "Hari ini", initials: "AP" },
    { id: "CUS-1047", name: "Nadia Kusuma", company: "Kreasi Pangan Nusantara", email: "nadia@kpn.co.id", phone: "+62 813-4421-9088", source: "Website", status: "Active", ownerId: "u-rani", owner: "Rani Maharani", value: 56400000, lastContact: "Kemarin", initials: "NK" },
    { id: "CUS-1046", name: "Bagas Wicaksono", company: "Lintas Niaga Group", email: "bagas@lintasniaga.id", phone: "+62 877-4500-7621", source: "LinkedIn", status: "Prospect", ownerId: "u-dimas", owner: "Dimas Putra", value: 34200000, lastContact: "2 hari lalu", initials: "BW" },
    { id: "CUS-1045", name: "Siti Rahmawati", company: "Bumi Sehat Indonesia", email: "siti@bumisehat.com", phone: "+62 821-7741-3350", source: "Event", status: "Active", ownerId: "u-fajar", owner: "Fajar Nugraha", value: 29100000, lastContact: "3 hari lalu", initials: "SR" },
    { id: "CUS-1044", name: "Kevin Santoso", company: "Sentra Retail Asia", email: "kevin@sentraretail.id", phone: "+62 811-9921-4002", source: "Referral", status: "Active", ownerId: "u-rani", owner: "Rani Maharani", value: 187500000, lastContact: "4 hari lalu", initials: "KS" },
    { id: "CUS-1043", name: "Maya Anggraini", company: "Ruang Tumbuh Studio", email: "maya@ruangtumbuh.id", phone: "+62 856-1023-7782", source: "Instagram", status: "Prospect", ownerId: "u-fajar", owner: "Fajar Nugraha", value: 12500000, lastContact: "1 minggu lalu", initials: "MA" },
    { id: "CUS-1042", name: "Rizky Firmansyah", company: "Cakrawala Logistik", email: "rizky@cakrawala.co.id", phone: "+62 878-5512-9623", source: "Website", status: "Active", ownerId: "u-dimas", owner: "Dimas Putra", value: 93400000, lastContact: "1 minggu lalu", initials: "RF" },
  ],
  leads: [
    { id: "LED-2084", name: "Putri Amelia", company: "Sinar Pertiwi Group", email: "putri@sinarpertiwi.id", phone: "+62 812-1900-3455", source: "Website", status: "New", ownerId: "u-dimas", owner: "Dimas Putra", value: 45000000, created: "31 Okt 2026" },
    { id: "LED-2083", name: "Hendra Gunawan", company: "Mitra Karya Abadi", email: "hendra@mitrakarya.id", phone: "+62 813-8200-7122", source: "Referral", status: "Contacted", ownerId: "u-rani", owner: "Rani Maharani", value: 32000000, created: "30 Okt 2026" },
    { id: "LED-2082", name: "Citra Lestari", company: "Kota Baru Properti", email: "citra@kotabaru.id", phone: "+62 857-1980-2010", source: "LinkedIn", status: "Qualified", ownerId: "u-fajar", owner: "Fajar Nugraha", value: 78000000, created: "29 Okt 2026" },
    { id: "LED-2081", name: "Aldo Saputra", company: "Aksara Digital", email: "aldo@aksara.digital", phone: "+62 811-2719-5081", source: "Instagram", status: "Contacted", ownerId: "u-dimas", owner: "Dimas Putra", value: 21500000, created: "28 Okt 2026" },
    { id: "LED-2080", name: "Dewi Kartika", company: "Klinik Harmoni", email: "dewi@klinikharmoni.id", phone: "+62 822-0931-6674", source: "Event", status: "New", ownerId: "u-rani", owner: "Rani Maharani", value: 38500000, created: "27 Okt 2026" },
  ],
  deals: [
    { id: "DL-301", title: "Implementasi CRM Enterprise", customer: "Arunika Teknologi", stage: "Negotiation", amount: 82500000, ownerId: "u-dimas", owner: "Dimas Putra", closeDate: "12 Nov 2026" },
    { id: "DL-302", title: "Paket Growth + Onboarding", customer: "Kreasi Pangan Nusantara", stage: "Contact", amount: 56400000, ownerId: "u-rani", owner: "Rani Maharani", closeDate: "18 Nov 2026" },
    { id: "DL-303", title: "CRM & Integrasi Omnichannel", customer: "Lintas Niaga Group", stage: "Negotiation", amount: 34200000, ownerId: "u-dimas", owner: "Dimas Putra", closeDate: "21 Nov 2026" },
    { id: "DL-304", title: "Customer Service Suite", customer: "Bumi Sehat Indonesia", stage: "Lead", amount: 29100000, ownerId: "u-fajar", owner: "Fajar Nugraha", closeDate: "25 Nov 2026" },
    { id: "DL-305", title: "Renewal & Add-on Analytics", customer: "Sentra Retail Asia", stage: "Won", amount: 48700000, ownerId: "u-rani", owner: "Rani Maharani", closeDate: "05 Nov 2026" },
    { id: "DL-306", title: "Paket Professional", customer: "Ruang Tumbuh Studio", stage: "Contact", amount: 12500000, ownerId: "u-fajar", owner: "Fajar Nugraha", closeDate: "29 Nov 2026" },
  ],
  quotations: [
    { id: "qt-1", number: "QT-2026-0081", customer: "Arunika Teknologi", amount: 82500000, status: "Pending Approval", created: "31 Okt 2026", ownerId: "u-dimas", owner: "Dimas Putra", items: [{ description: "CRM Enterprise — Lisensi tahunan", quantity: 1, amount: 70000000 }, { description: "Implementasi & pelatihan", quantity: 1, amount: 12500000 }] },
    { id: "qt-2", number: "QT-2026-0080", customer: "Sentra Retail Asia", amount: 48700000, status: "Approved", created: "30 Okt 2026", ownerId: "u-rani", owner: "Rani Maharani", items: [{ description: "Renewal & add-on analytics", quantity: 1, amount: 48700000 }] },
    { id: "qt-3", number: "QT-2026-0079", customer: "Kreasi Pangan Nusantara", amount: 56400000, status: "Sent", created: "29 Okt 2026", ownerId: "u-rani", owner: "Rani Maharani", items: [{ description: "Paket Growth + Onboarding", quantity: 1, amount: 56400000 }] },
    { id: "qt-4", number: "QT-2026-0078", customer: "Cakrawala Logistik", amount: 93400000, status: "Accepted", created: "26 Okt 2026", ownerId: "u-dimas", owner: "Dimas Putra", items: [{ description: "CRM Enterprise", quantity: 1, amount: 93400000 }] },
  ],
  tasks: [
    { id: "tsk-1", title: "Demo produk CRM Enterprise", customer: "Arunika Teknologi", time: "09:30", type: "Meeting", done: false, date: "2026-10-31" },
    { id: "tsk-2", title: "Follow-up proposal paket Growth", customer: "Kreasi Pangan Nusantara", time: "11:00", type: "Follow-up", done: false, date: "2026-10-31" },
    { id: "tsk-3", title: "Kirim ringkasan kebutuhan", customer: "Sinar Pertiwi Group", time: "13:30", type: "Email", done: false, date: "2026-11-02" },
    { id: "tsk-4", title: "Review kontrak kerja sama", customer: "Sentra Retail Asia", time: "15:00", type: "Task", done: true, date: "2026-11-03" },
  ],
  products: [
    { id: "PRD-001", sku: "NUSA-ENT-01", name: "CRM Enterprise", category: "Lisensi tahunan", kind: "service", price: 82500000, stock: null, isActive: true },
    { id: "PRD-002", sku: "NUSA-GRW-01", name: "CRM Growth", category: "Lisensi tahunan", kind: "service", price: 56400000, stock: null, isActive: true },
    { id: "PRD-003", sku: "NUSA-ONB-01", name: "Onboarding & Training", category: "Implementasi", kind: "service", price: 12500000, stock: null, isActive: true },
    { id: "PRD-004", sku: "NUSA-WA-01", name: "WhatsApp Business API", category: "Integrasi", kind: "service", price: 8500000, stock: null, isActive: true },
  ],
  transactions: [
    { id: "TRX-2026-0148", number: "TRX-2026-0148", customer: "Arunika Teknologi", amount: 82500000, paidAmount: 25000000, paymentStatus: "partial", ownerId: "u-dimas", created: "31 Okt 2026" },
    { id: "TRX-2026-0147", number: "TRX-2026-0147", customer: "Kreasi Pangan Nusantara", amount: 56400000, paidAmount: 0, paymentStatus: "unpaid", ownerId: "u-rani", created: "30 Okt 2026" },
    { id: "TRX-2026-0146", number: "TRX-2026-0146", customer: "Sentra Retail Asia", amount: 48700000, paidAmount: 48700000, paymentStatus: "paid", ownerId: "u-rani", created: "29 Okt 2026" },
  ],
  tickets: [
    { id: "tck-248", number: "TCK-0248", subject: "Akses akun terkunci setelah reset", customer: "Sentra Retail Asia", priority: "high", status: "open", created: "31 Okt 2026" },
    { id: "tck-247", number: "TCK-0247", subject: "Permintaan perubahan data invoice", customer: "Arunika Teknologi", priority: "normal", status: "in_progress", created: "30 Okt 2026" },
    { id: "tck-246", number: "TCK-0246", subject: "Panduan integrasi WhatsApp", customer: "Kreasi Pangan Nusantara", priority: "normal", status: "waiting", created: "29 Okt 2026" },
    { id: "tck-245", number: "TCK-0245", subject: "Laporan ekspor data tidak sesuai", customer: "Bumi Sehat Indonesia", priority: "low", status: "resolved", created: "27 Okt 2026" },
  ],
};
