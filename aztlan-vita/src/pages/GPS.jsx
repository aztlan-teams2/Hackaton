import { useState } from "react";

const PASOS = [
  {
    id: 1,
    area: "Entrada Principal",
    instruccion: "Dirígete a la recepción y muestra tu identificación.",
    tiempo: "2 min",
    icono: "🚪",
    estado: "completado",
  },
  {
    id: 2,
    area: "Registro y Admisión",
    instruccion: "Llena el formulario de ingreso. Ventanilla 3.",
    tiempo: "10 min",
    icono: "📋",
    estado: "actual",
  },
  {
    id: 3,
    area: "Sala de Triaje",
    instruccion: "Espera a ser llamado por enfermería para toma de signos vitales.",
    tiempo: "15 min",
    icono: "🩺",
    estado: "pendiente",
  },
  {
    id: 4,
    area: "Consulta Médica",
    instruccion: "Consultorio 7, segundo piso. Toma el elevador a tu derecha.",
    tiempo: "20 min",
    icono: "👨‍⚕️",
    estado: "pendiente",
  },
  {
    id: 5,
    area: "Farmacia / Alta",
    instruccion: "Recoge tu receta en farmacia planta baja o espera indicaciones de alta.",
    tiempo: "10 min",
    icono: "💊",
    estado: "pendiente",
  },
];

const ESTADO_ESTILOS = {
  completado: "border-emerald-300 bg-emerald-50",
  actual: "border-blue-400 bg-blue-50 ring-2 ring-blue-300",
  pendiente: "border-gray-200 bg-white",
};

const ESTADO_ICONO = {
  completado: "✅",
  actual: "📍",
  pendiente: "⭕",
};

export default function GPS() {
  const [pasos, setPasos] = useState(PASOS);
  const actualIdx = pasos.findIndex((p) => p.estado === "actual");

  function avanzar() {
    if (actualIdx === pasos.length - 1) return;
    setPasos((prev) =>
      prev.map((p, i) => {
        if (i === actualIdx) return { ...p, estado: "completado" };
        if (i === actualIdx + 1) return { ...p, estado: "actual" };
        return p;
      })
    );
  }

  function reiniciar() {
    setPasos(PASOS);
  }

  const completados = pasos.filter((p) => p.estado === "completado").length;
  const progreso = Math.round((completados / pasos.length) * 100);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🏥 GPS Hospitalario</h1>
        <p className="text-gray-500 mt-1">Tu guía paso a paso dentro del hospital.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">Progreso de tu visita</p>
          <p className="text-sm font-bold text-blue-600">{progreso}%</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{completados} de {pasos.length} pasos completados</p>
      </div>

      <div className="space-y-3 mb-6">
        {pasos.map((paso) => (
          <div
            key={paso.id}
            className={`rounded-xl border p-4 transition-all ${ESTADO_ESTILOS[paso.estado]}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{paso.icono}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800 text-sm">{paso.area}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">~{paso.tiempo}</span>
                    <span>{ESTADO_ICONO[paso.estado]}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{paso.instruccion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {actualIdx < pasos.length - 1 ? (
        <button
          onClick={avanzar}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Marcar paso actual como completado →
        </button>
      ) : (
        <div className="text-center">
          <p className="text-emerald-600 font-bold text-lg mb-3">🎉 ¡Visita completada!</p>
          <button
            onClick={reiniciar}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Nueva visita
          </button>
        </div>
      )}
    </div>
  );
}