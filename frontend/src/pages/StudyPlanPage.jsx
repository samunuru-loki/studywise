import React, { useState } from 'react';
import useStudyPlans from '../hooks/useStudyPlans';
import useSubjects from '../hooks/useSubjects';
import StudyPlanCard from '../components/studyplans/StudyPlanCard';
import StudyPlanModal from '../components/studyplans/StudyPlanModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { CalendarCheck2, Plus, Filter, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

export const StudyPlanPage = () => {
  const { plans, isLoading, createPlan, updatePlan, updateStatus, deletePlan } = useStudyPlans();
  const { subjects } = useSubjects();

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const filteredPlans = plans.filter((p) => {
    if (selectedSubject && String(p.subjectId) !== String(selectedSubject)) return false;
    if (selectedStatus && p.status !== selectedStatus) return false;
    if (selectedPriority && p.priority !== selectedPriority) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, data);
      } else {
        await createPlan(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPlan) return;
    setIsSubmitting(true);
    try {
      await deletePlan(deletingPlan.id);
      setDeletingPlan(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <CalendarCheck2 className="w-6 h-6 text-indigo-600" />
            Study Plans & Task Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Schedule revision sessions, set priorities, and track your daily progress.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          icon={Plus}
          className="shadow-md shadow-indigo-500/20"
        >
          Schedule Study Session
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filters:</span>
        </div>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-xl border border-slate-200 py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-50/50 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xl border border-slate-200 py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-50/50 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="rounded-xl border border-slate-200 py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-50/50 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>

        <div className="ml-auto text-xs font-medium text-slate-500">
          Showing {filteredPlans.length} of {plans.length} Tasks
        </div>
      </div>

      {/* Plans List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>
      ) : filteredPlans.length > 0 ? (
        <div className="space-y-3">
          {filteredPlans.map((plan) => (
            <StudyPlanCard
              key={plan.id}
              plan={plan}
              onStatusChange={updateStatus}
              onEdit={handleOpenEdit}
              onDelete={(p) => setDeletingPlan(p)}
            />
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center space-y-4 border-dashed border-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CalendarIcon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              No study plans found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Plan out your study timeline to stay focused, organized, and ahead of deadlines.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleOpenCreate} icon={Plus}>
            Create Study Plan
          </Button>
        </Card>
      )}

      {/* Add / Edit Modal */}
      <StudyPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        subjects={subjects}
        plan={editingPlan}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Study Plan"
        message={`Are you sure you want to delete the plan "${deletingPlan?.topic}"?`}
        confirmText="Delete Plan"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default StudyPlanPage;
