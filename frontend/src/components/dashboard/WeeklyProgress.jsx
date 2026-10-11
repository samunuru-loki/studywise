import React from 'react';
import Card from '../common/Card';
import { Target, TrendingUp } from 'lucide-react';

export const WeeklyProgress = ({
  completionRate = 0,
  completedTasks = 0,
  totalTasks = 0,
}) => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Weekly Target Progress</h4>
            <p className="text-xs text-slate-500">Current week completion status</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{completionRate}% Complete</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.min(completionRate, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>{completedTasks} completed</span>
          <span>{totalTasks} total tasks scheduled</span>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyProgress;
