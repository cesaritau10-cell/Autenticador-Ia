import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client.
// The key is injected at build time by Vite via `define` in vite.config.ts.
const API_KEY = process.env.GEMINI_API_KEY;

export const isApiKeyConfigured = (): boolean => {
  return Boolean(API_KEY) && API_KEY !== 'MY_GEMINI_API_KEY';
};

const ai = new GoogleGenAI({ apiKey: API_KEY ?? '' });

export interface AnalysisResult {
  probabilityScore: number;
  justification: string;
  findings: string[];
}

export class MissingApiKeyError extends Error {
  constructor() {
    super('GEMINI_API_KEY não está configurada.');
    this.name = 'MissingApiKeyError';
  }
}

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  if (!isApiKeyConfigured()) {
    throw new MissingApiKeyError();
  }
  try {
    // Convert File to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const prompt = `Analise esta imagem minuciosamente em busca de sinais de geração por IA. Procure por distorções anatômicas, padrões de ruído artificiais, inconsistências em reflexos e sombras, ou suavização excessiva de texturas. Com base apenas nos elementos visuais, qual a probabilidade desta imagem ser sintética e por quê?

Retorne APENAS um objeto JSON válido com a seguinte estrutura, sem blocos de código markdown:
{
  "probabilityScore": <número de 0 a 100 representando a probabilidade de ser IA>,
  "justification": "<texto detalhado explicando o raciocínio>",
  "findings": ["<achado 1>", "<achado 2>", ...]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response from Gemini');
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}
