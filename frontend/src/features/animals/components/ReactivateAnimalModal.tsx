import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../../components/Modal";
import Dropdown from "../../../components/Dropdown";

import { animalService } from "../../../services/animal.service";

import type { ShedDropdown } from "../../../types/animal.types";

import { ANIMAL_STATUS, type AnimalStatus } from "../../../constants/animalStatus";

interface ReactivateAnimalModalProps {
    isOpen: boolean;
    animalId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReactivateAnimalModal({
    isOpen,
    animalId,
    onClose,
    onSuccess,
}: ReactivateAnimalModalProps) {
    const [sheds, setSheds] = useState<ShedDropdown[]>([]);
    const [shedId, setShedId] = useState<number | "">("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        async function loadSheds() {
            try {
                setLoading(true);

                const response = await animalService.getSheds();

                setSheds(response);
                setShedId("");
                setStatus("");
            } catch {
                toast.error("Failed to load sheds.");
            } finally {
                setLoading(false);
            }
        }

        loadSheds();
    }, [isOpen]);

    async function handleSubmit() {
        if (!animalId) return;

        if (!status) {
            toast.error("Please select a status.");
            return;
        }

        if (shedId === "") {
            toast.error("Please select a shed.");
            return;
        }

        try {
            setSaving(true);

            await animalService.reactivateAnimal(animalId, {
                operationalStatus: status as AnimalStatus,
                shedId,
            });

            toast.success("Animal reactivated successfully.");

            onSuccess();
            onClose();
        } catch {
            toast.error("Failed to reactivate animal.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Reactivate Animal"
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
                        onClick={handleSubmit}
                        disabled={saving}
                        className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-white disabled:opacity-50"
                    >
                        {saving ? "Reactivating..." : "Reactivate"}
                    </button>
                </>
            }
        >
            {loading ? (
                <p className="text-[var(--color-text-secondary)]">
                    Loading sheds...
                </p>
            ) : (
                <div className="space-y-4">
                    <Dropdown
                        label="Status"
                        required
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value={ANIMAL_STATUS.CALF}>{ANIMAL_STATUS.CALF}</option>
                        <option value={ANIMAL_STATUS.HEIFER}>{ANIMAL_STATUS.HEIFER}</option>
                        <option value={ANIMAL_STATUS.BULL}>{ANIMAL_STATUS.BULL}</option>
                        <option value={ANIMAL_STATUS.PREGNANT}>{ANIMAL_STATUS.PREGNANT}</option>
                        <option value={ANIMAL_STATUS.LACTATING}>{ANIMAL_STATUS.LACTATING}</option>
                        <option value={ANIMAL_STATUS.DRY}>{ANIMAL_STATUS.DRY}</option>
                    </Dropdown>

                    <Dropdown
                        label="Shed"
                        required
                        value={shedId}
                        onChange={(e) =>
                            setShedId(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
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
                </div>
            )}
        </Modal>
    );
}