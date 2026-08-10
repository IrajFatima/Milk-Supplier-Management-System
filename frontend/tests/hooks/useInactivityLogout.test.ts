import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useInactivityLogout } from "../../src/hooks/useInactivityLogout";

const INACTIVITY_TIMEOUT = 7 * 24 * 60 * 60 * 1000;

describe("useInactivityLogout", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("calls onLogout after the inactivity period when authenticated", () => {
        const onLogout = vi.fn();
        renderHook(() => useInactivityLogout(true, onLogout));

        act(() => {
            vi.advanceTimersByTime(INACTIVITY_TIMEOUT);
        });

        expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it("does not call onLogout when not authenticated", () => {
        const onLogout = vi.fn();
        renderHook(() => useInactivityLogout(false, onLogout));

        act(() => {
            vi.advanceTimersByTime(INACTIVITY_TIMEOUT * 2);
        });

        expect(onLogout).not.toHaveBeenCalled();
    });

    it("resets the timer when a tracked event fires", () => {
        const onLogout = vi.fn();
        renderHook(() => useInactivityLogout(true, onLogout));

        act(() => {
            vi.advanceTimersByTime(INACTIVITY_TIMEOUT - 1000);
        });

        act(() => {
            window.dispatchEvent(new Event("mousemove"));
        });

        act(() => {
            vi.advanceTimersByTime(INACTIVITY_TIMEOUT - 1000);
        });

        expect(onLogout).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(onLogout).toHaveBeenCalledTimes(1);
    });
});
