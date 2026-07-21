import { FiEdit, FiEye, FiMapPin, FiTrash2 } from "react-icons/fi";

import Table from "../../../components/Table";
import type { TableColumn } from "../../../components/Table";
import type { AnimalListItem } from "../../../types/animal.types";
import AnimalStatusBadge from "./AnimalStatusBadge";
import { ANIMAL_STATUS } from "../../../constants/animalStatus";

interface AnimalTableProps {
    animals: AnimalListItem[];
    loading: boolean;
    canEdit: boolean;
    canRelocate: boolean;
    canDeactivate: boolean;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onRelocate: (id: number) => void;
    onDeactivate: (id: number) => void;
}

export default function AnimalTable({
    animals,
    loading,
    canEdit,
    canRelocate,
    canDeactivate,
    onView,
    onEdit,
    onRelocate,
    onDeactivate,
}: AnimalTableProps) {
    const columns: TableColumn<AnimalListItem>[] = [
        {
            key: "tagId",
            title: "Tag ID",
        },
        {
            key: "name",
            title: "Name",
            render: (row) => row.name ?? "-",
        },
        {
            key: "species",
            title: "Species",
        },
        {
            key: "breed",
            title: "Breed",
        },
        {
            key: "operationalStatus",
            title: "Status",
            render: (row) => <AnimalStatusBadge status={row.operationalStatus} />,
        },
        {
            key: "shedName",
            title: "Shed",
            render: (row) => row.shedName ?? "-",
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => {
                const isInactive =
                    row.operationalStatus === ANIMAL_STATUS.SOLD ||
                    row.operationalStatus === ANIMAL_STATUS.DECEASED
                return (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onView(row.animalId)}
                            title="View"
                            className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                        >
                            <FiEye />
                        </button>

                        {!isInactive && canEdit && (
                            <button
                                type="button"
                                onClick={() => onEdit(row.animalId)}
                                title="Edit"
                                className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                            >
                                <FiEdit />
                            </button>
                        )}

                        {!isInactive && canRelocate && (
                            <button
                                type="button"
                                onClick={() => onRelocate(row.animalId)}
                                title="Relocate"
                                className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                            >
                                <FiMapPin />
                            </button>
                        )}

                        {!isInactive && canDeactivate && (
                            <button
                                type="button"
                                onClick={() => onDeactivate(row.animalId)}
                                title="Deactivate"
                                className="rounded p-2 text-[var(--color-danger)] transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                            >
                                <FiTrash2 />
                            </button>
                        )}
                    </div>
                );
            },
        }
    ];

    return (
        <Table
            columns={columns}
            data={animals}
            loading={loading}
            emptyMessage="No animals found."
        />
    );
}