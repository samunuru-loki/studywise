import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { Edit3, Trash2, StickyNote } from 'lucide-react';

export const NoteCard = ({ note, onEdit, onDelete, onClick }) => {
  // Strip HTML tags for preview snippet
  const getSnippet = (html) => {
    if (!html) return 'No content...';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <Card
      hoverEffect
      className="flex flex-col justify-between h-full cursor-pointer group border-t-2"
      style={{ borderTopColor: note.subjectColor || '#6366f1' }}
      onClick={() => onClick ? onClick(note) : onEdit(note)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <Badge size="sm" color={note.subjectColor}>
            {note.subjectName}
          </Badge>
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit Note"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(note)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {note.title}
        </h3>

        {/* Content Snippet */}
        <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed">
          {getSnippet(note.content)}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <StickyNote className="w-3 h-3" />
          <span>Note</span>
        </div>
        <span>Updated {formatDate(note.updatedAt || note.createdAt)}</span>
      </div>
    </Card>
  );
};

export default NoteCard;
