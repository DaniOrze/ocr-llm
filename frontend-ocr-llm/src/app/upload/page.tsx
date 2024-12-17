"use client";

import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface OcrResponse {
  ocrText: string;
  ocrId: number;
}

export default function FileUploadPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<OcrResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <p>Verificando autenticação...</p>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      toast({
        description: "Nenhum arquivo selecionado.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        description: "Por favor, selecione um arquivo.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const token = Cookies.get("token");

      console.log(token);

      if (!token) {
        toast({
          description: "Usuário não autenticado. Faça login novamente.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/ocr/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erro ao fazer upload do arquivo.");
      }

      const data: OcrResponse = await res.json();
      setResponse(data);
      toast({
        description: `Upload bem-sucedido! OCR ID: ${data.ocrId}`,
      });
    } catch (error) {
      console.error("Erro:", error);
      toast({
        description:
          "Erro ao fazer upload do arquivo. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-4 mb-4 rounded-lg shadow-md">
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-semibold text-center mb-6 custom-font">
            OCR Transcrito
          </h1>

          <div className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2"
            />
            <Button
              onClick={handleUpload}
              color="primary"
              className="w-full mt-4"
              disabled={uploading}
            >
              {uploading ? "Enviando..." : "Enviar"}
            </Button>
          </div>

          {uploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} />
              <p>Progresso do Upload: {uploadProgress}%</p>
            </div>
          )}

          {response && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold">Resposta do Servidor</h2>
              <div>
                <strong>Texto OCR:</strong>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response.ocrText}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
