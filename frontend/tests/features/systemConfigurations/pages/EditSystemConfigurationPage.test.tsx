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

import EditSystemConfigurationPage from "../../../../src/features/systemConfigurations/pages/EditSystemConfigurationPage";

import { systemConfigurationService } from "../../../../src/services/systemConfiguration.service";

const {
    navigateMock,
    toastMock,
    systemConfigurationServiceMock,
} = vi.hoisted(() => ({
    navigateMock: vi.fn(),

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },

    systemConfigurationServiceMock: {
        getSystemConfiguration: vi.fn(),
        updateSystemConfiguration: vi.fn(),
    },

}));

vi.mock("react-router-dom", async () => {
    const actual =
        await vi.importActual<
            typeof import("react-router-dom")
        >("react-router-dom");

    return {
        ...actual,
        useNavigate: () => navigateMock,
        useParams: () => ({
            configKey:
                "delivery%2Fcutoff%20time",
        }),
    };

});

vi.mock(
    "../../../../src/services/systemConfiguration.service",
    () => ({
        systemConfigurationService:
            systemConfigurationServiceMock,
    })
);

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock(
    "../../../../src/components/Spinner",
    () => ({
        default: () => (<div role="status">
            Loading... </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/systemConfigurations/components/SystemConfigurationForm",
    () => ({
        default: ({
            systemConfiguration,
            onSubmit,
        }: {
            systemConfiguration: {
                configKey: string;
                configValue: string;
            };
            onSubmit: (
                data: unknown
            ) => Promise<void>;
        }) => (<div> <span>
            {systemConfiguration.configKey} </span>

            ```
            <span>
                {systemConfiguration.configValue}
            </span>

            <button
                type="button"
                onClick={() => {
                    void onSubmit({
                        configValue: "20:00",
                        description: "Updated cutoff time.",
                    }).catch(() => { });
                }}
            >
                Update Configuration
            </button>
        </div>
        ),
    })

);

describe("EditSystemConfigurationPage", () => {
    const systemConfiguration = {
        configKey: "delivery/cutoff time",
        configValue: "18:00",
        description:
            "Current delivery cutoff time.",
        dataType: "TIME",
        isEncrypted: false,
        updatedAt: "2026-08-10T10:00:00Z",
        updatedBy: 1,
        updatedByName: "Admin",
        createdAt: "2026-01-01T10:00:00Z",
        category: "Delivery",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading state while configuration is being loaded", () => {
        vi.mocked(
            systemConfigurationService.getSystemConfiguration
        ).mockReturnValue(
            new Promise(() => { })
        );

        renderWithProviders(
            <EditSystemConfigurationPage />
        );

        expect(
            screen.getByRole("status")
        ).toBeInTheDocument();
    });

    it("loads the configuration using the decoded config key", async () => {
        vi.mocked(
            systemConfigurationService.getSystemConfiguration
        ).mockResolvedValue(
            systemConfiguration as never
        );

        renderWithProviders(
            <EditSystemConfigurationPage />
        );

        await waitFor(() => {
            expect(
                systemConfigurationService.getSystemConfiguration
            ).toHaveBeenCalledWith(
                "delivery/cutoff time"
            );
        });
    });

    it("renders the configuration after loading", async () => {
        vi.mocked(
            systemConfigurationService.getSystemConfiguration
        ).mockResolvedValue(
            systemConfiguration as never
        );

        renderWithProviders(
            <EditSystemConfigurationPage />
        );

        expect(
            await screen.findByRole("heading", {
                name: "Edit System Configuration",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "delivery/cutoff time"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText("18:00")
        ).toBeInTheDocument();
    });

    it("shows configuration not found when the configuration does not exist", async () => {
        vi.mocked(
            systemConfigurationService.getSystemConfiguration
        ).mockResolvedValue(
            null as never
        );

        renderWithProviders(
            <EditSystemConfigurationPage />
        );

        expect(
            await screen.findByText(
                "System configuration not found."
            )
        ).toBeInTheDocument();
    });

    it("shows an error toast when loading fails", async () => {
        vi.mocked(
            systemConfigurationService.getSystemConfiguration
        ).mockRejectedValue(
            new Error("Load failed")
        );

        renderWithProviders(
            <EditSystemConfigurationPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });

        expect(
            screen.getByText(
                "System configuration not found."
            )
        ).toBeInTheDocument();
    });

    it("updates the configuration, shows success toast, and navigates", async () => {
        vi.mocked(
            systemConfigurationService.getSystemConfiguration
        ).mockResolvedValue(
            systemConfiguration as never
        );

        vi.mocked(
            systemConfigurationService.updateSystemConfiguration
        ).mockResolvedValue(
            systemConfiguration as never
        );

        renderWithProviders(
            <EditSystemConfigurationPage />
        );

        await screen.findByRole("heading", {
            name: "Edit System Configuration",
        });

        screen
            .getByRole("button", {
                name: "Update Configuration",
            })
            .click();

        await waitFor(() => {
            expect(
                systemConfigurationService
                    .updateSystemConfiguration
            ).toHaveBeenCalledWith(
                "delivery/cutoff time",
                {
                    configValue: "20:00",
                    description:
                        "Updated cutoff time.",
                }
            );
        });

    });

    it("shows an error toast when updating the configuration fails", async () => {
        vi.mocked(
            systemConfigurationService.getSystemConfiguration
        ).mockResolvedValue(
            systemConfiguration as never
        );

        vi.mocked(
            systemConfigurationService.updateSystemConfiguration
        ).mockRejectedValue(
            new Error("Update failed")
        );

        renderWithProviders(
            <EditSystemConfigurationPage />
        );

        await screen.findByRole("heading", {
            name: "Edit System Configuration",
        });

        screen
            .getByRole("button", {
                name: "Update Configuration",
            })
            .click();

        await waitFor(() => {
            expect(
                systemConfigurationService
                    .updateSystemConfiguration
            ).toHaveBeenCalledWith(
                "delivery/cutoff time",
                {
                    configValue: "20:00",
                    description:
                        "Updated cutoff time.",
                }
            );
        });

        expect(
            toastMock.error
        ).toHaveBeenCalled();
    });

    it("does not load a configuration when config key is missing", async () => {
        const actual =
            await vi.importActual<
                typeof import("react-router-dom")
            >("react-router-dom");

        vi.doMock("react-router-dom", () => ({
            ...actual,
            useNavigate: () => navigateMock,
            useParams: () => ({}),
        }));

        expect(
            systemConfigurationService
                .getSystemConfiguration
        ).not.toHaveBeenCalled();
    });

});
