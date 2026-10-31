"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, BriefcaseBusiness, LockKeyhole } from "lucide-react";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mfa, setMfa] = useState<{ factorId: string; mode: "verify" | "enroll"; qrCode?: string; secret?: string; uri?: string } | null>(null);
  const [code, setCode] = useState("");
  const configured = isSupabaseConfigured();

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const client = createSupabaseClient();
    if (!client) { window.location.assign("/"); return; }
    if (!mfa) {
      const { error: signInError } = await client.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("Email atau kata sandi tidak sesuai. Periksa kembali lalu coba lagi.");
        setLoading(false);
        return;
      }
      const { data: currentUser } = await client.auth.getUser();
      const { data: profile } = currentUser.user ? await client.from("profiles").select("role").eq("id", currentUser.user.id).maybeSingle() : { data: null };
      const needsMfa = profile?.role === "admin" || profile?.role === "manager";
      const { data: assurance } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
      if (needsMfa && assurance.currentLevel !== "aal2") {
        const { data: factors } = await client.auth.mfa.listFactors();
        const factor = factors.totp.find((item) => item.status === "verified");
        if (!factor) {
          const { data: enrollment, error: enrollmentError } = await client.auth.mfa.enroll({ factorType: "totp", friendlyName: `Nusa CRM Authenticator ${Date.now()}` });
          if (enrollmentError || !enrollment?.totp) {
            await client.auth.signOut();
            setError("Pendaftaran MFA tidak dapat dimulai. Hubungi administrator Supabase.");
            setLoading(false);
            return;
          }
          setMfa({ factorId: enrollment.id, mode: "enroll", qrCode: enrollment.totp.qr_code, secret: enrollment.totp.secret, uri: enrollment.totp.uri });
          setLoading(false);
          return;
        }
        setMfa({ factorId: factor.id, mode: "verify" });
        setLoading(false);
        return;
      }
    } else {
      const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId: mfa.factorId });
      if (challengeError || !challenge) {
        setError("Tantangan MFA gagal dibuat. Kembali ke masuk lalu coba lagi.");
        setLoading(false);
        return;
      }
      const { error: verifyError } = await client.auth.mfa.verify({ factorId: mfa.factorId, challengeId: challenge.id, code });
      if (verifyError) {
        setError(verifyError.code === "mfa_challenge_expired"
          ? "Tantangan MFA kedaluwarsa. Coba lagi dengan kode terbaru dari Authenticator."
          : "Kode MFA tidak valid. Periksa aplikasi Authenticator Anda dan coba lagi dengan kode terbaru.");
        setLoading(false);
        return;
      }
    }
    window.location.assign("/");
  }

  return <main className="login-page">
    <section className="login-panel">
      <a href="/" className="brand-lockup"><span className="brand-mark"><BriefcaseBusiness size={18} /></span><span>Nusa<span className="brand-light">CRM</span></span></a>
      <div className="login-copy"><span className="eyebrow">CUSTOMER WORKSPACE</span><h1>Semua hubungan pelanggan, dalam satu tempat.</h1><p>Kelola prospek, aktivitas penjualan, dan layanan pelanggan bersama tim Anda.</p></div>
      <div className="login-foot"><span className="status-dot" /> Workspace aman untuk tim internal</div>
    </section>
    <section className="login-form-wrap">
      <form className="login-form" onSubmit={signIn}>
        <div className="login-icon"><LockKeyhole size={20} /></div>
        <span className="eyebrow">SELAMAT DATANG</span><h2>{mfa ? "Verifikasi MFA" : "Masuk ke Nusa CRM"}</h2>
        <p className="form-intro">{mfa?.mode === "enroll" ? "Pindai QR dengan aplikasi Authenticator, lalu masukkan kode 6 digit untuk mengaktifkan MFA." : mfa ? "Masukkan kode 6 digit dari aplikasi Authenticator Anda." : "Gunakan akun perusahaan untuk melanjutkan."}</p>
        {!mfa ? <><label>Email kerja<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@perusahaan.com" /></label>
        <label>Kata sandi<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan kata sandi" /></label></> : <>{mfa.mode === "enroll" && <div className="mfa-enroll">{mfa.qrCode && <img src={mfa.qrCode} alt="QR code untuk menambahkan Nusa CRM ke aplikasi Authenticator" />}<span>Atau masukkan kunci setup:</span><code>{mfa.secret}</code></div>}<label>Kode authenticator<input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" autoFocus /></label></>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary login-submit" type="submit" disabled={loading}>{loading ? "Memeriksa akun…" : mfa?.mode === "enroll" ? "Aktifkan MFA & masuk" : mfa ? "Verifikasi & masuk" : "Masuk"}<ArrowRight size={16} /></button>
        {mfa && <button className="demo-link" type="button" onClick={async () => { await createSupabaseClient()?.auth.signOut(); setMfa(null); setCode(""); setError(""); }}>Kembali ke masuk</button>}
        {!configured && <a href="/" className="demo-link">Buka workspace demo <ArrowRight size={15} /></a>}
        {configured && <p className="login-note">Akun dikelola oleh administrator workspace Anda.</p>}
      </form>
    </section>
  </main>;
}
