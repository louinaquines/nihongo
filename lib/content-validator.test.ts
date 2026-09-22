import { describe, expect, it } from "vitest";
import { level } from "./content";
import { validateContent } from "./content-validator";
import type { Level } from "./types";

describe("N5 content catalog", () => {
  it("contains the planned five categories and 28 modules", () => {
    expect(level.categories.map((category) => category.id)).toEqual(["hiragana", "katakana", "kanji", "vocabulary", "grammar"]);
    expect(level.categories.reduce((count, category) => count + category.modules.length, 0)).toBe(28);
  });

  it("has no structural or answer-data errors", () => {
    expect(validateContent(level as Level)).toEqual([]);
  });

  it("gives every lesson a simple guided structure", () => {
    for (const category of level.categories) for (const lesson of category.modules) {
      expect(lesson.content.objectives.length).toBeGreaterThanOrEqual(2);
      expect(lesson.content.sections.length).toBeGreaterThanOrEqual(3);
      expect(lesson.content.examples.length).toBeGreaterThanOrEqual(2);
      expect(lesson.content.commonMistake).not.toHaveLength(0);
      expect(lesson.content.practice.answer).not.toHaveLength(0);
      expect(lesson.content.takeaway).not.toHaveLength(0);
      expect(lesson.quiz.questions).toHaveLength(50);
      expect(new Set(lesson.quiz.questions.map((question) => question.prompt)).size).toBe(50);
    }
  });
});
