import type { Category, LearningModule, Level, LessonContent, LessonExample, Question } from "./types";

type RawExample = { japanese: string; reading: string; meaning: string };
type RawLesson = Omit<LearningModule, "content"> & { content: { intro: string; sections: { heading: string; body: string; example?: RawExample }[] } };
type RawLevel = Omit<Level, "categories"> & { categories: (Omit<Category, "modules"> & { modules: RawLesson[] })[] };

const hasJapanese = (value: string) => /[\u3040-\u30ff\u3400-\u9fff]/u.test(value);

function findPracticeText(question: Question): string {
  if (question.type === "matching") return question.pairs[0]?.left ?? "the key pattern";
  if (question.type === "fill_blank") return question.answer;
  return question.options.find(hasJapanese) ?? question.answer;
}

function enrichLesson(lesson: RawLesson, categoryTitle: string): LearningModule {
  const sourceExamples = lesson.content.sections.flatMap((section) => section.example ? [{ ...section.example, usage: `Use this example while studying ${lesson.title.toLowerCase()}.` }] : []);
  const practiceQuestion = lesson.quiz.questions[0];
  const practiceText = findPracticeText(practiceQuestion);
  const supplemental: LessonExample = {
    japanese: practiceText,
    reading: "Read this form slowly, then compare it with the lesson example.",
    meaning: "A key form from this lesson.",
    usage: "Try to recognize it before you start the quiz."
  };
  const examples = sourceExamples.length > 0 ? [...sourceExamples, supplemental] : [supplemental, supplemental];
  const sections = lesson.content.sections.map(({ heading, body }) => ({ heading, body }));
  sections.push({ heading: "Put it together", body: `Look at the examples once more. Notice the small detail that makes this ${categoryTitle.toLowerCase()} lesson different from the one before it.` });
  const content: LessonContent = {
    objectives: [`Recognize the main idea in ${lesson.title.toLowerCase()}.`, `Use one clear example before you begin the quiz.`, `Build confidence with a small, repeatable step.`],
    intro: lesson.content.intro,
    sections,
    examples,
    commonMistake: `Do not try to memorize every detail at once. Focus first on the pattern in the examples, then return to the quiz if you need another pass.`,
    practice: { prompt: `Before the quiz, can you recognize the key form from ${lesson.title.toLowerCase()}?`, japanese: practiceText, answer: practiceText, explanation: `This is one of the forms introduced in the lesson. Say it aloud and connect it to the explanation above.` },
    takeaway: `Remember the main pattern from ${lesson.title.toLowerCase()} and use the examples as your first reference. A short review is useful learning, not a setback.`
  };
  return { ...lesson, content };
}

export function enrichLevel(source: RawLevel): Level {
  return { ...source, categories: source.categories.map((category) => ({ ...category, modules: category.modules.map((lesson) => enrichLesson(lesson, category.title)) })) };
}
