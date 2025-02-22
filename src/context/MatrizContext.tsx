"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    Disciplina,
    DisciplinaJson,
    EstadoDisciplina,
} from "@/types/DisciplinaType";
import { cursos } from "@/data/CursosData";
import { normalizeText } from "@/utils/stringUtils";

type MatrizContextType = {
    curso: string;
    matriz: Disciplina[];
    completadasCount: number;
    filterMatriz: Disciplina[];
    setSearch: (search: string) => void;
    setFilterEstado: (estado: EstadoDisciplina) => void;
    definirMatriz: (
        cursoIndex: number,
        matrizJson: DisciplinaJson[],
        storedData: number[]
    ) => void;
    toggleCompletada: (id: number) => void;
};



const MatrizContext = createContext<MatrizContextType | undefined>(undefined);

export function MatrizProvider({ children }: { children: React.ReactNode }) {
    const [matriz, setMatriz] = useState<Disciplina[]>([]);
    const [filterMatriz, setFilterMatriz] = useState<Disciplina[]>([]);
    const [curso, setCurso] = useState<string>("");
    const [cursoIndex, setCursoIndex] = useState<number>(0);
    const [completadasCount, setCompletadasCount] = useState(0);
    const [search, setSearch] = useState<string>("");
    const [filterEstado, setFilterEstado] = useState<EstadoDisciplina | null>(
        null
    );

    useEffect(() => {
        const completadas = matriz
            .filter((disciplina) => disciplina.completada)
            .map((disciplina) => disciplina.id);
        localStorage.setItem("matriz", JSON.stringify({ cursoIndex, completadas }));
    }, [matriz, cursoIndex]);

    useEffect(() => {
        setFilterMatriz(() => {
            return matriz.filter((disciplina) => {
                const matchesSearch = search
                    ? normalizeText(disciplina.nome).includes(normalizeText(search))
                    : true;
                const matchesEstado = filterEstado
                    ? disciplina.estado === filterEstado
                    : true;
                return matchesSearch && matchesEstado;
            });
        });
    }, [filterEstado, matriz, search]);

    useEffect(() => {
        setCompletadasCount(
            matriz.reduce((count, disciplina) => {
                return count + (disciplina.completada ? 1 : 0);
            }, 0)
        );
    }, [matriz]);

    function definirMatriz(
        cursoIndex: number,
        matrizJson: DisciplinaJson[],
        storedData: number[]
    ) {
        setCursoIndex(cursoIndex)
        setCurso(cursos[cursoIndex].nome);

        const newMatriz: Disciplina[] = matrizJson.map((disciplina) => ({
            id: disciplina.id - 1,
            nome: disciplina.nome,
            completada: false,
            estado: EstadoDisciplina.Bloqueada,
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

        if (storedData) {
            storedData.forEach(
                (id) => (newMatriz[id].completada = true)
            );
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
                filterMatriz,
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
