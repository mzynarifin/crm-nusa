# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# ALL-IN-ONE CUSTOMER RELATIONSHIP MANAGEMENT (CRM)

**Versi:** 1.0  
**Status:** Draft – Siap untuk Review  
**Platform:** Web Application  
**Target Pengguna:** Internal Perusahaan  
**Teknologi Utama:** Next.js, TypeScript, Supabase  
**Tanggal:** 31 Oktober 2026

---

## 1. Ringkasan Produk

All-in-One CRM adalah aplikasi berbasis web yang dirancang untuk membantu perusahaan mengelola seluruh aktivitas hubungan pelanggan dalam satu sistem terintegrasi.

Aplikasi ini menggabungkan pengelolaan pelanggan, prospek penjualan (lead), aktivitas Sales, proses penawaran harga, transaksi, layanan pelanggan, komunikasi WhatsApp, laporan bisnis, serta otomatisasi pekerjaan.

Sistem digunakan secara internal oleh empat jenis pengguna, yaitu Admin, Manager, Sales, dan Customer Service. Setiap pengguna memiliki hak akses yang berbeda sesuai tanggung jawabnya.

Tujuan utama aplikasi adalah meningkatkan efisiensi operasional, mempermudah pemantauan penjualan, meningkatkan kualitas pelayanan pelanggan, dan menyediakan data perusahaan yang terpusat.

## 2. Latar Belakang Masalah

Pengelolaan pelanggan dan aktivitas penjualan yang dilakukan secara terpisah dapat menimbulkan beberapa masalah, seperti:

1. Data pelanggan tersebar di berbagai tempat.
2. Riwayat komunikasi dengan pelanggan sulit dilacak.
3. Proses pembagian lead kepada Sales kurang terorganisasi.
4. Manager kesulitan memantau kinerja tim penjualan.
5. Proses persetujuan penawaran harga membutuhkan pengawasan.
6. Keluhan pelanggan tidak terdokumentasi dengan baik.
7. Pembuatan laporan membutuhkan waktu.
8. Aktivitas follow-up pelanggan berisiko terlewat.

Oleh karena itu, diperlukan satu sistem CRM terintegrasi yang dapat menyatukan seluruh proses tersebut.

## 3. Tujuan Produk

Tujuan pengembangan CRM adalah:

1. Menyediakan pusat penyimpanan data pelanggan.
2. Mempermudah pengelolaan dan pembagian lead.
3. Memantau proses penjualan dari awal hingga transaksi.
4. Mengelola penawaran harga dan persetujuannya.
5. Mencatat seluruh aktivitas Sales.
6. Memusatkan komunikasi pelanggan melalui WhatsApp dan Live Chat.
7. Mengelola keluhan dan permintaan bantuan pelanggan.
8. Menyediakan laporan dan analisis kinerja perusahaan.
9. Mengurangi pekerjaan manual melalui otomatisasi.
10. Menjaga keamanan data berdasarkan peran pengguna.

## 4. Target Pengguna

### 4.1 Admin

Admin merupakan pengguna dengan hak akses tertinggi.

Tanggung jawab:
- Mengelola seluruh data CRM.
- Mengelola akun pengguna.
- Mengatur Role dan Permission.
- Membagikan lead kepada Sales.
- Mengelola produk dan layanan.
- Memantau seluruh aktivitas perusahaan.
- Mengakses laporan dan audit log.
- Mengatur integrasi dan konfigurasi sistem.

### 4.2 Manager

Manager bertanggung jawab mengawasi aktivitas dan kinerja Sales.

Tanggung jawab:
- Melihat seluruh data penjualan.
- Memantau kinerja Sales.
- Melihat pipeline penjualan.
- Menyetujui atau menolak quotation.
- Melihat laporan penjualan.
- Memantau target dan pencapaian tim.

### 4.3 Sales

Sales bertanggung jawab mengelola prospek dan melakukan aktivitas penjualan.

Tanggung jawab:
- Melihat seluruh data pelanggan.
- Mengelola pelanggan yang ditugaskan kepadanya.
- Mengelola lead yang diterima.
- Melakukan follow-up.
- Memperbarui tahapan penjualan.
- Membuat quotation.
- Melihat target dan performa pribadi.
- Mencatat aktivitas penjualan.

Sales hanya dapat mengubah data pelanggan yang menjadi tanggung jawabnya.

### 4.4 Customer Service (CS)

Customer Service bertanggung jawab menangani komunikasi dan keluhan pelanggan.

Tanggung jawab:
- Melihat data pelanggan.
- Melihat riwayat komunikasi.
- Menangani tiket keluhan.
- Membalas pesan pelanggan.
- Mengelola percakapan Live Chat.
- Menangani komunikasi melalui WhatsApp Inbox.

## 5. Ruang Lingkup Produk

### 5.1 Fitur Utama

Produk mencakup modul berikut:

1. Dashboard.
2. Customer Management.
3. Lead Management.
4. Sales Pipeline.
5. Product & Service Management.
6. Quotation Management.
7. Transaction Management.
8. Activities & Task Management.
9. Calendar.
10. Customer Service.
11. Live Chat.
12. WhatsApp Inbox.
13. Reports & Analytics.
14. Notifications & Automation.
15. Document Management.
16. User Management.
17. Roles & Permissions.
18. Audit Logs.
19. Settings & Integrations.

### 5.2 Fitur di Luar Prioritas Awal

Marketing Campaign tidak menjadi prioritas pada versi awal dan dapat dikembangkan pada fase berikutnya.

## 6. Kebutuhan Fungsional (Functional Requirements)

### FR-01: Authentication & User Management

Sistem harus menyediakan:
- Login dan logout.
- Pengelolaan akun pengguna.
- Pengaturan role pengguna.
- Pengaturan hak akses.
- Pengelolaan sesi pengguna.
- MFA wajib untuk Admin dan Manager.
- MFA opsional untuk Sales dan Customer Service.

### FR-02: Dashboard

Sistem harus menyediakan dashboard berdasarkan role.

**Dashboard Admin:**
- Total pelanggan dan lead.
- Total penjualan dan pendapatan.
- Grafik penjualan.
- Performa Sales.
- Aktivitas perusahaan.
- Tiket Customer Service.
- Notifikasi sistem.

**Dashboard Manager:**
- Total penjualan tim.
- Target dan pencapaian Sales.
- Performa masing-masing Sales.
- Pipeline penjualan.
- Quotation yang menunggu persetujuan.
- Grafik laporan penjualan.

**Dashboard Sales:**
- Lead yang ditugaskan.
- Pelanggan yang dikelola.
- Target penjualan pribadi.
- Aktivitas dan jadwal follow-up.
- Pipeline pribadi.
- Riwayat penjualan.

**Dashboard Customer Service:**
- Total tiket keluhan.
- Tiket yang belum diselesaikan.
- Percakapan aktif.
- Pesan masuk.
- Riwayat komunikasi pelanggan.

### FR-03: Customer Management

Sistem harus memungkinkan pengguna yang berwenang untuk:
- Menambahkan pelanggan.
- Melihat detail pelanggan.
- Mengubah data pelanggan sesuai hak akses.
- Mencari dan memfilter pelanggan.
- Mengelompokkan pelanggan.
- Melihat riwayat transaksi.
- Melihat riwayat komunikasi.
- Melihat aktivitas pelanggan.
- Mengunggah dokumen pelanggan.
- Mendeteksi kemungkinan data pelanggan duplikat.

Sistem harus menyediakan halaman Customer 360 yang menampilkan informasi pelanggan secara terpusat.

### FR-04: Lead Management

Sistem harus memungkinkan:
- Pembuatan lead secara manual.
- Penerimaan lead dari website atau formulir.
- Penerimaan lead dari media sosial melalui integrasi yang tersedia.
- Pencatatan lead dari WhatsApp.
- Pencatatan sumber lead.
- Penentuan status lead.
- Penugasan lead oleh Admin.
- Pencatatan aktivitas follow-up.
- Konversi lead menjadi pelanggan.

Status lead harus dapat dikelola berdasarkan tahapan proses bisnis.

### FR-05: Sales Pipeline

Sistem harus menyediakan pipeline penjualan berbentuk Kanban Board.

Tahapan utama:
1. Lead.
2. Contact.
3. Negotiation.
4. Won.
5. Lost.

Pengguna yang berwenang dapat:
- Melihat daftar peluang penjualan.
- Memindahkan kartu antar tahapan.
- Memperbarui status penjualan.
- Mencatat nilai peluang.
- Melihat riwayat perubahan status.
- Mencatat alasan kehilangan peluang (Lost Reason).

### FR-06: Product & Service Management

Sistem harus mendukung pengelolaan:
- Produk fisik.
- Layanan atau jasa.
- Kategori produk.
- Harga produk.
- Deskripsi produk.
- Status aktif dan tidak aktif.
- Informasi stok produk fisik.
- Riwayat pergerakan stok.

Stok hanya berlaku untuk produk fisik.

### FR-07: Quotation Management

Sistem harus memungkinkan Sales membuat penawaran harga kepada pelanggan.

Fitur:
- Membuat quotation.
- Menambahkan produk atau layanan.
- Mengatur jumlah dan harga.
- Mengatur diskon.
- Mengatur pajak.
- Menghitung total penawaran.
- Mengirim quotation untuk persetujuan Manager.
- Menampilkan riwayat persetujuan.
- Mengirim quotation kepada pelanggan setelah disetujui.

Alur status quotation:

`Draft → Pending Approval → Approved / Rejected → Sent → Accepted / Rejected / Expired`

Seluruh quotation wajib mendapatkan persetujuan Manager sebelum dikirim kepada pelanggan.

### FR-08: Transaction Management

Sistem harus menyediakan pengelolaan transaksi setelah proses penjualan disetujui.

Fitur:
- Membuat transaksi.
- Mencatat produk atau layanan.
- Menghitung total transaksi.
- Mengelola invoice.
- Mencatat pembayaran.
- Melihat riwayat transaksi.
- Mengelola status pembayaran.

Metode pembayaran:
- Tunai.
- Transfer bank.
- Metode pembayaran lain yang dikonfigurasi.

Sistem harus mendukung:
- Pembayaran penuh.
- Uang muka (DP).
- Pembayaran bertahap atau cicilan.
- Pembayaran lebih dari satu kali.

Mata uang awal menggunakan Rupiah (IDR).

### FR-09: Activities & Task Management

Sistem harus menyediakan pencatatan aktivitas seperti:
- Telepon.
- Meeting.
- Email.
- Follow-up.
- Pengiriman penawaran.
- Aktivitas lainnya.

Fitur:
- Membuat tugas.
- Menentukan tanggal jatuh tempo.
- Menentukan penanggung jawab.
- Mengatur prioritas.
- Mengubah status tugas.
- Melihat riwayat aktivitas.

### FR-10: Calendar

Sistem harus menyediakan kalender untuk:
- Jadwal meeting.
- Jadwal follow-up.
- Jadwal tugas.
- Pengingat aktivitas.
- Agenda pengguna.

### FR-11: Customer Service

Sistem harus menyediakan pengelolaan keluhan pelanggan melalui sistem tiket.

Fitur:
- Membuat tiket.
- Menentukan kategori keluhan.
- Menentukan prioritas.
- Menugaskan tiket kepada petugas.
- Membalas tiket.
- Mengubah status tiket.
- Melihat riwayat penanganan.

### FR-12: Live Chat & WhatsApp Inbox

Sistem harus menyediakan pusat komunikasi pelanggan.

**Live Chat:**
- Pelanggan dapat mengirim pesan melalui website.
- Customer Service dapat membalas pesan.
- Riwayat percakapan tersimpan.
- Percakapan dapat dikaitkan dengan data pelanggan.

**WhatsApp Inbox:**
- Mengirim dan menerima pesan WhatsApp.
- Menggunakan WhatsApp Business Cloud API resmi Meta.
- Menampilkan riwayat percakapan.
- Menghubungkan nomor WhatsApp dengan data pelanggan.
- Mendukung template pesan sesuai kebijakan Meta.
- Menyediakan notifikasi pesan masuk.

### FR-13: Email Integration

Sistem harus mendukung email transaksional untuk:
- Notifikasi.
- Pengingat aktivitas.
- Pengiriman quotation.
- Informasi transaksi.
- Pemberitahuan kepada pengguna.

Penyedia email harus dapat diganti tanpa mengubah keseluruhan sistem.

### FR-14: Reports & Analytics

Sistem harus menyediakan laporan:
- Penjualan.
- Pendapatan.
- Performa Sales.
- Target dan pencapaian.
- Data pelanggan.
- Data lead.
- Konversi lead.
- Pipeline penjualan.
- Aktivitas Customer Service.
- Keluhan pelanggan.

Laporan harus mendukung filter berdasarkan periode dan kategori yang relevan.

### FR-15: Notifications & Automation

Sistem harus menyediakan:
- Notifikasi aktivitas.
- Pengingat follow-up.
- Pengingat tugas.
- Notifikasi quotation.
- Notifikasi persetujuan Manager.
- Otomatisasi perubahan status sesuai aturan bisnis.
- Pengingat pelanggan yang belum di-follow-up.
- Notifikasi pesan masuk.

### FR-16: Document Management

Sistem harus memungkinkan pengguna yang berwenang untuk:
- Mengunggah dokumen.
- Mengunduh dokumen.
- Melihat dokumen.
- Menghubungkan dokumen dengan pelanggan atau transaksi.
- Mengatur akses dokumen.

### FR-17: Audit Logs

Sistem harus mencatat aktivitas penting, seperti:
- Login dan logout.
- Perubahan data pelanggan.
- Perubahan data lead.
- Perubahan pipeline.
- Persetujuan quotation.
- Perubahan transaksi.
- Perubahan pembayaran.
- Penghapusan dan pemulihan data.
- Perubahan role dan permission.

## 7. Business Rules

Aturan bisnis yang wajib diterapkan:

1. Admin memiliki akses penuh terhadap sistem.
2. Manager dapat melihat seluruh data penjualan.
3. Sales dapat melihat seluruh pelanggan, tetapi hanya dapat mengubah pelanggan yang ditugaskan kepadanya.
4. Customer Service dapat melihat data pelanggan dan riwayat komunikasi untuk kebutuhan pelayanan.
5. Admin bertanggung jawab membagikan lead kepada Sales.
6. Semua quotation wajib disetujui Manager.
7. Quotation yang belum disetujui tidak boleh dikirim kepada pelanggan.
8. Produk fisik memiliki pengelolaan stok, sedangkan layanan tidak.
9. Transaksi mendukung DP, pembayaran penuh, dan cicilan.
10. Semua aktivitas penting harus tercatat dalam Audit Log.
11. Data yang dihapus menggunakan mekanisme Soft Delete jika sesuai kebutuhan bisnis.
12. Hak akses harus diperiksa di sisi server dan database, bukan hanya melalui tampilan frontend.

## 8. Hak Akses Pengguna

| Fitur | Admin | Manager | Sales | CS |
|---|---|---|---|---|
| Dashboard | Semua | Tim Sales | Pribadi | Layanan |
| Customer | Penuh | Lihat | Lihat, edit milik sendiri | Lihat |
| Lead | Penuh | Lihat | Kelola sesuai penugasan | Lihat sesuai kebutuhan |
| Sales Pipeline | Penuh | Semua | Kelola sesuai penugasan | Tidak utama |
| Produk | Penuh | Lihat | Lihat | Tidak utama |
| Quotation | Penuh | Approve/Reject | Buat | Tidak utama |
| Transaksi | Penuh | Lihat | Sesuai penugasan | Tidak utama |
| Customer Service | Penuh | Monitoring | Lihat sesuai kebutuhan | Kelola |
| Live Chat | Penuh | Monitoring | Sesuai izin | Kelola |
| WhatsApp Inbox | Penuh | Monitoring | Sesuai izin | Kelola |
| Reports | Semua | Penjualan | Pribadi | Layanan |
| User Management | Penuh | Tidak | Tidak | Tidak |
| Roles & Permissions | Penuh | Tidak | Tidak | Tidak |
| Audit Logs | Penuh | Sesuai izin | Tidak | Tidak |
| Settings | Penuh | Terbatas | Tidak | Tidak |

Hak akses akhir harus diterapkan secara rinci melalui konfigurasi permission dan Supabase Row Level Security (RLS).

## 9. Alur Kerja Utama

### 9.1 Alur Lead hingga Penjualan

1. Lead masuk melalui website, media sosial, WhatsApp, atau input manual.
2. Lead tersimpan dalam sistem.
3. Admin memeriksa dan menugaskan lead kepada Sales.
4. Sales menghubungi calon pelanggan.
5. Sales melakukan follow-up.
6. Sales memperbarui tahapan pipeline.
7. Sales membuat quotation.
8. Quotation dikirim kepada Manager untuk persetujuan.
9. Manager menyetujui atau menolak quotation.
10. Jika disetujui, Sales mengirim quotation kepada pelanggan.
11. Jika pelanggan menerima penawaran, proses dilanjutkan ke transaksi.
12. Sistem mencatat transaksi dan pembayaran.

### 9.2 Alur Customer Service

1. Pelanggan mengirim pesan atau keluhan.
2. Sistem menerima pesan melalui Live Chat atau WhatsApp.
3. Customer Service melihat percakapan.
4. Customer Service membuat atau menghubungkan tiket.
5. Tiket ditangani oleh petugas yang bertanggung jawab.
6. Status tiket diperbarui.
7. Setelah selesai, tiket ditandai sebagai resolved atau closed.
8. Riwayat komunikasi tersimpan.

### 9.3 Alur Persetujuan Quotation

1. Sales membuat quotation.
2. Sales mengirim quotation untuk persetujuan.
3. Status berubah menjadi Pending Approval.
4. Manager memeriksa isi penawaran.
5. Manager menyetujui atau menolak.
6. Sistem mencatat keputusan dan waktu persetujuan.
7. Quotation yang disetujui dapat dikirim kepada pelanggan.

## 10. Kebutuhan Non-Fungsional

### 10.1 Security

- Menggunakan autentikasi Supabase.
- Menggunakan Role-Based Access Control (RBAC).
- Menggunakan Supabase Row Level Security.
- Memvalidasi input di sisi server.
- Melindungi data sensitif.
- Menggunakan HTTPS.
- Menyimpan secret key hanya di lingkungan server.
- Menggunakan private storage untuk dokumen.
- Menerapkan rate limiting pada endpoint penting.
- Memverifikasi webhook WhatsApp.

### 10.2 Performance

- Halaman harus memiliki waktu pemuatan yang wajar.
- Query database harus dioptimalkan.
- Menggunakan pagination untuk data berjumlah besar.
- Menghindari pemanggilan database yang tidak diperlukan.
- Menggunakan loading state dan error state yang jelas.

### 10.3 Responsive Design

Aplikasi harus dapat digunakan melalui:
- Desktop.
- Laptop.
- Tablet.
- Smartphone.

### 10.4 Reliability

- Sistem harus memiliki mekanisme penanganan error.
- Data penting harus memiliki backup.
- Proses pemulihan data harus dapat diuji.
- Sistem harus mencegah pemrosesan webhook atau transaksi yang sama secara tidak sengaja.

### 10.5 Usability

- Antarmuka mudah dipahami.
- Navigasi konsisten.
- Form memiliki validasi.
- Pesan error mudah dimengerti.
- Tabel memiliki pencarian, filter, pengurutan, dan pagination.
- Mendukung Light Mode dan Dark Mode.

## 11. UI/UX Requirements

Gaya desain menggunakan **Enterprise Minimalist**.

Ketentuan desain:
- Sidebar berada di sebelah kiri.
- Tampilan bersih dan profesional.
- Menggunakan layout yang konsisten.
- Mendukung Light Mode dan Dark Mode.
- Menggunakan desain responsif.
- Memiliki komponen UI yang konsisten.
- Menggunakan tabel, grafik, kartu informasi, dan formulir.
- Menampilkan dashboard berdasarkan role.
- Memiliki loading, empty, success, dan error state.

Desain warna dan tipografi akan ditentukan menggunakan UI/UX Pro Max Skill.

Referensi skill:  
https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

## 12. Teknologi yang Digunakan

| Bagian | Teknologi |
|---|---|
| Frontend | Next.js |
| Bahasa | TypeScript |
| Routing | Next.js App Router |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Backend Service | Next.js Server + Supabase |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Form | React Hook Form |
| Validation | Zod |
| Charts | Recharts |
| Drag & Drop | dnd-kit |
| Unit Testing | Vitest |
| E2E Testing | Playwright |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

Arsitektur menggunakan pendekatan Modular Monolith dengan Next.js dan Supabase. Tidak diperlukan backend terpisah seperti NestJS atau Redis pada tahap awal, kecuali kebutuhan teknis di masa depan memang mengharuskannya.

## 13. Database Requirements

Database menggunakan PostgreSQL dari Supabase.

Kelompok entitas utama:

1. User & Access: users, profiles, roles, permissions, user_roles, role_permissions.
2. Customer & Lead: customers, leads, lead_sources, lead_assignments, customer_sales_assignments.
3. Sales: pipelines, pipeline_stages, deals, deal_products, sales_targets.
4. Quotation: quotations, quotation_items, approvals.
5. Product & Transaction: products, product_categories, price_lists, stock_movements, transactions, transaction_items, invoices, payments.
6. Activity & Communication: activities, tasks, conversations, messages, communication_channels.
7. Customer Service: tickets, ticket_replies, ticket_assignments.
8. System: notifications, automation_rules, documents, audit_logs, integrations.

Struktur tabel, relasi, indeks, constraint, dan kebijakan RLS harus dirancang lebih rinci pada tahap database design sebelum implementasi.

## 14. Integrasi Eksternal

### WhatsApp

Menggunakan WhatsApp Business Cloud API resmi Meta.

Kebutuhan:
- Mengirim pesan.
- Menerima pesan.
- Webhook.
- Template pesan.
- Riwayat percakapan.
- Pengaitan pesan dengan pelanggan.

### Email

Menggunakan layanan email transaksional yang dapat diganti sesuai kebutuhan.

### Website

Menyediakan formulir untuk menerima lead dan Live Chat untuk komunikasi pelanggan.

## 15. Testing Requirements

Pengujian yang harus dilakukan:

1. Unit Testing: menguji fungsi dan komponen secara terpisah.
2. Integration Testing: menguji hubungan antarmodul dan database.
3. End-to-End Testing: menguji alur penggunaan aplikasi.
4. Security Testing: menguji autentikasi, permission, dan RLS.
5. Performance Testing: menguji kecepatan dan kemampuan sistem.

Pengujian harus mencakup setiap role untuk memastikan pengguna tidak dapat mengakses data atau tindakan di luar kewenangannya.

## 16. Deployment & Infrastructure

Aplikasi akan menggunakan tiga lingkungan:

- Development.
- Staging.
- Production.

Ketentuan:
- Aplikasi Next.js di-deploy menggunakan Vercel.
- Database dan layanan backend menggunakan Supabase.
- Source code disimpan di GitHub.
- GitHub Actions digunakan untuk CI/CD.
- Environment variable dipisahkan untuk setiap lingkungan.
- Monitoring error dan performa menggunakan layanan seperti Sentry atau alternatif sejenis.

## 17. Backup & Maintenance

Sistem harus memiliki:
- Backup database harian sesuai kemampuan paket dan konfigurasi Supabase.
- Backup dokumen penting.
- Pengujian pemulihan data secara berkala.
- Pembaruan keamanan.
- Optimasi database.
- Pemantauan performa.
- Pemeriksaan error sistem.

Kebijakan retensi dan pemulihan backup harus disesuaikan dengan paket Supabase yang digunakan.

## 18. Data Import

Sistem harus mendukung impor data pelanggan dan lead melalui CSV atau Excel.

Fitur:
- Upload file.
- Preview data.
- Pemetaan kolom.
- Validasi format.
- Deteksi duplikasi.
- Menampilkan jumlah data berhasil dan gagal.
- Menyediakan laporan kesalahan impor.

## 19. Tahapan Pengembangan

Pengembangan dilakukan secara bertahap agar sistem mudah diuji dan diperbaiki.

**Phase 1 – Project Foundation**
- Setup Next.js.
- Setup TypeScript.
- Setup Supabase.
- Setup UI/UX design system.
- Setup autentikasi.
- Setup struktur proyek.

**Phase 2 – User & Access Management**
- User Management.
- Role Management.
- Permission.
- RLS.
- MFA.

**Phase 3 – Customer & Lead Management**
- Customer Management.
- Customer 360.
- Lead Management.
- Lead Assignment.
- Lead Conversion.

**Phase 4 – Sales Management**
- Sales Pipeline.
- Activities.
- Tasks.
- Calendar.
- Sales Targets.

**Phase 5 – Product & Transaction**
- Product Management.
- Stock Management.
- Quotation.
- Approval.
- Invoice.
- Payment.
- Transaction.

**Phase 6 – Customer Experience**
- Customer Service.
- Ticket Management.
- Live Chat.
- WhatsApp Integration.
- Email Integration.

**Phase 7 – Analytics & Automation**
- Dashboard.
- Reports.
- Notifications.
- Automation Rules.

**Phase 8 – System Management**
- Document Management.
- Audit Logs.
- Settings.
- Integrations.

**Phase 9 – Testing & Deployment**
- Unit Testing.
- Integration Testing.
- E2E Testing.
- Security Testing.
- Performance Testing.
- Staging.
- Pilot Testing.
- Production Deployment.

## 20. Acceptance Criteria

Produk dianggap memenuhi kebutuhan awal apabila:

1. Pengguna dapat login sesuai akun dan role.
2. Sistem membatasi akses berdasarkan permission.
3. Admin dapat mengelola seluruh data dan membagikan lead.
4. Sales dapat mengelola lead yang ditugaskan.
5. Sales hanya dapat mengubah data pelanggan yang menjadi tanggung jawabnya.
6. Manager dapat melihat seluruh data penjualan.
7. Manager dapat menyetujui atau menolak quotation.
8. Quotation tidak dapat dikirim sebelum disetujui.
9. Sistem dapat mencatat transaksi dan pembayaran.
10. Sistem dapat mengelola tiket Customer Service.
11. Live Chat dan WhatsApp dapat terhubung dengan riwayat pelanggan sesuai integrasi yang aktif.
12. Dashboard menampilkan informasi sesuai role.
13. Laporan dapat menampilkan data yang relevan.
14. Aktivitas penting tercatat dalam Audit Log.
15. Sistem dapat digunakan pada desktop dan smartphone.
16. Pengujian keamanan, fungsi, dan performa telah dilakukan.
17. Sistem berhasil melalui pilot testing sebelum digunakan secara penuh.

## 21. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Kebocoran data | RBAC, RLS, validasi server |
| Integrasi WhatsApp gagal | Webhook verification, logging, retry |
| Data pelanggan duplikat | Duplicate detection |
| Kesalahan pembayaran | Validasi transaksi dan audit log |
| Performa lambat | Pagination dan optimasi query |
| Kesalahan permission | Pengujian setiap role |
| Kehilangan data | Backup dan uji pemulihan |
| Fitur terlalu kompleks | Pengembangan bertahap |

## 22. Asumsi dan Hal yang Perlu Dikonfirmasi

PRD ini disusun berdasarkan kebutuhan yang telah disepakati. Beberapa detail bisnis belum ditentukan dan harus dikonfirmasi sebelum implementasi terkait:

- Nama perusahaan dan identitas merek.
- Format nomor pelanggan dan nomor quotation.
- Detail kategori produk dan layanan.
- Besaran serta aturan pajak.
- Aturan diskon.
- Aturan stok dan pengurangan stok.
- Ketentuan persetujuan transaksi dan pembayaran.
- Target penjualan masing-masing Sales.
- SLA Customer Service.
- Penyedia email transaksional.
- Paket Supabase dan kebijakan retensi backup.
- Detail permission setiap tindakan.

Keputusan tersebut tidak boleh dibuat secara sembarangan oleh sistem; perlu disesuaikan dengan kebijakan perusahaan.

## 23. Prioritas Produk

**Prioritas P0 – Fondasi wajib**
- Authentication.
- User Management.
- RBAC dan RLS.
- Customer Management.
- Lead Management.
- Sales Pipeline.
- Quotation Approval.

**Prioritas P1 – Operasional utama**
- Product Management.
- Transaction Management.
- Activities & Calendar.
- Customer Service.
- Dashboard.
- Reports.

**Prioritas P2 – Integrasi dan otomatisasi**
- WhatsApp Business API.
- Live Chat.
- Email Integration.
- Notifications.
- Automation.
- Document Management.
- Advanced Analytics.

**Prioritas P3 – Pengembangan lanjutan**
- Marketing Campaign.
- Fitur analitik lanjutan.
- Integrasi tambahan sesuai kebutuhan bisnis.

---

## 24. Kesimpulan

All-in-One CRM merupakan sistem manajemen hubungan pelanggan yang dirancang untuk mengintegrasikan proses penjualan, pengelolaan pelanggan, layanan pelanggan, komunikasi, transaksi, dan analisis bisnis dalam satu aplikasi.

Sistem dibangun menggunakan Next.js, TypeScript, dan Supabase dengan pendekatan Modular Monolith. Keamanan diterapkan melalui Role-Based Access Control dan Row Level Security.

Pengembangan dilakukan secara bertahap mulai dari fondasi aplikasi hingga integrasi dan deployment. Setiap modul harus melalui pengujian sebelum dilanjutkan ke tahap berikutnya.

PRD ini menjadi acuan utama bagi proses UI/UX Design, Database Design, Technical Architecture, Development, Testing, dan Deployment.
