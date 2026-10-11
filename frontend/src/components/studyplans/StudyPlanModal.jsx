import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export const StudyPlanModal = ({
  isOpen,
  onClose,
  onSave,
  subjects = [],
  plan = null,
  isLoading = false,
}) => {
  const [subjectId, setSubjectId] = useState('');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('PENDING');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (plan) {
      setSubjectId(plan.subjectId || '');
      setTopic(plan.topic || '');
      setDate(plan.date || new Date().toISOString().split('T')[0]);
      setStartTime(plan.startTime || '');
      setEndTime(plan.endTime || '');
      setPriority(plan.priority || 'MEDIUM');
      setStatus(plan.status || 'PENDING');
      setNotes(plan.notes || '');
    } else {
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
      setTopic('');
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('10:30');
      setPriority('MEDIUM');
      setStatus('PENDING');
      setNotes('');
    }
    setError('');
  }, [plan, isOpen, subjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId) {
      setError('Please select a subject');
      return;
    }
    if (!topic.trim()) {
      setError('Topic is required');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }

    try {
      await onSave({
        subjectId: Number(subjectId),
        topic: topic.trim(),
        date,
        startTime: startTime || null,
        endTime: endTime || null,
        priority,
        status,
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save study plan');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plan ? 'Edit Study Plan' : 'Schedule Study Session'}
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

        {/* Topic Input */}
        <Input
          label="Study Topic / Task"
          placeholder="e.g. Chapter 4 - Binary Trees & Heaps"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            type="time"
            label="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            type="time"
            label="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        {/* Priority & Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Notes / Subtasks */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Task Notes / Objectives
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Key formulas to memorize, practice problem set numbers..."
            className="block w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {plan ? 'Save Changes' : 'Schedule Session'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudyPlanModal;
