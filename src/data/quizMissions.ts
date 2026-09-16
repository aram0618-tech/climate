import { QuizQuestion, QuizSubmission } from '../types';

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-1',
    title: '열대 우림 기후 지역의 전통 가옥 퀴즈',
    description: '사진 속 가옥은 열대 기후 지역의 대표적인 전통 가옥입니다. 땅에서 바닥을 띄워 짓는 가옥의 명칭과 이렇게 짓는 핵심 이유(2가지)는 무엇일까요?',
    // High-resolution SVG data URI representing traditional Stilt house in tropical rainforest
    imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" width="600" height="350">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="%230f766e"/>
          <stop offset="100%" stop-color="%23134e4a"/>
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="%23064e3b"/>
          <stop offset="100%" stop-color="%23022c22"/>
        </linearGradient>
      </defs>
      <rect width="600" height="350" fill="url(%23sky)"/>
      <rect y="240" width="600" height="110" fill="url(%23ground)"/>
      <!-- Tropical Palm Trees -->
      <path d="M 80 250 Q 100 130 140 70" stroke="%2378350f" stroke-width="12" fill="none"/>
      <ellipse cx="140" cy="70" rx="45" ry="16" fill="%2310b981" transform="rotate(-30 140 70)"/>
      <ellipse cx="140" cy="70" rx="45" ry="16" fill="%23059669" transform="rotate(25 140 70)"/>
      <ellipse cx="140" cy="70" rx="45" ry="16" fill="%23047857" transform="rotate(80 140 70)"/>
      <path d="M 520 250 Q 500 120 460 60" stroke="%2378350f" stroke-width="12" fill="none"/>
      <ellipse cx="460" cy="60" rx="45" ry="16" fill="%2310b981" transform="rotate(30 460 60)"/>
      <ellipse cx="460" cy="60" rx="45" ry="16" fill="%23059669" transform="rotate(-25 460 60)"/>
      <!-- Stilt House Pillars (고상가옥 기둥) -->
      <rect x="220" y="160" width="10" height="90" fill="%23b45309"/>
      <rect x="270" y="160" width="10" height="90" fill="%23b45309"/>
      <rect x="320" y="160" width="10" height="90" fill="%23b45309"/>
      <rect x="370" y="160" width="10" height="90" fill="%23b45309"/>
      <!-- Elevated Floor Platform -->
      <rect x="200" y="150" width="200" height="16" fill="%23d97706" rx="3"/>
      <!-- House Walls -->
      <rect x="220" y="90" width="160" height="60" fill="%2392400e"/>
      <rect x="285" y="105" width="30" height="45" fill="%23451a03"/>
      <rect x="240" y="105" width="25" height="25" fill="%23fef3c7" opacity="0.8"/>
      <rect x="335" y="105" width="25" height="25" fill="%23fef3c7" opacity="0.8"/>
      <!-- Steep Thatched Roof (급경사 지붕) -->
      <polygon points="180,95 300,20 420,95" fill="%2378350f"/>
      <polygon points="190,92 300,25 410,92" fill="%23b45309"/>
      <!-- Ladder -->
      <line x1="290" y1="165" x2="310" y2="250" stroke="%23f59e0b" stroke-width="4"/>
      <line x1="305" y1="165" x2="325" y2="250" stroke="%23f59e0b" stroke-width="4"/>
      <!-- Label Banner -->
      <rect x="20" y="20" width="230" height="36" fill="%23000000" opacity="0.6" rx="8"/>
      <text x="35" y="44" fill="%2334d399" font-family="sans-serif" font-weight="bold" font-size="16">🌴 열대 우림 고상 가옥</text>
    </svg>`,
    mode: 'individual',
    startedAt: Date.now() - 1000 * 60 * 5,
    isActive: true,
    correctAnswerHint: '고상가옥 (지열·습기 차단, 해충·야생동물 방지, 통풍)',
  },
];

const QUESTIONS_STORAGE_KEY = 'climate_quiz_questions_v1';
const SUBMISSIONS_STORAGE_KEY = 'climate_quiz_submissions_v1';

export function loadStoredQuestions(): QuizQuestion[] {
  if (typeof window === 'undefined') return INITIAL_QUESTIONS;
  try {
    const raw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(INITIAL_QUESTIONS));
      return INITIAL_QUESTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (e) {
    console.error('Failed to load questions:', e);
  }
  return INITIAL_QUESTIONS;
}

export function saveStoredQuestions(questions: QuizQuestion[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed to save questions:', e);
  }
}

export function loadStoredSubmissions(): QuizSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load submissions:', e);
  }
  return [];
}

export function saveStoredSubmissions(submissions: QuizSubmission[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save submissions:', e);
  }
}
