import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { Student, QuizQuestion, QuizSubmission } from '../types';
import { INITIAL_STUDENTS } from '../data/students';
import { INITIAL_QUESTIONS } from '../data/quizMissions';

const STUDENTS_COL = 'students';
const QUESTIONS_COL = 'questions';
const SUBMISSIONS_COL = 'submissions';

// 1. Subscribe to Students Realtime
export function subscribeStudents(onUpdate: (students: Student[]) => void) {
  try {
    const colRef = collection(db, STUDENTS_COL);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Student[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Student);
          });
          list.sort((a, b) => a.number - b.number);
          if (list.length === 21) {
            onUpdate(list);
          }
        }
      },
      (error) => {
        console.warn('Firestore students subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe students:', err);
    return () => {};
  }
}

// 2. Subscribe to Questions Realtime
export function subscribeQuestions(onUpdate: (questions: QuizQuestion[]) => void) {
  try {
    const colRef = collection(db, QUESTIONS_COL);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: QuizQuestion[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as QuizQuestion);
          });
          list.sort((a, b) => b.startedAt - a.startedAt);
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore questions subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe questions:', err);
    return () => {};
  }
}

// 3. Subscribe to Submissions Realtime
export function subscribeSubmissions(onUpdate: (submissions: QuizSubmission[]) => void) {
  try {
    const colRef = collection(db, SUBMISSIONS_COL);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: QuizSubmission[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as QuizSubmission);
        });
        list.sort((a, b) => a.submittedAt - b.submittedAt);
        onUpdate(list);
      },
      (error) => {
        console.warn('Firestore submissions subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe submissions:', err);
    return () => {};
  }
}

// 4. Save Single Student to Firestore
export async function syncStudentToFirestore(student: Student) {
  try {
    const docRef = doc(db, STUDENTS_COL, String(student.id));
    await setDoc(docRef, student, { merge: true });
  } catch (err) {
    console.warn('Firestore syncStudent error:', err);
  }
}

// 5. Save All Students Batch
export async function syncAllStudentsToFirestore(students: Student[]) {
  try {
    const batch = writeBatch(db);
    students.forEach((student) => {
      const docRef = doc(db, STUDENTS_COL, String(student.id));
      batch.set(docRef, student, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.warn('Firestore syncAllStudents error:', err);
  }
}

// 6. Save Question to Firestore
export async function syncQuestionToFirestore(question: QuizQuestion) {
  try {
    const docRef = doc(db, QUESTIONS_COL, question.id);
    await setDoc(docRef, question, { merge: true });
  } catch (err) {
    console.warn('Firestore syncQuestion error:', err);
  }
}

// 7. Save Submission to Firestore
export async function syncSubmissionToFirestore(submission: QuizSubmission) {
  try {
    const docRef = doc(db, SUBMISSIONS_COL, submission.id);
    await setDoc(docRef, submission, { merge: true });
  } catch (err) {
    console.warn('Firestore syncSubmission error:', err);
  }
}

// 8. Delete / Clear Submissions for a Question
export async function clearQuestionSubmissionsFromFirestore(questionId: string) {
  try {
    const colRef = collection(db, SUBMISSIONS_COL);
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.questionId === questionId) {
        batch.delete(docSnap.ref);
      }
    });
    await batch.commit();
  } catch (err) {
    console.warn('Firestore clearSubmissions error:', err);
  }
}
