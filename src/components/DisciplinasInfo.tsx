"use client";

import { useMatriz } from "@/context/MatrizContext";
import { EstadoDisciplina } from "@/types/DisciplinaType";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { ChevronDown, UnlockIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

function DisciplinasInfo() {
    const { matriz } = useMatriz();

    const [sortedMatriz, setSortedMatriz] = useState(matriz);

    useEffect(() => {
        setSortedMatriz(() =>
            [...matriz]
                .filter(
                    (disciplina) =>
                        disciplina.estado === EstadoDisciplina.Disponível &&
                        disciplina.natureza === "OBRIG."
                )
                .sort((a, b) => b.importancia - a.importancia)
        );
    }, [matriz]);

    return (
        <div className="flex justify-center">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="mx-auto gap-2">
                        <UnlockIcon className="w-4 h-4 text-muted-foreground" />
                        <span>Disciplinas Disponíveis</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3 space-y-2 max-h-80 overflow-y-auto">
                    {sortedMatriz.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center pb-1 border-b text-xs text-muted-foreground">
                                <span>Disciplina</span>
                                <span>Bloqueia</span>
                            </div>
                            {sortedMatriz.map((disciplina) => (
                                <div
                                    key={disciplina.id}
                                    className="flex justify-between items-center text-sm py-1 gap-2"
                                >
                                    <span className="truncate">{disciplina.nome}</span>
                                    {disciplina.importancia > 0 && (
                                        <Badge
                                            className="h-5 px-1.5 text-center flex items-center justify-center shrink-0"
                                            variant="destructive"
                                        >
                                            {disciplina.importancia}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-2">
                            Nenhuma disciplina disponível.
                        </p>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default DisciplinasInfo;
