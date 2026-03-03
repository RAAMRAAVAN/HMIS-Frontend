const STORAGE_KEY = "whatsapp_call_anomalies_v1";
const MAX_LOCAL_ENTRIES = 200;

function safeNormalize(value) {
  return String(value || "").trim().toLowerCase();
}

function readStoredAnomalies() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredAnomalies(entries) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_LOCAL_ENTRIES)));
  } catch {
    // Best-effort tracking only.
  }
}

export function trackCallAnomaly({
  socket = null,
  code,
  message,
  severity = "warn",
  from = null,
  contact = null,
  callId = null,
  details = null,
} = {}) {
  if (!code || !message) return;

  const payload = {
    code: String(code),
    message: String(message),
    severity: severity === "error" ? "error" : "warn",
    from: safeNormalize(from),
    contact: safeNormalize(contact),
    callId: callId ? String(callId).trim() : null,
    details: details && typeof details === "object" ? details : null,
    createdAt: new Date().toISOString(),
    createdAtMs: Date.now(),
    source: "frontend",
  };

  const entries = [payload, ...readStoredAnomalies()];
  writeStoredAnomalies(entries);

  if (payload.severity === "error") {
    console.error("[CallAnomaly]", payload);
  } else {
    console.warn("[CallAnomaly]", payload);
  }

  if (socket && typeof socket.emit === "function") {
    socket.emit("call:anomaly", payload);
  }
}

export function getStoredCallAnomalies() {
  return readStoredAnomalies();
}
