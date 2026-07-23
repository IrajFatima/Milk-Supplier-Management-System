import { useState } from "react";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import Modal from "../../../components/Modal";
import Dropdown from "../../../components/Dropdown";

import { animalService } from "../../../services/animal.service";

import { ANIMAL_STATUS, type AnimalStatus } from "../../../constants/animalStatus";

interface ChangeAnimalStatusModalProps {
    isOpen: boolean;
    animalId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ChangeAnimalStatusModal({
    isOpen,
    animalId,
    onClose,
    onSuccess,
}: ChangeAnimalStatusModalProps) {
    const [status, setStatus] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleSubmit() {
        if (!animalId) return;

        if (!status) {
            toast.error("Please select a status.");
            return;
        }

        try {
            setSaving(true);

            await animalService.changeAnimalStatus(animalId, {
                operationalStatus: status as AnimalStatus,
            });

            toast.success("Animal status updated successfully.");

            onSuccess();
            onClose();
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Failed to update animal status."));
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Change Animal Status"
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
                        {saving ? "Updating..." : "Update"}
                    </button>
                </>
            }
        >
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
        </Modal>
    );
}
