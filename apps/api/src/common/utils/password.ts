import argon2 from "argon2";

/**
 * argon2id is the current OWASP-recommended default for password hashing —
 * memory-hard and resistant to GPU/ASIC cracking, and it self-encodes
 * its parameters into the hash so they can change over time without
 * breaking verification of older hashes.
 */
export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}
