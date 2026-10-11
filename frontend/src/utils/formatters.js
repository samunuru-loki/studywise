/**
 * Date and time formatting utility functions.
 */

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'MEDIUM':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'LOW':
    default:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'IN_PROGRESS':
      return 'bg-sky-100 text-sky-800 border-sky-300';
    case 'PENDING':
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
};
