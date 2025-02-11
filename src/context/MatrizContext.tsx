"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Disciplina, DisciplinaJson } from "@/types/DisciplinaType";

type MatrizContextType = {
    curso: string;
    matriz: Disciplina[];
    completadasCount: number;
    definirMatriz: (nomeCurso: string, matrizJson: DisciplinaJson[]) => void;
    toggleCompletada: (id: number) => void;
};

const MatrizContext = createContext<MatrizContextType | undefined>(undefined);

export function MatrizProvider({ children }: { children: React.ReactNode }) {
    const [matriz, setMatriz] = useState<Disciplina[]>([]);
    const [curso, setCurso] = useState<string>("");
    const [completadasCount, setCompletadasCount] = useState(0);

    useEffect(() => {
        setCompletadasCount(
            matriz.reduce((count, disciplina) => {
                return count + (disciplina.completada ? 1 : 0);
            }, 0)
        );
    }, [matriz]);

    function definirMatriz(nomeCurso: string, matrizJson: DisciplinaJson[]) {
        setCurso(nomeCurso);

        const newMatriz: Disciplina[] = matrizJson.map((disciplina) => ({
            id: disciplina.id - 1,
            nome: disciplina.nome,
            completada: false,
            importancia: 0,
            unidadeResponsavel: disciplina.unidade_responsavel,
            preRequisitosId: disciplina.pre_requisitos.map((id) => id - 1),
            preRequisitos: [],
            requisitoPara: [],
            disponivel: false,
            chTeorica: disciplina.ch_teorica,
            chPratica: disciplina.ch_pratica,
            cht: disciplina.cht,
            nucleo: disciplina.nucleo,
            natureza: disciplina.natureza,
        }));

        atualizarRequisitos(newMatriz);
        calcularDisponibilidade(newMatriz);
        calcularImportancia(newMatriz);
        setMatriz(newMatriz);
    }

    function atualizarRequisitos(matriz: Disciplina[]) {
        matriz.forEach((disciplina) => {
            disciplina.preRequisitos.length = 0;
            disciplina.requisitoPara.length = 0;
            disciplina.preRequisitosId.forEach((id) => {
                disciplina.preRequisitos.push(matriz[id]);
                matriz[id].requisitoPara.push(disciplina);
            });
        });
    }

    function calcularImportancia(matriz: Disciplina[]) {
        matriz.forEach((disciplina) => {
            const stack: Disciplina[] = [];
            const visited = new Set<number>();
            stack.push(disciplina);

            while (stack.length > 0) {
                const current = stack.pop()!;
                visited.add(current.id);
                current.requisitoPara.forEach((reqPara) => stack.push(reqPara));
            }
            disciplina.importancia = visited.size - 1;
        });
    }

    function calcularDisponibilidade(matriz: Disciplina[]) {
        matriz.forEach((disciplina) => {
            disciplina.disponivel = disciplina.preRequisitos.every(
                (preRequisito) => preRequisito.completada
            );
        });
    }

    function toggleCompletada(id: number) {
        if (!matriz[id].disponivel) {
            return;
        }

        setMatriz((matriz) => {
            const newMatriz = matriz.map((disciplina: Disciplina) => ({
                ...disciplina,
            }));
            newMatriz[id].completada = !newMatriz[id].completada;

            atualizarRequisitos(newMatriz);

            //Seta todos as disciplinas dependentes como falso
            if (!newMatriz[id].completada) {
                const queue = [...newMatriz[id].requisitoPara];
                while (queue.length > 0) {
                    const current = queue.shift()!;

                    current.completada = false;
                    queue.push(...current.requisitoPara);
                }
            }

            calcularDisponibilidade(newMatriz);
            calcularImportancia(newMatriz);
            return newMatriz;
        });
    }

    return (
        <MatrizContext.Provider
            value={{
                curso,
                matriz,
                completadasCount,
                definirMatriz,
                toggleCompletada,
            }}
        >
            {children}
        </MatrizContext.Provider>
    );
}

export function useMatriz() {
    const context = useContext(MatrizContext);
    if (!context) {
        throw new Error("useMatriz deve ser usado dentro de um MatrizProvider");
    }
    return context;
}
