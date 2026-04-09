import { useState } from "react";
import { consultarKiosco } from "../services/gemini";

const CATEGORIAS = [
  { id: "dolor", emoji: "🤕", label: "Dolor" },
  { id: "fiebre", emoji: "🌡️", label: "Fiebre" },
  { id: "digestivo", emoji: "🤢", label: "Digestivo" },
  { id: "respiratorio", emoji: "😮‍💨", label: "Respiratorio" },
  { id: "piel", emoji: "🩹", label: "Piel" },
  { id: "otro", emoji: "❓", label: "Otro" },
];

function parsearKiosco(texto) {
  try {
    const clean = texto
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON");
    const json = JSON.parse(match[0]);
    return {
      orientacion: json.orientacion || "",
      medicamento: json.medicamento || "",
      advertencia: json.advertencia || "",
    };
  } catch (e) {
    return {
      orientacion: texto,
      medicamento: "",
      advertencia: "",
    };
  }
}

export default function Kiosco() {
  const [categoria, setCategoria] = useState(null);
  const [detalle, setDetalle] = useState("");
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function handleConsultar() {
    if (!categoria || !detalle.trim()) return;
    setCargando(true);
    setRespuesta(null);
    const texto = await consultarKiosco(categoria, detalle);
    setRespuesta(parsearKiosco(texto));
    setCargando(false);
  }

  function handleReset() {
    setCategoria(null);
    setDetalle("");
    setRespuesta(null);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🏪 Kiosco Inteligente</h1>
        <p className="text-gray-500 mt-1">Atención inmediata para padecimientos leves.</p>
      </div>

      {!respuesta ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            1. Selecciona tu padecimiento
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoria(c.id)}
                className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${
                  categoria === c.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-3xl mb-1">{c.emoji}</span>
                <span className="text-xs font-medium text-gray-700">{c.label}</span>
              </button>
            ))}
          </div>

          <p className="text-sm font-semibold text-gray-700 mb-2">
            2. Describe un poco más
          </p>
          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Ej: Me duele la cabeza desde esta mañana, no tengo fiebre..."
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
          />

          <button
            onClick={handleConsultar}
            disabled={!categoria || !detalle.trim() || cargando}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            {cargando ? "Consultando..." : "Obtener orientación"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <p className="font-bold text-blue-800 text-lg mb-4">💊 Tu orientación</p>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Qué hacer</p>
                <p className="text-sm text-blue-900 mt-1">{respuesta.orientacion}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Medicamento sugerido</p>
                <p className="text-sm text-blue-900 mt-1">{respuesta.medicamento}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">⚠️ Ve a urgencias si...</p>
            <p className="text-sm text-red-800">{respuesta.advertencia}</p>
          </div>

          <button
            onClick={handleReset}
            className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Nueva consulta
          </button>
        </div>
      )}
    </div>
  );
}