import * as admin from 'firebase-admin';

// Initialize Firebase Admin recursively
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    
    if (privateKey && privateKey !== 'your_private_key_here' && clientEmail && clientEmail !== 'your_client_email_here') {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn("⚠️ Firebase Admin credentials missing. Database queries will return empty defaults.");
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

// Export adminDb, or a dummy proxy to prevent crash on read if not initialized
export const adminDb = admin.apps.length 
  ? admin.firestore() 
  : null as unknown as admin.firestore.Firestore;
