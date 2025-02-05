import json

class Disciplina:
    def __init__(self, id, nome):
        self.id = id
        self.nome = nome
        self.completada = False;
        self.pre_requisitos = []
        self.requisito_para = []

    def add_pre_requisito(self, disciplina):
        self.pre_requisitos.append(disciplina)
        disciplina.requisito_para.append(self)

    def is_disponivel(self):
        return not self.completada and (
            not len(self.pre_requisitos) or
            all([pre_requisito.completada for pre_requisito in self.pre_requisitos])
            )
    
    def set_completado(self):
        self.completada = True

    def __str__(self):
        result = f"## {self.id}: {self.nome} - {'✓' if self.completada else 'X'}\n"
        if self.pre_requisitos:
            result += f"\n### Pré-Requisitos:\n" + '\n'.join([f"- {requisito.nome}" for requisito in self.pre_requisitos])
        if self.requisito_para:
            result += f"\n### Requisito para:\n" + '\n'.join([f"- {requisito.nome}" for requisito in self.requisito_para])
        return result + '\n'


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


        self.disciplinas = disciplinas

    def __str__(self):
        return '\n'.join([
            str(disciplina)
            for disciplina in self.disciplinas.values()
        ])
    
    def set_completado(self, id):
        self.disciplinas[id].set_completado()

    
    def completadas(self):
        return [disciplina for disciplina in self.disciplinas.values() if disciplina.completada]

    def disponiveis(self):
        lista_disponiveis = [disciplina for disciplina in self.disciplinas.values() if disciplina.is_disponivel()]
        print(f"{len(lista_disponiveis)} disciplinas disponíveis.")
        return lista_disponiveis


with open('matriz.json', 'r') as file:
    data = json.load(file)

matriz = Matriz(data)

for id in [3, 4, 5, 7, 14, 18, 20, 10, 15]:
    matriz.set_completado(id)

with open('output.md', 'w') as file:
    file.write(str(matriz))