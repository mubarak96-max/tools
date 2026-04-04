import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";
import { logServerWarn } from "@/lib/monitoring/logger";

function normalizePrivateKey(value?: string): string | undefined {
  if (!value || value === "your_private_key_here") {
    return undefined;
  }

  return value.replace(/\\n/g, "\n");
}

function hasAdminCredentials() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  return Boolean(
    projectId &&
      clientEmail &&
      clientEmail !== "your_client_email_here" &&
      privateKey,
  );
}

let adminInitTried = false;
let adminDbInstance: Firestore | null = null;
let adminStorageInstance: Storage | null = null;

function initializeFirebaseAdmin() {
  if (adminInitTried) {
    return;
  }

  adminInitTried = true;

  if (!hasAdminCredentials()) {
    logServerWarn("firebase_admin_credentials_missing", {
      message: "Firebase Admin credentials are missing. Server reads will fall back to empty results.",
    });
    return;
  }

  const existingApp = getApps()[0];
  const app =
    existingApp ??
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

  adminDbInstance = getFirestore(app);
  adminStorageInstance = getStorage(app);
}

export function getAdminDb(): Firestore | null {
  initializeFirebaseAdmin();
  return adminDbInstance;
}

export function getAdminStorage(): Storage | null {
  initializeFirebaseAdmin();
  return adminStorageInstance;
}

export function requireAdminDb(): Firestore {
  const db = getAdminDb();

  if (!db) {
    throw new Error("Firebase Admin is not configured.");
  }

  return db;
}

export function isFirebaseAdminReady(): boolean {
  return Boolean(getAdminDb());
}
