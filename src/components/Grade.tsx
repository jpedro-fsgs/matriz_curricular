"use client";

import React from "react";
import DisciplinaCard from "./DisciplinaCard";
import { useMatriz } from "@/context/MatrizContext";
import EstadoSelector from "./EstadoSelector";
import DisciplinasInfo from "./DisciplinasInfo";

function Grade() {
    const {
        matriz,
        filterMatriz,
        curso,
        completadasCount,
        toggleCompletada,
    } = useMatriz();

    return (
        <div className="mx-auto w-full p-8">
            <h1 className="text-4xl text-center p-8">
                {curso} ({completadasCount}/{matriz.length})
            </h1>
            <DisciplinasInfo />
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
