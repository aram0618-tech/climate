import { Student } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  { id: 1, number: 1, name: '강소율', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 1 },
  { id: 2, number: 2, name: '권지용', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 1 },
  { id: 3, number: 3, name: '김민석', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 1 },
  { id: 4, number: 4, name: '김산',   password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 1 },
  { id: 5, number: 5, name: '김승연', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 2 },
  { id: 6, number: 6, name: '김태연', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 2 },
  { id: 7, number: 7, name: '김태은', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 2 },
  { id: 8, number: 8, name: '김태준', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 2 },
  { id: 9, number: 9, name: '박진',   password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 3 },
  { id: 10, number: 10, name: '배지우', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 3 },
  { id: 11, number: 11, name: '신예준', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 3 },
  { id: 12, number: 12, name: '엄도현', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 3 },
  { id: 13, number: 13, name: '윤송이', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 4 },
  { id: 14, number: 14, name: '이채원', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 4 },
  { id: 15, number: 15, name: '임나윤', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 4 },
  { id: 16, number: 16, name: '장건희', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 4 },
  { id: 17, number: 17, name: '장희성', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 5 },
  { id: 18, number: 18, name: '정성은', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 5 },
  { id: 19, number: 19, name: '정수현', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 5 },
  { id: 20, number: 20, name: '정효원', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 5 },
  { id: 21, number: 21, name: '조수경', password: '1234', selectedCharacterId: null, majorAbilityUsed: false, hiddenAbilityUsed: false, score: 0, teamNumber: 5 },
];

const STORAGE_KEY = 'climate_explorer_students_v2';

export function loadStoredStudents(): Student[] {
  if (typeof window === 'undefined') return INITIAL_STUDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === INITIAL_STUDENTS.length) {
      return parsed.map((s, idx) => ({
        ...INITIAL_STUDENTS[idx],
        ...s,
        teamNumber: s.teamNumber || INITIAL_STUDENTS[idx].teamNumber,
      }));
    }
  } catch (e) {
    console.error('Failed to load students from localStorage:', e);
  }
  return INITIAL_STUDENTS;
}

export function saveStoredStudents(students: Student[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage:', e);
  }
}

export function resetAllStudents(): Student[] {
  if (typeof window === 'undefined') return INITIAL_STUDENTS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
}
