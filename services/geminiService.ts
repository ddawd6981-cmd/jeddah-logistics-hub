
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function parseWebhookAddress(rawText: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract shipping details from this raw data: ${rawText}. 
      Make sure to identify the District in Jeddah.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customerName: { type: Type.STRING },
            phone: { type: Type.STRING },
            district: { type: Type.STRING },
            address: { type: Type.STRING },
            weight: { type: Type.NUMBER }
          },
          required: ["customerName", "district", "address"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    return null;
  }
}
