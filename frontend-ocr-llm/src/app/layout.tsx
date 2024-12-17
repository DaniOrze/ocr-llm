import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/context/AuthContext";

export const metadata = {
  title: "OCR LLM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="h-full w-full bg-gray-100">
              <SidebarTrigger />
              {children}
            </main>
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}