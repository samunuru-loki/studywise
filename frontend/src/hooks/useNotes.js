import { useState, useEffect, useCallback } from 'react';
import { noteApi } from '../api/noteApi';

export const useNotes = (subjectId = null) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async (id = subjectId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await noteApi.getAll(id);
      setNotes(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchNotes(subjectId);
  }, [fetchNotes, subjectId]);

  const createNote = async (data) => {
    const response = await noteApi.create(data);
    setNotes((prev) => [response.data, ...prev]);
    return response.data;
  };

  const updateNote = async (id, data) => {
    const response = await noteApi.update(id, data);
    setNotes((prev) => prev.map((n) => (n.id === id ? response.data : n)));
    return response.data;
  };

  const deleteNote = async (id) => {
    await noteApi.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
};

export default useNotes;
