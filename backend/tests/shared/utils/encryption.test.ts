import { describe, expect, it } from "vitest";
import { decrypt, encrypt } from "../../../src/shared/utils/encryption.js";

describe("encryption utils", () => {
    it("round trips text", () => {
        const value = encrypt("hello");

        expect(decrypt(value)).toBe("hello");
    });
});
