import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";

import { renderWithProviders } from "../../../helpers/render";

import TemperatureLogsListPage from "../../../../src/features/temperatureLogs/pages/TemperatureLogsListPage";

import { temperatureLogService } from "../../../../src/services/temperatureLog.service";
import { productionService } from "../../../../src/services/production.service";

import type {
    TemperatureLogFilters,
    TemperatureLog,
} from "../../../../src/types/temperature.types";

import type { StorageFacility } from "../../../../src/types/production.types";

const {
    navigateMock,
    authMock,
    toastMock,
    temperatureLogServiceMock,
    productionServiceMock,
} = vi.hoisted(() => ({
    navigateMock: vi.fn(),

    authMock: {
        user: {
            userId: 1,
            username: "owner",
            email: "owner@msms.com",
            role: "Owner",
            employeeId: 1,
            accountStatus: "Active",
            lastLogin: null,
        },
        token: "token",
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
    },

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },

    temperatureLogServiceMock: {
        getTemperatureLogs: vi.fn(),
    },

    productionServiceMock: {
        getStorageFacilities: vi.fn(),
    },
}));

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

vi.mock("../../../../src/hooks/useAuth", () => ({
    useAuth: () => authMock,
}));

vi.mock("../../../../src/hooks/useDebounce", () => ({
    default: (value: string) => value,
}));

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock("react-router-dom", async () => {
    const actual =
        await vi.importActual<
            typeof import("react-router-dom")
        >("react-router-dom");

    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

vi.mock(
    "../../../../src/components/Pagination",
    () => ({
        default: ({
            currentPage,
            totalPages,
            onPageChange,
        }: {
            currentPage: number;
            totalPages: number;
            onPageChange: (page: number) => void;
        }) => (
            <div>
                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    type="button"
                    onClick={() => onPageChange(2)}
                >
                    Next Page
                </button>
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/temperatureLogs/components/TemperatureLogsSearchBar",
    () => ({
        default: ({
            value,
            onChange,
        }: {
            value: string;
            onChange: (value: string) => void;
        }) => (
            <input
                aria-label="Temperature Log Search"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            />
        ),
    })
);

vi.mock(
    "../../../../src/features/temperatureLogs/components/TemperatureLogFilters",
    () => ({
        default: ({
            filters,
            facilities,
            onChange,
        }: {
            filters: TemperatureLogFilters;
            facilities: StorageFacility[];
            onChange: (
                filters: TemperatureLogFilters
            ) => void;
        }) => (
            <div>
                <span>
                    Current Page: {filters.page}
                </span>

                <span>
                    Facilities: {facilities.length}
                </span>

                <button
                    type="button"
                    onClick={() =>
                        onChange({
                            page: 1,
                            limit: 10,
                            storageFacilityId: 5,
                        })
                    }
                >
                    Apply Facility Filter
                </button>
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/temperatureLogs/components/TemperatureLogsTable",
    () => ({
        default: ({
            logs,
            loading,
            onView,
        }: {
            logs: TemperatureLog[];
            loading: boolean;
            onView: (id: number) => void;
        }) => (
            <div>
                {loading && (
                    <span>
                        Loading temperature logs...
                    </span>
                )}

                {!loading &&
                    logs.map((log) => (
                        <div key={log.logId}>
                            <span>
                                {log.facilityName}
                            </span>

                            <span>
                                {log.temperatureReading}°C
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    onView(log.logId)
                                }
                            >
                                View Log
                            </button>
                        </div>
                    ))}
            </div>
        ),
    })
);

describe("TemperatureLogsListPage", () => {
    const facility: StorageFacility = {
        facilityId: 5,
        facilityName: "Main Cold Storage",
    } as StorageFacility;

    const temperatureLog: TemperatureLog = {
        logId: 1,
        storageFacilityId: 5,
        temperatureReading: 4.2,
        recordingDateTime:
            "2026-08-10T10:30:00.000Z",
        recordingType: "Manual",
        alertTriggered: false,
        facilityName: "Main Cold Storage",
        operatorName: "John Doe",
        operator: 1,
        remarks: "Normal temperature.",
    };

    beforeEach(() => {
        vi.clearAllMocks();

        temperatureLogServiceMock.getTemperatureLogs.mockResolvedValue(
            {
                data: [temperatureLog],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            }
        );

        productionServiceMock.getStorageFacilities.mockResolvedValue(
            [facility]
        );
    });

    it("renders the temperature logs page", async () => {
        renderWithProviders(
            <TemperatureLogsListPage />
        );

        expect(
            screen.getByRole("heading", {
                name: "Temperature Logs",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Add Log",
            })
        ).toBeInTheDocument();

        expect(
            await screen.findByText(
                "Main Cold Storage"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText("4.2°C")
        ).toBeInTheDocument();
    });

    it("loads temperature logs with default filters", async () => {
        renderWithProviders(
            <TemperatureLogsListPage />
        );

        await waitFor(() => {
            expect(
                temperatureLogService.getTemperatureLogs
            ).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                search: undefined,
            });
        });
    });

    it("loads storage facilities", async () => {
        renderWithProviders(
            <TemperatureLogsListPage />
        );

        await waitFor(() => {
            expect(
                productionService.getStorageFacilities
            ).toHaveBeenCalledTimes(1);
        });

        expect(
            await screen.findByText("Facilities: 1")
        ).toBeInTheDocument();
    });

    it("shows an error toast when loading temperature logs fails", async () => {
        temperatureLogServiceMock.getTemperatureLogs.mockRejectedValue(
            new Error("Failed to load temperature logs")
        );

        renderWithProviders(
            <TemperatureLogsListPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("shows an error toast when loading facilities fails", async () => {
        productionServiceMock.getStorageFacilities.mockRejectedValue(
            new Error("Failed to load facilities")
        );

        renderWithProviders(
            <TemperatureLogsListPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("allows owner to create a temperature log", async () => {
        renderWithProviders(
            <TemperatureLogsListPage />
        );

        expect(
            await screen.findByRole("button", {
                name: "Add Log",
            })
        ).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Add Log",
            })
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/temperature-logs/create"
        );
    });

    it("does not show Add Log for users without create permission", async () => {
        authMock.user.role = "Delivery Staff";

        renderWithProviders(
            <TemperatureLogsListPage />
        );

        await screen.findByText("Main Cold Storage");

        expect(
            screen.queryByRole("button", {
                name: "Add Log",
            })
        ).not.toBeInTheDocument();
    });

    it("allows a farm worker to create a temperature log", async () => {
        authMock.user.role = "Farm Worker";

        renderWithProviders(
            <TemperatureLogsListPage />
        );

        expect(
            await screen.findByRole("button", {
                name: "Add Log",
            })
        ).toBeInTheDocument();
    });

    it("navigates to the temperature log details page", async () => {
        renderWithProviders(
            <TemperatureLogsListPage />
        );

        await screen.findByText(
            "Main Cold Storage"
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "View Log",
            })
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/temperature-logs/1"
        );
    });

    it("updates the page when pagination changes", async () => {
        temperatureLogServiceMock.getTemperatureLogs
            .mockResolvedValueOnce({
                data: [temperatureLog],
                total: 20,
                page: 1,
                limit: 10,
                totalPages: 2,
            })
            .mockResolvedValueOnce({
                data: [temperatureLog],
                total: 20,
                page: 2,
                limit: 10,
                totalPages: 2,
            });

        renderWithProviders(
            <TemperatureLogsListPage />
        );

        await screen.findByText(
            "Main Cold Storage"
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Next Page",
            })
        );

        await waitFor(() => {
            expect(
                temperatureLogService.getTemperatureLogs
            ).toHaveBeenLastCalledWith({
                page: 2,
                limit: 10,
                search: undefined,
            });
        });
    });

    it("updates filters when a filter is changed", async () => {
        temperatureLogServiceMock.getTemperatureLogs
            .mockResolvedValueOnce({
                data: [temperatureLog],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            })
            .mockResolvedValueOnce({
                data: [temperatureLog],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            });

        renderWithProviders(
            <TemperatureLogsListPage />
        );

        await screen.findByText(
            "Main Cold Storage"
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Apply Facility Filter",
            })
        );

        await waitFor(() => {
            expect(
                temperatureLogService.getTemperatureLogs
            ).toHaveBeenLastCalledWith({
                page: 1,
                limit: 10,
                storageFacilityId: 5,
                search: undefined,
            });
        });
    });

    it("resets the page to 1 when searching", async () => {
        renderWithProviders(
            <TemperatureLogsListPage />
        );

        await screen.findByText(
            "Main Cold Storage"
        );

        const searchInput =
            screen.getByRole("textbox", {
                name: "Temperature Log Search",
            });

        fireEvent.change(searchInput, {
            target: {
                value: "cold",
            },
        });

        await waitFor(() => {
            expect(
                temperatureLogService.getTemperatureLogs
            ).toHaveBeenLastCalledWith({
                page: 1,
                limit: 10,
                search: "cold",
            });
        });
    });
});