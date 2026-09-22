import rawContent from "../data/content.json";
import type { Category, LearningModule, Level } from "./types";
import { enrichLevel } from "./lesson-content";
export const level = enrichLevel(rawContent as never);
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
