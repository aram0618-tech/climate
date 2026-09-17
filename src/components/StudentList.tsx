import React, { useState } from 'react';
import { Student, CurrentUser } from '../types';
import { StudentCardItem } from './StudentCardItem';
import { Users, Search, Award, CheckCircle2, Sparkles, Filter, Clock } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  currentUser: CurrentUser;
  onToggleMajorAbility: (studentId: number) => void;
  onToggleHiddenAbility: (studentId: number) => void;
  onRequestAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onApproveAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onRejectAbility?: (studentId: number, abilityType: 'major' | 'hidden') => void;
  onUpdateScore: (studentId: number, delta: number) => void;
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
  onMultiplyScore,
  onClickStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterClimate, setFilterClimate] = useState<string>('all');
  const [filterTeam, setFilterTeam] = useState<number | 'all'>('all');

  // Stats calculation
  const selectedCount = students.filter((s) => s.selectedCharacterId !== null).length;
  const totalScore = students.reduce((acc, s) => acc + (s.score || 0), 0);
  const todayTotalScore = students.reduce((acc, s) => acc + (s.todayScore || 0), 0);
  const pendingCount = students.filter(
    (s) => s.majorAbilityPending || s.hiddenAbilityPending
  ).length;

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
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <span>오늘 획득: <strong className="text-emerald-400 font-black">+{todayTotalScore}점</strong></span>
              <span className="text-slate-700">|</span>
              <span>누적 총계: <strong className="text-amber-400 font-black">{totalScore}점</strong></span>
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
              onToggleMajorAbility={onToggleMajorAbility}
              onToggleHiddenAbility={onToggleHiddenAbility}
              onRequestAbility={onRequestAbility}
              onApproveAbility={onApproveAbility}
              onRejectAbility={onRejectAbility}
              onUpdateScore={onUpdateScore}
              onMultiplyScore={onMultiplyScore}
              onClickCard={onClickStudent}
            />
          ))
        )}
      </div>
    </section>
  );
};
