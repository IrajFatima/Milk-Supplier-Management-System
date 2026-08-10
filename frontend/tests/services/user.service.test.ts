import { describe, it, expect, vi, beforeEach } from "vitest";
import { userService } from "../../src/services/user.service";

const apiMock = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
}));

vi.mock("../../src/services/api", () => ({
    default: apiMock,
}));

describe("userService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("gets paginated users with filters", async () => {
        const paginated = {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
        };
        apiMock.get.mockResolvedValue({ data: { data: paginated } });

        const result = await userService.getUsers({ page: 1, limit: 10 });
        expect(apiMock.get).toHaveBeenCalledWith("/users", {
            params: { page: 1, limit: 10 },
        });
        expect(result).toEqual(paginated);
    });

    it("gets a user by id", async () => {
        const user = { userId: 2, username: "jane" };
        apiMock.get.mockResolvedValue({ data: { data: { user } } });

        const result = await userService.getUser(2);
        expect(apiMock.get).toHaveBeenCalledWith("/users/2");
        expect(result).toEqual(user);
    });

    it("creates a user", async () => {
        const payload = { username: "jane", email: "jane@msms.com" };
        apiMock.post.mockResolvedValue({ data: { data: { userId: 2 } } });

        const result = await userService.createUser(payload as never);
        expect(apiMock.post).toHaveBeenCalledWith("/users", payload);
        expect(result).toEqual({ userId: 2 });
    });

    it("updates a user", async () => {
        apiMock.put.mockResolvedValue({ data: { data: { userId: 2 } } });

        const result = await userService.updateUser(2, { fullName: "Jane" });
        expect(apiMock.put).toHaveBeenCalledWith("/users/2", {
            fullName: "Jane",
        });
        expect(result).toEqual({ userId: 2 });
    });

    it("reactivates a user", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });
        await userService.reactivateUser(2);
        expect(apiMock.patch).toHaveBeenCalledWith("/users/2/activate");
    });

    it("deactivates a user", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });
        await userService.deactivateUser(2);
        expect(apiMock.patch).toHaveBeenCalledWith("/users/2/deactivate");
    });

    it("gets roles", async () => {
        const roles = [{ roleId: 1, roleName: "Owner" }];
        apiMock.get.mockResolvedValue({ data: { data: { roles } } });

        const result = await userService.getRoles();
        expect(apiMock.get).toHaveBeenCalledWith("/users/roles");
        expect(result).toEqual(roles);
    });
});
