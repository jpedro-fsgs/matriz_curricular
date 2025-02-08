export interface DisciplinaType     {
    id: number,
    nome: string,
    unidade_responsavel: string,
    pre_requisitos: string[],
    ch_teorica: number,
    ch_pratica: number,
    cht: number,
    nucleo: string,
    natureza: string
}