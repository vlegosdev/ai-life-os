"use client";

import { type FormEvent, useState } from "react";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<string[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();

    if (!text) {
      return;
    }

    setEntries((currentEntries) => [text, ...currentEntries]);
    setInput("");
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>AI Life OS</h1>
      </header>

      <section className="capture" aria-labelledby="capture-prompt">
        <h2 id="capture-prompt">Что у тебя сейчас в голове?</h2>
        <form className="capture-controls" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="memory-input">
            Новая запись
          </label>
          <input
            id="memory-input"
            name="memory"
            type="text"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit">Сохранить</button>
        </form>
      </section>

      <section className="history" aria-labelledby="history-title">
        <h2 id="history-title">История</h2>
        {entries.length === 0 ? (
          <p>Здесь появятся сохранённые мысли.</p>
        ) : (
          <ol className="history-list">
            {entries.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
