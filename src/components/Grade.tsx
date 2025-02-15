"use client";

import React, { useEffect } from "react";
import DisciplinaCard from "./DisciplinaCard";
import { useMatriz } from "@/context/MatrizContext";
import EstadoSelector from "./EstadoSelector";
import { cursos } from "@/data/CursosData";

function Grade() {
    const { matriz, filterMatriz, curso, completadasCount, definirMatriz, toggleCompletada } = useMatriz();

    useEffect(() => {
        const storedData = localStorage.getItem("matriz");

        if(storedData){
            const parsedData = JSON.parse(storedData);
            definirMatriz(parsedData.cursoIndex, cursos[parsedData.cursoIndex].matriz, parsedData.completadas);
        } else {

            definirMatriz(cursos[0].index, cursos[0].matriz, []);
        }

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
