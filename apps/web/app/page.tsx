export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>AI Life OS</h1>
      </header>

      <section className="capture" aria-labelledby="capture-prompt">
        <h2 id="capture-prompt">Что у тебя сейчас в голове?</h2>
        <div className="capture-controls">
          <label className="sr-only" htmlFor="memory-input">
            Новая запись
          </label>
          <input id="memory-input" name="memory" type="text" autoComplete="off" />
          <button type="button">Сохранить</button>
        </div>
      </section>

      <section className="history" aria-labelledby="history-title">
        <h2 id="history-title">История</h2>
        <p>Здесь появятся сохранённые мысли.</p>
      </section>
    </main>
  );
}
