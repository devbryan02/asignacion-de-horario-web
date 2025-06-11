// Formatear hora para mostrar (HH:MM)
export const formatTime = (time: string) => {
    return time.substring(0, 5);
  };
  
  // Calcular el nombre del día a partir del índice
  export const getNombreDia = (diaIndex: number, diasSemana: string[]) => {
    return diasSemana[diaIndex] || '';
  };
  
  // Calcular la duración en horas y minutos
  export const calcularDuracion = (horaInicio: string, horaFin: string) => {
    const [horaInicioStr, minutosInicioStr] = horaInicio.split(':');
    const [horaFinStr, minutosFinStr] = horaFin.split(':');
    
    const inicioMinutos = parseInt(horaInicioStr) * 60 + parseInt(minutosInicioStr);
    const finMinutos = parseInt(horaFinStr) * 60 + parseInt(minutosFinStr);
    
    const diferencia = finMinutos - inicioMinutos;
    const horas = Math.floor(diferencia / 60);
    const minutos = diferencia % 60;
    
    if (horas === 0) {
      return `${minutos} min`;
    } else if (minutos === 0) {
      return `${horas} h`;
    } else {
      return `${horas} h ${minutos} min`;
    }
  };