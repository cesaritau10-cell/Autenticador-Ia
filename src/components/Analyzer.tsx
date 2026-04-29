import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, AlertTriangle, CheckCircle, Info, KeyRound } from 'lucide-react';
import { analyzeImage, AnalysisResult, isApiKeyConfigured, MissingApiKeyError } from '../lib/gemini';

export function Analyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const analysisResult = await analyzeImage(selectedFile);
      setResult(analysisResult);
    } catch (err) {
      if (err instanceof MissingApiKeyError) {
        setError(
          'GEMINI_API_KEY não configurada. Adicione a variável de ambiente nas configurações do projeto para ativar a análise.'
        );
      } else {
        const message = err instanceof Error ? err.message : 'Erro desconhecido.';
        setError(`Ocorreu um erro ao analisar a imagem: ${message}`);
      }
      console.error('[v0] Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Analisador Visual</h2>
        <p className="text-gray-500">Faça o upload de uma imagem para verificar sinais de geração por IA.</p>
      </div>

      {!isApiKeyConfigured() && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <KeyRound className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold">Configuração necessária</p>
            <p className="mt-1">
              A variável <code className="bg-amber-100 px-1 py-0.5 rounded">GEMINI_API_KEY</code> não está
              definida. A interface está funcionando, mas a análise só ficará disponível após adicionar a
              chave nas variáveis de ambiente do projeto. Obtenha uma chave em{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="underline font-medium hover:text-amber-700"
              >
                aistudio.google.com/apikey
              </a>
              .
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
              selectedImage ? 'border-gray-300 bg-gray-50' : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {selectedImage ? (
              <div className="space-y-4">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg shadow-sm object-contain"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-600 font-medium hover:text-blue-800"
                >
                  Trocar imagem
                </button>
              </div>
            ) : (
              <div
                className="cursor-pointer space-y-4 flex flex-col items-center justify-center py-12"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-white p-4 rounded-full shadow-sm">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Clique para fazer upload ou arraste uma imagem</p>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG, WEBP até 10MB</p>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <button
            onClick={runAnalysis}
            disabled={!selectedImage || isAnalyzing}
            className={`w-full py-3 px-4 rounded-xl font-medium text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
              !selectedImage || isAnalyzing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                Analisar Imagem
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-400" />
            Resultados da Análise
          </h3>

          {!result && !isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-3 text-center">
              <ImageIcon className="w-12 h-12 opacity-20" />
              <p>Faça o upload e clique em analisar para ver os resultados aqui.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <p className="animate-pulse">Processando elementos visuais...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Score Card */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-center gap-6">
                <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={getScoreColor(result.probabilityScore)}
                      strokeWidth="3"
                      strokeDasharray={`${result.probabilityScore}, 100`}
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${getScoreColor(result.probabilityScore)}`}>
                      {result.probabilityScore}%
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Probabilidade de IA</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {result.probabilityScore < 30 && 'Alta probabilidade de ser autêntica.'}
                    {result.probabilityScore >= 30 && result.probabilityScore < 70 && 'Inconclusivo. Sinais mistos detectados.'}
                    {result.probabilityScore >= 70 && 'Alta probabilidade de ser gerada por IA.'}
                  </p>
                </div>
              </div>

              {/* Justification */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Justificativa Técnica</h4>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {result.justification}
                </p>
              </div>

              {/* Findings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Artefatos Detectados</h4>
                <ul className="space-y-2">
                  {result.findings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
