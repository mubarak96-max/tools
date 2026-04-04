import { compactText } from "@/lib/text";

function getStorageBucketName() {
  return (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "").replace(/^gs:\/\//, "");
}

function encodeObjectPath(path: string) {
  return encodeURIComponent(path).replace(/%2F/g, "/");
}

export function resolveStorageAssetUrl(value?: string) {
  const normalized = compactText(value || "");

  if (!normalized) {
    return undefined;
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  const bucket = getStorageBucketName();
  if (!bucket) {
    return undefined;
  }

  if (normalized.startsWith("gs://")) {
    const withoutScheme = normalized.slice(5);
    const firstSlash = withoutScheme.indexOf("/");
    if (firstSlash === -1) {
      return undefined;
    }

    const objectBucket = withoutScheme.slice(0, firstSlash);
    const objectPath = withoutScheme.slice(firstSlash + 1);
    if (!objectPath) {
      return undefined;
    }

    return `https://firebasestorage.googleapis.com/v0/b/${objectBucket}/o/${encodeObjectPath(objectPath)}?alt=media`;
  }

  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeObjectPath(normalized)}?alt=media`;
}
