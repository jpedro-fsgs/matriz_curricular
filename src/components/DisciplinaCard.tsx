import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "./ui/card";
import { Disciplina, EstadoDisciplina } from "@/types/DisciplinaType";
import { cn } from "@/lib/utils";
import { BanIcon, CheckCircle2, UnlockIcon } from "lucide-react";
import { Badge } from "./ui/badge";

interface DisciplinaCardTypes {
    disciplina: Disciplina;
    onClick: () => void;
}

function DisciplinaCard({ disciplina, onClick }: DisciplinaCardTypes) {
    return (
        <Card
            onClick={onClick}
            className={cn(
                "w-96 h-96",
                {
                    "cursor-pointer hover:scale-[1.025] hover:bg-primary-foreground":
                        disciplina.disponivel,
                },
                { "opacity-50": !disciplina.disponivel },
                { "border-green-600": disciplina.completada }
            )}
        >
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <p>{disciplina.nome}</p>

                    {disciplina.estado == EstadoDisciplina.Completada ? (
                        <CheckCircle2 color="green" />
                    ) : disciplina.estado == EstadoDisciplina.Bloqueada ? (
                        <BanIcon color="red" />
                    ) : (
                        <UnlockIcon />
                    )}
                </CardTitle>
                <CardDescription className="flex gap-2">
                    <p>{disciplina.estado}</p>
                    {disciplina.natureza == "OPTAT." && (
                        <Badge variant="secondary">OPTATIVA</Badge>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 h-full">
                {!disciplina.completada && disciplina.importancia > 0 && (
                    <p className="text-destructive font-semibold">
                        Bloqueia {disciplina.importancia} disciplina
                        {disciplina.importancia > 1 ? "s" : ""} obrigatória
                        {disciplina.importancia > 1 ? "s" : ""}
                    </p>
                )}

                {disciplina.preRequisitos.length > 0 && (
                    <div>
                        <p className="font-medium">Pré Requisitos:</p>
                        <ul className="list-disc">
                            {disciplina.preRequisitos.map((preRequisito) => (
                                <li
                                    key={`pr-${disciplina.id}-${preRequisito.id}`}
                                    className="ml-4 space-x-1"
                                >
                                    <span className="flex items-center gap-1">
                                        <p>{preRequisito.nome}</p>
                                        {preRequisito.completada && (
                                            <CheckCircle2
                                                color="green"
                                                size="16"
                                            />
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {disciplina.requisitoPara.length > 0 && (
                    <div className="max-h-fit overflow-y-auto">
                        <p className="font-medium">Requisito para:</p>
                        <ul className="list-disc">
                            {disciplina.requisitoPara.map((para) => (
                                <li
                                    key={`rq-${disciplina.id}${para.id}`}
                                    className="ml-4 space-x-1"
                                >
                                    <span className="flex items-center gap-1">
                                        <div className="inline">{para.nome}{para.natureza == "OPTAT." && <Badge variant="secondary" >OPTATIVA</Badge>}</div>
                                        {para.completada && (
                                            <CheckCircle2
                                                className="inline"
                                                color="green"
                                                size="16"
                                            />
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default DisciplinaCard;
