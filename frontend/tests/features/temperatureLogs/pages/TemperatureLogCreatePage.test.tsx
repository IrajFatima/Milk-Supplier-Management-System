import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    screen,
    waitFor,
} from "@testing-library/react";

import { renderWithProviders } from "../../../helpers/render";

import TemperatureLogCreatePage from "../../../../src/features/temperatureLogs/pages/TemperatureLogCreatePage";

const {
    navigateMock,
    toastMock,
    temperatureLogServiceMock,
    productionServiceMock,
} = vi.hoisted(() => ({
    navigateMock: vi.fn(),

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },

    temperatureLogServiceMock: {
        createTemperatureLog: vi.fn(),
    },

    productionServiceMock: {
        getStorageFacilities: vi.fn(),
    },
}));

vi.mock(
    "react-router-dom",
    async () => {
        const actual =
            await vi.importActual<
                typeof import("react-router-dom")
            >("react-router-dom");

        return {
            ...actual,
            useNavigate: () => navigateMock,
        };
    }
);

vi.mock(
    "../../../../src/services/temperatureLog.service",
    () => ({
        temperatureLogService:
            temperatureLogServiceMock,
    })
);

vi.mock(
    "../../../../src/services/production.service",
    () => ({
        productionService:
            productionServiceMock,
    })
);

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock(
    "../../../../src/features/temperatureLogs/components/TemperatureLogForm",
    () => ({
        default: ({
            facilities,
            onSubmit,
        }: {
            facilities: Array<{
                facilityId: number;
                facilityName: string;
            }>;
            onSubmit: (
                data: unknown
            ) => Promise<void>;
        }) => (
            <div>
                <span>
                    Facilities: {facilities.length}
                </span>

                {facilities.map((facility) => (
                    <span key={facility.facilityId}>
                        {facility.facilityName}
                    </span>
                ))}

                <button
                    type="button"
                    onClick={() =>
                        onSubmit({
                            storageFacilityId: 5,
                            recordingDateTime:
                                "2026-08-10T10:00:00.000Z",
                            temperatureReading: 4.5,
                            remarks:
                                "Normal reading",
                        })
                    }
                >
                    Create Log
                </button>
            </div>
        ),
    })
);

describe("TemperatureLogCreatePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(
            productionServiceMock.getStorageFacilities
        ).mockResolvedValue([
            {
                facilityId: 5,
                facilityName:
                    "Main Cold Storage",
            },
        ] as never);
    });

    it("renders the Add Temperature Log page", async () => {
        renderWithProviders(
            <TemperatureLogCreatePage />
        );

        expect(
            screen.getByRole("heading", {
                name: "Add Temperature Log",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create Log",
            })
        ).toBeInTheDocument();
    });

    it("loads storage facilities and passes them to the form", async () => {
        renderWithProviders(
            <TemperatureLogCreatePage />
        );

        await waitFor(() => {
            expect(
                productionServiceMock
                    .getStorageFacilities
            ).toHaveBeenCalledTimes(1);
        });

        expect(
            await screen.findByText(
                "Main Cold Storage"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText("Facilities: 1")
        ).toBeInTheDocument();
    });

    it("shows an error toast when storage facilities fail to load", async () => {
        productionServiceMock.getStorageFacilities.mockRejectedValue(
            new Error(
                "Failed to load storage facilities"
            )
        );

        renderWithProviders(
            <TemperatureLogCreatePage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("creates a temperature log, shows success toast, and navigates", async () => {
        temperatureLogServiceMock.createTemperatureLog.mockResolvedValue(
            {
                logId: 1,
            }
        );

        renderWithProviders(
            <TemperatureLogCreatePage />
        );

        screen
            .getByRole("button", {
                name: "Create Log",
            })
            .click();

        await waitFor(() => {
            expect(
                temperatureLogServiceMock
                    .createTemperatureLog
            ).toHaveBeenCalledWith({
                storageFacilityId: 5,
                recordingDateTime:
                    "2026-08-10T10:00:00.000Z",
                temperatureReading: 4.5,
                remarks: "Normal reading",
            });
        });

        expect(
            toastMock.success
        ).toHaveBeenCalledWith(
            "Temperature log created."
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/temperature-logs"
        );
    });

    it("does not navigate when temperature log creation fails", async () => {
        temperatureLogServiceMock.createTemperatureLog.mockRejectedValue(
            new Error("Creation failed")
        );

        renderWithProviders(
            <TemperatureLogCreatePage />
        );

        screen
            .getByRole("button", {
                name: "Create Log",
            })
            .click();

        await waitFor(() => {
            expect(
                temperatureLogServiceMock
                    .createTemperatureLog
            ).toHaveBeenCalledWith({
                storageFacilityId: 5,
                recordingDateTime:
                    "2026-08-10T10:00:00.000Z",
                temperatureReading: 4.5,
                remarks: "Normal reading",
            });
        });

        expect(
            navigateMock
        ).not.toHaveBeenCalled();

        expect(
            toastMock.success
        ).not.toHaveBeenCalled();
    });
});