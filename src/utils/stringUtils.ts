export function normalizeText(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") 
        .trim()
        .toLowerCase(); 
}

