import json
import pdfplumber
import re

def parse(disciplina_string):
    pattern = (
        r"(\d+)\.\s+(.+?)\s+(INF|IME|FACE)\s+(?:PR:\s+(\d+(?:;\d+)*)\s+)?(\d+)?\s*(\d+)?\s*(\d+)?\s*(\w+)\s+(\w+)"
    )

    match = re.match(pattern, disciplina_string)

    if match:
        id_ = match.group(1)
        nome = match.group(2)
        codigo = match.group(3)
        pr = [int(i) for i in match.group(4).split(";")] if match.group(4) else []
        horas_teoricas = match.group(5) if match.group(5) else 0
        horas_praticas = match.group(6) if match.group(6) else 0
        horas_totais = match.group(7) if match.group(7) else 0
        nucleo = match.group(8)
        natureza = match.group(9)

        disciplina_dict = {
            "id": int(id_),
            "disciplina": nome,
            "unidade_responsavel": codigo,
            "pre_requisitos": pr,
            "ch_teorica": int(horas_teoricas),
            "ch_pratica": int(horas_praticas),
            "cht": int(horas_totais),
            "nucleo": nucleo,
            "natureza": natureza,
        }
        return disciplina_dict

    return None


with pdfplumber.open("python_script/data/PPC-BSI-2017_atualizado-2021.pdf") as pdf:
    output = ('\n'.join([page.extract_text() for page in pdf.pages[18:22]])).split('\n')


parsed_lines = [parse(line) for line in output]
matriz = [line for line in parsed_lines if line]
print(len(matriz))

with open("python_script/data/output.json", "w") as f:
    json.dump(matriz, f, ensure_ascii=False, indent=4)



