import React from 'react';
import { Student, ClimateCard, CurrentUser } from '../types';
import { getCardById } from '../data/climateCards';
import { CharacterAvatar } from './CharacterAvatar';
import { soundManager } from '../utils/audio';
import {
  Zap,
  Sparkles,
  Award,
  Minus,
  Plus,
  Shield,
  Check,
  AlertCircle,
  User,
  Users,
} from 'lucide-react';

interface StudentCardItemProps {
  student: Student;
  currentUser: CurrentUser;
  onToggleMajorAbility: (studentId: number) => void;
  onToggleHiddenAbility: (studentId: number) => void;
  onUpdateScore: (studentId: number, delta: number) => void;
  onMultiplyScore?: (studentId: number, multiplier: number) => void;
  onClickCard?: (student: Student) => void;
}

export const StudentCardItem: React.FC<StudentCardItemProps> = ({
  student,
  currentUser,
  onToggleMajorAbility,
  onToggleHiddenAbility,
  onUpdateScore,
  onMultiplyScore,
  onClickCard,
}) => {
  const card: ClimateCard | null = getCardById(student.selectedCharacterId);
  const isLoggedInStudent = currentUser.studentId === student.id;

  const handleScoreChange = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    onUpdateScore(student.id, delta);
    soundManager.playScoreDing();
  };

  const handleDoubleScore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMultiplyScore) {
      onMultiplyScore(student.id, 2);
      soundManager.playDoubleScore();
    }
  };

  const handleMajorAbilityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!student.selectedCharacterId) return;
    onToggleMajorAbility(student.id);
    soundManager.playAbilityToggle(!student.majorAbilityUsed);
  };

  const handleHiddenAbilityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!student.selectedCharacterId) return;
    onToggleHiddenAbility(student.id);
    soundManager.playAbilityToggle(!student.hiddenAbilityUsed);
  };

  // Render stats stars concisely on bright backgrounds
  const renderMiniStars = (score: number, label: string, color: string) => (
    <span className="inline-flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-lg border border-slate-200/90 shadow-2xs">
      <span className="text-slate-500 text-[11px] font-bold">{label}</span>
      <span className={`text-[11px] tracking-tighter ${color}`}>
        {'★'.repeat(score)}
        <span className="text-slate-300">{'★'.repeat(5 - score)}</span>
      </span>
    </span>
  );

  // Card theme backgrounds in bright light mode
  const getCardBg = () => {
    if (isLoggedInStudent) {
      return 'bg-emerald-50/90 border-emerald-400 shadow-md ring-2 ring-emerald-300';
    }
    if (!card) {
      return 'bg-white hover:bg-slate-50 border-slate-200 border-dashed';
    }
    switch (card.id) {
      case 'scoleon':
        return 'bg-emerald-50/50 hover:bg-emerald-50/80 border-emerald-200/90 shadow-2xs';
      case 'qanat':
        return 'bg-amber-50/50 hover:bg-amber-50/80 border-amber-200/90 shadow-2xs';
      case 'olivi':
        return 'bg-lime-50/50 hover:bg-lime-50/80 border-lime-200/90 shadow-2xs';
      case 'taiga':
        return 'bg-teal-50/50 hover:bg-teal-50/80 border-teal-200/90 shadow-2xs';
      case 'jangbogo':
        return 'bg-sky-50/50 hover:bg-sky-50/80 border-sky-200/90 shadow-2xs';
      default:
        return 'bg-white hover:bg-slate-50 border-slate-200';
    }
  };

  return (
    <div
      id={`student-button-${student.id}`}
      onClick={() => onClickCard && onClickCard(student)}
      className={`group relative w-full text-left rounded-2xl p-3.5 sm:p-4 transition-all duration-200 border cursor-pointer ${getCardBg()}`}
    >
      {/* Active User Indicator */}
      {isLoggedInStudent && (
        <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1 shadow-sm">
          <User className="w-3 h-3" /> 내 카드
        </div>
      )}

      {/* Main Container Layout: Responsive 3-Part Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* SECTION 1: Student Identity & Selected Character */}
        <div className="flex items-center gap-3 min-w-[210px] flex-shrink-0">
          {/* Attendance Number */}
          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700 flex-shrink-0 shadow-2xs">
            {student.number}
          </div>

          {/* Character Avatar */}
          <CharacterAvatar characterId={student.selectedCharacterId} size="md" />

          {/* Name & Character Title */}
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-base font-black text-slate-900">
                {student.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 font-extrabold">
                {student.teamNumber}모둠
              </span>
              {card ? (
                <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full border ${card.badgeBg}`}>
                  {card.climate}
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-300 font-bold">
                  카드 선택 대기
                </span>
              )}
            </div>

            <div className="text-xs text-slate-600 mt-0.5 font-medium flex items-center gap-1.5">
              {card ? (
                <>
                  <span className="text-slate-900 font-extrabold">{card.name}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 text-[11px]">{card.feature}</span>
                </>
              ) : (
                <span className="text-slate-400 text-xs italic">
                  아직 기후 플레이어 카드를 선택하지 않았습니다.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Character Stats (추위, 더위, 습기, 건조 방어) */}
        <div className="flex-1 min-w-[220px]">
          {card ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {renderMiniStars(card.stats.cold, '추위', 'text-sky-500 font-bold')}
              {renderMiniStars(card.stats.heat, '더위', 'text-amber-500 font-bold')}
              {renderMiniStars(card.stats.humidity, '습기', 'text-teal-500 font-bold')}
              {renderMiniStars(card.stats.dryness, '건조', 'text-orange-500 font-bold')}
            </div>
          ) : (
            <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>상단에서 플레이어 카드를 선택하면 능력치가 표시됩니다.</span>
            </div>
          )}
        </div>

        {/* SECTION 3: Ability Usage Toggle Buttons (주요능력 / 히든능력 썼는지 안썼는지) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-shrink-0">
          {/* Major Ability Button */}
          <button
            type="button"
            disabled={!card}
            onClick={handleMajorAbilityClick}
            title={card ? `${card.majorAbility.name}: ${card.majorAbility.description}` : '캐릭터 선택 필요'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 border ${
              !card
                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                : student.majorAbilityUsed
                ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${student.majorAbilityUsed ? 'text-slate-400' : 'text-amber-600'}`} />
            <span>주요: {card ? card.majorAbility.name : '주요능력'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                student.majorAbilityUsed
                  ? 'bg-slate-200 text-slate-600'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {student.majorAbilityUsed ? '사용 완료 ✓' : '미사용'}
            </span>
          </button>

          {/* Hidden Ability Button */}
          <button
            type="button"
            disabled={!card}
            onClick={handleHiddenAbilityClick}
            title={card ? `${card.hiddenAbility.name}: ${card.hiddenAbility.description}` : '캐릭터 선택 필요'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 border ${
              !card
                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                : student.hiddenAbilityUsed
                ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-300 shadow-2xs'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${student.hiddenAbilityUsed ? 'text-slate-400' : 'text-purple-600'}`} />
            <span>히든: {card ? card.hiddenAbility.name : '히든능력'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                student.hiddenAbilityUsed
                  ? 'bg-slate-200 text-slate-600'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {student.hiddenAbilityUsed ? '사용 완료 ✓' : '미사용'}
            </span>
          </button>
        </div>

        {/* SECTION 4: Personal Score (개인 점수 & 조절 컨트롤: -1, +1, x2) */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200">
          {/* Score Badge Display */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-slate-500 font-bold">점수</span>
            <span className="text-base font-black text-slate-900 px-1">
              {student.score}
            </span>
            <span className="text-xs text-slate-500 font-bold">점</span>
          </div>

          {/* Score Adjustment Controls (-1점, +1점, x2) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => handleScoreChange(e, -1)}
              title="1점 차감"
              className="w-7 h-7 rounded-lg bg-white hover:bg-rose-50 hover:border-rose-300 text-slate-600 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition-colors text-xs font-black shadow-2xs"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => handleScoreChange(e, 1)}
              title="1점 추가"
              className="w-7 h-7 rounded-lg bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 border border-slate-200 flex items-center justify-center transition-colors text-xs font-black shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            {card?.id === 'jangbogo' && (
              <button
                type="button"
                onClick={handleDoubleScore}
                title="장보고 이끼 찾기: 점수 2배 뻥튀기!"
                className="px-2 h-7 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 flex items-center justify-center transition-colors text-[11px] font-black animate-pulse shadow-2xs"
              >
                ×2
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
