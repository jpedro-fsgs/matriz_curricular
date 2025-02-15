"use client";

import CursoSelector from "@/components/CursoSelector";
import Grade from "@/components/Grade";

export default function Home() {

  return (
    <div className="bg-background">
      <CursoSelector />
      <Grade />
    </div>
  );
}
