import json
import pdfplumber
import re
from ollama import chat, ChatResponse

def parse(disciplina_string):
    pattern = (
        r"^(\d+)\.\s+"
        r"(.+?)\s+"
        r"(INF|IME|FACE)\s+"
        r"(?:PR:\s+([\d;]+)\s+)?"
        r"((?:\d+\s+){0,2}\d+)\s+"
        r"(NC|NE|NL)"
        r"(?:\s+(OBR|OPT))?$"
    )

    match = re.match(pattern, disciplina_string)
    if not match:
        return None

    try:
        id_ = int(match.group(1))
        disciplina = match.group(2)
        unidade_responsavel = match.group(3)
        
        pre_requisitos_str = match.group(4)
        pre_requisitos = [int(x) for x in pre_requisitos_str.split(";")] if pre_requisitos_str else []
        
        hours_str = match.group(5)
        hours_list = hours_str.split()
        if len(hours_list) == 1:
            ch_teorica = 0
            ch_pratica = 0
            cht = int(hours_list[0])
        elif len(hours_list) == 2:
            ch_teorica = int(hours_list[0])
            ch_pratica = 0
            cht = int(hours_list[1])
        elif len(hours_list) == 3:
            ch_teorica = int(hours_list[0])
            ch_pratica = int(hours_list[1])
            cht = int(hours_list[2])
        else:
            return None

        nucleo = match.group(6)
        natureza = match.group(7) if match.group(7) else None

        return {
            "id": id_,
            "disciplina": disciplina,
            "unidade_responsavel": unidade_responsavel,
            "pre_requisitos": pre_requisitos,
            "ch_teorica": ch_teorica,
            "ch_pratica": ch_pratica,
            "cht": cht,
            "nucleo": nucleo,
            "natureza": natureza,
        }
    except Exception:
        return None

def parse_llm(input: list):
    prompt = open("python_script/prompt.txt", "r").read()

    outputs = []

    
    for i in [line for line in input if re.match(r'^\d{1,2}\.', line)]:
        response: ChatResponse = chat(model='llama3.2', messages=[
            {
                'role': 'user',
                'content': prompt + i,
            },
        ])
        print(response.message.content)
        try:
            outputs.append(json.loads(response.message.content))
        except json.JSONDecodeError:
            print("ERRO NO JSON")

    return outputs



with pdfplumber.open("python_script/data/PPC-BSI-2017_atualizado-2021.pdf") as pdf:
    output = ('\n'.join([page.extract_text() for page in pdf.pages[18:22]])).split('\n')

# matriz = parse_llm(output)


parsed_lines = [parse(line) for line in output]
matriz = [line for line in parsed_lines if line]


with open("python_script/data/output.json", "w") as f:
    json.dump(matriz, f, ensure_ascii=False, indent=4)



