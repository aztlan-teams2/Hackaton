const API_KEY = "AIzaSyBWa5rLRaTodYzW4RtJkPcZ2Me6oCc_cvw";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function llamarGemini(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
        }
    })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  const texto = data.candidates[0].content.parts[0].text;
  console.log("Gemini respondió:", texto);
  return texto;
}

export async function analizarSintomas(sintomas) {
  const prompt = `Analiza estos síntomas médicos: "${sintomas}"

Responde SOLO con este JSON exacto, reemplazando los valores:
{"nivel":"LEVE","recomendacion":"aquí va la recomendación","motivo":"aquí va el motivo","siguientePaso":"aquí va el siguiente paso"}

El campo nivel solo puede ser: URGENTE, MODERADO o LEVE
Todo en español de México. Sin diagnósticos, solo orientación.`;
  return await llamarGemini(prompt);
}

export async function consultarKiosco(categoria, detalle) {
  const prompt = `Eres un kiosco de salud en México.
Categoría: "${categoria}", Síntomas: "${detalle}"

Responde SOLO con este JSON exacto, reemplazando los valores:
{"orientacion":"aquí va qué debe hacer","medicamento":"aquí va medicamento de venta libre o No aplica","advertencia":"aquí va cuándo ir a urgencias"}

Todo en español de México, lenguaje simple y amable.`;
  return await llamarGemini(prompt);
}