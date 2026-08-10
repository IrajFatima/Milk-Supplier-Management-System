import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";

import SystemConfigurationForm from "../../../../src/features/systemConfigurations/components/SystemConfigurationForm";

describe("SystemConfigurationForm", () => {
    const systemConfiguration = {
        configKey: "order_cutoff_time",
        configValue: "16:00",
        description: "Time after which new orders cannot be placed.",
        dataType: "TIME",
        isEncrypted: false,
        updatedAt: "2026-08-10T10:00:00Z",
        updatedBy: 1,
        updatedByName: "Admin",
        createdAt: "2026-01-01T10:00:00Z",
        category: "Orders",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the system configuration form", () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={systemConfiguration}
                onSubmit={onSubmit}
            />
        );

        expect(
            container.querySelector(
                'input[name="configKey"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'textarea[name="configValue"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'textarea[name="description"]'
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        ).toBeInTheDocument();
    });

    it("loads existing system configuration data", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        render(
            <SystemConfigurationForm
                systemConfiguration={systemConfiguration}
                onSubmit={onSubmit}
            />
        );

        expect(
            await screen.findByDisplayValue(
                "order_cutoff_time"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue("16:00")
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue(
                "Time after which new orders cannot be placed."
            )
        ).toBeInTheDocument();
    });

    it("disables the config key field", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={systemConfiguration}
                onSubmit={onSubmit}
            />
        );

        const configKeyInput =
            container.querySelector(
                'input[name="configKey"]'
            ) as HTMLInputElement;

        expect(configKeyInput).toBeDisabled();

        expect(configKeyInput).toHaveValue(
            "order_cutoff_time"
        );
    });

    it("shows validation error when config value is empty", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={systemConfiguration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        expect(
            await screen.findByText(
                "Config value is required."
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates NUMBER configuration values", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const configuration = {
            ...systemConfiguration,
            configValue: "100",
            dataType: "NUMBER",
        };

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={configuration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "12.5",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        expect(
            await screen.findByText(
                "Please enter a valid whole number."
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates DECIMAL configuration values", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const configuration = {
            ...systemConfiguration,
            configValue: "12.5",
            dataType: "DECIMAL",
        };

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={configuration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "abc",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        expect(
            await screen.findByText(
                "Please enter a valid decimal number."
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates BOOLEAN configuration values", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const configuration = {
            ...systemConfiguration,
            configValue: "true",
            dataType: "BOOLEAN",
        };

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={configuration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "yes",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        expect(
            await screen.findByText(
                'Value must be either "true" or "false".'
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates DATE configuration values", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const configuration = {
            ...systemConfiguration,
            configValue: "2026-08-10",
            dataType: "DATE",
        };

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={configuration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "10-08-2026",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        expect(
            await screen.findByText(
                "Please enter a valid date (YYYY-MM-DD)."
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates TIME configuration values", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const configuration = {
            ...systemConfiguration,
            configValue: "18:00",
            dataType: "TIME",
        };

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={configuration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "25:00",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        expect(
            await screen.findByText(
                "Please enter a valid time (HH:mm)."
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates EMAIL configuration values", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const configuration = {
            ...systemConfiguration,
            configValue: "admin@example.com",
            dataType: "EMAIL",
        };

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={configuration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "invalid-email",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        expect(
            await screen.findByText(
                "Please enter a valid email address."
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates URL configuration values", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const configuration = {
            ...systemConfiguration,
            configValue: "https://example.com",
            dataType: "URL",
        };

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={configuration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "not-a-url",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        expect(
            await screen.findByText(
                "Please enter a valid URL."
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates JSON configuration values", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const configuration = {
            ...systemConfiguration,
            configValue: '{"enabled":true}',
            dataType: "JSON",
        };

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={configuration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "{invalid json}",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        expect(
            await screen.findByText(
                "Please enter valid JSON."
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("submits valid configuration data", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={systemConfiguration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        const descriptionInput =
            container.querySelector(
                'textarea[name="description"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "18:00",
            },
        });

        fireEvent.change(descriptionInput, {
            target: {
                value: "Updated delivery cutoff time.",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit).toHaveBeenCalledWith({
            configValue: "18:00",
            description: "Updated delivery cutoff time.",
        });
    });

    it("converts an empty description to undefined", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={systemConfiguration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        const descriptionInput =
            container.querySelector(
                'textarea[name="description"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "18:00",
            },
        });

        fireEvent.change(descriptionInput, {
            target: {
                value: "",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit).toHaveBeenCalledWith({
            configValue: "18:00",
            description: undefined,
        });
    });

    it("shows saving state while submission is pending", async () => {
        let resolveSubmit:
            | (() => void)
            | undefined;

        const onSubmit = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveSubmit = resolve;
                })
        );

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={systemConfiguration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "18:00",
            },
        });

        const submitButton =
            screen.getByRole("button", {
                name: "Update Configuration",
            });

        fireEvent.click(submitButton);

        expect(
            await screen.findByRole("button", {
                name: "Saving...",
            })
        ).toBeDisabled();

        expect(onSubmit).toHaveBeenCalledTimes(1);

        resolveSubmit?.();

        await waitFor(() => {
            expect(
                screen.getByRole("button", {
                    name: "Update Configuration",
                })
            ).not.toBeDisabled();
        });
    });

    it("handles submission errors and restores the submit state", async () => {
        const onSubmit = vi
            .fn()
            .mockRejectedValue(
                new Error("Update failed")
            );

        const { container } = render(
            <SystemConfigurationForm
                systemConfiguration={systemConfiguration}
                onSubmit={onSubmit}
            />
        );

        const configValueInput =
            container.querySelector(
                'textarea[name="configValue"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(configValueInput, {
            target: {
                value: "18:00",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Configuration",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(
                screen.getByRole("button", {
                    name: "Update Configuration",
                })
            ).not.toBeDisabled();
        });
    });

});
