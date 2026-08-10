import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import useDebounce from "../../src/hooks/useDebounce";

describe("useDebounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns the initial value immediately", () => {
        const { result } = renderHook(() => useDebounce("hello", 400));
        expect(result.current).toBe("hello");
    });

    it("updates the debounced value after the delay", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 400),
            { initialProps: { value: "a" } }
        );

        rerender({ value: "b" });
        expect(result.current).toBe("a");

        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(result.current).toBe("b");
    });

    it("resets the timer when the value changes repeatedly", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 400),
            { initialProps: { value: "a" } }
        );

        rerender({ value: "b" });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(result.current).toBe("a");

        rerender({ value: "c" });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(result.current).toBe("a");

        act(() => {
            vi.advanceTimersByTime(400);
        });
        expect(result.current).toBe("c");
    });
});
