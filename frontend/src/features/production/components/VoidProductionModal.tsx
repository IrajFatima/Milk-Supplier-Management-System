import { useState } from "react";
import Modal from "../../../components/Modal";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { productionService } from "../../../services/production.service";

interface Props {
  isOpen: boolean;
  productionId: number | null;
  onClose: () => void;
  onConfirm: () => void; // called after successful void
}

export default function VoidProductionModal({ isOpen, productionId, onClose, onConfirm }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleVoid = async () => {
    if (!productionId) return;

    try {
      setSubmitting(true);
      await productionService.voidProduction(productionId);
      toast.success("Production record voided successfully.");
      onConfirm();
      onClose();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to void production record."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Void Production Record"
      onClose={onClose}
    
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded border px-4 py-2">Cancel</button>
          <button type="button" disabled={submitting} onClick={handleVoid} className="ml-2 rounded bg-[var(--color-danger)] px-4 py-2 text-white disabled:opacity-50">{submitting ? "Voiding..." : "Void Record"}</button>
        </>
      }
    >
      <p>Are you sure you want to void this production record? Voiding is irreversible and may affect inventory if the record was previously marked as Passed.</p>
    </Modal>
  );
}
