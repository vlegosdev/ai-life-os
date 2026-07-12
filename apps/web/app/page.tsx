"use client";

import { type FormEvent, useEffect, useState } from "react";
import {
  categories,
  filterEntries,
  isCategory,
  type Category,
  type CategoryFilter,
} from "./filter-entries";
import { formatEntryDate } from "./format-entry-date";

const categoryLabels: Record<Category, string> = {
  task: "задача",
  expense: "расход",
  goal: "цель",
  idea: "идея",
  note: "заметка",
};

const categoryFilters: Array<{ value: CategoryFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "task", label: "Задачи" },
  { value: "expense", label: "Расходы" },
  { value: "goal", label: "Цели" },
  { value: "idea", label: "Идеи" },
  { value: "note", label: "Заметки" },
];

interface Entry {
  id: string;
  text: string;
  createdAt?: string;
  category: Category;
}

function isEntry(value: unknown): value is Entry {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "text" in value &&
    typeof value.text === "string" &&
    (!("createdAt" in value) || typeof value.createdAt === "string") &&
    "category" in value &&
    isCategory(value.category)
  );
}

export default function HomePage() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingCategoryId, setUpdatingCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const visibleEntries = filterEntries(entries, search, categoryFilter);

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

  async function handleDelete(entry: Entry) {
    if (deletingId || !window.confirm("Удалить эту запись?")) {
      return;
    }

    setDeletingId(entry.id);
    setError(null);

    try {
      const response = await fetch(`/api/entries/${encodeURIComponent(entry.id)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete request failed");
      }

      setEntries((currentEntries) =>
        currentEntries.filter((currentEntry) => currentEntry.id !== entry.id),
      );
    } catch {
      setError("Не удалось удалить запись.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCategoryChange(entry: Entry, category: Category) {
    if (updatingCategoryId || category === entry.category) {
      return;
    }

    setUpdatingCategoryId(entry.id);
    setError(null);

    try {
      const response = await fetch(`/api/entries/${encodeURIComponent(entry.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) {
        throw new Error("Category request failed");
      }

      const data: unknown = await response.json();

      if (!isEntry(data)) {
        throw new Error("Category response is invalid");
      }

      setEntries((currentEntries) =>
        currentEntries.map((currentEntry) => (currentEntry.id === data.id ? data : currentEntry)),
      );
    } catch {
      setError("Не удалось изменить категорию.");
    } finally {
      setUpdatingCategoryId(null);
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
        <label className="sr-only" htmlFor="history-search">
          Найти в истории
        </label>
        <input
          className="history-search"
          id="history-search"
          type="search"
          placeholder="Найти в истории"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="category-filters" role="group" aria-label="Фильтр по категории">
          {categoryFilters.map((filter) => (
            <button
              className="category-filter"
              key={filter.value}
              type="button"
              aria-pressed={categoryFilter === filter.value}
              onClick={() => setCategoryFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        {!isLoading && entries.length === 0 ? (
          <p>Здесь появятся сохранённые мысли.</p>
        ) : visibleEntries.length > 0 ? (
          <ol className="history-list">
            {visibleEntries.map((entry) => {
              const formattedDate = formatEntryDate(entry.createdAt);

              return (
                <li key={entry.id}>
                  <div className="entry-content">
                    <span>{entry.text}</span>
                    <div className="entry-meta">
                      {formattedDate && entry.createdAt ? (
                        <time className="entry-time" dateTime={entry.createdAt}>
                          {formattedDate}
                        </time>
                      ) : null}
                      <label className="sr-only" htmlFor={`category-${entry.id}`}>
                        Категория записи
                      </label>
                      <select
                        className="entry-category"
                        id={`category-${entry.id}`}
                        value={entry.category}
                        disabled={updatingCategoryId !== null}
                        onChange={(event) => {
                          if (isCategory(event.target.value)) {
                            void handleCategoryChange(entry, event.target.value);
                          }
                        }}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {categoryLabels[category]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    className="entry-delete"
                    type="button"
                    disabled={deletingId !== null}
                    onClick={() => void handleDelete(entry)}
                  >
                    Удалить
                  </button>
                </li>
              );
            })}
          </ol>
        ) : !isLoading ? (
          <p>Ничего не найдено.</p>
        ) : null}
      </section>
    </main>
  );
}
