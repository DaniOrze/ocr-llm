"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface OcrUploadResponse {
  ocrId: number;
}

export default function OcrChatPage() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrId, setOcrId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/auth/signin");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <p>Verificando autenticação...</p>;
  }

  const uploadFile = async () => {
    if (!selectedFile) {
      toast({
        description: "Por favor, selecione um arquivo!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/ocr/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erro ao fazer upload do arquivo");
      }

      const data: OcrUploadResponse = await res.json();
      const uploadedOcrId = data.ocrId;

      setOcrId(uploadedOcrId);
      setChatHistory([]);
      toast({
        description: "Arquivo processado com sucesso! Buscando explicação...",
      });

      await fetchExplanation(uploadedOcrId);
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      toast({
        description: "Ocorreu um erro ao processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExplanation = async (ocrId: number) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/llm/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ocrId }),
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar explicação");
      }

      const data = await res.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Erro ao buscar explicação:", error);
      toast({
        description: "Ocorreu um erro ao buscar a explicação.",
        variant: "destructive",
      });
    }
  };

  const askQuestion = async () => {
    if (!ocrId) {
      toast({
        description: "Por favor, envie um arquivo antes de fazer perguntas!",
        variant: "destructive",
      });
      return;
    }
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/llm/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question, ocrId }),
      });

      if (!res.ok) {
        throw new Error("Erro ao fazer pergunta");
      }

      const data = await res.json();

      setChatHistory((prev) => [
        ...prev,
        { role: "user", text: question },
        { role: "llm", text: data.response },
      ]);

      setQuestion("");
    } catch (error) {
      console.error("Erro ao fazer pergunta:", error);
      toast({
        description: "Ocorreu um erro ao fazer a pergunta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-4 mb-5 rounded-lg shadow-md">
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-semibold text-center mb-6 custom-font">
            OCR Chat
          </h1>

          <div className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2"
            />
            <Button
              onClick={uploadFile}
              color="primary"
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </div>

          {explanation && (
            <div className="bg-gray-200 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold mb-2">Contexto do Texto:</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {explanation}
              </ReactMarkdown>
            </div>
          )}

          {ocrId && (
            <div className="flex flex-col h-96 overflow-hidden">
              <div
                className="flex-1 overflow-y-scroll border border-gray-300 p-4 rounded-lg shadow-md mb-4"
                style={{ maxHeight: "400px" }}
              >
                {chatHistory.map((entry, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      entry.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block py-2 px-4 rounded-lg max-w-xs ${
                        entry.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      <strong>{entry.role === "user" ? "Você" : "LLM"}:</strong>{" "}
                      {entry.role === "llm" ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {entry.text}
                        </ReactMarkdown>
                      ) : (
                        entry.text
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Faça sua pergunta"
                disabled={loading}
              />
              <Button
                className="mb-3 mt-3"
                onClick={askQuestion}
                disabled={loading}
              >
                Perguntar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
