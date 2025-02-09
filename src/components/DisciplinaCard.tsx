import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "./ui/card";
import { Disciplina } from "@/types/DisciplinaType";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircleX } from "lucide-react";

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
                { "opacity-50": !disciplina.disponivel },
                { "border-green-600": disciplina.completada }
            )}
        >
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <p>{disciplina.nome}</p>
                    {disciplina.completada ? (
                        <CheckCircle2 color="green" />
                    ) : (
                        <CircleX color="red" />
                    )}
                </CardTitle>
                <CardDescription>
                    {disciplina.disponivel
                        ? disciplina.completada
                            ? "Completada"
                            : "Pendente"
                        : "Bloqueada"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!disciplina.completada && disciplina.importancia > 0 && (
                    <p className="text-destructive font-semibold">
                        Bloqueia {disciplina.importancia} disciplinas
                    </p>
                )}

                {disciplina.preRequisitos.length > 0 && (
                    <>
                        <p className="font-medium">Pré Requisitos:</p>
                        <ul className="list-disc">
                            {disciplina.preRequisitos.map((preRequisito) => (
                                <li
                                    key={`pr-${disciplina.id}-${preRequisito.id}`}
                                    className="ml-4 space-x-1"
                                >
                                    <span className="flex items-center gap-1"><p>{preRequisito.nome}</p>
                                    {preRequisito.completada && (
                                        <CheckCircle2
                                            color="green"
                                            size="16"
                                        />
                                    )}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {disciplina.requisitoPara.length > 0 && (
                    <>
                        <p className="font-medium">Requisito para:</p>
                        <ul className="list-disc">
                            {disciplina.requisitoPara.map((para) => (
                                <li
                                    key={`rq-${disciplina.id}${para.id}`}
                                    className="ml-4 space-x-1"
                                >
                                    <span className="flex items-center gap-1" ><p className="inline">{para.nome}</p>
                                    {para.completada && (
                                        <CheckCircle2
                                            className="inline"
                                            color="green"
                                            size="16"
                                        />
                                    )}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </CardContent>
            <CardFooter className="block">
                {/* <p>pre req {disciplina.preRequisitos.join(" ")}</p>
                <p>req para {disciplina.requisitoPara.join(" ")}</p> */}
            </CardFooter>
        </Card>
    );
}

export default DisciplinaCard;
