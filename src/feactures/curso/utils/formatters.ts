export function getTipoBadgeColor(tipo: string): string {
    switch (tipo) {
      case 'TEORICO':
        return 'badge-primary';
      case 'PRACTICO':
      case 'LABORATORIO':
        return 'badge-secondary';
      default:
        return 'badge-neutral';
    }
  }
  
  export function formatTipoCurso(tipo: string): string {
    switch (tipo) {
      case 'TEORICO':
        return 'Teórico';
      case 'PRACTICO':
      case 'LABORATORIO':
        return 'Práctico';
      default:
        return tipo;
    }
  }