export interface DefenseStats {
  cold: number;      // 추위방어 (0~5)
  heat: number;      // 더위방어 (0~5)
  humidity: number;  // 습기방어 (0~5)
  dryness: number;   // 건조방어 (0~5)
}

export interface Ability {
  name: string;        // 능력 이름
  description: string; // 설명
  shortTag: string;    // 간략 태그
}

export interface ClimateCard {
  id: string;
  name: string;            // 스콜레온, 카나트, 올리비, 타이가, 장보고
  climate: string;         // 열대 기후, 건조 기후, 온대 기후, 냉대 기후, 한대 기후
  feature: string;         // 마다가스카 카멜레온, 집이 되다 만 흙덩이 등
  colorKey: 'emerald' | 'amber' | 'lime' | 'teal' | 'sky';
  bgGradient: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  majorAbility: Ability;   // 주요 능력
  hiddenAbility: Ability;  // 히든 능력
  stats: DefenseStats;     // 방어 능력치
  lore: string;
}

export type MissionId = 'today' | 'mission1' | 'mission2' | 'mission3' | 'mission4' | 'mission5' | 'mission6';

export interface MissionDef {
  id: MissionId;
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
}

export const MISSIONS_LIST: MissionDef[] = [
  { id: 'mission1', label: '미션 1', shortLabel: 'M1', badge: '🎯', description: '1번째 탐험 미션' },
  { id: 'mission2', label: '미션 2', shortLabel: 'M2', badge: '🎯', description: '2번째 탐험 미션' },
  { id: 'mission3', label: '미션 3', shortLabel: 'M3', badge: '🎯', description: '3번째 탐험 미션' },
  { id: 'mission4', label: '미션 4', shortLabel: 'M4', badge: '🎯', description: '4번째 탐험 미션' },
  { id: 'mission5', label: '미션 5', shortLabel: 'M5', badge: '🎯', description: '5번째 탐험 미션' },
  { id: 'mission6', label: '미션 6', shortLabel: 'M6', badge: '🎯', description: '6번째 탐험 미션' },
];

export interface Student {
  id: number;
  number: number;
  name: string;
  password: string;
  selectedCharacterId: string | null;
  majorAbilityUsed: boolean;
  hiddenAbilityUsed: boolean;
  majorAbilityPending?: boolean; // 선생님 사용 승인 대기 중 (1회 제한)
  hiddenAbilityPending?: boolean; // 선생님 사용 승인 대기 중 (1회 제한)
  score: number; // 총계 점수 (누적 총점)
  todayScore: number; // 오늘의 점수 (오늘 획득 점수)
  missionScores?: { [key: string]: number }; // 미션1~6별 개별 점수
  selectedAt?: string;
  teamNumber: number; // 1~5모둠
}

export type QuizMode = 'individual' | 'team';

export interface QuizQuestion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // 이미지가 있을 수도 있고 없을 수도 있음
  mode: QuizMode; // 'individual' | 'team'
  startedAt: number; // timestamp in ms
  isActive: boolean;
  correctAnswerHint?: string;
  isAnswersRevealed?: boolean; // 정답 공개 버튼을 눌렀을 때만 아이들이 쓴 정답 공개
}

export interface QuizSubmission {
  id: string;
  questionId: string;
  studentId: number;
  studentName: string;
  characterId: string | null;
  teamNumber: number;
  answer: string;
  imageUrl?: string; // 학생이 올린 이미지 (선택 사항)
  submittedAt: number; // precise timestamp in ms for sorting
  isGraded?: boolean | null; // true: 정답, false: 오답, null: 미채점
}

export type UserRole = 'guest' | 'student' | 'teacher';

export interface CurrentUser {
  role: UserRole;
  studentId?: number;
  studentName?: string;
}

