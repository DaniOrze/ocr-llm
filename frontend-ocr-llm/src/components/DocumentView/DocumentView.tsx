"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const { toast } = useToast();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await axios.get<Document>(
          `http://localhost:4200/ocr/view/${documentId}`
        );
        setDocument(response.data);
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
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const padding = 10;
    const imgWidth = pageWidth - padding * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = padding;

    pdf.addImage(imgData, "PNG", padding, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - padding * 2;

    while (heightLeft > 0) {
      pdf.addPage();
      position = padding;
      pdf.addImage(imgData, "PNG", padding, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - padding * 2;
    }

    for (let i = 0; i <= 100; i++) {
      setDownloadProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    pdf.save(`${document?.filename || "documento"}.pdf`);

    toast({
      description: "PDF gerado com sucesso!",
    });
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
    toast({
      description: error,
      variant: "destructive",
    });
    return null;
  }

  if (!document) {
    toast({
      description: "Documento não encontrado",
      variant: "destructive",
    });
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
