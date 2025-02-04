import json

class Disciplina:
    def __init__(self, id, nome):
        self.id = id
        self.nome = nome
        self.completada = False;
        self.pre_requisitos = []

    def add_pre_requisito(self, disciplina):
        self.pre_requisitos.append(disciplina)

    def __str__(self):
        string = f"{self.id}: {self.nome} - {'✓' if self.completada else 'X'}\n"\
                 f"{'Pré-requisitos\n' if self.pre_requisitos else ''}"\
                 f"{'\n'.join(["\t" + str(pre_requisito) for pre_requisito in self.pre_requisitos])}"
        return string
                


class Matriz:
    def __init__(self, data):

        disciplinas = {
            disciplina["id"]:Disciplina(disciplina["id"], disciplina["disciplina"])
            for disciplina in data
        }
        for disciplina_json in data:
            disciplina = disciplinas[disciplina_json["id"]]
            for pre_requisito in disciplina_json["pre_requisitos"]:
                disciplina.add_pre_requisito(disciplinas[pre_requisito])

        # print(disciplinas)
        self.disciplinas = disciplinas

    def __str__(self):
        return '\n'.join([
            str(disciplina)
            for disciplina in self.disciplinas.values()
        ])




with open('matriz.json', 'r') as file:
    data = json.load(file)

matriz = Matriz(data)

print(matriz)