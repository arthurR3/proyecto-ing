export const parseTime = (time) => {
  const [timePart, period] = time.split(' ');
  const [hour, minute] = timePart.split(':').map(Number);
  
  let totalMinutes = hour * 60 + minute;
  
  if (period === 'PM' && hour !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === 'AM' && hour === 12) {
    totalMinutes -= 12 * 60;
  }
  
  return totalMinutes;
};

export const formatTime = totalMinutes => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedH = hours % 12 || 12;
    const adjustedMin = minutes.toString().padStart(2, '0');
    return `${adjustedH}:${adjustedMin} ${period}`;
  };
  
export const parseDuration = durationStr => {
    const [hours, minutes, seconds] = durationStr.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
  };
  
  export const isTimeSlotAvailable = (startTime, endTime, bookedSlots) => {
    return !bookedSlots.some(slot => {
      const slotStart = parseTime(slot.start);
      const slotEnd = parseTime(slot.end);
      return (startTime < slotEnd && endTime > slotStart);
    });
  };