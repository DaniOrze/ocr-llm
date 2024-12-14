"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  
    pdf.save(`${document?.filename || "documento"}.pdf`);
  };
  
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!document) {
    return <div>Documento não encontrado</div>;
  }

  return (
    <div>
      <div ref={contentRef}>
        <h1>{document.filename}</h1>
        <p>
          <strong>ID:</strong> {document.id}
        </p>
        <p>
          <strong>Caminho do Arquivo:</strong> {document.filepath}
        </p>
        <h2>Resultados OCR:</h2>
        {document.ocrResults.map((ocr, index) => (
          <div key={index}>
            <h3>Resultado {index + 1}</h3>
            <p>
              <strong>Texto:</strong> {ocr.text}
            </p>
            <p>
              <strong>Criado em:</strong> {ocr.createdAt}
            </p>
            <h4>Resultados do LLM:</h4>
            {ocr.llmResults.length > 0 ? (
              ocr.llmResults.map((llm, llmIndex) => (
                <div key={llmIndex}>
                  <p>
                    <strong>Pergunta:</strong> {llm.question}
                  </p>
                  <p>
                    <strong>Resposta:</strong> {llm.response}
                  </p>
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
      <button onClick={handleDownloadPdf}>Salvar como PDF</button>
    </div>
  );
}
