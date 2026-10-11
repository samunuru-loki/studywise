import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { BookOpen, Calendar, StickyNote, Edit3, Trash2 } from 'lucide-react';

export const SubjectCard = ({ subject, onEdit, onDelete }) => {
  return (
    <Card hoverEffect className="relative flex flex-col justify-between h-full border-t-4" style={{ borderTopColor: subject.color || '#3B82F6' }}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: subject.color || '#3B82F6' }}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base line-clamp-1">{subject.name}</h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(subject)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit Subject"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(subject)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Subject"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 min-h-[2rem]">
          {subject.description || 'No description provided.'}
        </p>
      </div>

      {/* Metrics Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{subject.totalPlans || 0} Tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <StickyNote className="w-3.5 h-3.5 text-slate-400" />
          <span>{subject.totalNotes || 0} Notes</span>
        </div>
        <Badge size="sm" color={subject.color}>
          {subject.completedPlans || 0} Done
        </Badge>
      </div>
    </Card>
  );
};

export default SubjectCard;
