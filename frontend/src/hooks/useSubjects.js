import { useState, useEffect, useCallback } from 'react';
import { subjectApi } from '../api/subjectApi';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await subjectApi.getAll();
      setSubjects(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load subjects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const createSubject = async (data) => {
    const response = await subjectApi.create(data);
    setSubjects((prev) => [response.data, ...prev]);
    return response.data;
  };

  const updateSubject = async (id, data) => {
    const response = await subjectApi.update(id, data);
    setSubjects((prev) => prev.map((s) => (s.id === id ? response.data : s)));
    return response.data;
  };

  const deleteSubject = async (id) => {
    await subjectApi.delete(id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    subjects,
    isLoading,
    error,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};

export default useSubjects;
