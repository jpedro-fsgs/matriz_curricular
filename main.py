import json

class Disciplina:
    def __init__(self, id, nome):
        self.id = id
        self.nome = nome
        self.completada = False;
        self.pre_requisitos = []
        self.requisito_para = []
        self.importancia = 0

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
        result = f"## {self.id}: {self.nome} - {'✔️' if self.completada else '❌'}\n"
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
        return [disciplina for disciplina in self.disciplinas.values() if disciplina.is_disponivel()]

    def disponiveis_str(self):
        lista_disponiveis = [f"- {disciplina.nome}{f" (Bloqueia {disciplina.importancia} disciplinas)" if disciplina.importancia else ""}" for disciplina in sorted(self.disponiveis(), key=lambda i : i.importancia, reverse=True)]
        return f"### {len(lista_disponiveis)} disciplinas disponíveis.\n" + '\n'.join(lista_disponiveis)
    
    def checar_importancia(self):
        for disciplina in self.disciplinas.values():
            dfs(disciplina)

def dfs(disciplina: Disciplina):
    if disciplina.completada:
        return 0
    disciplina.importancia = len(disciplina.requisito_para)
    for i in disciplina.requisito_para:
        disciplina.importancia += dfs(i)
    
    return disciplina.importancia

def gerar_matriz(disciplinas_cursadas):

    with open('matriz.json', 'r') as file:
        data = json.load(file)

    matriz = Matriz(data)


    for id in disciplinas_cursadas:
        matriz.set_completado(id)

    matriz.checar_importancia()

    output = f"# Disciplinas Disponíveis\n" + matriz.disponiveis_str() + f"\n---\n# Grade\n" + str(matriz)

    with open('output.md', 'w') as file:
        file.write(output)


disciplinas_cursadas = [3, 4, 5, 7, 14, 18, 20, 10, 15]
gerar_matriz(disciplinas_cursadas)