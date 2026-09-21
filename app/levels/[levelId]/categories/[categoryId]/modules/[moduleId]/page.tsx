import Link from "next/link";
import { getAdjacentModules, getCategory, getModule } from "@/lib/content";

export default async function ModulePage({ params }: { params: Promise<{ levelId: string; categoryId: string; moduleId: string }> }) {
  const { categoryId, moduleId } = await params;
  const category = getCategory(categoryId);
  const lesson = getModule(categoryId, moduleId);
  if (!category || !lesson) return <div className="page"><h1>Lesson not found</h1></div>;
  const { previous, next } = getAdjacentModules(categoryId, moduleId);
  const moduleHref = (id: string) => `/levels/n5/categories/${categoryId}/modules/${id}`;
  return <div className="page"><article className="content-narrow">
    <Link className="lesson-back-link" href={`/levels/n5/categories/${categoryId}`}>← Back to {category.title} lessons</Link>
    <p className="eyebrow">{category.title} · {lesson.duration}</p>
    <h1>{lesson.title}</h1>
    <p className="lede">{lesson.summary}</p>
    <section className="lesson-guide"><p className="meta">By the end of this lesson</p><ul>{lesson.content.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></section>
    <div className="lesson-copy">
      <p>{lesson.content.intro}</p>
      {lesson.content.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
      <section><h2>Guided examples</h2><div className="example-list">{lesson.content.examples.map((example, index) => <div className="example" key={`${example.japanese}-${index}`}><div className="example-japanese">{example.japanese}</div><div className="example-reading">{example.reading}</div><small>{example.meaning}</small>{example.usage && <p className="example-usage">{example.usage}</p>}</div>)}</div></section>
      <aside className="mistake-note"><p className="meta">Common mistake</p><p>{lesson.content.commonMistake}</p></aside>
      <section className="practice-panel"><p className="meta">Try it before the quiz</p><p>{lesson.content.practice.prompt}</p>{lesson.content.practice.japanese && <p className="practice-japanese">{lesson.content.practice.japanese}</p>}<details><summary>Show the answer</summary><p><strong>{lesson.content.practice.answer}</strong> · {lesson.content.practice.explanation}</p></details></section>
      <section className="takeaway"><p className="meta">Remember this</p><p>{lesson.content.takeaway}</p></section>
    </div>
    <div style={{ marginTop: 64, paddingTop: 28, borderTop: "1px solid var(--line)" }}><p className="meta">Ready to practice?</p><Link className="button" href={`/quiz/${lesson.quiz.id}`}>Take the quiz · 15 questions</Link><p className="meta" style={{ marginTop: 14 }}>A fresh selection comes from a 50-question bank each time.</p></div>
    <nav className="lesson-navigation" aria-label="Lesson navigation"><Link className="text-link" href={`/levels/n5/categories/${categoryId}`}>← Back to lessons</Link><div className="lesson-navigation-siblings">{previous && <Link className="lesson-nav-button" href={moduleHref(previous.id)}>← Previous<span>{previous.title}</span></Link>}{next && <Link className="lesson-nav-button lesson-nav-next" href={moduleHref(next.id)}>Next →<span>{next.title}</span></Link>}</div></nav>
  </article></div>;
}
