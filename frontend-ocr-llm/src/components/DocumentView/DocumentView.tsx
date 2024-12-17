"use client";

import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";

interface OcrResult {
  text: string;
  createdAt: string;
  llmResults: { question: string; response: string; createdAt: string }[];
}

interface Document {
  id: number;
  filename: string;
  filepath: string;
  ocrResults: OcrResult[];
}

export default function DocumentView({ documentId }: { documentId: string }) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchDocument() {
      try {


        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const fileUrl = `${apiUrl}/ocr/view/${documentId}`;

        const response = await fetch(
          fileUrl,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar documento");
        }

        const data: Document = await response.json();
        setDocument(data);
        setLoading(false);
      } catch {
        setError("Erro ao carregar documento");
        setLoading(false);
      }
    }

    fetchDocument();
  }, [documentId]);

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;

    const element = contentRef.current;

    // Configurações do html2pdf
    const options = {
      margin: 10,
      filename: `${document?.filename || "documento"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Inicia o processo de download do PDF
    setDownloadProgress(1);
    await html2pdf().set(options).from(element).save();
    setDownloadProgress(0);
  };

  if (loading) {
    return (
      <div className="p-4">
        <Progress value={50} />
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!document) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="p-6 space-y-6">
        <div ref={contentRef} className="space-y-4">
          <h1 className="text-3xl font-bold">{document.filename}</h1>
          <h2 className="text-2xl font-semibold">Resultados OCR:</h2>
          {document.ocrResults.map((ocr, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-semibold">Resultado {index + 1}</h3>
              <div>
                <strong>Texto:</strong>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {ocr.text}
                </ReactMarkdown>
              </div>
              <p>
                <strong>Criado em:</strong> {ocr.createdAt}
              </p>
              <h4 className="text-lg font-medium">Resultados do LLM:</h4>
              {ocr.llmResults.length > 0 ? (
                ocr.llmResults.map((llm, llmIndex) => (
                  <div key={llmIndex} className="space-y-2">
                    <p>
                      <strong>Pergunta:</strong> {llm.question}
                    </p>
                    <div>
                      <strong>Resposta:</strong>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {llm.response}
                      </ReactMarkdown>
                    </div>
                    <p>
                      <strong>Criado em:</strong> {llm.createdAt}
                    </p>
                  </div>
                ))
              ) : (
                <p>Sem resultados do LLM.</p>
              )}
            </div>
          ))}
        </div>
        <Button
          onClick={handleDownloadPdf}
          color="primary"
          className="w-full mt-4"
        >
          Salvar como PDF
        </Button>
        {downloadProgress > 0 && downloadProgress < 100 && (
          <Progress value={downloadProgress} className="mt-4" />
        )}
      </div>
    </div>
  );
}