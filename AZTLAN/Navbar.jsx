import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/chatbot", label: "Síntomas" },
  { to: "/kiosco", label: "Kiosco" },
  { to: "/gps", label: "GPS Hospital" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav style={{ background: "linear-gradient(90deg, #0891b2, #06b6d4)" }} className="px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div style={{ width: "36px", height: "36px", overflow: "hidden", borderRadius: "8px", background: "white", padding: "3px", flexShrink: 0 }}>
          <img
            src="/aztlan-logo.JPG"
            alt="Logo"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
        <div>
          <p className="text-white font-bold text-base leading-none">Aztlan Vita F</p>
          <p className="text-cyan-100 text-xs">Salud 360° en Tiempo Real</p>
        </div>
      </div>
      <div className="flex gap-1">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === l.to
                ? "bg-white text-cyan-700"
                : "text-white hover:bg-cyan-500"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}