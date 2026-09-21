"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { checkAnswer, scoreQuiz, selectQuizQuestions } from "@/lib/quiz-engine";
import { saveQuizProgress } from "@/lib/progress";
import type { Quiz, QuizAnswer } from "@/lib/types";
import JapaneseKeyboard from "./JapaneseKeyboard";

export default function QuizRunner({ quiz, moduleId, questionCount = 15 }: { quiz: Quiz; moduleId: string; questionCount?: number }) {
  const [activeQuiz, setActiveQuiz] = useState<Quiz>({ ...quiz, questions: quiz.questions.slice(0, questionCount) });
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<QuizAnswer>("");
  const [results, setResults] = useState<{ questionId: string; answer: QuizAnswer; correct: boolean }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveQuiz({ ...quiz, questions: selectQuizQuestions(quiz, questionCount) });
      setIndex(0);
      setAnswer("");
      setResults([]);
      setSubmitted(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [quiz, questionCount]);
  const question = activeQuiz.questions[index];
  const isLast = index === activeQuiz.questions.length - 1;
  const matchingPairs = question.type === "matching" ? question.pairs : [];
  const currentCorrect = submitted && results[results.length - 1]?.correct;

  const submit = () => {
    if (submitted) return;
    const correct = checkAnswer(question, answer);
    setResults([...results, { questionId: question.id, answer, correct }]);
    setSubmitted(true);
  };

  const next = () => {
    if (!submitted) return;
    if (isLast) {
      const finalResults = [...results];
      const score = scoreQuiz(finalResults);
      saveQuizProgress(moduleId, activeQuiz.id, score);
      const mode = questionCount === quiz.questions.length ? "&mode=general" : "";
      router.push(`/quiz/${activeQuiz.id}/results?score=${score}&total=${activeQuiz.questions.length}${mode}`);
      return;
    }
    setIndex(index + 1);
    setAnswer(activeQuiz.questions[index + 1].type === "matching" ? {} : "");
    setSubmitted(false);
  };

  const choose = (value: string) => { if (!submitted) setAnswer(value); };
  const match = (left: string, right: string) => { if (!submitted) setAnswer({ ...(typeof answer === "object" ? answer : {}), [left]: right }); };

  return (
    <div className="quiz-shell">
      <div className="quiz-top"><span>{activeQuiz.title}</span><span>{index + 1} / {activeQuiz.questions.length}</span></div>
      <div className="progress-track"><div className="progress-value" style={{ width: `${((index + (submitted ? 1 : 0)) / activeQuiz.questions.length) * 100}%` }} /></div>
      <motion.div key={question.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="question-title">{question.prompt}</h1>
        {(question.type === "multiple_choice" || question.type === "identify") && <div className="option-list">{question.options.map((option) => <button className={`option ${answer === option ? "selected" : ""}`} onClick={() => choose(option)} key={option}>{option}</button>)}</div>}
        {question.type === "fill_blank" && <><input className="answer-input" value={typeof answer === "string" ? answer : ""} onChange={(event) => setAnswer(event.target.value)} placeholder={question.placeholder ?? "Type your answer"} aria-label="Your answer" disabled={submitted} /><JapaneseKeyboard value={typeof answer === "string" ? answer : ""} onChange={setAnswer} disabled={submitted} /></>}
        {question.type === "matching" && <div className="match-grid">{matchingPairs.map((pair) => <div key={pair.left}><p className="meta">{pair.left}</p><select className="answer-input" value={typeof answer === "object" ? answer[pair.left] ?? "" : ""} onChange={(event) => match(pair.left, event.target.value)} disabled={submitted}><option value="">Choose…</option>{matchingPairs.map((item) => <option key={item.right} value={item.right}>{item.right}</option>)}</select></div>)}</div>}
        {submitted && <div className={`feedback ${currentCorrect ? "correct" : "incorrect"}`} role="status">{currentCorrect ? "Correct. Keep that connection." : <>Not quite. {question.explanation ?? `The answer is ${question.type === "matching" ? "the matching set" : question.type === "fill_blank" ? question.answer : question.answer}.`}</>}</div>}
        <button className="button" onClick={submitted ? next : submit} disabled={!submitted && (answer === "" || (typeof answer === "object" && Object.keys(answer).length !== matchingPairs.length))}>{submitted ? (isLast ? "See results" : "Next question") : "Check answer"}</button>
      </motion.div>
      <p style={{ marginTop: 38 }}><Link className="text-link" href="/levels/n5">Exit quiz</Link></p>
    </div>
  );
}
