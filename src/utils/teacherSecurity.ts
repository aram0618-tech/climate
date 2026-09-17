// Teacher Security PIN & Authentication Helper

const TEACHER_PIN_KEY = 'climate_teacher_security_pin_v1';
const DEFAULT_PIN = '0000';

export const getTeacherPin = (): string => {
  try {
    const saved = localStorage.getItem(TEACHER_PIN_KEY);
    if (saved && saved.trim().length > 0) {
      return saved.trim();
    }
  } catch (e) {
    console.error('Failed to read teacher pin from storage', e);
  }
  return DEFAULT_PIN;
};

export const setTeacherPin = (newPin: string): boolean => {
  try {
    if (!newPin || newPin.trim().length < 4) {
      return false;
    }
    localStorage.setItem(TEACHER_PIN_KEY, newPin.trim());
    return true;
  } catch (e) {
    console.error('Failed to save teacher pin', e);
    return false;
  }
};

export const verifyTeacherPin = (inputPin: string): boolean => {
  const currentPin = getTeacherPin();
  const trimmedInput = inputPin.trim();
  // Support default admin fallback only if pin wasn't changed from default
  if (currentPin === DEFAULT_PIN && (trimmedInput === 'admin' || trimmedInput === '0000')) {
    return true;
  }
  return trimmedInput === currentPin;
};
