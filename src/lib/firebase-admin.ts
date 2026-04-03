import { getAdminDb } from "@/lib/firebase/admin";

export {
  getAdminDb,
  getAdminStorage,
  isFirebaseAdminReady,
  requireAdminDb,
} from "@/lib/firebase/admin";

export const adminDb = getAdminDb();
