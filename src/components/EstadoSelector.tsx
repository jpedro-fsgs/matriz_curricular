"use client";

import React from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { BanIcon, CheckCircle2Icon, UnlockIcon } from "lucide-react";
import { useMatriz } from "@/context/MatrizContext";
import { EstadoDisciplina } from "@/types/DisciplinaType";

function EstadoSelector() {
    const { setFilterEstado } = useMatriz();

    function handleChange(key: string) {
        setFilterEstado(
            EstadoDisciplina[key as keyof typeof EstadoDisciplina] || null
        );
    }

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-2 sm:py-4">
            <span className="text-sm font-medium text-muted-foreground">Filtrar:</span>
            <ToggleGroup
                onValueChange={handleChange}
                className="gap-2"
                variant="outline"
                type="single"
            >
                <ToggleGroupItem
                    value="Disponível"
                    aria-label="Toggle Disponível"
                    className="border border-transparent data-[state=on]:border-primary flex items-center gap-1.5 px-3 py-1.5"
                >
                    <UnlockIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="hidden sm:inline text-xs sm:text-sm">Disponível</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="Bloqueada"
                    aria-label="Toggle Bloqueada"
                    className="border border-transparent data-[state=on]:border-primary flex items-center gap-1.5 px-3 py-1.5"
                >
                    <BanIcon className="h-4 w-4 text-destructive" />
                    <span className="hidden sm:inline text-xs sm:text-sm">Bloqueada</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="Completada"
                    aria-label="Toggle Completada"
                    className="border border-transparent data-[state=on]:border-primary flex items-center gap-1.5 px-3 py-1.5"
                >
                    <CheckCircle2Icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="hidden sm:inline text-xs sm:text-sm">Completada</span>
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}

export default EstadoSelector;