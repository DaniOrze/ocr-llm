"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { BotMessageSquare, HardDriveUpload, LogOut } from "lucide-react";
import Cookies from "js-cookie";
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
    title: "Transcrever OCR",
    url: "/upload",
    icon: HardDriveUpload,
  },
];

export function AppSidebar() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      async function fetchFiles() {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/ocr/view", {
            method: "GET",
            credentials: "include",
          });

          if (!response.ok) {
            setFiles([]);
            return;
          }

          const data: UploadedFile[] = await response.json();

          if (!data || data.length === 0) {
            setFiles([]);
          } else {
            setFiles(data);
          }
        } catch (error) {
          console.error("Erro ao carregar documentos", error);
          setFiles([]);
        }
      }

      fetchFiles();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    window.location.href = "/auth/login";
  };

  if (!isAuthenticated) {
    return null;
  }

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
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
      </SidebarContent>
    </Sidebar>
  );
}