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
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
} from 'lucide-react';

interface StudentCardItemProps {
  student: Student;
  currentUser: CurrentUser;
  onToggleMajorAbility: (studentId: number) => void;
  onToggleHiddenAbility: (studentId: number) => void;
  onRequestAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onApproveAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onRejectAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onUpdateScore: (studentId: number, delta: number) => void;
  onMultiplyScore?: (studentId: number, multiplier: number) => void;
  onClickCard?: (student: Student) => void;
}

export const StudentCardItem: React.FC<StudentCardItemProps> = ({
  student,
  currentUser,
  onToggleMajorAbility,
  onToggleHiddenAbility,
  onRequestAbility,
  onApproveAbility,
  onRejectAbility,
  onUpdateScore,
  onMultiplyScore,
  onClickCard,
}) => {
  const card: ClimateCard | null = getCardById(student.selectedCharacterId);
  const isLoggedInStudent = currentUser.studentId === student.id;
  const isTeacher = currentUser.role === 'teacher';

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

  // Major Ability click
  const handleMajorAbilityAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!student.selectedCharacterId || !card) return;
    if (student.majorAbilityUsed) return; // 1회 제한: 이미 사용완료

    if (student.majorAbilityPending) {
      if (isTeacher && onApproveAbility) {
        onApproveAbility(student.id, 'major');
      }
      return;
    }

    if (isTeacher) {
      if (onApproveAbility) {
        onApproveAbility(student.id, 'major');
      } else {
        onToggleMajorAbility(student.id);
      }
      return;
    }

    // Student requesting
    if (isLoggedInStudent) {
      if (confirm(`선생님께 [${card.majorAbility.name}] 능력 사용을 요청하시겠습니까? (1회만 사용 가능)`)) {
        if (onRequestAbility) {
          onRequestAbility(student.id, 'major');
        } else {
          onToggleMajorAbility(student.id);
        }
      }
    } else {
      alert('본인의 카드에서만 능력 사용을 요청할 수 있습니다.');
    }
  };

  // Hidden Ability click
  const handleHiddenAbilityAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!student.selectedCharacterId || !card) return;
    if (student.hiddenAbilityUsed) return; // 1회 제한: 이미 사용완료

    if (student.hiddenAbilityPending) {
      if (isTeacher && onApproveAbility) {
        onApproveAbility(student.id, 'hidden');
      }
      return;
    }

    if (isTeacher) {
      if (onApproveAbility) {
        onApproveAbility(student.id, 'hidden');
      } else {
        onToggleHiddenAbility(student.id);
      }
      return;
    }

    // Student requesting
    if (isLoggedInStudent) {
      if (confirm(`선생님께 [${card.hiddenAbility.name}] 능력 사용을 요청하시겠습니까? (1회만 사용 가능)`)) {
        if (onRequestAbility) {
          onRequestAbility(student.id, 'hidden');
        } else {
          onToggleHiddenAbility(student.id);
        }
      }
    } else {
      alert('본인의 카드에서만 능력 사용을 요청할 수 있습니다.');
    }
  };

  // Render stats stars concisely in dark theme
  const renderMiniStars = (score: number, label: string, color: string) => (
    <span className="inline-flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800 text-xs">
      <span className="text-slate-400 text-[11px] font-medium">{label}</span>
      <span className={`text-[11px] tracking-tighter ${color}`}>
        {'★'.repeat(score)}
        <span className="text-slate-700">{'★'.repeat(5 - score)}</span>
      </span>
    </span>
  );

  // Dark card background with climate subtle glows
  const getCardBg = () => {
    if (isLoggedInStudent) {
      return 'bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50';
    }
    if (!card) {
      return 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 border-dashed text-slate-400';
    }
    switch (card.id) {
      case 'scoleon':
        return 'bg-slate-900/95 hover:bg-slate-900 border-slate-800 hover:border-emerald-500/50';
      case 'qanat':
        return 'bg-slate-900/95 hover:bg-slate-900 border-slate-800 hover:border-amber-500/50';
      case 'olivi':
        return 'bg-slate-900/95 hover:bg-slate-900 border-slate-800 hover:border-lime-500/50';
      case 'taiga':
        return 'bg-slate-900/95 hover:bg-slate-900 border-slate-800 hover:border-teal-500/50';
      case 'jangbogo':
        return 'bg-slate-900/95 hover:bg-slate-900 border-slate-800 hover:border-sky-500/50';
      default:
        return 'bg-slate-900/90 hover:bg-slate-900 border-slate-800';
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
        <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-md shadow-emerald-500/30">
          <User className="w-3 h-3" /> 내 카드
        </div>
      )}

      {/* Main Container Layout: Responsive 3-Part Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* SECTION 1: Student Identity & Selected Character */}
        <div className="flex items-center gap-3 min-w-[210px] flex-shrink-0">
          {/* Attendance Number */}
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-slate-300 flex-shrink-0">
            {student.number}
          </div>

          {/* Character Avatar */}
          <CharacterAvatar characterId={student.selectedCharacterId} size="md" showNameBadge={false} />

          {/* Name & Character Title */}
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-base font-black text-white">
                {student.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-800/80 font-extrabold">
                {student.teamNumber}모둠
              </span>
              {card ? (
                <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full border ${card.badgeBg}`}>
                  {card.climate}
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-950/50 text-amber-300 border border-amber-800/80 font-bold">
                  카드 선택 대기
                </span>
              )}
            </div>

            <div className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-1.5">
              {card ? (
                <>
                  <span className="text-slate-200 font-extrabold">{card.name}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 text-[11px]">{card.feature}</span>
                </>
              ) : (
                <span className="text-slate-500 text-xs italic">
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
              {renderMiniStars(card.stats.cold, '추위', 'text-sky-400 font-bold')}
              {renderMiniStars(card.stats.heat, '더위', 'text-amber-400 font-bold')}
              {renderMiniStars(card.stats.humidity, '습기', 'text-teal-400 font-bold')}
              {renderMiniStars(card.stats.dryness, '건조', 'text-orange-400 font-bold')}
            </div>
          ) : (
            <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>상단에서 플레이어 카드를 선택하면 능력치가 표시됩니다.</span>
            </div>
          )}
        </div>

        {/* SECTION 3: Ability Usage (1회 제한 & 선생님 승인제) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-shrink-0">
          {/* Major Ability Button */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!card || student.majorAbilityUsed}
              onClick={handleMajorAbilityAction}
              title={
                card
                  ? `${card.majorAbility.name}: ${card.majorAbility.description} (1회만 사용 가능)`
                  : '캐릭터 선택 필요'
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 border ${
                !card
                  ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                  : student.majorAbilityUsed
                  ? 'bg-slate-950 text-slate-500 border-slate-800 line-through opacity-70 cursor-not-allowed'
                  : student.majorAbilityPending
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500 animate-pulse ring-1 ring-amber-500/50'
                  : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border-amber-600/60'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${student.majorAbilityUsed ? 'text-slate-500' : 'text-amber-400'}`} />
              <span>주요: {card ? card.majorAbility.name : '주요능력'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  student.majorAbilityUsed
                    ? 'bg-slate-800 text-slate-400'
                    : student.majorAbilityPending
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-amber-600/50 text-amber-100'
                }`}
              >
                {student.majorAbilityUsed
                  ? '사용완료'
                  : student.majorAbilityPending
                  ? '승인 대기 중'
                  : '1회 가능'}
              </span>
            </button>

            {/* Teacher Inline Approval Buttons when pending */}
            {isTeacher && student.majorAbilityPending && (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  title="선생님 권한: 주요능력 사용 승인"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onApproveAbility) onApproveAbility(student.id, 'major');
                  }}
                  className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] shadow-sm flex items-center gap-0.5"
                >
                  <CheckCircle2 className="w-3 h-3" /> 승인
                </button>
                <button
                  type="button"
                  title="선생님 권한: 요청 거절"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRejectAbility) onRejectAbility(student.id, 'major');
                  }}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-700"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Hidden Ability Button */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!card || student.hiddenAbilityUsed}
              onClick={handleHiddenAbilityAction}
              title={
                card
                  ? `${card.hiddenAbility.name}: ${card.hiddenAbility.description} (1회만 사용 가능)`
                  : '캐릭터 선택 필요'
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 border ${
                !card
                  ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                  : student.hiddenAbilityUsed
                  ? 'bg-slate-950 text-slate-500 border-slate-800 line-through opacity-70 cursor-not-allowed'
                  : student.hiddenAbilityPending
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500 animate-pulse ring-1 ring-purple-500/50'
                  : 'bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border-purple-600/60'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${student.hiddenAbilityUsed ? 'text-slate-500' : 'text-purple-400'}`} />
              <span>히든: {card ? card.hiddenAbility.name : '히든능력'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  student.hiddenAbilityUsed
                    ? 'bg-slate-800 text-slate-400'
                    : student.hiddenAbilityPending
                    ? 'bg-purple-500 text-slate-950 font-black'
                    : 'bg-purple-600/50 text-purple-100'
                }`}
              >
                {student.hiddenAbilityUsed
                  ? '사용완료'
                  : student.hiddenAbilityPending
                  ? '승인 대기 중'
                  : '1회 가능'}
              </span>
            </button>

            {/* Teacher Inline Approval Buttons when pending */}
            {isTeacher && student.hiddenAbilityPending && (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  title="선생님 권한: 히든능력 사용 승인"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onApproveAbility) onApproveAbility(student.id, 'hidden');
                  }}
                  className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] shadow-sm flex items-center gap-0.5"
                >
                  <CheckCircle2 className="w-3 h-3" /> 승인
                </button>
                <button
                  type="button"
                  title="선생님 권한: 요청 거절"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRejectAbility) onRejectAbility(student.id, 'hidden');
                  }}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-700"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: Today's Score & Cumulative Total Score (오늘의 점수 & 총계 점수) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          {/* Today's Score Pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 shadow-2xs"
            title="오늘 수업에서 획득한 점수"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-[11px] font-extrabold text-emerald-400 whitespace-nowrap">오늘</span>
            <span className="text-sm font-black text-emerald-200 px-0.5">
              +{student.todayScore || 0}
            </span>
            <span className="text-[11px] font-bold text-emerald-400">점</span>
          </div>

          {/* Total Score Pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/50 border border-amber-700/60 text-amber-300 shadow-2xs"
            title="누적 총계 점수"
          >
            <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] font-extrabold text-amber-400 whitespace-nowrap">총계</span>
            <span className="text-sm font-black text-amber-200 px-0.5">
              {student.score || 0}
            </span>
            <span className="text-[11px] font-bold text-amber-400">점</span>
          </div>

          {/* Teacher-Only Score Adjustment Controls (오직 선생님만 점수 추가/차감 가능) */}
          {currentUser.role === 'teacher' && (
            <div className="flex items-center gap-1 pl-1 sm:border-l sm:border-slate-800" title="선생님 전용 점수 관리">
              <button
                type="button"
                onClick={(e) => handleScoreChange(e, -1)}
                title="1점 차감 (선생님 전용)"
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-950 hover:border-rose-700 text-slate-300 hover:text-rose-300 border border-slate-700 flex items-center justify-center transition-colors text-xs font-black shadow-2xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => handleScoreChange(e, 1)}
                title="1점 추가 (선생님 전용)"
                className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors text-xs font-black shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {card?.id === 'jangbogo' && (
                <button
                  type="button"
                  onClick={handleDoubleScore}
                  title="장보고 이끼 찾기: 점수 2배 뻥튀기! (선생님 전용)"
                  className="px-2 h-7 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-600 flex items-center justify-center transition-colors text-[11px] font-black animate-pulse shadow-2xs"
                >
                  ×2
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
