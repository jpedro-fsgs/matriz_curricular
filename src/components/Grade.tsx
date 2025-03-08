"use client";

import React from "react";
import DisciplinaCard from "./DisciplinaCard";
import { useMatriz } from "@/context/MatrizContext";
import EstadoSelector from "./EstadoSelector";
import DisciplinasInfo from "./DisciplinasInfo";
import { Progress } from "./ui/progress";

function Grade() {
    const {
        filterMatrizObrigatorias,
        filterMatrizOptativas,
        curso,
        completadasCount,
        toggleCompletada,
    } = useMatriz();

    return (
        <div className="mx-auto w-full p-8">
            <h1 className="text-4xl text-center p-8">
                {curso} ({completadasCount.completadas}/{completadasCount.total})
            </h1>
            <Progress className="w-11/12 md:w-3/4 mx-auto mb-6" value={completadasCount.completadas/completadasCount.total * 100} />
            <DisciplinasInfo />
            <EstadoSelector />

            <h2 className="rounded-xl p-3 m-4 text-2xl text-secondary-foreground bg-secondary">Obrigatórias</h2>
            <div className="flex flex-wrap gap-5 justify-center">
                {filterMatrizObrigatorias.map((disciplina) => (
                    <DisciplinaCard
                        onClick={() => toggleCompletada(disciplina.id)}
                        key={disciplina.id}
                        disciplina={disciplina}
                    />
                ))}
            </div>
            <h2 className="rounded-xl p-3 m-4 text-2xl text-secondary-foreground bg-secondary">Optativas</h2>
            <div className="flex flex-wrap gap-5 justify-center">
                {filterMatrizOptativas.map((disciplina) => (
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
