import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookMarked, CalendarCheck2, StickyNote } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Subjects', path: '/subjects', icon: BookMarked },
  { name: 'Study Plans', path: '/study-plans', icon: CalendarCheck2 },
  { name: 'Notes & Summaries', path: '/notes', icon: StickyNote },
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-16 z-30 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-slate-200/80 bg-white p-4 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Study Motivation Widget at bottom of sidebar */}
        <div className="mt-auto rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 border border-indigo-100/80">
          <p className="text-xs font-semibold text-indigo-900">Study Tip of the Day</p>
          <p className="mt-1 text-xs text-indigo-700 leading-relaxed">
            "Break study sessions into 25-minute intervals (Pomodoro) for optimal recall and focus."
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
