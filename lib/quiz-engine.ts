import type { Question, QuizAnswer } from "./types";

const normalize = (value: string) => value.trim().toLocaleLowerCase();
export function checkAnswer(question: Question, answer: QuizAnswer): boolean {
  if (question.type === "multiple_choice" || question.type === "identify") return typeof answer === "string" && answer === question.answer;
  if (question.type === "fill_blank") return typeof answer === "string" && [question.answer, ...(question.acceptedAnswers ?? [])].some((item) => normalize(item) === normalize(answer));
  if (question.type === "matching") return typeof answer === "object" && question.pairs.every((pair) => answer[pair.left] === pair.right);
  return false;
}
export function scoreQuiz(results: { correct: boolean }[]) { return results.filter((result) => result.correct).length; }

export function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function shuffleQuestion(question: Question): Question {
  if (question.type === "multiple_choice" || question.type === "identify") return { ...question, options: shuffleArray(question.options) };
  if (question.type === "matching") return { ...question, pairs: shuffleArray(question.pairs) };
  return { ...question };
}

export function selectQuizQuestions(quiz: { questions: Question[] }, count: number): Question[] {
  return shuffleArray(quiz.questions).slice(0, Math.min(count, quiz.questions.length)).map(shuffleQuestion);
}
