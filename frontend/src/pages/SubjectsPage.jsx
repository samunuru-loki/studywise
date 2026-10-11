import React, { useState } from 'react';
import useSubjects from '../hooks/useSubjects';
import SubjectCard from '../components/subjects/SubjectCard';
import SubjectModal from '../components/subjects/SubjectModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { BookMarked, Plus, Search, Layers } from 'lucide-react';

export const SubjectsPage = () => {
  const { subjects, isLoading, createSubject, updateSubject, deleteSubject } = useSubjects();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, data);
      } else {
        await createSubject(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSubject) return;
    setIsSubmitting(true);
    try {
      await deleteSubject(deletingSubject.id);
      setDeletingSubject(null);
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
            <BookMarked className="w-6 h-6 text-indigo-600" />
            Course & Subject Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize your academic modules, syllabus coverage, and revision metrics.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          icon={Plus}
          className="shadow-md shadow-indigo-500/20"
        >
          Add New Subject
        </Button>
      </div>

      {/* Search & Stats Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Layers className="w-4 h-4 text-slate-400" />
          <span>{filteredSubjects.length} of {subjects.length} Subjects</span>
        </div>
      </div>

      {/* Subjects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={handleOpenEdit}
              onDelete={(sub) => setDeletingSubject(sub)}
            />
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center space-y-4 border-dashed border-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookMarked className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              {searchTerm ? 'No matching subjects found' : 'No subjects added yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? 'Try adjusting your search keywords.'
                : 'Get started by creating your first subject to organize study plans and notes.'}
            </p>
          </div>
          {!searchTerm && (
            <Button variant="primary" size="sm" onClick={handleOpenCreate} icon={Plus}>
              Create Subject
            </Button>
          )}
        </Card>
      )}

      {/* Add / Edit Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        subject={editingSubject}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingSubject}
        onClose={() => setDeletingSubject(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Subject"
        message={`Are you sure you want to delete "${deletingSubject?.name}"? All associated study plans and notes will be permanently removed.`}
        confirmText="Delete Subject"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default SubjectsPage;
