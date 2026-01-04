
import { GoogleGenAI, Type } from "@google/genai";

export async function parseWebhookAddress(rawText: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قم باستخراج بيانات الشحن من النص التالي: "${rawText}". 
      يجب استخراج: اسم العميل، رقم الجوال، الحي (في جدة)، العنوان التفصيلي، والمبلغ (COD).
      إذا لم يذكر الحي، حاول استنتاجه من العنوان.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customerName: { type: Type.STRING },
            phone: { type: Type.STRING },
            district: { type: Type.STRING },
            address: { type: Type.STRING },
            codAmount: { type: Type.NUMBER },
            weight: { type: Type.NUMBER }
          },
          required: ["customerName", "phone", "district"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    return null;
  }
}
