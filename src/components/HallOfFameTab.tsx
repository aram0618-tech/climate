import React, { useState } from 'react';
import { Student, ClimateCard, CurrentUser } from '../types';
import { getCardById } from '../data/climateCards';
import { CharacterAvatar } from './CharacterAvatar';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Sparkles,
  Star,
  PartyPopper,
  Flame,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HallOfFameTabProps {
  students: Student[];
  currentUser: CurrentUser;
  onSelectStudent: (student: Student) => void;
}

type RankingCriteria = 'total' | 'today';

interface RankedStudent {
  rank: number;
  student: Student;
  scoreValue: number;
}

export const HallOfFameTab: React.FC<HallOfFameTabProps> = ({
  students,
  currentUser,
  onSelectStudent,
}) => {
  const [rankingCriteria, setRankingCriteria] = useState<RankingCriteria>('total');
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Trigger celebration fanfare & confetti effect
  const handleTriggerCelebration = () => {
    soundManager.playVictoryFanfare();
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  // Compute Student Rankings for Top 3 (Dense ranking so ties share the same rank and same horizontal line)
  const getRankedStudents = (): RankedStudent[] => {
    // Sort students by score descending, then by student number ascending
    const scoredStudents = [...students]
      .map((student) => ({
        student,
        scoreValue: rankingCriteria === 'today' ? (student.todayScore || 0) : (student.score || 0),
      }))
      .sort((a, b) => {
        if (b.scoreValue !== a.scoreValue) {
          return b.scoreValue - a.scoreValue;
        }
        return a.student.number - b.student.number;
      });

    const hasScoresAboveZero = scoredStudents.some((s) => s.scoreValue > 0);
    // If any student has score > 0, rank students with positive score; otherwise keep all students with score 0
    const candidateStudents = hasScoresAboveZero
      ? scoredStudents.filter((s) => s.scoreValue > 0)
      : scoredStudents;

    // Get unique scores in descending order
    const uniqueScores = Array.from(new Set(candidateStudents.map((s) => s.scoreValue)));
    // Top 3 distinct scores: index 0 = 1위, index 1 = 2위, index 2 = 3위
    const top3Scores = uniqueScores.slice(0, 3);

    const rankedList: RankedStudent[] = [];
    candidateStudents.forEach((item) => {
      const rankIndex = top3Scores.indexOf(item.scoreValue);
      if (rankIndex !== -1) {
        rankedList.push({
          rank: rankIndex + 1,
          student: item.student,
          scoreValue: item.scoreValue,
        });
      }
    });

    return rankedList;
  };

  const rankedStudents = getRankedStudents();

  // Find students by exact rank
  const firstRank = rankedStudents.filter((r) => r.rank === 1);
  const secondRank = rankedStudents.filter((r) => r.rank === 2);
  const thirdRank = rankedStudents.filter((r) => r.rank === 3);

  // Helper title & commentary for top 3
  const getRankTitle = (rank: number) => {
    switch (rank) {
      case 1:
        return '지구 수호 총사령관 (Grand Champion)';
      case 2:
        return '푸른 행성 수호 에이스 (Master Runner-up)';
      case 3:
        return '기후 행동 프론티어 (Climate Hero)';
      default:
        return '기특이 명예 수호자';
    }
  };

  const getRankCommentary = (rank: number) => {
    switch (rank) {
      case 1:
        return '기후 위기 극복을 위한 최고의 활약과 눈부신 점수를 기록한 명예의 전당 1위 챔피언입니다!';
      case 2:
        return '지구를 지키는 열정과 놀라운 점수로 2위를 달성한 자랑스러운 기특이입니다!';
      case 3:
        return '꾸준한 미션 해결과 성실한 참여로 3위 시상대에 당당히 입성한 기후 영웅입니다!';
      default:
        return '환경을 사랑하는 우리 반 멋진 기특이입니다!';
    }
  };

  // Render an honorary card for Top 3
  const renderHonoraryCard = (item: RankedStudent) => {
    const card = getCardById(item.student.selectedCharacterId);
    const isFirst = item.rank === 1;
    const isSecond = item.rank === 2;

    return (
      <div
        key={item.student.id}
        onClick={() => onSelectStudent(item.student)}
        className={`rounded-2xl p-5 border cursor-pointer transition-all transform hover:-translate-y-1 shadow-lg relative overflow-hidden ${
          isFirst
            ? 'bg-gradient-to-b from-slate-900 to-amber-950/40 border-amber-400/80 ring-1 ring-amber-400/30'
            : isSecond
            ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-500'
            : 'bg-gradient-to-b from-slate-900 to-amber-950/20 border-amber-800'
        }`}
      >
        {/* Rank Pill */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm ${
              isFirst
                ? 'bg-amber-500 text-slate-950'
                : isSecond
                ? 'bg-slate-300 text-slate-950'
                : 'bg-amber-700 text-white'
            }`}
          >
            {isFirst ? <Crown className="w-3.5 h-3.5" /> : <Medal className="w-3.5 h-3.5" />}
            <span>{item.rank}위 ({isFirst ? '금' : isSecond ? '은' : '동'}메달)</span>
          </span>

          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
            {item.student.teamNumber}모둠
          </span>
        </div>

        {/* Student & Character Block */}
        <div className="flex items-center gap-3.5 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl p-0.5 border-2 flex-shrink-0 flex items-center justify-center overflow-hidden ${
              isFirst
                ? 'border-amber-400 bg-amber-950/50'
                : isSecond
                ? 'border-slate-400 bg-slate-800'
                : 'border-amber-700 bg-amber-950/30'
            }`}
          >
            <CharacterAvatar
              characterId={item.student.selectedCharacterId}
              size="sm"
            />
          </div>
          <div>
            <h4 className="text-base font-black text-white flex items-center gap-1.5">
              <span>{item.student.number}번 {item.student.name}</span>
            </h4>
            <p className="text-xs font-bold text-amber-300 mt-0.5">
              {getRankTitle(item.rank)}
            </p>
            <p className="text-[11px] text-slate-400">
              캐릭터: {card ? card.name : '미선택'} ({card?.climate || '기후 없음'})
            </p>
          </div>
        </div>

        {/* Scores Breakdown */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-3">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">오늘 획득 점수</span>
            <span className="text-sm font-black text-emerald-400">
              +{item.student.todayScore || 0}점
            </span>
          </div>
          <div className="text-center border-l border-slate-800">
            <span className="text-[10px] text-slate-400 block">누적 총계 점수</span>
            <span className="text-sm font-black text-amber-400">
              {item.student.score || 0}점
            </span>
          </div>
        </div>

        {/* Praise Commentary */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
          "{getRankCommentary(item.rank)}"
        </p>

        <div className="mt-3 text-right">
          <span className="text-[11px] font-bold text-amber-400 hover:underline">
            상세 카드 보기 →
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-3 py-6 sm:px-6">
      {/* HEADER: Hall of Fame Title & Celebration Controls */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-500/40 p-6 md:p-8 shadow-2xl mb-8">
        {/* Shimmering Golden Ambient Backing */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black mb-2.5 shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>HONORARY PODIUM · TOP 3 CHAMPIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
              <span>기특이 명예의 전당</span>
              <span className="text-sm sm:text-base px-2.5 py-0.5 rounded-xl bg-amber-500 text-slate-950 font-black">
                1·2·3등 존
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              기후 위기 대응과 환경 미션을 가장 멋지게 해결한 우리 반 <strong className="text-amber-400 font-black">1등, 2등, 3등</strong> 기특이들을 헌액하는 영광의 무대입니다.
            </p>
          </div>

          {/* Right Action: Sound & Criteria Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={handleTriggerCelebration}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-amber-500/25 transition-all transform active:scale-95"
            >
              <PartyPopper className="w-4 h-4" />
              <span>축하 팡파레 울리기 🎉</span>
            </button>
          </div>
        </div>

        {/* RANKING CRITERIA TABS */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setRankingCriteria('total')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                rankingCriteria === 'total'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>누적 총점 순위 (1·2·3등)</span>
            </button>

            <button
              type="button"
              onClick={() => setRankingCriteria('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                rankingCriteria === 'today'
                  ? 'bg-emerald-500 text-slate-950 shadow-md scale-102'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>오늘 획득 점수 순위 (1·2·3등)</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>본 존에서는 상위 <strong>1·2·3등</strong> 학생만 특별 헌액됩니다.</span>
          </span>
        </div>
      </div>

      {/* CELEBRATION BANNER (When clicked) */}
      {showCelebration && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-center animate-bounce shadow-xl">
          <p className="text-base sm:text-lg font-black text-amber-300 flex items-center justify-center gap-2">
            <span>🎉</span>
            <span>영광의 기특이 명예의 전당 1·2·3등 챔피언들에게 뜨거운 박수를 보냅니다!</span>
            <span>👏</span>
          </p>
        </div>
      )}

      {/* STUDENT RANKINGS (INDIVIDUAL TOP 3) */}
      <div>
        {rankedStudents.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-200 mb-1">
              아직 명예의 전당에 등록된 점수가 없습니다.
            </p>
            <p className="text-xs">
              수업 활동과 퀴즈 미션에 참여하여 첫 번째 1·2·3등의 주인공이 되어보세요!
            </p>
          </div>
        ) : (
          <>
            {/* SECTION A: PODIUM STAGE (1등 가운데, 2등 왼쪽, 3등 오른쪽) */}
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 md:p-10 mb-8 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center justify-center gap-2">
                  <Medal className="w-5 h-5 text-amber-400" />
                  <span>영예의 시상대 (Top 3 Podium)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {rankingCriteria === 'today' ? '오늘 획득 점수' : '누적 총계 점수'} 기준 상위 3위 입상자
                </p>
              </div>

              {/* PODIUM COLUMNS: Silver (left), Gold (center highest), Bronze (right). Same score students are placed horizontally side-by-side! */}
              <div className="flex flex-col md:flex-row items-end justify-center gap-6 max-w-5xl mx-auto">
                {/* 2ND PLACE (SILVER - LEFT) */}
                <div className="order-2 md:order-1 flex flex-col items-center flex-1 min-w-[220px] w-full">
                  {secondRank.length > 0 ? (
                    <div className="w-full flex flex-col items-center">
                      {/* Silver Badge */}
                      <div className="mb-3 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-600 text-slate-200 text-xs font-black shadow-md">
                        <Medal className="w-4 h-4 text-slate-300" />
                        <span>🥈 2위 (은메달){secondRank.length > 1 ? ` · 공동 ${secondRank.length}명` : ''}</span>
                      </div>

                      {/* Same score students horizontally aligned side-by-side on the same line */}
                      <div className="w-full flex flex-row flex-wrap items-end justify-center gap-3 sm:gap-4 mb-3">
                        {secondRank.map((item) => {
                          const card = getCardById(item.student.selectedCharacterId);
                          return (
                            <div
                              key={item.student.id}
                              onClick={() => onSelectStudent(item.student)}
                              className="flex flex-col items-center cursor-pointer group p-1 transition-transform hover:scale-105"
                              title="클릭하여 캐릭터 카드 상세 보기"
                            >
                              {/* Avatar */}
                              <div className="relative mb-2">
                                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-slate-800 border-2 border-slate-400 p-1 shadow-lg overflow-hidden flex items-center justify-center">
                                  <CharacterAvatar
                                    characterId={item.student.selectedCharacterId}
                                    size="md"
                                  />
                                </div>
                              </div>

                              {/* Student Info */}
                              <span className="text-xs sm:text-sm font-black text-white group-hover:text-slate-200 text-center whitespace-nowrap">
                                {item.student.number}번 {item.student.name}
                              </span>
                              <span className="text-[11px] text-slate-400 font-bold mt-0.5 text-center">
                                {card ? card.name : '미선택'} ({item.student.teamNumber}모둠)
                              </span>

                              {/* Score Display */}
                              <div className="mt-1.5 px-3 py-1 rounded-xl bg-slate-800 text-slate-200 font-black text-xs sm:text-sm border border-slate-700">
                                {item.scoreValue}점
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Silver Podium Stand */}
                      <div className="w-full h-28 sm:h-32 bg-gradient-to-b from-slate-800 to-slate-950 rounded-t-2xl border-t-4 border-slate-400 flex flex-col items-center justify-center shadow-inner">
                        <span className="text-2xl font-black text-slate-300">2</span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {secondRank.length > 1 ? `SILVER (${secondRank.length}명)` : 'SILVER'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full text-center py-8 text-xs text-slate-600 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                      2위 해당 없음
                    </div>
                  )}
                </div>

                {/* 1ST PLACE (GOLD - CENTER HIGHEST) */}
                <div className="order-1 md:order-2 flex flex-col items-center flex-1 min-w-[240px] w-full">
                  {firstRank.length > 0 ? (
                    <div className="w-full flex flex-col items-center">
                      {/* Gold Crown Badge */}
                      <div className="mb-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black shadow-lg animate-pulse">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>🥇 1위 (금메달){firstRank.length > 1 ? ` · 공동 ${firstRank.length}명` : ''}</span>
                      </div>

                      {/* Same score students horizontally aligned side-by-side on the same line */}
                      <div className="w-full flex flex-row flex-wrap items-end justify-center gap-3 sm:gap-4 mb-3">
                        {firstRank.map((item) => {
                          const card = getCardById(item.student.selectedCharacterId);
                          return (
                            <div
                              key={item.student.id}
                              onClick={() => onSelectStudent(item.student)}
                              className="flex flex-col items-center cursor-pointer group p-1 transition-transform hover:scale-105"
                              title="클릭하여 캐릭터 카드 상세 보기"
                            >
                              {/* Avatar with Golden Ring */}
                              <div className="relative mb-2">
                                <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-slate-800 border-4 border-amber-400 p-1 shadow-[0_0_20px_rgba(251,191,36,0.35)] overflow-hidden flex items-center justify-center">
                                  <CharacterAvatar
                                    characterId={item.student.selectedCharacterId}
                                    size="md"
                                  />
                                </div>
                                <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-md">
                                  <Sparkles className="w-3.5 h-3.5" />
                                </div>
                              </div>

                              {/* Student Info */}
                              <span className="text-sm sm:text-base font-black text-amber-300 group-hover:text-amber-200 text-center whitespace-nowrap">
                                {item.student.number}번 {item.student.name}
                              </span>
                              <span className="text-xs text-amber-200/80 font-bold mt-0.5 text-center">
                                {card ? card.name : '미선택'} ({item.student.teamNumber}모둠)
                              </span>

                              {/* Score Display */}
                              <div className="mt-1.5 px-3.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md">
                                {item.scoreValue}점
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Gold Champion Podium Stand */}
                      <div className="w-full h-36 sm:h-44 bg-gradient-to-b from-amber-600/30 via-slate-900 to-slate-950 rounded-t-2xl border-t-4 border-amber-400 flex flex-col items-center justify-center shadow-[inset_0_4px_16px_rgba(251,191,36,0.25)]">
                        <Crown className="w-6 h-6 text-amber-400 mb-1" />
                        <span className="text-3xl font-black text-amber-400">1</span>
                        <span className="text-xs font-black text-amber-300">
                          {firstRank.length > 1 ? `CHAMPIONS (${firstRank.length}명)` : 'CHAMPION'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full text-center py-8 text-xs text-slate-600 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                      1위 해당 없음
                    </div>
                  )}
                </div>

                {/* 3RD PLACE (BRONZE - RIGHT) */}
                <div className="order-3 md:order-3 flex flex-col items-center flex-1 min-w-[220px] w-full">
                  {thirdRank.length > 0 ? (
                    <div className="w-full flex flex-col items-center">
                      {/* Bronze Badge */}
                      <div className="mb-3 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-800 text-amber-300 text-xs font-black shadow-md">
                        <Medal className="w-4 h-4 text-amber-500" />
                        <span>🥉 3위 (동메달){thirdRank.length > 1 ? ` · 공동 ${thirdRank.length}명` : ''}</span>
                      </div>

                      {/* Same score students horizontally aligned side-by-side on the same line */}
                      <div className="w-full flex flex-row flex-wrap items-end justify-center gap-3 sm:gap-4 mb-3">
                        {thirdRank.map((item) => {
                          const card = getCardById(item.student.selectedCharacterId);
                          return (
                            <div
                              key={item.student.id}
                              onClick={() => onSelectStudent(item.student)}
                              className="flex flex-col items-center cursor-pointer group p-1 transition-transform hover:scale-105"
                              title="클릭하여 캐릭터 카드 상세 보기"
                            >
                              {/* Avatar */}
                              <div className="relative mb-2">
                                <div className="w-14 sm:w-18 h-14 sm:h-18 rounded-2xl bg-slate-800 border-2 border-amber-700 p-1 shadow-md overflow-hidden flex items-center justify-center">
                                  <CharacterAvatar
                                    characterId={item.student.selectedCharacterId}
                                    size="md"
                                  />
                                </div>
                              </div>

                              {/* Student Info */}
                              <span className="text-xs sm:text-sm font-black text-white group-hover:text-slate-200 text-center whitespace-nowrap">
                                {item.student.number}번 {item.student.name}
                              </span>
                              <span className="text-[11px] text-slate-400 font-bold mt-0.5 text-center">
                                {card ? card.name : '미선택'} ({item.student.teamNumber}모둠)
                              </span>

                              {/* Score Display */}
                              <div className="mt-1.5 px-3 py-1 rounded-xl bg-amber-950 text-amber-300 font-black text-xs sm:text-sm border border-amber-800">
                                {item.scoreValue}점
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bronze Podium Stand */}
                      <div className="w-full h-20 sm:h-24 bg-gradient-to-b from-slate-800 to-slate-950 rounded-t-2xl border-t-4 border-amber-700 flex flex-col items-center justify-center shadow-inner">
                        <span className="text-xl font-black text-amber-600">3</span>
                        <span className="text-[11px] font-bold text-amber-600">
                          {thirdRank.length > 1 ? `BRONZE (${thirdRank.length}명)` : 'BRONZE'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full text-center py-8 text-xs text-slate-600 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                      3위 해당 없음
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION B: DETAILED TOP 3 HONORARY HALL OF FAME CARDS (Grouped by Rank/Score so same score students sit horizontally on the same line) */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>기특이 명예의 전당 헌액자 상세 소개 (1·2·3등)</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  * 동일 점수 수상자는 가로로 같은 선상에 나란히 배치됩니다.
                </span>
              </div>

              {/* 1위 그룹 (금메달) - 동점자 가로 동일 선상 배치 */}
              {firstRank.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3.5 py-1 rounded-xl text-xs font-black bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center gap-1.5 shadow-sm">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>🥇 1위 (금메달) · {firstRank[0]?.scoreValue}점{firstRank.length > 1 ? ` (공동 ${firstRank.length}명)` : ''}</span>
                    </span>
                    <div className="h-px bg-slate-800 flex-1" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {firstRank.map(renderHonoraryCard)}
                  </div>
                </div>
              )}

              {/* 2위 그룹 (은메달) - 동점자 가로 동일 선상 배치 */}
              {secondRank.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3.5 py-1 rounded-xl text-xs font-black bg-slate-800 border border-slate-600 text-slate-200 flex items-center gap-1.5 shadow-sm">
                      <Medal className="w-3.5 h-3.5 text-slate-300" />
                      <span>🥈 2위 (은메달) · {secondRank[0]?.scoreValue}점{secondRank.length > 1 ? ` (공동 ${secondRank.length}명)` : ''}</span>
                    </span>
                    <div className="h-px bg-slate-800 flex-1" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {secondRank.map(renderHonoraryCard)}
                  </div>
                </div>
              )}

              {/* 3위 그룹 (동메달) - 동점자 가로 동일 선상 배치 */}
              {thirdRank.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3.5 py-1 rounded-xl text-xs font-black bg-amber-950/60 border border-amber-800 text-amber-300 flex items-center gap-1.5 shadow-sm">
                      <Medal className="w-3.5 h-3.5 text-amber-500" />
                      <span>🥉 3위 (동메달) · {thirdRank[0]?.scoreValue}점{thirdRank.length > 1 ? ` (공동 ${thirdRank.length}명)` : ''}</span>
                    </span>
                    <div className="h-px bg-slate-800 flex-1" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {thirdRank.map(renderHonoraryCard)}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* CLASSROOM ENCOURAGEMENT FOOTER */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <span>🌍</span>
          <span>
            점수와 순위를 넘어, 기후 위기에 관심을 갖고 배움에 참여한 <strong>우리 반 21명 모두가 진정한 지구 수호자</strong>입니다!
          </span>
          <span>💚</span>
        </p>
      </div>
    </section>
  );
};
