import React, { useState } from 'react';
import { Student, CurrentUser } from '../types';
import { StudentCardItem } from './StudentCardItem';
import { Users, Search, Award, CheckCircle2, Sparkles, Filter } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  currentUser: CurrentUser;
  onToggleMajorAbility: (studentId: number) => void;
  onToggleHiddenAbility: (studentId: number) => void;
  onUpdateScore: (studentId: number, delta: number) => void;
  onMultiplyScore: (studentId: number, multiplier: number) => void;
  onClickStudent: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  currentUser,
  onToggleMajorAbility,
  onToggleHiddenAbility,
  onUpdateScore,
  onMultiplyScore,
  onClickStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterClimate, setFilterClimate] = useState<string>('all');

  // Stats calculation
  const selectedCount = students.filter((s) => s.selectedCharacterId !== null).length;
  const totalScore = students.reduce((acc, s) => acc + s.score, 0);

  // Climate distribution
  const scoleonCount = students.filter((s) => s.selectedCharacterId === 'scoleon').length;
  const qanatCount = students.filter((s) => s.selectedCharacterId === 'qanat').length;
  const oliviCount = students.filter((s) => s.selectedCharacterId === 'olivi').length;
  const taigaCount = students.filter((s) => s.selectedCharacterId === 'taiga').length;
  const jangbogoCount = students.filter((s) => s.selectedCharacterId === 'jangbogo').length;

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.includes(searchQuery.trim()) ||
      student.number.toString().includes(searchQuery.trim());
    if (!matchesSearch) return false;

    if (filterClimate === 'all') return true;
    if (filterClimate === 'unselected') return !student.selectedCharacterId;
    return student.selectedCharacterId === filterClimate;
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-3 py-6 sm:px-6">
      {/* Overview & Quick Stats Bar in Bright Theme */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Selected Count */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              우리 반 학생 현황 (21명)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black border border-emerald-200">
                총 {students.length}명
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              카드 선택 완료: <span className="font-black text-emerald-700">{selectedCount}명</span> / 21명 ({Math.round((selectedCount / 21) * 100)}%)
              <span className="mx-2 text-slate-300">|</span>
              학급 총 점수: <span className="font-black text-amber-600">{totalScore}점</span>
            </p>
          </div>
        </div>

        {/* Middle: Climate Distribution Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFilterClimate('all')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all border ${
              filterClimate === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            전체 21
          </button>
          <button
            type="button"
            onClick={() => setFilterClimate('scoleon')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all border ${
              filterClimate === 'scoleon'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="스콜레온 (열대)"
          >
            열대 {scoleonCount}
          </button>
          <button
            type="button"
            onClick={() => setFilterClimate('qanat')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all border ${
              filterClimate === 'qanat'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="카나트 (건조)"
          >
            건조 {qanatCount}
          </button>
          <button
            type="button"
            onClick={() => setFilterClimate('olivi')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all border ${
              filterClimate === 'olivi'
                ? 'bg-lime-600 text-white border-lime-600 shadow-sm'
                : 'bg-lime-50 text-lime-800 border-lime-200 hover:bg-lime-100'
            }`}
            title="올리비 (온대)"
          >
            온대 {oliviCount}
          </button>
          <button
            type="button"
            onClick={() => setFilterClimate('taiga')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all border ${
              filterClimate === 'taiga'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
            }`}
            title="타이가 (냉대)"
          >
            냉대 {taigaCount}
          </button>
          <button
            type="button"
            onClick={() => setFilterClimate('jangbogo')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all border ${
              filterClimate === 'jangbogo'
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
            }`}
            title="장보고 (한대)"
          >
            한대 {jangbogoCount}
          </button>
          {21 - selectedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterClimate('unselected')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all border ${
                filterClimate === 'unselected'
                  ? 'bg-amber-700 text-white border-amber-700'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              미선택 {21 - selectedCount}
            </button>
          )}
        </div>

        {/* Right: Search Box */}
        <div className="relative min-w-[170px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="학생 이름/번호 검색"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pl-8"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* 21 Student Button Cards List */}
      <div className="space-y-2.5">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            return (
              <StudentCardItem
                key={student.id}
                student={student}
                currentUser={currentUser}
                onToggleMajorAbility={onToggleMajorAbility}
                onToggleHiddenAbility={onToggleHiddenAbility}
                onUpdateScore={onUpdateScore}
                onMultiplyScore={onMultiplyScore}
                onClickCard={onClickStudent}
              />
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm shadow-2xs">
            검색 조건과 일치하는 학생이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};
