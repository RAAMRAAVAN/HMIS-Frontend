export function toEpochMs(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value <= 0) return Date.now();
    return value < 1e12 ? Math.trunc(value * 1000) : Math.trunc(value);
  }

  if (typeof value === "string" && value.trim()) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return numeric < 1e12 ? Math.trunc(numeric * 1000) : Math.trunc(numeric);
    }

    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value.getTime();
  }

  return Date.now();
}

function startOfLocalDay(timestampMs) {
  const date = new Date(timestampMs);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function getDayDiffFromToday(timestampMs) {
  const todayStart = startOfLocalDay(Date.now());
  const targetStart = startOfLocalDay(timestampMs);
  return Math.round((todayStart - targetStart) / (24 * 60 * 60 * 1000));
}

export function formatChatBubbleDateTime(value, locale) {
  const timestampMs = toEpochMs(value);
  const date = new Date(timestampMs);

  const time = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const day = date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return { time, day, timestampMs };
}

export function formatLastSeenLabel({ isOnline, lastSeen, locale }) {
  if (isOnline) return "Online";
  if (!lastSeen) return "";

  const timestampMs = toEpochMs(lastSeen);
  const date = new Date(timestampMs);
  const dayDiff = getDayDiffFromToday(timestampMs);

  const timeText = date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (dayDiff === 0) return `last seen today at ${timeText}`;
  if (dayDiff === 1) return `last seen yesterday at ${timeText}`;

  const dateText = date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `last seen ${dateText} at ${timeText}`;
}
