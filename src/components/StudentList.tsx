import React, { useState } from 'react';
import { Student, CurrentUser, MissionId, MISSIONS_LIST } from '../types';
import { StudentCardItem } from './StudentCardItem';
import {
  Users,
  Search,
  Award,
  CheckCircle2,
  Sparkles,
  Filter,
  Clock,
  RotateCcw,
  Target,
  CheckSquare,
  Square,
  Flame,
} from 'lucide-react';

interface StudentListProps {
  students: Student[];
  currentUser: CurrentUser;
  onToggleMajorAbility: (studentId: number) => void;
  onToggleHiddenAbility: (studentId: number) => void;
  onRequestAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onApproveAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onRejectAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onUpdateScore: (studentId: number, delta: number, missionId?: MissionId, resetToday?: boolean) => void;
  onResetStudentTodayScore?: (studentId: number) => void;
  onResetTodayScores?: () => void;
  onBatchMissionScore?: (missionId: MissionId, points: number, resetToday?: boolean) => void;
  onMultiplyScore: (studentId: number, multiplier: number) => void;
  onClickStudent: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  currentUser,
  onToggleMajorAbility,
  onToggleHiddenAbility,
  onRequestAbility,
  onApproveAbility,
  onRejectAbility,
  onUpdateScore,
  onResetStudentTodayScore,
  onResetTodayScores,
  onBatchMissionScore,
  onMultiplyScore,
  onClickStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterClimate, setFilterClimate] = useState<string>('all');
  const [filterTeam, setFilterTeam] = useState<number | 'all'>('all');
  const [defaultScoreStep, setDefaultScoreStep] = useState<number>(1);

  // User Request: 오늘의 점수 말고 미션1~6까지 선택하여 점수 입력
  const [activeMission, setActiveMission] = useState<MissionId>('today');
  // User Request: 오늘의 점수를 주고 나서 오늘의 점수가 0점으로 다시 리셋되게 해줘 (기본 활성화)
  const [autoResetTodayScore, setAutoResetTodayScore] = useState<boolean>(true);

  // Stats calculation
  const selectedCount = students.filter((s) => s.selectedCharacterId !== null).length;
  const totalScore = students.reduce((acc, s) => acc + (s.score || 0), 0);
  const todayTotalScore = students.reduce((acc, s) => acc + (s.todayScore || 0), 0);
  const activeMissionDef = MISSIONS_LIST.find((m) => m.id === activeMission);
  const activeMissionTotalScore = activeMission !== 'today'
    ? students.reduce((acc, s) => acc + (s.missionScores?.[activeMission] || 0), 0)
    : todayTotalScore;

  const pendingCount = students.filter(
    (s) => s.majorAbilityPending || s.hiddenAbilityPending
  ).length;

  const handleResetAllTodayScores = () => {
    if (onResetTodayScores) {
      if (confirm('우리 반 21명 전원의 [오늘의 점수]를 0점으로 리셋하시겠습니까?\n(누적 총점과 미션 1~6 점수는 안전하게 유지됩니다)')) {
        onResetTodayScores();
      }
    }
  };

  const handleBatchAward = () => {
    if (onBatchMissionScore) {
      const label = activeMissionDef ? activeMissionDef.label : '점수';
      if (confirm(`우리 반 21명 전원에게 [${label}] +${defaultScoreStep}점을 일괄 부여하시겠습니까?`)) {
        onBatchMissionScore(activeMission, defaultScoreStep, autoResetTodayScore);
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.includes(searchQuery.trim()) ||
      student.number.toString().includes(searchQuery.trim());
    if (!matchesSearch) return false;

    if (filterTeam !== 'all' && student.teamNumber !== filterTeam) return false;

    if (filterClimate === 'all') return true;
    if (filterClimate === 'unselected') return !student.selectedCharacterId;
    if (filterClimate === 'pending') {
      return student.majorAbilityPending || student.hiddenAbilityPending;
    }
    return student.selectedCharacterId === filterClimate;
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-3 py-6 sm:px-6">
      {/* Overview & Quick Stats Bar in Dark Theme */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Selected Count */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              우리 반 학생 현황 (21명)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-black border border-emerald-800">
                총 {students.length}명
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-1.5">
              <span>카드 선택: <strong className="text-emerald-400 font-black">{selectedCount}명</strong>/21명</span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1">
                오늘 획득: <strong className="text-emerald-400 font-black">+{todayTotalScore}점</strong>
                {currentUser.role === 'teacher' && onResetTodayScores && (
                  <button
                    type="button"
                    onClick={handleResetAllTodayScores}
                    title="전체 오늘 점수를 0점으로 리셋"
                    className="p-1 rounded bg-slate-800 hover:bg-amber-950 text-slate-400 hover:text-amber-300 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </span>
              <span className="text-slate-700">|</span>
              <span>누적 총계: <strong className="text-amber-400 font-black">{totalScore}점</strong></span>
              {activeMission !== 'today' && (
                <>
                  <span className="text-slate-700">|</span>
                  <span className="text-indigo-400 font-black flex items-center gap-1">
                    <Target className="w-3 h-3" /> {activeMissionDef?.label}: <strong>{activeMissionTotalScore}점</strong>
                  </span>
                </>
              )}
              {pendingCount > 0 && (
                <>
                  <span className="text-slate-700">|</span>
                  <span className="text-amber-400 font-black animate-pulse flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> 능력 승인 대기 {pendingCount}명
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right: Search & Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48 min-w-[140px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="이름/번호 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Team Filter */}
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">모든 모둠</option>
            <option value={1}>1모둠</option>
            <option value={2}>2모둠</option>
            <option value={3}>3모둠</option>
            <option value={4}>4모둠</option>
            <option value={5}>5모둠</option>
          </select>

          {/* Character / Status Filter */}
          <select
            value={filterClimate}
            onChange={(e) => setFilterClimate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">전체 캐릭터 보기</option>
            {pendingCount > 0 && <option value="pending">⏳ 승인 대기 중만</option>}
            <option value="scoleon">스콜레온 (열대)</option>
            <option value="qanat">카나트 (건조)</option>
            <option value="olivi">올리비 (온대)</option>
            <option value="taiga">타이가 (냉대)</option>
            <option value="jangbogo">장보고 (한대)</option>
            <option value="unselected">미선택 학생만</option>
          </select>
        </div>
      </div>

      {/* USER REQUEST: 미션1, 미션2, 미션3, 미션4, 미션5, 미션6 선택 탭 바 */}
      <div className="bg-slate-900/95 rounded-2xl p-3 border border-slate-800 shadow-md mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span className="text-xs font-black text-white">
              활동 및 미션 선택:
            </span>
            <span className="text-[11px] text-slate-400">
              (미션을 선택하면 각 학생 카드에서 해당 미션 점수를 입력하고 현황을 확인할 수 있습니다)
            </span>
          </div>

          {/* Auto Reset Today Score Toggle (User Request: 점수를 주고 나서 오늘의 점수가 0점으로 다시 리셋) */}
          {currentUser.role === 'teacher' && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label
                onClick={() => setAutoResetTodayScore(!autoResetTodayScore)}
                className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-300 hover:text-emerald-300 select-none px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 transition-colors"
                title="점수 입력 시 학생의 오늘 점수를 자동으로 0점으로 리셋합니다"
              >
                {autoResetTodayScore ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600" />
                )}
                <span>점수 부여 시 [오늘 점수] 0점 자동 리셋</span>
              </label>

              {onResetTodayScores && (
                <button
                  type="button"
                  onClick={handleResetAllTodayScores}
                  title="전체 학생의 오늘의 점수를 즉시 0점으로 리셋합니다"
                  className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/80 text-xs font-bold flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>오늘 점수 0점 리셋</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mission Tabs Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {MISSIONS_LIST.map((mission) => {
            const isSelected = activeMission === mission.id;
            return (
              <button
                key={mission.id}
                type="button"
                onClick={() => setActiveMission(mission.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 border ${
                  isSelected
                    ? mission.id === 'today'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/40'
                      : 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {mission.id === 'today' ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <Target className="w-3.5 h-3.5 text-indigo-300" />
                )}
                <span>{mission.label}</span>
                {mission.id !== 'today' && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/40 text-slate-200">
                    {students.reduce((acc, s) => acc + (s.missionScores?.[mission.id] || 0), 0)}점
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Teacher Preset & Batch Scoring Toolbar */}
        {currentUser.role === 'teacher' && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-indigo-300 flex items-center gap-1">
                <span>🎯 현재 입력 모드:</span>
                <strong className="text-amber-300">[{activeMissionDef?.label}]</strong>
              </span>
              <span className="text-[11px] text-slate-400">
                (기본 배점: +{defaultScoreStep}점)
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 mr-1">배점 선택:</span>
              {[1, 2, 3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setDefaultScoreStep(num)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all ${
                    defaultScoreStep === num
                      ? activeMission === 'today'
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/60'
                        : 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/60'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  +{num}점
                </button>
              ))}

              {onBatchMissionScore && (
                <button
                  type="button"
                  onClick={handleBatchAward}
                  title={`우리 반 21명 전원에게 [${activeMissionDef?.label}] +${defaultScoreStep}점을 부여합니다`}
                  className="ml-2 px-3 py-1 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-black shadow-sm transition-colors flex items-center gap-1"
                >
                  <span>전원 +{defaultScoreStep}점 일괄 지급</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Student Cards Grid List */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-center text-slate-500">
            <p className="text-sm font-bold text-slate-300 mb-1">검색 조건과 일치하는 학생이 없습니다.</p>
            <p className="text-xs">필터 설정을 확인하시거나 검색어를 지워보세요.</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <StudentCardItem
              key={student.id}
              student={student}
              currentUser={currentUser}
              activeMission={activeMission}
              autoResetTodayScore={autoResetTodayScore}
              onToggleMajorAbility={onToggleMajorAbility}
              onToggleHiddenAbility={onToggleHiddenAbility}
              onRequestAbility={onRequestAbility}
              onApproveAbility={onApproveAbility}
              onRejectAbility={onRejectAbility}
              onUpdateScore={onUpdateScore}
              onResetStudentTodayScore={onResetStudentTodayScore}
              onMultiplyScore={onMultiplyScore}
              onClickCard={onClickStudent}
              defaultScoreStep={defaultScoreStep}
              onSelectMission={(mId) => setActiveMission(mId)}
            />
          ))
        )}
      </div>
    </section>
  );
};
