"use client";

import { useState } from 'react';

interface OcrResponse {
  ocrText: string;
  ocrId: number;
}

export default function FileUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<OcrResponse | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      alert('Nenhum arquivo selecionado.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecione um arquivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:4200/ocr/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Erro ao fazer upload do arquivo.');
      }

      const data: OcrResponse = await res.json();
      setResponse(data);
      alert(`Upload bem-sucedido! OCR ID: ${data.ocrId}`);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao fazer upload do arquivo. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload de Arquivo para OCR</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '10px', padding: '5px 10px' }}>
        Enviar
      </button>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h2>Resposta do Servidor</h2>
          <p><strong>Texto OCR:</strong> {response.ocrText}</p>
          <p><strong>ID OCR:</strong> {response.ocrId}</p>
        </div>
      )}
    </div>
  );
}
