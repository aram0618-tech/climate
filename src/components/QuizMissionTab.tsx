import React, { useState, useRef } from 'react';
import { QuizQuestion, QuizSubmission, Student, CurrentUser, QuizMode } from '../types';
import { getCardById } from '../data/climateCards';
import { CharacterAvatar } from './CharacterAvatar';
import { soundManager } from '../utils/audio';
import {
  HelpCircle,
  Image as ImageIcon,
  Upload,
  Send,
  Trophy,
  Users,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Award,
  Sparkles,
  AlertCircle,
  Check,
  ChevronDown,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';

interface QuizMissionTabProps {
  students: Student[];
  currentUser: CurrentUser;
  questions: QuizQuestion[];
  submissions: QuizSubmission[];
  onAddQuestion: (question: QuizQuestion) => void;
  onSubmitAnswer: (submission: Omit<QuizSubmission, 'id' | 'submittedAt'>) => void;
  onGradeSubmission: (submissionId: string, isCorrect: boolean, awardScoreDelta?: number) => void;
  onClearSubmissions: (questionId: string) => void;
  onUpdateStudentScore: (studentId: number, delta: number) => void;
  onUpdateTeamScore: (teamNumber: number, delta: number) => void;
  onToggleRevealAnswers: (questionId: string, isRevealed: boolean) => void;
}

export const QuizMissionTab: React.FC<QuizMissionTabProps> = ({
  students,
  currentUser,
  questions,
  submissions,
  onAddQuestion,
  onSubmitAnswer,
  onGradeSubmission,
  onClearSubmissions,
  onUpdateStudentScore,
  onUpdateTeamScore,
  onToggleRevealAnswers,
}) => {
  // Current active question
  const currentQuestion = questions.find((q) => q.isActive) || questions[0];

  // Answer input state
  const [answerText, setAnswerText] = useState<string>('');
  const [overrideStudentId, setOverrideStudentId] = useState<number>(currentUser.studentId || 1);
  const [overrideTeamNumber, setOverrideTeamNumber] = useState<number>(1);

  // Teacher New Question Modal / State
  const [isCreatingQuestion, setIsCreatingQuestion] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newMode, setNewMode] = useState<QuizMode>('individual');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [newHint, setNewHint] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logged-in student info
  const activeStudentId = currentUser.studentId || overrideStudentId;
  const loggedInStudent = students.find((s) => s.id === activeStudentId);

  // Active question submissions sorted chronologically (earliest first)
  const activeSubmissions = currentQuestion
    ? submissions
        .filter((sub) => sub.questionId === currentQuestion.id)
        .sort((a, b) => a.submittedAt - b.submittedAt)
    : [];

  // Check if current student already submitted
  const myExistingSubmission = currentQuestion && loggedInStudent
    ? activeSubmissions.find((s) => s.studentId === loggedInStudent.id)
    : null;

  // Handle Image File Upload (Convert to Data URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Preset sample illustrations
  const handleSelectPresetImage = (type: 'tropical' | 'desert' | 'mediterranean' | 'polar') => {
    const presets = {
      tropical: {
        title: '열대 우림 기후 고상 가옥의 구조와 원리',
        desc: '사진 속 가옥은 열대 기후 지역의 고상가옥입니다. 바닥을 높게 띄워 짓고 지붕의 경사를 가파르게 만든 이유를 각각 적어보세요.',
        url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><rect width="600" height="300" fill="%23ecfdf5"/><rect y="210" width="600" height="90" fill="%23d1fae5"/><rect x="230" y="120" width="140" height="80" fill="%23b45309" rx="4"/><polygon points="200,120 300,50 400,120" fill="%2392400e"/><line x1="250" y1="200" x2="250" y2="260" stroke="%2378350f" stroke-width="8"/><line x1="350" y1="200" x2="350" y2="260" stroke="%2378350f" stroke-width="8"/><text x="30" y="45" fill="%23047857" font-size="20" font-weight="bold">🌴 열대 우림 고상 가옥 미션</text></svg>`,
        hint: '지열·습기 차단, 해충 방지, 통풍 / 스콜(폭우) 배수',
      },
      desert: {
        title: '건조 기후 지역의 오아시스와 카나트',
        desc: '사막의 극심한 증발을 막고 멀리서 물을 끌어오기 위해 지하에 판 전통 수로의 이름과, 흙벽돌집의 창문이 작은 이유는?',
        url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><rect width="600" height="300" fill="%23fffbeb"/><ellipse cx="300" cy="240" rx="200" ry="40" fill="%2338bdf8"/><rect x="250" y="110" width="100" height="90" fill="%23d97706" rx="8"/><circle cx="500" cy="70" r="40" fill="%23f59e0b"/><text x="30" y="45" fill="%23b45309" font-size="20" font-weight="bold">☀️ 사막 건조 기후 카나트 미션</text></svg>`,
        hint: '카나트(Qanat) / 뜨거운 태양열과 모래바람 차단',
      },
      mediterranean: {
        title: '온대 지중해성 기후의 여름철 수목 농업',
        desc: '여름이 고온 건조하고 겨울이 온화한 지중해성 기후에서 잎이 두껍고 질긴 나무를 재배하는 농업 방식과 대표 작물은?',
        url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><rect width="600" height="300" fill="%23f7fee7"/><rect y="190" width="600" height="110" fill="%23d9f99d"/><circle cx="200" cy="180" r="50" fill="%2365a30d"/><circle cx="400" cy="180" r="50" fill="%2365a30d"/><text x="30" y="45" fill="%233f6212" font-size="20" font-weight="bold">🌿 지중해 수목 농업 미션</text></svg>`,
        hint: '수목 농업 (올리브, 포도, 코르크 참나무 등)',
      },
      polar: {
        title: '한대 툰드라 기후와 순록 유목',
        desc: '얼어붙은 땅 영구동토층이 있는 툰드라에서 자라는 짧은 풀과 지의류(이끼)를 찾아 이동하며 순록을 기르는 생활 양식은?',
        url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><rect width="600" height="300" fill="%23f0f9ff"/><rect y="200" width="600" height="100" fill="%23e0f2fe"/><polygon points="260,200 300,120 340,200" fill="%230284c7"/><text x="30" y="45" fill="%230369a1" font-size="20" font-weight="bold">❄️ 툰드라 순록 유목 미션</text></svg>`,
        hint: '순록 유목, 이끼류 섭취',
      },
    };
    const p = presets[type];
    setNewTitle(p.title);
    setNewDescription(p.desc);
    setNewImageUrl(p.url);
    setNewHint(p.hint);
  };

  // Submit new question
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
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      mode: newMode,
      startedAt: Date.now(),
      isActive: true,
      correctAnswerHint: newHint.trim(),
      isAnswersRevealed: false, // Default is hidden until revealed!
    };

    onAddQuestion(createdQuestion);
    setIsCreatingQuestion(false);
    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
    setNewHint('');
    soundManager.playScoreDing();
  };

  // Student answer submission
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;
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
    });

    setAnswerText('');
    soundManager.playScoreDing();
  };

  // Format Elapsed Time from question start
  const formatTimeInfo = (submittedAt: number) => {
    const date = new Date(submittedAt);
    const timeStr = date.toTimeString().split(' ')[0] + '.' + String(date.getMilliseconds()).padStart(3, '0').slice(0, 2);
    const diffSec = Math.max(0, ((submittedAt - currentQuestion.startedAt) / 1000)).toFixed(1);
    return { timeStr, diffSec };
  };

  // Rank Badge Render
  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-white font-black text-xs shadow-md shadow-amber-500/30">
          🥇 1등
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-200 text-slate-800 font-black text-xs border border-slate-300">
          🥈 2등
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-700 text-white font-black text-xs">
          🥉 3등
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
        {index + 1}
      </span>
    );
  };

  const isAnswersRevealed = Boolean(currentQuestion?.isAnswersRevealed);

  return (
    <section className="w-full max-w-7xl mx-auto px-3 py-6 sm:px-6">
      {/* Top Banner: Teacher Controls, Mode Switch & Reveal Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                기후 퀴즈 미션 & 실시간 정답 배틀
              </h2>
              {currentQuestion && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold border ${
                    currentQuestion.mode === 'team'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-sky-50 text-sky-700 border-sky-200'
                  }`}
                >
                  {currentQuestion.mode === 'team' ? '👥 모둠전 (1~5모둠)' : '👤 개인전'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              선생님이 제시한 사진 문제를 보고 정답을 제출하면{' '}
              <span className="text-amber-600 font-bold">제출한 순서(초 단위)</span>대로 실시간 순위가 기록됩니다.
            </p>
          </div>
        </div>

        {/* Action Controls for Teacher & Reveal Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* USER REQUIREMENT: 아이들이 처음에 정답을 볼 수 없어야해. 정답 공개를 눌렀을 때만 아이들이 쓴 정답이 공개가 되는거야. */}
          {currentQuestion && (
            <button
              type="button"
              onClick={() => {
                const nextState = !isAnswersRevealed;
                onToggleRevealAnswers(currentQuestion.id, nextState);
                if (nextState) {
                  soundManager.playCardChosen();
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm border ${
                isAnswersRevealed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-emerald-200'
                  : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-amber-200 animate-pulse'
              }`}
            >
              {isAnswersRevealed ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>📢 정답 공개 중 (클릭 시 다시 비공개)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>🔒 정답 공개하기 (클릭 시 전체 공개)</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCreatingQuestion(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            선생님 새 문제 출제
          </button>

          {currentQuestion && activeSubmissions.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('현재 문제의 모든 정답 제출 목록을 초기화하시겠습니까?')) {
                  onClearSubmissions(currentQuestion.id);
                }
              }}
              title="정답 제출 기록 초기화"
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
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
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm overflow-hidden">
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  현재 진행 중인 미션
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  시작: {new Date(currentQuestion.startedAt).toLocaleTimeString()}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 leading-snug tracking-tight">
                {currentQuestion.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {currentQuestion.description}
              </p>

              {/* Problem Image Uploaded by Teacher */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center group mb-5 max-h-[380px]">
                <img
                  src={currentQuestion.imageUrl}
                  alt={currentQuestion.title}
                  className="w-full h-auto object-contain max-h-[380px]"
                />
                <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-700 border border-slate-200 shadow-sm flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  선생님 출제 사진
                </div>
              </div>

              {/* Teacher Hint (Visible to teacher or reference) */}
              {currentQuestion.correctAnswerHint && (
                <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950">정답 해설 및 키워드: </span>
                    <span className="text-amber-800 font-medium">{currentQuestion.correctAnswerHint}</span>
                  </div>
                </div>
              )}

              {/* ANSWER INPUT FORM (아이들이 그 밑에 정답을 남기는거야) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-emerald-300 shadow-sm">
                {/* Identity Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">답변 작성자:</span>
                    {loggedInStudent ? (
                      <div className="flex items-center gap-2">
                        <CharacterAvatar characterId={loggedInStudent.selectedCharacterId} size="sm" />
                        <span className="text-sm font-black text-emerald-700">
                          {loggedInStudent.number}번 {loggedInStudent.name}
                        </span>
                        {currentQuestion.mode === 'team' && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-300 font-black">
                            {loggedInStudent.teamNumber}모둠 대표
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-amber-700 font-semibold italic">
                        (로그인 전 - 아래 목록에서 학생을 선택해주세요)
                      </span>
                    )}
                  </div>

                  {/* Student quick selection if not strictly logged in */}
                  {!currentUser.studentId && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <select
                        value={overrideStudentId}
                        onChange={(e) => setOverrideStudentId(Number(e.target.value))}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 text-xs font-medium focus:ring-1 focus:ring-emerald-500"
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

                {/* Submit Form */}
                <form onSubmit={handleSubmitAnswer} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder={
                        currentQuestion.mode === 'team'
                          ? `[${loggedInStudent?.teamNumber || 1}모둠] 우리 모둠의 정답을 입력하세요 (예: 고상가옥)...`
                          : '문제의 정답을 입력하세요 (예: 고상가옥)...'
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 pr-24 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!answerText.trim()}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      제출
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      제출 버튼을 누르면 초 단위 시간과 순위가 즉시 기록됩니다.
                    </span>
                    {myExistingSubmission && (
                      <span className="text-emerald-700 font-bold">
                        ✓ 내가 작성한 정답이 등록되었습니다 (재제출 가능)
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 shadow-sm">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-700">등록된 문제가 없습니다.</p>
              <p className="text-xs mt-1">선생님 새 문제 출제 버튼을 눌러 사진 퀴즈를 출제해보세요.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Chronological Answer Timeline (정답을 적은 순으로 나열) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-slate-900">
                  제출 현황 (시간순 실시간 순위)
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                  isAnswersRevealed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {isAnswersRevealed ? '공개 완료 ✓' : '정답 비공개 상태'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  {activeSubmissions.length}명
                </span>
              </div>
            </div>

            {/* Answers Hidden Status Banner */}
            {!isAnswersRevealed && (
              <div className="mb-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="font-semibold">
                    아이들이 서로 정답을 베끼지 않도록 현재 정답은 비공개 상태입니다.
                  </span>
                </div>
                {currentUser.role === 'teacher' && (
                  <button
                    type="button"
                    onClick={() => onToggleRevealAnswers(currentQuestion.id, true)}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-black text-[11px] hover:bg-amber-700 transition-colors flex-shrink-0"
                  >
                    정답 공개
                  </button>
                )}
              </div>
            )}

            {/* Submissions List (Strictly sorted by submittedAt ASC) */}
            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[600px] pr-1">
              {activeSubmissions.length > 0 ? (
                activeSubmissions.map((sub, index) => {
                  const student = students.find((s) => s.id === sub.studentId);
                  const card = getCardById(sub.characterId);
                  const { timeStr, diffSec } = formatTimeInfo(sub.submittedAt);
                  const isFirst = index === 0;

                  // Reveal logic:
                  // 1. If isAnswersRevealed is true -> show answer to everyone!
                  // 2. If current user is teacher -> teacher can see it
                  // 3. If the logged in student is the author of this submission -> show their own answer
                  // 4. Otherwise -> MASK the answer!
                  const isAuthor = loggedInStudent?.id === sub.studentId;
                  const canSeeAnswer = isAnswersRevealed || currentUser.role === 'teacher' || isAuthor;

                  return (
                    <div
                      key={sub.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                        isFirst
                          ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                          : sub.isGraded === true
                          ? 'bg-emerald-50/40 border-emerald-300'
                          : sub.isGraded === false
                          ? 'bg-rose-50/40 border-rose-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        {/* Rank & Student/Team Title */}
                        <div className="flex items-center gap-2">
                          {getRankBadge(index)}
                          <CharacterAvatar characterId={sub.characterId} size="sm" />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {currentQuestion?.mode === 'team' && (
                                <span className="text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                                  {sub.teamNumber}모둠
                                </span>
                              )}
                              <span className="text-xs font-black text-slate-900">
                                {sub.studentName}
                              </span>
                              {card && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${card.badgeBg}`}>
                                  {card.name}
                                </span>
                              )}
                              {isAuthor && !isAnswersRevealed && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                                  내 정답
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Submission Time Seconds */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-mono text-amber-600 font-black block">
                            +{diffSec}초
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {timeStr}
                          </span>
                        </div>
                      </div>

                      {/* Submitted Answer Text or Masked Box (USER REQUIREMENT) */}
                      <div className={`rounded-xl p-2.5 border mb-2.5 ${
                        canSeeAnswer
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-amber-50/60 border-dashed border-amber-300'
                      }`}>
                        {canSeeAnswer ? (
                          <div>
                            <div className="text-[10px] text-slate-500 font-bold mb-0.5 flex items-center justify-between">
                              <span>제출한 정답:</span>
                              {!isAnswersRevealed && currentUser.role === 'teacher' && (
                                <span className="text-indigo-600 font-normal">
                                  (선생님만 미리보기 중)
                                </span>
                              )}
                              {!isAnswersRevealed && isAuthor && currentUser.role !== 'teacher' && (
                                <span className="text-emerald-700 font-normal">
                                  (다른 친구들에겐 비공개 상태)
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-black text-slate-900 break-words">
                              {sub.answer}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 py-1 text-xs text-amber-800 font-bold">
                            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span>🔒 정답 비공개 (선생님이 정답 공개 시 확인 가능)</span>
                          </div>
                        )}
                      </div>

                      {/* Teacher Grading & Score Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5">
                          {sub.isGraded === true ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 정답 인정됨 (+1점 지급)
                            </span>
                          ) : sub.isGraded === false ? (
                            <span className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                              <XCircle className="w-3.5 h-3.5" /> 오답 처리됨
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">
                              선생님 채점 대기 중
                            </span>
                          )}
                        </div>

                        {/* Teacher Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              onGradeSubmission(sub.id, true, 1);
                              soundManager.playScoreDing();
                            }}
                            title="정답 인정 (+1점 자동 부여)"
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 text-[11px] font-bold transition-all flex items-center gap-0.5"
                          >
                            <Check className="w-3 h-3" /> 정답 (+1점)
                          </button>
                          <button
                            type="button"
                            onClick={() => onGradeSubmission(sub.id, false, 0)}
                            title="오답 처리"
                            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300 text-[11px] font-bold transition-all"
                          >
                            오답
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                  <Clock className="w-8 h-8 text-slate-300 mb-2 animate-pulse" />
                  <p className="font-bold text-slate-600">아직 제출된 정답이 없습니다.</p>
                  <p className="mt-1">왼쪽 문제의 정답을 입력하고 실시간 1등을 차지해보세요!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TEACHER CREATE QUESTION MODAL */}
      {isCreatingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <ImageIcon className="w-5 h-5" />
                </span>
                <h3 className="text-base font-black text-slate-900">
                  선생님 새 퀴즈 문제 등록 (이미지 업로드)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingQuestion(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestionSubmit} className="space-y-4 mt-4">
              {/* Competition Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. 경기 방식 선택 (개인전 vs 모둠전)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMode('individual')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      newMode === 'individual'
                        ? 'bg-sky-50 text-sky-700 border-sky-400 ring-2 ring-sky-200 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
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
                        ? 'bg-purple-50 text-purple-700 border-purple-400 ring-2 ring-purple-200 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    모둠전 (모둠별로 제출)
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. 문제 제목
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 열대 우림 고상 가옥 퀴즈"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. 문제 설명 / 질문 내용
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="아이들이 보고 풀 구체적인 미션 질문을 적어주세요."
                  rows={2}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  4. 문제 이미지 등록 (내 컴퓨터에서 사진 올리기 또는 프리셋 선택)
                </label>

                {/* File picker button */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-emerald-600" />
                    내 컴퓨터에서 이미지 파일 선택
                  </button>
                </div>

                {/* Preset quick buttons */}
                <div className="text-[11px] text-slate-500 mb-2">
                  또는 기후 단원 추천 예시 문제 바로 선택:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                  <button
                    type="button"
                    onClick={() => handleSelectPresetImage('tropical')}
                    className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-colors"
                  >
                    🌴 열대 고상가옥
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetImage('desert')}
                    className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold hover:bg-amber-100 transition-colors"
                  >
                    ☀️ 건조 카나트
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetImage('mediterranean')}
                    className="p-2 rounded-xl bg-lime-50 border border-lime-200 text-lime-800 text-[11px] font-bold hover:bg-lime-100 transition-colors"
                  >
                    🌿 온대 수목농업
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetImage('polar')}
                    className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-bold hover:bg-sky-100 transition-colors"
                  >
                    ❄️ 한대 툰드라
                  </button>
                </div>

                {/* Image Preview */}
                {newImageUrl && (
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <img
                      src={newImageUrl}
                      alt="문제 미리보기"
                      className="max-h-40 mx-auto rounded-xl object-contain border border-slate-200 bg-white"
                    />
                    <span className="text-xs text-emerald-700 font-bold block mt-1.5">
                      ✓ 이미지 등록 완료
                    </span>
                  </div>
                )}
              </div>

              {/* Correct Answer / Hint for Teacher */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  5. 정답 키워드 (선생님 채점용 참고)
                </label>
                <input
                  type="text"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  placeholder="예: 고상가옥, 통풍, 해충방지"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit / Cancel */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreatingQuestion(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 transition-all"
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
