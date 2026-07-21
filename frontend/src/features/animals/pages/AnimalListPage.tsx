import { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRef } from "react";
import AnimalFilters from "../components/AnimalFilters";
import AnimalSearchBar from "../components/AnimalSearchBar";
import AnimalTable from "../components/AnimalTable";
import RelocateAnimalModal from "../components/RelocateAnimalModal";
import DeactivateAnimalModal from "../components/DeactivateAnimalModal";
import ReactivateAnimalModal from "../components/ReactivateAnimalModal";
import Pagination from "../../../components/Pagination";

import { animalService } from "../../../services/animal.service";

import { useAuth } from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";

import { ROLES } from "../../../constants/roles";

import type {
    AnimalFilters as AnimalFiltersType,
    AnimalListItem,
    ShedDropdown,
} from "../../../types/animal.types";
import ChangeAnimalStatusModal from "../components/ChangeAnimalStatusModal";

export default function AnimalListPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const latestRequest = useRef(0);


    const [animals, setAnimals] = useState<AnimalListItem[]>([]);
    const [sheds, setSheds] = useState<ShedDropdown[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search);

    const [filters, setFilters] = useState<AnimalFiltersType>({
        page: 1,
        limit: 10,
    });

    const [totalPages, setTotalPages] = useState(1);

    const [relocateAnimalId, setRelocateAnimalId] = useState<number | null>(null);
    const [changeAnimalStatusId, setChangeAnimalStatusId] = useState<number | null>(null);
    const [deactivateAnimalId, setDeactivateAnimalId] = useState<number | null>(
        null
    );
    const [reactivateAnimalId, setReactivateAnimalId] =
        useState<number | null>(null);

    const role = user?.role;

    const canCreate =
        role === ROLES.OWNER || role === ROLES.FARM_WORKER;

    const canEdit =
        role === ROLES.OWNER || role === ROLES.FARM_WORKER;

    const canRelocate =
        role === ROLES.OWNER || role === ROLES.FARM_WORKER;

    const canDeactivate =
        role === ROLES.OWNER;

    const loadAnimals = useCallback(async () => {
        const requestId = ++latestRequest.current;
        try {
            setLoading(true);

            const currentSearch = debouncedSearch;

            console.log("REQUEST", currentSearch);
            const response = await animalService.getAnimals({
                ...filters,
                search: debouncedSearch || undefined,
            });
            if (requestId !== latestRequest.current) {
                return;
            }
            console.log("RESPONSE", currentSearch, response.data.length);
            setAnimals(response.data);
            setTotalPages(response.totalPages);
        } catch {
            if (requestId !== latestRequest.current) {
                return;
            }
            toast.error("Failed to load animals.");
        } finally {
            if (requestId === latestRequest.current) {
                setLoading(false);
            }
        }
    }, [filters, debouncedSearch]);



    const loadSheds = useCallback(async () => {
        try {
            const response = await animalService.getSheds();
            console.log("data of sheds: ", response)
            setSheds(response);
        } catch {
            toast.error("Failed to load sheds.");
        }
    }, []);

    useEffect(() => {
        async function fetchAnimals() {
            await loadAnimals();
        }

        fetchAnimals();
    }, [loadAnimals]);

    useEffect(() => {
        async function fetchSheds() {
            await loadSheds();
        }

        fetchSheds();
    }, [loadSheds]);


    const handleFilterChange = (updatedFilters: AnimalFiltersType) => {
        setFilters(updatedFilters);
    };

    const handlePageChange = (page: number) => {
        setFilters((previous) => ({
            ...previous,
            page,
        }));
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: "var(--color-text)" }}
                    >
                        Animal Management
                    </h1>

                    {canCreate && (
                        <button
                            type="button"
                            onClick={() => navigate("/animals/create")}
                            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-white transition"
                            style={{
                                background: "var(--color-primary)",
                            }}
                        >
                            <FiPlus size={18} />
                            Add Animal
                        </button>
                    )}
                </div>

                <AnimalSearchBar
                    value={search}
                    onChange={(value) => {
                        setSearch(value);

                        setFilters((previous) => ({
                            ...previous,
                            page: 1,
                        }));
                    }}
                />

                <AnimalFilters
                    filters={filters}
                    sheds={sheds}
                    onChange={handleFilterChange}
                />

                <AnimalTable
                    animals={animals}
                    loading={loading}
                    canEdit={canEdit}
                    canRelocate={canRelocate}
                    canDeactivate={canDeactivate}
                    onView={(id) => navigate(`/animals/${id}`)}
                    onEdit={(id) => navigate(`/animals/${id}/edit`)}
                    onRelocate={(id) => setRelocateAnimalId(id)}
                    onDeactivate={(id) => setDeactivateAnimalId(id)}
                    onReactivate={(id) => setReactivateAnimalId(id)}
                    onChangeStatus={(id)=>setChangeAnimalStatusId(id)}
                />

                <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <RelocateAnimalModal
                isOpen={relocateAnimalId !== null}
                animalId={relocateAnimalId}
                onClose={() => setRelocateAnimalId(null)}
                onSuccess={loadAnimals}
            />

            <DeactivateAnimalModal
                isOpen={deactivateAnimalId !== null}
                animalId={deactivateAnimalId}
                onClose={() => setDeactivateAnimalId(null)}
                onSuccess={loadAnimals}
            />
            <ReactivateAnimalModal
                isOpen={reactivateAnimalId !== null}
                animalId={reactivateAnimalId}
                onClose={() => setReactivateAnimalId(null)}
                onSuccess={loadAnimals}
            />
            <ChangeAnimalStatusModal
                isOpen={changeAnimalStatusId !== null}
                animalId={changeAnimalStatusId}
                onClose={() => setChangeAnimalStatusId(null)}
                onSuccess={loadAnimals}
            />
        </>
    );
}