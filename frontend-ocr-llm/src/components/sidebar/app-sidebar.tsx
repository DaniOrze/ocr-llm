"use client";

import { useEffect, useState } from "react";
import { BotMessageSquare, HardDriveUpload } from "lucide-react";
import axios from "axios";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface OcrResult {
  text: string;
  createdAt: string;
  llmResults: { question: string; response: string; createdAt: string }[];
}

interface UploadedFile {
  id: number;
  filename: string;
  filepath: string;
  ocrResults: OcrResult[];
}

const items = [
  {
    title: "Chat",
    url: "/",
    icon: BotMessageSquare,
  },
  {
    title: "Upload",
    url: "/upload",
    icon: HardDriveUpload,
  },
];

export function AppSidebar() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await axios.get<UploadedFile[]>("http://localhost:4200/ocr/view");
        setFiles(response.data);
      } catch (error) {
        console.error("Erro ao carregar documentos", error);
      }
    }

    fetchFiles();
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>OCR LLM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarGroup>
                <SidebarGroupLabel>Lista de Arquivos</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {files.length === 0 ? (
                      <SidebarMenuItem>
                        <span>Sem arquivos</span>
                      </SidebarMenuItem>
                    ) : (
                      files.map((file) => (
                        <SidebarMenuItem key={file.id}>
                          <SidebarMenuButton asChild>
                            <a href={`/files/${file.id}`}>
                              <span>{file.filename}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
