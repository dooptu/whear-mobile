import { format, isToday, isYesterday, parseISO, differenceInDays } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  
  const daysDiff = differenceInDays(new Date(), dateObj);
  if (daysDiff < 7) {
    return `${daysDiff} days ago`;
  }
  
  return format(dateObj, 'MMM d, yyyy');
};

export const formatDateFull = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMMM d, yyyy');
};

export const isSameDay = (date1: string | Date, date2: string | Date): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
};




