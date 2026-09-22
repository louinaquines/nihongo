import type { Level, Question } from "./types";

const QUESTION_TYPES = new Set(["multiple_choice", "identify", "fill_blank", "matching"]);

export function validateContent(level: Level): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const remember = (id: string, kind: string) => { if (ids.has(id)) errors.push(`Duplicate ${kind} id: ${id}`); ids.add(id); };
  remember(level.id, "level");
  if (!level.categories.length) errors.push("Level has no categories");
  for (const category of level.categories) {
    remember(category.id, "category");
    if (!category.modules.length) errors.push(`Category has no modules: ${category.id}`);
    for (const lesson of category.modules) {
      remember(lesson.id, "module");
      if (!lesson.content.intro.trim() || lesson.content.objectives.length < 2 || lesson.content.sections.length < 3 || lesson.content.examples.length < 2 || !lesson.content.commonMistake.trim() || !lesson.content.practice.prompt.trim() || !lesson.content.practice.answer.trim() || !lesson.content.practice.explanation.trim() || !lesson.content.takeaway.trim()) errors.push(`Incomplete guided lesson content: ${lesson.id}`);
      lesson.content.examples.forEach((example, index) => { if (!example.japanese.trim() || !example.reading.trim() || !example.meaning.trim()) errors.push(`Incomplete lesson example: ${lesson.id}.example${index + 1}`); });
      remember(lesson.quiz.id, "quiz");
      if (lesson.quiz.questions.length !== 50) errors.push(`Quiz bank must have 50 questions: ${lesson.quiz.id}`);
      const questionIds = new Set<string>();
      lesson.quiz.questions.forEach((question) => { if (questionIds.has(question.id)) errors.push(`Duplicate question id: ${lesson.quiz.id}.${question.id}`); questionIds.add(question.id); });
      const prompts = lesson.quiz.questions.map((question) => question.prompt.trim().toLocaleLowerCase());
      if (new Set(prompts).size !== prompts.length) errors.push(`Duplicate question prompt: ${lesson.quiz.id}`);
      lesson.quiz.questions.forEach((question, index) => validateQuestion(question, `${lesson.quiz.id}.q${index + 1}`, errors));
    }
  }
  return errors;
}

function validateQuestion(question: Question, label: string, errors: string[]) {
  if (!QUESTION_TYPES.has(question.type)) errors.push(`Unsupported question type: ${label}`);
  if (!question.prompt.trim()) errors.push(`Missing question prompt: ${label}`);
  if ((question.type === "multiple_choice" || question.type === "identify") && (!question.options.length || !question.options.includes(question.answer))) errors.push(`Invalid choice answer: ${label}`);
  if (question.type === "fill_blank" && !question.answer.trim()) errors.push(`Missing fill answer: ${label}`);
  if (question.type === "matching") {
    if (!question.pairs.length) errors.push(`Empty matching question: ${label}`);
    const right = question.pairs.map((pair) => pair.right);
    if (new Set(right).size !== right.length) errors.push(`Ambiguous matching choices: ${label}`);
  }
}
