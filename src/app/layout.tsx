import type { Metadata } from "next";
import "./globals.css";
import { MatrizProvider } from "@/context/MatrizContext";

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
    <html lang="en">
      <body className="antialiased">
        <MatrizProvider>
          {children}
        </MatrizProvider>
      </body>
    </html>
  );
}
