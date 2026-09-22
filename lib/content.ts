import rawContent from "../data/content.json";
import type { Category, LearningModule, Level, Question, Quiz } from "./types";
import { enrichLevel } from "./lesson-content";

const QUIZ_BANK_LENGTH = 50;
function buildDerivedQuestions(quiz: Quiz): Question[] {
  const derived: Question[] = [];
  for (const source of quiz.questions) {
    if (source.type === "multiple_choice" || source.type === "identify") {
      source.options.forEach((option, index) => {
        derived.push({ id: "", type: "multiple_choice", prompt: `Is “${option}” the correct answer to: ${source.prompt}`, options: ["Yes", "No"], answer: option === source.answer ? "Yes" : "No", explanation: option === source.answer ? "This choice matches the lesson answer." : "This choice is a distractor for this question." });
        derived.push({ id: "", type: "multiple_choice", prompt: `Which answer should you choose after checking option ${index + 1} in this lesson? ${source.prompt}`, options: [...source.options], answer: source.answer });
        derived.push({ id: "", type: "multiple_choice", prompt: `Classify “${option}” for this lesson check: ${source.prompt}`, options: ["Correct answer", "Distractor"], answer: option === source.answer ? "Correct answer" : "Distractor" });
      });
    }
    if (source.type === "fill_blank") {
      const prompts = [
        `Write the missing form from this lesson: ${source.prompt}`,
        `Complete this sentence without looking back: ${source.prompt}`,
        `Recall the exact kana, word, or particle needed here: ${source.prompt}`,
        `Use the lesson pattern to fill the blank: ${source.prompt}`,
        `What belongs in the empty space? ${source.prompt}`,
        `Write the answer you would say aloud for: ${source.prompt}`,
        `Practice the written form for this prompt: ${source.prompt}`,
        `Complete this quick recall card: ${source.prompt}`,
        `Apply the lesson rule here: ${source.prompt}`,
        `Check your memory of this form: ${source.prompt}`,
        `Build the missing answer carefully: ${source.prompt}`,
        `Finish the lesson example: ${source.prompt}`
      ];
      prompts.forEach((prompt) => derived.push({ id: "", type: "fill_blank", prompt, answer: source.answer, acceptedAnswers: source.acceptedAnswers }));
    }
    if (source.type === "matching") {
      source.pairs.forEach((pair) => derived.push({ id: "", type: "multiple_choice", prompt: `Which meaning or sound matches “${pair.left}” in this lesson?`, options: source.pairs.map((item) => item.right), answer: pair.right }));
    }
  }
  return derived;
}

function expandQuiz(quiz: Quiz): Quiz {
  if (quiz.questions.length >= QUIZ_BANK_LENGTH) return quiz;
  const additions = buildDerivedQuestions(quiz).slice(0, QUIZ_BANK_LENGTH - quiz.questions.length).map((question, offset) => ({ ...question, id: `q${quiz.questions.length + offset + 1}` }));
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
