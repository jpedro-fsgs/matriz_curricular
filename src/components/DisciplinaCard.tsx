"use client";

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
import {
    AlertTriangle,
    BanIcon,
    CheckCircle2,
    EllipsisVertical,
    Undo2,
    UnlockIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DisciplinaCardTypes {
    disciplina: Disciplina;
    onToggle: () => void;
    onForcar: () => void;
    onRequestQuebra: (disciplina: Disciplina) => void;
    onRequestDesmarcar: (disciplina: Disciplina) => void;
}

function DisciplinaCard({
    disciplina,
    onToggle,
    onForcar,
    onRequestQuebra,
    onRequestDesmarcar,
}: DisciplinaCardTypes) {

    function temDependentesCompletadas(): boolean {
        const queue = [...disciplina.requisitoPara];
        const visited = new Set<number>();
        while (queue.length > 0) {
            const current = queue.shift()!;
            if (visited.has(current.id)) continue;
            visited.add(current.id);
            if (current.completada) return true;
            queue.push(...current.requisitoPara);
        }
        return false;
    }

    function handleClick() {
        if (disciplina.disponivel && !disciplina.completada) {
            onToggle();
        } else if (disciplina.completada) {
            if (!temDependentesCompletadas()) {
                if (disciplina.quebraRequisito) {
                    onForcar();
                } else {
                    onToggle();
                }
            } else {
                onRequestDesmarcar(disciplina);
            }
        }
    }

    return (
        <Card
                onClick={handleClick}
                className={cn(
                    "w-full min-h-[14rem] h-auto flex flex-col justify-between transition-all duration-200",
                    {
                        "cursor-pointer hover:scale-[1.01] hover:bg-primary-foreground/40":
                            (disciplina.disponivel && !disciplina.completada) ||
                            disciplina.completada,
                    },
                    { "opacity-60": !disciplina.disponivel && !disciplina.completada },
                    { "border-green-600 dark:border-green-500": disciplina.completada }
                )}
            >
                <div>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex justify-between items-start gap-2">
                            <span className="text-base md:text-lg font-semibold leading-tight">
                                {disciplina.nome}
                            </span>

                            <div className="flex items-center gap-1 shrink-0">
                                {disciplina.estado === EstadoDisciplina.Completada ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : disciplina.estado === EstadoDisciplina.Bloqueada ? (
                                    <BanIcon className="h-5 w-5 text-destructive" />
                                ) : (
                                    <UnlockIcon className="h-5 w-5 text-muted-foreground" />
                                )}

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                            onClick={(e) => e.stopPropagation()}
                                            aria-label="Opções da disciplina"
                                        >
                                            <EllipsisVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {disciplina.disponivel && !disciplina.completada && (
                                            <DropdownMenuItem
                                                onSelect={onToggle}
                                            >
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                                                Marcar como completada
                                            </DropdownMenuItem>
                                        )}
                                        {disciplina.completada && (
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    if (!temDependentesCompletadas()) {
                                                        if (disciplina.quebraRequisito) {
                                                            onForcar();
                                                        } else {
                                                            onToggle();
                                                        }
                                                    } else {
                                                        onRequestDesmarcar(disciplina);
                                                    }
                                                }}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Undo2 className="mr-2 h-4 w-4" />
                                                Desmarcar completada
                                            </DropdownMenuItem>
                                        )}
                                        {!disciplina.disponivel && !disciplina.completada && (
                                            <DropdownMenuItem
                                                onSelect={() => onRequestQuebra(disciplina)}
                                                className="text-amber-600 dark:text-amber-400 focus:text-amber-600"
                                            >
                                                <AlertTriangle className="mr-2 h-4 w-4" />
                                                Completar (quebra de requisito)
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                            <span className="font-mono font-medium">{disciplina.codigo}</span>
                            <span>•</span>
                            <span>{disciplina.estado}</span>
                            <span>•</span>
                            <span>{disciplina.ch}h</span>
                            {disciplina.quebraRequisito && (
                                <Badge
                                    variant="outline"
                                    className="border-amber-500 text-amber-600 dark:text-amber-400 text-[10px] px-1.5 py-0"
                                >
                                    Quebra de requisito
                                </Badge>
                            )}
                            {disciplina.natureza === "OPTAT." && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    OPTATIVA
                                </Badge>
                            )}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm pt-0">
                        {!disciplina.completada && disciplina.importancia > 0 && (
                            <p className="text-destructive text-xs font-semibold">
                                Bloqueia {disciplina.importancia} disciplina
                                {disciplina.importancia > 1 ? "s" : ""} obrigatória
                                {disciplina.importancia > 1 ? "s" : ""}
                            </p>
                        )}

                        {disciplina.preRequisitos.length > 0 && (
                            <div>
                                <p className="font-medium text-xs text-muted-foreground mb-1">
                                    Pré-requisitos:
                                </p>
                                <ul className="space-y-1">
                                    {disciplina.preRequisitos.map((preRequisito) => (
                                        <li
                                            key={`pr-${disciplina.id}-${preRequisito.id}`}
                                            className="flex items-center gap-1.5 text-xs"
                                        >
                                            <span className="text-muted-foreground">•</span>
                                            <span className="truncate">{preRequisito.nome}</span>
                                            {preRequisito.completada && (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400 shrink-0" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {disciplina.requisitoPara.length > 0 && (
                            <div>
                                <p className="font-medium text-xs text-muted-foreground mb-1">
                                    Requisito para:
                                </p>
                                <ul className="space-y-1 max-h-36 overflow-y-auto pr-1">
                                    {disciplina.requisitoPara.map((para) => (
                                        <li
                                            key={`rq-${disciplina.id}-${para.id}`}
                                            className="flex items-center gap-1.5 text-xs"
                                        >
                                            <span className="text-muted-foreground">•</span>
                                            <span className="truncate">{para.nome}</span>
                                            {para.natureza === "OPTAT." && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[9px] px-1 py-0"
                                                >
                                                    OPT
                                                </Badge>
                                            )}
                                            {para.completada && (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400 shrink-0" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </div>
        </Card>
    );
}

export default DisciplinaCard;
