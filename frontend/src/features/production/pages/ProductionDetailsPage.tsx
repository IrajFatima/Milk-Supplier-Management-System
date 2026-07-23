import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import ProductionDetailCard from "../components/ProductionDetailCard";
import { productionService } from "../../../services/production.service";
import VoidProductionModal from "../components/VoidProductionModal";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../constants/roles";
import Spinner from "../../../components/Spinner";
import type { Production } from "../../../types/production.types";

export default function ProductionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [production, setProduction] = useState<Production | null>(null);
  const [loading, setLoading] = useState(true);
  const [voidId, setVoidId] = useState<number | null>(null);

  const { user } = useAuth();
  const role = user?.role;
  const canEdit = role === ROLES.OWNER || role === ROLES.FARM_WORKER;
  const canVoid = role === ROLES.OWNER;

  useEffect(() => {
    void (async () => {
      if (!id) return;
      try {
        const p = await productionService.getProductionById(Number(id));
        setProduction(p);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Failed to load production record."));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Spinner fullScreen />;
  if (!production) return <div>Production not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Production Details</h1>
        <div className="flex items-center gap-2">
          {canEdit && production.status === "Active" && (
            <button onClick={() => navigate(`/production/${production.productionId}/edit`)} className="rounded bg-[var(--color-primary)] px-4 py-2 text-white">Edit</button>
          )}

          {canVoid && production.status === "Active" && (
            <button onClick={() => setVoidId(production.productionId)} className="rounded bg-[var(--color-danger)] px-4 py-2 text-white">Void</button>
          )}
        </div>
      </div>

      <ProductionDetailCard production={production} />

      <VoidProductionModal isOpen={voidId !== null} productionId={voidId} onClose={() => setVoidId(null)} onConfirm={() => {
        // reload after void
        void (async () => {
          if (!id) return;
          try {
            const p = await productionService.getProductionById(Number(id));
            setProduction(p);
          } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Failed to refresh production record."));
          }
        })();
      }} />
    </div>
  );
}
