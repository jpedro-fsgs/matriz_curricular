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
        <div className="space-y-4 p-4 bg-secondary">
            <div className="flex flex-col md:flex-row gap-4">
                <Select onValueChange={handleSelect} defaultValue={typeof window !== "undefined" ? localStorage.getItem("cursoIndex") ?? "0" : "0"}>
                    <SelectTrigger className="w-full md:w-64">
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
                <div className="flex flex-1 gap-2">
                    <Input
                        placeholder="Buscar disciplina"
                        onChange={(e) =>
                            setSearch(e.target.value.trim().toLowerCase())
                        }
                        className="flex-1"
                        ref={inputRef}
                    />
                    <Button variant="ghost" onClick={handleClearSearch}>
                        <XIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CursoSelector;
