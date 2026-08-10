import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import "@testing-library/jest-dom/vitest";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./tests/setup.js"],
        include: ["tests/**/*.test.{ts,tsx}"],
        css: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["src/**/*.{ts,tsx}"],
            exclude: [
                "src/main.tsx",
                "src/App.tsx",
                "src/index.css",
                "src/App.css",
                "src/constants/**",
                "src/types/**",
                "src/components/Table.tsx",
                "src/components/Spinner.tsx",
                "src/components/*Badge.tsx",
                "**/*.d.ts",
            ],
        },
    },
});
