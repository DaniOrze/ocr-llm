"use client";

import { useState } from 'react';
import axios from 'axios';

interface OcrUploadResponse {
  ocrId: number;
}

export default function OcrChatPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrId, setOcrId] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return alert('Por favor, selecione um arquivo!');

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post<OcrUploadResponse>('http://localhost:4200/ocr/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setOcrId(response.data.ocrId);
      setChatHistory([]);
      alert('Arquivo processado com sucesso! Agora você pode fazer perguntas.');
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      alert('Ocorreu um erro ao processar o arquivo.');
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!ocrId) return alert('Por favor, envie um arquivo antes de fazer perguntas!');

    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post<{ response: string }>('http://localhost:4200/llm/ask', {
        question,
        ocrId,
      });

      setChatHistory((prev) => [
        ...prev,
        { role: 'user', text: question },
        { role: 'llm', text: response.data.response },
      ]);

      setQuestion('');
    } catch (error) {
      console.error('Erro ao fazer pergunta:', error);
      alert('Ocorreu um erro ao fazer a pergunta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>OCR Chat</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile} disabled={loading || !selectedFile}>
          {loading ? 'Processando...' : 'Enviar Arquivo'}
        </button>
      </div>

      {ocrId && (
        <div>
          <h2>Chat</h2>
          <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {chatHistory.map((entry, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <strong>{entry.role === 'user' ? 'Você' : 'LLM'}:</strong> {entry.text}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Faça sua pergunta"
            style={{ width: '80%', padding: '10px' }}
          />
            <button onClick={askQuestion} disabled={loading} style={{ padding: '10px 20px' }}>
              Perguntar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
