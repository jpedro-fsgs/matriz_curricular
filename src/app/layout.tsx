import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MatrizProvider } from "@/context/MatrizContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        <ThemeProvider>
          <MatrizProvider>{children}</MatrizProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
