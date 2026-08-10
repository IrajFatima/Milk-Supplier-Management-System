import { describe, it, expect } from "vitest";
import { formatDate } from "../../src/utils/FormatDate";

describe("formatDate", () => {
    it("returns '-' for null, undefined, or empty values", () => {
        expect(formatDate(null)).toBe("-");
        expect(formatDate(undefined)).toBe("-");
        expect(formatDate("")).toBe("-");
    });

    it("formats a YYYY-MM-DD string as DD-MM-YYYY", () => {
        expect(formatDate("2024-05-10")).toBe("10-05-2024");
    });

    it("formats a Date object as DD-MM-YYYY", () => {
        const date = new Date(2024, 4, 10);
        expect(formatDate(date)).toBe("10-05-2024");
    });

    it("returns '-' for an invalid date", () => {
        expect(formatDate("not-a-date")).toBe("-");
    });

    it("formats a dateTime including time", () => {
        const date = new Date(2024, 4, 10, 14, 30);
        expect(formatDate(date, "dateTime")).toBe("10-05-2024 02:30 PM");
    });
});
