import React from 'react';
import { ClimateCard, Student, CurrentUser } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { Shield, Sparkles, Check, Lock, Users, AlertCircle, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';

interface ClimateCardTopListProps {
  cards: ClimateCard[];
  students: Student[];
  currentUser: CurrentUser;
  onSelectCard: (card: ClimateCard) => void;
  onOpenCardDetail?: (card: ClimateCard) => void;
}

export const ClimateCardTopList: React.FC<ClimateCardTopListProps> = ({
  cards,
  students,
  currentUser,
  onSelectCard,
}) => {
  // Find logged-in student if any
  const loggedInStudent = currentUser.studentId
    ? students.find((s) => s.id === currentUser.studentId)
    : null;

  const hasSelectedAny = !!loggedInStudent?.selectedCharacterId;

  // Render 5 stars defense meter in dark mode
  const renderStars = (score: number, statType: 'cold' | 'heat' | 'humidity' | 'dryness') => {
    const starColors = {
      cold: 'text-sky-400 font-bold',
      heat: 'text-amber-400 font-bold',
      humidity: 'text-teal-400 font-bold',
      dryness: 'text-orange-400 font-bold',
    };

    return (
      <div className="flex items-center gap-0.5 tracking-tighter">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-xs ${i <= score ? starColors[statType] : 'text-slate-700'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Card theme gradients in sleek dark mode
  const getDarkCardGradient = (cardId: string) => {
    switch (cardId) {
      case 'scoleon':
        return 'from-slate-900 via-emerald-950/40 to-slate-950 border-emerald-500/40 hover:border-emerald-400';
      case 'qanat':
        return 'from-slate-900 via-amber-950/40 to-slate-950 border-amber-500/40 hover:border-amber-400';
      case 'olivi':
        return 'from-slate-900 via-lime-950/40 to-slate-950 border-lime-500/40 hover:border-lime-400';
      case 'taiga':
        return 'from-slate-900 via-teal-950/40 to-slate-950 border-teal-500/40 hover:border-teal-400';
      case 'jangbogo':
        return 'from-slate-900 via-sky-950/40 to-slate-950 border-sky-500/40 hover:border-sky-400';
      default:
        return 'from-slate-900 to-slate-950 border-slate-800';
    }
  };

  return (
    <section className="w-full bg-slate-950 border-b border-slate-800 shadow-md px-3 py-4 sm:px-6 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Banner Title & Current User Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-black tracking-wide uppercase">
                세계 기후 대탐험
              </span>
              <span className="text-xs text-slate-400 font-medium">
                총 5종 플레이어 카드 (1인 1종 고정 선택)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              기후 플레이어 캐릭터 카드 보관함
            </h2>
          </div>

          {/* User Status Pill */}
          <div className="flex items-center gap-2">
            {currentUser.role === 'teacher' ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-bold">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>선생님 모드 (학생 카드 확인 및 승인·점수 관리)</span>
              </div>
            ) : loggedInStudent ? (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  hasSelectedAny
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-700 text-amber-300 animate-pulse'
                }`}
              >
                {hasSelectedAny ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>
                      {loggedInStudent.name} 학생: 카드 선택 완료 (영구 고정)
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>
                      {loggedInStudent.name} 학생: 아래에서 본인의 카드를 선택해주세요!
                    </span>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* 5 Cards Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {cards.map((card) => {
            // Count students who chose this card
            const assignedStudents = students.filter(
              (s) => s.selectedCharacterId === card.id
            );
            const isMyCard = loggedInStudent?.selectedCharacterId === card.id;

            return (
              <div
                key={card.id}
                className={`group relative flex flex-col justify-between rounded-2xl p-4 bg-gradient-to-b ${getDarkCardGradient(
                  card.id
                )} border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  isMyCard
                    ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-950/60'
                    : 'shadow-md'
                }`}
              >
                {/* My Card Badge */}
                {isMyCard && (
                  <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-md shadow-emerald-500/30">
                    <Check className="w-3 h-3" /> 내 카드
                  </div>
                )}

                {/* Top Section: Character Visual & Title */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${card.badgeBg}`}
                    >
                      {card.climate}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {assignedStudents.length}명
                    </span>
                  </div>

                  {/* Character Illustration */}
                  <div className="w-full flex justify-center py-2">
                    <CharacterAvatar characterId={card.id} size="xl" showNameBadge={true} />
                  </div>

                  {/* Character Name & Identity */}
                  <div className="text-center mt-2">
                    <h3 className="text-base font-black text-white">
                      {card.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {card.feature}
                    </p>
                  </div>

                  {/* Defense Stats 4-Grid */}
                  <div className="mt-3 bg-slate-900/90 rounded-xl p-2 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Snowflake className="w-3 h-3 text-sky-400" /> 추위방어
                      </span>
                      {renderStars(card.stats.cold, 'cold')}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Sun className="w-3 h-3 text-amber-400" /> 더위방어
                      </span>
                      {renderStars(card.stats.heat, 'heat')}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <CloudRain className="w-3 h-3 text-teal-400" /> 습기방어
                      </span>
                      {renderStars(card.stats.humidity, 'humidity')}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Wind className="w-3 h-3 text-orange-400" /> 건조방어
                      </span>
                      {renderStars(card.stats.dryness, 'dryness')}
                    </div>
                  </div>

                  {/* Abilities Teaser */}
                  <div className="mt-3 space-y-1.5 text-left">
                    <div className="text-xs bg-slate-900/60 p-2 rounded-lg border border-amber-900/30">
                      <span className="text-amber-400 font-black block">
                        ⚡ {card.majorAbility.name} <span className="text-[10px] text-amber-500/80">(1회)</span>
                      </span>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 font-medium leading-tight">
                        {card.majorAbility.description}
                      </p>
                    </div>

                    <div className="text-xs bg-slate-900/60 p-2 rounded-lg border border-purple-900/30">
                      <span className="text-purple-400 font-black block">
                        ✨ {card.hiddenAbility.name} <span className="text-[10px] text-purple-500/80">(1회)</span>
                      </span>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 font-medium leading-tight">
                        {card.hiddenAbility.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button: Lock-in Selection */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  {isMyCard ? (
                    <div className="w-full py-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-black flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> 내 캐릭터 고정됨
                    </div>
                  ) : hasSelectedAny ? (
                    <div className="w-full py-2 rounded-xl bg-slate-950 text-slate-600 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" /> 이미 선택 완료됨
                    </div>
                  ) : currentUser.role === 'teacher' ? (
                    <div className="w-full py-2 rounded-xl bg-slate-950 text-slate-500 border border-slate-800 text-xs text-center font-medium">
                      학생 선택 안내 카드
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectCard(card)}
                      className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> 이 캐릭터로 선택
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
