import { EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';

export function formatDate(date: Date): string {
  if (date.getTime() === EMPTY_DATE.getTime()) {
    return 'No disponible';
  }
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateWithTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (d.getTime() === EMPTY_DATE.getTime() || isNaN(d.getTime())) {
    return 'No disponible';
  }
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateAge(birthdate?: Date): string {
  if (!birthdate) {
    return 'No disponible';
  }
  if (birthdate.getTime() === EMPTY_DATE.getTime()) {
    return 'No disponible';
  }
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return `${age} años`;
}

export function formatRelativeDate(date: Date): string {
  if (date.getTime() === EMPTY_DATE.getTime()) {
    return 'Nunca';
  }
  
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 30) return `Hace ${diffDays} días`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`;
  }
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

