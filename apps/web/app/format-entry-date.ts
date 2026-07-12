const monthNames = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;

function isSameLocalDate(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function twoDigits(value: number): string {
  return value.toString().padStart(2, "0");
}

export function formatEntryDate(createdAt: string | undefined, now = new Date()): string | null {
  if (!createdAt) {
    return null;
  }

  const created = new Date(createdAt);

  if (Number.isNaN(created.getTime())) {
    return null;
  }

  const time = `${twoDigits(created.getHours())}:${twoDigits(created.getMinutes())}`;

  if (isSameLocalDate(created, now)) {
    return `Сегодня, ${time}`;
  }

  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  if (isSameLocalDate(created, yesterday)) {
    return `Вчера, ${time}`;
  }

  const date = `${created.getDate()} ${monthNames[created.getMonth()]}`;
  const year = created.getFullYear() === now.getFullYear() ? "" : ` ${created.getFullYear()}`;

  return `${date}${year}, ${time}`;
}
