"use client";

import { type FormEvent, useEffect, useState } from "react";

interface Entry {
  id: string;
  text: string;
  createdAt: string;
}

function isEntry(value: unknown): value is Entry {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "text" in value &&
    typeof value.text === "string" &&
    "createdAt" in value &&
    typeof value.createdAt === "string"
  );
}

export default function HomePage() {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadEntries() {
      try {
        const response = await fetch("/api/entries", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Entries request failed");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data) || !data.every(isEntry)) {
          throw new Error("Entries response is invalid");
        }

        if (active) {
          setEntries(data);
        }
      } catch {
        if (active) {
          setError("Не удалось загрузить историю.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadEntries();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();

    if (!text || isLoading || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Entry request failed");
      }

      const data: unknown = await response.json();

      if (!isEntry(data)) {
        throw new Error("Entry response is invalid");
      }

      setEntries((currentEntries) => [data, ...currentEntries]);
      setInput("");
    } catch {
      setError("Не удалось сохранить запись.");
    } finally {
      setIsSaving(false);
    }
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
          <button type="submit" disabled={isLoading || isSaving}>
            Сохранить
          </button>
        </form>
        {error ? (
          <p className="status-error" role="alert">
            {error}
          </p>
        ) : null}
      </section>

      <section className="history" aria-labelledby="history-title">
        <h2 id="history-title">История</h2>
        {!isLoading && entries.length === 0 ? (
          <p>Здесь появятся сохранённые мысли.</p>
        ) : entries.length > 0 ? (
          <ol className="history-list">
            {entries.map((entry) => (
              <li key={entry.id}>{entry.text}</li>
            ))}
          </ol>
        ) : null}
      </section>
    </main>
  );
}
