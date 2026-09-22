import rawContent from "../data/content.json";
import type { Category, LearningModule, Level, Question, Quiz } from "./types";
import { enrichLevel } from "./lesson-content";

const QUIZ_BANK_LENGTH = 50;
function buildDerivedQuestions(quiz: Quiz): Question[] {
  const derived: Question[] = [];
  for (const [sourceIndex, source] of quiz.questions.entries()) {
    if (source.type === "multiple_choice" || source.type === "identify") {
      source.options.forEach((option, index) => {
        derived.push({ id: "", type: "multiple_choice", prompt: `Lesson recognition ${sourceIndex + 1}.${index + 1}: is “${option}” the target form?`, options: ["Yes", "No"], answer: option === source.answer ? "Yes" : "No", explanation: option === source.answer ? "This is the target form for this lesson card." : "This is a distractor, not the target form." });
      });
    }
    if (source.type === "fill_blank") {
      derived.push({ id: "", type: "fill_blank", prompt: `Write the key form from this lesson card: ${source.answer}`, answer: source.answer, acceptedAnswers: source.acceptedAnswers });
    }
    if (source.type === "matching") {
      source.pairs.forEach((pair) => derived.push({ id: "", type: "multiple_choice", prompt: `Which meaning or sound matches “${pair.left}” in this lesson?`, options: source.pairs.map((item) => item.right), answer: pair.right }));
    }
  }
  return derived;
}

function expandQuiz(quiz: Quiz): Quiz {
  if (quiz.questions.length >= QUIZ_BANK_LENGTH) return quiz;
  const needed = QUIZ_BANK_LENGTH - quiz.questions.length;
  const additions = buildDerivedQuestions(quiz);
  const choiceSources = quiz.questions.filter((question): question is Extract<Question, { type: "multiple_choice" | "identify" }> => question.type === "multiple_choice" || question.type === "identify");
  const fillSources = quiz.questions.filter((question): question is Extract<Question, { type: "fill_blank" }> => question.type === "fill_blank");
  let round = 1;
  while (additions.length < needed) {
    const source = choiceSources[(round - 1) % Math.max(choiceSources.length, 1)];
    if (source) {
      additions.push({ id: "", type: "multiple_choice", prompt: `Independent review card ${round}: choose the correct form from this lesson set.`, options: [...source.options], answer: source.answer });
    } else if (fillSources.length) {
      const fill = fillSources[(round - 1) % fillSources.length];
      additions.push({ id: "", type: "fill_blank", prompt: `Independent writing card ${round}: enter the key form from this lesson.`, answer: fill.answer, acceptedAnswers: fill.acceptedAnswers });
    } else {
      break;
    }
    round += 1;
  }
  const numbered = additions.slice(0, needed).map((question, offset) => ({ ...question, id: `q${quiz.questions.length + offset + 1}` }));
  return { ...quiz, questions: [...quiz.questions, ...numbered] };
}

function expandLevel(source: Level): Level {
  return { ...source, categories: source.categories.map((category) => ({ ...category, modules: category.modules.map((lesson) => ({ ...lesson, quiz: expandQuiz(lesson.quiz) })) })) };
}

export const level = expandLevel(enrichLevel(rawContent as never));
export const getCategory = (id: string): Category | undefined => level.categories.find((category) => category.id === id);
export const getModule = (categoryId: string, moduleId: string): LearningModule | undefined => getCategory(categoryId)?.modules.find((module) => module.id === moduleId);
export const getAdjacentModules = (categoryId: string, moduleId: string) => {
  const category = getCategory(categoryId);
  if (!category) return { previous: undefined, next: undefined };
  const index = category.modules.findIndex((module) => module.id === moduleId);
  return { previous: index > 0 ? category.modules[index - 1] : undefined, next: index >= 0 && index < category.modules.length - 1 ? category.modules[index + 1] : undefined };
};
export const getModuleByQuiz = (quizId: string): { category: Category; module: LearningModule } | undefined => {
  for (const category of level.categories) { const lesson = category.modules.find((item) => item.quiz.id === quizId); if (lesson) return { category, module: lesson }; }
  return undefined;
};
