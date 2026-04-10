export interface JwtDecodeResult {
  header: string;
  payload: string;
  valid: boolean;
  error?: string;
}

function decodeBase64Url(segment: string) {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const decoded = atob(normalized + padding);

  try {
    return decodeURIComponent(
      Array.from(decoded)
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
  } catch {
    return decoded;
  }
}

export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim();

  if (!trimmed) {
    return {
      header: "",
      payload: "",
      valid: false,
      error: "Enter a JWT to decode.",
    };
  }

  const parts = trimmed.split(".");
  if (parts.length < 2) {
    return {
      header: "",
      payload: "",
      valid: false,
      error: "A JWT must contain at least header and payload segments.",
    };
  }

  try {
    const headerObject = JSON.parse(decodeBase64Url(parts[0]));
    const payloadObject = JSON.parse(decodeBase64Url(parts[1]));

    return {
      header: JSON.stringify(headerObject, null, 2),
      payload: JSON.stringify(payloadObject, null, 2),
      valid: true,
    };
  } catch {
    return {
      header: "",
      payload: "",
      valid: false,
      error: "Unable to decode this token. Check that it is valid Base64URL JSON.",
    };
  }
}
