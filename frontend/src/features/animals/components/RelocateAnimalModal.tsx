import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import Modal from "../../../components/Modal";
import { animalService } from "../../../services/animal.service";
import type { ShedDropdown } from "../../../types/animal.types";
import Dropdown from "../../../components/Dropdown";

interface RelocateAnimalModalProps {
    isOpen: boolean;
    animalId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RelocateAnimalModal({
    isOpen,
    animalId,
    onClose,
    onSuccess,
}: RelocateAnimalModalProps) {
    const [sheds, setSheds] = useState<ShedDropdown[]>([]);
    const [shedId, setShedId] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        async function loadSheds() {
            try {
                setLoading(true);

                const response = await animalService.getSheds();
                setSheds(response);
            } catch (error: unknown) {
                toast.error(getApiErrorMessage(error, "Failed to load sheds."));
            } finally {
                setLoading(false);
                setShedId("");
            }
        }

        loadSheds();
    }, [isOpen]);

    async function handleSubmit() {
        if (!animalId || shedId === "") {
            toast.error("Please select a shed.");
            return;
        }

        try {
            setSaving(true);

            await animalService.relocateAnimal(animalId, {
                shedId,
            });

            toast.success("Animal relocated successfully.");

            onSuccess();
            onClose();
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Failed to relocate animal."));
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Relocate Animal"
            onClose={onClose}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-[var(--color-border)] px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={handleSubmit}
                        className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-white disabled:opacity-50"
                    >
                        {saving ? "Relocating..." : "Relocate"}
                    </button>
                </>
            }
        >
            {loading ? (
                <p className="text-[var(--color-text-secondary)]">Loading sheds...</p>
            ) : (
                <Dropdown
                    label="Shed"
                    required
                    value={shedId}
                    onChange={(e) =>
                        setShedId(
                            e.target.value === "" ? "" : Number(e.target.value)
                        )
                    }
                >
                    <option value="">Select Shed</option>

                    {sheds.map((shed) => (
                        <option
                            key={shed.shedId}
                            value={shed.shedId}
                        >
                            {shed.shedName} ({shed.availableCapacity} available)
                        </option>
                    ))}
                </Dropdown>
            )}
        </Modal>
    );
}
