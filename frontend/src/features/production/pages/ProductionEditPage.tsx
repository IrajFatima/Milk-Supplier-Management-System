import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import ProductionForm from "../components/ProductionForm";
import { productionService } from "../../../services/production.service";
import type { Production, ProductionAnimal, StorageFacility,UpdateProductionRequest } from "../../../types/production.types";
import Spinner from "../../../components/Spinner";

export default function ProductionEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [production, setProduction] = useState<Production | null>(null);
  const [animals, setAnimals] = useState<ProductionAnimal[]>([]);
  const [facilities, setFacilities] = useState<StorageFacility[]>([]);
  const [loading,setLoading] = useState<boolean>(true);

  useEffect(() => {
    void (async () => {
      if (!id) return;
      try {
        const p = await productionService.getProductionById(Number(id));
        setProduction(p);
        const a = await productionService.getProductionAnimals();
        setAnimals(a);
        const f = await productionService.getStorageFacilities();
        setFacilities(f);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Failed to load production record."));
      } finally{
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (data: UpdateProductionRequest) => {
    if (!id) return;
    try {
      await productionService.updateProduction(Number(id), data);
      toast.success("Production record updated.");
      navigate(`/production/${id}`);
    } catch {
      // handled in form
    }
  };
  if (loading) return <Spinner fullScreen />;
  if (!production) return <div className="mx-auto">No Production Found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Production</h1>
      <ProductionForm mode="edit" production={production} animals={animals} facilities={facilities} onSubmit={handleSubmit} />
    </div>
  );
}
