import React from 'react';
import { Database, Eye, Fingerprint, Server, Code } from 'lucide-react';

export function Roadmap() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Guia de Arquitetura</h2>
        <p className="text-gray-500">Roteiro técnico para a construção do AI Authenticator</p>
      </div>

      <div className="space-y-8">
        {/* Metadados */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6">
          <div className="shrink-0">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Análise de Metadados</h3>
            <p className="text-gray-600 mb-4">
              A primeira camada de defesa envolve a extração de dados embutidos no arquivo.
            </p>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li><strong>EXIF Data:</strong> Extração de dados da câmera (modelo, lente, exposição) usando bibliotecas como <code className="bg-gray-100 px-1 py-0.5 rounded">exif-parser</code> ou <code className="bg-gray-100 px-1 py-0.5 rounded">exifr</code> em Node.js. Imagens de IA geralmente não possuem esses dados ou possuem dados genéricos.</li>
              <li><strong>Padrão C2PA:</strong> Implementação da Coalition for Content Provenance and Authenticity. Utiliza-se a biblioteca <code className="bg-gray-100 px-1 py-0.5 rounded">c2pa-node</code> para ler manifestos criptográficos que comprovam a origem da imagem (ex: "Gerado por Midjourney" ou "Capturado por Sony A7IV").</li>
            </ul>
          </div>
        </section>

        {/* Análise Visual */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6">
          <div className="shrink-0">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Análise Visual (Modelos de Visão)</h3>
            <p className="text-gray-600 mb-4">
              Utilização de modelos multimodais (como Gemini 1.5 Pro) para procurar artefatos típicos de IAs generativas:
            </p>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li><strong>Distorções Anatômicas:</strong> Assimetria facial, dedos extras ou fundidos, dentes irregulares.</li>
              <li><strong>Inconsistências Físicas:</strong> Iluminação impossível (múltiplas fontes de luz conflitantes), reflexos em espelhos ou água que não condizem com a cena.</li>
              <li><strong>Texturas e Padrões:</strong> Suavização excessiva (pele com aspecto de plástico), padrões repetitivos que quebram a aleatoriedade natural, ou fundos borrados de forma não óptica (bokeh irreal).</li>
              <li><strong>Texto e Detalhes:</strong> Caracteres alienígenas ou ininteligíveis em placas, roupas e fundos.</li>
            </ul>
          </div>
        </section>

        {/* Tecnologia Google */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6">
          <div className="shrink-0">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Fingerprint className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Tecnologia Google (SynthID)</h3>
            <p className="text-gray-600 mb-4">
              O SynthID é uma tecnologia do Google DeepMind que incorpora marcas d'água digitais imperceptíveis diretamente nos pixels da imagem gerada (ex: Imagen 3).
            </p>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li><strong>Integração:</strong> Feita através da API do Google Cloud Vertex AI.</li>
              <li><strong>Verificação:</strong> O backend envia a imagem para o serviço de detecção do SynthID, que retorna um nível de confiança indicando se a marca d'água do Google está presente, mesmo que a imagem tenha sido cortada, redimensionada ou comprimida.</li>
            </ul>
          </div>
        </section>

        {/* Fluxo de Backend */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6">
          <div className="shrink-0">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Fluxo de Backend Proposto</h3>
            <p className="text-gray-600 mb-4">
              Arquitetura serverless utilizando Google Cloud:
            </p>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>O cliente faz o upload da imagem para um bucket do <strong>Google Cloud Storage</strong>.</li>
              <li>Um evento aciona um serviço no <strong>Cloud Run</strong> (Node.js/Python).</li>
              <li>O serviço executa análises em paralelo:
                <ul className="list-disc list-inside ml-6 mt-1 text-gray-500">
                  <li>Extração local de EXIF/C2PA.</li>
                  <li>Chamada à API do <strong>Vertex AI (SynthID)</strong>.</li>
                  <li>Chamada à API do <strong>Gemini 1.5 Pro</strong> para análise visual.</li>
                </ul>
              </li>
              <li>O serviço agrega os resultados, calcula a "Nota de Probabilidade" final e retorna o JSON para o frontend.</li>
            </ol>
          </div>
        </section>

        {/* Exemplo de Código */}
        <section className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 text-gray-300">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Exemplo de Código (Node.js)</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Chamada à API do Gemini para análise visual (semelhante ao implementado na aba Analisador):
          </p>
          <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-sm font-mono text-blue-300">
{`import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeImageForAI(base64Image, mimeType) {
  const prompt = \`Analise esta imagem minuciosamente em busca de sinais de geração por IA.
Procure por distorções anatômicas, padrões de ruído artificiais, inconsistências em reflexos e sombras, ou suavização excessiva de texturas.
Com base apenas nos elementos visuais, qual a probabilidade desta imagem ser sintética e por quê?
Retorne um JSON com: probabilityScore, justification, findings.\`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      }
    ],
    config: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    }
  });

  return JSON.parse(response.text);
}`}
          </pre>
        </section>
      </div>
    </div>
  );
}
