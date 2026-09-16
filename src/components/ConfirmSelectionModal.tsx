import React from 'react';
import { ClimateCard, Student } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { AlertTriangle, Lock, CheckCircle, X, Shield, Sparkles, Zap } from 'lucide-react';

interface ConfirmSelectionModalProps {
  card: ClimateCard | null;
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (studentId: number, cardId: string) => void;
}

export const ConfirmSelectionModal: React.FC<ConfirmSelectionModalProps> = ({
  card,
  student,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !card || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Alert */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-amber-600 font-black text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>플레이어 카드 선택 확인</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="my-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-amber-900">
            <p className="font-black text-amber-800">
              ⚠️ 주의: 한 번 선택하면 절대 바꿀 수 없습니다!
            </p>
            <p className="mt-0.5 text-amber-800/90 font-medium">
              신중하게 결정하세요. 선택 완료 후에는 다른 캐릭터로 재선택할 수 없습니다.
            </p>
          </div>
        </div>

        {/* Selected Card Info Card */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 mb-5">
          <div className="flex items-center gap-3.5 mb-3">
            <CharacterAvatar characterId={card.id} size="lg" />
            <div>
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${card.badgeBg}`}>
                {card.climate}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {card.name}
              </h3>
              <p className="text-xs text-slate-600 font-medium">{card.feature}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium">추위방어:</span>{' '}
              <span className="text-sky-500 font-black">{'★'.repeat(card.stats.cold)}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">더위방어:</span>{' '}
              <span className="text-amber-500 font-black">{'★'.repeat(card.stats.heat)}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">습기방어:</span>{' '}
              <span className="text-teal-500 font-black">{'★'.repeat(card.stats.humidity)}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">건조방어:</span>{' '}
              <span className="text-orange-500 font-black">{'★'.repeat(card.stats.dryness)}</span>
            </div>
          </div>

          <div className="mt-3 space-y-1 text-xs">
            <p className="text-amber-800 flex items-center gap-1 font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-600" /> 주요: {card.majorAbility.name}
            </p>
            <p className="text-slate-600 text-[11px] pl-4">{card.majorAbility.description}</p>
            <p className="text-purple-800 flex items-center gap-1 font-bold pt-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> 히든: {card.hiddenAbility.name}
            </p>
            <p className="text-slate-600 text-[11px] pl-4">{card.hiddenAbility.description}</p>
          </div>
        </div>

        {/* Student confirmation prompt */}
        <div className="text-center mb-5 text-sm">
          <span className="text-slate-500 font-medium">선택 학생: </span>
          <span className="font-black text-emerald-700 text-base">{student.number}번 {student.name}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            다시 생각하기
          </button>
          <button
            type="button"
            onClick={() => onConfirm(student.id, card.id)}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-xs transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            최종 확정 (변경 불가)
          </button>
        </div>
      </div>
    </div>
  );
};
