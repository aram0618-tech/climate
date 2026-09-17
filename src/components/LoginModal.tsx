import React, { useState } from 'react';
import { Student, CurrentUser } from '../types';
import { User, KeyRound, Check, X, ShieldAlert, Sparkles, GraduationCap } from 'lucide-react';

import { verifyTeacherPin, getTeacherPin } from '../utils/teacherSecurity';

interface LoginModalProps {
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CurrentUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  students,
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [password, setPassword] = useState<string>('1234');
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [teacherPassword, setTeacherPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const targetStudent = students.find((s) => s.id === selectedStudentId);
    if (!targetStudent) {
      setErrorMessage('학생을 찾을 수 없습니다.');
      return;
    }

    const studentNumStr = targetStudent.number.toString().padStart(2, '0');
    const validPasswords = [
      targetStudent.password,
      '1234',
      studentNumStr,
      targetStudent.number.toString(),
    ];

    if (validPasswords.includes(password.trim())) {
      onLoginSuccess({
        role: 'student',
        studentId: targetStudent.id,
        studentName: targetStudent.name,
      });
      onClose();
    } else {
      setErrorMessage('비밀번호가 올바르지 않습니다. (기본 비밀번호: 1234)');
    }
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (verifyTeacherPin(teacherPassword)) {
      onLoginSuccess({
        role: 'teacher',
      });
      onClose();
    } else {
      setErrorMessage('교사 비밀번호가 일치하지 않습니다. (선생님만 로그인 가능)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              {isTeacherMode ? <GraduationCap className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </span>
            <h3 className="text-base font-black text-white">
              {isTeacherMode ? '선생님 관리자 로그인' : '학생 본인 확인 로그인'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 gap-2 my-4 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsTeacherMode(false);
              setErrorMessage('');
            }}
            className={`py-2 rounded-xl transition-all ${
              !isTeacherMode
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            학생으로 로그인
          </button>
          <button
            type="button"
            onClick={() => {
              setIsTeacherMode(true);
              setErrorMessage('');
            }}
            className={`py-2 rounded-xl transition-all ${
              isTeacherMode
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            선생님 모드 전환
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Student Login Form */}
        {!isTeacherMode ? (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                1. 본인 이름과 번호 선택
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.number}번 {student.name} ({student.teamNumber}모둠)
                    {student.selectedCharacterId ? ' [선택완료]' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                2. 비밀번호 입력
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요 (기본: 1234)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * 기본 비밀번호는 <code className="text-emerald-400">1234</code> 또는 본인의 출석번호 2자리입니다.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-sm shadow-md shadow-emerald-900/40 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              로그인하고 카드 선택하기
            </button>
          </form>
        ) : (
          /* Teacher Login Form */
          <form onSubmit={handleTeacherLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                교사 비밀번호 입력
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="교사용 관리 비밀번호 (기본: 0000)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * 선생님 초기 설정 비밀번호는 <code className="text-indigo-400">0000</code> 입니다.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-black text-sm shadow-md shadow-indigo-900/40 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              선생님 모드로 시작하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
