import { useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../../components/Modal";

import { animalService } from "../../../services/animal.service";

interface DeactivateAnimalModalProps {
  isOpen: boolean;
  animalId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeactivateAnimalModal({
  isOpen,
  animalId,
  onClose,
  onSuccess,
}: DeactivateAnimalModalProps) {
  const [status, setStatus] = useState<"Sold" | "Deceased">("Sold");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!animalId) return;

    try {
      setSaving(true);

      await animalService.deactivateAnimal(animalId, {
        status,
      });

      toast.success("Animal updated successfully.");

      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to deactivate animal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Deactivate Animal"
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
            className="rounded-md bg-[var(--color-danger)] px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Confirm"}
          </button>
        </>
      }
    >
      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
        This action cannot be undone. Choose the final status for this animal.
      </p>

      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={status === "Sold"}
            onChange={() => setStatus("Sold")}
          />
          Sold
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={status === "Deceased"}
            onChange={() => setStatus("Deceased")}
          />
          Deceased
        </label>
      </div>
    </Modal>
  );
}