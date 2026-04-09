import { useState } from "react";
import { analizarSintomas } from "../services/gemini";

const NIVEL_ESTILOS = {
  URGENTE: "bg-red-50 border-red-300 text-red-800",
  MODERADO: "bg-yellow-50 border-yellow-300 text-yellow-800",
  LEVE: "bg-emerald-50 border-emerald-300 text-emerald-800",
};

function parsearRespuesta(texto) {
  try {
    const clean = texto
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON");
    const json = JSON.parse(match[0]);
    return {
      nivel: json.nivel || "MODERADO",
      recomendacion: json.recomendacion || "",
      motivo: json.motivo || "",
      siguientePaso: json.siguientePaso || "",
    };
  } catch (e) {
    console.log("Error parseando:", e, texto);
    return {
      nivel: "MODERADO",
      recomendacion: texto,
      motivo: "",
      siguientePaso: "",
    };
  }
}

export default function Chatbot() {
  const [sintomas, setSintomas] = useState("");
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [historial, setHistorial] = useState([]);

  async function handleEnviar() {
    if (!sintomas.trim()) return;
    setCargando(true);
    setRespuesta(null);
    const texto = await analizarSintomas(sintomas);
    const parsed = parsearRespuesta(texto);
    setRespuesta(parsed);
    setHistorial((h) => [...h, { sintomas, respuesta: parsed }]);
    setCargando(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🔍 Asistente de Síntomas</h1>
        <p className="text-gray-500 mt-1">Describe cómo te sientes y te orientamos al lugar correcto.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Qué síntomas tienes?
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
          rows={4}
          placeholder="Ej: Tengo dolor de cabeza fuerte desde hace 2 horas, me siento mareado y tengo un poco de fiebre..."
          value={sintomas}
          onChange={(e) => setSintomas(e.target.value)}
        />
        <button
          onClick={handleEnviar}
          disabled={cargando || !sintomas.trim()}
          className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          {cargando ? "Analizando síntomas..." : "Analizar síntomas"}
        </button>
      </div>

      {respuesta && (
        <div className={`rounded-2xl border p-6 mb-6 ${NIVEL_ESTILOS[respuesta.nivel] || "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold">
              {respuesta.nivel === "URGENTE" ? "🚨" : respuesta.nivel === "MODERADO" ? "⚠️" : "✅"}
            </span>
            <span className="font-bold text-lg">Nivel: {respuesta.nivel}</span>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">Recomendación</p>
              <p className="mt-0.5">{respuesta.recomendacion}</p>
            </div>
            <div>
              <p className="font-semibold">Motivo</p>
              <p className="mt-0.5">{respuesta.motivo}</p>
            </div>
            <div>
              <p className="font-semibold">Siguiente paso</p>
              <p className="mt-0.5">{respuesta.siguientePaso}</p>
            </div>
          </div>
        </div>
      )}

      {historial.length > 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Consultas anteriores</p>
          <div className="space-y-2">
            {historial.slice(0, -1).map((h, i) => (
              <div key={i} className="text-xs text-gray-500 border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-700">"{h.sintomas}"</span>
                <span className="ml-2 text-gray-400">→ {h.respuesta.nivel}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}