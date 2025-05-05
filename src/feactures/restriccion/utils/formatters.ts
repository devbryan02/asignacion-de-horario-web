export function formatHora(hora: string): string {
    return hora.substring(0, 5);
  }
  
export function formatDiaSemana(dia: string): string {
    return dia.charAt(0) + dia.slice(1).toLowerCase();
}