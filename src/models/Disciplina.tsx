import { DisciplinaType } from "@/types/DisciplinaType";

export class Disciplina {
    id: number;
    nome: string;
    completada: boolean;
    unidadeResponsavel: string;
    preRequisitos: Disciplina[];
    requisitoPara: Disciplina[];
    chTeorica: number;
    chPratica: number;
    cht: number;
    nucleo: string;
    natureza: string;

    constructor(disciplina: DisciplinaType) {
        this.id = disciplina.id;
        this.nome = disciplina.nome;
        this.completada = false;
        this.unidadeResponsavel = disciplina.unidade_responsavel;
        this.preRequisitos = [];
        this.requisitoPara = [];
        this.chTeorica = disciplina.ch_teorica;
        this.chPratica = disciplina.ch_pratica;
        this.cht = disciplina.cht;
        this.nucleo = disciplina.nucleo;
        this.natureza = disciplina.natureza;
    }

    setCompletada(completada: boolean) {
        this.completada = completada;
    }

    addRequisito(disciplina: Disciplina) {
        this.preRequisitos.push(disciplina);
        disciplina.requisitoPara.push(this);
    }

    isDisponivel() {
        return (
            !this.completada &&
            (this.preRequisitos.length == 0 ||
                this.preRequisitos.every(
                    (preRequisito) => preRequisito.completada
                ))
        );
    }
}
