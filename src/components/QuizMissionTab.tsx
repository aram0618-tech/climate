import React, { useState, useRef } from 'react';
import {
  QuizQuestion,
  QuizSubmission,
  Student,
  CurrentUser,
} from '../types';
import { getCardById } from '../data/climateCards';
import { CharacterAvatar } from './CharacterAvatar';
import { soundManager } from '../utils/audio';
import {
  Trophy,
  Clock,
  Send,
  Plus,
  Check,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ImageIcon,
  Trash2,
  Users,
  Award,
  Sparkles,
  Lock,
  Unlock,
  Upload,
  User,
  Camera,
  Image as ImageLucide,
  X,
  Maximize2,
} from 'lucide-react';

interface QuizMissionTabProps {
  currentQuestion: QuizQuestion | null;
  submissions: QuizSubmission[];
  students: Student[];
  currentUser: CurrentUser;
  onAddQuestion: (question: QuizQuestion) => void;
  onSubmitAnswer: (submission: Omit<QuizSubmission, 'id' | 'submittedAt'>) => void;
  onGradeSubmission: (submissionId: string, isCorrect: boolean, points: number) => void;
  onUpdateStudentScore: (studentId: number, delta: number) => void;
  onUpdateTeamScore: (teamNumber: number, delta: number) => void;
  onClearSubmissions: (questionId: string) => void;
  onToggleRevealAnswers: (questionId: string, isRevealed: boolean) => void;
}

export const QuizMissionTab: React.FC<QuizMissionTabProps> = ({
  currentQuestion,
  submissions,
  students,
  currentUser,
  onAddQuestion,
  onSubmitAnswer,
  onGradeSubmission,
  onUpdateStudentScore,
  onUpdateTeamScore,
  onClearSubmissions,
  onToggleRevealAnswers,
}) => {
  // Local state for answer input
  const [answerText, setAnswerText] = useState<string>('');
  const [studentImage, setStudentImage] = useState<string | null>(null);
  const [overrideStudentId, setOverrideStudentId] = useState<number>(1);
  const [overrideTeamNumber, setOverrideTeamNumber] = useState<number>(1);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<number | 'all'>('all');

  // Teacher create question state
  const [isCreatingQuestion, setIsCreatingQuestion] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [newHint, setNewHint] = useState<string>('');
  const [newMode, setNewMode] = useState<'individual' | 'team'>('team');

  // Zoom image lightbox modal
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  const teacherFileRef = useRef<HTMLInputElement>(null);
  const studentFileRef = useRef<HTMLInputElement>(null);

  // Active question's submissions sorted chronologically (submittedAt ASC)
  const activeSubmissions = currentQuestion
    ? [...submissions]
        .filter((s) => s.questionId === currentQuestion.id)
        .sort((a, b) => a.submittedAt - b.submittedAt)
    : [];

  const displayedSubmissions =
    selectedTeamFilter === 'all'
      ? activeSubmissions
      : activeSubmissions.filter((s) => s.teamNumber === selectedTeamFilter);

  // Logged-in student helper
  const loggedInStudent = currentUser.studentId
    ? students.find((s) => s.id === currentUser.studentId)
    : students.find((s) => s.id === overrideStudentId);

  const myExistingSubmission = loggedInStudent
    ? activeSubmissions.find((s) => s.studentId === loggedInStudent.id)
    : null;

  // Handle Teacher Image upload
  const handleTeacherImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, GIF 등)만 업로드할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setNewImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Student Image upload (Optional for missions!)
  const handleStudentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, GIF 등)만 업로드할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setStudentImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset sample illustrations
  const handleSelectPresetImage = (type: 'tropical' | 'desert' | 'mediterranean' | 'polar') => {
    const presets = {
      tropical: {
        title: '열대 우림 기후 고상 가옥의 구조와 원리',
        desc: '사진 속 가옥은 열대 기후 지역의 고상가옥입니다. 바닥을 높게 띄워 짓고 지붕의 경사를 가파르게 만든 이유를 각각 적어보세요.',
        url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><rect width="600" height="300" fill="%23022c22"/><rect y="210" width="600" height="90" fill="%23064e3b"/><rect x="230" y="120" width="140" height="80" fill="%23b45309" rx="4"/><polygon points="200,120 300,50 400,120" fill="%23d97706"/><line x1="250" y1="200" x2="250" y2="260" stroke="%23f59e0b" stroke-width="8"/><line x1="350" y1="200" x2="350" y2="260" stroke="%23f59e0b" stroke-width="8"/><text x="30" y="45" fill="%2334d399" font-size="20" font-weight="bold">🌴 열대 우림 고상 가옥 미션</text></svg>`,
        hint: '지열·습기 차단, 해충 방지, 통풍 / 스콜(폭우) 배수',
      },
      desert: {
        title: '건조 기후 지역의 오아시스와 카나트',
        desc: '사막의 극심한 증발을 막고 멀리서 물을 끌어오기 위해 지하에 판 전통 수로의 이름과, 흙벽돌집의 창문이 작은 이유는?',
        url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><rect width="600" height="300" fill="%23451a03"/><ellipse cx="300" cy="240" rx="200" ry="40" fill="%2338bdf8"/><rect x="250" y="110" width="100" height="90" fill="%23d97706" rx="8"/><circle cx="500" cy="70" r="40" fill="%23f59e0b"/><text x="30" y="45" fill="%23fde047" font-size="20" font-weight="bold">☀️ 사막 건조 기후 카나트 미션</text></svg>`,
        hint: '카나트(Qanat) / 뜨거운 태양열과 모래바람 차단',
      },
      mediterranean: {
        title: '온대 지중해성 기후의 여름철 수목 농업',
        desc: '여름이 고온 건조하고 겨울이 온화한 지중해성 기후에서 잎이 두껍고 질긴 나무를 재배하는 농업 방식과 대표 작물은?',
        url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><rect width="600" height="300" fill="%2314532d"/><rect y="190" width="600" height="110" fill="%23166534"/><circle cx="200" cy="180" r="50" fill="%2384cc16"/><circle cx="400" cy="180" r="50" fill="%2384cc16"/><text x="30" y="45" fill="%23bef264" font-size="20" font-weight="bold">🌿 지중해 수목 농업 미션</text></svg>`,
        hint: '수목 농업 (올리브, 포도, 코르크 참나무 등)',
      },
      polar: {
        title: '한대 툰드라 기후와 순록 유목',
        desc: '얼어붙은 땅 영구동토층이 있는 툰드라에서 자라는 짧은 풀과 지의류(이끼)를 찾아 이동하며 순록을 기르는 생활 양식은?',
        url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><rect width="600" height="300" fill="%23082f49"/><rect y="200" width="600" height="100" fill="%230c4a6e"/><polygon points="260,200 300,120 340,200" fill="%2338bdf8"/><text x="30" y="45" fill="%23bae6fd" font-size="20" font-weight="bold">❄️ 툰드라 순록 유목 미션</text></svg>`,
        hint: '순록 유목, 이끼류 섭취',
      },
    };
    const p = presets[type];
    setNewTitle(p.title);
    setNewDescription(p.desc);
    setNewImageUrl(p.url);
    setNewHint(p.hint);
  };

  // Submit new question (Image is OPTIONAL)
  const handleCreateQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('문제 제목을 입력해주세요.');
      return;
    }

    const createdQuestion: QuizQuestion = {
      id: 'quiz-' + Date.now(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      imageUrl: newImageUrl.trim() ? newImageUrl.trim() : undefined,
      mode: newMode,
      startedAt: Date.now(),
      isActive: true,
      correctAnswerHint: newHint.trim(),
      isAnswersRevealed: false,
    };

    onAddQuestion(createdQuestion);
    setIsCreatingQuestion(false);
    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
    setNewHint('');
    soundManager.playScoreDing();
  };

  // Student answer submission (Image is OPTIONAL)
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() && !studentImage) {
      alert('정답 내용이나 사진을 입력해주세요.');
      return;
    }
    if (!currentQuestion) return;

    const studentToSubmit = loggedInStudent || students[0];
    const teamNum = studentToSubmit.teamNumber || overrideTeamNumber;

    onSubmitAnswer({
      questionId: currentQuestion.id,
      studentId: studentToSubmit.id,
      studentName: studentToSubmit.name,
      characterId: studentToSubmit.selectedCharacterId,
      teamNumber: teamNum,
      answer: answerText.trim(),
      imageUrl: studentImage || undefined,
    });

    setAnswerText('');
    setStudentImage(null);
    soundManager.playScoreDing();
  };

  // Format Elapsed Time from question start
  const formatTimeInfo = (submittedAt: number) => {
    const date = new Date(submittedAt);
    const timeStr =
      date.toTimeString().split(' ')[0] +
      '.' +
      String(date.getMilliseconds()).padStart(3, '0').slice(0, 2);
    const diffSec = Math.max(
      0,
      (submittedAt - currentQuestion!.startedAt) / 1000
    ).toFixed(1);
    return { timeStr, diffSec };
  };

  // Rank Badge Render
  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20">
          🥇 1등
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-700 text-slate-200 font-black text-xs border border-slate-600">
          🥈 2등
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-900 text-amber-200 font-black text-xs border border-amber-800">
          🥉 3등
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700">
        {index + 1}
      </span>
    );
  };

  const isAnswersRevealed = Boolean(currentQuestion?.isAnswersRevealed);

  return (
    <section className="w-full max-w-7xl mx-auto px-3 py-6 sm:px-6">
      {/* Top Banner: Teacher Controls, Mode Switch & Reveal Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800 shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                기후 퀴즈 미션 & 실시간 정답 배틀
              </h2>
              {currentQuestion && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold border ${
                    currentQuestion.mode === 'team'
                      ? 'bg-purple-950 text-purple-300 border-purple-800'
                      : 'bg-sky-950 text-sky-300 border-sky-800'
                  }`}
                >
                  {currentQuestion.mode === 'team' ? '👥 모둠전 (1~5모둠)' : '👤 개인전'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              선생님이 제시한 문제를 보고 정답과 사진을 제출하면{' '}
              <span className="text-amber-400 font-bold">제출한 순서(초 단위)</span>대로 실시간 순위가 기록됩니다.
            </p>
          </div>
        </div>

        {/* Action Controls for Teacher & Reveal Button & Firebase Status */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Firebase Connection Status Check Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold shadow-2xs"
            title="Firebase Firestore 클라우드 실시간 동기화 연결 상태: 정상"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black text-emerald-300">Firebase 실시간 연동됨</span>
          </div>

          {/* Reveal Answers Toggle Button */}
          {currentQuestion && (
            currentUser.role === 'teacher' ? (
              <button
                type="button"
                onClick={() => {
                  const nextState = !isAnswersRevealed;
                  onToggleRevealAnswers(currentQuestion.id, nextState);
                  if (nextState) {
                    soundManager.playCardChosen();
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm border ${
                  isAnswersRevealed
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 animate-pulse'
                }`}
              >
                {isAnswersRevealed ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>📢 정답 공개 중 (비공개 전환)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>🔒 정답 공개하기 (선생님 권한)</span>
                  </>
                )}
              </button>
            ) : (
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                  isAnswersRevealed
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                {isAnswersRevealed ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>정답 공개 완료</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>정답 비공개 (선생님 공개 대기)</span>
                  </>
                )}
              </div>
            )
          )}

          {currentUser.role === 'teacher' && (
            <button
              type="button"
              onClick={() => setIsCreatingQuestion(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              선생님 새 문제 출제
            </button>
          )}

          {currentQuestion && activeSubmissions.length > 0 && currentUser.role === 'teacher' && (
            <button
              type="button"
              onClick={() => {
                if (confirm('현재 문제의 모든 정답 제출 목록을 초기화하시겠습니까?')) {
                  onClearSubmissions(currentQuestion.id);
                }
              }}
              title="정답 제출 기록 초기화"
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Problem Image & Details (Left) + Submissions Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Problem Image & Student Answer Submission Box (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {currentQuestion ? (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-md overflow-hidden">
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                  현재 진행 중인 미션
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  시작: {new Date(currentQuestion.startedAt).toLocaleTimeString()}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-snug tracking-tight">
                {currentQuestion.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {currentQuestion.description}
              </p>

              {/* Problem Image (Optional) */}
              {currentQuestion.imageUrl ? (
                <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center group mb-5 max-h-[380px]">
                  <img
                    src={currentQuestion.imageUrl}
                    alt={currentQuestion.title}
                    className="w-full h-auto object-contain max-h-[380px]"
                  />
                  <button
                    type="button"
                    onClick={() => setZoomImageUrl(currentQuestion.imageUrl || null)}
                    className="absolute bottom-2.5 right-2.5 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-200 border border-slate-700 shadow-sm flex items-center gap-1.5 hover:text-emerald-400"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    사진 확대보기
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 mb-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                  <span>텍스트 기반 미션 (별도 문제 이미지가 없습니다)</span>
                </div>
              )}

              {/* Teacher Hint (Visible to teacher or reference) */}
              {currentQuestion.correctAnswerHint && (
                <div className="mb-5 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">정답 해설 및 키워드: </span>
                    <span className="text-amber-200 font-medium">{currentQuestion.correctAnswerHint}</span>
                  </div>
                </div>
              )}

              {/* ANSWER INPUT FORM (아이들이 그 밑에 정답과 이미지를 남기는 곳) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                {/* Identity Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">답변 작성자:</span>
                    {loggedInStudent ? (
                      <div className="flex items-center gap-2">
                        <CharacterAvatar characterId={loggedInStudent.selectedCharacterId} size="sm" />
                        <span className="text-sm font-black text-emerald-400">
                          {loggedInStudent.number}번 {loggedInStudent.name}
                        </span>
                        {currentQuestion.mode === 'team' && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-black">
                            {loggedInStudent.teamNumber}모둠 대표
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-amber-400 font-semibold italic">
                        (로그인 전 - 아래 목록에서 학생을 선택해주세요)
                      </span>
                    )}
                  </div>

                  {!currentUser.studentId && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <select
                        value={overrideStudentId}
                        onChange={(e) => setOverrideStudentId(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-medium focus:border-emerald-500"
                      >
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.number}번 {s.name} ({s.teamNumber}모둠)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* 모둠전일 때 모둠 확인 & 체크 버튼 */}
                {currentQuestion.mode === 'team' && (
                  <div className="mb-3 p-3 bg-purple-950/40 rounded-xl border border-purple-900/60">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-black text-purple-300 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        우리 모둠 확인 & 체크
                      </span>
                      <span className="text-[11px] text-purple-200 font-extrabold bg-purple-900/80 px-2 py-0.5 rounded-md border border-purple-700">
                        현재: {loggedInStudent ? `${loggedInStudent.teamNumber}모둠` : `${overrideTeamNumber}모둠`}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((tNum) => {
                        const isSelected = loggedInStudent
                          ? loggedInStudent.teamNumber === tNum
                          : overrideTeamNumber === tNum;
                        return (
                          <button
                            key={tNum}
                            type="button"
                            onClick={() => {
                              if (!loggedInStudent) {
                                setOverrideTeamNumber(tNum);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border flex items-center gap-1 ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-500 shadow-sm ring-2 ring-purple-400'
                                : 'bg-slate-900 hover:bg-purple-950 text-slate-300 border-slate-700'
                            }`}
                          >
                            <span>{tNum}모둠</span>
                            {isSelected && <span className="text-[10px]">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submit Form with OPTIONAL Image Upload */}
                <form onSubmit={handleSubmitAnswer} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder={
                        currentQuestion.mode === 'team'
                          ? `[${loggedInStudent?.teamNumber || 1}모둠] 우리 모둠의 정답을 입력하세요...`
                          : '문제의 정답을 입력하세요...'
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-24 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!answerText.trim() && !studentImage}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      제출
                    </button>
                  </div>

                  {/* USER REQUIREMENT: 미션 해결할 때 이미지를 올릴 수도 있고 안올릴 수도 있어 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={studentFileRef}
                        onChange={handleStudentImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => studentFileRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        <span>사진/이미지 첨부 (선택 사항)</span>
                      </button>

                      {studentImage && (
                        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-emerald-700 text-xs text-emerald-300">
                          <img
                            src={studentImage}
                            alt="첨부 미리보기"
                            className="w-5 h-5 object-cover rounded"
                          />
                          <span className="text-[11px] font-bold">사진 첨부됨</span>
                          <button
                            type="button"
                            onClick={() => setStudentImage(null)}
                            title="사진 첨부 삭제"
                            className="p-0.5 text-slate-400 hover:text-rose-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-500" />
                      제출 즉시 초 단위 시간과 순위가 기록됩니다.
                    </span>
                  </div>

                  {myExistingSubmission && (
                    <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/40 p-2 rounded-xl border border-emerald-900">
                      ✓ 내가 작성한 정답이 이미 등록되어 있습니다 (추가 수정 제출 가능)
                    </div>
                  )}
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 shadow-md">
              <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-200">등록된 문제가 없습니다.</p>
              <p className="text-xs mt-1">선생님 새 문제 출제 버튼을 눌러 사진 퀴즈를 출제해보세요.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Chronological Answer Timeline (정답을 적은 순으로 나열) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-md flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  제출 현황 (시간순 실시간 순위)
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                    isAnswersRevealed
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}
                >
                  {isAnswersRevealed ? '공개 완료 ✓' : '정답 비공개'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  {activeSubmissions.length}명
                </span>
              </div>
            </div>

            {/* 모둠별 제출 필터 */}
            <div className="mb-3 p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-black text-slate-300 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  모둠별 제출 체크
                </span>
                {selectedTeamFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedTeamFilter('all')}
                    className="text-[11px] text-purple-400 font-bold underline hover:text-purple-300"
                  >
                    전체 보기로 복귀
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedTeamFilter('all')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all border ${
                    selectedTeamFilter === 'all'
                      ? 'bg-slate-800 text-white border-slate-700 shadow-xs'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  전체 ({activeSubmissions.length})
                </button>
                {[1, 2, 3, 4, 5].map((tNum) => {
                  const teamSubs = activeSubmissions.filter((s) => s.teamNumber === tNum);
                  const isFirstTeam =
                    activeSubmissions.length > 0 && activeSubmissions[0].teamNumber === tNum;
                  return (
                    <button
                      key={tNum}
                      type="button"
                      onClick={() => setSelectedTeamFilter(tNum)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all border flex items-center gap-1 ${
                        selectedTeamFilter === tNum
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm ring-1 ring-purple-400'
                          : 'bg-slate-900 hover:bg-purple-950 text-purple-300 border-purple-900/60'
                      }`}
                    >
                      {isFirstTeam && <span title="가장 먼저 제출한 1등 모둠!">🥇</span>}
                      <span>{tNum}모둠</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                          selectedTeamFilter === tNum
                            ? 'bg-purple-800 text-white'
                            : 'bg-purple-950 text-purple-300'
                        }`}
                      >
                        {teamSubs.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TEACHER ONLY: 빠른 모둠 점수 지급 바 */}
            {currentUser.role === 'teacher' && (
              <div className="mb-3 p-3 bg-gradient-to-r from-purple-950/60 via-slate-900 to-emerald-950/60 rounded-2xl border border-purple-800 text-xs shadow-2xs">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="font-black text-purple-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    선생님 모둠 점수 퀵 지급 (모둠원 전원 오늘 점수 & 총점에 즉시 반영)
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5].map((tNum) => (
                    <div
                      key={tNum}
                      className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-purple-800/80 shadow-2xs"
                    >
                      <span className="text-xs font-black text-purple-300 px-1">{tNum}모둠</span>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateTeamScore(tNum, 1);
                          soundManager.playScoreDing();
                        }}
                        title={`${tNum}모둠 전원 +1점`}
                        className="px-2 py-0.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black transition-colors"
                      >
                        +1점
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateTeamScore(tNum, 2);
                          soundManager.playScoreDing();
                        }}
                        title={`${tNum}모둠 전원 +2점`}
                        className="px-2 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black transition-colors"
                      >
                        +2점
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answers Hidden Status Banner */}
            {!isAnswersRevealed && (
              <div className="mb-3 p-3 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-xs text-amber-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-semibold">
                    아이들이 서로 정답을 베끼지 않도록 현재 정답은 비공개 상태입니다.
                  </span>
                </div>
                {currentUser.role === 'teacher' && (
                  <button
                    type="button"
                    onClick={() => onToggleRevealAnswers(currentQuestion.id, true)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[11px] hover:bg-amber-400 transition-colors flex-shrink-0"
                  >
                    정답 공개
                  </button>
                )}
              </div>
            )}

            {/* Submissions List (Sorted by submittedAt ASC) */}
            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[600px] pr-1">
              {displayedSubmissions.length > 0 ? (
                displayedSubmissions.map((sub, index) => {
                  const student = students.find((s) => s.id === sub.studentId);
                  const card = getCardById(sub.characterId);
                  const { timeStr, diffSec } = formatTimeInfo(sub.submittedAt);
                  const isFirst = index === 0;

                  const isAuthor = loggedInStudent?.id === sub.studentId;
                  const canSeeAnswer =
                    isAnswersRevealed || currentUser.role === 'teacher' || isAuthor;

                  return (
                    <div
                      key={sub.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                        isFirst
                          ? 'bg-amber-950/40 border-amber-600 shadow-md'
                          : sub.isGraded === true
                          ? 'bg-emerald-950/40 border-emerald-700'
                          : sub.isGraded === false
                          ? 'bg-rose-950/40 border-rose-800'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        {/* Rank & Student/Team Title */}
                        <div className="flex items-center gap-2">
                          {getRankBadge(index)}
                          <CharacterAvatar characterId={sub.characterId} size="sm" />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                                {sub.teamNumber}모둠
                              </span>
                              <span className="text-xs font-black text-white">
                                {sub.studentName}
                              </span>
                              {card && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${card.badgeBg}`}>
                                  {card.name}
                                </span>
                              )}
                              {student && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                  오늘: +{student.todayScore || 0}점 / 총 {student.score}점
                                </span>
                              )}
                              {isAuthor && !isAnswersRevealed && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                                  내 정답
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Submission Time Seconds */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-mono text-amber-400 font-black block">
                            +{diffSec}초
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {timeStr}
                          </span>
                        </div>
                      </div>

                      {/* Submitted Answer Text or Masked Box */}
                      <div
                        className={`rounded-xl p-2.5 border mb-2.5 ${
                          canSeeAnswer
                            ? 'bg-slate-900 border-slate-800'
                            : 'bg-amber-950/50 border-dashed border-amber-800'
                        }`}
                      >
                        {canSeeAnswer ? (
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold mb-0.5 flex items-center justify-between">
                              <span>제출한 정답:</span>
                              {!isAnswersRevealed && currentUser.role === 'teacher' && (
                                <span className="text-indigo-400 font-normal">
                                  (선생님만 미리보기 중)
                                </span>
                              )}
                              {!isAnswersRevealed && isAuthor && currentUser.role !== 'teacher' && (
                                <span className="text-emerald-400 font-normal">
                                  (다른 친구들에겐 비공개 상태)
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-black text-white break-words">
                              {sub.answer || '(사진만 제출됨)'}
                            </div>

                            {/* USER REQUIREMENT: 학생이 올린 이미지 (있을 수도 있고 없을 수도 있음) */}
                            {sub.imageUrl && (
                              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
                                <img
                                  src={sub.imageUrl}
                                  alt="학생 제출 사진"
                                  className="w-16 h-16 object-cover rounded-lg border border-slate-700 bg-slate-950 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setZoomImageUrl(sub.imageUrl || null)}
                                />
                                <button
                                  type="button"
                                  onClick={() => setZoomImageUrl(sub.imageUrl || null)}
                                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  첨부 사진 확대보기
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 py-1 text-xs text-amber-300 font-bold">
                            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <span>🔒 정답 비공개 (선생님이 정답 공개 시 확인 가능)</span>
                          </div>
                        )}
                      </div>

                      {/* Teacher Grading & Score Add Controls */}
                      {currentUser.role === 'teacher' ? (
                        <div className="pt-2 border-t border-slate-800 space-y-2 bg-slate-900/80 p-2 rounded-xl">
                          {/* Row 1: 채점 판정 (선생님만 클릭 가능) */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-black text-slate-300">채점 판정:</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  onGradeSubmission(sub.id, true, 1);
                                  soundManager.playScoreDing();
                                }}
                                title="정답 인정 (+1점 자동 부여)"
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 border ${
                                  sub.isGraded === true
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                                    : 'bg-slate-900 hover:bg-emerald-950 text-emerald-300 border-emerald-800'
                                }`}
                              >
                                <Check className="w-3 h-3" /> 정답 인정 (+1점)
                              </button>
                              <button
                                type="button"
                                onClick={() => onGradeSubmission(sub.id, false, 0)}
                                title="오답 처리"
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all border ${
                                  sub.isGraded === false
                                    ? 'bg-rose-600 text-white border-rose-500 shadow-2xs'
                                    : 'bg-slate-900 hover:bg-rose-950 text-rose-300 border-rose-800'
                                }`}
                              >
                                오답 처리
                              </button>
                            </div>
                          </div>

                          {/* Row 2: 점수 즉시 지급 (개인 및 모둠) */}
                          <div className="flex flex-wrap items-center justify-between gap-1 pt-1.5 border-t border-slate-800">
                            <span className="text-[11px] font-black text-purple-300 flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              점수 지급:
                            </span>
                            <div className="flex flex-wrap items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateStudentScore(sub.studentId, 1);
                                  soundManager.playScoreDing();
                                }}
                                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold shadow-2xs transition-colors"
                                title={`${sub.studentName} 학생 개인에게 +1점`}
                              >
                                👤 {sub.studentName} +1점
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateTeamScore(sub.teamNumber, 1);
                                  soundManager.playScoreDing();
                                }}
                                className="px-2 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-[11px] font-black transition-all shadow-2xs"
                                title={`${sub.teamNumber}모둠 전원에게 +1점`}
                              >
                                👥 {sub.teamNumber}모둠 전원 +1점
                              </button>
                              {isFirst && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateTeamScore(sub.teamNumber, 2);
                                    soundManager.playScoreDing();
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black shadow-2xs flex items-center gap-1"
                                  title={`가장 먼저 제출한 1등 ${sub.teamNumber}모둠 전원에게 보너스 +2점`}
                                >
                                  🥇 1등 모둠 +2점
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                          <div className="flex items-center gap-1.5">
                            {sub.isGraded === true ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 정답 인정됨 (+1점 지급 완료)
                              </span>
                            ) : sub.isGraded === false ? (
                              <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                                <XCircle className="w-3.5 h-3.5" /> 오답 처리됨
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" /> 선생님 채점 대기 중
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            (채점은 선생님만 가능합니다)
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                  <Clock className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
                  <p className="font-bold text-slate-300">
                    {selectedTeamFilter === 'all'
                      ? '아직 제출된 정답이 없습니다.'
                      : `${selectedTeamFilter}모둠에서 아직 제출된 정답이 없습니다.`}
                  </p>
                  <p className="mt-1">문제의 정답을 입력하고 실시간 1등을 차지해보세요!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL FOR ZOOMING IMAGES */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
          onClick={() => setZoomImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomImageUrl(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImageUrl}
              alt="확대 이미지"
              className="max-h-[85vh] w-auto mx-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* TEACHER CREATE QUESTION MODAL */}
      {isCreatingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <ImageIcon className="w-5 h-5" />
                </span>
                <h3 className="text-base font-black text-white">
                  선생님 새 퀴즈 문제 등록 (이미지 선택 사항)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingQuestion(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestionSubmit} className="space-y-4 mt-4">
              {/* Competition Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  1. 경기 방식 선택 (개인전 vs 모둠전)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMode('individual')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      newMode === 'individual'
                        ? 'bg-sky-950 text-sky-300 border-sky-500 shadow-sm ring-1 ring-sky-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    개인전 (각자 이름으로 제출)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMode('team')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      newMode === 'team'
                        ? 'bg-purple-950 text-purple-300 border-purple-500 shadow-sm ring-1 ring-purple-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    모둠전 (모둠별로 제출)
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  2. 문제 제목
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 열대 우림 고상 가옥 퀴즈"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  3. 문제 설명 / 질문 내용
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="아이들이 보고 풀 구체적인 미션 질문을 적어주세요."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Image Upload Area (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  4. 문제 이미지 등록 (선택 사항: 사진을 올릴 수도 있고 안 올릴 수도 있음)
                </label>

                {/* File picker button */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    ref={teacherFileRef}
                    onChange={handleTeacherImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => teacherFileRef.current?.click()}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-emerald-400" />
                    내 컴퓨터에서 이미지 파일 선택 (선택 사항)
                  </button>
                  {newImageUrl && (
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('')}
                      className="px-3 py-2.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold"
                    >
                      삭제
                    </button>
                  )}
                </div>

                {/* Preset quick buttons */}
                <div className="text-[11px] text-slate-400 mb-2">
                  또는 기후 단원 추천 예시 문제 바로 선택:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                  <button
                    type="button"
                    onClick={() => handleSelectPresetImage('tropical')}
                    className="p-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] font-bold hover:bg-emerald-900 transition-colors"
                  >
                    🌴 열대 고상가옥
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetImage('desert')}
                    className="p-2 rounded-xl bg-amber-950 border border-amber-800 text-amber-300 text-[11px] font-bold hover:bg-amber-900 transition-colors"
                  >
                    ☀️ 건조 카나트
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetImage('mediterranean')}
                    className="p-2 rounded-xl bg-lime-950 border border-lime-800 text-lime-300 text-[11px] font-bold hover:bg-lime-900 transition-colors"
                  >
                    🌿 온대 수목농업
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetImage('polar')}
                    className="p-2 rounded-xl bg-sky-950 border border-sky-800 text-sky-300 text-[11px] font-bold hover:bg-sky-900 transition-colors"
                  >
                    ❄️ 한대 툰드라
                  </button>
                </div>

                {/* Image Preview */}
                {newImageUrl && (
                  <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <img
                      src={newImageUrl}
                      alt="문제 미리보기"
                      className="max-h-40 mx-auto rounded-xl object-contain border border-slate-700 bg-slate-900"
                    />
                    <span className="text-xs text-emerald-400 font-bold block mt-1.5">
                      ✓ 이미지 등록 완료
                    </span>
                  </div>
                )}
              </div>

              {/* Correct Answer / Hint for Teacher */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  5. 정답 키워드 (선생님 채점용 참고)
                </label>
                <input
                  type="text"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  placeholder="예: 고상가옥, 통풍, 해충방지"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit / Cancel */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingQuestion(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-900/40 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  문제 출제 완료 (시작)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
