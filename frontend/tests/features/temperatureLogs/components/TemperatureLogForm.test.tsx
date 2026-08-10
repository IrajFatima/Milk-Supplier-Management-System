import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from "vitest";

import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";

import TemperatureLogForm from "../../../../src/features/temperatureLogs/components/TemperatureLogForm";

vi.mock("react-toastify", () => ({
    toast: {
        error: vi.fn(),
    },
}));

describe("TemperatureLogForm", () => {
    const facilities = [
        {
            facilityId: 1,
            facilityName: "Main Cold Storage",
        },
        {
            facilityId: 2,
            facilityName: "Secondary Cold Storage",
        },
    ] as never;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the temperature log form", () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        expect(
            container.querySelector(
                'select[name="storageFacilityId"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'input[name="recordingDateTime"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'input[name="temperatureReading"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'textarea[name="remarks"]'
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create Log",
            })
        ).toBeInTheDocument();
    });

    it("renders all storage facility options", () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        render(
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        expect(
            screen.getByRole("option", {
                name: "Select Facility",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "Main Cold Storage",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "Secondary Cold Storage",
            })
        ).toBeInTheDocument();
    });

    it("sets the recording date and time field to the current datetime", async () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const recordingDateTimeInput =
            container.querySelector(
                'input[name="recordingDateTime"]'
            ) as HTMLInputElement;

        await waitFor(() => {
            expect(
                recordingDateTimeInput.value
            ).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
            );
        });
    });

    it("shows validation errors for required fields", async () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const recordingDateTimeInput =
            container.querySelector(
                'input[name="recordingDateTime"]'
            ) as HTMLInputElement;

        fireEvent.change(
            recordingDateTimeInput,
            {
                target: {
                    value: "",
                },
            }
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Log",
            })
        );

        expect(
            await screen.findByText(
                "Storage facility is required"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Recording date/time is required"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Temperature is required"
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows an error when temperature is below 2°C", async () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const facilitySelect =
            container.querySelector(
                'select[name="storageFacilityId"]'
            ) as HTMLSelectElement;

        const temperatureInput =
            container.querySelector(
                'input[name="temperatureReading"]'
            ) as HTMLInputElement;

        fireEvent.change(facilitySelect, {
            target: {
                value: "1",
            },
        });

        fireEvent.change(temperatureInput, {
            target: {
                value: "1.9",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Log",
            })
        );

        expect(
            await screen.findByText(
                "Temperature must be >= 2°C"
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows an error when temperature is above 6°C", async () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const facilitySelect =
            container.querySelector(
                'select[name="storageFacilityId"]'
            ) as HTMLSelectElement;

        const temperatureInput =
            container.querySelector(
                'input[name="temperatureReading"]'
            ) as HTMLInputElement;

        fireEvent.change(facilitySelect, {
            target: {
                value: "1",
            },
        });

        fireEvent.change(temperatureInput, {
            target: {
                value: "6.1",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Log",
            })
        );

        expect(
            await screen.findByText(
                "Temperature must be <= 6°C"
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("submits a valid temperature log", async () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const facilitySelect =
            container.querySelector(
                'select[name="storageFacilityId"]'
            ) as HTMLSelectElement;

        const recordingDateTimeInput =
            container.querySelector(
                'input[name="recordingDateTime"]'
            ) as HTMLInputElement;

        const temperatureInput =
            container.querySelector(
                'input[name="temperatureReading"]'
            ) as HTMLInputElement;

        const remarksInput =
            container.querySelector(
                'textarea[name="remarks"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(facilitySelect, {
            target: {
                value: "2",
            },
        });

        fireEvent.change(
            recordingDateTimeInput,
            {
                target: {
                    value: "2026-08-10T14:30",
                },
            }
        );

        fireEvent.change(temperatureInput, {
            target: {
                value: "4.5",
            },
        });

        fireEvent.change(remarksInput, {
            target: {
                value: "  Temperature stable.  ",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Log",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(
                1
            );
        });

        expect(onSubmit).toHaveBeenCalledWith({
            storageFacilityId: 2,
            recordingDateTime:
                new Date(
                    "2026-08-10T14:30"
                ).toISOString(),
            temperatureReading: 4.5,
            remarks:
                "Temperature stable.",
        });
    });

    it("converts an empty remarks field to undefined", async () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const facilitySelect =
            container.querySelector(
                'select[name="storageFacilityId"]'
            ) as HTMLSelectElement;

        const recordingDateTimeInput =
            container.querySelector(
                'input[name="recordingDateTime"]'
            ) as HTMLInputElement;

        const temperatureInput =
            container.querySelector(
                'input[name="temperatureReading"]'
            ) as HTMLInputElement;

        const remarksInput =
            container.querySelector(
                'textarea[name="remarks"]'
            ) as HTMLTextAreaElement;

        fireEvent.change(facilitySelect, {
            target: {
                value: "1",
            },
        });

        fireEvent.change(
            recordingDateTimeInput,
            {
                target: {
                    value: "2026-08-10T14:30",
                },
            }
        );

        fireEvent.change(temperatureInput, {
            target: {
                value: "4",
            },
        });

        fireEvent.change(remarksInput, {
            target: {
                value: "   ",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Log",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(
                1
            );
        });

        expect(onSubmit).toHaveBeenCalledWith({
            storageFacilityId: 1,
            recordingDateTime:
                new Date(
                    "2026-08-10T14:30"
                ).toISOString(),
            temperatureReading: 4,
            remarks: undefined,
        });
    });

    it("allows the minimum and maximum temperature values", async () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const facilitySelect =
            container.querySelector(
                'select[name="storageFacilityId"]'
            ) as HTMLSelectElement;

        const recordingDateTimeInput =
            container.querySelector(
                'input[name="recordingDateTime"]'
            ) as HTMLInputElement;

        const temperatureInput =
            container.querySelector(
                'input[name="temperatureReading"]'
            ) as HTMLInputElement;

        fireEvent.change(facilitySelect, {
            target: {
                value: "1",
            },
        });

        fireEvent.change(
            recordingDateTimeInput,
            {
                target: {
                    value: "2026-08-10T14:30",
                },
            }
        );

        fireEvent.change(temperatureInput, {
            target: {
                value: "2",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Log",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(
                1
            );
        });

        onSubmit.mockClear();

        fireEvent.change(temperatureInput, {
            target: {
                value: "6",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Log",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(
                1
            );
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
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const facilitySelect =
            container.querySelector(
                'select[name="storageFacilityId"]'
            ) as HTMLSelectElement;

        const recordingDateTimeInput =
            container.querySelector(
                'input[name="recordingDateTime"]'
            ) as HTMLInputElement;

        const temperatureInput =
            container.querySelector(
                'input[name="temperatureReading"]'
            ) as HTMLInputElement;

        fireEvent.change(facilitySelect, {
            target: {
                value: "1",
            },
        });

        fireEvent.change(
            recordingDateTimeInput,
            {
                target: {
                    value: "2026-08-10T14:30",
                },
            }
        );

        fireEvent.change(temperatureInput, {
            target: {
                value: "4",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Log",
            })
        );

        const submitButton =
            await screen.findByRole("button", {
                name: /Saving/,
            });

        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent(
            "Saving..."
        );

        expect(onSubmit).toHaveBeenCalledTimes(1);

        resolveSubmit?.();

        await waitFor(() => {
            const button =
                screen.getByRole("button", {
                    name: "Create Log",
                });

            expect(button).not.toBeDisabled();
        });
    });

    it("shows an error toast when submission fails", async () => {
        const { toast } = await import(
            "react-toastify"
        );

        const onSubmit = vi
            .fn()
            .mockRejectedValue(
                new Error("Save failed")
            );

        const { container } = render(
            <TemperatureLogForm
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const facilitySelect =
            container.querySelector(
                'select[name="storageFacilityId"]'
            ) as HTMLSelectElement;

        const recordingDateTimeInput =
            container.querySelector(
                'input[name="recordingDateTime"]'
            ) as HTMLInputElement;

        const temperatureInput =
            container.querySelector(
                'input[name="temperatureReading"]'
            ) as HTMLInputElement;

        fireEvent.change(facilitySelect, {
            target: {
                value: "1",
            },
        });

        fireEvent.change(
            recordingDateTimeInput,
            {
                target: {
                    value: "2026-08-10T14:30",
                },
            }
        );

        fireEvent.change(temperatureInput, {
            target: {
                value: "4",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Log",
            })
        );

        await waitFor(() => {
            expect(
                toast.error
            ).toHaveBeenCalledWith(
                expect.any(String)
            );
        });
    });
});