import React, { useState } from 'react';
import { Student, CurrentUser } from '../types';
import { User, KeyRound, Check, X, ShieldAlert, Sparkles, GraduationCap } from 'lucide-react';

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

    if (teacherPassword.trim() === '0000' || teacherPassword.trim() === 'admin') {
      onLoginSuccess({
        role: 'teacher',
      });
      onClose();
    } else {
      setErrorMessage('교사 비밀번호가 일치하지 않습니다. (비밀번호: 0000)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isTeacherMode ? <GraduationCap className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </span>
            <h3 className="text-base font-black text-slate-900">
              {isTeacherMode ? '선생님 관리자 로그인' : '학생 로그인'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 my-4 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setIsTeacherMode(false);
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !isTeacherMode
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            학생 접속 (21명)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsTeacherMode(true);
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isTeacherMode
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            선생님 모드
          </button>
        </div>

        {/* Student Form */}
        {!isTeacherMode ? (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. 학생 이름 선택 (총 21명)
              </label>
              <div className="max-h-44 overflow-y-auto pr-1 grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200 scrollbar-thin">
                {students.map((s) => {
                  const isSelected = selectedStudentId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedStudentId(s.id)}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all text-center border ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-200 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 font-bold block">{s.number}번</span>
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. 비밀번호 입력
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 pr-10"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                기본 비밀번호: <span className="text-emerald-700 font-black">1234</span> (또는 출석 번호)
              </p>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-bold">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {students.find((s) => s.id === selectedStudentId)?.name || ''} 학생으로 로그인
            </button>
          </form>
        ) : (
          /* Teacher Form */
          <form onSubmit={handleTeacherLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                선생님 인증 비밀번호
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="선생님 비밀번호 (기본: 0000)"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 pr-10"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                기본 관리자 비밀번호: <span className="text-indigo-700 font-bold">0000</span>
              </p>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-bold">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-black text-sm transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5"
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
