import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate, formatTime, getPriorityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';
import { Clock, Calendar, Edit3, Trash2, CheckCircle2, Circle, PlayCircle } from 'lucide-react';

export const StudyPlanCard = ({ plan, onEdit, onDelete, onStatusChange }) => {
  const isCompleted = plan.status === 'COMPLETED';

  const handleStatusToggle = () => {
    const nextStatus = isCompleted ? 'PENDING' : 'COMPLETED';
    onStatusChange(plan.id, nextStatus);
  };

  return (
    <Card hoverEffect className={`transition-all duration-200 ${isCompleted ? 'bg-slate-50/60 border-slate-200' : 'bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox toggle & Topic */}
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={handleStatusToggle}
            className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
            title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
            ) : plan.status === 'IN_PROGRESS' ? (
              <PlayCircle className="w-5 h-5 text-sky-600 fill-sky-50" />
            ) : (
              <Circle className="w-5 h-5 hover:text-indigo-500" />
            )}
          </button>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge size="sm" color={plan.subjectColor}>
                {plan.subjectName}
              </Badge>
              <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${getPriorityBadgeClass(plan.priority)}`}>
                {plan.priority} Priority
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${getStatusBadgeClass(plan.status)}`}>
                {plan.status.replace('_', ' ')}
              </span>
            </div>

            <h4 className={`text-sm font-semibold text-slate-800 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
              {plan.topic}
            </h4>

            {plan.notes && (
              <p className="text-xs text-slate-500 line-clamp-2">
                {plan.notes}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(plan)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Plan"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(plan)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Plan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date & Time Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(plan.date)}</span>
        </div>
        {plan.startTime && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {formatTime(plan.startTime)} {plan.endTime ? `- ${formatTime(plan.endTime)}` : ''}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StudyPlanCard;
