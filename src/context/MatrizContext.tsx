"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    Completadas,
    Disciplina,
    EstadoDisciplina,
    MatrizJson,
} from "@/types/DisciplinaType";
import { normalizeText } from "@/utils/stringUtils";
import { cursos } from "@/data/CursosData";

type MatrizContextType = {
    curso: string;
    matriz: Disciplina[];
    completadasCount: Completadas;
    filterMatrizObrigatorias: Disciplina[];
    filterMatrizOptativas: Disciplina[];
    setSearch: (search: string) => void;
    setFilterEstado: (estado: EstadoDisciplina) => void;
    definirMatriz: (
        cursoIndex: number,
        matrizJson: MatrizJson,
        storedData: number[]
    ) => void;
    toggleCompletada: (id: number) => void;
};

const MatrizContext = createContext<MatrizContextType | undefined>(undefined);

export function MatrizProvider({ children }: { children: React.ReactNode }) {
    const [matriz, setMatriz] = useState<Disciplina[]>([]);
    const [filterMatrizObrigatorias, setFilterMatrizObrigatorias] = useState<
        Disciplina[]
    >([]);
    const [filterMatrizOptativas, setFilterMatrizOptativas] = useState<
        Disciplina[]
    >([]);
    const [curso, setCurso] = useState<string>("");
    const [cursoIndex, setCursoIndex] = useState<number>(0);
    // const [chOptativas, setChOptativas] = useState<number>(0);
    const [completadasCount, setCompletadasCount] = useState<Completadas>({completadas: 0, total: 0});
    const [search, setSearch] = useState<string>("");
    const [filterEstado, setFilterEstado] = useState<EstadoDisciplina | null>(
        null
    );

    useEffect(() => {
        const storedIndex = localStorage.getItem("cursoIndex");

        if (storedIndex !== null) {
            const parsedIndex = JSON.parse(storedIndex);

            const storedData = localStorage.getItem(`matriz-${parsedIndex}`);

            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
                definirMatriz(
                    parsedIndex,
                    cursos[parsedIndex].matriz,
                    parsedData
                );
                return;
            }
        }

        definirMatriz(0, cursos[0].matriz, []);

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (matriz.length === 0) return;
        const completadas = matriz
            .filter((disciplina) => disciplina.completada)
            .map((disciplina) => disciplina.id);

        localStorage.setItem(
            `matriz-${cursoIndex}`,
            JSON.stringify(completadas)
        );
    }, [matriz, cursoIndex]);

    useEffect(() => {
        localStorage.setItem("cursoIndex", JSON.stringify(cursoIndex));
    }, [cursoIndex]);

    useEffect(() => {
        setFilterMatrizObrigatorias(() => {
            return matriz.filter((disciplina) => {
                const matchesSearch = search
                    ? normalizeText(disciplina.nome).includes(
                          normalizeText(search)
                      )
                    : true;
                const matchesEstado = filterEstado
                    ? disciplina.estado === filterEstado
                    : true;
                return (
                    matchesSearch &&
                    matchesEstado &&
                    disciplina.natureza == "OBRIG."
                );
            });
        });

        setFilterMatrizOptativas(() => {
            return matriz.filter((disciplina) => {
                const matchesSearch = search
                    ? normalizeText(disciplina.nome).includes(
                          normalizeText(search)
                      )
                    : true;
                const matchesEstado = filterEstado
                    ? disciplina.estado === filterEstado
                    : true;
                return (
                    matchesSearch &&
                    matchesEstado &&
                    disciplina.natureza == "OPTAT."
                );
            });
        });
    }, [filterEstado, matriz, search]);

    useEffect(() => {
        const matrizF = matriz.filter((disciplina) => disciplina.natureza === "OBRIG.");
        const obrigatorias = matrizF.reduce((count, disciplina) => {
            return count + (disciplina.completada ? 1 : 0);
        }, 0);

        // const optativas = matriz.filter((disciplina) => disciplina.natureza === "OPTAT.").reduce((count, disciplina) => {
        //     return disciplina.completada ? count + 1 : count;
        // }, 0);
        setCompletadasCount({
            completadas: obrigatorias,
            total: matrizF.length,
        });
    }, [matriz]);

    function definirMatriz(
        cursoNewIndex: number,
        matrizJson: MatrizJson,
        storedData: number[]
    ) {
        setCursoIndex(cursoNewIndex);
        setCurso(matrizJson.nome_curso);
        // setChOptativas(matrizJson.optativas_h);

        const newMatriz: Disciplina[] = [
            ...matrizJson.disciplinas.obrigatorias,
            ...matrizJson.disciplinas.optativas,
        ]
            .sort((a, b) => a.id - b.id)
            .map((disciplina) => ({
                id: disciplina.id,
                nome: disciplina.nome,
                codigo: disciplina.codigo,
                completada: false,
                estado: EstadoDisciplina.Bloqueada,
                importancia: 0,
                preRequisitosId: disciplina.pre_requisitos,
                preRequisitos: [],
                requisitoPara: [],
                disponivel: false,
                ch: parseInt(disciplina.ch.replace("h", "")), 
                nucleo: disciplina.nucleo,
                natureza: disciplina.natureza,
            }));

        if (storedData) {
            storedData.forEach((id) => (newMatriz[id].completada = true));
        }

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
                if(current.natureza == "OPTAT.") continue;
                visited.add(current.id);
                stack.push(...current.requisitoPara);
            }
            disciplina.importancia = visited.size - 1;
        });
    }

    function calcularDisponibilidade(matriz: Disciplina[]) {
        matriz.forEach((disciplina) => {
            const disponivel = disciplina.preRequisitos.every(
                (preRequisito) => preRequisito.completada
            );
            disciplina.disponivel = disponivel;
            disciplina.estado = disciplina.disponivel
                ? disciplina.completada
                    ? EstadoDisciplina.Completada
                    : EstadoDisciplina.Disponível
                : EstadoDisciplina.Bloqueada;
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

            //Seta todos as disciplinas dependentes como não completadas
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
                filterMatrizObrigatorias,
                filterMatrizOptativas,
                setSearch,
                setFilterEstado,
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
