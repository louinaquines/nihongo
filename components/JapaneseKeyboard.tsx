"use client";

import { useState } from "react";

const hiragana = [..."あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゃゅょっー、。 "];
const katakana = [..."アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポャュョッー、。 "];

export default function JapaneseKeyboard({ value, onChange, disabled = false }: { value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const [script, setScript] = useState<"hiragana" | "katakana">("hiragana");
  const keys = script === "hiragana" ? hiragana : katakana;
  const add = (key: string) => { if (!disabled) onChange(value + key); };
  return (
    <div className="jp-keyboard" aria-label="Japanese on-screen keyboard">
      <div className="jp-keyboard-header"><span className="meta">Japanese keyboard</span><div className="jp-script-toggle" role="group" aria-label="Choose Japanese script"><button type="button" className={script === "hiragana" ? "active" : ""} onClick={() => setScript("hiragana")} disabled={disabled}>ひらがな</button><button type="button" className={script === "katakana" ? "active" : ""} onClick={() => setScript("katakana")} disabled={disabled}>カタカナ</button></div></div>
      <div className="jp-key-grid">{keys.map((key, index) => <button type="button" className="jp-key" key={`${key}-${index}`} onClick={() => add(key)} disabled={disabled} aria-label={key === " " ? "space" : key}>{key === " " ? "空白" : key}</button>)}</div>
      <div className="jp-keyboard-actions"><button type="button" className="jp-action" onClick={() => !disabled && onChange(value.slice(0, -1))} disabled={disabled}>⌫ Backspace</button><button type="button" className="jp-action" onClick={() => !disabled && onChange("")} disabled={disabled}>Clear</button></div>
    </div>
  );
}
