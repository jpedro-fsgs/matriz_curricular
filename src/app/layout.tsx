import type { Metadata } from "next";
import "./globals.css";
import { MatrizProvider } from "@/context/MatrizContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Matriz Curricular UFG",
  description: "Gerenciamento da Matriz Curricular",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <ThemeProvider>
          <MatrizProvider>{children}</MatrizProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
