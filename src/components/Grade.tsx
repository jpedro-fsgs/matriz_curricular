"use client";

import React, { useEffect } from "react";
import matrizJson from "@/data/matrizSI.json";
import DisciplinaCard from "./DisciplinaCard";
import { useMatriz } from "@/context/MatrizContext";
import EstadoSelector from "./EstadoSelector";

function Grade() {
    const { matriz, filterMatriz, curso, completadasCount, definirMatriz, toggleCompletada } = useMatriz();

    useEffect(() => {
        definirMatriz("Sistemas de Informação", matrizJson);
        // eslint-disable-next-line
    }, []);

    return (
        <div className="mx-auto w-full p-8">
            <h1 className="text-4xl text-center p-8">{curso} ({completadasCount}/{matriz.length})</h1>
            <EstadoSelector />
            <div className="flex flex-wrap gap-5 justify-center">
                {filterMatriz.map((disciplina) => (
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
