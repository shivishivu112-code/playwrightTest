import * as dotenv from 'dotenv';
import path from 'path';

// Load .env once, from the project root.
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Check your .env file.`);
  }
  return value;
}

// Getters so a missing variable only fails the tests that actually need it.
export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://github.com',
  get username() { return required('APP_USERNAME'); },
  get password() { return required('PASSWORD'); },
  get totpSecret() { return required('TOTP_SECRET'); },
};
//This matches the env.ts in the framework files