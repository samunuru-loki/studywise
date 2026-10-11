import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Bold, Italic, List, Code, Heading } from 'lucide-react';

export const NoteModal = ({
  isOpen,
  onClose,
  onSave,
  subjects = [],
  note = null,
  isLoading = false,
}) => {
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      setSubjectId(note.subjectId || '');
      setTitle(note.title || '');
      setContent(note.content || '');
    } else {
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
      setTitle('');
      setContent('');
    }
    setError('');
  }, [note, isOpen, subjects]);

  const insertFormatting = (tag) => {
    switch (tag) {
      case 'h2':
        setContent((prev) => prev + '<h2>Important Concept</h2>\n');
        break;
      case 'b':
        setContent((prev) => prev + '<strong>key term</strong> ');
        break;
      case 'i':
        setContent((prev) => prev + '<em>emphasis</em> ');
        break;
      case 'ul':
        setContent((prev) => prev + '<ul>\n  <li>Key point 1</li>\n  <li>Key point 2</li>\n</ul>\n');
        break;
      case 'code':
        setContent((prev) => prev + '<pre><code>// code or formula snippet</code></pre>\n');
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId) {
      setError('Please select a subject');
      return;
    }
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSave({
        subjectId: Number(subjectId),
        title: title.trim(),
        content: content.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save note');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note ? 'Edit Study Note' : 'Create New Note'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Subject dropdown */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Subject <span className="text-rose-500">*</span>
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
            className="block w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
          >
            <option value="">Select a subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <Input
          label="Note Title"
          placeholder="e.g. Dijkstra's Algorithm & Priority Queues"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Toolbar & Content Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">
              Note Content
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => insertFormatting('h2')}
                className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                title="Heading"
              >
                <Heading className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('b')}
                className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('i')}
                className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('ul')}
                className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('code')}
                className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                title="Code Block"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            rows="8"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your notes, formulas, summaries, and key takeaways here..."
            className="block w-full rounded-xl border border-slate-300 p-3.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none font-mono text-slate-800"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {note ? 'Save Changes' : 'Save Note'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NoteModal;
