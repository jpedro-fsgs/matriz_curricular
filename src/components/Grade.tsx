"use client";

import React, { useEffect } from "react";
import matrizJson from "@/data/matriz.json";
import DisciplinaCard from "./DisciplinaCard";
import { useMatriz } from "@/context/MatrizContext";

function Grade() {
    const { matriz, curso, completadasCount, definirMatriz, toggleCompletada } = useMatriz();

    useEffect(() => {
        definirMatriz("Sistemas de Informação", matrizJson);
        // eslint-disable-next-line
    }, []);

    return (
        <div className="mx-auto w-full p-8">
            <h1 className="text-4xl text-center mt-8 mb-16">{curso} ({completadasCount}/{matriz.length})</h1>
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
