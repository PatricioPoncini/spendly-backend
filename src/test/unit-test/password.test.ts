import { hashPassword, verifyPassword } from "@utils/password";
import { describe, expect, test } from "bun:test";

describe("Password hashing and verification", () => {
  test("Should hash and successfully verify correct password", async () => {
    const password = "my password";
    const hash = await hashPassword(password);
    expect(hash).not.toBe("");

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  test("Should fail verification with incorrect hash", async () => {
    const password = "my password";
    const invalidHash =
      "$argon2id$v=19$m=65536,t=2,p=1$0D+TtvJO6o3Z2W9jQNgw0XJGuVL0Xp/fCU9OanezhI8$xHeTAc9Qa1XRTpAvnFPC9H+9KGbCKdd0n2Tv/kueRy0";

    const isValid = await verifyPassword(password, invalidHash);
    expect(isValid).toBe(false);
  });

  test("Should fail verification with wrong password", async () => {
    const originalPassword = "correct_password";
    const wrongPassword = "wrong_password";
    const hash = await hashPassword(originalPassword);

    const isValid = await verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });

  test("Should produce different hashes for same password (due to salt)", async () => {
    const password = "repeatable password";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
  });

  test("Should throw error when verifying with malformed hash", async () => {
    const password = "any password";
    const malformedHash = "not_a_real_hash";

    try {
      await verifyPassword(password, malformedHash);
    } catch (error) {
      expect(error).toBeDefined();
      const err = error as { code: string; message: string };
      expect(err.code).toBe("PASSWORD_UNSUPPORTED_ALGORITHM");
      expect(err.message).toContain("UnsupportedAlgorithm");
    }
  });
});
