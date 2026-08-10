import "@testing-library/jest-dom/vitest";

// jsdom does not implement matchMedia.
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    }),
});

// jsdom does not implement scrollTo or ResizeObserver.
window.scrollTo = () => { };

class ResizeObserverMock {
    observe() { }
    unobserve() { }
    disconnect() { }
}
window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

