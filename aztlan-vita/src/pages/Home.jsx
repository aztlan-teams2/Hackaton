import { Link } from "react-router-dom";

const modulos = [
  { to: "/chatbot", emoji: "🔍", titulo: "Asistente de Síntomas", desc: "Describe tus síntomas y la IA te orienta al lugar correcto de atención.", color: "#ecfdf5", border: "#6ee7b7", btn: "#059669" },
  { to: "/kiosco", emoji: "🏪", titulo: "Kiosco Inteligente", desc: "Atención inmediata para padecimientos leves sin necesidad de ir a urgencias.", color: "#eff6ff", border: "#93c5fd", btn: "#2563eb" },
  { to: "/gps", emoji: "🏥", titulo: "GPS Hospitalario", desc: "Navega dentro del hospital y conoce tu siguiente paso en tiempo real.", color: "#f5f3ff", border: "#c4b5fd", btn: "#7c3aed" },
  { to: "/dashboard", emoji: "📊", titulo: "Panel de Control", desc: "Métricas en tiempo real para gestores hospitalarios y toma de decisiones.", color: "#fff7ed", border: "#fdba74", btn: "#ea580c" },
];

const stats = [
  { num: "19.7M", label: "consultas urgencias/año" },
  { num: "65.8M", label: "sin seguridad social" },
  { num: "4-8h", label: "tiempo de espera promedio" },
  { num: "30-50%", label: "reducción estimada de espera" },
];

export default function Home() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#cffafe", color: "#0e7490", padding: "6px 16px",
          borderRadius: "999px", fontSize: "13px", fontWeight: 600, marginBottom: "16px",
        }}>
          <span style={{ width: "8px", height: "8px", background: "#06b6d4", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }}></span>
          Talent Hackathon 2026
        </div>
        <h1 style={{ fontSize: "48px", fontWeight: 800, color: "#0e7490", marginBottom: "12px" }}>Aztlan Vita F</h1>
        <p style={{ fontSize: "18px", color: "#64748b", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
          Ecosistema inteligente de atención médica 360° en tiempo real para México
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "40px" }}>
        {modulos.map((m) => (
          <div key={m.to} style={{
            background: m.color, border: `1px solid ${m.border}`,
            borderRadius: "16px", padding: "28px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "transform 0.2s",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>{m.emoji}</div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>{m.titulo}</h2>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, marginBottom: "20px" }}>{m.desc}</p>
            <Link to={m.to} style={{
              display: "inline-block", background: m.btn, color: "white",
              padding: "10px 20px", borderRadius: "10px", fontSize: "14px",
              fontWeight: 600, boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}>
              Abrir módulo →
            </Link>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {stats.map((s) => (
          <div key={s.num} style={{
            background: "white", borderRadius: "12px", padding: "20px",
            textAlign: "center", border: "1px solid #e2e8f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "#0891b2" }}>{s.num}</p>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}