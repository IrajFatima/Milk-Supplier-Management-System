import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkDatabaseConnection } from "../../../src/shared/utils/databaseHealth.js";
import { pool } from "../../../src/config/database.js";

vi.mock("../../../src/config/database.js", () => ({ pool: { connect: vi.fn() } }));

describe("databaseHealth", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "log").mockImplementation(() => undefined);
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);
    });

    it("releases a connected client", async () => {
        const client = { release: vi.fn() };
        vi.mocked(pool.connect).mockResolvedValue(client as any);

        await checkDatabaseConnection();

        expect(client.release).toHaveBeenCalled();
    });
});
