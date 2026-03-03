import { getChatApiBaseUrl } from "@/utils/chatApiBase";

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

export const resolveChatAssetUrl = (pathOrUrl) => {
  const value = String(pathOrUrl || "").trim();
  if (!value) return "";

  if (ABSOLUTE_URL_REGEX.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${getChatApiBaseUrl()}${value}`;
  }

  return value;
};
