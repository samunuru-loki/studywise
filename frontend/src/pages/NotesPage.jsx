import React, { useState } from 'react';
import useNotes from '../hooks/useNotes';
import useSubjects from '../hooks/useSubjects';
import NoteCard from '../components/notes/NoteCard';
import NoteModal from '../components/notes/NoteModal';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { formatDate } from '../utils/formatters';
import { StickyNote, Plus, Search, Filter, Edit3, Trash2 } from 'lucide-react';

export const NotesPage = () => {
  const { subjects } = useSubjects();
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes(selectedSubjectId || null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingNote) {
        await updateNote(editingNote.id, data);
      } else {
        await createNote(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingNote) return;
    setIsSubmitting(true);
    try {
      await deleteNote(deletingNote.id);
      setDeletingNote(null);
      if (viewingNote?.id === deletingNote.id) {
        setViewingNote(null);
      }
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
            <StickyNote className="w-6 h-6 text-indigo-600" />
            Study Notes & Key Summaries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Capture revision notes, key formulas, conceptual breakdowns, and lecture summaries.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          icon={Plus}
          className="shadow-md shadow-indigo-500/20"
        >
          Create Note
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes by title or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-50/50 focus:outline-none focus:border-indigo-500 w-full sm:w-60"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={(n) => setViewingNote(n)}
              onEdit={handleOpenEdit}
              onDelete={(n) => setDeletingNote(n)}
            />
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center space-y-4 border-dashed border-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <StickyNote className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              No study notes found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Document your understanding with formulas, code snippets, and quick summaries.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleOpenCreate} icon={Plus}>
            Create Note
          </Button>
        </Card>
      )}

      {/* Note Reader Modal */}
      <Modal
        isOpen={!!viewingNote}
        onClose={() => setViewingNote(null)}
        title={viewingNote?.title || 'Note Details'}
        maxWidth="max-w-2xl"
      >
        {viewingNote && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <Badge color={viewingNote.subjectColor}>
                {viewingNote.subjectName}
              </Badge>
              <span className="text-xs text-slate-400">
                Last updated {formatDate(viewingNote.updatedAt || viewingNote.createdAt)}
              </span>
            </div>

            {/* Note HTML rendering */}
            <div
              className="prose prose-sm max-w-none text-slate-800 leading-relaxed max-h-[60vh] overflow-y-auto pr-2"
              dangerouslySetInnerHTML={{ __html: viewingNote.content || '<em>No content</em>' }}
            />

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const toEdit = viewingNote;
                  setViewingNote(null);
                  handleOpenEdit(toEdit);
                }}
                icon={Edit3}
              >
                Edit Note
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeletingNote(viewingNote)}
                icon={Trash2}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        subjects={subjects}
        note={editingNote}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingNote}
        onClose={() => setDeletingNote(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        message={`Are you sure you want to delete note "${deletingNote?.title}"?`}
        confirmText="Delete Note"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default NotesPage;
