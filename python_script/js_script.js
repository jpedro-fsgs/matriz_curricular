const documento = document.getElementsByClassName('formulario');
const tabela = documento[0].querySelector('table>tbody');
const dados = documento[0].querySelector('tbody');

const disciplinas = Array.from(tabela.getElementsByClassName("componentes")).map((disciplina, index) => {
    const e = Array.from(disciplina.getElementsByTagName("td"));
    const f = e[1].innerText.split(" - ");
    return {
        id: index,
        codigo: e[0].innerText,
        nome: f[0],
        ch: f[1],
        pre_requisitos: [],
        nucleo: e[3].innerText,
        natureza: e[4].innerText,
    };
});

const codigo = dados.querySelector('tr>td').innerText;
const nome_curso = dados.querySelectorAll('tr>td')[2].innerText;
const result = {
    nome_curso,
    codigo,
    optativas: 2,
    nucleo_livre: 2,
    disciplinas: {
        obrigatorias: disciplinas.filter(disciplina => disciplina.natureza === "OBRIG."),
        optativas: disciplinas.filter(disciplina => disciplina.natureza === "OPTAT."),
    }
};
console.log(result);