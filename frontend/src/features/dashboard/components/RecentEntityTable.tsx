import Table, { type TableColumn } from "../../../components/Table";

interface Props<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function RecentEntityTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found.",
}: Props<T>) {
  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage={emptyMessage}
    />
  );
}