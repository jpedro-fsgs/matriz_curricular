"use client";

import React, { useState } from "react";
import DisciplinaCard from "./DisciplinaCard";
import { useMatriz } from "@/context/MatrizContext";
import EstadoSelector from "./EstadoSelector";
import DisciplinasInfo from "./DisciplinasInfo";
import { Progress } from "./ui/progress";
import { ConfirmDialog } from "./ConfirmDialog";
import { Disciplina } from "@/types/DisciplinaType";

function Grade() {
    const {
        filterMatrizObrigatorias,
        filterMatrizOptativas,
        curso,
        completadasCount,
        toggleCompletada,
        forcarCompletada,
    } = useMatriz();

    const [confirmState, setConfirmState] = useState<{
        open: boolean;
        disciplina: Disciplina | null;
        action: "quebra" | "desmarcar";
    }>({ open: false, disciplina: null, action: "quebra" });

    const handleRequestQuebra = (disciplina: Disciplina) => {
        setConfirmState({ open: true, disciplina, action: "quebra" });
    };

    const handleRequestDesmarcar = (disciplina: Disciplina) => {
        setConfirmState({ open: true, disciplina, action: "desmarcar" });
    };

    const progressPercentage =
        completadasCount.total > 0
            ? (completadasCount.completadas / completadasCount.total) * 100
            : 0;

    return (
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 md:px-8 py-4 md:py-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center py-4 md:py-6 text-foreground">
                {curso}{" "}
                <span className="text-muted-foreground font-normal text-lg sm:text-2xl">
                    ({completadasCount.completadas}/{completadasCount.total})
                </span>
            </h1>

            <Progress
                className="w-full sm:w-11/12 md:w-3/4 mx-auto mb-6"
                value={progressPercentage}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
                <DisciplinasInfo />
            </div>

            <EstadoSelector />

            <section className="mt-6">
                <div className="rounded-xl p-3 my-4 bg-secondary flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-secondary-foreground">
                        Obrigatórias
                    </h2>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                        {filterMatrizObrigatorias.length} disciplina
                        {filterMatrizObrigatorias.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {filterMatrizObrigatorias.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                        {filterMatrizObrigatorias.map((disciplina) => (
                            <DisciplinaCard
                                key={disciplina.id}
                                disciplina={disciplina}
                                onToggle={() => toggleCompletada(disciplina.id)}
                                onForcar={() => forcarCompletada(disciplina.id)}
                                onRequestQuebra={handleRequestQuebra}
                                onRequestDesmarcar={handleRequestDesmarcar}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-muted-foreground text-sm">
                        Nenhuma disciplina obrigatória encontrada com os filtros atuais.
                    </p>
                )}
            </section>

            <section className="mt-8">
                <div className="rounded-xl p-3 my-4 bg-secondary flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-secondary-foreground">
                        Optativas
                    </h2>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                        {filterMatrizOptativas.length} disciplina
                        {filterMatrizOptativas.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {filterMatrizOptativas.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                        {filterMatrizOptativas.map((disciplina) => (
                            <DisciplinaCard
                                key={disciplina.id}
                                disciplina={disciplina}
                                onToggle={() => toggleCompletada(disciplina.id)}
                                onForcar={() => forcarCompletada(disciplina.id)}
                                onRequestQuebra={handleRequestQuebra}
                                onRequestDesmarcar={handleRequestDesmarcar}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-muted-foreground text-sm">
                        Nenhuma disciplina optativa encontrada com os filtros atuais.
                    </p>
                )}
            </section>

            <ConfirmDialog
                open={confirmState.open}
                onOpenChange={(open) => {
                    setConfirmState((prev) => ({ ...prev, open }));
                }}
                title={
                    confirmState.action === "quebra"
                        ? "Quebra de Requisito"
                        : "Desmarcar Disciplina"
                }
                description={
                    confirmState.action === "quebra"
                        ? `Tem certeza que deseja marcar "${confirmState.disciplina?.nome}" como completada? Esta disciplina possui pré-requisitos não concluídos.`
                        : `Tem certeza que deseja desmarcar "${confirmState.disciplina?.nome}"? Todas as disciplinas dependentes dela também serão desmarcadas.`
                }
                onConfirm={() => {
                    if (!confirmState.disciplina) return;
                    if (confirmState.action === "quebra") {
                        forcarCompletada(confirmState.disciplina.id);
                    } else {
                        if (confirmState.disciplina.quebraRequisito) {
                            forcarCompletada(confirmState.disciplina.id);
                        } else {
                            toggleCompletada(confirmState.disciplina.id);
                        }
                    }
                }}
                variant={confirmState.action === "quebra" ? "default" : "destructive"}
                confirmLabel={
                    confirmState.action === "quebra" ? "Confirmar Quebra" : "Desmarcar"
                }
            />
        </div>
    );
}

export default Grade;
