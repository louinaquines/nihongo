import { describe, expect, it } from "vitest";
import { checkAnswer, scoreQuiz, selectQuizQuestions, shuffleArray, shuffleQuestion } from "./quiz-engine";
import type { Question } from "./types";

const choice: Question = { id: "1", conceptKey: "test-choice", type: "multiple_choice", prompt: "Which answer is a?", options: ["a", "b"], answer: "a" };

describe("quiz engine", () => {
  it("checks choice answers", () => {
    expect(checkAnswer(choice, "a")).toBe(true);
    expect(checkAnswer(choice, "b")).toBe(false);
    expect(checkAnswer(choice, "")).toBe(false);
  });
  it("accepts normalized fill answers", () => {
    expect(checkAnswer({ id: "2", conceptKey: "test-fill", type: "fill_blank", prompt: "", answer: "お", acceptedAnswers: ["o"] }, " O ")).toBe(true);
  });
  it("checks every matching pair", () => {
    const question: Question = { id: "3", conceptKey: "test-matching", type: "matching", prompt: "", pairs: [{ left: "あ", right: "a" }, { left: "い", right: "i" }] };
    expect(checkAnswer(question, { あ: "a", い: "i" })).toBe(true);
    expect(checkAnswer(question, { あ: "a" })).toBe(false);
  });
  it("scores correct results", () => { expect(scoreQuiz([{ correct: true }, { correct: false }, { correct: true }])).toBe(2); });
  it("shuffles without mutating the source", () => {
    const source = [1, 2, 3, 4, 5]; const copy = [...source]; const result = shuffleArray(source);
    expect(source).toEqual(copy); expect(result).toHaveLength(source.length); expect(result).toEqual(expect.arrayContaining(source));
  });
  it("selects a fresh attempt and preserves answer mappings", () => {
    const matching: Question = { id: "m", conceptKey: "test-matching-2", type: "matching", prompt: "", pairs: [{ left: "あ", right: "a" }, { left: "い", right: "i" }] };
    const selected = selectQuizQuestions({ questions: [choice, matching] }, 2);
    expect(selected).toHaveLength(2);
    const shuffledMatching = selected.find((question) => question.type === "matching");
    expect(shuffledMatching && checkAnswer(shuffledMatching, { あ: "a", い: "i" })).toBe(true);
    const shuffledChoice = shuffleQuestion(choice);
    expect(shuffledChoice.type === "multiple_choice" && shuffledChoice.options).toEqual(expect.arrayContaining(["a", "b"]));
  });
});
