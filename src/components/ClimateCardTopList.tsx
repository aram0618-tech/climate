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

  // Render 5 stars defense meter on bright background
  const renderStars = (score: number, statType: 'cold' | 'heat' | 'humidity' | 'dryness') => {
    const starColors = {
      cold: 'text-sky-500 font-bold',
      heat: 'text-amber-500 font-bold',
      humidity: 'text-teal-500 font-bold',
      dryness: 'text-orange-500 font-bold',
    };

    return (
      <div className="flex items-center gap-0.5 tracking-tighter">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-xs ${i <= score ? starColors[statType] : 'text-slate-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Card theme gradients in bright light mode
  const getBrightCardGradient = (cardId: string) => {
    switch (cardId) {
      case 'scoleon':
        return 'from-emerald-50 via-teal-50/60 to-white border-emerald-300 hover:border-emerald-400';
      case 'qanat':
        return 'from-amber-50 via-orange-50/60 to-white border-amber-300 hover:border-amber-400';
      case 'olivi':
        return 'from-lime-50 via-emerald-50/60 to-white border-lime-300 hover:border-lime-400';
      case 'taiga':
        return 'from-teal-50 via-cyan-50/60 to-white border-teal-300 hover:border-teal-400';
      case 'jangbogo':
        return 'from-sky-50 via-blue-50/60 to-white border-sky-300 hover:border-sky-400';
      default:
        return 'from-slate-50 to-white border-slate-200';
    }
  };

  return (
    <section className="w-full bg-white border-b border-slate-200/90 shadow-2xs px-3 py-4 sm:px-6 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Title with Climate Atmosphere */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-1.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                기후 탐험대 플레이어 카드 5종
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              각 기후의 환경에 적응한 특별한 캐릭터와 고유 능력치를 확인하고 선택하세요.
              <span className="text-amber-700 font-bold ml-1.5 inline-flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 inline text-amber-600" />
                (1인 1회 선택 시 변경 불가)
              </span>
            </p>
          </div>

          {/* Prompt status for logged in student */}
          {loggedInStudent && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">접속 중:</span>
              <span className="font-black text-emerald-700">{loggedInStudent.name}</span>
              {hasSelectedAny ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  <Check className="w-3 h-3" /> 선택 완료
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 animate-pulse font-bold border border-amber-300">
                  아래 카드 중 하나를 선택하세요!
                </span>
              )}
            </div>
          )}
        </div>

        {/* 5 Climate Player Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {cards.map((card) => {
            const isMySelection = loggedInStudent?.selectedCharacterId === card.id;
            const selectionCount = students.filter((s) => s.selectedCharacterId === card.id).length;

            return (
              <div
                key={card.id}
                id={`climate-card-${card.id}`}
                className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 border bg-gradient-to-b ${getBrightCardGradient(
                  card.id
                )} ${
                  isMySelection
                    ? 'ring-2 ring-emerald-500 shadow-md border-emerald-500'
                    : 'hover:shadow-md shadow-2xs'
                }`}
              >
                {/* Active Selection Pin */}
                {isMySelection && (
                  <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3" />
                    내 캐릭터
                  </div>
                )}

                {/* Top Card Section: Avatar & Climate Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${card.badgeBg}`}>
                      {card.climate}
                    </span>
                    <div
                      className="flex items-center gap-1 text-[11px] text-slate-600 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs"
                      title="이 캐릭터를 선택한 학생 수"
                    >
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="font-bold">{selectionCount}명</span>
                    </div>
                  </div>

                  {/* Character Avatar & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <CharacterAvatar characterId={card.id} size="md" />
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-snug">
                        {card.name}
                      </h3>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {card.feature}
                      </p>
                    </div>
                  </div>

                  {/* Stats Defense Matrix (4 Elements) */}
                  <div className="bg-white/90 rounded-xl p-2.5 mb-3 border border-slate-200/90 shadow-2xs space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium flex items-center gap-1">
                        <Snowflake className="w-3 h-3 text-sky-500" /> 추위방어
                      </span>
                      {renderStars(card.stats.cold, 'cold')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-500" /> 더위방어
                      </span>
                      {renderStars(card.stats.heat, 'heat')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium flex items-center gap-1">
                        <CloudRain className="w-3 h-3 text-teal-500" /> 습기방어
                      </span>
                      {renderStars(card.stats.humidity, 'humidity')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium flex items-center gap-1">
                        <Wind className="w-3 h-3 text-orange-500" /> 건조방어
                      </span>
                      {renderStars(card.stats.dryness, 'dryness')}
                    </div>
                  </div>

                  {/* Abilities Summary */}
                  <div className="space-y-2 mb-4 text-[11px]">
                    {/* Major Ability */}
                    <div className="bg-white/95 rounded-xl p-2.5 border border-amber-200/80 shadow-2xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-extrabold text-amber-900 flex items-center gap-1">
                          ⚡ 주요: {card.majorAbility.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-amber-100 text-amber-800 border border-amber-200">
                          1회
                        </span>
                      </div>
                      <p className="text-slate-600 text-[10px] leading-tight line-clamp-2">
                        {card.majorAbility.description}
                      </p>
                    </div>

                    {/* Hidden Ability */}
                    <div className="bg-white/95 rounded-xl p-2.5 border border-purple-200/80 shadow-2xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-extrabold text-purple-900 flex items-center gap-1">
                          ✨ 히든: {card.hiddenAbility.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-purple-100 text-purple-800 border border-purple-200">
                          1회
                        </span>
                      </div>
                      <p className="text-slate-600 text-[10px] leading-tight line-clamp-2">
                        {card.hiddenAbility.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Selection Button */}
                <div className="pt-2 border-t border-slate-200/80">
                  {isMySelection ? (
                    <div className="w-full py-2 px-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <Lock className="w-3.5 h-3.5" />
                      선택 완료 (변경 불가)
                    </div>
                  ) : hasSelectedAny ? (
                    <button
                      disabled
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold cursor-not-allowed text-center"
                    >
                      다른 캐릭터 선택됨
                    </button>
                  ) : loggedInStudent ? (
                    <button
                      onClick={() => onSelectCard(card)}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-black transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      이 캐릭터 선택하기
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectCard(card)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-colors text-center"
                    >
                      선택하려면 로그인
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
