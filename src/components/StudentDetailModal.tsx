import React from 'react';
import { Student, ClimateCard } from '../types';
import { getCardById } from '../data/climateCards';
import { CharacterAvatar } from './CharacterAvatar';
import { X, Check, Award, Lock, Zap, Sparkles, Snowflake, Sun, CloudRain, Wind } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleMajorAbility: (studentId: number) => void;
  onToggleHiddenAbility: (studentId: number) => void;
  onUpdateScore: (studentId: number, delta: number) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onToggleMajorAbility,
  onToggleHiddenAbility,
  onUpdateScore,
}) => {
  if (!isOpen || !student) return null;

  const card: ClimateCard | undefined = getCardById(student.selectedCharacterId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 font-black text-slate-700">
              {student.number}번 학생
            </span>
            <h3 className="text-lg font-black text-slate-900">{student.name}의 플레이어 카드</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {card ? (
          <div className="mt-4 space-y-4">
            {/* Visual Card Representation mimicking classroom paper cards */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 relative overflow-hidden">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <CharacterAvatar characterId={card.id} size="lg" />
                  <div>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${card.badgeBg}`}>
                      {card.climate}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 mt-1">{card.name}</h4>
                    <p className="text-xs text-slate-600 font-medium">{card.feature}</p>
                  </div>
                </div>

                {/* Score Pill */}
                <div className="bg-white px-3.5 py-2 rounded-2xl border border-slate-200 text-center shadow-2xs">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">현재 점수</div>
                  <div className="text-2xl font-black text-amber-600">{student.score}<span className="text-xs text-slate-500 font-medium ml-0.5">점</span></div>
                </div>
              </div>

              {/* Defense Stats Meter */}
              <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs mb-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium flex items-center gap-1">
                    <Snowflake className="w-3.5 h-3.5 text-sky-500" /> 추위방어:
                  </span>
                  <span className="text-sky-500 font-bold">
                    {'★'.repeat(card.stats.cold)}<span className="text-slate-300">{'★'.repeat(5 - card.stats.cold)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> 더위방어:
                  </span>
                  <span className="text-amber-500 font-bold">
                    {'★'.repeat(card.stats.heat)}<span className="text-slate-300">{'★'.repeat(5 - card.stats.heat)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-teal-500" /> 습기방어:
                  </span>
                  <span className="text-teal-500 font-bold">
                    {'★'.repeat(card.stats.humidity)}<span className="text-slate-300">{'★'.repeat(5 - card.stats.humidity)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-orange-500" /> 건조방어:
                  </span>
                  <span className="text-orange-500 font-bold">
                    {'★'.repeat(card.stats.dryness)}<span className="text-slate-300">{'★'.repeat(5 - card.stats.dryness)}</span>
                  </span>
                </div>
              </div>

              {/* Major Ability with Classroom check mark */}
              <div className="bg-white border border-amber-200 rounded-xl p-3.5 mb-3 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-amber-900 flex items-center gap-1 text-sm">
                    <Zap className="w-4 h-4 text-amber-600" /> 주요능력: {card.majorAbility.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleMajorAbility(student.id);
                      soundManager.playAbilityToggle(!student.majorAbilityUsed);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      student.majorAbilityUsed
                        ? 'bg-slate-100 text-slate-500 border-slate-200 line-through'
                        : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-2xs'
                    }`}
                  >
                    {student.majorAbilityUsed ? '사용 완료 (확인됨 ✓)' : '능력 사용하기 (1회)'}
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-5 font-medium">
                  {card.majorAbility.description}
                </p>
              </div>

              {/* Hidden Ability with Classroom check mark */}
              <div className="bg-white border border-purple-200 rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-purple-900 flex items-center gap-1 text-sm">
                    <Sparkles className="w-4 h-4 text-purple-600" /> 히든능력: {card.hiddenAbility.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleHiddenAbility(student.id);
                      soundManager.playAbilityToggle(!student.hiddenAbilityUsed);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      student.hiddenAbilityUsed
                        ? 'bg-slate-100 text-slate-500 border-slate-200 line-through'
                        : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-2xs'
                    }`}
                  >
                    {student.hiddenAbilityUsed ? '사용 완료 (확인됨 ✓)' : '능력 사용하기 (1회)'}
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-5 font-medium">
                  {card.hiddenAbility.description}
                </p>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 italic text-center">
                ※ 본 카드 분실 및 훼손 시 재발급 불가, 능력 사용 불가 (한번 선택 시 영구 고정)
              </div>
            </div>

            {/* Quick Score Adjustment in Modal */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">개인 점수 관리</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateScore(student.id, -1)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateScore(student.id, 1);
                    soundManager.playScoreDing();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs"
                >
                  +1점 추가
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <p className="text-base font-bold text-slate-700 mb-1">
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
