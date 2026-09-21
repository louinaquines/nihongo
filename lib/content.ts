import rawContent from "../data/content.json";
import type { Category, LearningModule, Level, Quiz } from "./types";
import { enrichLevel } from "./lesson-content";

const QUIZ_BANK_LENGTH = 50;

function expandQuiz(quiz: Quiz): Quiz {
  if (quiz.questions.length >= QUIZ_BANK_LENGTH) return quiz;
  const additions = Array.from({ length: QUIZ_BANK_LENGTH - quiz.questions.length }, (_, offset) => {
    const source = quiz.questions[offset % quiz.questions.length];
    return { ...source, id: `q${quiz.questions.length + offset + 1}`, prompt: `Quick recall: ${source.prompt}` };
  });
  return { ...quiz, questions: [...quiz.questions, ...additions] };
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
