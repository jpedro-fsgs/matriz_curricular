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
                        disciplina.estado == EstadoDisciplina.Disponível &&
                        disciplina.natureza == "OBRIG."
                )
                .sort((a, b) => b.importancia - a.importancia)
        );
    }, [matriz]);

    return (
        <div className="flex justify-center">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="mx-auto">
                        <UnlockIcon className="w-4 h-4" />
                        Disciplinas Disponíveis
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2 space-y-2">
                    {sortedMatriz.length > 0 ? (
                        <>
                            <p className="text-right text-xs">Bloqueia</p>
                            {sortedMatriz.map((disciplina) => (
                                <div
                                    key={disciplina.id}
                                    className="flex justify-between text-sm"
                                >
                                    <span>{disciplina.nome}</span>
                                    {disciplina.importancia > 0 && (
                                        <Badge
                                            className="w-8 h-5 mr-1 text-center flex items-center justify-center"
                                            variant="destructive"
                                        >
                                            {disciplina.importancia}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Nenhuma disciplina disponível.
                        </p>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default DisciplinasInfo;
