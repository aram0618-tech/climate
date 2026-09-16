import React, { useState, useEffect } from 'react';
import { ClimateCard, Student, CurrentUser, QuizQuestion, QuizSubmission } from './types';
import { CLIMATE_CARDS } from './data/climateCards';
import { loadStoredStudents, saveStoredStudents, resetAllStudents } from './data/students';
import {
  loadStoredQuestions,
  saveStoredQuestions,
  loadStoredSubmissions,
  saveStoredSubmissions,
} from './data/quizMissions';
import {
  subscribeStudents,
  subscribeQuestions,
  subscribeSubmissions,
  syncStudentToFirestore,
  syncAllStudentsToFirestore,
  syncQuestionToFirestore,
  syncSubmissionToFirestore,
  clearQuestionSubmissionsFromFirestore,
  initFirestoreData,
} from './lib/firestoreSync';
import { testFirebaseConnection } from './lib/firebase';
import { ClimateCardTopList } from './components/ClimateCardTopList';
import { StudentList } from './components/StudentList';
import { QuizMissionTab } from './components/QuizMissionTab';
import { LoginModal } from './components/LoginModal';
import { ConfirmSelectionModal } from './components/ConfirmSelectionModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { TeacherControlModal } from './components/TeacherControlModal';
import { soundManager } from './utils/audio';
import {
  Globe,
  Compass,
  User,
  LogOut,
  GraduationCap,
  Sparkles,
  Volume2,
  VolumeX,
  Shield,
  HelpCircle,
  LayoutGrid,
  Trophy,
  CloudCheck,
} from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => loadStoredStudents());
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => ({ role: 'guest' }));

  // Tab State: 'cards' = 플레이어 카드 & 21명 학생 현황, 'quiz' = 기후 퀴즈 미션 & 정답 제출
  const [activeTab, setActiveTab] = useState<'cards' | 'quiz'>('cards');

  // Quiz questions & submissions
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => loadStoredQuestions());
  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => loadStoredSubmissions());

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedCardForConfirm, setSelectedCardForConfirm] = useState<ClimateCard | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // 1. Initialize and Subscribe to Firestore Realtime Updates
  useEffect(() => {
    testFirebaseConnection().then(async (connected) => {
      setIsFirebaseConnected(connected);
      if (connected) {
        await initFirestoreData();
      }
    });

    // Subscribe to Students
    const unsubStudents = subscribeStudents((cloudStudents) => {
      if (cloudStudents && cloudStudents.length > 0) {
        setStudents(cloudStudents);
        saveStoredStudents(cloudStudents);
      }
    });

    // Subscribe to Questions
    const unsubQuestions = subscribeQuestions((cloudQuestions) => {
      if (cloudQuestions && cloudQuestions.length > 0) {
        setQuestions(cloudQuestions);
        saveStoredQuestions(cloudQuestions);
      }
    });

    // Subscribe to Submissions
    const unsubSubmissions = subscribeSubmissions((cloudSubmissions) => {
      setSubmissions(cloudSubmissions);
      saveStoredSubmissions(cloudSubmissions);
    });

    return () => {
      unsubStudents();
      unsubQuestions();
      unsubSubmissions();
    };
  }, []);

  // Local Storage Mirroring
  useEffect(() => {
    saveStoredStudents(students);
  }, [students]);

  useEffect(() => {
    saveStoredQuestions(questions);
  }, [questions]);

  useEffect(() => {
    saveStoredSubmissions(submissions);
  }, [submissions]);

  // Current logged in student object
  const loggedInStudent = currentUser.studentId
    ? students.find((s) => s.id === currentUser.studentId) || null
    : null;

  // Handle Card Click from Top List
  const handleSelectCardFromTop = (card: ClimateCard) => {
    if (currentUser.role !== 'student' || !currentUser.studentId) {
      setIsLoginModalOpen(true);
      return;
    }

    if (loggedInStudent?.selectedCharacterId) {
      alert(
        `이미 '${loggedInStudent.name}' 학생은 플레이어 카드를 선택했습니다.\n플레이어 카드는 한 번 선택하면 절대 변경할 수 없습니다!`
      );
      return;
    }

    setSelectedCardForConfirm(card);
    setIsConfirmModalOpen(true);
  };

  // Irreversible Card Confirmation Handler
  const handleConfirmCardSelection = async (studentId: number, cardId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student || student.selectedCharacterId) return;

    const updatedStudent: Student = {
      ...student,
      selectedCharacterId: cardId,
      selectedAt: new Date().toISOString(),
    };

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? updatedStudent : s))
    );

    // Sync to Firestore immediately so all other clients update in real-time
    await syncStudentToFirestore(updatedStudent);

    setIsConfirmModalOpen(false);
    setSelectedCardForConfirm(null);

    if (soundEnabled) {
      soundManager.playCardChosen();
    }
  };

  // Toggle Major Ability
  const handleToggleMajorAbility = (studentId: number) => {
    let targetStudent: Student | null = null;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = {
            ...s,
            majorAbilityUsed: !s.majorAbilityUsed,
          };
          targetStudent = updated;
          return updated;
        }
        return s;
      })
    );
    if (targetStudent) {
      syncStudentToFirestore(targetStudent);
    }
  };

  // Toggle Hidden Ability
  const handleToggleHiddenAbility = (studentId: number) => {
    let targetStudent: Student | null = null;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = {
            ...s,
            hiddenAbilityUsed: !s.hiddenAbilityUsed,
          };
          targetStudent = updated;
          return updated;
        }
        return s;
      })
    );
    if (targetStudent) {
      syncStudentToFirestore(targetStudent);
    }
  };

  // Update Score for single student
  const handleUpdateScore = (studentId: number, delta: number) => {
    let targetStudent: Student | null = null;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = {
            ...s,
            score: Math.max(0, s.score + delta),
          };
          targetStudent = updated;
          return updated;
        }
        return s;
      })
    );
    if (targetStudent) {
      syncStudentToFirestore(targetStudent);
    }
  };

  // Update Score for entire team (모둠전용)
  const handleUpdateTeamScore = (teamNumber: number, delta: number) => {
    const updatedList: Student[] = [];
    setStudents((prev) =>
      prev.map((s) => {
        if (s.teamNumber === teamNumber) {
          const updated = {
            ...s,
            score: Math.max(0, s.score + delta),
          };
          updatedList.push(updated);
          return updated;
        }
        return s;
      })
    );
    if (updatedList.length > 0) {
      syncAllStudentsToFirestore(updatedList);
    }
  };

  // Multiply Score (e.g. Jangbogo 2x score chance)
  const handleMultiplyScore = (studentId: number, multiplier: number) => {
    let targetStudent: Student | null = null;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = {
            ...s,
            score: s.score * multiplier,
          };
          targetStudent = updated;
          return updated;
        }
        return s;
      })
    );
    if (targetStudent) {
      syncStudentToFirestore(targetStudent);
    }
  };

  // Teacher Tool Actions
  const handleResetAllAbilities = () => {
    const updated = students.map((s) => ({
      ...s,
      majorAbilityUsed: false,
      hiddenAbilityUsed: false,
    }));
    setStudents(updated);
    syncAllStudentsToFirestore(updated);
  };

  const handleResetStudentSelection = (studentId: number) => {
    let targetStudent: Student | null = null;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const res = {
            ...s,
            selectedCharacterId: null,
            majorAbilityUsed: false,
            hiddenAbilityUsed: false,
          };
          targetStudent = res;
          return res;
        }
        return s;
      })
    );
    if (targetStudent) {
      syncStudentToFirestore(targetStudent);
    }
  };

  const handleResetEntireClass = () => {
    const fresh = resetAllStudents();
    setStudents(fresh);
    setSubmissions([]);
    syncAllStudentsToFirestore(fresh);
  };

  const handleAddScoreAll = (points: number) => {
    const updated = students.map((s) => ({
      ...s,
      score: Math.max(0, s.score + points),
    }));
    setStudents(updated);
    syncAllStudentsToFirestore(updated);
    if (soundEnabled) {
      soundManager.playScoreDing();
    }
  };

  // Student Card Detail Click
  const handleOpenStudentDetail = (student: Student) => {
    setSelectedStudentForDetail(student);
    setIsDetailModalOpen(true);
  };

  // Quiz Mission Handlers
  const handleAddQuestion = (newQ: QuizQuestion) => {
    setQuestions((prev) => [
      newQ,
      ...prev.map((q) => ({ ...q, isActive: false })),
    ]);
    syncQuestionToFirestore(newQ);
  };

  // User requirement: 정답 공개 버튼을 눌렀을 때만 아이들이 쓴 정답이 공개
  const handleToggleRevealAnswers = (questionId: string, isRevealed: boolean) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, isAnswersRevealed: isRevealed } : q
      )
    );
    const targetQ = questions.find((q) => q.id === questionId);
    if (targetQ) {
      syncQuestionToFirestore({ ...targetQ, isAnswersRevealed: isRevealed });
    }
  };

  const handleSubmitAnswer = (newSub: Omit<QuizSubmission, 'id' | 'submittedAt'>) => {
    const submissionItem: QuizSubmission = {
      ...newSub,
      id: 'sub-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
      submittedAt: Date.now(),
      isGraded: null,
    };
    setSubmissions((prev) => [...prev, submissionItem]);
    syncSubmissionToFirestore(submissionItem);
  };

  const handleGradeSubmission = (submissionId: string, isCorrect: boolean, awardScoreDelta = 1) => {
    const targetSub = submissions.find((s) => s.id === submissionId);
    if (!targetSub) return;

    const updatedSub: QuizSubmission = { ...targetSub, isGraded: isCorrect };
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? updatedSub : s))
    );
    syncSubmissionToFirestore(updatedSub);

    // If marked correct, automatically award score to the student or their whole team
    if (isCorrect && awardScoreDelta > 0) {
      const activeQ = questions.find((q) => q.id === targetSub.questionId);
      if (activeQ?.mode === 'team') {
        handleUpdateTeamScore(targetSub.teamNumber, awardScoreDelta);
      } else {
        handleUpdateScore(targetSub.studentId, awardScoreDelta);
      }
    }
  };

  const handleClearSubmissions = (questionId: string) => {
    setSubmissions((prev) => prev.filter((s) => s.questionId !== questionId));
    clearQuestionSubmissionsFromFirestore(questionId);
  };

  const activeQuestion = questions.find((q) => q.isActive) || questions[0];
  const activeSubmissionsCount = activeQuestion
    ? submissions.filter((s) => s.questionId === activeQuestion.id).length
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar - Bright Theme */}
      <header className="sticky top-0 z-30 bg-white/95 border-b border-slate-200 backdrop-blur-md px-4 py-3 sm:px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & App Name: 기후 탐험대 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-400 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold">
                  초등 사회 · 기후 단원
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">
                  세계 5대 기후 탐험
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                기후 탐험대
              </h1>
            </div>
          </div>

          {/* Right Action Bar: Firebase Sync, Sound, Teacher tools & Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Firebase Live Cloud Sync Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isFirebaseConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs'
              }`}
              title={
                isFirebaseConnected
                  ? 'Firebase Firestore 실시간 연동 중: 학생 카드 선택 및 정답이 모든 기기에 실시간 반영됩니다.'
                  : 'Firebase 연결 확인 중...'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="hidden md:inline font-bold">
                {isFirebaseConnected ? '클라우드 실시간 동기화 ON' : '클라우드 연결 중'}
              </span>
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? '효과음 켜짐' : '효과음 음소거'}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors shadow-2xs"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Teacher Tools button */}
            <button
              type="button"
              onClick={() => setIsTeacherModalOpen(true)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                currentUser.role === 'teacher'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">선생님 도구</span>
            </button>

            {/* User Session Profile & Switch */}
            {currentUser.role === 'student' && loggedInStudent ? (
              <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-300 px-3 py-1.5 rounded-xl shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-black text-emerald-950">
                    {loggedInStudent.number}번 {loggedInStudent.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200 font-black">
                    {loggedInStudent.teamNumber}모둠
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentUser({ role: 'guest' })}
                  title="로그아웃"
                  className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-700 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : currentUser.role === 'teacher' ? (
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl shadow-2xs">
                <span className="text-xs font-black text-indigo-800">선생님 모드 ON</span>
                <button
                  type="button"
                  onClick={() => setCurrentUser({ role: 'guest' })}
                  title="일반 모드로 전환"
                  className="p-1 rounded-lg hover:bg-indigo-100 text-indigo-600 hover:text-indigo-900 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-black transition-all shadow-sm flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                학생 로그인
              </button>
            )}
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 flex items-center gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 border ${
              activeTab === 'cards'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>플레이어 카드 & 21명 학생 현황</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 border relative ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>기후 퀴즈 미션 & 정답 제출 (실시간 순위)</span>
            {activeSubmissionsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                {activeSubmissionsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'cards' ? (
          <div>
            {/* SECTION 1: TOP 5 CLIMATE PLAYER CARDS */}
            <ClimateCardTopList
              cards={CLIMATE_CARDS}
              students={students}
              currentUser={currentUser}
              onSelectCard={handleSelectCardFromTop}
            />

            {/* SECTION 2: 21 STUDENTS BUTTONS & REAL-TIME STATUS */}
            <StudentList
              students={students}
              currentUser={currentUser}
              onToggleMajorAbility={handleToggleMajorAbility}
              onToggleHiddenAbility={handleToggleHiddenAbility}
              onUpdateScore={handleUpdateScore}
              onMultiplyScore={handleMultiplyScore}
              onClickStudent={handleOpenStudentDetail}
            />
          </div>
        ) : (
          /* TAB 2: CLIMATE QUIZ MISSION & SUBMISSIONS */
          <QuizMissionTab
            students={students}
            currentUser={currentUser}
            questions={questions}
            submissions={submissions}
            onAddQuestion={handleAddQuestion}
            onSubmitAnswer={handleSubmitAnswer}
            onGradeSubmission={handleGradeSubmission}
            onClearSubmissions={handleClearSubmissions}
            onUpdateStudentScore={handleUpdateScore}
            onUpdateTeamScore={handleUpdateTeamScore}
            onToggleRevealAnswers={handleToggleRevealAnswers}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-5 px-4 text-center text-xs text-slate-500 shadow-2xs">
        <p className="flex items-center justify-center gap-2">
          <span>🌍 초등학교 사회과 세계 기후 학습용 기후 탐험대 대시보드</span>
          <span>·</span>
          <span>기후 퀴즈 미션 & 실시간 정답 배틀 (Firebase Firestore 클라우드 동기화)</span>
        </p>
      </footer>

      {/* MODAL 1: Simple Login */}
      <LoginModal
        students={students}
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* MODAL 2: Irreversible Selection Confirmation */}
      <ConfirmSelectionModal
        card={selectedCardForConfirm}
        student={loggedInStudent}
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmCardSelection}
      />

      {/* MODAL 3: Detailed Student Character Sheet */}
      <StudentDetailModal
        student={selectedStudentForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudentForDetail(null);
        }}
        onToggleMajorAbility={handleToggleMajorAbility}
        onToggleHiddenAbility={handleToggleHiddenAbility}
        onUpdateScore={handleUpdateScore}
      />

      {/* MODAL 4: Teacher Control Classroom Tools */}
      <TeacherControlModal
        students={students}
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onResetAllAbilities={handleResetAllAbilities}
        onResetStudentSelection={handleResetStudentSelection}
        onResetEntireClass={handleResetEntireClass}
        onAddScoreAll={handleAddScoreAll}
      />
    </div>
  );
}
