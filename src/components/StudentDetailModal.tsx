import React, { useState, useEffect } from 'react';
import { Student, ClimateCard, CurrentUser } from '../types';
import { getCardById } from '../data/climateCards';
import { CharacterAvatar } from './CharacterAvatar';
import { X, Award, Zap, Sparkles, Snowflake, Sun, CloudRain, Wind, CheckCircle2, XCircle, Clock, Edit3, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StudentDetailModalProps {
  student: Student | null;
  currentUser: CurrentUser;
  isOpen: boolean;
  onClose: () => void;
  onToggleMajorAbility: (studentId: number) => void;
  onToggleHiddenAbility: (studentId: number) => void;
  onRequestAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onApproveAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onRejectAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onUpdateScore: (studentId: number, delta: number) => void;
  onSetStudentScore?: (studentId: number, totalScore: number, todayScore?: number) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  currentUser,
  isOpen,
  onClose,
  onToggleMajorAbility,
  onToggleHiddenAbility,
  onRequestAbility,
  onApproveAbility,
  onRejectAbility,
  onUpdateScore,
  onSetStudentScore,
}) => {
  const [isDirectEditing, setIsDirectEditing] = useState(false);
  const [customTotalScore, setCustomTotalScore] = useState<number>(0);
  const [customTodayScore, setCustomTodayScore] = useState<number>(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setCustomTotalScore(student.score || 0);
      setCustomTodayScore(student.todayScore || 0);
    }
  }, [student?.id, student?.score, student?.todayScore]);

  if (!isOpen || !student) return null;

  const card: ClimateCard | undefined = getCardById(student.selectedCharacterId);
  const isTeacher = currentUser.role === 'teacher';
  const isLoggedInStudent = currentUser.studentId === student.id;

  const handleSaveDirectScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    const safeTotal = Math.max(0, Number(customTotalScore) || 0);
    const safeToday = Math.max(0, Number(customTodayScore) || 0);

    if (onSetStudentScore) {
      onSetStudentScore(student.id, safeTotal, safeToday);
    } else {
      const delta = safeTotal - (student.score || 0);
      onUpdateScore(student.id, delta);
    }

    soundManager.playScoreDing();
    setSaveSuccessMsg('점수가 성공적으로 저장되었습니다!');
    setTimeout(() => {
      setSaveSuccessMsg(null);
      setIsDirectEditing(false);
    }, 1500);
  };

  const handleMajorAbilityAction = () => {
    if (!card || student.majorAbilityUsed) return;
    if (student.majorAbilityPending) {
      if (isTeacher && onApproveAbility) {
        onApproveAbility(student.id, 'major');
      }
      return;
    }
    if (isTeacher) {
      if (onApproveAbility) onApproveAbility(student.id, 'major');
      else onToggleMajorAbility(student.id);
      return;
    }
    if (isLoggedInStudent) {
      if (confirm(`선생님께 [${card.majorAbility.name}] 능력 사용을 요청하시겠습니까? (1회만 사용 가능)`)) {
        if (onRequestAbility) onRequestAbility(student.id, 'major');
        else onToggleMajorAbility(student.id);
      }
    } else {
      alert('본인의 카드에서만 능력 사용을 요청할 수 있습니다.');
    }
  };

  const handleHiddenAbilityAction = () => {
    if (!card || student.hiddenAbilityUsed) return;
    if (student.hiddenAbilityPending) {
      if (isTeacher && onApproveAbility) {
        onApproveAbility(student.id, 'hidden');
      }
      return;
    }
    if (isTeacher) {
      if (onApproveAbility) onApproveAbility(student.id, 'hidden');
      else onToggleHiddenAbility(student.id);
      return;
    }
    if (isLoggedInStudent) {
      if (confirm(`선생님께 [${card.hiddenAbility.name}] 능력 사용을 요청하시겠습니까? (1회만 사용 가능)`)) {
        if (onRequestAbility) onRequestAbility(student.id, 'hidden');
        else onToggleHiddenAbility(student.id);
      }
    } else {
      alert('본인의 카드에서만 능력 사용을 요청할 수 있습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 font-black text-slate-200">
              {student.number}번 학생
            </span>
            <span className="text-xs px-2 py-0.5 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-800 font-black">
              {student.teamNumber}모둠
            </span>
            <h3 className="text-lg font-black text-white">{student.name}의 플레이어 카드</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {card ? (
          <div className="mt-4 space-y-4">
            {/* Visual Card Representation */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/70 relative overflow-hidden">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <CharacterAvatar characterId={card.id} size="xl" showNameBadge={true} />
                  <div>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${card.badgeBg}`}>
                      {card.climate}
                    </span>
                    <h4 className="text-xl font-black text-white mt-1">{card.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{card.feature}</p>
                  </div>
                </div>

                {/* Score Pills */}
                <div className="flex flex-col gap-1.5 items-end">
                  <div className="bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-700/80 text-right shadow-2xs">
                    <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center justify-end gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> 오늘 점수
                    </div>
                    <div className="text-lg font-black text-emerald-300">
                      +{student.todayScore || 0}<span className="text-xs text-emerald-500 font-medium ml-0.5">점</span>
                    </div>
                  </div>
                  <div className="bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-700/80 text-right shadow-2xs">
                    <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider flex items-center justify-end gap-1">
                      <Award className="w-3 h-3 text-amber-400" /> 누적 총점
                    </div>
                    <div className="text-lg font-black text-amber-300">
                      {student.score || 0}<span className="text-xs text-amber-500 font-medium ml-0.5">점</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Defense Stats Meter */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Snowflake className="w-3.5 h-3.5 text-sky-400" /> 추위방어:
                  </span>
                  <span className="text-sky-400 font-bold">
                    {'★'.repeat(card.stats.cold)}<span className="text-slate-700">{'★'.repeat(5 - card.stats.cold)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> 더위방어:
                  </span>
                  <span className="text-amber-400 font-bold">
                    {'★'.repeat(card.stats.heat)}<span className="text-slate-700">{'★'.repeat(5 - card.stats.heat)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-teal-400" /> 습기방어:
                  </span>
                  <span className="text-teal-400 font-bold">
                    {'★'.repeat(card.stats.humidity)}<span className="text-slate-700">{'★'.repeat(5 - card.stats.humidity)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-orange-400" /> 건조방어:
                  </span>
                  <span className="text-orange-400 font-bold">
                    {'★'.repeat(card.stats.dryness)}<span className="text-slate-700">{'★'.repeat(5 - card.stats.dryness)}</span>
                  </span>
                </div>
              </div>

              {/* Major Ability Section with 1-time limit & Teacher Approval */}
              <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-3.5 mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-amber-300 flex items-center gap-1 text-sm">
                    <Zap className="w-4 h-4 text-amber-400" /> 주요능력: {card.majorAbility.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {student.majorAbilityUsed ? (
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-500 border border-slate-700 line-through">
                        사용완료 (1회 소진)
                      </span>
                    ) : student.majorAbilityPending ? (
                      <div className="flex items-center gap-1">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-950 text-amber-300 border border-amber-600 animate-pulse flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 승인 대기 중
                        </span>
                        {isTeacher && (
                          <>
                            <button
                              type="button"
                              onClick={() => onApproveAbility && onApproveAbility(student.id, 'major')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black"
                            >
                              사용 승인
                            </button>
                            <button
                              type="button"
                              onClick={() => onRejectAbility && onRejectAbility(student.id, 'major')}
                              className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-bold"
                            >
                              거절
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleMajorAbilityAction}
                        className="px-3 py-1 rounded-lg text-xs font-bold transition-all bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm"
                      >
                        {isTeacher ? '사용 승인 (1회)' : '선생님께 사용 요청 (1회)'}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-5 font-medium">
                  {card.majorAbility.description}
                </p>
              </div>

              {/* Hidden Ability Section with 1-time limit & Teacher Approval */}
              <div className="bg-slate-900 border border-purple-900/40 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-purple-300 flex items-center gap-1 text-sm">
                    <Sparkles className="w-4 h-4 text-purple-400" /> 히든능력: {card.hiddenAbility.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {student.hiddenAbilityUsed ? (
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-500 border border-slate-700 line-through">
                        사용완료 (1회 소진)
                      </span>
                    ) : student.hiddenAbilityPending ? (
                      <div className="flex items-center gap-1">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-950 text-purple-300 border border-purple-600 animate-pulse flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 승인 대기 중
                        </span>
                        {isTeacher && (
                          <>
                            <button
                              type="button"
                              onClick={() => onApproveAbility && onApproveAbility(student.id, 'hidden')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black"
                            >
                              사용 승인
                            </button>
                            <button
                              type="button"
                              onClick={() => onRejectAbility && onRejectAbility(student.id, 'hidden')}
                              className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-bold"
                            >
                              거절
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleHiddenAbilityAction}
                        className="px-3 py-1 rounded-lg text-xs font-bold transition-all bg-purple-500 hover:bg-purple-400 text-white shadow-sm"
                      >
                        {isTeacher ? '사용 승인 (1회)' : '선생님께 사용 요청 (1회)'}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-5 font-medium">
                  {card.hiddenAbility.description}
                </p>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 italic text-center">
                ※ 본 카드는 1인 1회씩만 능력을 사용할 수 있으며, 선생님 승인 후 '사용완료' 처리됩니다.
              </div>
            </div>

            {/* Score Adjustment: Teacher Only */}
            {currentUser.role === 'teacher' ? (
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      선생님 점수 관리 & 직접 입력
                    </span>
                    <span className="text-[11px] text-slate-500">
                      오늘 점수: <strong className="text-emerald-400">+{student.todayScore || 0}점</strong> · 누적 총점: <strong className="text-amber-400">{student.score || 0}점</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDirectEditing(!isDirectEditing)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isDirectEditing ? '간편 버튼 모드' : '점수 직접 입력'}</span>
                  </button>
                </div>

                {isDirectEditing ? (
                  <form onSubmit={handleSaveDirectScore} className="p-3 rounded-xl bg-slate-900 border border-indigo-900/60 space-y-2.5">
                    <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                      <span>✏️ 점수 직접 수정 (저장 시 클라우드 및 새로고침 영구 보존)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">
                          누적 총계 점수:
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={customTotalScore}
                          onChange={(e) => setCustomTotalScore(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-black focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 font-bold block mb-1">
                          오늘의 획득 점수:
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={customTodayScore}
                          onChange={(e) => setCustomTodayScore(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 font-black focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      {saveSuccessMsg ? (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> {saveSuccessMsg}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          원하는 점수를 입력 후 저장 버튼을 누르세요.
                        </span>
                      )}
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-colors shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>점수 저장</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400">빠른 점수 증감:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateScore(student.id, -1)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-bold"
                      >
                        -1점
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateScore(student.id, 1);
                          soundManager.playScoreDing();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-2xs"
                      >
                        +1점
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateScore(student.id, 2);
                          soundManager.playScoreDing();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black shadow-2xs"
                      >
                        +2점
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateScore(student.id, 5);
                          soundManager.playScoreDing();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-2xs"
                      >
                        +5점
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
                🔒 점수 추가 및 변경은 선생님만 가능합니다.
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-base font-bold text-slate-300 mb-1">
              아직 선택된 기후 플레이어 카드가 없습니다.
            </p>
            <p className="text-xs">
              화면 상단에서 5개의 카드 중 하나를 선택하면 능력치와 상세 정보가 여기에 등록됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
