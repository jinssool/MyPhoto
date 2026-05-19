import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const TOKEN_KEY_ENV = "TOKEN_ENCRYPTION_KEY";
const ALGORITHM = "aes-256-gcm";
const IV_BYTE_LENGTH = 12;
const KEY_BYTE_LENGTH = 32;
const TOKEN_FORMAT_VERSION = "v1";

export class TokenEncryptionConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenEncryptionConfigError";
  }
}

function getTokenEncryptionKey() {
  const rawKey = process.env[TOKEN_KEY_ENV];

  if (!rawKey) {
    throw new TokenEncryptionConfigError(`${TOKEN_KEY_ENV} is required for Drive token storage.`);
  }

  const key = Buffer.from(rawKey, "base64");

  if (key.length !== KEY_BYTE_LENGTH) {
    throw new TokenEncryptionConfigError(`${TOKEN_KEY_ENV} must be a 32-byte base64 key.`);
  }

  return key;
}

export function isTokenEncryptionConfigured() {
  try {
    getTokenEncryptionKey();
    return true;
  } catch (error) {
    if (error instanceof TokenEncryptionConfigError) return false;
    throw error;
  }
}

export function assertTokenEncryptionConfigured() {
  getTokenEncryptionKey();
}

export function encryptToken(plainText: string): string {
  const key = getTokenEncryptionKey();
  const iv = randomBytes(IV_BYTE_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    TOKEN_FORMAT_VERSION,
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64")
  ].join(":");
}

export function decryptToken(cipherText: string): string {
  const [version, ivText, authTagText, encryptedText] = cipherText.split(":");

  if (version !== TOKEN_FORMAT_VERSION || !ivText || !authTagText || !encryptedText) {
    throw new Error("Encrypted token has an unsupported format.");
  }

  const key = getTokenEncryptionKey();
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivText, "base64"));
  decipher.setAuthTag(Buffer.from(authTagText, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64")),
    decipher.final()
  ]).toString("utf8");
}
