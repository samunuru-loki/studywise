import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate, formatTime } from '../../utils/formatters';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UpcomingSessions = ({ sessions = [] }) => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Upcoming Study Sessions</h4>
            <p className="text-xs text-slate-500">Next scheduled revision tasks</p>
          </div>
        </div>
        <Link
          to="/study-plans"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">
          No upcoming study sessions found. Plan ahead to stay on track!
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {sessions.map((session) => (
            <div key={session.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: session.subjectColor || '#6366f1' }}
                  />
                  <span className="text-xs font-medium text-slate-500">
                    {session.subjectName}
                  </span>
                  <Badge size="sm" color={session.subjectColor}>
                    {session.priority}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                  {session.topic}
                </p>
              </div>

              <div className="text-right shrink-0 pl-3">
                <p className="text-xs font-medium text-slate-700">{formatDate(session.date)}</p>
                {session.startTime && (
                  <p className="flex items-center justify-end gap-1 text-xs text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(session.startTime)}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default UpcomingSessions;
