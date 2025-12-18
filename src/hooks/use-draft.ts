import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

const DRAFT_PREFIX = 'legal_doc_draft_';

export function useDraft<T>(key: string, initialData: T) {
  const storageKey = `${DRAFT_PREFIX}${key}`;
  
  const [data, setData] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved) as T;
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
    return initialData;
  });

  const [hasDraft, setHasDraft] = useState(() => {
    return localStorage.getItem(storageKey) !== null;
  });

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setHasDraft(true);
      toast({
        title: "Draft Saved",
        description: "Your progress has been saved locally.",
      });
    } catch (e) {
      console.error('Failed to save draft:', e);
      toast({
        title: "Error",
        description: "Failed to save draft. Storage may be full.",
        variant: "destructive"
      });
    }
  }, [data, storageKey]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setData(initialData);
      setHasDraft(false);
      toast({
        title: "Draft Cleared",
        description: "Your saved draft has been removed.",
      });
    } catch (e) {
      console.error('Failed to clear draft:', e);
    }
  }, [storageKey, initialData]);

  const updateData = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Auto-save on data change (debounced via localStorage only)
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(initialData)) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
        setHasDraft(true);
      } catch (e) {
        // Silent fail for auto-save
      }
    }
  }, [data, storageKey, initialData]);

  return {
    data,
    setData,
    updateData,
    saveDraft,
    clearDraft,
    hasDraft,
  };
}
