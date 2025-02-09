"use client";

import React, { useEffect } from "react";
import matrizJson from "@/data/matriz.json";
import DisciplinaCard from "./DisciplinaCard";
import { useMatriz } from "@/context/MatrizContext";

function Grade() {
    const { matriz, curso, definirMatriz, toggleCompletada } = useMatriz();

    useEffect(() => {
        definirMatriz("Sistemas de Informação", matrizJson);
    }, []);

    return (
        <div className="mx-auto w-full p-8">
            <h1 className="text-4xl">{curso}</h1>
            <div className="flex flex-wrap gap-5 justify-center">
                {matriz.map((disciplina) => (
                    <DisciplinaCard
                        onClick={() => toggleCompletada(disciplina.id)}
                        key={disciplina.id}
                        disciplina={disciplina}
                    />
                ))}
            </div>
        </div>
    );
}

export default Grade;
