import { useCallback, useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import ProductionFilters from "../components/ProductionFilters";
import ProductionSearchBar from "../components/ProductionSearchBar";
import ProductionTable from "../components/ProductionTable";
import VoidProductionModal from "../components/VoidProductionModal";
import Pagination from "../../../components/Pagination";

import { productionService } from "../../../services/production.service";
import { useAuth } from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import { ROLES } from "../../../constants/roles";

import type {
  ProductionFilters as ProductionFiltersType,
  PaginatedProduction,
  Production,
  ProductionAnimal,
} from "../../../types/production.types";

export default function ProductionListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const latestRequest = useRef(0);

  const [productions, setProductions] = useState<Production[]>([]);
  const [animals, setAnimals] = useState<ProductionAnimal[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [filters, setFilters] = useState<ProductionFiltersType>({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);
  const [voidId, setVoidId] = useState<number | null>(null);

  const role = user?.role;

  const canCreate = role === ROLES.OWNER || role === ROLES.FARM_WORKER;
  // const canVoid = role === ROLES.OWNER;

  const loadProductions = useCallback(async () => {
    const requestId = ++latestRequest.current;
    try {
      setLoading(true);
      const response: PaginatedProduction = await productionService.getProductions({
        ...filters,
        search: debouncedSearch || undefined,
      });

      if (requestId !== latestRequest.current) return;

      setProductions(response.data);
      setTotalPages(response.totalPages);
    } catch (error: unknown) {
      if (requestId !== latestRequest.current) return;
      toast.error(getApiErrorMessage(error, "Failed to load production records."));
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [filters, debouncedSearch]);

  const loadAnimals = useCallback(async () => {
    try {
      const data = await productionService.getProductionAnimals();
      setAnimals(data);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to load animals for filters."));
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await loadProductions();
    })();
  }, [loadProductions]);

  useEffect(() => {
    void (async () => {
      await loadAnimals();
    })();
  }, [loadAnimals]);

  const handleFilterChange = (updated: ProductionFiltersType) => {
    setFilters(updated);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          Milk Production
        </h1>

        {canCreate && (
          <button
            type="button"
            onClick={() => navigate("/production/create")}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-white transition"
            style={{ background: "var(--color-primary)" }}
          >
            <FiPlus size={18} />
            Add Production
          </button>
        )}
      </div>

      <ProductionSearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setFilters((prev) => ({ ...prev, page: 1 }));
        }}
      />

      <ProductionFilters filters={filters} animals={animals} onChange={handleFilterChange} />

      <ProductionTable
        productions={productions}
        loading={loading}
        role={role}
        onView={(id) => navigate(`/production/${id}`)}
        onEdit={(id) => navigate(`/production/${id}/edit`)}
        onVoid={setVoidId}
      />

      <Pagination currentPage={filters.page ? filters.page : 0} totalPages={totalPages} onPageChange={handlePageChange} />

      <VoidProductionModal
        isOpen={voidId !== null}
        productionId={voidId}
        onClose={() => setVoidId(null)}
        onConfirm={() => {
          void loadProductions();
        }}
      />
    </div>
  );
}
