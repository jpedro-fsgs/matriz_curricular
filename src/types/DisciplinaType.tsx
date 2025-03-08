export type DisciplinaJson = {
    id: number;
    codigo: string;
    nome: string;
    ch: string;
    pre_requisitos: number[];
    nucleo: string;
    natureza: string;
};

export type MatrizJson = {
    nome_curso: string;
    optativas_h: number;
    nucleo_livre_h: number;
    disciplinas: {
        obrigatorias: DisciplinaJson[];
        optativas: DisciplinaJson[];
    };
};

export type Completadas = { completadas: number; total: number };

export enum EstadoDisciplina {
    Completada = "Completada",
    Disponível = "Disponível",
    Bloqueada = "Bloqueada",
}

export type Disciplina = {
    id: number;
    nome: string;
    codigo: string;
    completada: boolean;
    estado: EstadoDisciplina;
    importancia: number;
    preRequisitosId: number[];
    preRequisitos: Disciplina[];
    requisitoPara: Disciplina[];
    disponivel: boolean;
    ch: number;
    nucleo: string;
    natureza: string;
};
