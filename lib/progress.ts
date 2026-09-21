const KEY = "nihongo-progress";
export type Progress = { completedModules: string[]; scores: Record<string, number> };
const empty = (): Progress => ({ completedModules: [], scores: {} });
export function readProgress(): Progress { if (typeof window === "undefined") return empty(); try { return { ...empty(), ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch { return empty(); } }
export function saveQuizProgress(moduleId: string, quizId: string, score: number) { const progress = readProgress(); progress.completedModules = [...new Set([...progress.completedModules, moduleId])]; progress.scores[quizId] = score; localStorage.setItem(KEY, JSON.stringify(progress)); }
export function resetProgress() { localStorage.removeItem(KEY); }
