import { parseTime, formatTime, isTimeSlotAvailable } from './format_utilsTime.js'
import { getBookedSlots, getService } from '../Api/ApiServices.js'
export const fethService = async (id, setServices, setPreSelectedServices, setLoading, setError) => {
    try {
        const data = await getService()
        setServices(data)
        const selectedService = data.find(service => service.id === parseInt(id))
        setPreSelectedServices(selectedService)
        setTimeout(() => setLoading(false), 2000)
    } catch (error) {
        setError(error)
    }
}

export const fetchBookedSlots = async (selectedDate, setBookedSlots) => {
    if (selectedDate) {
        try {
            const response = await getBookedSlots(selectedDate)
            const slots = response.map(slot => {
                const [start, end] = slot.Horario.split(' - ');
                return {
                    start: start.trim(),
                    end: end.trim(),
                };
            });
            setBookedSlots(slots);
        } catch (error) {
            console.log('Error al obtener los horarios reservados:', error);
        }
    }
}
export const generateTimes = (calculateDuration, bookedSlots, workSchedule, exceptions, selectedDate) => {
    const totalDuration = calculateDuration(); // Duración total de la cita
    const dayOfWeek = selectedDate.getDay(); // Día seleccionado por el usuario
    const currentDate = new Date();
    const isToday = selectedDate.toDateString() === currentDate.toDateString();
  
    // Se verifica si la fecha no esta en la lista de exceptiones
    const isExceptions = exceptions.some(exception =>{
        const exceptionDate = new Date(exception.fecha)
        return exceptionDate.toDateString() === selectedDate.toDateString();
    })
    if(isExceptions){
        return [];
    }
    
    // Encuentra el horario laboral del día seleccionado
    const daySchedule = workSchedule.find(schedule => {
        return schedule.dia_semana === dayOfWeek;
    });   
  
    if (!daySchedule) {
      //console.log('No hay horario laboral para este día.');
      return [];
    }
  
    const times = [];
    //console.log('Horario del día:', daySchedule);
  
    // Itera sobre cada intervalo de trabajo del día
    daySchedule.intervalos.forEach(interval => {
      let timeInicial = parseTime(interval.hora_desde); // Convierte "hora_desde" a minutos
      const endOfDay = parseTime(interval.hora_hasta);  // Convierte "hora_hasta" a minutos

      let currentTime = isToday ? Math.max(parseTime(currentDate.toTimeString().split(' ')[0]), timeInicial) : timeInicial;
        
        // Redondea hacia la próxima hora completa si es el día actual
        if (isToday) {
            const nextFullHour = Math.ceil(currentTime / 60) * 60; // Redondea al siguiente múltiplo de 60 (próxima hora)
            currentTime = Math.max(currentTime, nextFullHour); // Asegura que comienza a la siguiente hora completa
        }
      //console.log(currentTime)
      //console.log('Intervalo inicial:', formatTime(timeInicial), 'Intervalo final:', formatTime(endOfDay));
  
      // Genera los intervalos de tiempo dentro de cada intervalo de trabajo
      while (currentTime + totalDuration <= endOfDay) {
        const timeFinal = currentTime + totalDuration;
  
        // Verifica si el slot está disponible
        if (isTimeSlotAvailable(currentTime, timeFinal, bookedSlots)) {
          times.push(`${formatTime(currentTime)} - ${formatTime(timeFinal)}`);
        }
  
        currentTime = timeFinal; 
      }
    });
  
    //console.log('Horarios generados:', times);
    return times;
  };