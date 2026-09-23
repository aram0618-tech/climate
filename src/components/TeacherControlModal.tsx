import React, { useState } from 'react';
import { Student, MissionId, MISSIONS_LIST } from '../types';
import { getCardById } from '../data/climateCards';
import {
  GraduationCap,
  RotateCcw,
  Award,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Zap,
  Sparkles,
  Clock,
  Check,
  XCircle,
  KeyRound,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Target,
  CheckSquare,
  Square,
} from 'lucide-react';
import { getTeacherPin, setTeacherPin } from '../utils/teacherSecurity';
import { soundManager } from '../utils/audio';

interface TeacherControlModalProps {
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
  onResetAllAbilities: () => void;
  onResetStudentSelection: (studentId: number) => void;
  onResetEntireClass: () => void;
  onAddScoreAll: (points: number) => void;
  onResetTodayScore?: () => void;
  onBatchMissionScore?: (missionId: MissionId, points: number, resetToday?: boolean) => void;
  onApproveAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onRejectAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onLockTeacherMode?: () => void;
  onSetStudentScore?: (
    studentId: number,
    newScore: number,
    newTodayScore?: number,
    missionScores?: { [key: string]: number }
  ) => void;
}

export const TeacherControlModal: React.FC<TeacherControlModalProps> = ({
  students,
  isOpen,
  onClose,
  onResetAllAbilities,
  onResetStudentSelection,
  onResetEntireClass,
  onAddScoreAll,
  onResetTodayScore,
  onBatchMissionScore,
  onApproveAbility,
  onRejectAbility,
  onLockTeacherMode,
  onSetStudentScore,
}) => {
  const [selectedStudentForReset, setSelectedStudentForReset] = useState<number>(1);
  const [confirmFullReset, setConfirmFullReset] = useState<boolean>(false);
  const [confirmResetText, setConfirmResetText] = useState<string>('');

  // Custom batch points & target mission
  const [customBatchPoints, setCustomBatchPoints] = useState<number>(5);
  const [batchTargetMission, setBatchTargetMission] = useState<MissionId>('today');
  const [batchAutoResetToday, setBatchAutoResetToday] = useState<boolean>(true);

  // Direct score adjustment state
  const [selectedStudentForScore, setSelectedStudentForScore] = useState<number>(1);
  const [inputTotalScore, setInputTotalScore] = useState<number>(0);
  const [inputTodayScore, setInputTodayScore] = useState<number>(0);
  const [inputMissionScores, setInputMissionScores] = useState<{ [key: string]: number }>({});
  const [scoreSaveMsg, setScoreSaveMsg] = useState<string | null>(null);

  // Update input fields when student selection changes or modal opens
  const activeStudent = students.find((s) => s.id === selectedStudentForScore) || students[0];

  React.useEffect(() => {
    if (activeStudent) {
      setInputTotalScore(activeStudent.score || 0);
      setInputTodayScore(activeStudent.todayScore || 0);
      setInputMissionScores(activeStudent.missionScores ? { ...activeStudent.missionScores } : {});
    }
  }, [selectedStudentForScore, activeStudent?.score, activeStudent?.todayScore, activeStudent?.missionScores, isOpen]);

  // Change PIN state
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');
  const [newPinConfirm, setNewPinConfirm] = useState<string>('');
  const [pinChangeMessage, setPinChangeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveStudentDirectScore = (e: React.FormEvent) => {
    e.preventDefault();
    const safeTotal = Math.max(0, Number(inputTotalScore) || 0);
    const safeToday = Math.max(0, Number(inputTodayScore) || 0);

    if (onSetStudentScore) {
      onSetStudentScore(selectedStudentForScore, safeTotal, safeToday, inputMissionScores);
    }
    soundManager.playScoreDing();
    setScoreSaveMsg(`${activeStudent?.number}번 ${activeStudent?.name} 학생의 점수가 안전하게 저장되었습니다!`);
    setTimeout(() => {
      setScoreSaveMsg(null);
    }, 2000);
  };

  // Find all pending ability requests
  const pendingRequests: {
    student: Student;
    type: 'major' | 'hidden';
    abilityName: string;
  }[] = [];

  students.forEach((s) => {
    const card = getCardById(s.selectedCharacterId);
    if (!card) return;
    if (s.majorAbilityPending) {
      pendingRequests.push({
        student: s,
        type: 'major',
        abilityName: card.majorAbility.name,
      });
    }
    if (s.hiddenAbilityPending) {
      pendingRequests.push({
        student: s,
        type: 'hidden',
        abilityName: card.hiddenAbility.name,
      });
    }
  });

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMessage(null);

    if (newPin.trim().length < 4) {
      setPinChangeMessage({ type: 'error', text: '비밀번호는 최소 4자리 이상이어야 합니다.' });
      return;
    }
    if (newPin.trim() !== newPinConfirm.trim()) {
      setPinChangeMessage({ type: 'error', text: '새 비밀번호 확인이 일치하지 않습니다.' });
      return;
    }

    const success = setTeacherPin(newPin.trim());
    if (success) {
      setPinChangeMessage({ type: 'success', text: '선생님 비밀번호가 안전하게 변경되었습니다!' });
      setNewPin('');
      setNewPinConfirm('');
      setTimeout(() => {
        setIsChangingPin(false);
        setPinChangeMessage(null);
      }, 1500);
      soundManager.playScoreDing();
    } else {
      setPinChangeMessage({ type: 'error', text: '비밀번호 변경에 실패했습니다.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                선생님 수업 관리 도구
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  인증됨
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                수업 진행, 능력 사용 승인, 일괄 점수 지급 및 비상 재설정
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLockTeacherMode && (
              <button
                type="button"
                onClick={() => {
                  onLockTeacherMode();
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1 transition-colors"
                title="선생님 모드를 잠그고 학생 화면으로 전환합니다"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>도구 잠금</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 my-4">
          {/* SECTION 0: PENDING ABILITY APPROVALS QUEUE */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                학생 능력 사용 승인 대기 목록
                <span className="px-2 py-0.2 rounded-full bg-amber-900 text-amber-200 text-[11px] font-black">
                  {pendingRequests.length}건 대기
                </span>
              </h4>
            </div>

            {pendingRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-1">
                현재 승인 대기 중인 학생 능력이 없습니다. 학생들이 능력을 사용 신청하면 이곳에 실시간으로 나타납니다.
              </p>
            ) : (
              <div className="space-y-2 mt-2">
                {pendingRequests.map(({ student, type, abilityName }) => (
                  <div
                    key={`${student.id}-${type}`}
                    className="flex items-center justify-between gap-2 bg-slate-900 p-2.5 rounded-xl border border-amber-800/80"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">
                        {student.number}번 {student.name} ({student.teamNumber}모둠)
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700 font-bold">
                        {type === 'major' ? '⚡ 주요능력' : '✨ 히든능력'}: {abilityName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onApproveAbility?.(student.id, type)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> 승인
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectAbility?.(student.id, type)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-bold transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> 반려
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 1: Batch Score Adjustment */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  학급 전체 점수 일괄 보너스 / 미션별 부여
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  미션을 선택하고 점수를 일괄 부여할 수 있습니다.
                </p>
              </div>

              {/* Auto reset today score toggle */}
              <label
                onClick={() => setBatchAutoResetToday(!batchAutoResetToday)}
                className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-300 hover:text-emerald-300 select-none px-2 py-1 rounded-lg bg-slate-900 border border-slate-700"
              >
                {batchAutoResetToday ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600" />
                )}
                <span>점수 부여 시 오늘 점수 0점 리셋</span>
              </label>
            </div>

            {/* Target Mission Selector */}
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                점수를 부여할 대상 선택:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {MISSIONS_LIST.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setBatchTargetMission(m.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black whitespace-nowrap transition-all border ${
                      batchTargetMission === m.id
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 5].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => {
                    const mDef = MISSIONS_LIST.find((m) => m.id === batchTargetMission);
                    if (onBatchMissionScore) {
                      onBatchMissionScore(batchTargetMission, pts, batchAutoResetToday);
                      alert(`우리 반 21명 전원에게 [${mDef?.label}] +${pts}점이 부여되었습니다.`);
                    } else {
                      onAddScoreAll(pts);
                    }
                  }}
                  className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-emerald-950 text-emerald-300 border border-slate-700 hover:border-emerald-700 text-xs font-black transition-all flex items-center gap-1"
                >
                  전원 +{pts}점
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  if (onBatchMissionScore) {
                    onBatchMissionScore(batchTargetMission, -1, false);
                  } else {
                    onAddScoreAll(-1);
                  }
                }}
                className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-950 text-rose-300 border border-slate-700 hover:border-rose-800 text-xs font-black transition-all"
              >
                전원 -1점
              </button>
            </div>

            {/* Custom Batch Points Input */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-300 font-bold whitespace-nowrap">
                [{MISSIONS_LIST.find((m) => m.id === batchTargetMission)?.label}] 점수 직접 입력:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customBatchPoints}
                  onChange={(e) => setCustomBatchPoints(Number(e.target.value))}
                  placeholder="점수"
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-black text-center focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!customBatchPoints) return;
                    const mDef = MISSIONS_LIST.find((m) => m.id === batchTargetMission);
                    if (onBatchMissionScore) {
                      onBatchMissionScore(batchTargetMission, customBatchPoints, batchAutoResetToday);
                    } else {
                      onAddScoreAll(customBatchPoints);
                    }
                    alert(`전원에게 [${mDef?.label}] ${customBatchPoints > 0 ? '+' : ''}${customBatchPoints}점이 지급되었습니다.`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-colors"
                >
                  전원 지급하기
                </button>
              </div>
            </div>

            {onResetTodayScore && (
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">오늘의 획득 점수만 0점으로 리셋:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('우리 반 전원의 오늘의 획득 점수를 모두 0으로 초기화하시겠습니까? (누적 총점 및 미션 1~6 점수는 안전하게 유지됩니다)')) {
                      onResetTodayScore();
                      alert('전원의 오늘의 점수가 0점으로 리셋되었습니다.');
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-800 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>오늘 점수 전원 0점 리셋</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 1.5: Individual Student Direct Score Editor (학생 점수 직접 입력/수정) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-black text-slate-200 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              학생 점수 직접 입력 및 수정 (클라우드 즉시 영구 보존)
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              특정 학생의 점수를 직접 숫자로 타이핑하여 수정하고 저장합니다. 새로고침해도 안전하게 유지됩니다.
            </p>

            <form onSubmit={handleSaveStudentDirectScore} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  점수 수정할 학생 선택:
                </label>
                <select
                  value={selectedStudentForScore}
                  onChange={(e) => setSelectedStudentForScore(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-indigo-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.number}번 {s.name} ({s.teamNumber}모둠) - 현재 총점: {s.score || 0}점 / 오늘: +{s.todayScore || 0}점
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">
                    누적 총계 점수:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputTotalScore}
                    onChange={(e) => setInputTotalScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-black focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">
                    오늘의 획득 점수:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputTodayScore}
                    onChange={(e) => setInputTodayScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-black focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Mission 1~6 direct editor */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <label className="text-[11px] text-slate-400 font-bold block mb-1.5">
                  미션 1 ~ 6 개별 점수 직접 수정:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {MISSIONS_LIST.filter((m) => m.id !== 'today').map((m) => (
                    <div key={m.id} className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block mb-0.5 truncate">
                        {m.shortLabel}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={inputMissionScores[m.id] ?? 0}
                        onChange={(e) =>
                          setInputMissionScores({
                            ...inputMissionScores,
                            [m.id]: Math.max(0, Number(e.target.value)),
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-amber-300 font-bold text-center focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {scoreSaveMsg ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {scoreSaveMsg}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    저장 버튼을 누르면 즉시 모든 학생 화면과 데이터베이스에 반영됩니다.
                  </span>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>점수 저장하기</span>
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 2: Reset Abilities for Next Round */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-black text-slate-200 mb-1 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              능력 사용 상태 초기화 (다음 라운드 시작)
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              새로운 기후 미션이나 2교시 시작 시, 모든 학생의 주요능력·히든능력을 다시 "미사용(1회 사용 가능)" 상태로 재충전합니다.
            </p>
            <button
              type="button"
              onClick={() => {
                onResetAllAbilities();
                alert('모든 학생의 능력이 미사용 상태로 재충전되었습니다.');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              전체 능력 사용 상태 재충전
            </button>
          </div>

          {/* SECTION 3: Emergency Student Character Reset */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-black text-slate-200 mb-1 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              특정 학생 캐릭터 선택 비상 재설정
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              학생이 실수로 다른 캐릭터를 골랐을 때, 선생님 권한으로만 해당 학생의 잠금을 풀어 다시 고를 수 있게 합니다.
            </p>
            <div className="flex items-center gap-2">
              <select
                value={selectedStudentForReset}
                onChange={(e) => setSelectedStudentForReset(Number(e.target.value))}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.number}번 {s.name} ({s.selectedCharacterId ? '선택 완료' : '미선택'})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  onResetStudentSelection(selectedStudentForReset);
                  alert('해당 학생의 캐릭터 선택이 초기화되었습니다. 이제 다시 선택할 수 있습니다.');
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black transition-colors shadow-sm"
              >
                선택 초기화
              </button>
            </div>
          </div>

          {/* SECTION 4: TEACHER PIN CHANGE (선생님 비밀번호 변경) */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                선생님 전용 보안 비밀번호 (PIN) 설정
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(!isChangingPin);
                  setPinChangeMessage(null);
                }}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline"
              >
                {isChangingPin ? '닫기' : '비밀번호 변경하기'}
              </button>
            </div>
            <p className="text-xs text-indigo-200/80 mb-2">
              아이들이 비밀번호를 추측하지 못하도록 선생님만의 비밀번호(4자리 이상)로 변경해두세요.
            </p>

            {isChangingPin && (
              <form onSubmit={handleSaveNewPin} className="mt-3 p-3 bg-slate-900 rounded-xl border border-indigo-800 space-y-2.5">
                {pinChangeMessage && (
                  <div
                    className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                      pinChangeMessage.type === 'success'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {pinChangeMessage.type === 'success' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span>{pinChangeMessage.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      새 비밀번호 (4자리 이상)
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="새 비밀번호 입력..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      새 비밀번호 확인
                    </label>
                    <input
                      type="password"
                      value={newPinConfirm}
                      onChange={(e) => setNewPinConfirm(e.target.value)}
                      placeholder="비밀번호 재입력..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsChangingPin(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-sm"
                  >
                    새 비밀번호 저장
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* SECTION 5: Reset Entire Class with Word Safeguard */}
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60">
            <h4 className="text-xs font-black text-rose-300 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              학급 전체 데이터 완전 초기화
            </h4>
            <p className="text-xs text-rose-300/80 mb-3">
              새 학기/새 수업을 위해 21명의 모든 카드 선택, 능력 사용, 점수를 0으로 리셋합니다.
            </p>
            {!confirmFullReset ? (
              <button
                type="button"
                onClick={() => setConfirmFullReset(true)}
                className="py-2 px-3 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold transition-colors"
              >
                전체 초기화 시작하기
              </button>
            ) : (
              <div className="p-3 bg-slate-900 rounded-xl border border-rose-800 space-y-2.5">
                <p className="text-xs text-rose-300 font-bold">
                  ⚠️ 실수를 방지하기 위해 아래 입력란에 <span className="underline font-black text-white">초기화</span> 라고 적고 버튼을 눌러주세요:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={confirmResetText}
                    onChange={(e) => setConfirmResetText(e.target.value)}
                    placeholder="'초기화' 입력..."
                    className="bg-slate-950 border border-rose-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500 w-36"
                  />
                  <button
                    type="button"
                    disabled={confirmResetText.trim() !== '초기화'}
                    onClick={() => {
                      onResetEntireClass();
                      setConfirmFullReset(false);
                      setConfirmResetText('');
                      onClose();
                    }}
                    className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black transition-colors shadow-sm"
                  >
                    확인 및 전체 리셋
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmFullReset(false);
                      setConfirmResetText('');
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
