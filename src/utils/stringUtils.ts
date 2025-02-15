export function normalizeText(text: string): string {
    return text
        .normalize("NFD") // Decompõe caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Remove pontuação
        .trim()
        .toLowerCase(); // Remove espaços extras no início e no fim
}

