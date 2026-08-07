import { describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";
import { hashPassword, comparePassword } from "../../../src/shared/utils/password.js";

vi.mock("bcrypt", () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn(),
    },
}));

describe("password utils", () => {
    it("hashes passwords", async () => {
        vi.mocked(bcrypt.hash).mockResolvedValue("hashed" as never);

        await expect(hashPassword("secret")).resolves.toBe("hashed");
    });

    it("compares passwords", async () => {
        vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

        await expect(comparePassword("secret", "hashed")).resolves.toBe(true);
    });
});
