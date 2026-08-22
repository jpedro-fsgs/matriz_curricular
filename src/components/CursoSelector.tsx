"use client";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./ui/select";
import { Input } from "./ui/input";

import { useMatriz } from "@/context/MatrizContext";
import { Button } from "./ui/button";
import { useRef } from "react";
import { XIcon } from "lucide-react";
import { cursos } from "@/data/CursosData";
import { ThemeToggle } from "./ThemeToggle";

function CursoSelector() {
    const { definirMatriz, setSearch } = useMatriz();

    const inputRef = useRef<HTMLInputElement>(null);

    function handleSelect(cursoKey: string) {
        const cursoKeyIndex = Number(cursoKey);
        const storedData = localStorage.getItem(`matriz-${cursoKeyIndex}`);
        const completadas = storedData !== null ? JSON.parse(storedData) : [];

        definirMatriz(cursoKeyIndex, cursos[cursoKeyIndex].matriz, completadas);
    }

    function handleClearSearch() {
        if (!inputRef.current) return;
        setSearch("");
        inputRef.current.value = "";
    }

    return (
        <header className="sticky top-0 z-20 w-full bg-secondary/95 backdrop-blur border-b border-border shadow-xs px-3 sm:px-6 py-3">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <Select
                    onValueChange={handleSelect}
                    defaultValue={
                        typeof window !== "undefined"
                            ? localStorage.getItem("cursoIndex") ?? "0"
                            : "0"
                    }
                >
                    <SelectTrigger className="w-full md:w-80 bg-background">
                        <SelectValue placeholder="Selecionar curso" />
                    </SelectTrigger>
                    <SelectContent>
                        {cursos.map((curso, index) => (
                            <SelectItem value={index.toString()} key={index}>
                                {curso.matriz.nome_curso}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex flex-1 items-center gap-2 max-w-2xl">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Buscar disciplina por nome..."
                            onChange={(e) =>
                                setSearch(e.target.value.trim().toLowerCase())
                            }
                            className="w-full pr-8 bg-background"
                            ref={inputRef}
                        />
                        {inputRef.current?.value && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                                onClick={handleClearSearch}
                                aria-label="Limpar busca"
                            >
                                <XIcon className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearSearch}
                        className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
                        title="Limpar busca"
                    >
                        <XIcon className="h-4 w-4" />
                    </Button>

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}

export default CursoSelector;
