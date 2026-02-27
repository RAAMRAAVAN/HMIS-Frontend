const FALLBACK_API_BASE = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "http://localhost:5000";

export const getChatApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return FALLBACK_API_BASE;
  }

  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const host = window.location.hostname;
  const port = process.env.NEXT_PUBLIC_CHAT_API_PORT || "5000";

  return `${protocol}://${host}:${port}`;
};
