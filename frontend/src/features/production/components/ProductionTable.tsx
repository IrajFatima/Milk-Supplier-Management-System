import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import Table from "../../../components/Table";
import type { TableColumn } from "../../../components/Table";
import type { Production } from "../../../types/production.types";
import { formatDate } from "../../../utils/FormatDate";
// import { ANIMAL_STATUS } from "../../../constants/animalStatus";

interface ProductionTableProps {
  productions: Production[];
  loading: boolean;
  role?: string;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onVoid: (id: number) => void;
}

export default function ProductionTable({ productions, loading, role, onView, onEdit, onVoid }: ProductionTableProps) {
  const canEdit = role === "Owner" || role === "Farm Worker";
  const canVoid = role === "Owner";

  const columns: TableColumn<Production>[] = [
    { key: "animalTagId", title: "Tag ID", render: (row) => row.animalTagId ?? "-" },
    { key: "animalName", title: "Animal", render: (row) => row.animalName ?? "-" },
    { key: "productionDate", title: "Production Date", render: (row) => formatDate(row.productionDate) },
    { key: "productionShift", title: "Shift" },
    { key: "quantityProduced", title: "Qty (L)" },
    { key: "facilityName", title: "Facility", render: (row) => row.facilityName ?? "-" },
    { key: "qualityStatus", title: "Quality" },
    { key: "status", title: "Status" },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onView(row.productionId)} title="View" className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white">
            <FiEye />
          </button>

          {row.status === "Active" && (
            <>
              {canEdit && (
                <button type="button" onClick={() => onEdit(row.productionId)} title="Edit" className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white">
                  <FiEdit />
                </button>
              )}

              {canVoid && (
                <button type="button" onClick={() => onVoid(row.productionId)} title="Void" className="rounded p-2 text-[var(--color-danger)] transition hover:bg-[var(--color-sidebar-hover)] hover:text-white">
                  <FiTrash2 />
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={productions} loading={loading} emptyMessage="No production records found." />;
}
