import fs from 'fs';
import path from 'path';

export interface FirebaseServiceAccountConfig {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
}

/**
 * Retrieves the Firebase Service Account credential.
 * Priority:
 * 1. Environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
 * 2. Local unversioned JSON file specified by FIREBASE_SERVICE_ACCOUNT_PATH or default local file
 */
export function getFirebaseServiceAccount(): FirebaseServiceAccountConfig | null {
  // 1. Check direct environment variables (Preferred for secure production/cloud runtime)
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    return {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
    };
  }

  // 2. Fallback to local gitignored JSON file if present on disk
  const localFilePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.resolve(process.cwd(), 'firebase-service-account.json');
  if (fs.existsSync(localFilePath)) {
    try {
      const fileData = fs.readFileSync(localFilePath, 'utf8');
      return JSON.parse(fileData);
    } catch (err) {
      console.warn('[FirebaseConfig] Failed to parse local service account JSON:', err);
    }
  }

  return null;
}
