
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export async function askPetExpert(prompt: string, history: {role: string, content: string}[]) {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const contents = history.map(h => ({
    role: h.role,
    parts: [{ text: h.content }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      systemInstruction: "Eres un experto en bienestar animal y veterinaria de Mascotas SJ. Ayudas a los usuarios con dudas sobre salud animal, comportamiento, razas y cuidado de mascotas. Sé amable, profesional y empático. Si es una emergencia médica grave, recomienda siempre acudir a un veterinario presencial inmediatamente.",
    }
  });

  return response.text || "Lo siento, no pude procesar tu consulta. Por favor, intenta de nuevo.";
}
