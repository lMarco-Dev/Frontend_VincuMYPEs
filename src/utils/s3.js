// src/utils/s3.js
export function getSafeUrl(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.pathname = u.pathname
      .split("/")
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join("/");
    return u.toString();
  } catch {
    return url;
  }
}