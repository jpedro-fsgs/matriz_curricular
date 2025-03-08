import json

def parse_disciplinas(lista):
    disciplinas = []
    for linha in lista:
        tokens = linha.split()
        # O primeiro token contém o código (removendo o ponto)
        codigo = tokens[0].replace(".", "")
        
        # A partir do final, identificamos os tokens que são pré-requisitos (apenas dígitos, possivelmente com vírgula)
        prereq_tokens = []
        i = len(tokens) - 1
        while i > 0:
            # Remover vírgulas para testar se é dígito
            token_limpo = tokens[i].replace(",", "")
            if token_limpo.isdigit():
                # Adiciona o token sem vírgula (ou pode manter a vírgula se desejar, mas geralmente queremos o número puro)
                prereq_tokens.insert(0, token_limpo)
                i -= 1
            else:
                break
        # Após essa iteração, o token tokens[i] é o instituto.
        instituto = tokens[i]
        i -= 1
        # O restante (tokens[1] até tokens[i]) compõe o nome da disciplina.
        nome = " ".join(tokens[1:i+1])
        
        disciplinas.append({
            "codigo": codigo,
            "nome": nome,
            "instituto": instituto,
            "pre_requisitos": prereq_tokens
        })
    
    return disciplinas


def remap(matriz, lista_disciplinas):

    matriz_org = {dis["nome"]: dis["id"] for dis in matriz["disciplinas"]["obrigatorias"] + matriz["disciplinas"]["optativas"]}

    resultado = parse_disciplinas(lista_disciplinas)

    map_lista = {dis["codigo"]: dis["nome"].upper() for dis in resultado}

    new_matriz = {
        dis["nome"].upper(): [map_lista[i] for i in dis["pre_requisitos"]]
        for dis in resultado
    }
    

    for dis in matriz["disciplinas"]["obrigatorias"]:
        dis["pre_requisitos"] = [matriz_org[i] for i in new_matriz[dis["nome"]]]
    
    for dis in matriz["disciplinas"]["optativas"]:
        dis["pre_requisitos"] = [matriz_org[i] for i in new_matriz[dis["nome"]]]


    return matriz

with open("src/data/matrizCC.json", "r") as file:
    matriz_CC = json.load(file)

with open("scripts/t.txt", "r") as file:
    lista_disciplinas = file.read().strip().split('\n')



f_matriz = remap(matriz_CC, lista_disciplinas)

with open("src/data/matrizCC2.json", "w") as file:
    json.dump(f_matriz, file, ensure_ascii=False, indent=4)