import { beforeEach, describe, expect, it, vi } from "vitest";
import { systemConfigurationService } from "../../../src/modules/system-configurations/systemConfiguration.service.js";
import { systemConfigurationRepository } from "../../../src/modules/system-configurations/systemConfiguration.repository.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

vi.mock(
    "../../../src/modules/system-configurations/systemConfiguration.repository.js",
    () => ({
        systemConfigurationRepository: {
            findByConfigKey: vi.fn(),
            list: vi.fn(),
            update: vi.fn(),
        },
    })
);

vi.mock("../../../src/shared/utils/encryption.js", () => ({
    encrypt: vi.fn((value: string) => `enc:${value}`),
    decrypt: vi.fn((value: string) => value.replace(/^enc:/, "")),
}));

describe("systemConfigurationService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("decrypts encrypted configuration", async () => {
        vi.mocked(
            systemConfigurationRepository.findByConfigKey
        ).mockResolvedValue({
            configKey: "secret",
            configValue: "enc:value",
            isEncrypted: true,
        } as any);

        await expect(
            systemConfigurationService.getByConfigKey("secret")
        ).resolves.toMatchObject({
            configValue: "value",
        });
    });

    it("returns plain configuration without decrypting", async () => {
        vi.mocked(
            systemConfigurationRepository.findByConfigKey
        ).mockResolvedValue({
            configKey: "plain",
            configValue: "18:00",
            isEncrypted: false,
        } as any);

        await expect(
            systemConfigurationService.getByConfigKey("plain")
        ).resolves.toMatchObject({
            configValue: "18:00",
        });
    });

    it("throws when configuration does not exist", async () => {
        vi.mocked(
            systemConfigurationRepository.findByConfigKey
        ).mockResolvedValue(null);

        await expect(
            systemConfigurationService.getByConfigKey("missing")
        ).rejects.toBeInstanceOf(AppError);
    });

    it("masks encrypted values when listing", async () => {
        vi.mocked(systemConfigurationRepository.list).mockResolvedValue({
            data: [
                {
                    configKey: "secret",
                    configValue: "enc:value",
                    isEncrypted: true,
                },
                {
                    configKey: "plain",
                    configValue: "18:00",
                    isEncrypted: false,
                },
            ],
            total: 2,
            page: 1,
            limit: 20,
        } as any);

        const result = await systemConfigurationService.list({} as any);

        expect(result.data).toEqual([
            {
                configKey: "secret",
                configValue: "••••••••••",
                isEncrypted: true,
            },
            {
                configKey: "plain",
                configValue: "18:00",
                isEncrypted: false,
            },
        ]);
    });

    it("encrypts values before update", async () => {
        vi.mocked(
            systemConfigurationRepository.findByConfigKey
        ).mockResolvedValue({
            configKey: "secret",
            isEncrypted: true,
        } as any);

        vi.mocked(systemConfigurationRepository.update).mockResolvedValue(
            {} as any
        );

        await systemConfigurationService.update(
            "secret",
            { configValue: "password" },
            1
        );

        expect(
            systemConfigurationRepository.update
        ).toHaveBeenCalledWith(
            "secret",
            expect.objectContaining({
                configValue: "enc:password",
            }),
            1
        );
    });

    it("does not encrypt plain values on update", async () => {
        vi.mocked(
            systemConfigurationRepository.findByConfigKey
        ).mockResolvedValue({
            configKey: "plain",
            isEncrypted: false,
        } as any);

        vi.mocked(systemConfigurationRepository.update).mockResolvedValue(
            {} as any
        );

        await systemConfigurationService.update(
            "plain",
            { configValue: "18:00" },
            1
        );

        expect(
            systemConfigurationRepository.update
        ).toHaveBeenCalledWith(
            "plain",
            expect.objectContaining({
                configValue: "18:00",
            }),
            1
        );
    });

    it("throws when updating missing configuration", async () => {
        vi.mocked(
            systemConfigurationRepository.findByConfigKey
        ).mockResolvedValue(null);

        await expect(
            systemConfigurationService.update(
                "missing",
                { configValue: "x" },
                1
            )
        ).rejects.toBeInstanceOf(AppError);
    });
});