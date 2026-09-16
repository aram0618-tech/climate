import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Student, QuizQuestion, QuizSubmission } from '../types';
import { INITIAL_STUDENTS } from '../data/students';
import { INITIAL_QUESTIONS } from '../data/quizMissions';

const STUDENTS_COL = 'students';
const QUESTIONS_COL = 'questions';
const SUBMISSIONS_COL = 'submissions';

/**
 * Initialize Firestore data if collections are empty.
 * Seeds all 21 students and default quiz missions so that all devices see the same initial state.
 */
export async function initFirestoreData(): Promise<void> {
  try {
    const studentsSnap = await getDocs(collection(db, STUDENTS_COL));
    if (studentsSnap.empty || studentsSnap.size < 21) {
      console.log(`Seeding initial 21 students to Firestore (found ${studentsSnap.size} docs)...`);
      const batch = writeBatch(db);
      
      // Preserve any students that already exist in Firestore
      const existingMap = new Map<number, Student>();
      studentsSnap.forEach((docSnap) => {
        const d = docSnap.data() as Student;
        if (d && typeof d.id === 'number') {
          existingMap.set(d.id, d);
        }
      });

      INITIAL_STUDENTS.forEach((student) => {
        const docRef = doc(db, STUDENTS_COL, String(student.id));
        const finalStudent = existingMap.get(student.id) || student;
        batch.set(docRef, finalStudent, { merge: true });
      });

      await batch.commit();
      console.log('Seeded all 21 students to Firestore successfully.');
    }

    const questionsSnap = await getDocs(collection(db, QUESTIONS_COL));
    if (questionsSnap.empty) {
      console.log('Seeding initial questions to Firestore...');
      const batch = writeBatch(db);
      INITIAL_QUESTIONS.forEach((q) => {
        const docRef = doc(db, QUESTIONS_COL, q.id);
        batch.set(docRef, q, { merge: true });
      });
      await batch.commit();
      console.log('Seeded questions to Firestore successfully.');
    }
  } catch (error) {
    console.error('Error during initFirestoreData:', error);
  }
}

// 1. Subscribe to Students Realtime
export function subscribeStudents(onUpdate: (students: Student[]) => void) {
  try {
    const colRef = collection(db, STUDENTS_COL);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const map = new Map<number, Student>();
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Student;
            if (data && typeof data.id === 'number') {
              map.set(data.id, data);
            }
          });

          // Always maintain the complete 21-student roster, merging Firestore changes
          const fullList: Student[] = INITIAL_STUDENTS.map((base) => {
            if (map.has(base.id)) {
              return { ...base, ...map.get(base.id)! };
            }
            return base;
          });

          fullList.sort((a, b) => a.number - b.number);
          onUpdate(fullList);
        }
      },
      (error) => {
        console.error('Firestore students subscription error:', error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe students:', err);
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
        console.error('Firestore questions subscription error:', error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe questions:', err);
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
        console.error('Firestore submissions subscription error:', error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe submissions:', err);
    return () => {};
  }
}

// 4. Save Single Student to Firestore
export async function syncStudentToFirestore(student: Student): Promise<boolean> {
  try {
    const docRef = doc(db, STUDENTS_COL, String(student.id));
    await setDoc(docRef, student, { merge: true });
    console.log(`Synced student #${student.number} (${student.name}) to Firestore:`, {
      selectedCharacterId: student.selectedCharacterId,
      score: student.score,
    });
    return true;
  } catch (err) {
    console.error('Firestore syncStudent error:', err);
    return false;
  }
}

// 5. Save All Students Batch
export async function syncAllStudentsToFirestore(students: Student[]): Promise<boolean> {
  try {
    const batch = writeBatch(db);
    students.forEach((student) => {
      const docRef = doc(db, STUDENTS_COL, String(student.id));
      batch.set(docRef, student, { merge: true });
    });
    await batch.commit();
    console.log(`Synced all ${students.length} students to Firestore.`);
    return true;
  } catch (err) {
    console.error('Firestore syncAllStudents error:', err);
    return false;
  }
}

// 6. Save Question to Firestore
export async function syncQuestionToFirestore(question: QuizQuestion): Promise<boolean> {
  try {
    const docRef = doc(db, QUESTIONS_COL, question.id);
    await setDoc(docRef, question, { merge: true });
    console.log(`Synced question ${question.id} to Firestore.`);
    return true;
  } catch (err) {
    console.error('Firestore syncQuestion error:', err);
    return false;
  }
}

// 7. Save Submission to Firestore
export async function syncSubmissionToFirestore(submission: QuizSubmission): Promise<boolean> {
  try {
    const docRef = doc(db, SUBMISSIONS_COL, submission.id);
    await setDoc(docRef, submission, { merge: true });
    console.log(`Synced submission ${submission.id} to Firestore.`);
    return true;
  } catch (err) {
    console.error('Firestore syncSubmission error:', err);
    return false;
  }
}

// 8. Delete / Clear Submissions for a Question
export async function clearQuestionSubmissionsFromFirestore(questionId: string): Promise<boolean> {
  try {
    const colRef = collection(db, SUBMISSIONS_COL);
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    let count = 0;
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.questionId === questionId) {
        batch.delete(docSnap.ref);
        count++;
      }
    });
    await batch.commit();
    console.log(`Cleared ${count} submissions for question ${questionId} in Firestore.`);
    return true;
  } catch (err) {
    console.error('Firestore clearSubmissions error:', err);
    return false;
  }
}
