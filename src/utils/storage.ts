import { RegistrationRecord } from '../types';
import { INITIAL_REGISTRATION_RECORDS } from '../data/classesData';

const STORAGE_KEY = 'stem_fpt_bg_registrations_2026';

let memoryStore: RegistrationRecord[] | null = null;

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('localStorage is not available:', error);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('Failed to write to localStorage:', error);
  }
};

export const getStoredRegistrations = (): RegistrationRecord[] => {
  if (memoryStore !== null) {
    return memoryStore;
  }

  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) {
      safeSetItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATION_RECORDS));
      memoryStore = [...INITIAL_REGISTRATION_RECORDS];
      return memoryStore;
    }
    const parsed = JSON.parse(raw);
    memoryStore = Array.isArray(parsed) ? parsed : [...INITIAL_REGISTRATION_RECORDS];
    return memoryStore;
  } catch (error) {
    console.error('Failed to parse registrations from localStorage:', error);
    memoryStore = [...INITIAL_REGISTRATION_RECORDS];
    return memoryStore;
  }
};

export const saveRegistrationRecord = (record: RegistrationRecord): void => {
  const records = getStoredRegistrations();
  const updated = [record, ...records];
  memoryStore = updated;
  safeSetItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateRegistrationStatus = (id: string, newStatus: RegistrationRecord['status']): RegistrationRecord[] => {
  const records = getStoredRegistrations();
  const updated = records.map(r => r.id === id ? { ...r, status: newStatus } : r);
  memoryStore = updated;
  safeSetItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteRegistrationRecord = (id: string): RegistrationRecord[] => {
  const records = getStoredRegistrations();
  const updated = records.filter(r => r.id !== id);
  memoryStore = updated;
  safeSetItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const resetToInitialRegistrations = (): RegistrationRecord[] => {
  memoryStore = [...INITIAL_REGISTRATION_RECORDS];
  safeSetItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATION_RECORDS));
  return memoryStore;
};

export const findRecordByTrackingCodeOrPhone = (query: string): RegistrationRecord[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const records = getStoredRegistrations();
  return records.filter(r => 
    (r.trackingCode && r.trackingCode.toLowerCase().includes(q)) ||
    (r.zaloPhone && r.zaloPhone.includes(q)) ||
    (r.studentName && r.studentName.toLowerCase().includes(q))
  );
};

