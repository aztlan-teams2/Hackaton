import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const AREAS = [
  { nombre: "Urgencias", capacidad: 40, ocupacion: 38, espera: 87 },
  { nombre: "Consulta General", capacidad: 30, ocupacion: 21, espera: 35 },
  { nombre: "Pediatría", capacidad: 20, ocupacion: 14, espera: 28 },
  { nombre: "Traumatología", capacidad: 15, ocupacion: 13, espera: 55 },
  { nombre: "Ginecología", capacidad: 12, ocupacion: 7, espera: 20 },
];

const FLUJO_INICIAL = [
  { hora: "07:00", pacientes: 12 },
  { hora: "08:00", pacientes: 28 },
  { hora: "09:00", pacientes: 45 },
  { hora: "10:00", pacientes: 52 },
  { hora: "11:00", pacientes: 61 },
  { hora: "12:00", pacientes: 58 },
  { hora: "13:00", pacientes: 43 },
];

function nivelOcupacion(ocupacion, capacidad) {
  const pct = (ocupacion / capacidad) * 100;
  if (pct >= 90) return { color: "bg-red-500", texto: "text-red-700", label: "Crítico" };
  if (pct >= 70) return { color: "bg-yellow-400", texto: "text-yellow-700", label: "Alto" };
  return { color: "bg-emerald-500", texto: "text-emerald-700", label: "Normal" };
}

export default function Dashboard() {
  const [flujo, setFlujo] = useState(FLUJO_INICIAL);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setFlujo((prev) => {
        const ultimo = prev[prev.length - 1];
        const horaNum = parseInt(ultimo.hora.split(":")[0]) + 1;
        if (horaNum > 22) return prev;
        const nuevoPacientes = Math.max(5, ultimo.pacientes + Math.floor(Math.random() * 10 - 4));
        return [...prev.slice(-6), { hora: `${horaNum}:00`, pacientes: nuevoPacientes }];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalPacientes = AREAS.reduce((a, b) => a + b.ocupacion, 0);
  const esperaPromedio = Math.round(AREAS.reduce((a, b) => a + b.espera, 0) / AREAS.length);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📊 Panel de Control</h1>
          <p className="text-gray-500 mt-1">Flujo hospitalario en tiempo real</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse inline-block"></span>
          En vivo
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pacientes activos", valor: totalPacientes, color: "text-blue-600" },
          { label: "Espera promedio", valor: `${esperaPromedio} min`, color: "text-orange-600" },
          { label: "Áreas en alerta", valor: AREAS.filter(a => (a.ocupacion/a.capacidad) >= 0.9).length, color: "text-red-600" },
          { label: "Capacidad total", valor: `${Math.round((totalPacientes / AREAS.reduce((a,b)=>a+b.capacidad,0))*100)}%`, color: "text-emerald-600" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className={`text-2xl font-bold ${m.color}`}>{m.valor}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Ocupación por área</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={AREAS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="nombre" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="ocupacion" fill="#059669" radius={[4,4,0,0]} />
              <Bar dataKey="capacidad" fill="#d1fae5" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Flujo de pacientes (hoy)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={flujo} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="pacientes" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">Estado por área</p>
        <div className="space-y-3">
          {AREAS.map((area) => {
            const nivel = nivelOcupacion(area.ocupacion, area.capacidad);
            const pct = Math.round((area.ocupacion / area.capacidad) * 100);
            return (
              <div key={area.nombre} className="flex items-center gap-4">
                <p className="text-sm text-gray-700 w-36 shrink-0">{area.nombre}</p>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${nivel.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 w-16 text-right">{area.ocupacion}/{area.capacidad}</p>
                <span className={`text-xs font-medium w-12 text-right ${nivel.texto}`}>{nivel.label}</span>
                <span className="text-xs text-orange-500 w-16 text-right">~{area.espera} min</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}