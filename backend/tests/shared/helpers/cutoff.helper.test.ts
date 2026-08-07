import { describe, expect, it } from "vitest";
import { validateDeliveryDate, validateOrderCutoffTime } from "../../../src/modules/orders/helpers/cutoff.helper.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

describe("cutoff helper", () => {
    it("rejects missing cutoff time", () => {
        expect(() => validateOrderCutoffTime("")).toThrow(AppError);
    });

    it("rejects past delivery dates", () => {
        expect(() => validateDeliveryDate("2000-01-01", null)).toThrow(AppError);
    });
});
