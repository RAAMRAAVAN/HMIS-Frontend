const API_PORT = process.env.NEXT_PUBLIC_CHAT_API_PORT || "5000";
const CONFIGURED_LAN_IP = (process.env.NEXT_PUBLIC_LAN_IP || "").trim();
const EXPLICIT_API_BASE = (process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "").trim();

const buildBaseUrl = (protocol, host, port) => `${protocol}://${host}:${port}`;

export const getChatApiBaseUrl = () => {
  if (typeof window === "undefined") {
    if (EXPLICIT_API_BASE) {
      return EXPLICIT_API_BASE;
    }

    if (CONFIGURED_LAN_IP) {
      return buildBaseUrl("http", CONFIGURED_LAN_IP, API_PORT);
    }

    return buildBaseUrl("http", "localhost", API_PORT);
  }

  const host = window.location.hostname;
  const isLocalHost = host === "localhost" || host === "127.0.0.1";
  const isLanHttpsGateway = window.location.protocol === "https:" && window.location.port === "3443";
  const protocol = window.location.protocol === "https:" ? "https" : "http";

  if (isLocalHost) {
    return buildBaseUrl("http", "localhost", API_PORT);
  }

  if (isLanHttpsGateway) {
    return window.location.origin;
  }

  if (CONFIGURED_LAN_IP) {
    return buildBaseUrl(protocol, CONFIGURED_LAN_IP, API_PORT);
  }

  if (EXPLICIT_API_BASE) {
    return EXPLICIT_API_BASE;
  }

  return buildBaseUrl(protocol, host, API_PORT);
};
