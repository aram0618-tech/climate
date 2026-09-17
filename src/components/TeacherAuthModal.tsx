import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, KeyRound, Check, X, ShieldCheck } from 'lucide-react';
import { verifyTeacherPin, getTeacherPin } from '../utils/teacherSecurity';
import { soundManager } from '../utils/audio';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [inputPin, setInputPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isErrorShake, setIsErrorShake] = useState<boolean>(false);
  const [isDefaultPin, setIsDefaultPin] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setInputPin('');
      setErrorMessage('');
      setIsErrorShake(false);
      setIsDefaultPin(getTeacherPin() === '0000');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (verifyTeacherPin(inputPin)) {
      soundManager.playCardChosen();
      onSuccess();
    } else {
      setErrorMessage('선생님 비밀번호가 일치하지 않습니다. (학생은 접근할 수 없습니다)');
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 500);
      setInputPin('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden ${
          isErrorShake ? 'animate-bounce' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Lock icon */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/80">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                선생님 수업 관리 인증
              </h3>
              <p className="text-[11px] text-amber-400/90 font-semibold">
                🔒 학생 접근 제한 구역
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="my-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-200">
              수업 관리 및 채점·점수 도구입니다.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              선생님 전용 비밀번호(PIN)를 입력해야 관리 도구를 열 수 있습니다.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* PIN Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>선생님 비밀번호 (PIN)</span>
              {isDefaultPin && (
                <span className="text-[10px] text-emerald-400 font-normal">
                  (초기 비밀번호: 0000)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                placeholder="비밀번호 4자리 이상 입력..."
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-center tracking-widest font-mono"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 text-center">
              * 인증 후 관리 도구 내부에서 선생님만의 비밀번호로 변경할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              닫기
            </button>
            <button
              type="submit"
              disabled={!inputPin.trim()}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              인증 및 도구 열기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
