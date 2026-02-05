import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlantAnalysis, HealthStatus } from "../types";

const apiKey = process.env.API_KEY;

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: apiKey });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    plantName: { type: Type.STRING, description: "Common name of the plant" },
    scientificName: { type: Type.STRING, description: "Scientific Latin name" },
    healthStatus: { 
      type: Type.STRING, 
      enum: ["Healthy", "Needs Attention", "Critical", "Unknown"],
      description: "General health condition category"
    },
    healthScore: { 
      type: Type.INTEGER, 
      description: "A score from 0 to 100 representing health (100 is perfect)" 
    },
    diagnosis: { type: Type.STRING, description: "A concise 1-sentence diagnosis" },
    detailedDescription: { type: Type.STRING, description: "A detailed paragraph explaining the condition, visible symptoms, and potential causes." },
    careInstructions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Step-by-step actionable advice to fix the issue or maintain health."
    },
    preventativeMeasures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Tips to prevent this issue from recurring."
    }
  },
  required: ["plantName", "healthStatus", "diagnosis", "careInstructions", "healthScore"],
};

export const analyzePlant = async (base64Image: string): Promise<PlantAnalysis> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  // Strip prefix if present (data:image/jpeg;base64,)
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: `You are an expert botanist and plant pathologist. 
            Analyze the provided image of a plant. 
            Identify the plant, diagnose its health, and provide actionable care instructions.
            Be encouraging but realistic.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more factual analysis
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI.");
    }

    const data = JSON.parse(text) as PlantAnalysis;
    return data;
  } catch (error) {
    console.error("Error analyzing plant:", error);
    throw error;
  }
};