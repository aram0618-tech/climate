import { ClimateCard } from '../types';

export const CLIMATE_CARDS: ClimateCard[] = [
  {
    id: 'scoleon',
    name: '스콜레온',
    climate: '열대 기후',
    feature: '마다가스카 카멜레온',
    colorKey: 'emerald',
    bgGradient: 'from-emerald-950/80 via-emerald-900/50 to-teal-950/70',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    accentColor: '#10b981',
    majorAbility: {
      name: '위장술!',
      description: '나만 몰래 숨어서 핸드폰 검색 찬스 1회 가능',
      shortTag: '핸드폰 검색 찬스 1회',
    },
    hiddenAbility: {
      name: '눈알 360도 회전',
      description: '모든 모둠의 정답을 한 바퀴 보고 올 수 있음',
      shortTag: '모든 모둠 정답 염탐',
    },
    stats: {
      cold: 1,      // 추위방어 ★☆☆☆☆
      heat: 4,      // 더위방어 ★★★★☆
      humidity: 3,  // 습기방어 ★★★☆☆
      dryness: 2,   // 건조방어 ★★☆☆☆
    },
    lore: '고온다습한 열대우림에 서식하며 주변 환경에 맞춰 색을 바꾸는 마다가스카 카멜레온',
  },
  {
    id: 'qanat',
    name: '카나트',
    climate: '건조 기후',
    feature: '집이 되다 만 흙덩이',
    colorKey: 'amber',
    bgGradient: 'from-amber-950/80 via-amber-900/50 to-yellow-950/70',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    accentColor: '#f59e0b',
    majorAbility: {
      name: '태양열과 모래 차단',
      description: '‘주생활’과 (조금이라도) 관련된 미션에서 1회 추가 힌트를 받을 수 있음',
      shortTag: '주생활 미션 힌트 1회',
    },
    hiddenAbility: {
      name: '온도 유지',
      description: '기후로 인한 모둠원 능력 제한을 1회 풀어줄 수 있음',
      shortTag: '모둠원 능력제한 해제',
    },
    stats: {
      cold: 4,      // 추위방어 ★★★★☆
      heat: 5,      // 더위방어 ★★★★★
      humidity: 1,  // 습기방어 ★☆☆☆☆
      dryness: 5,   // 건조방어 ★★★★★
    },
    lore: '사막의 극심한 일교차와 뜨거운 햇볕을 이겨내는 흙벽돌 전통 가옥의 수호 정령',
  },
  {
    id: 'olivi',
    name: '올리비',
    climate: '온대 기후',
    feature: '인간과 비슷한 지성체',
    colorKey: 'lime',
    bgGradient: 'from-lime-950/80 via-emerald-950/40 to-teal-950/60',
    badgeBg: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    textColor: 'text-lime-400',
    borderColor: 'border-lime-500/40',
    accentColor: '#84cc16',
    majorAbility: {
      name: '농사 짓기',
      description: '‘식생활’과 (조금이라도) 관련된 미션에서 1회 추가 힌트를 받을 수 있음',
      shortTag: '식생활 미션 힌트 1회',
    },
    hiddenAbility: {
      name: '모든 기후 적응 능력',
      description: '기후로 인한 모둠원 능력 제한을 1회 풀어줄 수 있음',
      shortTag: '모든 기후 적응 / 제한 해제',
    },
    stats: {
      cold: 2,      // 추위방어 ★★☆☆☆
      heat: 2,      // 더위방어 ★★☆☆☆
      humidity: 2,  // 습기방어 ★★☆☆☆
      dryness: 2,   // 건조방어 ★★☆☆☆
    },
    lore: '사계절이 뚜렷하고 온화한 지중해·온대 지역에서 농경과 문화를 꽃피운 지성체',
  },
  {
    id: 'taiga',
    name: '타이가',
    climate: '냉대 기후',
    feature: '침엽수',
    colorKey: 'teal',
    bgGradient: 'from-teal-950/80 via-slate-900/60 to-cyan-950/70',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    textColor: 'text-teal-400',
    borderColor: 'border-teal-500/40',
    accentColor: '#14b8a6',
    majorAbility: {
      name: '종이 만들기',
      description: '교과서 못 보는 미션에서 교과서를 1회 볼 수 있음',
      shortTag: '교과서 1회 열람',
    },
    hiddenAbility: {
      name: '뿌리에서 버섯 키우기',
      description: '‘식생활’과 (조금이라도) 관련된 미션에서 1회 추가 힌트를 받을 수 있음',
      shortTag: '식생활 미션 힌트 1회',
    },
    stats: {
      cold: 5,      // 추위방어 ★★★★★
      heat: 0,      // 더위방어 ☆☆☆☆☆
      humidity: 2,  // 습기방어 ★★☆☆☆
      dryness: 2,   // 건조방어 ★★☆☆☆
    },
    lore: '영구동토층 위 끝없이 펼쳐진 시베리아·캐나다 타이가 침엽수림의 듬직한 전나무',
  },
  {
    id: 'jangbogo',
    name: '장보고',
    climate: '한대 기후',
    feature: '루돌프가 되지 못한 순록',
    colorKey: 'sky',
    bgGradient: 'from-sky-950/80 via-blue-900/50 to-indigo-950/70',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    accentColor: '#0ea5e9',
    majorAbility: {
      name: '이끼 찾기 (숨은 점수 발견!)',
      description: '미션 1개에 한해 딱 1번 모둠원 다 같이 점수 2배 뻥튀기',
      shortTag: '모둠 점수 2배 뻥튀기',
    },
    hiddenAbility: {
      name: '3% 확률로 빛나는 코',
      description: '선생님과 가위바위보를 해서 ‘비기면’ 핸드폰 1회 사용 찬스',
      shortTag: '비기면 핸드폰 찬스',
    },
    stats: {
      cold: 5,      // 추위방어 ★★★★★
      heat: 0,      // 더위방어 ☆☆☆☆☆
      humidity: 1,  // 습기방어 ★☆☆☆☆
      dryness: 3,   // 건조방어 ★★★☆☆
    },
    lore: '눈보라 치는 툰드라와 빙설 기후에서 이끼를 찾아 헤매는 의지의 순록 탐험가',
  },
];

export function getCardById(id: string | null): ClimateCard | undefined {
  if (!id) return undefined;
  return CLIMATE_CARDS.find((c) => c.id === id);
}
