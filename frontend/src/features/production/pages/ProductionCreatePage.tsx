import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import ProductionForm from "../components/ProductionForm";
import { productionService } from "../../../services/production.service";
import type { ProductionAnimal, StorageFacility,CreateProductionRequest } from "../../../types/production.types";

export default function ProductionCreatePage() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<ProductionAnimal[]>([]);
  const [facilities, setFacilities] = useState<StorageFacility[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const a = await productionService.getProductionAnimals();
        setAnimals(a);
        const f = await productionService.getStorageFacilities();
        setFacilities(f);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Failed to load form data."));
      }
    })();
  }, []);

  const handleSubmit = async (data: CreateProductionRequest) => {
    try {
      await productionService.createProduction(data);
      toast.success("Production record created.");
      navigate("/production");
    } catch {
      // handled in form
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Production</h1>
      <ProductionForm mode="create" animals={animals} facilities={facilities} onSubmit={handleSubmit} />
    </div>
  );
}
