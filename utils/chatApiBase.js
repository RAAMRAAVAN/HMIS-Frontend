const FALLBACK_API_BASE = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "http://localhost:5000";

export const getChatApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return FALLBACK_API_BASE;
  }

  const host = window.location.hostname;
  const isLocalHost = host === "localhost" || host === "127.0.0.1";
  const isLanHttpsGateway = window.location.protocol === "https:" && window.location.port === "3443";

  if (isLocalHost) {
    return "http://localhost:5000";
  }

  if (isLanHttpsGateway) {
    return window.location.origin;
  }

  const explicitApiBase = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL;
  if (explicitApiBase) {
    return explicitApiBase;
  }

  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const port = process.env.NEXT_PUBLIC_CHAT_API_PORT || "5000";

  return `${protocol}://${host}:${port}`;
};
