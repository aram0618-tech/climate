import React, { useState } from 'react';
import { Student } from '../types';
import { GraduationCap, RotateCcw, Award, CheckCircle2, AlertTriangle, X, Users, RefreshCw } from 'lucide-react';

interface TeacherControlModalProps {
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
  onResetAllAbilities: () => void;
  onResetStudentSelection: (studentId: number) => void;
  onResetEntireClass: () => void;
  onAddScoreAll: (points: number) => void;
}

export const TeacherControlModal: React.FC<TeacherControlModalProps> = ({
  students,
  isOpen,
  onClose,
  onResetAllAbilities,
  onResetStudentSelection,
  onResetEntireClass,
  onAddScoreAll,
}) => {
  const [selectedStudentForReset, setSelectedStudentForReset] = useState<number>(1);
  const [confirmFullReset, setConfirmFullReset] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h3 className="text-base font-black text-slate-900">
              선생님 수업 관리 도구
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          {/* Group 1: All Students Score Operations */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              전체 학생 점수 일괄 관리
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              학급 전체 미션 성공이나 퀴즈 완료 시 모든 학생에게 점수를 부여합니다.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onAddScoreAll(1)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 border border-slate-200 text-xs font-bold transition-colors shadow-2xs"
              >
                전원 +1점
              </button>
              <button
                type="button"
                onClick={() => onAddScoreAll(2)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 border border-slate-200 text-xs font-bold transition-colors shadow-2xs"
              >
                전원 +2점
              </button>
              <button
                type="button"
                onClick={() => onAddScoreAll(5)}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-colors shadow-sm"
              >
                전원 +5점 (미션 완료)
              </button>
            </div>
          </div>

          {/* Group 2: Reset Abilities for Next Round */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              능력 사용 상태 초기화 (다음 라운드 시작)
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              새로운 기후 미션이나 2교시 시작 시, 모든 학생의 주요능력·히든능력을 다시 "미사용" 상태로 재충전합니다. (캐릭터 및 점수는 유지됩니다)
            </p>
            <button
              type="button"
              onClick={() => {
                onResetAllAbilities();
                alert('모든 학생의 능력이 미사용 상태로 재충전되었습니다.');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              전체 능력 사용 상태 재충전
            </button>
          </div>

          {/* Group 3: Emergency Student Character Reset (Teacher override) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              특정 학생 캐릭터 선택 비상 재설정
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              학생이 실수로 다른 캐릭터를 골랐을 때, 선생님 권한으로만 해당 학생의 잠금을 풀어 다시 고를 수 있게 합니다.
            </p>
            <div className="flex items-center gap-2">
              <select
                value={selectedStudentForReset}
                onChange={(e) => setSelectedStudentForReset(Number(e.target.value))}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
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
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-colors shadow-sm"
              >
                선택 초기화
              </button>
            </div>
          </div>

          {/* Group 4: Dangerous Reset Entire Class */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <h4 className="text-xs font-black text-rose-800 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              학급 전체 데이터 완전 초기화
            </h4>
            <p className="text-xs text-rose-700 mb-3">
              새 학기/새 수업을 위해 21명의 모든 카드 선택, 능력 사용, 점수를 0으로 리셋합니다.
            </p>
            {!confirmFullReset ? (
              <button
                type="button"
                onClick={() => setConfirmFullReset(true)}
                className="py-2 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs font-bold transition-colors"
              >
                전체 초기화 준비
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onResetEntireClass();
                    setConfirmFullReset(false);
                    onClose();
                  }}
                  className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-colors shadow-sm"
                >
                  네, 모두 리셋합니다
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmFullReset(false)}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
