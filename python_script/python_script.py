import json

def remap():

    with open("python_script/matrizes/matrizSI-old.json", "r") as file:
        matriz_old = json.load(file)

    matriz_org = matriz_old["obrigatorias"] + matriz_old["optativas"]


    def get_nome(id):
        for dis in matriz_org:
            if dis["id"] == id:
                return dis["nome"].upper()
        return None


    new_matriz = {
        dis["nome"].upper(): [get_nome(i) for i in dis["pre_requisitos"]]
        for dis in matriz_org
    }


    with open("src/data/matrizSI.json", "r") as file:
        matriz_att = json.load(file)

    matriz_att_org = (
        matriz_att["disciplinas"]["obrigatorias"] + matriz_att["disciplinas"]["optativas"]
    )

    new_matriz_att = {dis["nome"]: dis["id"] for dis in matriz_att_org}

    for dis in matriz_att["disciplinas"]["obrigatorias"]:
        dis["pre_requisitos"] = [new_matriz_att[i] for i in new_matriz[dis["nome"]]]

    for dis in matriz_att["disciplinas"]["optativas"]:
        dis["pre_requisitos"] = [new_matriz_att[i] for i in new_matriz[dis["nome"]]]

    with open("src/data/matrizSI-att.json", "w") as file:
        json.dump(matriz_att, file, indent=4, ensure_ascii=False)