export type DisciplinaJson = {
    id: number;
    nome: string;
    unidade_responsavel: string;
    pre_requisitos: number[];
    ch_teorica: number;
    ch_pratica: number;
    cht: number;
    nucleo: string;
    natureza: string;
}

export type Disciplina = {
    id: number;
    nome: string;
    completada: boolean;
    importancia: number;
    unidadeResponsavel: string;
    preRequisitosId: number[];
    preRequisitos: Disciplina[];
    requisitoPara: Disciplina[];
    disponivel: boolean;
    chTeorica: number;
    chPratica: number;
    cht: number;
    nucleo: string;
    natureza: string;
}
