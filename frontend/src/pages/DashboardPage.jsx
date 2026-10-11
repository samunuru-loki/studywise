import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardApi } from '../api/dashboardApi';
import { studyPlanApi } from '../api/studyPlanApi';
import { subjectApi } from '../api/subjectApi';
import StatsCard from '../components/dashboard/StatsCard';
import WeeklyProgress from '../components/dashboard/WeeklyProgress';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import StudyPlanCard from '../components/studyplans/StudyPlanCard';
import StudyPlanModal from '../components/studyplans/StudyPlanModal';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, subjectsRes] = await Promise.all([
        dashboardApi.getStats(),
        subjectApi.getAll(),
      ]);
      setStats(statsRes.data);
      setSubjects(subjectsRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStatusChange = async (planId, newStatus) => {
    try {
      await studyPlanApi.updateStatus(planId, newStatus);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleCreatePlan = async (planData) => {
    setIsSubmitting(true);
    try {
      await studyPlanApi.create(planData);
      fetchDashboardData();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10 relative overflow-hidden">
        {/* Background decorative flare */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {stats?.userName || user?.name || 'Student'}! 👋
          </h1>
          <p className="text-indigo-100 text-sm max-w-xl">
            You have <span className="font-bold underline">{stats?.todayTasksCount || 0} tasks</span> scheduled for today. Keep up the great momentum!
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchDashboardData}
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-indigo-700 hover:bg-indigo-50 border-0 font-bold shadow-lg shadow-black/10"
            icon={Plus}
          >
            Schedule Plan
          </Button>
        </div>
      </div>

      {/* Metric Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Subjects"
          value={stats?.totalSubjects ?? 0}
          subtitle="Active Courses"
          icon={BookOpen}
          color="indigo"
        />
        <StatsCard
          title="Today's Tasks"
          value={stats?.todayTasksCount ?? 0}
          subtitle="Scheduled Today"
          icon={CalendarCheck}
          color="sky"
        />
        <StatsCard
          title="Pending Tasks"
          value={stats?.pendingTasksCount ?? 0}
          subtitle="Awaiting Completion"
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Completed Tasks"
          value={stats?.completedTasksCount ?? 0}
          subtitle="Finished Overall"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatsCard
          title="Study Streak"
          value={`${stats?.studyStreakDays ?? 0} Days`}
          subtitle="Consistency Score"
          icon={Flame}
          color="rose"
        />
      </div>

      {/* Weekly Progress Target */}
      <WeeklyProgress
        completionRate={stats?.weeklyCompletionRate ?? 0}
        completedTasks={stats?.weeklyCompletedTasks ?? 0}
        totalTasks={stats?.weeklyTotalTasks ?? 0}
      />

      {/* Main Content Grid: Today's Tasks vs Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks Section (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-indigo-600" />
              Today's Study Schedule
            </h2>
            <span className="text-xs font-medium text-slate-500">
              {stats?.todayTasks?.length || 0} scheduled
            </span>
          </div>

          {stats?.todayTasks && stats.todayTasks.length > 0 ? (
            <div className="space-y-3">
              {stats.todayTasks.map((plan) => (
                <StudyPlanCard
                  key={plan.id}
                  plan={plan}
                  onStatusChange={handleStatusChange}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center space-y-3 border-dashed border-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">All caught up for today!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No pending tasks remain for today. Schedule a new topic or take some time to review your saved notes.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                icon={Plus}
              >
                Add Study Task
              </Button>
            </Card>
          )}
        </div>

        {/* Upcoming Sessions Section (1 Col) */}
        <div className="space-y-4">
          <UpcomingSessions sessions={stats?.upcomingSessions || []} />
        </div>
      </div>

      {/* Create Plan Modal */}
      <StudyPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreatePlan}
        subjects={subjects}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default DashboardPage;
