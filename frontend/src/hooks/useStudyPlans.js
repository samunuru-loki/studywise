import { useState, useEffect, useCallback } from 'react';
import { studyPlanApi } from '../api/studyPlanApi';

export const useStudyPlans = (initialParams = null) => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async (params = initialParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await studyPlanApi.getAll(params);
      setPlans(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load study plans');
    } finally {
      setIsLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const createPlan = async (data) => {
    const response = await studyPlanApi.create(data);
    setPlans((prev) => [...prev, response.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
    return response.data;
  };

  const updatePlan = async (id, data) => {
    const response = await studyPlanApi.update(id, data);
    setPlans((prev) => prev.map((p) => (p.id === id ? response.data : p)));
    return response.data;
  };

  const updateStatus = async (id, status) => {
    // Optimistic update
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    try {
      const response = await studyPlanApi.updateStatus(id, status);
      setPlans((prev) => prev.map((p) => (p.id === id ? response.data : p)));
      return response.data;
    } catch (err) {
      // Revert on error
      fetchPlans();
      throw err;
    }
  };

  const deletePlan = async (id) => {
    await studyPlanApi.delete(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    plans,
    isLoading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    updateStatus,
    deletePlan,
  };
};

export default useStudyPlans;
