import { vi } from "vitest";

export const createMockResponse = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

export const createMockNext = () => vi.fn();
